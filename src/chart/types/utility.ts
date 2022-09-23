export type DeepPartial<T = { [k: string]: unknown }> = {
  [K in keyof T]: T[K] extends { [k: string]: unknown }
    ? DeepPartial<T[K]>
    : Partial<T[K]>
}
