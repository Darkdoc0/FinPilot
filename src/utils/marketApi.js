// src/utils/marketApi.js

// CoinGecko API for Crypto (Free, No Auth required)
export const fetchLiveCrypto = async () => {
  try {
    const ids = 'bitcoin,ethereum,solana,ripple,cardano';
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr&include_24hr_change=true`);
    const data = await response.json();
    
    // Transform into our expected app format
    return [
      { id: 'BTC', name: 'Bitcoin', price: data.bitcoin?.inr || 0, changePercent: data.bitcoin?.inr_24h_change || 0, sector: 'Crypto' },
      { id: 'ETH', name: 'Ethereum', price: data.ethereum?.inr || 0, changePercent: data.ethereum?.inr_24h_change || 0, sector: 'Crypto' },
      { id: 'SOL', name: 'Solana', price: data.solana?.inr || 0, changePercent: data.solana?.inr_24h_change || 0, sector: 'Crypto' },
      { id: 'XRP', name: 'Ripple', price: data.ripple?.inr || 0, changePercent: data.ripple?.inr_24h_change || 0, sector: 'Crypto' },
      { id: 'ADA', name: 'Cardano', price: data.cardano?.inr || 0, changePercent: data.cardano?.inr_24h_change || 0, sector: 'Crypto' },
    ];
  } catch (error) {
    console.error("Failed to fetch live crypto:", error);
    return [];
  }
};

// Backend Proxy for Stocks (Finnhub API key secured on server)
export const fetchLiveStock = async (symbol) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/stocks/${symbol}`);
    if (!response.ok) {
      if (response.status === 404 || response.status === 500) {
        return null;
      }
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch stock ${symbol}:`, error);
    return null;
  }
};

export const fetchStockCandles = async (symbol, resolution = 'D', from, to) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    
    // Default to last 30 days if from/to not provided
    if (!to) to = Math.floor(Date.now() / 1000);
    if (!from) from = to - (30 * 24 * 60 * 60);

    const response = await fetch(`${backendUrl}/api/stocks/${symbol}/candles?resolution=${resolution}&from=${from}&to=${to}`);
    if (!response.ok) {
      if (response.status === 404 || response.status === 500) {
        return null;
      }
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.s === 'ok' && data.t && data.c) {
      // Convert Finnhub format to lightweight-charts format
      const formattedData = data.t.map((timestamp, index) => ({
        time: timestamp,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index]
      }));
      return formattedData;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch candles for ${symbol}:`, error);
    return null;
  }
};
