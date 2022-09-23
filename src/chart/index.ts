import { SVGLineChartArchitect } from './modules/architect'
import { SVGLineChartParameters } from './modules/parameters'
import { Parameters } from './modules/parameters/types'
import { Dependencies } from './types/dependencies'

export class SVGLineChart {
  private parameters: SVGLineChartParameters

  private get dependencies(): Dependencies {
    return { parameters: this.parameters }
  }

  private architect: SVGLineChartArchitect

  constructor(parameters: Parameters) {
    this.parameters = new SVGLineChartParameters(parameters)
    this.architect = new SVGLineChartArchitect(this.dependencies)
  }

  public mount = (container: HTMLElement): this => {
    this.architect.mount(container)

    return this
  }
}
