import { DataPoint } from '~/types/data'
import { Padding, Size } from '~/types/size'

export type ArchitectPoint = [number, number]

export type ArchitectPath = ArchitectPoint[]

export interface ArchitectSize {
  width: number
  height: number
}

export interface ArchitectSizeStrategy {
  (): ArchitectSize
}

export type ArchitectArea = Pick<Size, 'width' | 'height'> &
  Record<'padding', Record<keyof Padding, number>>

export interface ArchitectDOMPoints {
  g: SVGGElement
  circles: SVGCircleElement[]
}

export interface ArchitectDatasetPoint {
  point: { x: number; y: number }
  path: { x: number; y: number }
  value: DataPoint
}
