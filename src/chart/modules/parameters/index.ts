import { Dataset } from '~/types/data'
import { LinearGradientOptions } from '~/types/gradient'
import { Size } from '~/types/size'
import { PathStyle, PointStyle } from '~/types/style'
import { DeepPartial } from '~/types/utility'
import defaults from './defaults'
import { Parameters, ParametersMeta } from './types'

export class SVGLineChartParameters {
  private datasets: Dataset[] = []

  private size: Size = defaults.size

  private linearGradients: LinearGradientOptions[] = []

  private meta: ParametersMeta = {
    responsive: defaults.responsive,
    endpoints: defaults.endpoints,
  }

  constructor(parameters: Parameters) {
    this.setData(parameters.datasets)
      .mergeSize(parameters.size)
      .setLinearGradients(parameters.linearGradients)
      .setMeta({
        responsive: parameters.responsive,
        endpoints: parameters.endpoints,
      })
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

  private setLinearGradients = (gradients?: LinearGradientOptions[]): this => {
    this.linearGradients = gradients || []
    return this
  }

  private setMeta = (
    meta?: DeepPartial<
      Omit<ParametersMeta, 'endpoints'> & { endpoints: Parameters['endpoints'] }
    >
  ): this => {
    const endpoints =
      typeof meta?.endpoints === 'boolean'
        ? { start: meta.endpoints, end: meta.endpoints }
        : meta?.endpoints || {}

    this.meta = {
      responsive: meta?.responsive ?? defaults.responsive,
      endpoints: {
        ...this.meta.endpoints,
        ...defaults.endpoints,
        ...endpoints,
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

  public resolvePointStyle = (style?: DeepPartial<PointStyle>): PointStyle => ({
    ...defaults.style.point,
    ...style,
  })

  public getLinearGradients = (): LinearGradientOptions[] =>
    this.linearGradients

  public getMeta = (): ParametersMeta => this.meta

  public update = (parameters: Omit<Parameters, 'datasets'>): this => {
    const gradients = parameters.linearGradients || []

    this.mergeSize(parameters.size)
      .setLinearGradients([
        ...this.linearGradients.filter(({ id }) =>
          gradients.every((gradient) => gradient.id !== id)
        ),
        ...gradients,
      ])
      .setMeta({
        responsive: parameters.responsive,
        endpoints: parameters.endpoints,
      })

    return this
  }
}
