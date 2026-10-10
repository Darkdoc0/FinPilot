import { syncToCloud } from './cloudSync';

const PROFILE_KEY = 'finpilot_profile';

export const saveProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    syncToCloud();
    return true;
  } catch (error) {
    console.error("Error saving profile to localStorage", error);
    return false;
  }
};

export const loadProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading profile from localStorage", error);
    return null;
  }
};

export const clearProfile = () => {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing profile", error);
  }
};

const WATCHLIST_KEY = 'finpilot_watchlist';

export const getWatchlist = () => {
  try {
    const data = localStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading watchlist", error);
    return [];
  }
};

export const saveWatchlist = (watchlist) => {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    syncToCloud();
    return true;
  } catch (error) {
    console.error("Error saving watchlist", error);
    return false;
  }
};

const PORTFOLIO_KEY = 'finpilot_portfolio';
const DEFAULT_PORTFOLIO = { cash: 100000, holdings: {} }; // Give users 1 Lakh virtual cash to start

export const getPortfolio = () => {
  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : DEFAULT_PORTFOLIO;
  } catch (error) {
    console.error("Error loading portfolio", error);
    return DEFAULT_PORTFOLIO;
  }
};

export const savePortfolio = (portfolio) => {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
    syncToCloud();
    return true;
  } catch (error) {
    console.error("Error saving portfolio", error);
    return false;
  }
};

const TRANSACTIONS_KEY = 'finpilot_transactions';

export const getTransactions = () => {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading transactions", error);
    return null;
  }
};

export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    syncToCloud();
    return true;
  } catch (error) {
    console.error("Error saving transactions", error);
    return false;
  }
};