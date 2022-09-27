import { LinearGradientOptions, RadialGradientOptions } from './types'

const isNumberOrString = (value: unknown): value is number | string =>
  ['number', 'string'].includes(typeof value)

const addCommon = <
  T extends SVGLinearGradientElement | SVGRadialGradientElement
>(
  gradient: T,
  {
    id,
    partials,
    gradientTransform,
    gradientUnits,
    spreadMethod,
    href,
    x1,
    x2,
    y1,
    y2,
  }: LinearGradientOptions
): T => {
  gradient.id = id

  if (gradientTransform)
    gradient.setAttribute(
      'gradientTransform',
      Object.entries(gradientTransform)
        .map(([action, values]) => `${action}(${values})`)
        .join(' ')
    )

  if (gradientUnits) gradient.setAttribute('gradientUnits', gradientUnits)
  if (spreadMethod) gradient.setAttribute('spreadMethod', spreadMethod)
  if (spreadMethod) gradient.setAttribute('spreadMethod', spreadMethod)
  if (href) gradient.setAttribute('href', href)

  if (isNumberOrString(x1)) gradient.setAttribute('x1', `${x1}%`)
  if (isNumberOrString(x2)) gradient.setAttribute('x2', `${x2}%`)
  if (isNumberOrString(y1)) gradient.setAttribute('y1', `${y1}%`)
  if (isNumberOrString(y2)) gradient.setAttribute('y2', `${y2}%`)

  gradient.innerHTML = partials
    .map(({ opacity, offset, color }) => {
      const attributes = [
        ['offset', offset],
        ['stop-color', color],
        ['stop-opacity', opacity],
      ]
        .filter((attribute) => isNumberOrString(attribute[1]))
        .map(([name, value]) => `${name}="${value}"`)
        .join(' ')

      return `<stop ${attributes}/>`
    })
    .join('')

  return gradient
}

export class SVGLineChartGradient {
  public static store: {
    linear: Map<string, SVGLinearGradientElement>
    radial: Map<string, SVGRadialGradientElement>
  } = {
    linear: new Map(),
    radial: new Map(),
  }

  public static svg: SVGSVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )

  public static defs: SVGDefsElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'defs'
  )

  public static mount = (): void => {
    SVGLineChartGradient.svg.style.position = 'absolute'
    SVGLineChartGradient.svg.style.top = '-999px'
    SVGLineChartGradient.svg.style.left = '-999px'
    SVGLineChartGradient.svg.style.width = '0'
    SVGLineChartGradient.svg.style.height = '0'
    SVGLineChartGradient.svg.appendChild(SVGLineChartGradient.defs)
    document.body.appendChild(SVGLineChartGradient.svg)
  }

  public static destroy = (): void => {
    SVGLineChartGradient.store.linear.forEach((gradient, id) => {
      gradient.parentNode?.removeChild(gradient)
      SVGLineChartGradient.store.linear.delete(id)
    })

    SVGLineChartGradient.store.radial.forEach((gradient, id) => {
      gradient.parentNode?.removeChild(gradient)
      SVGLineChartGradient.store.radial.delete(id)
    })

    document.body.removeChild(SVGLineChartGradient.svg)
  }

  public static addLinearGradient = (options: LinearGradientOptions): void => {
    const gradient = addCommon(
      document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient'),
      options
    )

    SVGLineChartGradient.defs.appendChild(gradient)

    SVGLineChartGradient.store.linear.set(options.id, gradient)
  }

  public static removeLinearGradient = (id: string): void => {
    const gradient = SVGLineChartGradient.store.linear.get(id)

    if (gradient) {
      gradient.parentNode?.removeChild(gradient)
      SVGLineChartGradient.store.linear.delete(id)
    }
  }

  public static addRadialGradient = ({
    r,
    cx,
    cy,
    fr,
    fx,
    fy,
    ...options
  }: RadialGradientOptions): void => {
    const gradient = addCommon(
      document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient'),
      options
    )

    if (isNumberOrString(r)) gradient.setAttribute('r', `${r}`)
    if (isNumberOrString(cx)) gradient.setAttribute('cx', `${cx}`)
    if (isNumberOrString(cy)) gradient.setAttribute('cy', `${cy}`)
    if (isNumberOrString(fr)) gradient.setAttribute('fr', `${fr}`)
    if (isNumberOrString(fx)) gradient.setAttribute('fx', `${fx}`)
    if (isNumberOrString(fy)) gradient.setAttribute('fy', `${fy}`)

    SVGLineChartGradient.defs.appendChild(gradient)

    SVGLineChartGradient.store.radial.set(options.id, gradient)
  }
}
