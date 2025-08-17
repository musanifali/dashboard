import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { http } from '@/lib/http'
import { formatCurrency, formatPercent } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface GlobalData {
  data: {
    total_market_cap: Record<string, number>
    total_volume: Record<string, number>
    market_cap_percentage: Record<string, number>
    market_cap_change_percentage_24h_usd: number
  }
}

interface GlobalStatsProps {
  currency: string
}

export function GlobalStats({ currency }: GlobalStatsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['global'],
    queryFn: async (): Promise<GlobalData> => {
      try {
        const response = await http.get('/global')
        return response.data
      } catch (err) {
        console.error('Global stats fetch error:', err)
        throw err
      }
    },
    retry: 3,
    retryDelay: 1000,
  })

  if (error) {
    console.error('Global stats error:', error)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  const { total_market_cap, total_volume, market_cap_percentage, market_cap_change_percentage_24h_usd } = data.data
  const marketCap = total_market_cap[currency]
  const volume = total_volume[currency]
  const btcDominance = market_cap_percentage.btc

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Market Cap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">
            {formatCurrency(marketCap, currency.toUpperCase())}
          </div>
          <Badge
            variant={market_cap_change_percentage_24h_usd >= 0 ? 'success' : 'danger'}
            className="mt-2"
          >
            {market_cap_change_percentage_24h_usd >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {formatPercent(Math.abs(market_cap_change_percentage_24h_usd))}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            24h Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">
            {formatCurrency(volume, currency.toUpperCase())}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            BTC Dominance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">
            {formatPercent(btcDominance)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}