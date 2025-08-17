import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CoinsTable } from './CoinsTable'

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

interface WatchlistProps {
  currency: string
  watchlist: string[]
  onToggleWatchlist: (coinId: string) => void
  onCoinClick: (coin: Coin) => void
}

export function Watchlist({ currency, watchlist, onToggleWatchlist, onCoinClick }: WatchlistProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
        <TabsTrigger value="all" className="text-xs sm:text-sm">All Coins</TabsTrigger>
        <TabsTrigger value="watchlist" className="text-xs sm:text-sm">
          <span className="hidden sm:inline">Watchlist ({watchlist.length})</span>
          <span className="sm:hidden">★ {watchlist.length}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4 sm:mt-6">
        <CoinsTable
          currency={currency}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          onCoinClick={onCoinClick}
        />
      </TabsContent>
      
      <TabsContent value="watchlist" className="mt-4 sm:mt-6">
        <CoinsTable
          currency={currency}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          onCoinClick={onCoinClick}
          filterWatchlist={true}
        />
      </TabsContent>
    </Tabs>
  )
}