import { useState, useEffect } from 'react';
import './index.css';
import Onboarding from './components/Onboarding';
import { loadProfile, saveProfile } from './utils/storage';

function App() {
  const [profile, setProfile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      document.documentElement.setAttribute('data-theme', saved.theme || 'light');
    }
    setIsLoaded(true);
  }, []);

  const handleOnboardingComplete = (data) => {
    saveProfile(data);
    setProfile(data);
    document.documentElement.setAttribute('data-theme', data.theme);
  };

  if (!isLoaded) return null;

  if (!profile) {
    return (
      <div className="app-container">
        <h1 style={{textAlign: 'center', color: 'var(--color-primary)'}}>FinPilot</h1>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <h1>Welcome to FinPilot</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Mode: {profile.mode} | Income: ₹{profile.income || 0}
        </p>
        
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => {
            saveProfile(null);
            setProfile(null);
          }} className="outline">
            Reset Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
