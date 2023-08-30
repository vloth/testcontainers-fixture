import * as tc from 'testcontainers'
import * as ora from 'ora'
import { FixtureProtocol } from './type'
import type { ImageConfiguration } from '../../configuration/type'

let spinner: ReturnType<typeof ora> | undefined = undefined

export const ImageProtocol: FixtureProtocol<
  ImageConfiguration,
  tc.StartedTestContainer
> = {
  start(configuration) {
    spinner = ora('Loading unicorns').start()

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
    spinner!.color = 'yellow'
    spinner!.text = 'loading rainbows'
    return container
  },

  async stop(container) {
    spinner!.stop()
    await container.stop()
  }
}
