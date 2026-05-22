export type FrontMatter = Record<string, unknown>;

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

  const unquoted = stripQuotes(trimmed);
  if (unquoted !== trimmed) {
    return unquoted.replace(/\\"/g, '"').replace(/\\'/g, "'");
  }

  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function parseYamlMap(block: string) {
  const root: Record<string, unknown> = {};
  const stack: Array<{ indent: number; value: Record<string, unknown> }> = [{ indent: -1, value: root }];

  for (const rawLine of block.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;
    const match = rawLine.match(/^(\s*)([^:]+):(?:\s*(.*))?$/);
    if (!match) continue;

    const indent = match[1].length;
    const key = stripQuotes(match[2]);
    const rawValue = match[3] ?? '';

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].value;
    if (rawValue.trim() === '') {
      const child: Record<string, unknown> = {};
      parent[key] = child;
      stack.push({ indent, value: child });
    } else {
      parent[key] = parseScalar(rawValue);
    }
  }

  return root;
}

export function parseFrontMatter(markdown: string): FrontMatter {
  markdown = markdown.replace(/^\uFEFF/, '');
  if (!markdown.startsWith('---')) {
    return {};
  }

  const end = markdown.indexOf('\n---', 3);
  if (end < 0) {
    return {};
  }

  return parseYamlMap(markdown.slice(3, end));
}

export function removeFrontMatter(markdown: string) {
  markdown = markdown.replace(/^\uFEFF/, '');
  if (!markdown.startsWith('---')) return markdown;
  const end = markdown.indexOf('\n---', 3);
  if (end < 0) return markdown;
  return markdown.slice(end + 4).trimStart();
}

function formatKey(key: string) {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : JSON.stringify(key);
}

function formatScalar(value: unknown) {
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (value === null) return 'null';
  const text = String(value);
  return /^[A-Za-z0-9_./-]+$/.test(text) ? text : JSON.stringify(text);
}

export function toYamlLines(key: string, value: unknown, indent = 0): string[] {
  const prefix = ' '.repeat(indent);
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, item]) => item !== undefined);
    if (entries.length === 0) return [];
    return [
      `${prefix}${formatKey(key)}:`,
      ...entries.flatMap(([childKey, childValue]) => toYamlLines(childKey, childValue, indent + 2)),
    ];
  }
  return [`${prefix}${formatKey(key)}: ${formatScalar(value)}`];
}
