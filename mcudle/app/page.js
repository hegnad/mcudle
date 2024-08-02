"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [userGuess, setUserGuess] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let allMovies = [];
        let page = 1;
        let totalPages = 1;

        // Fetch movies until all pages are retrieved
        while (page <= totalPages) {
          const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=28&with_keywords=180547&language=en-US&page=${page}`);
          allMovies = [...allMovies, ...response.data.results];
          totalPages = response.data.total_pages;
          page++;
        }

        // Fetch detailed movie info to filter by keywords and release date
        const detailedMovies = await Promise.all(
          allMovies.map(async movie => {
            const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=keywords`);
            return movieDetails.data;
          })
        );

        // Filter out short films and unreleased projects
        const theatricalMovies = detailedMovies.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          const today = new Date();
          const isShortFilm = movie.keywords.keywords.some(keyword => keyword.name.toLowerCase() === "short film");
          return !isShortFilm && releaseDate <= today;
        });

        setMovies(theatricalMovies);
      } catch (error) {
        console.error("Error fetching data from TMDB", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      // Get the current date
      const today = new Date();
      const startDate = new Date('2023-01-01'); // Start date for the game
      const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      // Select the movie based on the day index
      const movieIndex = daysSinceStart % movies.length;
      setSelectedMovie(movies[movieIndex]);
    }
  }, [movies]);

  const getRandomMovie = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setSelectedMovie(movies[randomIndex]);
    }
  };

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

  const handleGuess = (movie) => {
    setUserGuess(movie);
    setUserInput('');
    setSuggestions([]);
    generateFeedback(movie);
  };

  const generateFeedback = (guess) => {
    if (!selectedMovie) return;

    const feedback = {};
    const guessDate = new Date(guess.release_date);
    const selectedDate = new Date(selectedMovie.release_date);
    
    // Release Date Feedback
    const yearDiff = Math.abs(selectedDate.getFullYear() - guessDate.getFullYear());
    feedback.releaseDate = yearDiff <= 2 ? 'yellow' : 'red';

    // TMDB User Score Feedback
    const scoreDiff = Math.abs(selectedMovie.vote_average * 10 - guess.vote_average * 10); // Converting to percentage
    feedback.userScore = scoreDiff <= 10 ? (guess.vote_average < selectedMovie.vote_average ? 'yellow down' : 'yellow up') : 'red';

    // Revenue Feedback (assuming revenue info is part of the movie details)
    const revenueDiff = Math.abs(selectedMovie.revenue - guess.revenue);
    feedback.revenue = revenueDiff <= 100000000 ? 'yellow' : 'red';

    setFeedback(feedback);
  };

  return (
    <div>
      <h1>Marvel Cinematic Universe Movie Guessing Game</h1>
      {selectedMovie ? (
        <div>
          <h2>Today's Movie: {selectedMovie.title}</h2>
          {/* Add more details or game logic here */}
          <button onClick={getRandomMovie}>Change Movie</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <input 
          type="text" 
          value={userInput} 
          onChange={handleInputChange} 
          placeholder="Guess the movie"
        />
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map(suggestion => (
              <li key={suggestion.id} onClick={() => handleGuess(suggestion)}>
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      {userGuess && (
        <div>
          <h2>Your Guess: {userGuess.title}</h2>
          <ul>
            <li>Release Date: <span>{feedback.releaseDate === 'yellow' ? 'Close' : 'Far'}</span></li>
            <li>TMDB User Score: <span>{feedback.userScore.includes('yellow') ? feedback.userScore.includes('down') ? 'Close (Down)' : 'Close (Up)' : 'Far'}</span></li>
            <li>Revenue: <span>{feedback.revenue === 'yellow' ? 'Close' : 'Far'}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
