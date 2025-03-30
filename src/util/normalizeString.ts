export default function normalizeString(s: string): string {
  return s.toUpperCase().trim().replaceAll(/\s+/g, " ");
}
