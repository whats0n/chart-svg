export type Padding = Record<
  'top' | 'right' | 'bottom' | 'left',
  number | string
>

export interface Size {
  width: number
  height: number
  padding: Padding
}
