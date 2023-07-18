export type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type Maybe<T> = T | null | undefined;

export function isNullish<T>(x: Maybe<T>): x is null | undefined {
  return x == null;
}

export function isNotNullish<T>(x: Maybe<T>): x is T {
  return !isNullish(x);
}
