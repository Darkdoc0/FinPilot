import React from 'react';

function Home({ profile, onTabChange }) {
  const totalIncome = Number(profile?.income) || 0;
  const totalEssential = Number(profile?.essentialExpenses) || 0;
  // Basic math: 20% of income goes to goals/invest by default if not set
  const savingsTarget = totalIncome * 0.2;
  const safeToSpend = totalIncome - totalEssential - savingsTarget;
  const dailyPace = Math.floor(safeToSpend / 30);

  return (
    <div className="home-dashboard animate-fade-in">
      <header className="mb-4">
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '0.25rem', color: 'var(--color-text)' }}>Good morning, {profile?.name || 'Aarav'}</h1>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Monday, 5 October</p>
      </header>

      <div className="safe-card mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="font-semibold" style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>Safe to spend until 31 Oct</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-text-muted)' }}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 17V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="8" r="1" fill="currentColor"/>
          </svg>
        </div>
        
        <div style={{ margin: '0.75rem 0 0.25rem 0' }}>
          <span style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--card-safe-text)', lineHeight: '1', letterSpacing: '-0.04em' }}>
            ₹{safeToSpend > 0 ? safeToSpend : 0}
          </span>
        </div>
        
        <p className="font-bold mb-4" style={{ color: 'var(--color-text)', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
          ₹{dailyPace > 0 ? dailyPace : 0} per day
        </p>

        {/* Mock Chart */}
        <div className="chart-container">
          {[
            { day: 'Mon', date: '5 Oct', height: '100%', fill: '#3b82f6' },
            { day: 'Tue', date: '6 Oct', height: '80%', fill: '#73e3b1' },
            { day: 'Wed', date: '7 Oct', height: '80%', fill: '#73e3b1' },
            { day: 'Thu', date: '8 Oct', height: '80%', fill: '#73e3b1' },
            { day: 'Fri', date: '9 Oct', height: '80%', fill: '#73e3b1' },
            { day: 'Sat', date: '10 Oct', height: '80%', fill: '#73e3b1' },
            { day: 'Sun', date: '11 Oct', height: '80%', fill: '#73e3b1' }
          ].map((bar, i) => (
            <div key={i} className="chart-col">
              <div className="font-bold mb-1" style={{ color: 'var(--color-text)', fontSize: '0.65rem', letterSpacing: '-0.02em' }}>₹{dailyPace > 0 ? dailyPace : 0}</div>
              <div className="chart-bar-bg">
                <div className="chart-bar-fill" style={{ height: bar.height, background: bar.fill }}></div>
              </div>
              <div className="font-semibold" style={{ fontSize: '0.65rem', marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>{bar.day}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{bar.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--color-text)' }}>Upcoming payments</h2>
        <span className="text-primary font-semibold text-sm cursor-pointer" onClick={() => onTabChange('transactions')}>See all &gt;</span>
      </div>

      <div className="mb-4 flex-col gap-4">
        <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: '1rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
           <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>No upcoming payments added yet.</p>
           <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Add payment functionality coming soon!')}>+ Add Payment</button>
        </div>
      </div>

      <div className="insight-card mb-6 interactive-card" onClick={() => alert('Detailed insights coming soon!')}>
        <div className="insight-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2V12M11 12H7C7 9.5 7 5.5 8 2C9 2 10.5 2 11 2V12ZM11 12V22M15 2V22M15 2C16 2 17.5 3.5 17.5 5.5C17.5 7.5 16 9 15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-grow">
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-danger-text)', marginBottom: '0.1rem' }}>Insight</div>
          <h4 className="m-0" style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: '1.3' }}>
            Eating out is ₹{Math.floor(totalIncome * 0.05).toLocaleString()} above your usual pace.
          </h4>
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontWeight: '300', fontSize: '1.25rem' }}>&gt;</div>
      </div>

      <button className="btn-primary btn-block mb-4" style={{ backgroundColor: 'var(--color-primary)' }} onClick={() => onTabChange('plan')}>
        Review my plan<span className="ml-2 font-bold" style={{ fontSize: '1.2rem', paddingLeft: '4px' }}>&gt;</span>
      </button>
    </div>
  );
}

export default Home;
