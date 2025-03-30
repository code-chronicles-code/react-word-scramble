import shuffle from "./shuffle";

const MAX_ATTEMPTS = 10;

export default function scrambleString(
  s: string,
  bannedWords: readonly string[],
): string {
  const arr = [...s];

  for (let attempts = 0; attempts < MAX_ATTEMPTS; ++attempts) {
    shuffle(arr);
    const candidate = arr.join("");

    // Actually scramble the string.
    if (candidate === s) {
      continue;
    }

    // Avoid banned words.
    if (bannedWords.some((word) => candidate.includes(word))) {
      continue;
    }

    return candidate;
  }

  throw new Error("Exceeded the maximum attempts!");
}
