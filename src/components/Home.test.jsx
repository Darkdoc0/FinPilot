import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  it('renders correct safe to spend and available to invest amounts', () => {
    const mockProfile = {
      income: 5000,
      expenses: [{ amount: 1000 }, { amount: 500 }]
    };
    render(<Home profile={mockProfile} />);
    
    // income = 5000
    // expenses = 1500
    // invest = 5000 * 0.2 = 1000
    // safeToSpend = 5000 - 1500 - 1000 = 2500
    
    expect(screen.getByText('₹2500')).toBeInTheDocument(); // Safe to spend
    expect(screen.getByText('₹1000')).toBeInTheDocument(); // Invest
    expect(screen.getByText('₹5000')).toBeInTheDocument(); // Income
    expect(screen.getByText('₹1500')).toBeInTheDocument(); // Bills
  });
});
