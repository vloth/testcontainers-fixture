export type FixtureProtocol<C, T> = {
  start(configuration: C): Promise<T>
  tap(configuration: C, resource: T): Promise<T>
  stop(resource: T | undefined): Promise<void>
}
