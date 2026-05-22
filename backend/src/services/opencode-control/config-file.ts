import { readText, pathExists } from './utils.js';

export function stripJsonComments(input: string) {
  let output = '';
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      output += char;
      continue;
    }

    if (char === '/' && next === '/') {
      while (index < input.length && input[index] !== '\n') {
        index += 1;
      }
      output += '\n';
      continue;
    }

    if (char === '/' && next === '*') {
      index += 2;
      while (index < input.length && !(input[index] === '*' && input[index + 1] === '/')) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += char;
  }

  return output.replace(/,\s*([}\]])/g, '$1');
}

export function parseJsonc(input: string) {
  return JSON.parse(stripJsonComments(input));
}

export async function readJsonc(targetPath: string) {
  if (!await pathExists(targetPath)) {
    return {};
  }
  const content = await readText(targetPath);
  if (!content.trim()) {
    return {};
  }
  return parseJsonc(content);
}

export function stringifyConfig(config: unknown) {
  return `${JSON.stringify(config, null, 2)}\n`;
}
