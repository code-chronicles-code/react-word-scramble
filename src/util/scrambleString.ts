import shuffle from "./shuffle";

export default function scrambleString(s: string): string {
  const arr = [...s];
  shuffle(arr);
  return arr.join("");
}
