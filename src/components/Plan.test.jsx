import React from 'react';
import { render, screen } from '@testing-library/react';
import Plan from './Plan';

describe('Plan Component', () => {
  it('renders correctly allocated funds', () => {
    const mockProfile = {
      income: 5000,
      expenses: [{ name: 'Rent', amount: 1000 }, { name: 'Food', amount: 500 }]
    };
    render(<Plan profile={mockProfile} />);
    
    // income = 5000, bills = 1500, goalsTarget = 1000, flexible = 2500
    expect(screen.getByText('₹5000')).toBeInTheDocument(); // Income
    expect(screen.getByText('Total: ₹1500')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getAllByText('₹1000').length).toBe(2); // Rent & Goals
    expect(screen.getByText('₹2500')).toBeInTheDocument(); // Flexible
  });
});
