import { useState } from 'react';

export default function MovieGuessInput({ movies, onGuess, disabled, gameStatus }) {
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setUserInput(value);
    if (value) {
      const filteredSuggestions = movies.filter(movie =>
        movie.title.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onGuess(suggestion);
    setUserInput('');
    setSuggestions([]);
  };

  let inputValue = userInput;
  if (gameStatus === 'outOfGuesses') {
    inputValue = 'Out of guesses, try again!';
  } else if (gameStatus === 'correct') {
    inputValue = 'Guessed Correctly! Great Job!';
  }

  return (
    <div>
      <input 
        type="text" 
        style={{ color: 'black' }}
        value={inputValue} 
        onChange={handleInputChange} 
        placeholder="Guess the movie"
        disabled={disabled}
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map(suggestion => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
