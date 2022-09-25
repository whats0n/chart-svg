import { Dependencies } from '~/types/dependencies'
import { LinearGradientOptions } from '~/types/gradient'
import { createId } from '~/utilities/createId'
import { EventEmitterParameters } from '../emitter'
import {
  ArchitectDOMPoints,
  ArchitectPath,
  ArchitectPoint,
  ArchitectSize,
} from './types'

export class SVGLineChartDOM {
  private wrapper: HTMLElement = document.createElement('div')

  private scene: SVGSVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )

  private defs: SVGDefsElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'defs'
  )

  private clipPath: SVGClipPathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'clipPath'
  )

  private mask: SVGRectElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  )

  private points: ArchitectDOMPoints[] = []

  private polylines: SVGPolylineElement[] = []

  private polygons: SVGPolygonElement[] = []

  private selectedPoint?: SVGCircleElement

  private gradients: Map<
    string,
    SVGLinearGradientElement | SVGRadialGradientElement
  > = new Map()

  constructor(
    private dependencies: Dependencies,
    { id, onResize }: { id: string; onResize: () => unknown }
  ) {
    this.clipPath.id = createId()
    this.wrapper.classList.add('svg-line-chart', id)

    const resizeObserver = new ResizeObserver(() => {
      if (!this.dependencies.parameters.getMeta().responsive) return

      this.updateScene()

      onResize()
    })

    resizeObserver.observe(this.wrapper)
  }

  private createPartials = (): this => {
    this.polylines.forEach((polyline) =>
      polyline.parentNode?.removeChild(polyline)
    )

    this.polygons.forEach((polygon) => polygon.parentNode?.removeChild(polygon))

    this.points.forEach((points) => points.g.parentNode?.removeChild(points.g))

    const { polylines, polygons, points } = this.dependencies.parameters
      .getData()
      .reduce<{
        polylines: SVGPolylineElement[]
        polygons: SVGPolygonElement[]
        points: ArchitectDOMPoints[]
      }>(
        (result, dataset) => {
          const pointStyle = this.dependencies.parameters.resolvePointStyle(
            dataset.style?.point
          )

          const polyline = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'polyline'
          )

          const polygon = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'polygon'
          )

          const points = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'g'
          )

          polyline.classList.add('svg-line-chart-polyline')
          polygon.classList.add('svg-line-chart-polygon')
          points.classList.add('svg-line-chart-points')

          polygon.setAttribute('clip-path', `url(#${this.clipPath.id})`)

          polyline.addEventListener('animationend', () => {
            this.wrapper.classList.add('is-animated')
          })

          this.scene.appendChild(polygon)
          this.scene.appendChild(polyline)
          this.scene.appendChild(points)

          result.polylines.push(polyline)
          result.polygons.push(polygon)

          const circles = dataset.data.map((value) => {
            const point = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'circle'
            )

            point.setAttribute('r', `${pointStyle.size / 2}`)

            const getParameters = (): EventEmitterParameters => {
              const { top, left } = point.getBoundingClientRect()

              return {
                position: { top, left },
                value,
              }
            }

            point.addEventListener('mouseenter', () =>
              this.dependencies.emitter.emit('enter', getParameters())
            )

            point.addEventListener('mouseleave', () =>
              this.dependencies.emitter.emit('leave', getParameters())
            )

            point.addEventListener('click', () => {
              if (this.selectedPoint == point) return

              point.classList.add('is-selected')

              this.selectedPoint?.classList?.remove('is-selected')

              this.selectedPoint = point

              this.dependencies.emitter.emit('select', getParameters())
            })

            points.appendChild(point)

            return point
          })

          result.points.push({
            g: points,
            circles,
          })

          return result
        },
        { polylines: [], polygons: [], points: [] }
      )

    this.polylines = polylines
    this.polygons = polygons
    this.points = points

    return this
  }

  private updateScene = (): this => {
    const { width, height } = this.getSize()

    this.mask.setAttribute('width', `${width}`)
    this.mask.setAttribute('height', `${height}`)

    this.scene.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return this
  }

  private setPolyline = (
    index: number,
    points: ArchitectPoint[]
  ): SVGPolylineElement => {
    const path = points.map((point) => point.join(',')).join(' ')

    this.polylines[index].setAttribute('points', path)

    return this.polylines[index]
  }

  private setPolygon = (index: number, points: ArchitectPoint[]): this => {
    const path = points.map((point) => point.join(',')).join(' ')

    const { width, height } = this.getSize()
    const { endpoints } = this.dependencies.parameters.getMeta()

    const start = [endpoints.start ? 0 : points[0][0], height].join(',')

    const end = [
      endpoints.end ? width : points[points.length - 1][0],
      height,
    ].join(',')

    this.polygons[index].setAttribute('points', `${start} ${path} ${end}`)

    return this
  }

  private clearGradients = (): this => {
    this.gradients.forEach((gradient) =>
      gradient.parentNode?.removeChild(gradient)
    )
    this.gradients.clear()
    return this
  }

  private addLinearGradient = ({
    id,
    partials,
    rotate = 0,
    x1,
    x2,
    y1,
    y2,
  }: LinearGradientOptions): string => {
    const gradient = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'linearGradient'
    )

    gradient.id = id

    if (typeof rotate === 'number')
      gradient.setAttribute('gradientTransform', `rotate(${rotate})`)

    if (typeof x1 === 'number') gradient.setAttribute('x1', `${x1}%`)
    if (typeof x2 === 'number') gradient.setAttribute('x2', `${x2}%`)
    if (typeof y1 === 'number') gradient.setAttribute('y1', `${y1}%`)
    if (typeof y2 === 'number') gradient.setAttribute('y2', `${y2}%`)

    gradient.innerHTML = partials
      .map(
        ({ offset, color }) =>
          `<stop offset="${offset}" stop-color="${color}" />`
      )
      .join('')

    this.defs.appendChild(gradient)

    this.gradients.set(id, gradient)

    return id
  }

  private onDocumentClick = (e: Event): void => {
    if (
      !this.selectedPoint ||
      this.points.some(({ circles }) =>
        circles.some((circle) => circle === e.target)
      )
    )
      return

    this.selectedPoint.classList.remove('is-selected')

    this.selectedPoint = undefined

    this.dependencies.emitter.emit('select', null)
  }

  public getSize = (): ArchitectSize => {
    if (!this.dependencies.parameters.getMeta().responsive)
      return this.dependencies.parameters.getSize()

    const { width, height } = this.dependencies.parameters.getSize()

    const rect = this.wrapper.getBoundingClientRect()

    return {
      width: rect.width,
      height: (height / width) * rect.width,
    }
  }

  public mount = (container: HTMLElement): this => {
    container.appendChild(this.wrapper)

    this.clipPath.appendChild(this.mask)
    this.defs.appendChild(this.clipPath)
    this.scene.appendChild(this.defs)
    this.wrapper.appendChild(this.scene)

    this.updateScene().createPartials()

    this.dependencies.parameters
      .getLinearGradients()
      .forEach(this.addLinearGradient)

    document.removeEventListener('click', this.onDocumentClick)
    document.addEventListener('click', this.onDocumentClick)

    return this
  }

  public setPoints = (
    options: Record<'polygons' | 'polylines', ArchitectPath[]>
  ): this => {
    options.polygons.forEach((points, i) => {
      this.setPolygon(i, points)
    })

    options.polylines.forEach((points, i) => {
      const polyline = this.setPolyline(i, points)

      const lineLength = polyline.getTotalLength()

      polyline.style.strokeDasharray = `${lineLength}`
      polyline.style.strokeDashoffset = `${lineLength}`

      this.points[i].circles.forEach((point, index) => {
        point.setAttribute('cx', `${points[index][0]}`)
        point.setAttribute('cy', `${points[index][1]}`)
      })
    })

    return this
  }

  public update = (
    options: Record<'polygons' | 'polylines', ArchitectPath[]>
  ): this => {
    this.updateScene().createPartials().setPoints(options).clearGradients()

    this.dependencies.parameters
      .getLinearGradients()
      .forEach(this.addLinearGradient)

    return this
  }

  public destroy = (): void => {
    document.removeEventListener('click', this.onDocumentClick)
    this.wrapper.parentNode?.removeChild(this.wrapper)
  }
}
