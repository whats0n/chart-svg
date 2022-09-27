import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2015',
    lib: {
      entry: './src/chart/index.ts',
      name: 'SVGLineChart',
      fileName: 'simple-svg-line-chart',
      formats: ['es', 'umd'],
    },
  },
  resolve: {
    alias: {
      '~': './src/chart',
    },
  },
})
