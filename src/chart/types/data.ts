import { PathStyle, PointStyle } from './style'
import { DeepPartial } from './utility'

export interface DataPoint<Additional = unknown> {
  x: number
  y: number
  additional?: Additional
}

export interface DatasetStyle {
  path: PathStyle
  point: PointStyle
  pointHover: PointStyle
  pointSelected: PointStyle
}

export interface Dataset {
  data: DataPoint[]
  style?: DeepPartial<DatasetStyle>
}
