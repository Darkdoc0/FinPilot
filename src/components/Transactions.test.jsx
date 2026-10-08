import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Transactions from './Transactions';

describe('Transactions Component', () => {
  it('renders all transactions by default', () => {
    render(<Transactions />);
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('filters by income', () => {
    render(<Transactions />);
    const incomeBtn = screen.getByText('Income');
    fireEvent.click(incomeBtn);
    expect(screen.queryByText('Grocery Store')).not.toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('filters by expense', () => {
    render(<Transactions />);
    const expenseBtn = screen.getByText('Expense');
    fireEvent.click(expenseBtn);
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.queryByText('Salary')).not.toBeInTheDocument();
  });
});
