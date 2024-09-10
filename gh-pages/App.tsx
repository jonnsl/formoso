
import './index.css'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client';
import FormBuilder from '../src/index'
import { Page } from '../src/Page';
import useUndoRedo from '../src/UndoRedo'
import initialForm from './example01.json'

export default function App() {
  const [pages, setPages, undo, redo] = useUndoRedo<Page[]>(initialForm)

  useEffect(function () {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey === true && e.key === 'z') {
        e.preventDefault()
        undo()
      } else if (e.ctrlKey === true && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [undo, redo])

  return (
    <FormBuilder pages={pages} onChange={setPages} />
  )
}

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
