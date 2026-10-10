
# ROADMAP.md

> **Current Phase**: 3
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [x] Complete budgeting experience (Home, Transactions, Plan)
- [x] Goals tracking & safe-to-spend / investable-surplus calculations
- [x] Market dashboards, asset metrics, and watchlists
- [x] Paper investing simulation
- [x] Educational AI assistant with disclaimers
- [x] Installable React PWA with 4 themes and smooth animations

## Phases

### Phase 1: Foundation & Onboarding
**Status**: ✅ Complete
**Objective**: Setup React PWA, offline shell, routing, theming system, and the 8-step onboarding flow.

### Phase 2: Budgeting & Planning Engine
**Status**: ✅ Complete
**Objective**: Implement "Plan" calculations (Income - Bills - Goals = Flexible), "Home" dashboard, and "Transactions" history with basic filters and CSV import.

### Phase 3: Market Intelligence & Watchlists
**Status**: ✅ Complete
**Objective**: Build the "Invest" market overview, asset discovery with metrics, and multi-asset watchlists using seeded/delayed data.

### Phase 4: Paper Portfolio & Goals
**Status**: ✅ Complete
**Objective**: Implement virtual buy/sell execution, portfolio tracking, and link financial goals to the simulated plans.

### Phase 5: FinPilot AI & Polish
**Status**: ✅ Complete
**Objective**: Integrate the AI explanation service, build out settings/profile, add local notifications, ensure offline capability, and finalize UI polish.

---

## Milestone: v2.0 (Advanced Cloud & AI)

### Phase 6: Live Market Data
**Status**: ✅ Complete
**Objective**: Integrate real-time market data APIs.
- [x] Integrate CoinGecko for live Cryptocurrency prices (No Auth)
- [x] Integrate Finnhub for live Stock/ETF prices (API Key required)
- [x] Build UI settings for API key management in Invest tab
- [x] Merge live data seamlessly into virtual portfolio tracking

### Phase 7: Backend Auth & Cloud Sync
**Status**: ✅ Complete
**Objective**: Setup Firebase authentication and Firestore database to persist data securely across devices.
- [x] Initialize Firebase services and create `cloudSync` bridge
- [x] Update Profile component to handle Google Auth
- [x] Implement real-time or manual sync buttons

### Phase 8: Dynamic AI Brain (Gemini)
**Status**: ✅ Complete
**Objective**: Hook the FinPilot AI assistant into the real Gemini API to provide dynamic, hyper-personalized financial advice based on the user's live profile and data.
- [x] Integrate `@google/genai` SDK and Interactions API
- [x] Build API key input UI in chat bubble
- [x] Construct dynamic system prompts using profile context

### Phase 9: Indian Bank Integration (Setu)
**Status**: Pending
**Objective**: Replace Plaid with Setu Account Aggregator for Indian banks.
- [ ] Remove Plaid components
- [ ] Integrate Setu frontend SDK
- [ ] Build backend endpoints for Setu Consent and Data fetching
- [ ] Parse FIP data into FinPilot format
