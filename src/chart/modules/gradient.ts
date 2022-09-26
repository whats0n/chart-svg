import { LinearGradientOptions } from '~/types/gradient'

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

  public static addLinearGradient = ({
    id,
    partials,
    rotate = 0,
    x1,
    x2,
    y1,
    y2,
  }: LinearGradientOptions): void => {
    const gradient = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'linearGradient'
    )

    gradient.id = id

    if (typeof rotate === 'number')
      gradient.setAttribute('gradientTransform', `rotate(${rotate})`)

    if (typeof x1 === 'number') gradient.setAttribute('x1', `${x1}%`)
    if (typeof x2 === 'number') gradient.setAttribute('x2', `${x2}%`)
    if (typeof y1 === 'number') gradient.setAttribute('y1', `${y1}%`)
    if (typeof y2 === 'number') gradient.setAttribute('y2', `${y2}%`)

    gradient.innerHTML = partials
      .map(
        ({ offset, color }) =>
          `<stop offset="${offset}" stop-color="${color}" />`
      )
      .join('')

    SVGLineChartGradient.defs.appendChild(gradient)

    SVGLineChartGradient.store.linear.set(id, gradient)
  }
}
