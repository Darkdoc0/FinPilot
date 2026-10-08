import React from 'react';
import { render, screen } from '@testing-library/react';
import BottomNav from './BottomNav';

describe('BottomNav', () => {
  it('renders all 5 navigation links', () => {
    render(<BottomNav currentTab="home" onTabChange={() => {}} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Invest')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });
});
