import React from 'react';

function BottomNav({ currentTab, onTabChange }) {
  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      )
    },
    { 
      id: 'plan', 
      label: 'Plan', 
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
      )
    },
    { 
      id: 'invest', 
      label: 'Invest', 
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    { 
      id: 'goals', 
      label: 'Goals', 
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      )
    },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2px', color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              {tab.icon(isActive)}
            </span>
            <span className="label" style={{ fontWeight: isActive ? '700' : '500', color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
