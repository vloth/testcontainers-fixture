import * as YAML from 'yaml'
import { fs } from '@/util'
import { TE, E, t, flow, pipe } from '@/common'
import { toError, toDecodeError } from '../errors'
import * as type from './type'

const yamlTojson = flow(
	E.tryCatchK((x: string) => YAML.parse(x), toError('ConfigParse')),
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

export const load = async (path: string) =>  {
	return pipe(
		TE.of(path),
		TE.chainFirst(flow(fs.access, TE.mapLeft(toError('ConfigMiss')))),
		TE.chain(flow(fs.slurp, TE.mapLeft(toError('ConfigRead')))),
		TE.chain(yamlTojson),
		TE.chain(decode)
	)
}
