import * as tc from 'testcontainers'
import { FixtureProtocol } from './type'
import type { DockerComposeConfiguration } from '../../configuration/type'

export const DockerComposeProtocol: FixtureProtocol<
  DockerComposeConfiguration,
  tc.StartedDockerComposeEnvironment
> = {
  start(configuration) {
    const path = configuration['docker-compose-file']
    const container = new tc.DockerComposeEnvironment('', path)
    return container.up()
  },

  async tap(composedEnv) {
    console.log('something something', composedEnv)
    return composedEnv
  },

  async stop(composedEnv) {
    await composedEnv.stop()
  }
}
