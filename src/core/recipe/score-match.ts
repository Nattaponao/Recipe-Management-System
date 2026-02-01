import { normalizeText } from '../text/normalize';

export function scoreMatch(text: string, keywords: string[]): number {
  const base = normalizeText(text);

  let score = 0;
  for (const k of keywords) {
    if (base.includes(normalizeText(k))) {
      score += 1;
    }
  }

  return score;
}
