import * as tc from 'testcontainers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any

type Config = TODO

type ConfigEntry<T> = [string, T]

type CreateConfigFn<T = string> = (
  tuple: ConfigEntry<T>,
  config: Config
) => tc.TestContainer

type ApplyConfigFn<T = string> = (
  container: tc.TestContainer,
  tuple: ConfigEntry<T>,
  config: Config
) => tc.TestContainer

export const container: CreateConfigFn = ([, value]) =>
  new tc.GenericContainer(value)

export const expose_ports: ApplyConfigFn = (container, [, value]) =>
  container.withExposedPorts(Number.parseInt(value, 10))

export const env: ApplyConfigFn<string[]> = (container, [, values]) => {
  values.forEach((env) => {
    process.env[env] = 
  })
  return container
}
