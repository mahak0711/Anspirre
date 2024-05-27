import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [preferences, setPreferences] = useState({
    genre: '',
    style: '',
    tone: '',
    themes: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletStatus();
  }, []);

  const checkWalletStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/wallet/status');
      setWalletConnected(response.data.connected);
    } catch (error) {
      console.error('Error checking wallet status:', error.message);
    }
  };

  const connectWallet = async () => {
    try {
      const response = await axios.post('http://localhost:3000/wallet/connect');
      if (response.data.connected) {
        setWalletConnected(true);
        toast.success('Wallet connected successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
      toast.error('Failed to connect wallet. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      const response = await axios.post('http://localhost:3000/wallet/disconnect');
      if (!response.data.connected) {
        setWalletConnected(false);
        toast.success('Wallet disconnected successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error.message);
      toast.error('Failed to disconnect wallet. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate', preferences);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message || 'Server error';
        if (statusCode === 401) {
          console.error('Authorization failed for ChainGPT API');
        } else {
          console.error('Server error:', errorMessage);
        }
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>InspireBud</h1>
      <div className="wallet-status">
        {walletConnected ? (
          <div>
            Wallet Status: Connected{' '}
            <button onClick={disconnectWallet} disabled={loading}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} disabled={loading}>
            Connect Wallet
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Genre:
          <input
            type="text"
            name="genre"
            value={preferences.genre}
            placeholder="e.g., Science Fiction, Fantasy"
            onChange={handleChange}
          />
        </label>
        <label>
          Style:
          <input
            type="text"
            name="style"
            value={preferences.style}
            placeholder="e.g., Abstract, Realism"
            onChange={handleChange}
          />
        </label>
        <label>
          Tone:
          <input
            type="text"
            name="tone"
            value={preferences.tone}
            placeholder="e.g., Humorous, Dark"
            onChange={handleChange}
          />
        </label>
        <label>
          Themes:
          <input
            type="text"
            name="themes"
            value={preferences.themes}
            placeholder="e.g., Adventure, Love, Mystery"
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={loading || !walletConnected}>
          {loading ? 'Generating...' : 'Generate Suggestions'}
        </button>
      </form>
      <div className="suggestions">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion">
              {suggestion}
            </div>
          ))
        ) : (
          <p>No suggestions yet. Please generate suggestions.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
