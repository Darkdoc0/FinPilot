import React, { useState, useRef, useEffect } from 'react';

const FinPilotAI = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: 'Hi! I am FinPilot AI, powered by Gemini. Ask me anything about your finances or your current budget!' }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastInteractionId, setLastInteractionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', parts: [{ text: userText }] }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          profile: profile,
          previousInteractionId: lastInteractionId
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.text || "I'm sorry, I couldn't generate a response.";
      
      setMessages([...newMessages, { role: 'model', parts: [{ text: aiText }] }]);
      if (data.interactionId) {
        setLastInteractionId(data.interactionId);
      }
      
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: `Error: ${error.message}` }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <button 
        className="fab transition-all hover:scale-105 active:scale-95" 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
          cursor: 'pointer',
          zIndex: 1000
        }}
        title="FinPilot AI Assistant"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M12 7v0"></path><path d="M12 11v4"></path></svg>
      </button>

      {isOpen && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: '20px',
          bottom: '90px',
          right: '20px',
          left: '20px',
          background: 'var(--color-bg)',
          borderRadius: '24px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          border: '1px solid var(--color-border)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ background: 'var(--color-surface)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14.5A4.5 4.5 0 1 1 16.5 12 4.5 4.5 0 0 1 12 16.5z"></path></svg>
              </div>
              <h3 className="m-0 text-xl font-bold" style={{ color: 'var(--color-text)' }}>FinPilot AI</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="text-muted hover:text-text transition-colors" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          
          <div style={{ padding: '10px 15px', background: 'var(--color-surface-hover)', fontSize: '0.75rem', textAlign: 'center', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Powered by Gemini AI
          </div>

          <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? 'linear-gradient(135deg, var(--color-primary), #60a5fa)' : 'var(--color-surface)',
                color: m.role === 'user' ? 'white' : 'var(--color-text)',
                padding: '12px 18px',
                borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                maxWidth: '85%',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                border: m.role === 'user' ? 'none' : '1px solid var(--color-border)',
                lineHeight: '1.5',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {formatText(m.parts[0].text)}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--color-surface)', color: 'var(--color-text-muted)', padding: '12px 18px', borderRadius: '20px 20px 20px 4px', fontSize: '0.9rem', border: '1px solid var(--color-border)' }}>
                <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '16px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your budget, goals..." 
              className="w-full focus:outline-none transition-colors font-medium"
              style={{ flex: 1, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '24px', padding: '12px 20px' }}
              disabled={isLoading}
            />
            <button type="submit" className="bg-primary text-white p-3 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors border-none shadow-md" style={{ width: '48px', height: '48px', cursor: 'pointer', opacity: (!input.trim() || isLoading) ? 0.6 : 1 }} disabled={!input.trim() || isLoading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-2px) rotate(45deg)' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FinPilotAI;
