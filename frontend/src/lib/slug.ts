/** "Maple & Co." -> "maple-co". Matches the backend rule: lowercase letters, numbers, single hyphens. */
export function slugify(text: string, maxLength = 180): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}

export const isSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
