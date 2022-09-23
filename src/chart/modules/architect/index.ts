import { Dependencies } from '~/types/dependencies'
import { Size } from '~/types/size'
import { SVGLineChartDOM } from './dom'
import { SVGLineChartMath } from './math'

export class SVGLineChartArchitect {
  private dom: SVGLineChartDOM

  private math: SVGLineChartMath

  constructor(dependencies: Dependencies) {
    this.math = new SVGLineChartMath(dependencies)
    this.dom = new SVGLineChartDOM(dependencies)
  }

  public mount = (container: HTMLElement): this => {
    this.dom.mount(container).update({
      polylines: this.math.getPolylines(this.dom.getSize()),
      polygons: this.math.getPolygons(this.dom.getSize()),
    })

    return this
  }
}
