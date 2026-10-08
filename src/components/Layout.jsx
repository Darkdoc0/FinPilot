import React, { useState } from 'react';
import BottomNav from './BottomNav';
import Home from './Home';
import Plan from './Plan';
import Transactions from './Transactions';
// TODO: Invest and Goals will be implemented in later phases
const Invest = () => <div className="p-4"><h2>Invest</h2><p>Coming in Phase 3</p></div>;
const Goals = () => <div className="p-4"><h2>Goals</h2><p>Coming in Phase 4</p></div>;

function Layout({ profile }) {
  const [currentTab, setCurrentTab] = useState('home');

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return <Home profile={profile} />;
      case 'transactions':
        return <Transactions />;
      case 'plan':
        return <Plan profile={profile} />;
      case 'invest':
        return <Invest />;
      case 'goals':
        return <Goals />;
      default:
        return <Home profile={profile} />;
    }
  };

  return (
    <div className="app-container">
      <main className="content">
        {renderTab()}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default Layout;
