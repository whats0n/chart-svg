# Simple SVG Line Chart

Simple chart plugin based on javascript and svg without dependencies.

## Basic usage example

```typescript
import { SVGLineChart } from 'simple-svg-line-chart'

const chart = new SVGLineChart(document.querySelector('#container'), options)
```

---

## Options

```typescript
{
  responsive?: boolean
  endpoints?: boolean | {
    start?: boolean
    end?: boolean
    fill?: { start?: boolean; end?: boolean }
    stroke?: { start?: boolean; end?: boolean }
  }
  size?: {
    width?: number
    height?: number
    padding?: {
      top?: number | string
      right?: number | string
      bottom?: number | string
      left?: number | string
    }
  }
  datasets: Array<{
    data: Array<{ x: number; y: number; additional?: unknown }>
    style?: {
      path?: {
        strokeLinejoin?: string
        strokeLinecap?: string
        strokeWidth?: number
        strokeColor?: string
        fill?: string
        shadow?: string
      },
      point?: {
        size?: number
        strokeWidth?: number
        strokeColor?: string
        fill?: string
        shadow?: string
      },
      pointHover?: {
        strokeWidth?: number
        strokeColor?: string
        fill?: string
        shadow?: string
      },
      pointSelected?: {
        strokeWidth?: number
        strokeColor?: string
        fill?: string
        shadow?: string
      }
    }
  }>
}
```

**responsive:**

`true` - the chart will recalculate the viewBox on the container resize based on `size.width` and `size.height` ratio by container real size

`false` - the chart viewBox will be equal to `size.width` and `size.height`

*Default:*  `false`

**endpoints:**

draw the chart's dataset stroke and fill from the start and to the end of the viewBox

`true` - draw from start to the end

`false` - draw from first point to the last point

`endpoints.start = true` - draw from start

`endpoints.start = false` - draw from first point

`endpoints.end = true` - draw to the end

`endpoints.end = false` - draw to the last point

`endpoints.fill.start`, `endpoints.fill.end`, `endpoints.stroke.start`, `endpoints.stroke.end` - personal settings, for example when u want to draw the stroke from the first point to the last point, but fill it from the start and to the end

*Default:*

```typescript
{
  fill: { start: true, end: true },
  stroke: { start: false, end: false }
}
```

**size:**

`width` - base width

`height` - base height

`padding` - the paddings for points' area, possible values numbers (pixels) or percents for `top`, `right`, `bottom`, `left`

### Datasets

Array of datasets presents a data with a style for each curve

**data:**

array of points with additional info and percents for each axis

`x` - from 0 to 100 by `X` axis

`y` - from 0 to 100 by `Y` axis

`additional` - additional data which u can use inside point events listeners such as `enter`, `leave`, `select`

**style:**

the object with properties for path stroke and fill and for points with a states such as `hover` and `selected`

`path`

the styles for fill and stroke

[strokeLinejoin](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin) - default: `round`

[strokeLinecap](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap) - default: `round`

[strokeWidth](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) - default: `2`

[strokeColor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke) - default: `none`

[fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill) - default: `none`

[shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) - default: `0 0 0 rgba(0,0,0,0)`

`point`

the object properties for point styles

`size` - the point size, default: `0`

[strokeWidth](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width) - default: `2`

[strokeColor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke) - default: `none`

[fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill) - default: `none`

[shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) - default: `0 0 0 rgba(0,0,0,0)`

`pointHover` and `pointSelected` the same as `point` without `size`.

---

## Methods

`addEventListener` - subscribe on the chart event

*arguments:* `eventName` and `eventHandler`

`removeEventListener` - unsubscribe from the chart event

*arguments:* `eventName` and `eventHandler`

`setDatasets` - set new chart's data

*arguments:* array of `datasets`

`setParameters` - update parameters

*arguments:* object with optional `responsive`, `endpoints`, `size`

`destroy` - unmount and destroy chart

---

## Events

`enter` - fired on point mouse enter, possible values `PointDetails`

`leave` - fired on point mouse leave, possible values `PointDetails`

`select` - fired on point select (on click by point), possible values `PointDetails` or `null`

`resize` - fired on container resize, possible values `PointDetails` or `null`

```typescript
interface PointDetails {
  position: { top: number; left: number }
  value: { x: number; y: number; additional: unknown }
}
```

**PointDetails:**

`position` - relative to the viewport

`value` - the dataset data object

## Gradients

You can use gradients for stroke or fill

**Gradient usage exmaple:**

```typescript
import { SVGLineChart, SVGLineChartGradient } from 'simple-svg-line-chart'

SVGLineChartGradient.addLinearGradient({
  id: 'linear-gradient-1',
  partials: [
    { offset: '0', color: '#954ce9' },
    { offset: '0.3', color: '#954ce9' },
    { offset: '0.6', color: '#24c1ed' },
    { offset: '1', color: '#24c1ed' },
  ],
})

SVGLineChartGradient.addRadialGradient({
  id: 'radial-gradient-1',
  partials: [
    { offset: '0', color: 'red' },
    { offset: '1', color: 'yellow' },
  ],
})

SVGLineChartGradient.mount()

const chart = new SVGLineChart(document.querySelector('#container'), options)
```

In this case you would be able to use the `url(#linear-gradient-1)` or the `url(#radial-gradient-1)` for the `strokeColor` or `fill` for `path` or `point` styles

**Gradient methods:**

`mount` - mount the module's prepared SVG

`destroy` - unmount module's prepared SVG and remove all added gradients

`addLinearGradient` - add the linear gradient to the module

*arguments:*

```typescript
{

  id: string
  partials: Array<{
    offset: string
    color: string
    opacity?: string
  }>
  gradientTransform?: Record<string, string | number>
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  spreadMethod?: 'pad' | 'reflect' | 'repeat'
  href?: string
  x1?: number | string
  x2?: number | string
  y1?: number | string
  y2?: number | string
}
```

`id` - uniq identifier which you would be able to use in the `url` for the `fill` or the `strokeColor`

`partials` - the array of gradient's parts: the tag [stop](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop)

`gradientTransform` - the object with [transformation](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/gradientTransform)

all the other parameters you can find [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient)

`removeLinearGradient` - remove the linear gradient from the module

*arguments* - `id`

`addRadialGradient` - add radial gradient to the module

*arguments:* extends from `addLinearGradient`

```typescript
{
  r?: number | string
  cx?: number | string
  cy?: number | string
  fr?: number | string
  fx?: number | string
  fy?: number | string
}
```

all the other parameters you can find [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient)
