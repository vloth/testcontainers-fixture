type MetaError = { error: unknown }

export type Error =
  | ({ _tag: 'config.miss' } & MetaError)
  | ({ _tag: 'config.read' } & MetaError)
  | ({ _tag: 'config.parse' } & MetaError)
  | ({ _tag: 'config.format' } & MetaError)
  | ({ _tag: 'protocol.start' } & MetaError)
  | ({ _tag: 'protocol.tap' } & MetaError)
  | ({ _tag: 'protocol.stop' } & MetaError)

export const toTaggedError =
  (tag: Error['_tag']) =>
  (error: unknown): Error => ({
    _tag: tag,
    error
  })
