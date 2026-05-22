export type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'code'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; alignments: TableAlignment[]; rows: string[][] }

export type TableAlignment = 'left' | 'center' | 'right' | 'default'

function flushParagraph(blocks: MarkdownBlock[], lines: string[]) {
  if (lines.length === 0) return
  blocks.push({ type: 'paragraph', text: lines.join(' ').trim() })
  lines.splice(0)
}

function splitTableRow(line: string) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split(/(?<!\\)\|/).map((cell) => cell.replace(/\\\|/g, '|').trim())
}

function tableDividerAlignments(line: string): TableAlignment[] | null {
  const cells = splitTableRow(line)
  if (cells.length < 2) return null

  const alignments = cells.map((cell): TableAlignment | null => {
    if (!/^:?-{3,}:?$/.test(cell.trim())) return null
    if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
    if (cell.endsWith(':')) return 'right'
    if (cell.startsWith(':')) return 'left'
    return 'default'
  })

  return alignments.every(Boolean) ? alignments as TableAlignment[] : null
}

function isTableRow(line: string) {
  return line.trim().includes('|') && splitTableRow(line).length > 1
}

function normalizeCells<T>(cells: T[], width: number, fallback: T) {
  return Array.from({ length: width }, (_, index) => cells[index] ?? fallback)
}

export function parseMarkdown(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let codeLines: string[] | null = null

  const flushList = () => {
    if (!list) return
    blocks.push({ type: 'list', ordered: list.ordered, items: list.items })
    list = null
  }

  const lines = text.replace(/\r\n/g, '\n').split('\n')

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex]
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      if (codeLines) {
        blocks.push({ type: 'code', text: codeLines.join('\n') })
        codeLines = null
      } else {
        flushParagraph(blocks, paragraph)
        flushList()
        codeLines = []
      }
      continue
    }

    if (codeLines) {
      codeLines.push(line)
      continue
    }

    if (!trimmed) {
      flushParagraph(blocks, paragraph)
      flushList()
      continue
    }

    const nextLine = lines[lineIndex + 1]?.trimEnd() ?? ''
    const dividerAlignments = tableDividerAlignments(nextLine)
    if (isTableRow(trimmed) && dividerAlignments) {
      flushParagraph(blocks, paragraph)
      flushList()

      const headers = splitTableRow(trimmed)
      const width = Math.max(headers.length, dividerAlignments.length)
      const rows: string[][] = []
      lineIndex += 2

      while (lineIndex < lines.length) {
        const rowLine = lines[lineIndex].trimEnd()
        if (!rowLine.trim() || !isTableRow(rowLine)) {
          lineIndex -= 1
          break
        }
        rows.push(normalizeCells(splitTableRow(rowLine), width, ''))
        lineIndex += 1
      }

      if (lineIndex >= lines.length) {
        lineIndex = lines.length
      }

      blocks.push({
        type: 'table',
        headers: normalizeCells(headers, width, ''),
        alignments: normalizeCells(dividerAlignments, width, 'default'),
        rows,
      })
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph(blocks, paragraph)
      flushList()
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      continue
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/)
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (unordered || ordered) {
      flushParagraph(blocks, paragraph)
      const item = unordered?.[1] ?? ordered?.[1] ?? ''
      const orderedList = !!ordered
      if (!list || list.ordered !== orderedList) {
        flushList()
        list = { ordered: orderedList, items: [] }
      }
      list.items.push(item)
      continue
    }

    const quote = trimmed.match(/^>\s?(.+)$/)
    if (quote) {
      flushParagraph(blocks, paragraph)
      flushList()
      blocks.push({ type: 'quote', text: quote[1] })
      continue
    }

    paragraph.push(trimmed)
  }

  flushParagraph(blocks, paragraph)
  flushList()
  if (codeLines) blocks.push({ type: 'code', text: codeLines.join('\n') })

  return blocks
}
