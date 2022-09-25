import { getRandomColor } from './getRandomColor'

export const getRandomPathStyle = () => ({
  strokeColor: getRandomColor(1),
  strokeWidth: Math.round(Math.random() * 16),
  shadow: `0 3px 3px ${getRandomColor(Math.random())}`,
  fill: getRandomColor(Math.random()),
})

export const getRandomPointStyle = () => ({
  size: Math.round(Math.random() * 24),
  fill: getRandomColor(1),
  shadow: `0 3px 3px ${getRandomColor(Math.random())}`,
})

export const getRandomStyle = () => ({
  path: getRandomPathStyle(),
  point: getRandomPointStyle(),
  pointHover: getRandomPointStyle(),
  pointSelected: getRandomPointStyle(),
})
