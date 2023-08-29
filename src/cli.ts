import { TE, pipe } from './fp'
import { load } from './configuration/load'
import { init } from './fixture'

// TE.match(console.log, console.error)
async function main() {
  const run = pipe(
    'samples/sample.yml',
    load,
    TE.chain((configuration) => init(configuration)),
    TE.match(console.log, console.error)
  )

  await run()
}

main()

export const sum = (a: number, b: number) => a - b
