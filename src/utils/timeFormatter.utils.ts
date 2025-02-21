/**
 * Converts a given number of seconds into a human-readable time format (mm:ss).
 *
 * @param seconds - The total number of seconds to convert.
 * @returns A formatted string representing the time in "mm:ss" format.
 */
export function secondsToMinuteString(seconds: number): string {
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

/**
 * Converts a given number of seconds into a human-readable time format.
 *
 * @example
 * secondsToFormattedTime(3601)   // "01:00:01"
 * secondsToFormattedTime(125)    // "02:05"
 * secondsToFormattedTime(45)     // "00:45"
 * secondsToFormattedTime(9)      // "00:09"
 * secondsToFormattedTime(-10)    // "--:--"
 *
 * @param seconds - The total number of seconds to convert.
 * @returns A formatted string in "hh:mm:ss" or "mm:ss" format.
 */
export function secondsToFormattedTime(seconds: number): string {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '--:--';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return hours > 0
    ? `${hours
        .toString()
        .padStart(2, '0')}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}
