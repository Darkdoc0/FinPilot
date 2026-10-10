import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export const PlaidLinkButton = ({ onConnected }) => {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    // Fetch link token when component mounts
    const fetchToken = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/plaid/create_link_token`, {
          method: 'POST',
        });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };
    fetchToken();
  }, []);

  const onSuccess = async (public_token, metadata) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/plaid/exchange_public_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      const data = await response.json();
      if (data.success) {
        onConnected();
      }
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="btn-primary"
      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', opacity: ready ? 1 : 0.5, cursor: ready ? 'pointer' : 'not-allowed' }}
    >
      Connect Bank Account
    </button>
  );
};
