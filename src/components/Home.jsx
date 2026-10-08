import React from 'react';

function Home({ profile }) {
  const totalIncome = Number(profile.income) || 0;
  const totalEssential = (profile.expenses || []).reduce((acc, exp) => acc + Number(exp.amount), 0);
  // Basic math: 20% of income goes to goals/invest by default if not set
  const savingsTarget = totalIncome * 0.2;
  const safeToSpend = totalIncome - totalEssential - savingsTarget;
  const dailyPace = Math.floor(safeToSpend / 30);

  return (
    <div className="home-dashboard p-4">
      <header className="mb-4">
        <h1>Welcome back!</h1>
        <p className="text-muted">Here is your financial snapshot.</p>
      </header>

      <div className="glass-panel summary-card mb-4">
        <h2>Safe to Spend</h2>
        <div className="amount highlight">₹{safeToSpend > 0 ? safeToSpend : 0}</div>
        <p className="text-muted">Suggested daily pace: ₹{dailyPace > 0 ? dailyPace : 0}</p>
      </div>

      <div className="metrics-grid">
        <div className="glass-panel metric-card">
          <h3>Income</h3>
          <div className="amount text-success">₹{totalIncome}</div>
        </div>
        <div className="glass-panel metric-card">
          <h3>Essential Bills</h3>
          <div className="amount text-danger">₹{totalEssential}</div>
        </div>
      </div>

      <div className="glass-panel invest-card mt-4">
        <h2>Available to Invest</h2>
        <div className="amount text-primary">₹{savingsTarget}</div>
        <p className="text-muted">This is reserved for your goals and portfolio.</p>
      </div>
    </div>
  );
}

export default Home;
