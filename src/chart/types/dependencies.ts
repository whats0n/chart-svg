import { EventEmitter } from '~/modules/emitter'
import { SVGLineChartGradient } from '~/modules/gradient'
import { SVGLineChartParameters } from '~/modules/parameters'

export interface Dependencies {
  parameters: SVGLineChartParameters
  emitter: EventEmitter
  gradient: SVGLineChartGradient
}
