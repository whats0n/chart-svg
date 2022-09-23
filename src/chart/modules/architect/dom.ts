import { Dependencies } from '~/types/dependencies'
import { ArchitectPath, ArchitectSize } from './types'

export class SVGLineChartDOM {
  private wrapper: HTMLElement = document.createElement('div')

  private scene: SVGSVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )

  private polylines: SVGPolylineElement[] = []

  private polygons: SVGPolygonElement[] = []

  constructor(private dependencies: Dependencies) {}

  private createPartials = (): this => {
    this.polylines.forEach((path) => path.remove())

    this.polygons.forEach((path) => path.remove())

    const { polylines, polygons } = this.dependencies.parameters
      .getData()
      .reduce<{
        polylines: SVGPolylineElement[]
        polygons: SVGPolygonElement[]
      }>(
        (result, { style }) => {
          style = this.dependencies.parameters.resolvePathStyle(style)

          const polyline = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'polyline'
          )

          const polygon = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'polygon'
          )

          this.scene.appendChild(polygon)
          this.scene.appendChild(polyline)

          result.polylines.push(polyline)
          result.polygons.push(polygon)

          polyline.style.strokeWidth = `${style.strokeWidth}px`
          polyline.style.stroke = style.strokeColor
          polyline.style.fill = 'none'
          polyline.style.strokeLinejoin = 'round'
          polyline.style.strokeLinecap = 'round'

          polygon.style.stroke = 'none'
          polygon.style.fill = style.fill

          return result
        },
        { polylines: [], polygons: [] }
      )

    this.polylines = polylines
    this.polygons = polygons

    return this
  }

  private updateScene = (): this => {
    const { width, height } = this.getSize()

    this.scene.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return this
  }

  private setPolyline = (index: number, points: string): SVGPolylineElement => {
    this.polylines[index].setAttribute('points', points)

    return this.polylines[index]
  }

  private setPolygon = (index: number, points: string): this => {
    const { width, height } = this.getSize()

    const start = `0,${height}`
    const end = `${width},${height}`

    this.polygons[index].setAttribute('points', `${start} ${points} ${end}`)

    return this
  }

  public getSize = (): ArchitectSize => {
    const { width, height } = this.dependencies.parameters.getSize()

    const rect = this.wrapper.getBoundingClientRect()

    return {
      width: rect.width,
      height: (height / width) * rect.width,
    }
  }

  public mount = (container: HTMLElement): this => {
    container.appendChild(this.wrapper)

    this.wrapper.appendChild(this.scene)

    this.updateScene().createPartials()

    return this
  }

  public update = (
    options: Record<'polygons' | 'polylines', ArchitectPath[]>
  ): this => {
    options.polygons.forEach((points, i) => {
      const path = points.map((point) => point.join(',')).join(' ')

      this.setPolygon(i, path)
    })

    options.polylines.forEach((points, i) => {
      const path = points.map((point) => point.join(',')).join(' ')

      const polyline = this.setPolyline(i, path)

      const lineLength = polyline.getTotalLength()

      polyline.style.strokeDasharray = `${lineLength}`
      polyline.style.strokeDashoffset = `${lineLength}`
    })

    return this
  }
}
