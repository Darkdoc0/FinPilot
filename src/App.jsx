import { useState, useEffect } from 'react';
import './index.css';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import FinPilotAI from './components/FinPilotAI';
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
      <div className="app-container animate-fade-in">
        <div className="top-bar justify-center mb-6">
          <h1 className="logo-text text-center"><span className="logo-fin">Fin</span><span className="logo-pilot">Pilot</span></h1>
        </div>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <>
      <Layout profile={profile} />
      <FinPilotAI profile={profile} />
    </>
  );
}

export default App;
