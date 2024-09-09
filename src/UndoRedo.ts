
import { useCallback, useRef, useState } from 'react'
import { splice } from './Immutable'

// TIME_TO_COMMIT = Time to wait before consecutive commits to the history. (in milliseconds)

export default function useUndoRedo<T> (initialData: T, TIME_TO_COMMIT: number = 500): [T, React.Dispatch<React.SetStateAction<T>>, () => void, () => void, React.Dispatch<React.SetStateAction<T>>] {
  const [data, setData] = useState<T>(initialData)
  const lastUpdatedAt = useRef<number>(Date.now())
  const history = useRef<T[]>([])
  const historyPosition = useRef(0)

  const setDataAndUpdatedAt = useCallback(function update (newData: T | React.SetStateAction<T>): void {
    lastUpdatedAt.current = Date.now()
    setData(newData)
  }, [])

  const commitToHistory = useCallback(function commitToHistory (): void {
    if (revIndex(history.current, historyPosition.current) === data) {
      return
    }

    history.current = insertAt(history.current, history.current.length - historyPosition.current, data)
    historyPosition.current = 0
  }, [data])

  const debouncedCommitToHistory = useCallback(function debouncedCommitToHistory (): void {
    const now = Date.now()
    if (lastUpdatedAt.current + TIME_TO_COMMIT > now) {
      return
    }

    return commitToHistory()
  }, [commitToHistory])

  const saveData = useCallback(function (newData: T | React.SetStateAction<T>): void {
    debouncedCommitToHistory()
    setDataAndUpdatedAt(newData)
  }, [debouncedCommitToHistory])

  const saveDataNow = useCallback(function (newData: T | React.SetStateAction<T>): void {
    setDataAndUpdatedAt(newData)
    commitToHistory()
  }, [commitToHistory])

  const undo = useCallback(function undo (): void {
    // We need to make sure that all changes were added to the history in case the last change was debounced.
    commitToHistory()

    // Check if there is a previous state to go to
    const canUndo = (historyPosition.current + 1) >= history.current.length
    if (canUndo) {
      return
    }

    historyPosition.current = historyPosition.current + 1
    setData(revIndex(history.current, historyPosition.current))
  }, [commitToHistory])

  const redo = useCallback(function redo (): void {
    const canRedo = historyPosition.current <= 0
    if (canRedo) {
      return
    }

    historyPosition.current = historyPosition.current - 1
    setData(revIndex(history.current, historyPosition.current))
  }, [])

  return [
    data,
    saveData,
    undo,
    redo,
    saveDataNow,
  ]
}

// Access a array item in reverse order
function revIndex<T> (arr: ReadonlyArray<T>, index: number): T {
  return arr[arr.length - 1 - index]
}

/**
 * Inserts an item at position index and removes all subsequent items
 */
function insertAt<T> (arr: ReadonlyArray<T>, index: number, item: T): Array<T> {
  return splice(arr, index, arr.length - index, item)
}
