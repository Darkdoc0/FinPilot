import { useState, useEffect } from 'react';
import './index.css';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
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

  return <Layout profile={profile} />;
}

export default App;
