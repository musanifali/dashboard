import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Sparkline } from './Sparkline'
import { formatCurrency, formatCompact, formatPercent } from '@/lib/format'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

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

interface CoinRowProps {
  coin: Coin
  currency: string
  isWatchlisted: boolean
  onToggleWatchlist: (coinId: string) => void
  onRowClick: (coin: Coin) => void
}

export function CoinRow({ coin, currency, isWatchlisted, onToggleWatchlist, onRowClick }: CoinRowProps) {
  const formatChange = (change: number | undefined) => {
    if (change === undefined) return null
    return (
      <Badge variant={change >= 0 ? 'success' : 'danger'} className="text-xs">
        {change >= 0 ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {formatPercent(Math.abs(change))}
      </Badge>
    )
  }

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onRowClick(coin)}
    >
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 sm:h-6 sm:w-6"
          onClick={(e) => {
            e.stopPropagation()
            onToggleWatchlist(coin.id)
          }}
        >
          <Star className={`h-3 w-3 sm:h-4 sm:w-4 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </Button>
      </TableCell>
      <TableCell className="font-medium text-xs sm:text-sm">{coin.market_cap_rank}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src={coin.image} 
            alt={coin.name} 
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" 
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://via.placeholder.com/32/6366f1/ffffff?text=${coin.symbol.charAt(0)}`
            }}
          />
          <div>
            <div className="font-medium text-sm sm:text-base">{coin.name}</div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase">{coin.symbol}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm sm:text-base">
        {formatCurrency(coin.current_price, currency.toUpperCase())}
      </TableCell>
      <TableCell className="hidden sm:table-cell">{formatChange(coin.price_change_percentage_1h_in_currency)}</TableCell>
      <TableCell>{formatChange(coin.price_change_percentage_24h_in_currency)}</TableCell>
      <TableCell className="hidden md:table-cell">{formatChange(coin.price_change_percentage_7d_in_currency)}</TableCell>
      <TableCell className="hidden lg:table-cell text-sm">{formatCurrency(coin.market_cap, currency.toUpperCase())}</TableCell>
      <TableCell className="hidden xl:table-cell text-sm">{formatCompact(coin.total_volume)}</TableCell>
      <TableCell className="hidden lg:table-cell w-24">
        <Sparkline 
          data={coin.sparkline_in_7d.price} 
          color={coin.price_change_percentage_7d_in_currency && coin.price_change_percentage_7d_in_currency >= 0 ? '#10b981' : '#ef4444'}
        />
      </TableCell>
    </TableRow>
  )
}