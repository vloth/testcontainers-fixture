import { prs } from '@/src/util'
import { sinon, equals, ok } from 'test/aux'

const makeRun = () => {
	const [out, err] = [sinon.stub(),sinon.stub()]
	return { run: prs.makeRun({out, err}), out, err }
}

suite('utils/process')

test('run #success', async () => {
	const { run, out, err } = makeRun()

	const code = await run(['expr', '1', '+', '1'])

	equals(code, 0)
	equals(out.getCall(0).args, ['2\n'])
	ok(!err.getCall(0))
})

test('run #error', async () => {
	const { run, out, err } = makeRun()

	const code = await run(['expr', '1', '+', 'f'])

	equals(code, 2)
	ok(!out.getCall(0))
	equals(err.getCall(0).args[0].substring(0,31), 'expr: not a decimal number: \'f\'')
})
