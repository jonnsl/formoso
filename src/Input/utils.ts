
import { KeyboardEvent, ClipboardEvent } from 'react'

export function normalizeInputName (value: string): string {
  return value
    .replace(/\s+/g, '_')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9_]/g, '')
    .trim()
}

export function inputNameConstraints (e: KeyboardEvent<HTMLInputElement>) {
  const selectionStart = e.currentTarget.selectionStart || 0
  const key = e.key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (
    key === '_' ||
    (key >= 'a' && key <= 'z') ||
    (key >= 'A' && key <= 'Z') ||
    (key === ' ' && selectionStart > 0) ||
    ((key >= '0' && key <= '9') && selectionStart > 0)) {
    return
  }
  e.preventDefault()
}

/**
 * If the pasted data is a table extracts the first column and returns an array of strings from each row from the first column.
 */
export function pasteToList (e: ClipboardEvent<HTMLInputElement>): string[] | null {
  e.preventDefault()
  const html = e.clipboardData.getData('text/html')
  const plainText = e.clipboardData.getData('text/plain')

  if (html) {
    const domparser = new DOMParser()
    const doc = domparser.parseFromString(html, 'text/html')
    const table = doc.body.firstElementChild

    // If the first element of the body is not a table
    if (!(table instanceof HTMLTableElement)) {
      const text = doc.body.innerText
      return text.split('\n').map(s => s.trim()).filter(s => s !== '')
    }

    const firstTBody = table.tBodies[0]
    if (firstTBody === undefined) {
      return null
    }

    return Array.from(firstTBody.children)
      .map(tr => tr.firstElementChild instanceof HTMLElement ? tr.firstElementChild.innerText.trim() : '')
      .filter(s => s !== '')
  } else if (plainText) {
    return plainText.split('\n').map(s => s.trim()).filter(s => s !== '')
  }

  return null
}
