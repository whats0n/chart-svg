type PartialNumbers = Partial<
  Record<'x1' | 'x2' | 'y1' | 'y2' | 'rotate', number | string>
>

interface GradientPartial {
  offset: string
  color: string
  opacity?: string
}

interface GradientTransform {
  [k: string]: string | number
}

export interface LinearGradientOptions extends PartialNumbers {
  id: string
  partials: GradientPartial[]
  gradientTransform?: GradientTransform
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  spreadMethod?: 'pad' | 'reflect' | 'repeat'
  href?: string
}

export interface RadialGradientOptions extends LinearGradientOptions {
  r?: number | string
  cx?: number | string
  cy?: number | string
  fr?: number | string
  fx?: number | string
  fy?: number | string
}
