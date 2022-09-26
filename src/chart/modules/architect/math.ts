import { DataPoint, Dataset } from '~/types/data'
import { Dependencies } from '~/types/dependencies'
import { Size } from '~/types/size'
import { ArchitectArea, ArchitectDatasetPoint, ArchitectSize } from './types'

export class SVGLineChartMath {
  private dependencies: Dependencies

  constructor(dependencies: Dependencies) {
    this.dependencies = dependencies
  }

  private getPadding = ({
    width,
    height,
  }: ArchitectSize): Record<keyof Size['padding'], number> => {
    const { padding } = this.dependencies.parameters.getSize()

    return {
      top: this.resolvePaddingBySize(padding.top, height),
      right: this.resolvePaddingBySize(padding.right, width),
      bottom: this.resolvePaddingBySize(padding.bottom, height),
      left: this.resolvePaddingBySize(padding.left, width),
    }
  }

  private resolvePaddingBySize = (
    padding: number | string,
    size: number
  ): number => {
    if (typeof padding === 'number') return padding

    if (typeof padding === 'string') {
      const paddingValue = parseFloat(padding)

      if (padding.endsWith('%')) {
        return paddingValue * (size / 100)
      } else {
        return paddingValue
      }
    }

    return 0
  }

  private getArea = ({ width, height }: ArchitectSize): ArchitectArea => {
    const padding = this.getPadding({ width, height })

    width = width - padding.left - padding.right
    height = height - padding.top - padding.bottom

    return {
      width,
      height,
      padding,
    }
  }

  private getPointPosition = ({
    size,
    strokeWidth,
    x,
    y,
  }: {
    size: ArchitectArea
    strokeWidth: number
    x: number
    y: number
  }): { x: number; y: number } => {
    const height = size.height - strokeWidth

    const width = size.width - strokeWidth

    return {
      x: (x / 100) * width + strokeWidth / 2 + size.padding.left,
      y: height - (y / 100) * height + strokeWidth / 2 + size.padding.top,
    }
  }

  private getPathPosition = ({
    size,
    strokeWidth,
    x,
    y,
  }: {
    size: ArchitectArea
    strokeWidth: number
    x: number
    y: number
  }): { x: number; y: number } => {
    const height = size.height - strokeWidth

    return {
      x: (x / 100) * size.width + size.padding.left,
      y: height - (y / 100) * height + strokeWidth / 2 + size.padding.top,
    }
  }

  public getDatasetDetails = (
    size: ArchitectSize,
    dataset: Dataset
  ): ArchitectDatasetPoint[] => {
    const { strokeWidth } = this.dependencies.parameters.resolvePathStyle(
      dataset.style?.path
    )

    const area = this.getArea(size)

    const points: ArchitectDatasetPoint[] =
      dataset.data.map<ArchitectDatasetPoint>((data) => ({
        point: this.getPointPosition({
          size: area,
          strokeWidth,
          x: data.x,
          y: data.y,
        }),
        path: this.getPathPosition({
          size: area,
          strokeWidth,
          x: data.x,
          y: data.y,
        }),
        value: data,
      }))

    return points
  }
}
