export class SVGLineChartDesigner {
  public static base?: HTMLStyleElement

  public static mount = (): void => {
    if (SVGLineChartDesigner.base) return

    SVGLineChartDesigner.base = document.createElement('style')

    SVGLineChartDesigner.base.innerHTML = `
        .svg-line-chart:not(.is-animated) polyline {
          animation: svg-line-chart-animation-line 2.3s linear forwards;
        }

        .svg-line-chart:not(.is-animated) circle {
          animation: svg-line-chart-animation-points 0.25s linear 2s forwards;
        }

        .svg-line-chart:not(.is-animated) rect {
          animation: svg-line-chart-animation-mask 2.3s linear forwards;
        }

        .svg-line-chart.is-animated polyline {
          stroke-dashoffset: 0 !important;
        }

        .svg-line-chart.is-animated circle {
          opacity: 1;
        }

        .svg-line-chart polyline {
          fill: none;
          pointer-events: none;
        }

        .svg-line-chart polygon {
          stroke: none;
          pointer-events: none;
        }

        .svg-line-chart circle {
          opacity: 0;
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
  }

  public static destroy = (): void => {
    if (SVGLineChartDesigner.base) {
      SVGLineChartDesigner.base.parentElement?.removeChild(
        SVGLineChartDesigner.base
      )

      SVGLineChartDesigner.base = undefined
    }
  }
}
