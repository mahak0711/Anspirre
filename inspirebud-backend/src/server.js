import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const apiUrl = 'https://api.bitget.com/api/v1';

// Helper function to create request signature
const getSignature = (params, secretKey) => {
  const paramString = new URLSearchParams(params).toString();
  const signature = crypto.createHmac('sha256', secretKey).update(paramString).digest('hex');
  return signature;
};

// Helper function to create request headers
const createHeaders = (params, apiKey, secretKey) => {
  return {
    'Content-Type': 'application/json',
    'ACCESS-KEY': apiKey,
    'SIGNATURE': getSignature(params, secretKey),
  };
};

// Check wallet connection status endpoint
let walletConnected = false;

app.get('/wallet/status', (req, res) => {
  res.json({ connected: walletConnected });
});

// Connect wallet endpoint
app.post('/wallet/connect', (req, res) => {
  // Simulate successful wallet connection
  walletConnected = true;
  res.json({ connected: true });
});

// Disconnect wallet endpoint
app.post('/wallet/disconnect', (req, res) => {
  // Simulate wallet disconnection
  walletConnected = false;
  res.json({ connected: false });
});

// Generate prompt endpoint
app.post('/generate', async (req, res) => {
  const { genre, style, tone, themes } = req.body;
  console.log('Request received:', { genre, style, tone, themes });

  try {
    if (!walletConnected) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    // Add your prompt generation logic here
    const suggestion = `Your generated prompt: Genre: ${genre}, Style: ${style}, Tone: ${tone}, Themes: ${themes}`;

    res.json({ suggestion });
  } catch (error) {
    console.error('Error generating suggestion:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
