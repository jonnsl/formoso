
import { RefObject, useEffect, useRef } from 'react'

export default function useAutoFocus (container: RefObject<HTMLElement>, items: unknown[]): void {
  const previousRef = useRef<unknown[]>()

  const focusItem = (index: number) => {
    if (container.current) {
      const el = container.current.childNodes[index]
      if (el && el instanceof HTMLElement) {
        el.querySelector('textarea')?.focus()
      }
    }
  }

  useEffect(() => {
    if (previousRef.current) {
      const prevItems = previousRef.current

      // Check if a new item was added
      if (prevItems.length < items.length) {
        for (let i = 0, l = items.length; i < l; i++) {
          if (prevItems[i] !== items[i]) {
            focusItem(i)
            break
          }
        }
      }

      // Check if a item was removed
      else if (prevItems.length > items.length) {
        for (let i = 0, l = prevItems.length; i < l; i++) {
          if (prevItems[i] !== items[i]) {
            focusItem(i === 0 ? 0 : i - 1)
            break
          }
        }
      }
    }

    return () => {
      previousRef.current = items
    }
  })
}
