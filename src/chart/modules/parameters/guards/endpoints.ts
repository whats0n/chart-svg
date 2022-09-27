import { ParametersEndpointsBase, ParametersEndpointsPersonal } from '../types'

const isObject = <T extends { [k: string]: unknown }>(o: unknown): o is T =>
  o !== null && typeof o === 'object' && !Array.isArray(o)

export const isEndpointBase = (
  endpoint: unknown
): endpoint is ParametersEndpointsBase =>
  isObject<ParametersEndpointsBase>(endpoint) &&
  ['start', 'end'].some((field) =>
    Object.prototype.hasOwnProperty.call(endpoint, field)
  )

export const isEndpointPersonal = (
  endpoint: unknown
): endpoint is ParametersEndpointsPersonal => {
  const fields: (keyof ParametersEndpointsPersonal)[] = ['fill', 'stroke']

  return (
    isObject<ParametersEndpointsPersonal>(endpoint) &&
    fields.some(
      (field) =>
        (Object.prototype.hasOwnProperty.call(endpoint, field) &&
          typeof endpoint[field] === 'boolean') ||
        isEndpointBase(endpoint[field])
    )
  )
}

export const isEndpointObject = (
  endpoint: unknown
): endpoint is ParametersEndpointsBase & ParametersEndpointsPersonal =>
  isEndpointBase(endpoint) || isEndpointPersonal(endpoint)
