# CoinLens - Crypto Dashboard

A modern cryptocurrency dashboard built with Vite, React, TypeScript, and TailwindCSS.

## Features

- 📊 Real-time cryptocurrency market data from CoinGecko
- 🔗 MetaMask wallet integration with ENS support
- 📈 Interactive charts and sparklines
- ⭐ Watchlist functionality with localStorage persistence
- 🌙 Dark/light theme toggle
- 💱 Multi-currency support (USD, EUR, PKR)
- 🔍 Real-time coin search
- 📱 Responsive design

## Tech Stack

- **Build**: Vite + React + TypeScript
- **Styling**: TailwindCSS + shadcn/ui (Radix UI)
- **State/Data**: @tanstack/react-query + axios
- **Wallet**: wagmi + viem + @rainbow-me/rainbowkit
- **Charts**: recharts
- **Notifications**: sonner
- **Icons**: lucide-react

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_COINGECKO_API_BASE=https://api.coingecko.com/api/v3
   VITE_COINGECKO_API_KEY=your_api_key_here (optional)
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_COINGECKO_API_BASE`: CoinGecko API base URL
- `VITE_COINGECKO_API_KEY`: Optional CoinGecko Pro API key for higher rate limits
- `VITE_WALLETCONNECT_PROJECT_ID`: Required for RainbowKit wallet connection

## Features Overview

### Market Data
- Top 50 cryptocurrencies by market cap
- Real-time price updates every 60 seconds
- 1h, 24h, and 7d price change indicators
- 7-day price sparklines
- Global market statistics

### Wallet Integration
- Connect MetaMask and other wallets via RainbowKit
- Display ENS names or shortened addresses
- Show native ETH balance
- Network switching support
- Copy address functionality

### User Experience
- Debounced search with autocomplete
- Persistent watchlist and currency preferences
- Responsive design for mobile and desktop
- Loading skeletons and error handling
- Toast notifications

### Data Management
- React Query for efficient data fetching and caching
- Automatic retry with exponential backoff for rate limits
- 30-second stale time with 60-second refetch intervals

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # App header with search
│   ├── GlobalStats.tsx # Market overview cards
│   ├── CoinsTable.tsx  # Main coins table
│   ├── CoinDrawer.tsx  # Coin detail drawer
│   ├── WalletPanel.tsx # Wallet information
│   └── ...
├── lib/                # Utilities
│   ├── http.ts         # Axios instance
│   ├── format.ts       # Number/currency formatters
│   └── sanitize.ts     # HTML sanitization
├── providers/          # Context providers
│   ├── ThemeProvider.tsx
│   ├── QueryProvider.tsx
│   └── WalletProvider.tsx
└── ...
```

## API Endpoints Used

- `/coins/markets` - Market data for coins table
- `/global` - Global market statistics
- `/search` - Coin search functionality
- `/coins/{id}` - Detailed coin information

## License

MIT