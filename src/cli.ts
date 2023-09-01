import { TE, pipe } from '@/common'
import { load } from './configuration/load'
import { isImage } from './configuration/type'
import { pipeline } from './fixture/pipeline'
import { ImageProtocol } from './fixture/protocol/image'
import { DockerComposeProtocol } from './fixture/protocol/docker-compose'

async function main() {
  const run = pipe(
    'samples/sample.yml',
    load,
    // bind config, and pipeline to apply it later on?
    TE.chain((configuration) =>
      isImage(configuration)
        ? pipeline(ImageProtocol, configuration)
        : pipeline(DockerComposeProtocol, configuration)
    ),
    TE.match(console.log, console.error)
  )

  await run()
}

main()

export const sum = (a: number, b: number) => a - b
