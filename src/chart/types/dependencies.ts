import { EventEmitter } from '~/modules/emitter'
import { SVGLineChartParameters } from '~/modules/parameters'

export interface Dependencies {
  parameters: SVGLineChartParameters
  emitter: EventEmitter
}
