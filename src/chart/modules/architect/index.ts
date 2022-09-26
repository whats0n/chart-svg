import { Dependencies } from '~/types/dependencies'
import { EventEmitterParameters } from '../emitter'
import { SVGLineChartDOM } from './dom'
import { SVGLineChartMath } from './math'
import { SVGLineChartDataset } from './partials/dataset'

export class SVGLineChartArchitect {
  private dom: SVGLineChartDOM

  private math: SVGLineChartMath

  private datasets: SVGLineChartDataset[] = []

  private selected: {
    circle: SVGCircleElement | null
    parameters: EventEmitterParameters | null
  } = {
    circle: null,
    parameters: null,
  }

  constructor(
    container: HTMLElement,
    private id: string,
    public dependencies: Dependencies
  ) {
    this.math = new SVGLineChartMath(dependencies)
    this.dom = new SVGLineChartDOM(
      {
        ...dependencies,
        math: this.math,
      },
      {
        id,
        container,
        onResize: this.onResize,
      }
    )

    this.setDatasets()

    document.removeEventListener('click', this.onDocumentClick)
    document.addEventListener('click', this.onDocumentClick)
  }

  private onDocumentClick = (e: Event): void => {
    const target = e.target

    if (
      !this.selected.circle ||
      (target instanceof SVGCircleElement &&
        this.datasets.some((dataset) => dataset.dom.circles.includes(target)))
    )
      return

    this.selected.circle.classList.remove('is-selected')

    this.selected.circle = null
    this.selected.parameters = null

    this.dependencies.emitter.emit('select', null)
  }

  private onResize = () => {
    const { parameters, circle } = this.selected

    if (parameters && circle) {
      const { top, left } = circle.getBoundingClientRect()

      this.dependencies.emitter.emit('resize', {
        ...parameters,
        position: { top, left },
      })
    } else {
      this.dependencies.emitter.emit('resize', null)
    }

    if (!this.dependencies.parameters.getMeta().responsive) this.update()
  }

  public update = (): this => {
    this.dom.update()

    this.datasets.forEach((dataset) => dataset.setPosition())

    return this
  }

  public destroy = (): void => {
    this.datasets.forEach((dataset) => dataset.unmount())
    this.dom.destroy()
  }

  public setDatasets = (): this => {
    this.datasets.forEach((dataset) => dataset.unmount())

    this.datasets = this.dependencies.parameters.getData().map((dataset) =>
      new SVGLineChartDataset(
        dataset,
        {
          id: this.id,
          onSelect: (circle, parameters) => {
            if (circle === this.selected.circle) return
            this.selected.circle?.classList?.remove('is-selected')

            this.selected.circle = circle
            this.selected.parameters = parameters

            circle.classList.add('is-selected')

            this.dependencies.emitter.emit('select', parameters)
          },
          onAnimationEnd: () => {
            this.dom.wrapper.classList.add('is-animated')
          },
        },
        {
          ...this.dependencies,
          math: this.math,
          dom: this.dom,
        }
      )
        .mount()
        .setPosition()
    )

    return this
  }
}
