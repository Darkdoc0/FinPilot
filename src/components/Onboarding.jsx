import React, { useState } from 'react';

const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', 
  background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '1rem', boxSizing: 'border-box'
};

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    mode: 'salaried',
    income: '',
    essentialExpenses: '',
    goals: [],
    emergencyFundStatus: 'none',
    riskProfile: 'moderate',
    theme: 'light'
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 8));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    onComplete(profile);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h2>Step 1: Welcome to FinPilot</h2>
            <p style={{marginBottom: '1rem'}}>Choose your financial mode.</p>
            <select value={profile.mode} onChange={(e) => handleChange('mode', e.target.value)} style={inputStyle}>
              <option value="student">Student</option>
              <option value="salaried">Salaried</option>
              <option value="freelancer">Freelancer</option>
              <option value="household">Household</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Monthly Income</h2>
            <p style={{marginBottom: '1rem'}}>What is your average monthly income?</p>
            <input type="number" placeholder="e.g. 50000" value={profile.income} onChange={(e) => handleChange('income', e.target.value)} style={inputStyle} />
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Essential Expenses</h2>
            <p style={{marginBottom: '1rem'}}>Total essential expenses (rent, groceries, etc.)</p>
            <input type="number" placeholder="e.g. 20000" value={profile.essentialExpenses} onChange={(e) => handleChange('essentialExpenses', e.target.value)} style={inputStyle} />
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Step 4: Upcoming Bills</h2>
            <p style={{marginBottom: '1rem'}}>We'll set up your bills calendar later. (Optional)</p>
          </div>
        );
      case 5:
        return (
          <div>
            <h2>Step 5: Financial Goals</h2>
            <p style={{marginBottom: '1rem'}}>What are you saving for?</p>
            <input type="text" placeholder="e.g. Laptop, Vacation" style={inputStyle} onChange={(e) => handleChange('goals', [e.target.value])} />
          </div>
        );
      case 6:
        return (
          <div>
            <h2>Step 6: Emergency Fund</h2>
            <p style={{marginBottom: '1rem'}}>How is your emergency fund?</p>
            <select value={profile.emergencyFundStatus} onChange={(e) => handleChange('emergencyFundStatus', e.target.value)} style={inputStyle}>
              <option value="none">Starting out</option>
              <option value="partial">1-2 months saved</option>
              <option value="full">3-6 months saved</option>
            </select>
          </div>
        );
      case 7:
        return (
          <div>
            <h2>Step 7: Risk Profile</h2>
            <p style={{marginBottom: '1rem'}}>How comfortable are you with investment risk?</p>
            <select value={profile.riskProfile} onChange={(e) => handleChange('riskProfile', e.target.value)} style={inputStyle}>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        );
      case 8:
        return (
          <div>
            <h2>Step 8: Choose a Theme</h2>
            <p style={{marginBottom: '1rem'}}>Pick your initial FinPilot theme.</p>
            <select value={profile.theme} onChange={(e) => {
               handleChange('theme', e.target.value);
               document.documentElement.setAttribute('data-theme', e.target.value);
            }} style={inputStyle}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="high-contrast">High Contrast</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        );
      default: return null;
    }
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      {renderStep()}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button className="outline" onClick={prevStep} disabled={step === 1}>Back</button>
        {step < 8 ? (
          <button onClick={nextStep}>Next</button>
        ) : (
          <button onClick={handleFinish}>Enter FinPilot</button>
        )}
      </div>
      <div style={{marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>
        Step {step} of 8
      </div>
    </div>
  );
}
