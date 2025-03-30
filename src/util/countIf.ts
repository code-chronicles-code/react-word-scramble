export default function countIf<T>(
  array: readonly T[],
  predicate: (elem: T) => boolean,
): number {
  let res = 0;
  for (const elem of array) {
    if (predicate(elem)) {
      ++res;
    }
  }

  return res;
}
