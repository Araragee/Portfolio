import { onBeforeUnmount } from 'vue'

/**
 * Auto-cleanup event listener. Handler attached on mount, removed on unmount.
 * Prevents memory leaks from window/document listeners.
 */
export function useEventListener(
  target: EventTarget | null,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
) {
  if (target) {
    target.addEventListener(event, handler, options)
  }

  onBeforeUnmount(() => {
    target?.removeEventListener(event, handler, options)
  })
}
