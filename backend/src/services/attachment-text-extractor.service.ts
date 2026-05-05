import fs from 'node:fs/promises'
import path from 'node:path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import sharp from 'sharp'
import Tesseract from 'tesseract.js'
import * as XLSX from 'xlsx'
import { parse as parseCsv } from 'csv-parse/sync'

const TEXT_EXTENSIONS = new Set([
  '.txt',
  '.md',
  '.markdown',
  '.json',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.html',
  '.htm',
  '.xml',
  '.yml',
  '.yaml',
  '.log',
  '.ini',
  '.env',
  '.sql',
])

const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
  '.tif',
  '.tiff',
])

function inferExtension(filePath: string, originalName?: string) {
  const fileName = originalName || path.basename(filePath)
  return path.extname(fileName).toLowerCase()
}

function normalizeText(value: string) {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .trim()
}

function sanitizeMarkdownText(value: string) {
  const normalized = normalizeText(value)
  return normalized.length > 0 ? normalized : '(empty)'
}

function escapeMarkdownCell(value: unknown) {
  return String(value ?? '')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim()
}

function renderMarkdownTable(rows: unknown[][]) {
  const normalizedRows = rows
    .map((row) => row.map((cell) => escapeMarkdownCell(cell)))
    .filter((row) => row.some((cell) => cell.length > 0))

  if (normalizedRows.length === 0) {
    return '(empty table)'
  }

  const columnCount = Math.max(...normalizedRows.map((row) => row.length))
  const paddedRows = normalizedRows.map((row) => {
    const padded = [...row]
    while (padded.length < columnCount) {
      padded.push('')
    }
    return padded
  })

  const firstRow = paddedRows[0]
  const hasHeader = firstRow.some((cell) => cell.length > 0)
  const headers = hasHeader
    ? firstRow
    : Array.from({ length: columnCount }, (_, index) => `Column ${index + 1}`)
  const bodyRows = hasHeader ? paddedRows.slice(1) : paddedRows

  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...bodyRows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')
}

function buildMarkdownDocument(input: {
  originalName: string
  mimeType?: string
  kind: string
  body: string
}) {
  return [
    `# Extracted Attachment: ${input.originalName}`,
    '',
    `- Source type: ${input.kind}`,
    `- Original MIME type: ${input.mimeType || 'unknown'}`,
    '',
    input.body.trim(),
  ].join('\n')
}

async function extractUtf8Markdown(filePath: string, originalName: string, mimeType?: string) {
  const content = await fs.readFile(filePath, 'utf8')

  return buildMarkdownDocument({
    originalName,
    mimeType,
    kind: 'text',
    body: [
      '## Content',
      '',
      '```text',
      sanitizeMarkdownText(content),
      '```',
    ].join('\n'),
  })
}

async function extractPdfMarkdown(filePath: string, originalName: string, mimeType?: string) {
  const buffer = await fs.readFile(filePath)
  const result = await pdfParse(buffer)

  return buildMarkdownDocument({
    originalName,
    mimeType,
    kind: 'pdf',
    body: [
      '## Extracted Text',
      '',
      sanitizeMarkdownText(result.text),
    ].join('\n'),
  })
}

async function extractDocxMarkdown(filePath: string, originalName: string, mimeType?: string) {
  const result = await mammoth.extractRawText({ path: filePath })

  return buildMarkdownDocument({
    originalName,
    mimeType,
    kind: 'docx',
    body: [
      '## Extracted Text',
      '',
      sanitizeMarkdownText(result.value),
    ].join('\n'),
  })
}

async function extractCsvMarkdown(filePath: string, originalName: string, mimeType?: string) {
  const raw = await fs.readFile(filePath, 'utf8')
  const records = parseCsv(raw, {
    relax_column_count: true,
    skip_empty_lines: false,
  }) as unknown[][]

  return buildMarkdownDocument({
    originalName,
    mimeType,
    kind: 'csv',
    body: [
      '## Table',
      '',
      renderMarkdownTable(records),
    ].join('\n'),
  })
}

async function extractSpreadsheetMarkdown(filePath: string, originalName: string, mimeType?: string) {
  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
  })

  const sheets = workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: false,
    }) as unknown[][]

    return [
      `## Sheet: ${sheetName}`,
      '',
      renderMarkdownTable(rows),
    ].join('\n')
  })

  return buildMarkdownDocument({
    originalName,
    mimeType,
    kind: 'spreadsheet',
    body: sheets.length > 0 ? sheets.join('\n\n') : '## Sheet\n\n(empty workbook)',
  })
}

async function extractImageMarkdown(filePath: string, originalName: string, mimeType?: string) {
  const metadata = await sharp(filePath).metadata()
  const preprocessedBuffer = await sharp(filePath)
    .rotate()
    .grayscale()
    .normalize()
    .png()
    .toBuffer()

  let ocrText = ''

  try {
    const result = await Tesseract.recognize(preprocessedBuffer, 'eng')
    ocrText = result.data.text || ''
  } catch (error) {
    ocrText = `OCR failed: ${(error as Error).message}`
  }

  return buildMarkdownDocument({
    originalName,
    mimeType,
    kind: 'image',
    body: [
      '## Image Metadata',
      '',
      `- Format: ${metadata.format || 'unknown'}`,
      `- Width: ${metadata.width ?? 'unknown'}`,
      `- Height: ${metadata.height ?? 'unknown'}`,
      `- Pages/Frames: ${metadata.pages ?? 1}`,
      '',
      '## OCR Text',
      '',
      sanitizeMarkdownText(ocrText),
    ].join('\n'),
  })
}

export async function extractMarkdownFromFile(filePath: string, mimeType?: string, originalName?: string) {
  const fileName = originalName || path.basename(filePath)
  const extension = inferExtension(filePath, originalName)
  const normalizedMime = mimeType?.toLowerCase() || ''

  if (TEXT_EXTENSIONS.has(extension) || normalizedMime.startsWith('text/plain')) {
    return extractUtf8Markdown(filePath, fileName, mimeType)
  }

  if (extension === '.csv' || normalizedMime === 'text/csv') {
    return extractCsvMarkdown(filePath, fileName, mimeType)
  }

  if (extension === '.pdf' || normalizedMime === 'application/pdf') {
    return extractPdfMarkdown(filePath, fileName, mimeType)
  }

  if (
    extension === '.docx' ||
    normalizedMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractDocxMarkdown(filePath, fileName, mimeType)
  }

  if (
    extension === '.xlsx' ||
    extension === '.xls' ||
    normalizedMime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    normalizedMime === 'application/vnd.ms-excel'
  ) {
    return extractSpreadsheetMarkdown(filePath, fileName, mimeType)
  }

  if (IMAGE_EXTENSIONS.has(extension) || normalizedMime.startsWith('image/')) {
    return extractImageMarkdown(filePath, fileName, mimeType)
  }

  throw new Error(`Unsupported attachment type for markdown extraction: ${extension || normalizedMime || fileName}`)
}
