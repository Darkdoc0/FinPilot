import React, { useState, useEffect } from 'react';

const GOALS_KEY = 'finpilot_goals';

export const getGoals = () => {
  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const saveGoals = (goals) => {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error(error);
  }
};

const Goals = ({ profile }) => {
  const [goals, setGoals] = useState([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  useEffect(() => {
    let savedGoals = getGoals();
    if (savedGoals.length === 0 && profile?.goals && profile.goals.length > 0) {
      savedGoals = profile.goals.map((g, i) => ({
        id: `seeded-${i}`,
        name: g,
        target: 100000,
        current: 0
      }));
      saveGoals(savedGoals);
    }
    setGoals(savedGoals);
  }, [profile]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;

    const newGoal = {
      id: Date.now().toString(),
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      current: 0
    };

    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoals(updated);
    
    setNewGoalName('');
    setNewGoalTarget('');
  };

  const handleAddFunds = (id) => {
    const amount = parseFloat(prompt("Enter amount to allocate to this goal:") || "0");
    if (amount <= 0 || isNaN(amount)) return;

    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, current: g.current + amount };
      }
      return g;
    });

    setGoals(updated);
    saveGoals(updated);
  };

  const handleDelete = (id) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  return (
    <div className="animate-fade-in pb-20" style={{ animationDelay: '0.4s' }}>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Goals</h1>
        <p className="text-muted text-lg">Track your savings targets.</p>
      </header>
      
      <section className="mb-8">
        <div className="glass-panel p-6 border border-border shadow-soft rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
          </div>
          <h3 className="mb-5 text-xl font-bold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
            Create a New Goal
          </h3>
          <form onSubmit={handleAddGoal}>
            <div className="mb-4">
              <label className="text-sm font-semibold text-muted mb-2 block uppercase tracking-wider">Goal Name</label>
              <input 
                type="text" 
                placeholder="e.g. Emergency Fund, New Car" 
                value={newGoalName} 
                onChange={(e) => setNewGoalName(e.target.value)} 
                className="w-full bg-surface border border-border text-text rounded-xl p-3 focus:outline-none focus:border-primary transition-colors font-medium"
                style={{
                   width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', boxSizing: 'border-box'
                }}
              />
            </div>
            <div className="mb-6">
              <label className="text-sm font-semibold text-muted mb-2 block uppercase tracking-wider">Target Amount (₹)</label>
              <input 
                type="number" 
                placeholder="50000" 
                value={newGoalTarget} 
                onChange={(e) => setNewGoalTarget(e.target.value)} 
                className="w-full bg-surface border border-border text-text rounded-xl p-3 focus:outline-none focus:border-primary transition-colors font-medium"
                style={{
                   width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '1rem' }}>Add Goal</button>
          </form>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold tracking-tight">Your Goals</h2>
        </div>
        {goals.length === 0 ? (
          <div className="glass-panel text-center py-10 border border-border rounded-2xl">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted mb-3" style={{ opacity: 0.5 }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <p className="text-muted text-lg font-medium">You haven't set any goals yet.</p>
          </div>
        ) : (
          <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.map(goal => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div key={goal.id} className="glass-panel p-6 border border-border shadow-sm rounded-2xl transition-all hover:border-primary group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 className="m-0 text-xl font-bold text-text">{goal.name}</h4>
                    <button onClick={() => handleDelete(goal.id)} className="text-muted hover:text-danger p-1 rounded-md transition-colors" title="Delete Goal" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-baseline mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <p className="text-2xl font-bold text-text" style={{ margin: 0 }}>₹{goal.current.toLocaleString('en-IN')}</p>
                    <p className="text-sm font-semibold text-muted" style={{ margin: 0 }}>of ₹{goal.target.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-full bg-surface h-3 rounded-full overflow-hidden mb-4 border border-border" style={{ height: '12px', background: 'var(--color-surface)', borderRadius: '6px', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        height: '100%',
                        width: `${percent}%`, 
                        background: percent === 100 ? 'var(--color-success)' : 'linear-gradient(90deg, var(--color-primary), #60a5fa)',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                        transition: 'width 0.5s ease-out'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`font-bold text-sm`} style={{ color: percent === 100 ? 'var(--color-success)' : 'var(--color-primary)' }}>
                      {percent}% Complete
                    </span>
                    <button onClick={() => handleAddFunds(goal.id)} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', width: 'auto', borderRadius: '0.5rem' }}>
                      + Add Funds
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Goals;
