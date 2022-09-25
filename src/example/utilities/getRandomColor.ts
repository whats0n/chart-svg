export const getRandomColor = (alpha: number): string =>
  `rgba(${Array(4)
    .fill(null)
    .map((_, i) => (i < 3 ? Math.random() * 255 : alpha))
    .join(',')})`
