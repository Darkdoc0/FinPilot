import React, { useState, useEffect } from 'react';
import { saveProfile } from '../utils/storage';
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from '../utils/firebase';
import { pullFromCloud, syncToCloud } from '../utils/cloudSync';

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark', color: '#0b1120' },
  { value: 'light', label: 'Light', color: '#f9f9fb' },
  { value: 'midnight', label: 'Midnight Purple', color: '#0f0a1e' },
  { value: 'ocean', label: 'Ocean Teal', color: '#0a1628' },
];

export default function Profile({ profile }) {
  const [currentTheme, setCurrentTheme] = useState(profile?.theme || 'dark');
  const [currentUser, setCurrentUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (user) pullFromCloud(); // Auto-pull on login
      });
      return () => unsub();
    }
  }, []);

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all local data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleThemeChange = (themeValue) => {
    setCurrentTheme(themeValue);
    document.documentElement.setAttribute('data-theme', themeValue);
    const updatedProfile = { ...profile, theme: themeValue };
    saveProfile(updatedProfile);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
      alert("Login failed. Check console for details.");
    }
  };

  const handleLogout = () => signOut(auth);

  const handleForceSync = async () => {
    setIsSyncing(true);
    await syncToCloud();
    setTimeout(() => { setIsSyncing(false); alert("Saved to cloud."); }, 1000);
  };

  const handlePullData = async () => {
    setIsSyncing(true);
    const success = await pullFromCloud();
    setTimeout(() => setIsSyncing(false), 500);
    if (success) {
      alert("Data pulled from cloud! Reloading...");
      window.location.reload();
    } else {
      alert("No data found in cloud.");
    }
  };

  return (
    <div className="animate-fade-in p-4 mx-auto" style={{ paddingBottom: '100px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '1.5rem' }}>Your Profile</h2>
      
      {/* User Info Card */}
      <div className="glass-panel mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--color-primary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{profile?.name || 'User'}</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, textTransform: 'capitalize' }}>{profile?.mode || 'Unknown'} Mode</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Monthly Income</p>
            <p style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-primary)', margin: 0 }}>₹{Number(profile?.income || 0).toLocaleString()}</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Essential Expenses</p>
            <p style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-warning)', margin: 0 }}>₹{Number(profile?.essentialExpenses || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Cloud Sync Section */}
      <div className="glass-panel mb-6">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Cloud Backup & Sync</h3>
        
        {!currentUser ? (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Sign in to backup your data and access it anywhere.</p>
            <button onClick={handleLogin} className="btn-primary btn-block" style={{ background: '#fff', color: '#333', border: '1px solid #ddd' }}>
              🌐 Sign in with Google
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <img src={currentUser.photoURL} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{currentUser.displayName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>Connected & Syncing</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <button onClick={handleForceSync} className="btn-primary" style={{ padding: '0.75rem', fontSize: '0.9rem' }} disabled={isSyncing}>
                {isSyncing ? 'Syncing...' : 'Push to Cloud'}
              </button>
              <button onClick={handlePullData} className="btn-primary" style={{ padding: '0.75rem', fontSize: '0.9rem', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', boxShadow: 'none' }} disabled={isSyncing}>
                Pull from Cloud
              </button>
            </div>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.875rem', width: '100%', padding: '0.5rem' }}>Sign out</button>
          </div>
        )}
      </div>

      {/* Theme Switcher */}
      <div className="glass-panel mb-6">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>App Theme</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {THEME_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => handleThemeChange(t.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem',
                border: currentTheme === t.value ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: currentTheme === t.value ? 'var(--color-primary-light)' : 'var(--color-surface)',
                cursor: 'pointer', transition: 'all 0.2s ease', color: 'var(--color-text)',
                fontWeight: currentTheme === t.value ? '700' : '500', fontSize: '0.9rem',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.color, border: '2px solid var(--color-border)', flexShrink: 0, boxShadow: currentTheme === t.value ? '0 0 0 3px var(--color-primary)' : 'none' }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Want to start over?</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Resetting will clear your local profile, goals, and transactions.</p>
        <button onClick={handleReset} style={{ background: 'var(--color-danger)', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>
          Reset Data
        </button>
      </div>
    </div>
  );
}
