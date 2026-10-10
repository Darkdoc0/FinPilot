import React, { useState, useEffect } from 'react';
import { getWatchlist, saveWatchlist, getPortfolio, savePortfolio } from '../utils/storage';
import { MOCK_INDICES, MOCK_EQUITIES } from '../utils/mockMarketData';
import { fetchLiveCrypto, fetchLiveStock, fetchStockCandles } from '../utils/marketApi';
import { CandlestickChart } from './CandlestickChart';

const Invest = ({ profile }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState({ cash: 100000, holdings: {} });
  
  // Live Data States
  const [liveCrypto, setLiveCrypto] = useState([]);
  const [liveStocks, setLiveStocks] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  // Chart States
  const [expandedAsset, setExpandedAsset] = useState(null);
  const [candleData, setCandleData] = useState(null);
  const [isLoadingCandles, setIsLoadingCandles] = useState(false);

  useEffect(() => {
    setWatchlist(getWatchlist());
    setPortfolio(getPortfolio());
    loadLiveData();
  }, []);

  const loadLiveData = async () => {
    setIsLoadingLive(true);
    // 1. Fetch Crypto (No API key needed)
    const cryptoData = await fetchLiveCrypto();
    if (cryptoData.length > 0) {
      setLiveCrypto(cryptoData);
    }

    // 2. Fetch Stocks from Backend
    const updatedStocks = [...MOCK_EQUITIES];
    for (let i = 0; i < updatedStocks.length; i++) {
      const liveData = await fetchLiveStock(updatedStocks[i].id);
      if (liveData) {
        updatedStocks[i] = { 
          ...updatedStocks[i], 
          price: liveData.price, 
          change: liveData.change, 
          changePercent: liveData.changePercent,
          isLive: true
        };
      }
    }
    setLiveStocks(updatedStocks);
    
    setIsLoadingLive(false);
  };

  const loadCandleData = async (symbol) => {
    setIsLoadingCandles(true);
    setCandleData(null);
    const data = await fetchStockCandles(symbol);
    setCandleData(data);
    setIsLoadingCandles(false);
  };

  const handleExpand = (assetId) => {
    if (expandedAsset === assetId) {
      setExpandedAsset(null);
    } else {
      setExpandedAsset(assetId);
      loadCandleData(assetId);
    }
  };

  // Combine live stocks and live crypto into one master list
  const MASTER_ASSETS = [...liveStocks, ...liveCrypto];

  const getAssetDetails = (id) => {
    return MASTER_ASSETS.find(e => e.id === id) || MOCK_EQUITIES.find(e => e.id === id) || null;
  };

  const toggleWatchlist = (assetId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (watchlist.includes(assetId)) {
      updated = watchlist.filter(id => id !== assetId);
    } else {
      updated = [...watchlist, assetId];
    }
    setWatchlist(updated);
    saveWatchlist(updated);
  };
  const handleTrade = (asset, type) => {
    const qty = parseInt(prompt(`Enter quantity to ${type} ${asset.id}:`, "1") || "0", 10);
    if (qty <= 0 || isNaN(qty)) return;

    const cost = asset.price * qty;
    const currentHoldings = portfolio.holdings[asset.id] || 0;

    if (type === 'Buy') {
      if (portfolio.cash < cost) {
        alert("Insufficient virtual cash!");
        return;
      }
      const newPortfolio = {
        ...portfolio,
        cash: portfolio.cash - cost,
        holdings: {
          ...portfolio.holdings,
          [asset.id]: currentHoldings + qty
        }
      };
      setPortfolio(newPortfolio);
      savePortfolio(newPortfolio);
      alert(`Successfully bought ${qty} units of ${asset.id}`);
    } else {
      if (currentHoldings < qty) {
        alert(`You only have ${currentHoldings} units of ${asset.id}!`);
        return;
      }
      const newPortfolio = {
        ...portfolio,
        cash: portfolio.cash + cost,
        holdings: {
          ...portfolio.holdings,
          [asset.id]: currentHoldings === qty ? undefined : currentHoldings - qty
        }
      };
      if (currentHoldings === qty) delete newPortfolio.holdings[asset.id];
      
      setPortfolio(newPortfolio);
      savePortfolio(newPortfolio);
      alert(`Successfully sold ${qty} units of ${asset.id}`);
    }
  };

  const renderAssetCard = (asset) => {
    const isExpanded = expandedAsset === asset.id;
    
    return (
      <div 
        key={asset.id} 
        className="interactive-card mb-4 p-4 flex-col gap-4 animate-fade-in" 
        style={{ background: 'var(--color-surface)', borderRadius: '1rem', border: '1px solid var(--color-border)', cursor: 'pointer' }}
        onClick={() => handleExpand(asset.id)}
      >
        <div className="flex justify-between items-center" style={{ width: '100%' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: asset.sector === 'Crypto' ? '#f3e8ff' : '#f0f4ff', color: asset.sector === 'Crypto' ? '#9333ea' : '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' }}>
              {asset.id.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="m-0" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{asset.id}</h4>
                {asset.isLive || asset.sector === 'Crypto' ? (
                  <span style={{ fontSize: '0.6rem', background: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>LIVE</span>
                ) : null}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{asset.name} &bull; {asset.sector}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--color-text)' }}>₹{asset.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: asset.changePercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4" onClick={(e) => e.stopPropagation()} style={{ width: '100%', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {isLoadingCandles ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                Loading chart...
              </div>
            ) : candleData ? (
              <CandlestickChart data={candleData} />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                Chart data unavailable
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleTrade(asset, 'Buy')} className="btn-primary" style={{ padding: '0.6rem', flex: 1, fontSize: '0.9rem', borderRadius: '0.75rem' }}>Buy</button>
              <button onClick={() => handleTrade(asset, 'Sell')} className="btn-primary" style={{ padding: '0.6rem', flex: 1, fontSize: '0.9rem', borderRadius: '0.75rem', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', boxShadow: 'none' }}>Sell</button>
              <button 
                onClick={(e) => toggleWatchlist(asset.id, e)}
                className="btn-primary"
                style={{ padding: '0.6rem', flex: 1, fontSize: '1.1rem', borderRadius: '0.75rem', background: watchlist.includes(asset.id) ? '#fef3c7' : 'transparent', color: watchlist.includes(asset.id) ? '#d97706' : 'var(--color-text-muted)', border: watchlist.includes(asset.id) ? 'none' : '1px solid var(--color-border)', boxShadow: 'none' }}
              >
                {watchlist.includes(asset.id) ? '★' : '☆'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const totalPortfolioValue = portfolio.cash + Object.entries(portfolio.holdings).reduce((total, [id, qty]) => {
    const asset = getAssetDetails(id);
    return total + (asset ? asset.price * qty : 0);
  }, 0);

  const riskProfile = profile?.riskProfile || 'moderate';
  let recommendedSectors = [];
  if (riskProfile === 'conservative') recommendedSectors = ['Finance', 'Healthcare', 'Utilities', 'Energy'];
  else if (riskProfile === 'aggressive') recommendedSectors = ['IT', 'Technology', 'Crypto'];
  else recommendedSectors = ['Finance', 'IT', 'Energy', 'Technology'];

  const recommendedAssets = MASTER_ASSETS.filter(e => recommendedSectors.includes(e.sector) && !watchlist.includes(e.id)).slice(0, 3);
  const otherAssets = MASTER_ASSETS.filter(e => !recommendedSectors.includes(e.sector) && !watchlist.includes(e.id)).slice(0, 3);
  const cryptoAssets = liveCrypto.filter(e => !watchlist.includes(e.id));

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <header className="mb-6 flex justify-between" style={{ alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.05em', margin: 0, color: 'var(--color-text)' }}>Invest</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', margin: 0 }}>{isLoadingLive ? 'Syncing live market data...' : 'Live market data synced.'}</p>
        </div>
      </header>

      <section className="mb-6">
        <div style={{ background: '#111827', borderRadius: '1.5rem', padding: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'var(--color-primary)', opacity: '0.2', borderRadius: '50%' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <h3 style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: '600' }}>Virtual Portfolio</h3>
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900', color: 'white', letterSpacing: '-0.03em' }}>
                ₹{totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: 0 }}>
              Available Cash: <span style={{ color: 'white', fontWeight: '700' }}>₹{portfolio.cash.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </p>
            
            {Object.keys(portfolio.holdings).length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #374151' }}>
                <h4 style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Your Holdings</h4>
                {Object.entries(portfolio.holdings).map(([id, qty]) => {
                  const asset = getAssetDetails(id);
                  return (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{id} <span style={{ color: '#9ca3af', fontWeight: '400' }}>({qty})</span></span>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>₹{((asset?.price || 0) * qty).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {watchlist.length > 0 && (
        <section className="mb-6">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 1rem 0', color: 'var(--color-text)' }}>Watchlist</h2>
          {watchlist.map(id => {
            const asset = getAssetDetails(id);
            return asset ? renderAssetCard(asset) : null;
          })}
        </section>
      )}

      {cryptoAssets.length > 0 && (
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--color-text)' }}>Live Crypto (CoinGecko) 🟢</h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', margin: '0 -1.25rem', padding: '0 1.25rem' }}>
            {cryptoAssets.map(asset => (
               <div key={asset.id} style={{ minWidth: '280px', flex: '0 0 auto' }}>
                 {renderAssetCard(asset)}
               </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-4">
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 1rem 0', color: 'var(--color-text)' }}>Recommended for You</h2>
        {recommendedAssets.map(renderAssetCard)}

        {otherAssets.length > 0 && (
          <>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '1.5rem 0 1rem 0', color: 'var(--color-text)' }}>Stocks & Equities</h3>
            {otherAssets.map(renderAssetCard)}
          </>
        )}
      </section>
    </div>
  );
};

export default Invest;
