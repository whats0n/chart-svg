import { Dataset } from '~/types/data'
import { Size } from '~/types/size'
import { PathStyle, PointStyle } from '~/types/style'
import { DeepPartial } from '~/types/utility'
import defaults from './defaults'
import { isEndpointObject } from './guards/endpoints'
import { Parameters, ParametersEndpointsBase, ParametersMeta } from './types'

export class SVGLineChartParameters {
  private datasets: Dataset[] = []

  private size: Size = defaults.size

  private meta: ParametersMeta = {
    responsive: defaults.responsive,
    endpoints: defaults.endpoints,
  }

  constructor(parameters: Parameters) {
    this.setData(parameters.datasets).mergeSize(parameters.size).setMeta({
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

  private setMeta = (
    meta?: DeepPartial<
      Omit<ParametersMeta, 'endpoints'> & { endpoints: Parameters['endpoints'] }
    >
  ): this => {
    this.meta.responsive = meta?.responsive ?? defaults.responsive

    const resolvePartialEndpoint = (
      type: 'start' | 'end',
      primary: ParametersEndpointsBase | boolean | undefined,
      secondary: ParametersEndpointsBase | boolean | undefined,
      defaultValue: Required<ParametersEndpointsBase>
    ): boolean => {
      if (typeof primary === 'boolean') return primary

      const primaryType = primary?.[type]

      if (typeof primaryType === 'boolean') return primaryType

      if (typeof secondary === 'boolean') return secondary

      const secondaryType = secondary?.[type]

      if (typeof secondaryType === 'boolean') return secondaryType

      return defaultValue[type]
    }

    if (typeof meta?.endpoints === 'boolean') {
      this.meta.endpoints.fill.start = meta.endpoints
      this.meta.endpoints.fill.end = meta.endpoints
      this.meta.endpoints.stroke.start = meta.endpoints
      this.meta.endpoints.stroke.end = meta.endpoints
    }

    const endpoints = meta?.endpoints

    if (isEndpointObject(endpoints)) {
      this.meta.endpoints.fill.start = resolvePartialEndpoint(
        'start',
        endpoints.fill,
        endpoints,
        defaults.endpoints.fill
      )

      this.meta.endpoints.fill.end = resolvePartialEndpoint(
        'end',
        endpoints.fill,
        endpoints,
        defaults.endpoints.fill
      )

      this.meta.endpoints.stroke.start = resolvePartialEndpoint(
        'start',
        endpoints.stroke,
        endpoints,
        defaults.endpoints.stroke
      )

      this.meta.endpoints.stroke.end = resolvePartialEndpoint(
        'end',
        endpoints.stroke,
        endpoints,
        defaults.endpoints.stroke
      )
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

  public getMeta = (): ParametersMeta => this.meta

  public update = (parameters: Omit<Parameters, 'datasets'>): this =>
    this.mergeSize(parameters.size).setMeta({
      responsive: parameters.responsive,
      endpoints: parameters.endpoints,
    })
}
