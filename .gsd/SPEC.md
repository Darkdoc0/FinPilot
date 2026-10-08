# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
FinPilot is a professional, mobile-first financial planning PWA that helps users safely manage their spending, set goals, and build investment readiness through market intelligence, paper trading, and an educational AI assistant—all without the risks of real trading or personalized buy/sell recommendations in the first release.

## Goals
1. Deliver a complete budgeting experience (Income, Essential/Flexible expenses, Bills, Safe-to-Spend).
2. Provide a market intelligence dashboard (Indices, Equities, Watchlists, Asset discovery).
3. Create a realistic "Paper Portfolio" to simulate investments and teach users about asset allocation.
4. Integrate a non-advisory FinPilot AI to explain financial metrics, patterns, and scenarios.
5. Ship as an installable React PWA with offline shell, local storage, and high-quality UI/UX (themes, animations).

## Non-Goals (Out of Scope)
- Depositing real investment money or custody of funds.
- Real-money orders or CFDs.
- Automatic trading or executing trades on the user's behalf.
- Personalized buy/sell recommendations.
- Claims about expected returns or guaranteed performance.
- Live bank connections, account authentication, and regulated broker execution (slated for later releases).

## Users
Students, salaried workers, freelancers, and households looking for a centralized financial control center to budget effectively and learn to invest safely.

## Constraints
- Technical: React PWA, offline shell, seeded demonstration data/delayed market data initially. Local encrypted preference storage.
- Functional: Must avoid regulated investment advisory triggers (no real trading or guaranteed returns).
- UI/UX: Must be highly aesthetic, responsive, and support four themes and reduced motion.

## Success Criteria
- [ ] Users can complete the 8-step onboarding and see a calculated "Safe-to-spend" amount.
- [ ] Users can categorize transactions and view a summary of flexible money.
- [ ] Users can browse market data and add stocks/funds to a watchlist.
- [ ] Users can execute paper trades and view a simulated portfolio.
- [ ] AI successfully provides contextual explanations with appropriate disclaimers without giving financial advice.
- [ ] PWA is installable and works offline.
