const LOG_LEVELS = [`default`, `debug`] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

let logLevel: LogLevel = `default`;

export function setLogLevel(level: LogLevel): void {
  logLevel = level;
}

export function log(x: any = ``): void {
  console.log(x);
}

export function logDebug(x: any = ``): void {
  if (logLevel !== `debug`) {
    return;
  }
  console.debug(x);
}
