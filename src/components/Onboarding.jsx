import React, { useState } from 'react';

const inputStyle = {
  width: '100%', 
  padding: '1rem', 
  borderRadius: '0.75rem', 
  border: '1px solid var(--color-border)', 
  background: 'var(--color-surface)', 
  color: 'var(--color-text)', 
  fontSize: '1rem', 
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontWeight: '500'
};

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    mode: 'salaried',
    income: '',
    essentialExpenses: '',
    goals: [],
    emergencyFundStatus: 'none',
    riskProfile: 'moderate',
    theme: 'dark' // Default to dark as it's the premium look
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 9));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    onComplete(profile);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Welcome to FinPilot</h2>
            <p className="text-muted mb-6">What should we call you?</p>
            <input type="text" placeholder="Your Name" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} className="focus:border-primary" />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Financial Mode</h2>
            <p className="text-muted mb-6">Choose your financial mode.</p>
            <select value={profile.mode} onChange={(e) => handleChange('mode', e.target.value)} style={inputStyle} className="focus:border-primary">
              <option value="student">Student</option>
              <option value="salaried">Salaried</option>
              <option value="freelancer">Freelancer</option>
              <option value="household">Household</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Monthly Income</h2>
            <p className="text-muted mb-6">What is your average monthly income?</p>
            <input type="number" placeholder="e.g. 50000" value={profile.income} onChange={(e) => handleChange('income', e.target.value)} style={inputStyle} className="focus:border-primary" />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Essential Expenses</h2>
            <p className="text-muted mb-6">Total essential expenses (rent, groceries, etc.)</p>
            <input type="number" placeholder="e.g. 20000" value={profile.essentialExpenses} onChange={(e) => handleChange('essentialExpenses', e.target.value)} style={inputStyle} className="focus:border-primary" />
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Upcoming Bills</h2>
            <p className="text-muted mb-6">We'll set up your bills calendar later. (Optional)</p>
          </div>
        );
      case 6:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Financial Goals</h2>
            <p className="text-muted mb-6">What are you saving for?</p>
            <input type="text" placeholder="e.g. Laptop, Vacation" style={inputStyle} className="focus:border-primary" onChange={(e) => handleChange('goals', [e.target.value])} />
          </div>
        );
      case 7:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Emergency Fund</h2>
            <p className="text-muted mb-6">How is your emergency fund?</p>
            <select value={profile.emergencyFundStatus} onChange={(e) => handleChange('emergencyFundStatus', e.target.value)} style={inputStyle} className="focus:border-primary">
              <option value="none">Starting out</option>
              <option value="partial">1-2 months saved</option>
              <option value="full">3-6 months saved</option>
            </select>
          </div>
        );
      case 8:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Risk Profile</h2>
            <p className="text-muted mb-6">How comfortable are you with investment risk?</p>
            <select value={profile.riskProfile} onChange={(e) => handleChange('riskProfile', e.target.value)} style={inputStyle} className="focus:border-primary">
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        );
      case 9:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Choose a Theme</h2>
            <p className="text-muted mb-6">Pick your initial FinPilot theme.</p>
            <select value={profile.theme} onChange={(e) => {
               handleChange('theme', e.target.value);
               document.documentElement.setAttribute('data-theme', e.target.value);
            }} style={inputStyle} className="focus:border-primary">
              <option value="dark">Dark (Premium)</option>
              <option value="light">Light</option>
              <option value="midnight">Midnight Purple</option>
              <option value="ocean">Ocean Teal</option>
            </select>
          </div>
        );
      default: return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <div className="glass-panel w-full max-w-md border border-border shadow-soft rounded-2xl overflow-hidden relative" style={{ padding: '2.5rem' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-surface">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${(step / 9) * 100}%` }}></div>
        </div>
        
        <div className="mb-8">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mb-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
           {renderStep()}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <button 
            className="px-6 py-3 rounded-xl font-bold transition-all" 
            onClick={prevStep} 
            disabled={step === 1} 
            style={{ 
              background: 'var(--color-surface)', 
              color: 'var(--color-text)', 
              border: '1px solid var(--color-border)', 
              opacity: step === 1 ? 0.5 : 1,
              flex: '1'
            }}
          >
            Back
          </button>
          {step < 9 ? (
            <button className="btn-primary px-6 py-3 rounded-xl font-bold flex-1" onClick={nextStep} style={{ width: '100%', flex: '1' }}>Next</button>
          ) : (
            <button className="btn-primary px-6 py-3 rounded-xl font-bold flex-1 shadow-lg" onClick={handleFinish} style={{ width: '100%', flex: '1' }}>Enter FinPilot</button>
          )}
        </div>
        <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--color-muted)'}}>
          Step {step} of 9
        </div>
      </div>
    </div>
  );
}
