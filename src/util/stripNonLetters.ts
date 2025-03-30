export default function stripNonLetters(s: string): string {
  return s.replaceAll(/[^a-z]+/gi, "");
}
