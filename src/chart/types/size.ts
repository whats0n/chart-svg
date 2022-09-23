export type Padding = Record<'top' | 'right' | 'bottom' | 'left', number>

export interface Size {
  width: number
  height: number
  padding: Padding
}
