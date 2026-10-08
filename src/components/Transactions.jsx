import React, { useState } from 'react';

const MOCK_TRANSACTIONS = [
  { id: 1, date: '2023-10-01', description: 'Grocery Store', amount: -450, category: 'Food' },
  { id: 2, date: '2023-10-02', description: 'Salary', amount: 5000, category: 'Income' },
  { id: 3, date: '2023-10-03', description: 'Netflix', amount: -15, category: 'Subscription' },
  { id: 4, date: '2023-10-05', description: 'Coffee Shop', amount: -5, category: 'Food' },
  { id: 5, date: '2023-10-08', description: 'Electric Bill', amount: -100, category: 'Bills' },
];

function Transactions() {
  const [filter, setFilter] = useState('All');

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Income') return t.amount > 0;
    if (filter === 'Expense') return t.amount < 0;
    return true;
  });

  return (
    <div className="transactions-dashboard p-4">
      <header className="mb-4">
        <h1>Transactions</h1>
        <p className="text-muted">Review your recent activity.</p>
      </header>

      <div className="filters mb-4 flex gap-2">
        {['All', 'Income', 'Expense'].map(f => (
          <button 
            key={f} 
            className={`btn-filter ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-panel">
        <ul className="transaction-list">
          {filtered.map(t => (
            <li key={t.id} className="flex justify-between py-2 border-b last-no-border">
              <div>
                <div className="font-bold">{t.description}</div>
                <div className="text-xs text-muted">{t.date} &bull; {t.category}</div>
              </div>
              <div className={`amount ${t.amount > 0 ? 'text-success' : ''}`}>
                {t.amount > 0 ? '+' : ''}{t.amount}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Transactions;
