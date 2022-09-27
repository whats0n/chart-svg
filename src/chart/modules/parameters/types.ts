import { Dataset } from '~/types/data'
import { Size } from '~/types/size'
import { DeepPartial } from '~/types/utility'

export type ParametersEndpointsBase = Partial<Record<'start' | 'end', boolean>>

export type ParametersEndpointsPersonal = Partial<
  Record<'fill' | 'stroke', boolean | ParametersEndpointsBase>
>

export interface ParametersMeta {
  responsive: boolean
  endpoints: Record<'fill' | 'stroke', Record<'start' | 'end', boolean>>
}

export interface Parameters
  extends Partial<Pick<ParametersMeta, 'responsive'>> {
  datasets: Dataset[]
  endpoints?:
    | boolean
    | Partial<Record<'start' | 'end', boolean>>
    | DeepPartial<ParametersMeta['endpoints']>
  size?: DeepPartial<Size>
}
