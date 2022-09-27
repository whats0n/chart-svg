import { SVGLineChartArchitect } from './modules/architect'
import { SVGLineChartDesigner } from './modules/designer'
import { EventEmitter } from './modules/emitter'
import { SVGLineChartGradient as Gradient } from './modules/gradient'
import { SVGLineChartParameters } from './modules/parameters'
import { Parameters } from './modules/parameters/types'
import { Dataset } from './types/data'
import { createId } from './utility/createId'

export const SVGLineChartGradient = Gradient

export class SVGLineChart {
  public static instances: SVGLineChart[] = []

  public isDestroyed: boolean = false

  private id: string = createId()

  private parameters: SVGLineChartParameters

  private emitter: EventEmitter = new EventEmitter()

  private architect: SVGLineChartArchitect

  constructor(public container: HTMLElement, parameters: Parameters) {
    this.parameters = new SVGLineChartParameters(parameters)

    this.architect = new SVGLineChartArchitect(container, this.id, {
      parameters: this.parameters,
      emitter: this.emitter,
      gradient: SVGLineChartGradient,
    })

    SVGLineChart.instances.push(this)

    SVGLineChartDesigner.mount()
  }

  public destroy = (): void => {
    if (this.isDestroyed) return

    this.emitter.destroy()

    SVGLineChart.instances = SVGLineChart.instances.filter(
      (instance) => instance !== this
    )

    this.architect.destroy()

    if (!SVGLineChart.instances.length) SVGLineChartDesigner.destroy()

    this.isDestroyed = true
  }

  public addEventListener = this.emitter.on

  public removeEventListener = this.emitter.off

  public setDatasets = (datasets: Dataset[]): this => {
    if (this.isDestroyed) return this

    this.parameters.setData(datasets)
    this.architect.setDatasets()
    return this
  }

  public setParameters = (parameters: Omit<Parameters, 'datasets'>): this => {
    if (this.isDestroyed) return this

    this.parameters.update(parameters)
    this.architect.update()

    return this
  }
}
