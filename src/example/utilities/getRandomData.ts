export const getRandomData = (length: number): { x: number; y: number }[] =>
  Array(length)
    .fill(null)
    .map((_, i) => ({
      x: (100 / (length - 1)) * i, // Math.random() * 100,
      y: Math.random() * 100,
    }))
