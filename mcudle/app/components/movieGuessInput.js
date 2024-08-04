import { useState, useEffect } from 'react';

export default function MovieGuessInput({ movies, onGuess, disabled, gameStatus }) {
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (userInput && gameStatus === '') {
      const filteredSuggestions = movies.filter(movie =>
        movie.title.toLowerCase().startsWith(userInput.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [userInput, movies, gameStatus]);

  const handleChange = (e) => {
    setUserInput(e.target.value);
    setActiveSuggestion(0);
  };

  const handleClick = (suggestion) => {
    setUserInput(suggestion.title);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (activeSuggestion < suggestions.length - 1) {
        setActiveSuggestion(activeSuggestion + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestion > 0) {
        setActiveSuggestion(activeSuggestion - 1);
      }
    } else if (e.key === 'Tab') {
      if (showSuggestions && suggestions.length > 0) {
        e.preventDefault(); // Prevent losing focus from the input
        setUserInput(suggestions[activeSuggestion].title);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Enter') {
      if (userInput) {
        const selectedMovie = suggestions.find(movie => movie.title === userInput);
        if (selectedMovie) {
          e.preventDefault(); // Prevent form submission
          onGuess(selectedMovie);
        }
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Guess the movie"
        disabled={disabled}
        style={{ color: 'black' }}
      />
      {showSuggestions && userInput && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              onClick={() => handleClick(suggestion)}
              style={{
                background: index === activeSuggestion ? '#ddd' : '#fff',
                cursor: 'pointer',
                padding: '5px',
                color: 'black',
              }}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
