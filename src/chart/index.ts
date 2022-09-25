import { SVGLineChartArchitect } from './modules/architect'
import { SVGLineChartDesigner } from './modules/designer'
import { EventEmitter } from './modules/emitter'
import { SVGLineChartParameters } from './modules/parameters'
import { Parameters } from './modules/parameters/types'
import { Dataset } from './types/data'
import { Dependencies } from './types/dependencies'
import { createId } from './utilities/createId'

export class SVGLineChart {
  public static instances: SVGLineChart[] = []

  private id: string = createId()

  private parameters: SVGLineChartParameters

  private emitter: EventEmitter = new EventEmitter()

  private get dependencies(): Dependencies {
    return { parameters: this.parameters, emitter: this.emitter }
  }

  private architect: SVGLineChartArchitect

  private designer: SVGLineChartDesigner

  constructor(parameters: Parameters) {
    this.parameters = new SVGLineChartParameters(parameters)
    this.architect = new SVGLineChartArchitect(this.id, this.dependencies)
    this.designer = new SVGLineChartDesigner(this.id, this.dependencies)

    SVGLineChart.instances.push(this)
  }

  public mount = (container: HTMLElement): this => {
    this.designer.mount()
    this.architect.mount(container)

    return this
  }

  public destroy = (): void => {
    SVGLineChart.instances = SVGLineChart.instances.filter(
      (instance) => instance !== this
    )

    this.architect.destroy()
    this.designer.destroy(!SVGLineChart.instances.length)
  }

  public addEventListener = this.emitter.on

  public removeEventListener = this.emitter.off

  public setDatasets = (datasets: Dataset[]): this => {
    this.parameters.setData(datasets)
    this.architect.update()
    this.designer.update()
    return this
  }

  public setParameters = (parameters: Omit<Parameters, 'datasets'>): this => {
    this.parameters.update(parameters)
    this.architect.update()

    return this
  }
}
