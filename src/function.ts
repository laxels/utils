// These type definitions are cumbersome and not complete.
// They will need to be extended to support longer chains.
//
// Unfortunately, an elegant, fully recursive type definition
// is unsupported by the latest version of TypeScript.
//
// While recursive type definitions are supported in recent TypeScript versions
// by deferring evaluation of the recursive type definition,
// the support breaks when the recursed type is spread like `[..., ...Chain]`,
// since TypeScript would need to eagerly evaluate the recursive type definition
// to be sure that it evaluates into an array type.
//
// See:
// - https://medium.com/ackee/typescript-function-composition-and-recurrent-types-a9efbc8e7736
// (Where the idea for these type definitions was taken from)
// - https://github.com/DefinitelyTyped/DefinitelyTyped/blob/64104e9760065bd498a3d62d98bb05ea26500dc2/types/lodash/common/util.d.ts#L209
// (Lodash's type definitions for an identical utility function)
// - https://github.com/typed-typings/npm-ramda/blob/3cf3d0dc69e01b70ab3043d206782b8ef125cca1/src/pipe.d.ts
// (Ramda's type definitions for an identical utility function)

type Chain<In, T1, T2, T3, T4, T5, Out> =
  | []
  | [(arg: In) => Out]
  | [(arg: In) => T1, ...Chain2<T1, T2, T3, T4, T5, Out>];
type Chain2<In, T1, T2, T3, T4, Out> =
  | []
  | [(arg: In) => Out]
  | [(arg: In) => T1, ...Chain3<T1, T2, T3, T4, Out>];
type Chain3<In, T1, T2, T3, Out> =
  | []
  | [(arg: In) => Out]
  | [(arg: In) => T1, ...Chain4<T1, T2, T3, Out>];
type Chain4<In, T1, T2, Out> = [] | [(arg: In) => Out] | [(arg: In) => T1, ...Chain5<T1, T2, Out>];
type Chain5<In, T1, Out> = [] | [(arg: In) => Out] | [(arg: In) => T1, ...Chain6<T1, Out>];
type Chain6<In, Out> = [] | [(arg: In) => Out];

export function chain<In, T1, T2, T3, T4, T5, Out>(
  x: In,
  ...fns: Chain<In, T1, T2, T3, T4, T5, Out>
): Out {
  return pipe(...fns)(x);
}

export function pipe<In, T1, T2, T3, T4, T5, Out>(
  ...fns: Chain<In, T1, T2, T3, T4, T5, Out>
): (x: In) => Out {
  return (x: In) => {
    const [fn1, ...rest] = fns;
    if (fn1 == null) {
      // Ideally, this type cast would be unnecessary, but to my knowledge,
      // TypeScript doesn't have a way of understanding that an empty `fns`
      // array means that Out = In.
      // While it may still be possible, it's probably not worth
      // complicating this function's type signature even further.
      return x as unknown as Out;
    }
    return pipe(...rest)(fn1(x) as T1);
  };
}

export function identity<T>(x: T): T {
  return x;
}
