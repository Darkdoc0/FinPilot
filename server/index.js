require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const SETU_CLIENT_ID = process.env.SETU_CLIENT_ID || '';
const SETU_CLIENT_SECRET = process.env.SETU_CLIENT_SECRET || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat endpoint for Gemini Interactions API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, profile, previousInteractionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server' });
    }

    const systemInstruction = `You are FinPilot AI, a helpful financial assistant for a personal finance app.
The user's profile information is as follows:
Name: ${profile?.name || 'Unknown'}
Mode: ${profile?.mode || 'Unknown'}
Monthly Income: ₹${profile?.income || 0}
Essential Expenses: ₹${profile?.essentialExpenses || 0}
Risk Profile: ${profile?.risk || 'Unknown'}
Emergency Fund Status: ${profile?.emergencyFund || 'Unknown'}

Provide concise, friendly, and practical financial guidance based on this profile. Keep your answers brief (1-2 short paragraphs) since this is a mobile chat interface. Do not give certified legal or investment advice. Format with plain text or simple markdown.`;

    const requestParams = {
      model: 'gemini-3.5-flash-lite',
      input: message,
      system_instruction: systemInstruction,
      generation_config: {
        temperature: 0.7,
        max_output_tokens: 200,
      }
    };

    if (previousInteractionId) {
      requestParams.previous_interaction_id = previousInteractionId;
    }

    const response = await ai.interactions.create(requestParams);
    
    res.json({
      text: response.output_text,
      interactionId: response.id
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Finnhub proxy endpoint
app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!FINNHUB_API_KEY) {
      // If no API key is provided, just return a 404 to let frontend gracefully fallback
      return res.status(404).json({ error: 'Finnhub API key not configured' });
    }

    // Format for Indian stocks if necessary
    const formattedSymbol = symbol === 'RELIANCE' ? 'RELIANCE.NS' : 
                            symbol === 'TCS' ? 'TCS.NS' : 
                            symbol === 'HDFCBANK' ? 'HDFCBANK.NS' : 
                            symbol === 'INFY' ? 'INFY.NS' : symbol;
                            
    const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: {
        symbol: formattedSymbol,
        token: FINNHUB_API_KEY
      }
    });

    const data = response.data;
    if (data && data.c) {
      res.json({
        price: data.c,
        change: data.d,
        changePercent: data.dp
      });
    } else {
      res.status(404).json({ error: 'Stock data not found' });
    }
  } catch (error) {
    console.error(`Finnhub API Error for ${req.params.symbol}:`, error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/stocks/:symbol/candles', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { resolution = 'D', from, to } = req.query;
    
    if (!FINNHUB_API_KEY) {
      return res.status(404).json({ error: 'Finnhub API key not configured' });
    }

    const formattedSymbol = symbol === 'RELIANCE' ? 'RELIANCE.NS' : 
                            symbol === 'TCS' ? 'TCS.NS' : 
                            symbol === 'HDFCBANK' ? 'HDFCBANK.NS' : 
                            symbol === 'INFY' ? 'INFY.NS' : symbol;
                            
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/stock/candle`, {
        params: {
          symbol: formattedSymbol,
          resolution,
          from,
          to,
          token: FINNHUB_API_KEY
        }
      });

      const data = response.data;
      if (data && data.s === 'ok') {
        return res.json(data);
      }
    } catch (apiError) {
      console.log(`Finnhub Candle API Error (${apiError.message}), falling back to mock data...`);
    }

    // Fallback: Generate realistic looking mock data (30 days of data ending at 'to')
    const toDate = to ? parseInt(to) : Math.floor(Date.now() / 1000);
    const mockData = { s: 'ok', t: [], o: [], h: [], l: [], c: [], v: [] };
    let currentPrice = 150 + Math.random() * 50; // Random starting price

    for (let i = 29; i >= 0; i--) {
      const timestamp = toDate - (i * 24 * 60 * 60);
      const open = currentPrice;
      const change = (Math.random() - 0.5) * (currentPrice * 0.05); // +/- 2.5% max daily change
      const close = open + change;
      const high = Math.max(open, close) + (Math.random() * currentPrice * 0.02);
      const low = Math.min(open, close) - (Math.random() * currentPrice * 0.02);
      const volume = Math.floor(100000 + Math.random() * 900000);

      mockData.t.push(timestamp);
      mockData.o.push(open);
      mockData.h.push(high);
      mockData.l.push(low);
      mockData.c.push(close);
      mockData.v.push(volume);

      currentPrice = close;
    }

    return res.json(mockData);

  } catch (error) {
    console.error(`Error for ${req.params.symbol}:`, error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Setu Account Aggregator (Sandbox Mock endpoints)
app.post('/api/setu/consent', async (req, res) => {
  try {
    if (!SETU_CLIENT_ID || !SETU_CLIENT_SECRET) {
      return res.status(400).json({ error: 'Setu credentials not configured' });
    }
    
    // In a real integration, we'd sign the consent object with a JWS private key
    // and hit POST https://fiu-sandbox.setu.co/v2/consents
    
    // Returning a dummy redirect URL simulating Setu's Sandbox AA portal
    res.json({
      id: 'consent-mock-12345',
      redirectUrl: 'https://fiu-sandbox.setu.co/mock-consent?session=12345',
    });
  } catch (err) {
    console.error('Error creating Setu consent:', err);
    res.status(500).json({ error: 'Failed to create consent' });
  }
});

app.post('/api/setu/webhook', (req, res) => {
  // Setu will hit this when the user approves/rejects the consent
  console.log('Received Webhook from Setu:', req.body);
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`FinPilot backend running on port ${PORT}`);
});
