import * as YAML from 'yaml'
import { fs, fn } from '@/util'
import { TE, E, t, flow } from '@/common'
import { toError, toDecodeError } from '../errors'
import * as type from './type'

const access = TE.tryCatchK(fn.tossP(fs.access), toError('ConfigMiss'))

const slurp = TE.tryCatchK(fs.slurp, toError('ConfigRead'))

const yamlTojson = flow(
  E.tryCatchK((x: any) => YAML.parse(x), toError('ConfigParse')),
  TE.fromEither
)

const decode = flow(
  (configuration: type.Configuration): t.Validation<type.Configuration> =>
    type.isImage(configuration)
      ? type.ImageConfiguration.decode(configuration)
      : type.DockerComposeConfiguration.decode(configuration),
  E.mapLeft(toDecodeError('ConfigFormat')),
  TE.fromEither
)

export const load = flow(
  access,
  TE.chain(slurp),
  TE.chain(yamlTojson),
  TE.chain(decode)
)
