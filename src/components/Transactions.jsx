import React, { useState, useEffect } from 'react';
import { getTransactions, saveTransactions } from '../utils/storage';
import { SetuConnectButton } from './SetuConnectButton';

function Transactions({ profile }) {
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTx, setNewTx] = useState({ description: '', amount: '', category: 'Food', type: 'Expense' });
  const [isPlaidConnected, setIsPlaidConnected] = useState(false);

  useEffect(() => {
    const loaded = getTransactions();
    if (loaded && loaded.length > 0) {
      setTransactions(loaded);
    } else {
      // Seed initial data once
      const income = Number(profile?.income) || 50000;
      const initial = [
        { id: Date.now(), date: new Date().toISOString().split('T')[0], description: 'Initial Balance', amount: income, category: 'Income' }
      ];
      setTransactions(initial);
      saveTransactions(initial);
    }
  }, [profile]);

  const fetchPlaidTransactions = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/plaid/transactions`);
      const data = await response.json();
      if (data.transactions) {
        const mapped = data.transactions.map(tx => ({
          id: tx.transaction_id,
          date: tx.date,
          description: tx.name,
          amount: -tx.amount, // Plaid amounts are positive for expenses
          category: tx.category ? tx.category[0] : 'Other'
        }));
        setTransactions([...mapped, ...transactions]);
      }
    } catch (err) {
      console.error('Failed to fetch Plaid transactions', err);
    }
  };

  const handlePlaidConnected = () => {
    setIsPlaidConnected(true);
    fetchPlaidTransactions();
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    
    const amountNum = Number(newTx.amount);
    const finalAmount = newTx.type === 'Expense' ? -Math.abs(amountNum) : Math.abs(amountNum);
    
    const tx = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: newTx.description,
      amount: finalAmount,
      category: newTx.category
    };
    
    const updated = [tx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setIsAdding(false);
    setNewTx({ description: '', amount: '', category: 'Food', type: 'Expense' });
  };

  const handleDelete = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const filtered = transactions.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Income') return t.amount > 0;
    if (filter === 'Expense') return t.amount < 0;
    return true;
  });

  return (
    <div className="animate-fade-in pb-24" style={{ animationDelay: '0.3s' }}>
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Transactions</h1>
          <p className="text-muted text-lg">Review your recent activity.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isPlaidConnected && <SetuConnectButton onConnected={handlePlaidConnected} />}
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Cancel' : '+ Add'}
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="glass-panel mb-6 p-4 animate-fade-in">
          <h3 className="font-bold mb-4">Add Transaction</h3>
          <form onSubmit={handleAddTransaction} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div style={{ flex: 1 }}>
                <label className="text-sm text-muted mb-1 block">Type</label>
                <select 
                  className="form-input"
                  value={newTx.type}
                  onChange={(e) => setNewTx({...newTx, type: e.target.value})}
                >
                  <option>Expense</option>
                  <option>Income</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="text-sm text-muted mb-1 block">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="form-input"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted mb-1 block">Description</label>
              <input 
                type="text" 
                placeholder="e.g. Groceries"
                className="form-input"
                value={newTx.description}
                onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-1 block">Category</label>
              <input 
                type="text" 
                placeholder="e.g. Food"
                className="form-input"
                value={newTx.category}
                onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-primary btn-block mt-2">Save Transaction</button>
          </form>
        </div>
      )}

      <div className="filters mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Income', 'Expense'].map(f => (
          <button 
            key={f} 
            className="btn-primary flex items-center justify-center"
            onClick={() => setFilter(f)}
            style={{ 
              padding: '0.6rem 1.5rem', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              flex: '0 0 auto', 
              width: 'auto',
              borderRadius: '20px',
              background: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
              color: filter === f ? 'white' : 'var(--color-text)',
              border: filter === f ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              boxShadow: filter === f ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-panel p-4 border border-border shadow-soft rounded-2xl">
        <div className="flex-col gap-3">
          {filtered.map((t) => (
            <div key={t.id} className="list-item bg-surface hover:bg-surface-hover rounded-xl p-4 transition-colors border border-border/50 mb-3 last:mb-0 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`circle-icon flex items-center justify-center rounded-full ${t.amount > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`} style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                  {t.amount > 0 ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                  )}
                </div>
                <div className="flex-grow ml-4">
                  <h4 className="m-0 text-md font-bold text-text">{t.description}</h4>
                  <div className="text-sm text-muted mt-1 font-medium">{t.date} &bull; {t.category}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className={`font-bold text-lg whitespace-nowrap ${t.amount > 0 ? 'text-success' : 'text-text'}`}>
                  {t.amount > 0 ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                </div>
                <button 
                  onClick={() => handleDelete(t.id)} 
                  className="text-xs text-danger mt-1 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
             <div className="text-center py-8 text-muted">
                No transactions found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
