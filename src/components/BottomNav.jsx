import React from 'react';

function BottomNav({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'transactions', label: 'Transactions', icon: '💸' },
    { id: 'plan', label: 'Plan', icon: '📝' },
    { id: 'invest', label: 'Invest', icon: '📈' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="icon">{tab.icon}</span>
          <span className="label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
