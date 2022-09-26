import { EventEmitterParameters } from '~/modules/emitter'
import { Dataset } from '~/types/data'
import { Dependencies } from '~/types/dependencies'
import { createId } from '~/utilities/createId'
import { SVGLineChartDOM } from '../dom'
import { SVGLineChartMath } from '../math'
import { ArchitectDatasetPoint, ArchitectPath } from '../types'

interface DatasetDependencies extends Dependencies {
  math: SVGLineChartMath
  dom: SVGLineChartDOM
}

export class SVGLineChartDataset {
  public id: string = createId()

  public dom: {
    body: SVGGElement
    polyline: SVGPolylineElement
    polygon: SVGPolygonElement
    circles: SVGCircleElement[]
    style: HTMLStyleElement
  } = {
    body: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
    polyline: document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    ),
    polygon: document.createElementNS('http://www.w3.org/2000/svg', 'polygon'),
    circles: [],
    style: document.createElement('style'),
  }

  private get size(): number {
    return this.dependencies.parameters.resolvePointStyle(
      this.dataset.style?.point
    ).size
  }

  constructor(
    public dataset: Dataset,
    parameters: {
      id: string
      onSelect(
        circle: SVGCircleElement,
        parameters: EventEmitterParameters
      ): void
      onAnimationEnd(): void
    },
    private dependencies: DatasetDependencies
  ) {
    this.dom.body.dataset.svgLineChartDataset = this.id
    this.dom.polygon.setAttribute('clip-path', `url(#${parameters.id})`)

    this.dom.circles = this.dataset.data.map((value) => {
      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      )

      const getParameters = (): EventEmitterParameters => {
        const { top, left } = circle.getBoundingClientRect()

        return {
          position: { top, left },
          value,
        }
      }

      circle.addEventListener('mouseenter', () =>
        this.dependencies.emitter.emit('enter', getParameters())
      )

      circle.addEventListener('mouseleave', () =>
        this.dependencies.emitter.emit('leave', getParameters())
      )

      circle.addEventListener('click', () =>
        parameters.onSelect(circle, getParameters())
      )

      this.dom.polyline.addEventListener('animationend', (e) => {
        if (e.target === this.dom.polyline) parameters.onAnimationEnd()
      })

      return circle
    })

    this.setStyle()
  }

  private setStyle = (): this => {
    const pathStyle = this.dependencies.parameters.resolvePathStyle(
      this.dataset.style?.path
    )

    const pointStyle = this.dependencies.parameters.resolvePointStyle(
      this.dataset.style?.point
    )

    const pointHoverStyle = {
      ...pointStyle,
      ...(this.dataset.style?.pointHover || {}),
    }

    const pointSelectedStyle = {
      ...pointStyle,
      ...(this.dataset.style?.pointSelected || {}),
    }

    const style: {
      selector: string
      rules: Record<string, string | number>
    }[] = [
      {
        selector: 'polygon',
        rules: {
          fill: pathStyle.fill,
        },
      },
      {
        selector: 'polyline',
        rules: {
          'stroke-width': `${pathStyle.strokeWidth}px`,
          stroke: pathStyle.strokeColor,
          'stroke-linejoin': pathStyle.strokeLinejoin,
          'stroke-linecap': pathStyle.strokeLinecap,
          filter: `drop-shadow(${pathStyle.shadow})`,
        },
      },
      {
        selector: 'circle',
        rules: {
          'stroke-width': `${pointStyle.strokeWidth}px`,
          stroke: pointStyle.strokeColor,
          fill: pointStyle.fill,
          filter: `drop-shadow(${pointStyle.shadow})`,
        },
      },
      {
        selector: 'circle:hover',
        rules: {
          'stroke-width': `${pointHoverStyle.strokeWidth}px`,
          stroke: pointHoverStyle.strokeColor,
          fill: pointHoverStyle.fill,
          filter: `drop-shadow(${pointHoverStyle.shadow})`,
        },
      },
      {
        selector: 'circle.is-selected',
        rules: {
          'stroke-width': `${pointSelectedStyle.strokeWidth}px`,
          stroke: pointSelectedStyle.strokeColor,
          fill: pointSelectedStyle.fill,
          filter: `drop-shadow(${pointSelectedStyle.shadow})`,
        },
      },
    ]

    this.dom.style.innerHTML = style
      .map(({ selector, rules }) => {
        selector = `[data-svg-line-chart-dataset="${this.id}"] ${selector}`

        const cssRules = Object.entries(rules)
          .map(([rule, value]) => `${rule}:${value};`)
          .join('')

        return `${selector} {${cssRules}}`
      })
      .join('')

    return this
  }

  private setCirclePosition = (
    index: number,
    position: ArchitectDatasetPoint['point']
  ): this => {
    const circle = this.dom.circles[index]

    circle.setAttribute('cx', `${position.x}`)
    circle.setAttribute('cy', `${position.y}`)

    return this
  }

  private setCircleSize = (size: number): this => {
    this.dom.circles.forEach((circle) =>
      circle.setAttribute('r', `${size / 2}`)
    )

    return this
  }

  private getEndpoints = (
    first: ArchitectDatasetPoint,
    last: ArchitectDatasetPoint
  ): { start: string; end: string } => {
    const { endpoints } = this.dependencies.parameters.getMeta()

    const size = this.dependencies.dom.getSize()

    const start = endpoints.start
      ? [0, size.height]
      : [first.path.x, size.height]
    const end = endpoints.end
      ? [size.width, size.height]
      : [last.path.x, size.height]

    return {
      start: start.join(','),
      end: end.join(','),
    }
  }

  public setPosition = (): this => {
    const position = this.dependencies.math.getDatasetDetails(
      this.dependencies.dom.getSize(),
      this.dataset
    )

    const { end, start } = this.getEndpoints(
      position[0],
      position[position.length - 1]
    )

    const { fill, stroke } = position.reduce<
      Record<'fill' | 'stroke', ArchitectPath>
    >(
      (result, data, i) => {
        this.setCirclePosition(i, data.point).setCircleSize(this.size)

        result.fill.push([data.path.x, data.path.y])
        result.stroke.push([data.point.x, data.point.y])

        return result
      },
      { fill: [], stroke: [] }
    )

    this.dom.polygon.setAttribute(
      'points',
      [start, fill.join(' '), end].join(' ')
    )

    this.dom.polyline.setAttribute('points', stroke.join(' '))

    const lineLength = this.dom.polyline.getTotalLength()

    this.dom.polyline.style.strokeDasharray = `${lineLength}`
    this.dom.polyline.style.strokeDashoffset = `${lineLength}`

    return this
  }

  public mount = (): this => {
    document.head.appendChild(this.dom.style)

    this.dom.body.appendChild(this.dom.polygon)
    this.dom.body.appendChild(this.dom.polyline)
    this.dom.circles.forEach((circle) => this.dom.body.appendChild(circle))

    this.dependencies.dom.scene.appendChild(this.dom.body)

    return this
  }

  public unmount = (): void => {
    this.dom.style.parentNode?.removeChild(this.dom.style)
    this.dom.body.parentNode?.removeChild(this.dom.body)
  }
}
