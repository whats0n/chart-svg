import { Dependencies } from '~/types/dependencies'
import { ArchitectPath, ArchitectPoint, ArchitectSize } from './types'

export class SVGLineChartMath {
  private dependencies: Dependencies

  constructor(dependencies: Dependencies) {
    this.dependencies = dependencies
  }

  public getPolylines = ({ width, height }: ArchitectSize): ArchitectPath[] => {
    return this.dependencies.parameters
      .getData()
      .map<ArchitectPath>(({ data, style }) => {
        return data.map(({ x, y }) => {
          style = this.dependencies.parameters.resolvePathStyle(style)

          const result: ArchitectPoint = [
            (x = (x / 100) * (width - style.strokeWidth)) +
              style.strokeWidth / 2,
            (y = (y / 100) * (height - style.strokeWidth)) +
              style.strokeWidth / 2,
          ]

          return result
        })
      })
  }

  public getPolygons = ({ width, height }: ArchitectSize): ArchitectPath[] => {
    return this.dependencies.parameters
      .getData()
      .map<ArchitectPath>(({ data, style }) => {
        return data.map(({ x, y }) => {
          style = this.dependencies.parameters.resolvePathStyle(style)

          const result: ArchitectPoint = [
            (x = (x / 100) * width),
            (y = (y / 100) * (height - style.strokeWidth)) +
              style.strokeWidth / 2,
          ]

          return result
        })
      })
  }
}
