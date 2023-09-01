import * as YAML from 'yaml'
import { fs, fn } from '../util'
import { TE, E, flow } from '@/common'
import { toError, toDecodeError } from '../errors'
import * as type from './type'

const access = TE.tryCatchK(fn.tapP(fs.access), toError('config.miss'))

const slurp = TE.tryCatchK(fs.slurp, toError('config.read'))

const yamlTojson = flow(
  E.tryCatchK((x: any) => YAML.parse(x), toError('config.parse')),
  TE.fromEither
)

const tryDecode: typeof type.Configuration.decode = (
  configuration: type.Configuration
) =>
  type.isImage(configuration)
    ? type.ImageConfiguration.decode(configuration)
    : type.DockerComposeConfiguration.decode(configuration)

const decode = flow(
  tryDecode,
  E.mapLeft(toDecodeError('config.format')),
  TE.fromEither
)

export const load = flow(
  access,
  TE.chain(slurp),
  TE.chain(yamlTojson),
  TE.chain(decode)
)
