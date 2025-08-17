import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './providers/ThemeProvider'
import { QueryProvider } from './providers/QueryProvider'
import { WalletProvider } from './providers/WalletProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="coinlens-theme">
      <WalletProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </WalletProvider>
    </ThemeProvider>
  </StrictMode>,
)