import { Dataset } from '~/types/data'
import { Size } from '~/types/size'
import { PathStyle } from '~/types/style'
import { DeepPartial } from '~/types/utility'
import defaults from './defaults'
import { Parameters } from './types'

export class SVGLineChartParameters {
  private datasets: Dataset[] = []

  private size: Size = defaults.size

  constructor(parameters: Parameters) {
    this.setData(parameters.datasets).mergeSize(parameters.size)
  }

  private mergeSize = (size?: DeepPartial<Size>): this => {
    this.size = {
      ...this.size,
      ...(size || {}),
      padding: {
        ...this.size.padding,
        ...(size?.padding || {}),
      },
    }

    return this
  }

  public getData = (): Dataset[] =>
    this.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.sort((prev, next) => prev.x - next.x),
    }))

  public setData = (datasets: Dataset[]): this => {
    this.datasets = datasets
    return this
  }

  public getSize = (): Size => this.size

  public resolvePathStyle = (style?: DeepPartial<PathStyle>): PathStyle => ({
    ...defaults.style.path,
    ...style,
  })
}
