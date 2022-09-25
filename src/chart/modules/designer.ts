import { Dependencies } from '~/types/dependencies'

export class SVGLineChartDesigner {
  public static base?: HTMLStyleElement

  private styles: HTMLStyleElement[] = []

  constructor(private id: string, private dependencies: Dependencies) {}

  private mountBase = (): this => {
    if (SVGLineChartDesigner.base) return this

    SVGLineChartDesigner.base = document.createElement('style')

    SVGLineChartDesigner.base.innerHTML = `
        .svg-line-chart:not(.is-animated) .svg-line-chart-polyline {
          animation: svg-line-chart-animation-line 2.3s linear forwards;
        }

        .svg-line-chart:not(.is-animated) .svg-line-chart-points {
          animation: svg-line-chart-animation-points 0.25s linear 2s forwards;
        }

        .svg-line-chart:not(.is-animated) rect {
          animation: svg-line-chart-animation-mask 2.3s linear forwards;
        }

        .svg-line-chart.is-animated .svg-line-chart-polyline {
          stroke-dashoffset: 0 !important;
        }

        .svg-line-chart.is-animated .svg-line-chart-points {
          opacity: 1;
        }

        .svg-line-chart-polyline {
          fill: none;
          pointer-events: none;
        }

        .svg-line-chart-polygon {
          stroke: none;
          pointer-events: none;
        }

        .svg-line-chart-points {
          opacity: 0;
          pointer-events: none;
        }

        .svg-line-chart-points circle {
          pointer-events: initial;
        }

        @keyframes svg-line-chart-animation-line {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes svg-line-chart-animation-mask {
          from {
            transform: translateX(-100%);
          }
        }

        @keyframes svg-line-chart-animation-points {
          from {
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
          }
        }
      `

    document.head.appendChild(SVGLineChartDesigner.base)

    return this
  }

  private mountDatasets = (): this => {
    const node = document.createElement('style')

    node.innerHTML = this.dependencies.parameters
      .getData()
      .map((dataset, index) => {
        const pathStyle = this.dependencies.parameters.resolvePathStyle(
          dataset.style?.path
        )
        const pointStyle = this.dependencies.parameters.resolvePointStyle(
          dataset.style?.point
        )

        const pointHoverStyle = {
          ...pointStyle,
          ...(dataset.style?.pointHover || {}),
        }

        const pointSelectedStyle = {
          ...pointStyle,
          ...(dataset.style?.pointSelected || {}),
        }

        index += 1

        return `
          .${this.id} .svg-line-chart-polygon:nth-of-type(${index}) {
            fill: ${pathStyle.fill};
          }

          .${this.id} .svg-line-chart-polyline:nth-of-type(${index}) {
            stroke-width: ${pathStyle.strokeWidth}px;
            stroke: ${pathStyle.strokeColor};
            stroke-linejoin: ${pathStyle.strokeLinejoin};
            stroke-linecap: ${pathStyle.strokeLinecap};
            filter: drop-shadow(${pathStyle.shadow});
          }

          .${this.id} .svg-line-chart-points:nth-of-type(${index}) circle {
            stroke-width: ${pointStyle.strokeWidth}px;
            stroke: ${pointStyle.strokeColor};
            fill: ${pointStyle.fill};
            filter: drop-shadow(${pointStyle.shadow});
          }

          .${this.id} .svg-line-chart-points:nth-of-type(${index}) circle:hover {
            stroke-width: ${pointHoverStyle.strokeWidth}px;
            stroke: ${pointHoverStyle.strokeColor};
            fill: ${pointHoverStyle.fill};
            filter: drop-shadow(${pointHoverStyle.shadow});
          }

          .${this.id} .svg-line-chart-points:nth-of-type(${index}) circle.is-selected {
            stroke-width: ${pointSelectedStyle.strokeWidth}px;
            stroke: ${pointSelectedStyle.strokeColor};
            fill: ${pointSelectedStyle.fill};
            filter: drop-shadow(${pointSelectedStyle.shadow});
          }
        `
      })
      .join('')

    document.head.appendChild(node)

    this.styles.push(node)

    return this
  }

  private clear = (): this => {
    this.styles.forEach((node) => node.parentNode?.removeChild(node))

    return this
  }

  public mount = (): this => this.mountBase().mountDatasets()

  public destroy = (withBase: boolean = false): void => {
    this.clear()

    if (withBase && SVGLineChartDesigner.base)
      SVGLineChartDesigner.base.parentElement?.removeChild(
        SVGLineChartDesigner.base
      )
  }

  public update = (): this => {
    this.clear().mount()
    return this
  }
}
