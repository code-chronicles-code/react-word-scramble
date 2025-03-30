export default function pluralize(
  count: number,
  singularNoun: string,
  pluralNoun?: string,
): string {
  const noun = count === 1 ? singularNoun : (pluralNoun ?? singularNoun + "s");
  return `${count} ${noun}`;
}
