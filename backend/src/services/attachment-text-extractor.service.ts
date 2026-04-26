import fs from 'node:fs/promises'
import path from 'node:path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import * as XLSX from 'xlsx'

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
  '.csv',
  '.log',
  '.ini',
  '.env',
  '.sql',
])

function inferExtension(filePath: string, originalName?: string) {
  const fileName = originalName || path.basename(filePath)
  return path.extname(fileName).toLowerCase()
}

async function readUtf8File(filePath: string) {
  return fs.readFile(filePath, 'utf8')
}

async function extractPdfText(filePath: string) {
  const buffer = await fs.readFile(filePath)
  const result = await pdfParse(buffer)
  return result.text
}

async function extractDocxText(filePath: string) {
  const result = await mammoth.extractRawText({ path: filePath })
  return result.value
}

async function extractSpreadsheetText(filePath: string) {
  const workbook = XLSX.readFile(filePath)

  return workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(worksheet).trim()
    return `## Sheet: ${sheetName}\n${csv || '(empty sheet)'}`
  }).join('\n\n')
}

export async function extractTextFromFile(filePath: string, mimeType?: string, originalName?: string) {
  const extension = inferExtension(filePath, originalName)
  const normalizedMime = mimeType?.toLowerCase() || ''

  if (TEXT_EXTENSIONS.has(extension) || normalizedMime.startsWith('text/')) {
    return readUtf8File(filePath)
  }

  if (extension === '.pdf' || normalizedMime === 'application/pdf') {
    return extractPdfText(filePath)
  }

  if (
    extension === '.docx' ||
    normalizedMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractDocxText(filePath)
  }

  if (
    extension === '.xlsx' ||
    extension === '.xls' ||
    normalizedMime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    normalizedMime === 'application/vnd.ms-excel'
  ) {
    return extractSpreadsheetText(filePath)
  }

  return null
}
