import { SVGLineChart } from './chart'
import { getRandomColor } from './example/utilities/getRandomColor'
import { getRandomData } from './example/utilities/getRandomData'
import { getRandomDataset } from './example/utilities/getRandomDataset'
import './style.css'

const apps = ['#app', '#app2']

const charts = apps.map((id) => {
  const chart = new SVGLineChart({
    responsive: false,
    endpoints: false,
    size: {
      width: 1000,
      height: 400,
      padding: {
        top: 24,
        left: '40',
        right: '5%',
        bottom: '2%',
      },
    },
    datasets: [
      {
        data: [0, 24, 6, 100, 100].map((y, i) => ({
          y,
          x: (100 / 4) * i,
          additional: id + '_graph-1',
        })),
        style: {
          path: {
            strokeWidth: 16,
            strokeColor: `url(#linear-gradient-1)`,
            shadow: '0 3px 3px rgba(149, 76, 233, 0.3)',
            fill: `url(#linear-gradient-2)`,
          },
          point: {
            size: 24,
            fill: `black`,
            shadow: '0 3px 3px rgba(149, 76, 233, 0.13)',
          },
          pointHover: {
            fill: `orange`,
          },
          pointSelected: {
            fill: `yellow`,
          },
        },
      },
      {
        data: getRandomData(5).map((point) => ({
          ...point,
          additional: id + '_graph-2',
        })),
        style: {
          path: {
            strokeWidth: 16,
            strokeColor: `url(#linear-gradient-3)`,
            shadow: '0 3px 3px rgba(0, 213, 189, 0.3)',
            fill: `url(#linear-gradient-4)`,
          },
          point: {
            size: 24,
            fill: `black`,
            shadow: '0 3px 3px rgba(149, 76, 233, 0.13)',
          },
          pointHover: {
            fill: getRandomColor(1),
          },
          pointSelected: {
            fill: getRandomColor(1),
          },
        },
      },
    ],
    linearGradients: [
      {
        id: 'linear-gradient-1',
        partials: [
          { offset: '0', color: '#954ce9' },
          { offset: '0.3', color: '#954ce9' },
          { offset: '0.6', color: '#24c1ed' },
          { offset: '1', color: '#24c1ed' },
        ],
      },
      {
        id: 'linear-gradient-2',
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 100,
        partials: [
          { offset: '0', color: 'rgba(149, 76, 233, 0.07)' },
          { offset: '0.5', color: 'rgba(149, 76, 233, 0.13)' },
          { offset: '1', color: 'rgba(149, 76, 233, 0)' },
        ],
      },
      {
        id: 'linear-gradient-3',
        partials: [
          { offset: '0', color: '#00d5bd' },
          { offset: '1', color: '#24c1ed' },
        ],
      },
      {
        id: 'linear-gradient-4',
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 100,
        partials: [
          { offset: '0', color: 'rgba(0, 213, 189, 0.07)' },
          { offset: '0.5', color: 'rgba(0, 213, 189, 0.13)' },
          { offset: '1', color: 'rgba(0, 213, 189, 0)' },
        ],
      },
    ],
  })

  chart.mount(document.querySelector(id) as HTMLElement)

  chart.addEventListener('enter', console.log.bind(null, id, 'enter'))
  chart.addEventListener('leave', console.log.bind(null, id, 'leave'))
  chart.addEventListener('select', console.log.bind(null, id, 'select'))

  return chart
})

document.querySelector('.js-data')?.addEventListener('click', (e) => {
  e.preventDefault()

  charts.forEach((chart) => {
    chart.setDatasets([getRandomDataset(7), getRandomDataset(7)])
  })
})

document.querySelector('.js-parameters')?.addEventListener('click', (e) => {
  e.preventDefault()

  charts.forEach((chart) => {
    chart.setParameters({
      responsive: Math.random() > 0.5,
      endpoints: { start: Math.random() > 0.5, end: Math.random() > 0.5 },
      size: {
        width: 500 + Math.round(Math.random() * 500),
        height: 200 + Math.round(Math.random() * 200),
        padding: {
          top: Math.round(Math.random() * 50),
          left: Math.round(Math.random() * 50),
          right: Math.round(Math.random() * 50),
          bottom: `${Math.round(Math.random() * 10)}%`,
        },
      },
    })
  })
})
