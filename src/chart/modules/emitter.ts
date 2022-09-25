import { DataPoint } from '~/types/data'

export type Events = 'enter' | 'leave' | 'select'

export interface EventEmitterParameters {
  position: { top: number; left: number }
  value: DataPoint
}

export interface EventEmitterListener {
  (parameters: EventEmitterParameters | null): unknown
}

export class EventEmitter {
  private events: Record<Events, EventEmitterListener[]> = {
    enter: [],
    leave: [],
    select: [],
  }

  public on = (event: Events, listener: EventEmitterListener): void => {
    this.events[event].push(listener)
  }

  public off = (event: Events, listener: EventEmitterListener): void => {
    this.events[event] = this.events[event].filter((f) => f !== listener)
  }

  public emit = (
    event: Events,
    parameters: EventEmitterParameters | null
  ): void => {
    this.events[event].forEach((listener) => listener(parameters))
  }
}
