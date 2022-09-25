import { Dependencies } from '~/types/dependencies'
import { SVGLineChartDOM } from './dom'
import { SVGLineChartMath } from './math'

export class SVGLineChartArchitect {
  private dom: SVGLineChartDOM

  private math: SVGLineChartMath

  constructor(id: string, dependencies: Dependencies) {
    this.math = new SVGLineChartMath(dependencies)
    this.dom = new SVGLineChartDOM(dependencies, {
      id,
      onResize: this.update,
    })
  }

  public mount = (container: HTMLElement): this => {
    const size = this.dom.getSize()

    this.dom.mount(container).setPoints({
      polylines: this.math.getPolylines(size),
      polygons: this.math.getPolygons(size),
    })
    this.update()

    return this
  }

  public update = (): this => {
    const size = this.dom.getSize()

    this.dom.update({
      polylines: this.math.getPolylines(size),
      polygons: this.math.getPolygons(size),
    })

    return this
  }

  public destroy = (): void => this.dom.destroy()
}
