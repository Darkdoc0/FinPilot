# Phase 3 Plan: Market Intelligence & Watchlists

## 1. Setup Mock Market Data
- Create `src/utils/mockMarketData.js` exporting seeded data for indices (e.g. NIFTY 50, S&P 500) and sample equities.

## 2. Build the Invest Dashboard
- Create `src/components/Invest.jsx` (replacing the placeholder in Layout.jsx).
- Display a top-level market overview (index metrics).
- Provide a section to browse "Featured Assets" from the mock data.

## 3. Implement Watchlist Functionality
- Update `src/utils/storage.js` (or handle within `Invest.jsx` local storage) to manage an array of watched asset tickers.
- Add a UI mechanism to add/remove assets from the watchlist.
- Display the user's customized Watchlist above or below the market overview.

## 4. Tests
- Create `src/components/Invest.test.jsx`.
- Test that the market indices render.
- Test that clicking an asset adds/removes it from the user's watchlist.
