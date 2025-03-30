import getRandomInt from "./getRandomInt";
import swap from "./swap";

export default function shuffle<T>(array: T[]): void {
  for (let len = array.length; len > 0; --len) {
    swap(array, len - 1, getRandomInt(len));
  }
}
