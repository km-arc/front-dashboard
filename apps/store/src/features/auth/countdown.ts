/** Whole seconds until `readyAt` (milliseconds since the epoch), never below 0. */
export function secondsLeft(readyAt: number, now: number): number {
  return Math.max(0, Math.ceil((readyAt - now) / 1000));
}
