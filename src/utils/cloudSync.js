import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Debounce timer
let syncTimer = null;

export const syncToCloud = () => {
  if (!auth || !auth.currentUser || !db) return;
  
  if (syncTimer) clearTimeout(syncTimer);
  
  syncTimer = setTimeout(async () => {
    try {
      const uid = auth.currentUser.uid;
      const data = {
        transactions: JSON.parse(localStorage.getItem('finpilot_transactions') || '[]'),
        portfolio: JSON.parse(localStorage.getItem('finpilot_portfolio') || '{"cash":100000,"holdings":{}}'),
        watchlist: JSON.parse(localStorage.getItem('finpilot_watchlist') || '[]'),
        user_profile: JSON.parse(localStorage.getItem('finpilot_profile') || '{"name":"User","riskProfile":"moderate"}'),
        goals: JSON.parse(localStorage.getItem('finpilot_goals') || '[]'),
        lastSynced: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', uid), data);
      console.log('✅ Data synced to Firebase successfully.');
    } catch (error) {
      console.error('❌ Error syncing to Firebase:', error);
    }
  }, 1000); // 1s debounce
};

export const pullFromCloud = async () => {
  if (!auth || !auth.currentUser || !db) return false;
  const uid = auth.currentUser.uid;
  
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.transactions) localStorage.setItem('finpilot_transactions', JSON.stringify(data.transactions));
      if (data.portfolio) localStorage.setItem('finpilot_portfolio', JSON.stringify(data.portfolio));
      if (data.watchlist) localStorage.setItem('finpilot_watchlist', JSON.stringify(data.watchlist));
      if (data.user_profile) localStorage.setItem('finpilot_profile', JSON.stringify(data.user_profile));
      if (data.goals) localStorage.setItem('finpilot_goals', JSON.stringify(data.goals));
      console.log('✅ Data pulled from Firebase successfully.');
      return true;
    }
  } catch (error) {
    console.error('❌ Error pulling from Firebase:', error);
  }
  return false;
};
