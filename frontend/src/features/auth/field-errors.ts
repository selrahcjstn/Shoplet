/**
 * The backend returns a flat list of messages such as "Password must contain at least one number".
 * This sorts them under the matching form field. Anything unmatched goes to `general`.
 */
export function splitFieldErrors<F extends string>(messages: string[], prefixes: Record<F, string[]>) {
  const fields: Partial<Record<F, string>> = {}
  const general: string[] = []

  for (const message of messages) {
    const lower = message.toLowerCase()
    const field = (Object.keys(prefixes) as F[]).find((name) =>
      prefixes[name].some((prefix) => lower.startsWith(prefix.toLowerCase())),
    )
    if (!field) general.push(message)
    else if (!fields[field]) fields[field] = message // show the first message per field
  }

  return { fields, general }
}
