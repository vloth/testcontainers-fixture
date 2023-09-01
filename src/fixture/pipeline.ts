import { TE, pipe } from '@/common'
import { FixtureProtocol } from './protocol/type'
import { toTaggedError } from '../errors'

const start = <C, T>(p: FixtureProtocol<C, T>, c: C) =>
  TE.tryCatch(() => p.start(c), toTaggedError('protocol.start'))

const tap = <C, T>(p: FixtureProtocol<C, T>, t: T) =>
  TE.tryCatch(() => p.tap(t), toTaggedError('protocol.tap'))

const stop = <C, T>(p: FixtureProtocol<C, T>, t: T) =>
  TE.tryCatch(() => p.stop(t), toTaggedError('protocol.stop'))

export const pipeline = <C, T>(
  protocol: FixtureProtocol<C, T>,
  configuration: C
) =>
  pipe(
    start(protocol, configuration),
    TE.chain(tap.bind(null, protocol)),
    TE.chain(stop.bind(null, protocol))
  )
