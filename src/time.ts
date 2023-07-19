const SECOND_IN_MINUTE = 60;
const MINUTE_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const DAY_IN_WEEK = 7;

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * SECOND_IN_MINUTE;
const MS_IN_HOUR = MS_IN_MINUTE * MINUTE_IN_HOUR;
const MS_IN_DAY = MS_IN_HOUR * HOUR_IN_DAY;
const MS_IN_WEEK = MS_IN_DAY * DAY_IN_WEEK;

export function msToSeconds(ms: number): number {
  return roundToHundredths(ms / MS_IN_SECOND);
}

function roundToHundredths(x: number): number {
  return Math.round(x * 100) / 100;
}

export function now(): number {
  return Date.now();
}
