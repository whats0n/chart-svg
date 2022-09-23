import { Dataset } from '~/types/data'
import { SVGLineChart } from './chart'
import './style.css'

const getRandomColor = (alpha: number): string =>
  `rgba(${Array(4)
    .fill(null)
    .map((_, i) => (i < 3 ? Math.random() * 255 : alpha))
    .join(',')})`

const createDataset = (): Dataset => ({
  data: Array(5)
    .fill(null)
    .map((_, i) => ({
      x: (100 / 4) * i, // Math.random() * 100,
      y: Math.random() * 100,
    })),

  style: {
    strokeColor: getRandomColor(1),
    strokeWidth: 16,
    fill: getRandomColor(Math.random()),
  },
})

const chart = new SVGLineChart({
  datasets: [createDataset()],
})

chart.mount(document.querySelector('#app') as HTMLElement)
