import { ps } from '@/util'
import { ok } from 'test/aux'

const delay = (ts: number) => new Promise((resolve) => setTimeout(resolve, ts))

suite('utils/promise')

test('cancellable promise', async () => {
	const { signal , cancel } = ps.newSignal()
	try {
		const promise = ps.from(signal, delay(500))
	  setTimeout(cancel, 1)
	  await promise
		ok(false, 'Promise not cancelled')
	} catch (err) {
		ok(err)
	}
})
