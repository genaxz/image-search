/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
