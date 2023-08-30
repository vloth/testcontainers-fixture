import { TE, pipe } from '../fp'
import { FixtureProtocol } from './protocol/type'
import * as Errors from '../errors'

const start = <C, T>(p: FixtureProtocol<C, T>, c: C) =>
  TE.tryCatch(
    () => p.start(c),
    (err) => Errors.format('image.container.run', c, String(err))
  )

const tap = <C, T>(p: FixtureProtocol<C, T>, t: T) =>
  TE.tryCatch(
    () => p.tap(t),
    (err) => Errors.format('image.container.run', String(err))
  )

const stop = <C, T>(p: FixtureProtocol<C, T>, t: T) =>
  TE.tryCatch(
    () => p.stop(t),
    (err) => Errors.format('image.container.run', String(err))
  )

export const pipeline = <C, T>(
  protocol: FixtureProtocol<C, T>,
  configuration: C
) =>
  pipe(
    start(protocol, configuration),
    TE.chain(tap.bind(null, protocol)),
    TE.chain(stop.bind(null, protocol))
  )
