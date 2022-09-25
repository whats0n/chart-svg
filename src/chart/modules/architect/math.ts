import { Dependencies } from '~/types/dependencies'
import { Padding, Size } from '~/types/size'
import {
  ArchitectArea,
  ArchitectPath,
  ArchitectPoint,
  ArchitectSize,
} from './types'

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

  public getPolylines = ({ width, height }: ArchitectSize): ArchitectPath[] => {
    const area = this.getArea({ width, height })

    return this.dependencies.parameters
      .getData()
      .map<ArchitectPath>((dataset) => {
        return dataset.data.map(({ x, y }) => {
          const style = this.dependencies.parameters.resolvePathStyle(
            dataset.style?.path
          )

          const height = area.height - style.strokeWidth

          const positionY =
            height -
            (y / 100) * height +
            style.strokeWidth / 2 +
            area.padding.top

          const width = area.width - style.strokeWidth

          const positionX =
            (x / 100) * width + style.strokeWidth / 2 + area.padding.left

          const result: ArchitectPoint = [positionX, positionY]

          return result
        })
      })
  }

  public getPolygons = ({ width, height }: ArchitectSize): ArchitectPath[] => {
    const area = this.getArea({ width, height })

    return this.dependencies.parameters
      .getData()
      .map<ArchitectPath>((dataset) => {
        return dataset.data.map(({ x, y }) => {
          const style = this.dependencies.parameters.resolvePathStyle(
            dataset.style?.path
          )

          const height = area.height - style.strokeWidth

          const positionY =
            height -
            (y / 100) * height +
            style.strokeWidth / 2 +
            area.padding.top

          const result: ArchitectPoint = [
            (x / 100) * area.width + area.padding.left,
            positionY,
          ]

          return result
        })
      })
  }
}
