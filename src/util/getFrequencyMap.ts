export default function getFrequencyMap(s: string): Record<string, number> {
  const res: Record<string, number> = {};
  for (const c of s) {
    res[c] = (res[c] ?? 0) + 1;
  }

  return res;
}
