export type OmitFirstArg<F> = F extends (x: unknown, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type Maybe<T> = T | null | undefined;

// Taken from https://stackoverflow.com/a/73939891
export type AllLess<T extends unknown[]> = T extends [...infer Head, unknown]
  ? AllLess<Head> | T
  : T;

// TupleSplit, TakeFirst, SkipFirst, and TupleSlice implementations
// are taken from https://stackoverflow.com/a/67605309
export type TupleSplit<T, N extends number, O extends unknown[] = []> = O['length'] extends N
  ? [O, T]
  : T extends [infer F, ...infer R]
  ? TupleSplit<[...R], N, [...O, F]>
  : [O, T];

export type TakeFirst<T extends unknown[], N extends number> = TupleSplit<T, N>[0];

export type SkipFirst<T extends unknown[], N extends number> = TupleSplit<T, N>[1];

export type TupleSlice<T extends unknown[], S extends number, E extends number> = SkipFirst<
  TakeFirst<T, E>,
  S
>;

export function isNullish<T>(x: Maybe<T>): x is null | undefined {
  return x == null;
}

export function isNotNullish<T>(x: Maybe<T>): x is T {
  return !isNullish(x);
}
