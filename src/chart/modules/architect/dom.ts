import { Dependencies } from '~/types/dependencies'
import { SVGLineChartMath } from './math'
import { SVGLineChartDataset } from './partials/dataset'
import { ArchitectSize } from './types'

interface DOMDependencies extends Dependencies {
  math: SVGLineChartMath
}

interface DOMParameters {
  id: string
  container: HTMLElement
  onResize: () => unknown
}

export class SVGLineChartDOM {
  private isMounted: boolean = false

  private container: HTMLElement

  public wrapper: HTMLElement = document.createElement('div')

  public scene: SVGSVGElement = document.createElementNS(
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

  private datasets: SVGLineChartDataset[] = []

  constructor(
    private dependencies: DOMDependencies,
    { id, container, onResize }: DOMParameters
  ) {
    this.clipPath.id = id
    this.wrapper.classList.add('svg-line-chart', id)

    this.container = container
    this.mount()

    let { width, height } = this.wrapper.getBoundingClientRect()

    const resizeObserver = new ResizeObserver(() => {
      const rect = this.wrapper.getBoundingClientRect()

      if (rect.width === width && rect.height === height) return

      width = rect.width
      height = rect.height

      if (this.isMounted) onResize()
    })

    resizeObserver.observe(this.wrapper)
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

  public mount = (): this => {
    this.container.appendChild(this.wrapper)

    this.clipPath.appendChild(this.mask)
    this.defs.appendChild(this.clipPath)
    this.scene.appendChild(this.defs)
    this.wrapper.appendChild(this.scene)

    this.update()

    this.datasets.forEach((dataset) => dataset.setPosition())

    this.isMounted = true

    return this
  }

  public update = (): this => {
    const { width, height } = this.getSize()

    this.mask.setAttribute('width', `${width}`)
    this.mask.setAttribute('height', `${height}`)

    this.scene.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return this
  }

  public destroy = (): void => {
    this.isMounted = false
    this.wrapper.parentNode?.removeChild(this.wrapper)
  }
}
