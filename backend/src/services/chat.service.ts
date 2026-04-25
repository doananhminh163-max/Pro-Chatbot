import { SenderType } from '@prisma/client'
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { resolveSession } from './session.service.js'

export type ChatProvider = 'gemini' | 'opencode'
export type MemoryMode = 'session' | 'global' | 'hybrid'

interface SessionContextMessage {
  sender: SenderType
  content: string
}

interface UserPersonalization {
  aiTone?: string | null
  aiLanguage?: string | null
  aiResponseLength?: string | null
  customInstructions?: string | null
}

interface SendMessageInput {
  userId: string
  content: string
  sessionId?: string
  provider: ChatProvider
  model?: string
  memoryMode?: MemoryMode
  agent?: string
  attachmentIds?: string[]
}

interface CreateCliPromptInput {
  history: SessionContextMessage[]
  content: string
  model?: string
  memoryMode?: MemoryMode
  agent?: string
  personalization?: UserPersonalization
}

interface ExecuteCliInput {
  provider: ChatProvider
  prompt: string
  model?: string
  filePaths?: string[]
  cwd?: string
}

interface ResolvedCommand {
  executable: string
  args: string[]
  display: string
}

const MODEL_PLACEHOLDER = /\{\{\s*model\s*\}\}|\{model\}|\$MODEL/gi

