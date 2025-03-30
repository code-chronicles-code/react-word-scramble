export default function getRandomElement<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
