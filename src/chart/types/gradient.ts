type PartialNumbers = Partial<
  Record<'x1' | 'x2' | 'y1' | 'y2' | 'rotate', number>
>

export interface LinearGradientOptions extends PartialNumbers {
  id: string
  partials: { offset: string; color: string }[]
}
