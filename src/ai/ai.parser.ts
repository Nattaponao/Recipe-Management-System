export function safeParseAI(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid AI JSON');
  }
}
