import { TE, pipe } from '@/common'
import { FixtureProtocol } from './protocol/type'
import { toError } from '../errors'
import { ps } from '@/util'

const start = <C, T>(signal: ps.Signal, p: FixtureProtocol<C, T>, c: C) =>
  TE.tryCatch(() => ps.from(signal, p.start(c)), toError('protocol.start'))

const tap = <C, T>(signal: ps.Signal, p: FixtureProtocol<C, T>, c: C, t: T) =>
  TE.tryCatch(() => ps.from(signal, p.tap(c, t)), toError('protocol.tap'))

const stop = <C, T>(p: FixtureProtocol<C, T>, t?: T) =>
  TE.tryCatch(() => p.stop(t), toError('protocol.stop'))

export const pipeline =
  <C, T>(protocol: FixtureProtocol<C, T>, configuration: C) =>
  (signal: ps.Signal) =>
    pipe(
      start(signal, protocol, configuration),
      TE.tapError(() => stop(protocol)),
      TE.chain((t) =>
        pipe(
          tap(signal, protocol, configuration, t),
          TE.tapError(() => stop(protocol, t))
        )
      ),
      TE.chain((t) => stop(protocol, t))
    )
