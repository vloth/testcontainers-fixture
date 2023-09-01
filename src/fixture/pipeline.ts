import { TE, pipe } from '@/common'
import { FixtureProtocol } from './protocol/type'
import { toError } from '../errors'

const start = <C, T>(p: FixtureProtocol<C, T>, c: C) =>
  TE.tryCatch(() => p.start(c), toError('protocol.start'))

const tap = <C, T>(p: FixtureProtocol<C, T>, t: T) =>
  TE.tryCatch(() => p.tap(t), toError('protocol.tap'))

const stop = <C, T>(p: FixtureProtocol<C, T>, t: T) =>
  TE.tryCatch(() => p.stop(t), toError('protocol.stop'))

export const pipeline = <C, T>(
  protocol: FixtureProtocol<C, T>,
  configuration: C
) =>
  pipe(
    start(protocol, configuration),
    TE.chain(tap.bind(null, protocol)),
    TE.chain(stop.bind(null, protocol))
  )
