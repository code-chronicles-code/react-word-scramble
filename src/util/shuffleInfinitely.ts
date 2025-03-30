import getRandomInt from "./getRandomInt";
import swap from "./swap";

function* permuteInfinitely(n: number): Generator<number, never, never> {
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error(`Expected a positive integer size, got ${n}.`);
  }

  // Special case for a permutation of size 1.
  if (n === 1) {
    while (true) {
      yield 0;
    }
  }

  // Sparse array for lazy pre-computation.
  const permutation = Array(n);
  let isFirstIteration = true;

  while (true) {
    for (let len = n; len > 0; --len) {
      const index = getRandomInt(
        // At the end of an iteration, the last pick will be at index 0 of the permutation.
        // We prevent picking it again right away.
        !isFirstIteration && len === n ? 1 : 0,
        len,
      );

      // Set some defaults since we used a sparse array.
      permutation[len - 1] ??= len - 1;
      permutation[index] ??= index;

      // Swap to the end of the permutation and yield.
      swap(permutation, len - 1, index);
      yield permutation[len - 1];
    }

    isFirstIteration = false;
  }
}

export default function shuffleInfinitely<T>(array: readonly T[]): () => T {
  const indexGenerator = permuteInfinitely(array.length);
  return () => array[indexGenerator.next().value];
}
