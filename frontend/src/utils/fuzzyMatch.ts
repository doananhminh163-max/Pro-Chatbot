/**
 * Checks if a search query matches a given target string using fuzzy/flexible matching.
 * Returns true if the query is empty, if the query is a strict substring,
 * if the query without special characters is a substring,
 * or if all terms/words in the query are found anywhere in the target string.
 */
export function fuzzyMatch(target: string | undefined, query: string): boolean {
  if (!target) return !query.trim()
  
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true
  
  const normalizedTarget = target.toLowerCase()
  
  // 1. Strict substring matching
  if (normalizedTarget.includes(normalizedQuery)) return true
  
  // 2. Continuous alphanumeric matching (e.g., "gpt4o" matches "gpt-4o")
  const cleanQuery = normalizedQuery.replace(/[^a-z0-9]/g, '')
  const cleanTarget = normalizedTarget.replace(/[^a-z0-9]/g, '')
  if (cleanQuery && cleanTarget.includes(cleanQuery)) return true
  
  // 3. Multi-word/term matching (e.g., "gemini pro" matches "gemini-1.5-pro")
  const words = normalizedQuery.split(/[\s\-_/]+/).filter(Boolean)
  if (words.length > 0 && words.every((word) => normalizedTarget.includes(word))) return true
  
  return false
}
