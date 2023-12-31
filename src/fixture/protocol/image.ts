import { pipe } from '@/common'
import * as tc from 'testcontainers'
import ora from 'ora'
import { FixtureProtocol } from './type'
import type { ImageConfiguration } from '../../configuration/type'
import { prs } from '@/util'

export const replaceEnv = (
	env: Record<string, string>,
	t: tc.StartedTestContainer
) =>
	pipe(
		Object.entries(env).map(([key, value]) => [
			key,
			value === '$CONTAINER_HOST'
				? t.getHost()
				: value.startsWith('$CONTAINER_PORT')
					? 'bleh'
					: value
		]),
		Object.fromEntries
	)

const spinner = async <T>(color: ora.Color, fn: () => Promise<T>) => {
	const spinner = ora().start()
	try {
    spinner!.color = color

    return await fn()
	} finally {
    spinner!.stop()
	}
}

export const ImageProtocol: FixtureProtocol<
  ImageConfiguration,
  tc.StartedTestContainer
> = {
	async start(configuration) {
		return await spinner('green', async () => {
			let container = new tc.GenericContainer(configuration.image)
			container = container.withExposedPorts(...configuration['expose-ports'])

			if (configuration.wait) {
				if ('listening-port' in configuration.wait)
					container = container.withWaitStrategy(tc.Wait.forListeningPorts())

				if ('timeout' in configuration.wait)
					container = container.withStartupTimeout(configuration.wait.timeout)
			}

			return await container.start()
		})
	},

	async tap({ env }, container) {
		await prs.makeRun()(
			['printenv', 'REDIS_HOST'],
			Object.assign({}, replaceEnv(env, container), process.env)
		)
		return container
	},

	async stop(container) {
		await spinner('yellow', async () => await container?.stop())
	}
}
