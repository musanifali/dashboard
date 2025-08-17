import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { CoinRow } from './CoinRow'
import { http } from '@/lib/http'

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

interface CoinsTableProps {
  currency: string
  watchlist: string[]
  onToggleWatchlist: (coinId: string) => void
  onCoinClick: (coin: Coin) => void
  filterWatchlist?: boolean
}

export function CoinsTable({ 
  currency, 
  watchlist, 
  onToggleWatchlist, 
  onCoinClick,
  filterWatchlist = false 
}: CoinsTableProps) {
  const { data: coins, isLoading, error } = useQuery({
    queryKey: ['coins', currency],
    queryFn: async (): Promise<Coin[]> => {
      try {
        const response = await http.get('/coins/markets', {
          params: {
            vs_currency: currency,
            order: 'market_cap_desc',
            per_page: 15,
            page: 1,
            sparkline: true,
            price_change_percentage: '1h,24h,7d',
          },
        })
        return response.data
      } catch (err) {
        console.error('Coins fetch error:', err)
        throw err
      }
    },
    retry: 3,
    retryDelay: 1000,
  })

  if (error) {
    console.error('Coins table error:', error)
  }

  const displayCoins = filterWatchlist && coins 
    ? coins.filter(coin => watchlist.includes(coin.id))
    : coins

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!displayCoins?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {filterWatchlist ? 'No coins in watchlist' : 'No coins found'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 sm:w-12"></TableHead>
            <TableHead className="w-8 sm:w-16">#</TableHead>
            <TableHead className="min-w-32">Coin</TableHead>
            <TableHead className="min-w-20">Price</TableHead>
            <TableHead className="hidden sm:table-cell">1h</TableHead>
            <TableHead>24h</TableHead>
            <TableHead className="hidden md:table-cell">7d</TableHead>
            <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
            <TableHead className="hidden xl:table-cell">Volume</TableHead>
            <TableHead className="hidden lg:table-cell w-24">Last 7 Days</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {displayCoins.map((coin) => (
          <CoinRow
            key={coin.id}
            coin={coin}
            currency={currency}
            isWatchlisted={watchlist.includes(coin.id)}
            onToggleWatchlist={onToggleWatchlist}
            onRowClick={onCoinClick}
          />
        ))}
      </TableBody>
    </Table>
    </div>
  )
}