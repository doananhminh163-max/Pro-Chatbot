import 'dotenv/config'

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const env = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: Number(getEnv('PORT', '8080')),
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  resetPasswordUrl: getEnv('RESET_PASSWORD_URL', 'http://localhost:5173/reset-password'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  googleClientId: getEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
  googleCallbackUrl: getEnv('GOOGLE_CALLBACK_URL'),
  smtpHost: getEnv('SMTP_HOST'),
  smtpPort: Number(getEnv('SMTP_PORT', '587')),
  smtpSecure: getEnv('SMTP_SECURE', 'false') === 'true',
  smtpUser: getEnv('SMTP_USER'),
  smtpPass: getEnv('SMTP_PASS'),
  smtpFrom: getEnv('SMTP_FROM', getEnv('SMTP_USER')),
  appName: getEnv('APP_NAME', 'Pro Chatbot'),
  geminiCliCommand: getEnv('GEMINI_CLI_COMMAND', 'gemini --model={model}'),
  opencodeCliCommand: getEnv('OPENCODE_CLI_COMMAND', 'opencode --model={model}'),
  cliTimeoutMs: Number(getEnv('CLI_TIMEOUT_MS', '0')),
  userDocsRoot: getEnv('USER_DOCS_ROOT', 'D:\\Projects\\user_docs'),
}

export const isProduction = env.nodeEnv === 'production'
