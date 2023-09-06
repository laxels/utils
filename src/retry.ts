import { logDebug } from './log';
import { msToSeconds } from './time';
import { wait } from './wait';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_RETRY_DELAY_MS = 1000;
const DEFAULT_MAX_JITTER_MS = 1000;

type ExponentialBackoffParams = {
  maxRetries?: number;
  initialRetryDelayMS?: number;
  maxJitterMS?: number;
  onError?: (err: unknown) => void;
};

export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  {
    maxRetries = DEFAULT_MAX_RETRIES,
    initialRetryDelayMS = DEFAULT_INITIAL_RETRY_DELAY_MS,
    maxJitterMS = DEFAULT_MAX_JITTER_MS,
    onError
  }: ExponentialBackoffParams = {
    maxRetries: DEFAULT_MAX_RETRIES,
    initialRetryDelayMS: DEFAULT_INITIAL_RETRY_DELAY_MS,
    maxJitterMS: DEFAULT_MAX_JITTER_MS
  }
): Promise<T> {
  let retryCount = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      onError?.(err);
      logDebug(`Task failed with error: ${err}`);
      if (!shouldRetry()) {
        throw err;
      }
      await waitBeforeRetry();
      retryCount++;
    }
  }

  function shouldRetry(): boolean {
    return retryCount < maxRetries;
  }

  async function waitBeforeRetry(): Promise<void> {
    const exponentialMultiplier = Math.pow(2, retryCount);
    const jitterMS = Math.floor(Math.random() * maxJitterMS);
    const delayMS = (initialRetryDelayMS + jitterMS) * exponentialMultiplier;
    logDebug(`Waiting ${msToSeconds(delayMS)}s before retrying...`);
    await wait(delayMS);
  }
}
