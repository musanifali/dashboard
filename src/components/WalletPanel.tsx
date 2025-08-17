import { useAccount, useBalance, useEnsName } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAddress } from '@/lib/format'
import { Copy, Wallet } from 'lucide-react'
import { toast } from 'sonner'

export function WalletPanel() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
  })
  const { data: ensName } = useEnsName({
    address,
  })

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard')
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view your balance and address
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Address</div>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {ensName || (address ? formatAddress(address) : '')}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyAddress}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-1">Network</div>
          <Badge variant="outline">
            {chain?.name || 'Unknown'}
          </Badge>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-1">Balance</div>
          {balanceLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="font-mono text-lg">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 ETH'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}