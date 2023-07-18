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
