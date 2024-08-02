"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import MovieGuessInput from './components/movieGuessInput';
import MovieFeedback from './components/movieFeedback';
import MovieDisplay from './components/movieDisplay';
import MoviePoster from './components/moviePoster';
import MovieList from './components/movieList';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [moviePoster, setMoviePoster] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [gameStatus, setGameStatus] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      selectMovie();
    }
  }, [movies]);

  useEffect(() => {
    if (selectedMovie) {
      fetchMoviePoster(selectedMovie.id);
    }
  }, [selectedMovie]);

  const fetchMovies = async () => {
    try {
      let allMovies = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=28&with_keywords=180547&language=en-US&page=${page}`);
        allMovies = [...allMovies, ...response.data.results];
        totalPages = response.data.total_pages;
        page++;
      }

      const detailedMovies = await Promise.all(
        allMovies.map(async movie => {
          const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=keywords`);
          return movieDetails.data;
        })
      );

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

  const selectMovie = () => {
    const today = new Date();
    const startDate = new Date('2023-01-01');
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const movieIndex = daysSinceStart % movies.length;
    setSelectedMovie(movies[movieIndex]);
  };

  const fetchMoviePoster = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
      if (response.data.posters.length > 0) {
        setMoviePoster(`https://image.tmdb.org/t/p/original${response.data.posters[0].file_path}`);
      } else {
        setMoviePoster('');
      }
    } catch (error) {
      console.error("Error fetching movie poster from TMDB", error);
    }
  };

  const getRandomMovie = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setSelectedMovie(movies[randomIndex]);
      setGuesses([]);
      setFeedbacks([]);
      setGameStatus('');
      setMoviePoster('');
    }
  };

  const handleGuess = (movie) => {
    if (guesses.length >= 4 || gameStatus) return;
    setGuesses([...guesses, movie]);
    generateFeedback(movie);

    if (movie.id === selectedMovie.id) {
      setGameStatus('correct');
    } else if (guesses.length === 3) {
      setGameStatus('outOfGuesses');
    }
  };

  const generateFeedback = (guess) => {
    if (!selectedMovie) return;

    const feedback = {};
    const guessDate = new Date(guess.release_date);
    const selectedDate = new Date(selectedMovie.release_date);

    const yearDiff = Math.abs(selectedDate.getFullYear() - guessDate.getFullYear());
    feedback.releaseDate = yearDiff <= 2 ? 'yellow' : 'red';

    const scoreDiff = Math.abs(selectedMovie.vote_average * 10 - guess.vote_average * 10);
    feedback.userScore = scoreDiff <= 10 ? (guess.vote_average < selectedMovie.vote_average ? 'yellow down' : 'yellow up') : 'red';

    const revenueDiff = Math.abs(selectedMovie.revenue - guess.revenue);
    feedback.revenue = revenueDiff <= 100000000 ? 'yellow' : 'red';

    setFeedbacks([...feedbacks, feedback]);
  };

  return (
    <div>
      <h1>Marvel Cinematic Universe Movie Guessing Game</h1>
      {selectedMovie ? (
        <MovieDisplay movie={selectedMovie} onChangeMovie={getRandomMovie} />
      ) : (
        <p>Loading...</p>
      )}
      {moviePoster && guesses.length >= 2 && (
        <MoviePoster poster={moviePoster} blurLevel={gameStatus === '' ? (guesses.length === 2 ? 50 : 20) : 0} />
      )}
      <MovieGuessInput 
        movies={movies} 
        onGuess={handleGuess} 
        disabled={gameStatus !== ''} 
        gameStatus={gameStatus} 
      />
      {guesses.map((guess, index) => (
        <MovieFeedback key={index} guess={guess} feedback={feedbacks[index]} />
      ))}
      {gameStatus === 'outOfGuesses' && (
        <div>
          <button onClick={getRandomMovie}>Play Again!</button>
        </div>
      )}
      {gameStatus === 'correct' && (
        <div>
          <button onClick={getRandomMovie}>Play Again!</button>
        </div>
      )}
    </div>
  );
}
