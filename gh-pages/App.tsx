
import './index.css'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client';
import FormBuilder from '../src/index'
import { Page, emptyPage } from '../src/Page';

export default function App() {
  const [pages, setPages] = useState<Page[]>([emptyPage()])

  return (
    <FormBuilder pages={pages} onChange={setPages} />
  )
}

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
