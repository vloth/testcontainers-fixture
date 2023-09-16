import { t, pipe, reporter } from '@/common'
import { fn } from '@/util'

export type EveryError = OpError | DecodeError

type DecodeError = { _tag: 'ConfigFormat'; error: t.Errors }

export type OpError = (
  | { _tag: 'ConfigMiss' }
  | { _tag: 'ConfigRead' }
  | { _tag: 'ConfigParse' }
  | { _tag: 'protocol.start' }
  | { _tag: 'protocol.tap' }
  | { _tag: 'protocol.stop' }
  | { _tag: 'protocol.stop' }
  | { _tag: 'PromiseCancel' }
) & { error: unknown }

export const toError =
  (tag: OpError['_tag']) =>
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

const isCancelled = (
  anError: any
): anError is Extract<OpError, { _tag: 'PromiseCancel' }> =>
  '_tag' in anError && anError._tag === 'PromiseCancel'

export const toString = (error: EveryError): string =>
  pipe(
    error,
    fn.match('_tag')({
      PromiseCancel: () => 'Operation was cancelled',

      ConfigMiss: () =>
        'Configuration ".testcontainer-fixutre.rc" file not kound',

      ConfigRead: ({ error }) => `Error reading configuration file:\n${error}`,

      ConfigParse: ({ error }) => `Error parsing configuration:\n${error}`,

      ConfigFormat: ({ error }) =>
        `Error format: ${reporter.formatValidationErrors(error)}`,

      'protocol.start': ({ error }) =>
        isCancelled(error) ? toString(error) : 'Start error',

      'protocol.tap': ({ error }) =>
        isCancelled(error) ? toString(error) : 'Tap error',

      'protocol.stop': () => 'protocol stop',

      default: '<#error!>'
    })
  )
