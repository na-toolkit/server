export function escapeLikeString(raw: string): string {
  return raw?.replace(/[\\%_]/g, '\\$&') || '';
}

export function escapeLikeStringInBigquery(raw: string): string {
  return raw?.replace(/[\\%_]/g, (match) => `\\${match}`) || '';
}
