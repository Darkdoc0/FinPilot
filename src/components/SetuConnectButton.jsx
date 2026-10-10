import React, { useState } from 'react';

export const SetuConnectButton = ({ onConnected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectSetu = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      
      // Step 1: Create a Consent Request on the backend
      const response = await fetch(`${backendUrl}/api/setu/consent`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.redirectUrl) {
        // Step 2: Open the Setu Account Aggregator UI
        // In a real app, this redirects to the AA login where they approve consent with OTP
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.error || 'Failed to generate consent URL');
      }
      
    } catch (err) {
      console.error('Error connecting to Setu:', err);
      setError('Could not connect to Setu Sandbox');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
      <button
        onClick={connectSetu}
        disabled={loading}
        className="btn-primary"
        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Generating Consent...' : 'Link Indian Bank (Setu AA)'}
      </button>
      {error && <span style={{ color: 'red', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  );
};
