import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BuildingProvider from './contexts/BuildingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BuildingProvider>
    <App />
    </BuildingProvider>
  </StrictMode>,
)
