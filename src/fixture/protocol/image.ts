import * as tc from 'testcontainers'
import ora from 'ora'
import { FixtureProtocol } from './type'
import type { ImageConfiguration } from '../../configuration/type'

let spinner: ReturnType<typeof ora> | undefined = undefined

const delay = (ts: number) => new Promise((resolve) => setTimeout(resolve, ts))

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
    await delay(5000)
    return container
  },

  async stop(container) {
    spinner!.color = 'red'
    spinner!.text = 'FINISHING>>>>'
    spinner!.stop()
    await container?.stop()
  }
}
