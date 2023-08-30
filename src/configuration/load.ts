import * as YAML from 'yaml'
import * as fpfs from '../utils/fs'
import { reporter, t, TE, E, pipe, flow } from '../fp'
import * as Error from '../errors'
import {
  Configuration,
  ImageConfiguration,
  DockerComposeConfiguration
} from './type'

const tryParse = (content: string) =>
  E.tryCatch(() => YAML.parse(content), E.toError)

const tryDecode = (configuration: Configuration) =>
  ('image' in configuration
    ? ImageConfiguration.decode(configuration)
    : DockerComposeConfiguration.decode(
        configuration
      )) as t.Validation<Configuration>

export const load = (path: string) => {
  const existsTe = flow(
    fpfs.exists,
    TE.mapLeft(() => Error.codes['config.miss'])
  )

  const slurpTe = pipe(
    fpfs.slurp(path),
    TE.mapLeft(Error.errorFn('config.read'))
  )

  const parseTe = flow(
    tryParse,
    E.mapLeft(Error.errorFn('config.parse')),
    TE.fromEither
  )

  const decodeTe = flow(
    tryDecode,
    TE.fromEither,
    TE.mapLeft((err) =>
      Error.format(
        'config.format',
        reporter.formatValidationErrors(err).join('\n')
      )
    )
  )

  return pipe(
    path,
    TE.of,
    TE.chain(existsTe),
    TE.chain(() => slurpTe),
    TE.chain(parseTe),
    TE.chain(decodeTe)
  )
}
