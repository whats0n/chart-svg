import { PathStyle } from './style'
import { DeepPartial } from './utility'

export interface DataPoint<Additional = unknown> {
  x: number
  y: number
  additional?: Additional
}

export interface Dataset {
  data: DataPoint[]
  style?: DeepPartial<PathStyle>
}
