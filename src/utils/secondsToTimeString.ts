/**
 * Converts a given number of seconds into a human-readable time format (mm:ss).
 *
 * @param seconds - The total number of seconds to convert.
 * @returns A formatted string representing the time in "mm:ss" format.
 */
export function secondsToTimeString(seconds: number): string {
  // If seconds is invalid (non-numeric or negative), return a fallback value
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '--:--';
  }

  const minutes = Math.floor(seconds / 60); // Calculate full minutes
  const remainingSeconds = seconds % 60; // Remaining seconds

  // Format the time string with leading zeros for single-digit minutes or seconds
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}
