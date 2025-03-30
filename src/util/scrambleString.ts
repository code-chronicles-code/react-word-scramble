import getRandomInt from "./getRandomInt";
import normalizeString from "./normalizeString";
import shuffle from "./shuffle";
import stripNonLetters from "./stripNonLetters";
import swap from "./swap";

const MAX_ATTEMPTS = 10;

export default function scrambleString(
  s: string,
  bannedWords: readonly string[],
): string {
  if (s !== normalizeString(s)) {
    throw new Error("Expected a normalized string!");
  }

  if (s.length <= 1) {
    return s;
  }

  for (let attempts = 0; attempts < MAX_ATTEMPTS; ++attempts) {
    // Count spaces separately so that we can make sure the scrambled string
    // starts and ends with non-spaces.
    let spaces = 0;
    const chars: string[] = [];
    for (const c of s) {
      if (c === " ") {
        ++spaces;
        continue;
      }
      chars.push(c);
    }

    // Grab the first and last characters from the non-spaces.
    const [first, last] = Array.from({ length: 2 }, () => {
      swap(chars, chars.length - 1, getRandomInt(0, chars.length));
      return chars.pop()!;
    });

    // Add back the spaces and shuffle.
    while (spaces > 0) {
      chars.push(" ");
      --spaces;
    }
    shuffle(chars);

    const candidate = first + chars.join("") + last;

    // Make sure we actually scramble the string.
    if (candidate === s) {
      continue;
    }

    // Avoid banned words, including across non-letter characters.
    // (We assume the banned words have stripped non-letter characters already.)
    if (bannedWords.some((word) => stripNonLetters(candidate).includes(word))) {
      continue;
    }

    return candidate;
  }

  throw new Error("Exceeded the maximum attempts!");
}
