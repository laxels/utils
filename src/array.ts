import { Maybe, isNotNullish } from './types';

export function compact<T>(xs: Maybe<T>[]): T[] {
  return xs.filter(isNotNullish);
}

export function drop<T>(xs: T[], n = 1): T[] {
  return xs.slice(n);
}

export function dropRight<T>(xs: T[], n = 1): T[] {
  return xs.slice(0, xs.length - n);
}

export function map<T, U>(fn: (x: T) => U): (xs: T[]) => U[] {
  return (xs: T[]) => xs.map(fn);
}

export function filter<T>(fn: (x: T) => unknown): (xs: T[]) => T[] {
  return (xs: T[]) => xs.filter(fn);
}

export function reduce<T, U>(fn: (acc: U, x: T) => U, init: U): (xs: T[]) => U {
  return (xs: T[]) => xs.reduce(fn, init);
}
