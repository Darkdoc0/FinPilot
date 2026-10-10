# Phase 4 Plan: Paper Portfolio & Goals

## 1. Virtual Portfolio Storage
- Add logic in `src/utils/storage.js` to manage a virtual portfolio (e.g., virtual cash balance, holdings like `{ AAPL: 10, INFY: 5 }`).
- Add functions to execute a "buy" or "sell" order which updates the cash balance and holding quantities based on current mock prices.

## 2. Paper Trading UI
- Update `src/components/Invest.jsx` to include a "Your Portfolio" section showing current holdings, total value, and available virtual cash.
- Add "Buy" and "Sell" buttons to the Featured Assets and Watchlist cards, triggering a simple prompt or modal to enter the number of shares.

## 3. Goals Tracking
- Implement `src/components/Goals.jsx` (replacing the placeholder in `Layout.jsx`).
- Allow users to add a financial goal (e.g., "Emergency Fund", "New Laptop") with a target amount.
- Calculate progress by linking it to the user's "investable surplus" or their virtual portfolio value.

## 4. Tests
- Add tests for the trading logic in `storage.js` (ensuring cash balance deducts correctly).
- Create `src/components/Goals.test.jsx`.
- Update `Invest.test.jsx` to verify the portfolio renders.
