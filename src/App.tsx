import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { Header } from './components/Header'
import { GlobalStats } from './components/GlobalStats'
import { Watchlist } from './components/Watchlist'
import { CoinDrawer } from './components/CoinDrawer'
import { WalletPanel } from './components/WalletPanel'

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap_rank: number
  market_cap: number
  total_volume: number
  price_change_percentage_1h_in_currency?: number
  price_change_percentage_24h_in_currency?: number
  price_change_percentage_7d_in_currency?: number
  sparkline_in_7d: { price: number[] }
}

function App() {
  const [currency, setCurrency] = useState(() => 
    localStorage.getItem('coinlens-currency') || 'usd'
  )
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('coinlens-watchlist')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('coinlens-currency', currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem('coinlens-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const toggleWatchlist = (coinId: string) => {
    setWatchlist(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    )
  }

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoinId(coin.id)
    setDrawerOpen(true)
  }

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoinId(coinId)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currency={currency}
        onCurrencyChange={setCurrency}
        onCoinSelect={handleCoinSelect}
      />
      
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col xl:flex-row gap-4 md:gap-8">
          <div className="flex-1">
            <GlobalStats currency={currency} />
            <Watchlist
              currency={currency}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              onCoinClick={handleCoinClick}
            />
          </div>
          
          <aside className="xl:w-80">
            <div className="xl:sticky xl:top-24">
              <WalletPanel />
            </div>
          </aside>
        </div>
      </main>

      <CoinDrawer
        coinId={selectedCoinId}
        currency={currency}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <Toaster />
    </div>
  )
}

export default App