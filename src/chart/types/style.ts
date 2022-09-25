interface BaseStyle {
  strokeWidth: number
  strokeColor: string
  fill: string
  shadow: string
}

export interface PathStyle extends BaseStyle {
  strokeLinejoin: string
  strokeLinecap: string
}

export interface PointStyle extends BaseStyle {
  size: number
}

export interface Style {
  path: PathStyle
  point: PointStyle
  pointHover: PointStyle
  pointSelected: PointStyle
}
