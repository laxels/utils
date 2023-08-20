type WakeLock = {
  request: (type: WakeLockType) => Promise<WakeLockSentinel>;
};

type WakeLockType = `screen`;

type WakeLockSentinel = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (event: WakeLockEvent, handler: () => void) => void;
};

type WakeLockEvent = `release`;

let wakeLock: WakeLockSentinel | null = null;

export async function preventSleep(): Promise<void> {
  await resetWakeLock();
  document.addEventListener(`visibilitychange`, async () => {
    const tabIsActive = document.visibilityState === `visible`;
    if (tabIsActive) {
      await resetWakeLock();
    }
  });
}

async function resetWakeLock(): Promise<void> {
  if (wakeLock != null) {
    await releaseWakeLock();
  }
  await acquireWakeLock();
}

async function acquireWakeLock(): Promise<void> {
  if (!(`wakeLock` in navigator)) {
    return;
  }
  try {
    wakeLock = await (navigator.wakeLock as WakeLock).request(`screen`);
  } catch (err) {
    console.error(`Error requesting wake lock: ${err}`);
  }
}

async function releaseWakeLock(): Promise<void> {
  try {
    await wakeLock?.release();
  } catch (err) {
    console.error(`Error releasing wake lock: ${err}`);
  }
}
