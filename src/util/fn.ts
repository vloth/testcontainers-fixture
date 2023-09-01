export const tapP =
  <A, B>(f: (a: A) => Promise<B>) =>
  (a: A) =>
    f(a).then(() => a)
