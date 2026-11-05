import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applySiteTheme, readSiteTheme } from './site-theme'

applySiteTheme(readSiteTheme())

// Keep previously shared community section links working after the move.
if (window.location.pathname === '/' && window.location.hash === '#community') {
  window.location.replace('/community/')
} else createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
