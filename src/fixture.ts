import * as tc from 'testcontainers'
import { TE, pipe } from './fp'
import type { Configuration, ImageConfiguration } from './configuration/type'
import * as Errors from './errors'

const run = {
  image(conf: ImageConfiguration) {
    let container = new tc.GenericContainer(conf.image)

    container = container.withExposedPorts(...conf['expose-ports'])

    if (conf.wait) {
      if ('listening-port' in conf.wait)
        container = container.withWaitStrategy(tc.Wait.forListeningPorts())

      if ('timeout' in conf.wait)
        container = container.withStartupTimeout(conf.wait.timeout)
    }

    return container.start()
  }
}

const cmd = {
  image(container: tc.StartedTestContainer) {
    // do something
    console.log('something something')
    return container
  }
}

const stop = {
  image(container: tc.StartedTestContainer) {
    return container.stop()
  }
}

export function init(conf: Configuration) {
  console.log(conf)
  if (!('image' in conf)) {
    throw Error('boom!')
  }

  return pipe(
    TE.tryCatch(
      () => run.image(conf),
      (err) => Errors.format('image.container.run', conf.image, String(err))
    ),
    TE.chain((container) =>
      pipe(
        TE.of(container),
        TE.tap(() => TE.of(cmd.image(container))),
        TE.mapLeft((err) =>
          Errors.format('image.container.run', conf.image, String(err))
        )
      )
    ),
    TE.chain((container) =>
      pipe(
        TE.of(container),
        TE.tap(() => TE.of(stop.image(container))),
        TE.mapLeft((err) =>
          Errors.format('image.container.run', conf.image, String(err))
        )
      )
    )
  )
}
