import { chain, identity } from './function';
import { randomInt } from './math';
import { Maybe, isNotNullish } from './types';

export function compact<T>(xs: Maybe<T>[]): T[] {
  return xs.filter(isNotNullish);
}

export function first<T>(xs: T[]): Maybe<T> {
  return xs[0];
}

export function last<T>(xs: T[]): Maybe<T> {
  return xs[xs.length - 1];
}

export function initial<T>(xs: T[]): T[] {
  return dropRight<T>()(xs);
}

export function tail<T>(xs: T[]): T[] {
  return drop<T>()(xs);
}

export function take<T>(n = 1): (xs: T[]) => T[] {
  return (xs: T[]) => xs.slice(0, n);
}

export function takeRight<T>(n = 1): (xs: T[]) => T[] {
  return (xs: T[]) => xs.slice(xs.length - n);
}

export function drop<T>(n = 1): (xs: T[]) => T[] {
  return (xs: T[]) => xs.slice(n);
}

export function dropRight<T>(n = 1): (xs: T[]) => T[] {
  return (xs: T[]) => xs.slice(0, xs.length - n);
}

export function map<T, U>(fn: (x: T) => U): (xs: T[]) => U[] {
  return (xs: T[]) => xs.map(fn);
}

export function reduce<T, U>(fn: (acc: U, x: T) => U, init: U): (xs: T[]) => U {
  return (xs: T[]) => xs.reduce(fn, init);
}

export function filter<T>(fn: (x: T) => unknown): (xs: T[]) => T[] {
  return (xs: T[]) => xs.filter(fn);
}

export function reject<T>(fn: (x: T) => unknown): (xs: T[]) => T[] {
  return (xs: T[]) => xs.filter((x) => !fn(x));
}

export function find<T>(fn: (x: T) => unknown): (xs: T[]) => Maybe<T> {
  return (xs: T[]) => xs.find(fn);
}

export function findIndex<T>(fn: (x: T) => unknown): (xs: T[]) => number {
  return (xs: T[]) => xs.findIndex(fn);
}

export function some<T>(fn: (x: T) => unknown): (xs: T[]) => boolean {
  return (xs: T[]) => xs.some(fn);
}

export function every<T>(fn: (x: T) => unknown): (xs: T[]) => boolean {
  return (xs: T[]) => xs.every(fn);
}

export function includes<T>(x: T): (xs: T[]) => boolean {
  return (xs: T[]) => xs.includes(x);
}

export function shuffle<T>(xs: T[]): T[] {
  const result = [...xs];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function sample<T>(n = 1): (xs: T[]) => T[] {
  return (xs: T[]) => chain(xs, shuffle, take<T>(n));
}

export function flat<T>(xs: Array<T | T[]>): T[] {
  const result: T[] = [];

  for (const x of xs) {
    if (Array.isArray(x)) {
      result.push(...x);
    } else {
      result.push(x);
    }
  }

  return result;
}

export function flatMap<T, U>(fn: (x: T) => U | U[]): (xs: T[]) => U[] {
  return (xs: T[]) => chain(xs, map(fn), flat<U>);
}

export function unique<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U
): (xs: T[]) => T[] {
  return (xs: T[]) => {
    const result: T[] = [];
    const seen = new Set<U>();

    for (const x of xs) {
      const val = iteratee(x);
      if (seen.has(val)) {
        continue;
      }
      result.push(x);
      seen.add(val);
    }

    return result;
  };
}

export function count<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U
): (xs: T[]) => Map<U, number> {
  return (xs: T[]) => {
    const countByItem = new Map<U, number>();

    for (const item of xs.map(iteratee)) {
      const count = countByItem.get(item) ?? 0;
      countByItem.set(item, count + 1);
    }

    return countByItem;
  };
}

export function group<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U
): (xs: T[]) => Map<U, T[]> {
  return (xs: T[]) => {
    const groupByItem = new Map<U, T[]>();

    for (const x of xs) {
      const item = iteratee(x);
      if (!groupByItem.has(item)) {
        groupByItem.set(item, []);
      }
      groupByItem.get(item)!.push(x);
    }

    return groupByItem;
  };
}

export type SortOrder = `asc` | `desc`;

export function sort<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U,
  order: SortOrder = `asc`
): (xs: T[]) => T[] {
  return (xs: T[]) =>
    [...xs].sort((a, b) => {
      const aVal = iteratee(a);
      const bVal = iteratee(b);

      if (aVal < bVal) {
        return order === `asc` ? -1 : 1;
      } else if (aVal > bVal) {
        return order === `asc` ? 1 : -1;
      } else {
        return 0;
      }
    });
}

export function difference<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U
): (xs: T[], ys: T[]) => T[] {
  return (xs: T[], ys: T[]) => {
    const ySet = new Set(ys.map(iteratee));
    return xs.filter((x) => !ySet.has(iteratee(x)));
  };
}

export function intersection<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U
): (xs: T[], ys: T[]) => T[] {
  return (xs: T[], ys: T[]) => {
    const ySet = new Set(ys.map(iteratee));
    return xs.filter((x) => ySet.has(iteratee(x)));
  };
}

export function union<T, U = T>(
  iteratee: (x: T) => U = identity as (x: T) => U
): (xs: T[], ys: T[]) => T[] {
  return (xs: T[], ys: T[]) => unique(iteratee)([...xs, ...ys]);
}

export function join<T>(separator = `,`): (xs: T[]) => string {
  return (xs: T[]) => xs.join(separator);
}

export function reverse<T>(xs: T[]): T[] {
  return [...xs].reverse();
}

export function zip<T, U>(xs: T[], ys: U[]): Array<[T, U]> {
  return xs.map((x, i) => [x, ys[i]]);
}

export function unzip<T, U>(zipped: Array<[T, U]>): [T[], U[]] {
  return [zipped.map(([x]) => x), zipped.map(([, y]) => y)];
}
