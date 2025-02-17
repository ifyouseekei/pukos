/**
 * A utility function to safely query an element and assign it.
 * Throws an error if the element is not found.
 *
 * @param selector - The CSS selector for the element.
 * @param errorMessage - Custom error message to throw if the element is not found.
 * @returns The selected DOM element cast to a specific type (HTML element).
 */
export function getOrThrowElement<T extends HTMLElement>(
  selector: string,
  errorMessage: string = 'Element not found'
): T {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(errorMessage);
  }
  return element as T;
}
