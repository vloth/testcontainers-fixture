import { TE, pipe } from './fp'
import { load } from './configuration/load'
import { pipeline } from './fixture/pipeline'
import { ImageProtocol } from './fixture/protocol/image'

async function main() {
  const run = pipe(
    'samples/sample.yml',
    load,
    TE.chain((configuration) => pipeline(ImageProtocol, configuration)),
    TE.match(console.log, console.error)
  )

  await run()
}

main()

export const sum = (a: number, b: number) => a - b
