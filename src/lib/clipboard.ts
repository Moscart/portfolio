export interface ClipboardLike {
  writeText(value: string): Promise<void>;
}

export interface ResettableTimer {
  trigger(): void;
  cancel(): void;
}

/**
 * Copies text to the clipboard without ever throwing an unhandled rejection
 * when the Clipboard API is unavailable or denied.
 */
export async function copyTextSafely(
  text: string,
  clipboard: ClipboardLike | undefined = typeof navigator !== 'undefined'
    ? navigator.clipboard
    : undefined,
): Promise<boolean> {
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    return false;
  }

  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a debounced expiration timer that cleanly resets on rapid repeated triggers.
 */
export function createResettableTimer(durationMs: number, onExpire: () => void): ResettableTimer {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return {
    trigger() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        onExpire();
      }, durationMs);
    },
    cancel() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
}
