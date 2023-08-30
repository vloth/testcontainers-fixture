import * as tc from 'testcontainers'
import { FixtureProtocol } from './type'
import type { ImageConfiguration } from '../../configuration/type'

export const ImageProtocol: FixtureProtocol<
  ImageConfiguration,
  tc.StartedTestContainer
> = {
  start(configuration) {
    let container = new tc.GenericContainer(configuration.image)
    container = container.withExposedPorts(...configuration['expose-ports'])

    if (configuration.wait) {
      if ('listening-port' in configuration.wait)
        container = container.withWaitStrategy(tc.Wait.forListeningPorts())

      if ('timeout' in configuration.wait)
        container = container.withStartupTimeout(configuration.wait.timeout)
    }

    return container.start()
  },

  async tap(container) {
    // do something
    console.log('something something', container)
    return container
  },

  async stop(container) {
    await container.stop()
  }
}
