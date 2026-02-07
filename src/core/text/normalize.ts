export function normalizeText(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, '');
}
