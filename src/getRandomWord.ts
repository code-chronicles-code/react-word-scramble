import getRandomElement from "./util/getRandomElement";

const WORDS = ["hello", "world"] as const;

export default function getRandomWord(): string {
  return getRandomElement(WORDS);
}
