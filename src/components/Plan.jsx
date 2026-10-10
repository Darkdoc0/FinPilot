import React from 'react';

function Plan({ profile }) {
  const income = Number(profile?.income) || 30000;
  const essential = Number(profile?.essentialExpenses) || (income * 0.5);
  
  // Rule-of-thumb allocations based on user inputs
  const savingsTarget = income * 0.2;
  const wantsTarget = Math.max(0, income - essential - savingsTarget);
  
  const essentialPercent = ((essential / income) * 100).toFixed(1);
  const wantsPercent = ((wantsTarget / income) * 100).toFixed(1);
  const savingsPercent = ((savingsTarget / income) * 100).toFixed(1);

  // SVG circle dasharray computation (total length = 100)
  const essentialDash = essentialPercent;
  const wantsDash = wantsPercent;
  const savingsDash = savingsPercent;

  // Offsets for the circular graph
  const wantsOffset = -essentialDash;
  const savingsOffset = wantsOffset - wantsDash;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '20px' }}>
      <header className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.05em', margin: 0, color: 'var(--color-text)' }}>Allocation Plan</h1>
        <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => alert("Manage settings coming soon")}>Manage &gt;</span>
      </header>

      <div style={{ background: '#111827', borderRadius: '1.5rem', padding: '1.5rem', color: 'white', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(17, 24, 39, 0.2)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#374151" strokeWidth="4" />
            
            {/* Essential */}
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeWidth="4" strokeDasharray={`${essentialDash}, 100`} />
            
            {/* Wants */}
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${wantsDash}, 100`} strokeDashoffset={wantsOffset} />
            
            {/* Savings */}
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${savingsDash}, 100`} strokeDashoffset={savingsOffset} />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>Monthly Income</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>₹{income.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex-col gap-4">
        <div className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f43f5e' }}></div>
          <div className="flex-grow">
            <h4 className="m-0" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>Essential Needs</h4>
            <p className="m-0 text-muted" style={{ fontSize: '0.85rem' }}>Fixed Expenses (Rent, Bills)</p>
          </div>
          <div className="text-right">
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>₹{essential.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{essentialPercent}%</div>
          </div>
        </div>

        <div className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
          <div className="flex-grow">
            <h4 className="m-0" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>Wants & Lifestyle</h4>
            <p className="m-0 text-muted" style={{ fontSize: '0.85rem' }}>Variable (Dining, Shopping)</p>
          </div>
          <div className="text-right">
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>₹{wantsTarget.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{wantsPercent}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 py-3">
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
          <div className="flex-grow">
            <h4 className="m-0" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>Savings & Invest</h4>
            <p className="m-0 text-muted" style={{ fontSize: '0.85rem' }}>{profile?.goals?.length > 0 ? profile.goals.join(', ') : 'Wealth Building'}</p>
          </div>
          <div className="text-right">
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-text)' }}>₹{savingsTarget.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{savingsPercent}%</div>
          </div>
        </div>
      </div>
      
      <button className="btn-primary mt-6" style={{ backgroundColor: '#111827' }} onClick={() => alert("AI Allocation Optimization triggered! (Coming soon)")}>
        Optimize Allocation
      </button>
    </div>
  );
}

export default Plan;