function stripAnsi(value: string) {
  return value.replace(/\u001b\[[0-9;]*m/g, '')
}

function createCliPrompt({
  history,
  content,
  model,
  memoryMode,
  agent,
  personalization,
}: CreateCliPromptInput) {
  const historyBlock = history
    .map((item) => `${item.sender}: ${item.content}`)
    .join('\n\n')

  const tone = personalization?.aiTone || 'professional'
  const language = personalization?.aiLanguage || 'Vietnamese'
  const length = personalization?.aiResponseLength || 'balanced'
  const extra = personalization?.customInstructions || ''

  return [
    'You are a helpful AI assistant.',
    'Keep answers concise, practical, and action-oriented.',
    'CRITICAL SECURITY RULE: You are strictly forbidden from accessing, reading, or modifying the internal source code, configuration files (e.g., .env, package.json), or directories (e.g., backend/, frontend/) of this project.',
    'CRITICAL SECURITY RULE: You must ONLY analyze the specific files and documents provided by the user in this chat session.',
    `Agent profile: ${agent || 'general-assistant'}`,
    `Model hint: ${model || 'default'}`,
    `Memory mode: ${memoryMode || 'session'}`,
    `Preferred Tone: ${tone}`,
    `Response Length: ${length}`,
    extra ? `User custom instructions: ${extra}` : '',
    '',
    'Conversation history:',
    historyBlock || '(no previous messages)',
    '',
    'Latest user message:',
    content,
    '',
    `Reply in ${language} unless the user explicitly asks for another language.`,
  ].filter(line => line !== '').join('\n')
}

function providerToCommand(provider: ChatProvider) {
  return provider === 'gemini' ? env.geminiCliCommand : env.opencodeCliCommand
}

function tokenizeCommand(command: string) {
  const tokens = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)

  if (!tokens) {
    return []
  }

  return tokens.map((token) => token.replace(/^['"]|['"]$/g, ''))
}

function resolveCommand(provider: ChatProvider, prompt: string, model?: string): ResolvedCommand {
  const template = providerToCommand(provider).trim()

  if (!template) {
    throw new Error(`${provider} CLI command is empty`)
  }

  let command = template
  let modelPlaceholderUsed = false
  const hasModelPlaceholder = /\{\{\s*model\s*\}\}|\{model\}|\$MODEL/i.test(command)

  if (model && hasModelPlaceholder) {
    command = command.replace(MODEL_PLACEHOLDER, model)
    modelPlaceholderUsed = true
  }

  if (!model && hasModelPlaceholder) {
    command = command
      .replace(/\s--model(?:=|\s+)(\{\{\s*model\s*\}\}|\{model\}|\$MODEL)/gi, '')
      .replace(MODEL_PLACEHOLDER, '')
      .trim()
  }

  const parts = tokenizeCommand(command)

  if (parts.length === 0) {
    throw new Error(`${provider} CLI command is invalid: ${template}`)
  }

  const hasModelFlag = parts.some((part) => part === '--model' || part.startsWith('--model='))

  if (model && !hasModelFlag && !modelPlaceholderUsed) {
    parts.push('--model', model)
  }

  // Escape newlines to literal \n to prevent cmd.exe truncation on Windows
  const singleLinePrompt = prompt.replace(/\r?\n/g, '\\n')
  parts.push('--prompt', singleLinePrompt)

  return {
    executable: parts[0],
    args: parts.slice(1),
    display: [parts[0], ...parts.slice(1)].join(' '),
  }
}

async function executeCliCommand({ provider, prompt, model, filePaths, cwd }: ExecuteCliInput) {
  const command = resolveCommand(provider, prompt, model)

  return new Promise<string>((resolve, reject) => {
    let executable = command.executable
    let args = command.args

    if (process.platform === 'win32') {
      executable = 'powershell.exe'

      const promptArg = args[args.indexOf('--prompt') + 1]
      const modelIdx = args.indexOf('--model')
      const modelFlag = modelIdx !== -1 ? `${args[modelIdx]} '${args[modelIdx + 1]}'` : ''

      let psCommand = ''
      const targetCwd = cwd || process.cwd()

      // Thực hiện cd vào thư mục session trước, sau đó mới gọi CLI
      const cdCommand = `Set-Location -Path '${targetCwd.replace(/'/g, "''")}';`

      if (filePaths && filePaths.length > 0) {
        const paths = filePaths.map(p => `"${p}"`).join(', ')
        psCommand = `${cdCommand} Get-Content -Path ${paths} -Raw | ${command.executable} ${modelFlag} --prompt '${promptArg.replace(/'/g, "''")}'`
      } else {
        psCommand = `${cdCommand} ${command.executable} ${modelFlag} --prompt '${promptArg.replace(/'/g, "''")}'`
      }

      args = [
        '-NoProfile',
        '-Command',
        psCommand
      ]
    }

    const processEnv = { ...process.env };
    // Loại bỏ các biến môi trường có thể gây lộ thông tin dự án hoặc khiến CLI tự tìm project root
    delete processEnv.NODE_OPTIONS;
    delete processEnv.npm_config_prefix;

    const processHandle = spawn(executable, args, {
      shell: false,
      windowsHide: true,
      cwd: cwd || process.cwd(),
      env: processEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timeout = env.cliTimeoutMs > 0
      ? setTimeout(() => {
        timedOut = true
        processHandle.kill('SIGTERM')
      }, env.cliTimeoutMs)
      : null

    processHandle.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString()
    })

    processHandle.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString()
    })

    processHandle.on('error', (error) => {
      if (timeout) clearTimeout(timeout)
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new Error(`${provider} CLI not found. Checked command: ${command.display}`))
        return
      }

      reject(error)
    })

    processHandle.on('close', (code) => {
      if (timeout) clearTimeout(timeout)

      if (timedOut) {
        reject(new Error(`${provider} CLI timed out after ${env.cliTimeoutMs}ms`))
        return
      }

      const output = stripAnsi((stdout || '').trim())
      const errorOutput = stripAnsi((stderr || '').trim())

      if (code !== 0) {
        reject(new Error(errorOutput || output || `${provider} CLI exited with code ${code ?? 'unknown'}`))
        return
      }

      const resolvedOutput = output || errorOutput

      if (!resolvedOutput) {
        reject(new Error(`${provider} CLI returned empty output`))
        return
      }

      resolve(resolvedOutput)
    })
  })
}

async function generateReply(
  provider: ChatProvider,
  prompt: string,
  model?: string,
  filePaths?: string[],
  cwd?: string,
): Promise<{ reply: string; usedProvider: ChatProvider; fallbackUsed: boolean }> {
  const reply = await executeCliCommand({ provider, prompt, model, filePaths, cwd })
  return { reply, usedProvider: provider, fallbackUsed: false }
}

