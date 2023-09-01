import { t, pipe, reporter } from '@/common'
import { fn } from '@/util'

export type EveryError = Error | DecodeError

type DecodeError = { _tag: 'ConfigFormat'; error: t.Errors }

export type Error = (
  | { _tag: 'ConfigMiss' }
  | { _tag: 'ConfigRead' }
  | { _tag: 'ConfigParse' }
  | { _tag: 'protocol.start' }
  | { _tag: 'protocol.tap' }
  | { _tag: 'protocol.stop' }
) & { error: unknown }

export const toError =
  (tag: Error['_tag']) =>
  (error: unknown): EveryError => ({
    _tag: tag,
    error
  })

export const toDecodeError =
  (tag: DecodeError['_tag']) =>
  (error: unknown): EveryError => ({
    _tag: tag,
    error: error as t.Errors
  })

export const toString = (error: EveryError) =>
  pipe(
    error,
    fn.match('_tag')({
      ConfigMiss: () =>
        'Configuration ".testcontainer-fixutre.rc" file not kound',

      ConfigRead: ({ error }) => `Error reading configuration file:\n${error}`,

      ConfigParse: ({ error }) => `Error parsing configuration:\n${error}`,

      ConfigFormat: ({ error }) =>
        `Error format: ${reporter.formatValidationErrors(error)}`,

      'protocol.start': () => 'protocol start',
      'protocol.tap': () => 'protocol tag',
      'protocol.stop': () => 'protocol stop'
    })
  )
