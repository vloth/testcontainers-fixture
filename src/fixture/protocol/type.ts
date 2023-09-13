export type FixtureProtocol<C, T> = {
  start(configuration: C): Promise<T>
  tap(resource: T): Promise<T>
  stop(resource: T | undefined): Promise<void>
}
