import * as assert from 'assert'
import { sum } from '@/src/cli'

test('cli test', function () {
  assert.deepStrictEqual(sum(0, 1), 1)
})
