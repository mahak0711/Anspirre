import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [preferences, setPreferences] = useState({
    genre: '',
    style: '',
    tone: '',
    themes: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.log('Response received:', response.data);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="App">
      
      <h1>InspireBud</h1>
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
        <button type="submit" disabled={loading}>
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
    </div>
  );
};

export default Home;
