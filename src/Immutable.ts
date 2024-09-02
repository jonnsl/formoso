
/**
 * Inserts an item at position index
 */
export function addAt<T> (arr: ReadonlyArray<T>, index: number, ...item: ReadonlyArray<T>): Array<T> {
  return splice(arr, index, 0, ...item)
}

/**
 * Removes or replaces existing elements and/or adding new elements
 */
export function splice<T> (arr: ReadonlyArray<T>, start: number, deleteCount: number, ...items: ReadonlyArray<T>): Array<T> {
  const copy = arr.concat()
  copy.splice(start, deleteCount, ...items)
  return copy
}

/**
 * Removes existing element
 */
export function remove<T> (arr: ReadonlyArray<T>, index: number): Array<T> {
  const copy = arr.concat()
  copy.splice(index, 1)
  return copy
}

type mapFn<T> = ((v: T, k: number) => T)
export function replaceBetween<T> (arr: ReadonlyArray<T>, start: number, finish: number, item: T | mapFn<T>): Array<T> {
  const deleteCount = finish - start + 1
  const fakeArray: ArrayLike<T> = { length: deleteCount }
  const mapFn: mapFn<T> = typeof item === 'function' ? item as mapFn<T> : () => item
  const items = Array.from<T, T>(fakeArray, mapFn)
  return splice(arr, start, deleteCount, ...items)
}

/**
 * Copia uma array substituindo o valor em `index` por `replacement`
 */
export function replaceAt<T> (arr: ReadonlyArray<T>, index: number, replacement: T): Array<T>
export function replaceAt<T> (arr: ReadonlyArray<T>, index: number, replacement: findReplaceReplacer<T>): Array<T>
export function replaceAt<T> (arr: ReadonlyArray<T>, index: number, replacement: any): Array<T> {
  if (typeof replacement === 'function') {
    return arr.map((value, key) => key === index ? replacement(value) : value)
  }
  return arr.map((value, key) => key === index ? replacement : value)
}


export type findReplaceFinder<T> = (value: T, key: number) => boolean
export type findReplaceReplacer<T> = (value: T) => T

export function findReplace<T> (arr: ReadonlyArray<T>, find: T, replace: T): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: T, replace: findReplaceReplacer<T>): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: findReplaceFinder<T>, replace: T): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: findReplaceFinder<T>, replace: findReplaceReplacer<T>): Array<T>
export function findReplace<T> (arr: ReadonlyArray<T>, find: any, replace: any): Array<T> {
  if (typeof find !== 'function') {
    find = (value: T) => value === find
  }
  if (typeof replace !== 'function') {
    replace = () => replace
  }
  return arr.map((value, key) => find(value, key) ? replace(value) : value)
}
