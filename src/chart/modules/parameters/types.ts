import { Dataset } from '~/types/data'
import { LinearGradientOptions } from '~/types/gradient'
import { Size } from '~/types/size'
import { Style } from '~/types/style'
import { DeepPartial } from '~/types/utility'

export interface ParametersMeta {
  responsive: boolean
  endpoints: { start: boolean; end: boolean }
}

export interface Parameters
  extends Partial<Pick<ParametersMeta, 'responsive'>> {
  datasets: Dataset[]
  endpoints?: boolean | ParametersMeta['endpoints']
  size?: DeepPartial<Size>
  style?: DeepPartial<Style>
  linearGradients?: LinearGradientOptions[]
}
