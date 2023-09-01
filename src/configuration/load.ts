import * as YAML from 'yaml'
import * as fpfs from '../utils/fs'
import { TE, E, flow } from '../fp'
import { toError, toDecodeError } from '../errors'
import * as type from './type'

const access = TE.tryCatchK(
  (path: string) => fpfs.access(path).then(() => path),
  toError('config.miss')
)

const slurp = TE.tryCatchK(fpfs.slurp, toError('config.read'))

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
