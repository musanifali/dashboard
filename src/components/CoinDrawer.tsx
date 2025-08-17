import { useQuery } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { http } from '@/lib/http'
import { formatCurrency, formatCompact } from '@/lib/format'
import { sanitizeHtml } from '@/lib/sanitize'
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'

interface CoinDetail {
  id: string
  name: string
  symbol: string
  image: { large: string }
  market_data: {
    current_price: Record<string, number>
    high_24h: Record<string, number>
    low_24h: Record<string, number>
    total_supply: number
    circulating_supply: number
    max_supply: number
    price_change_percentage_24h: number
  }
  description: { en: string }
  links: {
    homepage: string[]
    blockchain_site: string[]
  }
}

interface CoinDrawerProps {
  coinId: string | null
  currency: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoinDrawer({ coinId, currency, open, onOpenChange }: CoinDrawerProps) {
  const { data: coin, isLoading } = useQuery({
    queryKey: ['coin', coinId],
    queryFn: async (): Promise<CoinDetail> => {
      const response = await http.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      })
      return response.data
    },
    enabled: !!coinId,
  })

  if (!coinId) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : coin ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3 sm:gap-4">
                <img 
                  src={coin.image.large} 
                  alt={coin.name} 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://via.placeholder.com/48/6366f1/ffffff?text=${coin.symbol.charAt(0)}`
                  }}
                />
                <div>
                  <SheetTitle className="text-lg sm:text-xl">{coin.name}</SheetTitle>
                  <SheetDescription className="uppercase text-xs sm:text-sm">
                    {coin.symbol}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  {formatCurrency(coin.market_data.current_price[currency], currency.toUpperCase())}
                </div>
                <Badge
                  variant={coin.market_data.price_change_percentage_24h >= 0 ? 'success' : 'danger'}
                >
                  {coin.market_data.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">24h High</div>
                  <div className="font-semibold">
                    {formatCurrency(coin.market_data.high_24h[currency], currency.toUpperCase())}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Low</div>
                  <div className="font-semibold">
                    {formatCurrency(coin.market_data.low_24h[currency], currency.toUpperCase())}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Circulating Supply</div>
                  <div className="font-semibold">
                    {formatCompact(coin.market_data.circulating_supply)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Max Supply</div>
                  <div className="font-semibold">
                    {coin.market_data.max_supply ? formatCompact(coin.market_data.max_supply) : 'N/A'}
                  </div>
                </div>
              </div>

              {coin.description.en && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <div 
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: sanitizeHtml(coin.description.en.split('.')[0] + '.') 
                    }}
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {coin.links.homepage[0] && (
                    <a
                      href={coin.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {coin.links.blockchain_site.slice(0, 2).map((link, index) => (
                    link && (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Explorer <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}