export async function sendMessage(input: SendMessageInput) {
  const rawContent = input.content.trim()
  const hasAttachments = input.attachmentIds && input.attachmentIds.length > 0

  // Mặc định prompt nếu trống và có file
  const content = rawContent || (hasAttachments ? 'đọc và tổng hợp lại' : '')

  if (!content) {
    throw new Error('Message content is required')
  }

  // Lấy info user để lấy personalization
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      aiTone: true,
      aiLanguage: true,
      aiResponseLength: true,
      customInstructions: true
    }
  })

  const session = await resolveSession(input.userId, input.sessionId, content)

  // 1. Luôn xác định và tạo thư mục session vật lý
  const sessionDir = path.join(env.userDocsRoot, input.userId, session.id)
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true })
  }

  // Lấy đường dẫn file nếu có
  let filePaths: string[] = []
  if (hasAttachments && input.attachmentIds) {
    // 2. Lấy danh sách tài liệu
    const docs = await prisma.document.findMany({
      where: {
        id: { in: input.attachmentIds },
        userId: input.userId
      }
    })

    for (const doc of docs) {
      const currentPath = doc.filePath
      const fileName = path.basename(currentPath)
      const newPath = path.join(sessionDir, fileName)

      if (currentPath !== newPath && fs.existsSync(currentPath)) {
        try {
          const sourceDir = path.dirname(currentPath)
          fs.renameSync(currentPath, newPath)

          // Cập nhật lại đường dẫn mới trong database
          await prisma.document.update({
            where: { id: doc.id },
            data: {
              sessionId: session.id,
              filePath: newPath
            }
          })
          filePaths.push(newPath)

          // Nếu thư mục cũ trống và không phải là thư mục gốc của user, hãy xóa nó
          if (path.basename(sourceDir) === 'general' && fs.readdirSync(sourceDir).length === 0) {
            fs.rmdirSync(sourceDir)
          }
        } catch (renameError) {
          console.error(`[chat.service] Failed to move file from ${currentPath} to ${newPath}`, renameError)
          filePaths.push(currentPath)
        }
      } else {
        // Nếu đã đúng chỗ thì chỉ cập nhật database sessionId (nếu cần)
        if (doc.sessionId !== session.id) {
          await prisma.document.update({
            where: { id: doc.id },
            data: { sessionId: session.id }
          })
        }
        filePaths.push(currentPath)
      }
    }
  }

  const userMessage = await prisma.message.create({
    data: {
      sessionId: session.id,
      sender: SenderType.USER,
      content,
      documents: hasAttachments && input.attachmentIds ? {
        connect: input.attachmentIds.map(id => ({ id }))
      } : undefined
    },
    include: {
      documents: true
    }
  })

  const recentMessages = await prisma.message.findMany({
    where: {
      sessionId: session.id,
    },
    take: 20,
    select: {
      sender: true,
      content: true,
    },
  })

  const prompt = createCliPrompt({
    history: recentMessages.reverse(),
    content,
    model: input.model,
    memoryMode: input.memoryMode,
    agent: input.agent,
    personalization: {
      aiTone: user?.aiTone,
      aiLanguage: user?.aiLanguage,
      aiResponseLength: user?.aiResponseLength,
      customInstructions: user?.customInstructions
    }
  })

  let assistantMessage = null as {
    id: string
    sessionId: string
    sender: SenderType
    content: string
  } | null

  let usedProvider: ChatProvider | null = null
  let fallbackUsed = false

  try {
    const generated = await generateReply(input.provider, prompt, input.model, filePaths, sessionDir)
    usedProvider = generated.usedProvider
    fallbackUsed = generated.fallbackUsed

    assistantMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: SenderType.AI,
        content: generated.reply,
      },
    })
  } catch (error) {
    assistantMessage = await prisma.message.create({
      data: {
        sessionId: session.id,
        sender: SenderType.SYSTEM,
        content: `CLI execution failed: ${(error as Error).message}`,
      },
    })
  }

  return {
    session: {
      id: session.id,
      title: session.title,
    },
    userMessage,
    assistantMessage,
    meta: {
      usedProvider,
      fallbackUsed,
      requestedProvider: input.provider,
      requestedModel: input.model || null,
    },
  }
}
