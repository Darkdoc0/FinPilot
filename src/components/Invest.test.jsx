import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Invest from './Invest';

// Mock storage to avoid actual localStorage interactions in tests
vi.mock('../utils/storage', () => ({
  getWatchlist: vi.fn(() => []),
  saveWatchlist: vi.fn(),
  getPortfolio: vi.fn(() => ({ cash: 100000, holdings: {} })),
  savePortfolio: vi.fn(),
}));

window.prompt = vi.fn();
window.alert = vi.fn();

describe('Invest Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders market indices', () => {
    render(<Invest />);
    expect(screen.getByText('Market Overview')).toBeInTheDocument();
    expect(screen.getByText('NIFTY50')).toBeInTheDocument();
    expect(screen.getByText('SP500')).toBeInTheDocument();
  });

  it('renders featured assets', () => {
    render(<Invest />);
    expect(screen.getByText('Featured Assets')).toBeInTheDocument();
    expect(screen.getByText('Reliance Industries')).toBeInTheDocument();
  });

  it('adds an asset to the watchlist on click', () => {
    render(<Invest />);
    
    const watchButtons = screen.getAllByText('Watch');
    expect(watchButtons.length).toBeGreaterThan(0);
    
    // Click the first watch button
    fireEvent.click(watchButtons[0]);
    
    // The button should now say "Unwatch"
    expect(screen.getByText('Your Watchlist')).toBeInTheDocument();
    expect(screen.getAllByText('Unwatch').length).toBe(1);
  });
});
