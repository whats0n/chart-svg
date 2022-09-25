import { getRandomData } from './getRandomData'
import { getRandomStyle } from './getRandomStyle'

export const getRandomDataset = (length: number = 5) => ({
  data: getRandomData(length),
  style: getRandomStyle(),
})
