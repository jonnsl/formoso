
import { KeyboardEvent } from 'react'

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
