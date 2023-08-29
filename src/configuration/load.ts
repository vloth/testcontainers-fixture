import * as fs from 'fs/promises'
import * as YAML from 'yaml'
import { reporter, TE, E, pipe, flow } from '../fp'
import * as Error from '../errors'
import { Configuration } from './type'

const assert = (path: string) =>
  pipe(
    TE.of(path),
    TE.tap(() => TE.of(fs.access(path, fs.constants.F_OK))),
    TE.mapLeft(() => Error.codes['config.miss'])
  )

const slurp = (path: string) =>
  TE.tryCatch(
    () => fs.readFile(path, { encoding: 'utf8' }),
    (err) => Error.format('config.read', String(err))
  )

const parse = (content: string) =>
  E.tryCatch(
    () => YAML.parse(content),
    (err) => Error.format('config.parse', (err as YAML.YAMLParseError).message)
  )

const decode = flow(
  Configuration.decode,
  TE.fromEither,
  TE.mapLeft((err) =>
    Error.format(
      'config.format',
      reporter.formatValidationErrors(err).join('\n')
    )
  )
)

export const load = flow(
  assert,
  TE.chain(slurp),
  TE.chain(flow(parse, TE.fromEither)),
  TE.chain(decode)
)
