import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Goals from './Goals';

// Mock prompt
window.prompt = vi.fn();

describe('Goals Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders goals dashboard and allows adding a goal', () => {
    render(<Goals />);
    
    expect(screen.getByText('Financial Goals')).toBeInTheDocument();
    
    // Fill out the form
    const nameInput = screen.getByPlaceholderText('e.g. Emergency Fund, New Car');
    const targetInput = screen.getByPlaceholderText('50000');
    
    fireEvent.change(nameInput, { target: { value: 'New Laptop' } });
    fireEvent.change(targetInput, { target: { value: '100000' } });
    
    fireEvent.click(screen.getByText('Add Goal'));
    
    // Check if goal is added
    expect(screen.getByText('New Laptop')).toBeInTheDocument();
    expect(screen.getByText('₹0.00 / ₹100000.00')).toBeInTheDocument();
  });

  it('allows adding funds to a goal', () => {
    render(<Goals />);
    
    // Add a goal first
    fireEvent.change(screen.getByPlaceholderText('e.g. Emergency Fund, New Car'), { target: { value: 'Trip' } });
    fireEvent.change(screen.getByPlaceholderText('50000'), { target: { value: '50000' } });
    fireEvent.click(screen.getByText('Add Goal'));
    
    // Mock prompt to return 10000
    window.prompt.mockReturnValueOnce('10000');
    
    // Click add funds
    fireEvent.click(screen.getByText('Add Funds'));
    
    // Verify it updated
    expect(screen.getByText('₹10000.00 / ₹50000.00')).toBeInTheDocument();
    expect(screen.getByText('20% Complete')).toBeInTheDocument();
  });
});
