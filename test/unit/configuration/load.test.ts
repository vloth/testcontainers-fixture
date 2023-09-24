import { stubThunk, equals, ok, stub } from 'test/aux'
import { E, TE } from '@/common'
import * as Util from '@/src/util'
import * as ConfigLoad from '@/src/configuration/load'
import YAML from 'yaml'
import { OpError, toError } from '@/src/errors'
import * as TypeCodec from '@/src/configuration/type'

const innerError = Error('stub')
const leftError = (tag: OpError['_tag']) => TE.left(toError(tag)(innerError))() 
const load = async () => (await ConfigLoad.load('<file>'))()

suite('configuration/load #error')

const { makeStub, stub: fs} = stubThunk(Util.fs)
beforeEach(makeStub)

test('miss', async function () {
	fs.access.returns(TE.left(innerError))

	equals(await load(), await leftError('ConfigMiss'))

})

test('read', async function () {
	fs.access.returns(TE.right(undefined))
	fs.slurp.returns(TE.left(innerError))

	equals(await load(), await leftError('ConfigRead'))
})

test('yaml', async function () {
	fs.access.returns(TE.right(undefined))
	fs.slurp.returns(TE.right('foo: - bar\nbaz'))

	equals((await load())._tag, (await leftError('ConfigParse'))._tag)
})

test('decode', async function () {
	fs.access.returns(TE.right(undefined))
	fs.slurp.returns(TE.right('foo: bar'))

	const result = await load()

	ok(E.isLeft(result))
	equals(result.left._tag, 'ConfigFormat')
})


suite('configuration/load #success')

beforeEach(makeStub)

test('load', async function () {
	fs.access.returns(TE.right(undefined))
	fs.slurp.returns(TE.right('foo: bar'))

	stub(YAML).parse.returns({})
	stub(TypeCodec).isImage.returns(true)
	stub(TypeCodec.ImageConfiguration).decode.returns({} as any)

	const result = await load()
	equals(result, {})
})
