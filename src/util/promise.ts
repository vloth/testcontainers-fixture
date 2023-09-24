import { toError } from '../errors'

export type Signal = Promise<void>

export type SignalToken = {
  signal: Signal
  cancel(): void
}

export function newSignal(): SignalToken {
	const ret = {} as unknown as SignalToken
	ret.signal = new Promise((_, reject) => {
		ret.cancel = () => reject(toError('PromiseCancel')(Error('PromiseCancel')))
	})
	return ret
}

export function from<T>(signal: Signal, chained: Promise<T>): Promise<T> {
	return new Promise((resolve, reject) => {
		signal.catch(reject)
		return chained.then(resolve)
	})
}
