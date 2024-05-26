import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GeneralChat } from '@chaingpt/generalchat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const CHAIN_GPT_API_KEY = process.env.CHAIN_GPT_API_KEY;

// Mock wallet status
let walletConnected = false;

// Wallet endpoints
app.post('/wallet/connect', (req, res) => {
  walletConnected = true;
  res.status(200).json({ connected: walletConnected });
});

app.post('/wallet/disconnect', (req, res) => {
  walletConnected = false;
  res.status(200).json({ connected: walletConnected });
});

app.get('/wallet/status', (req, res) => {
  res.status(200).json({ connected: walletConnected });
});

// ChainGPT endpoint
app.post('/generate', async (req, res) => {
  const { tone, genre, style, theme } = req.body;
  console.log('Request received:', { tone, genre, style, theme });

  try {
    if (!CHAIN_GPT_API_KEY) {
      throw new Error('ChainGPT API key is not set. Please check your environment variables.');
    }

    const generalchat = new GeneralChat({ apiKey: CHAIN_GPT_API_KEY });

    const prompt = `Generate a short creative writing prompt with the following preferences:
    Tone: ${tone},
    Genre: ${genre},
    Style: ${style},
    Theme: ${theme}`;

    console.log('Sending prompt to ChainGPT:', prompt);

    const stream = await generalchat.createChatStream({ question: prompt, chatHistory: "off" });

    let suggestions = '';
    stream.on('data', (chunk) => {
      suggestions += chunk.toString();
    });

    stream.on('end', () => {
      console.log('Suggestions received:', suggestions);
      res.json({ suggestions: suggestions.split('\n').filter(s => s.trim()) });
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error.message);
      res.status(500).json({ message: 'Failed to generate suggestions. Please try again later.' });
    });

  } catch (error) {
    console.error('Error generating suggestions:', error.message);
    res.status(500).json({ message: 'Failed to generate suggestions. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
