import { Dataset } from '~/types/data'
import { Size } from '~/types/size'
import { Style } from '~/types/style'
import { DeepPartial } from '~/types/utility'

export interface Parameters {
  datasets: Dataset[]
  size?: DeepPartial<Size>
  style?: DeepPartial<Style>
}
