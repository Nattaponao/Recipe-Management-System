import { normalizeText } from '../text/normalize';

export function filterByKeyword<T extends { name: string }>(
  items: T[],
  keyword: string,
): T[] {
  const q = normalizeText(keyword);

  return items.filter((item) => normalizeText(item.name).includes(q));
}
