import { normalizeText } from './normalize';

export function tokenize(text: string): string[] {
  return normalizeText(text).split(/[,\n]/).filter(Boolean);
}
