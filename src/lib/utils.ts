/**
 * Formats duration in seconds to a human-readable string (HH:MM:SS)
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(hours.toString().padStart(2, '0'));
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(secs.toString().padStart(2, '0'));

  return parts.join(':');
};

/**
 * Utility function to calculate duration between two dates in seconds
 * @param start - Start date
 * @param end - End date (defaults to now if not provided)
 * @returns Duration in seconds
 */
export const calculateDuration = (
  start: Date,
  end: Date = new Date()
): number => {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
};
