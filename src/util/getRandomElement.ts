import getRandomInt from "./getRandomInt";

export default function getRandomElement<T>(array: readonly T[]): T {
  return array[getRandomInt(array.length)];
}
