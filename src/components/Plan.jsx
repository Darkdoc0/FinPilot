import React from 'react';

function Plan({ profile }) {
  const income = Number(profile.income) || 0;
  const bills = (profile.expenses || []).reduce((acc, exp) => acc + Number(exp.amount), 0);
  const goalsTarget = income * 0.2; // Mock logic
  const flexible = income - bills - goalsTarget;

  return (
    <div className="plan-dashboard p-4">
      <header className="mb-4">
        <h1>Financial Plan</h1>
        <p className="text-muted">How your money is allocated this month.</p>
      </header>

      <div className="glass-panel mb-4">
        <h2>Income</h2>
        <div className="amount text-success">₹{income}</div>
      </div>

      <div className="glass-panel mb-4">
        <h2>Essential Bills</h2>
        <ul className="bills-list">
          {(profile.expenses || []).map((exp, idx) => (
            <li key={idx} className="flex justify-between mt-2">
              <span>{exp.name}</span>
              <span className="text-danger">₹{exp.amount}</span>
            </li>
          ))}
        </ul>
        <div className="total mt-2 pt-2 border-t font-bold">Total: ₹{bills}</div>
      </div>

      <div className="metrics-grid">
        <div className="glass-panel">
          <h3>Goals & Invest</h3>
          <div className="amount text-primary">₹{goalsTarget}</div>
        </div>
        <div className="glass-panel">
          <h3>Flexible</h3>
          <div className="amount highlight">₹{flexible > 0 ? flexible : 0}</div>
        </div>
      </div>
    </div>
  );
}

export default Plan;
