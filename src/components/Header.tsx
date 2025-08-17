import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Input } from '@/components/ui/input'
import { CurrencySelect } from './CurrencySelect'
import { ThemeToggle } from './ThemeToggle'
import { http } from '@/lib/http'
import { Search } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  symbol: string
  thumb: string
}

interface HeaderProps {
  currency: string
  onCurrencyChange: (currency: string) => void
  onCoinSelect: (coinId: string) => void
}

export function Header({ currency, onCurrencyChange, onCoinSelect }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async (): Promise<SearchResult[]> => {
      const response = await http.get('/search', {
        params: { query: searchQuery },
      })
      return response.data.coins.slice(0, 5)
    },
    enabled: searchQuery.length > 2,
  })

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (query: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          setSearchQuery(query)
          setShowResults(query.length > 2)
        }, 300)
      }
    })(),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleResultClick = (coinId: string) => {
    setShowResults(false)
    setSearchQuery('')
    onCoinSelect(coinId)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <h1 className="text-xl md:text-2xl font-bold">CoinLens</h1>
          
          <div className="relative hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                className="w-48 md:w-64 pl-10"
                onChange={handleSearchChange}
              />
            </div>
            
            {showResults && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50">
                {searchResults.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer"
                    onClick={() => handleResultClick(coin.id)}
                  >
                    <img src={coin.thumb} alt={coin.name} className="w-6 h-6" />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <CurrencySelect value={currency} onValueChange={onCurrencyChange} />
          <ThemeToggle />
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}