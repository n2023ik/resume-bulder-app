import React from 'react'
import { createRoot } from 'react-dom/client'
import ResumeBuilder from './app.jsx'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ResumeBuilder />
  </React.StrictMode>
)
