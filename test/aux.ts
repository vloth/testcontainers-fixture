import sinon from 'ts-sinon'
import * as assert from 'assert'

export function ok(value: unknown, message?: string | Error): asserts value {
	assert.ok(value, message)
}

export function equals<T>(actual: unknown, expected: T, message?: string | Error)
  : asserts actual is T {
	assert.deepStrictEqual(actual, expected, message)
}

export const restoreStubs = sinon.restore

export function stub<T>(t: T) {
	for (const method in t) sinon.stub(t, method)
	return t as sinon.SinonStubbedInstance<T>
}

export function stubThunk<T>(t: T) {
	const _t = t
	return {
		get stub() { return _t as sinon.SinonStubbedInstance<T> },
		makeStub: () => stub(t),
	}
}
export { sinon }

