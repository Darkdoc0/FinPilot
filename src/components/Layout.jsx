import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Home from './Home';
import Plan from './Plan';
import Transactions from './Transactions';
import Invest from './Invest';
import Goals from './Goals';
import Profile from './Profile';

function Layout({ profile }) {
  const [currentTab, setCurrentTab] = useState('home');

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return <Home profile={profile} onTabChange={setCurrentTab} />;
      case 'transactions':
        return <Transactions profile={profile} />;
      case 'plan':
        return <Plan profile={profile} onTabChange={setCurrentTab} />;
      case 'invest':
        return <Invest profile={profile} />;
      case 'goals':
        return <Goals profile={profile} />;
      case 'profile':
        return <Profile profile={profile} />;
      default:
        return <Home profile={profile} />;
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="top-bar">
        <h1 className="logo-text"><span className="logo-fin">Fin</span><span className="logo-pilot">Pilot</span></h1>
        <div 
          className="avatar-circle" 
          onClick={() => setCurrentTab('profile')} 
          style={{ cursor: 'pointer' }}
          title="Profile Settings"
        >
          {profile?.name ? (
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{profile.name.charAt(0).toUpperCase()}</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
              <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.25997 15 3.40997 18.13 3.40997 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </header>
      <main className="content">
        {renderTab()}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default Layout;
