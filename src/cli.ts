import { TE, pipe } from '@/common'
import { ps } from '@/util'
import { load } from './configuration/load'
import { isImage } from './configuration/type'
import { pipeline } from './fixture/pipeline'
import { ImageProtocol } from './fixture/protocol/image'
import { DockerComposeProtocol } from './fixture/protocol/docker-compose'
import * as Errors from './errors'

async function main() {
	const { signal, cancel } = ps.newSignal()

  ;['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => process.once(sig, cancel))

	const run = pipe(
		load('samples/sample.yml'),
		TE.chain((configuration) =>
			pipe(
				signal,
				isImage(configuration)
					? pipeline(ImageProtocol, configuration)
					: pipeline(DockerComposeProtocol, configuration)
			)
		),
		TE.mapLeft(Errors.toString),
		TE.match(
			(e) => console.error('error: ', e),
			(s) => console.log('sucess: ', s)
		)
	)

	await run()
}

main()

export const sum = (a: number, b: number) => a - b
