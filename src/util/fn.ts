export const tossP =
  <A, B>(f: (a: A) => Promise<B>) =>
  (a: A) =>
    f(a).then(() => a)

const DEFAULT = '_'
type MatchW<A, _Tag extends string, X, R> = (
  p: Extract<A, { [_tag in _Tag]: X }>
) => R

interface DefaultCase {
  readonly _tag: typeof DEFAULT
  readonly value: unknown
}
interface DefaultCase {
  readonly [DEFAULT]: () => unknown
}

export const match: <_Tag extends string>(
  _tag: _Tag
) => {
  <
    A extends { [X in _Tag]: string | number | typeof DEFAULT },
    K extends { [X in A[_Tag]]: MatchW<A, _Tag, X, unknown> }
  >(
    k: K
  ): (match: A) => ReturnType<K[keyof K]> | DefaultCase
} = (_tag) => (k: any) => (match: any | DefaultCase) =>
  k?.[match?.[_tag]] ? k[match[_tag]](match) : k[DEFAULT](match)
