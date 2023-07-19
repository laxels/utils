export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  return a / b;
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max));
}

const isPrimeCache = new Map<number, boolean>();
export function isPrime(x: number): boolean {
  const cached = isPrimeCache.get(x)!;
  if (cached != null) {
    return cached;
  }
  const result = _isPrime(x);
  isPrimeCache.set(x, result);
  return result;
}

function _isPrime(x: number): boolean {
  if (x <= 1 || x % 1 !== 0) {
    return false;
  }

  let p = 2;
  while (p <= Math.sqrt(x)) {
    if (x % p === 0) {
      return false;
    }
    p++;
  }

  return true;
}
