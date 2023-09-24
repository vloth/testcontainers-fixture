import { pipe } from '@/src/common'
import { fn } from '@/src/util'
import { equals } from 'test/aux'

suite('utils/fn')

type DOG_CAT = { type: 'Dog'; bark(): number  } | { type: 'Cat'; meow(): number }

const getPet = (): DOG_CAT => ({type: 'Dog', bark: () => 1 })

test('match', () => {
	equals(pipe(
		getPet(),
		fn.match('type')({
		  Dog: (dog) => dog.bark() + 1,
		  Cat: (cat) => cat.meow() - 1,
			default: +Infinity
		})
	), 2)
})
