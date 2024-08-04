"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieGuessInput from './components/movieGuessInput';
import MovieFeedback from './components/movieFeedback';
import MovieDisplay from './components/movieDisplay';
import MoviePoster from './components/moviePoster';
import MovieList from './components/movieList';
import styles from './page.module.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [moviePoster, setMoviePoster] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [gameStatus, setGameStatus] = useState('');

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
    const newFeedback = generateFeedback(movie);
    setFeedbacks([...feedbacks, newFeedback]);

    if (movie.id === selectedMovie.id) {
      setGameStatus('correct');
    } else if (guesses.length === 3) {
      setGameStatus('outOfGuesses');
    }
  };

  const generateFeedback = (guess) => {
    if (!selectedMovie) return {};

    if (guess.id === selectedMovie.id) {
      return {
        releaseDate: 'correct',
        userScore: 'correct',
        actors: 'correct',
      };
    }

    const feedback = {};
    const guessDate = new Date(guess.release_date);
    const selectedDate = new Date(selectedMovie.release_date);

    const yearDiff = Math.abs(selectedDate.getFullYear() - guessDate.getFullYear());
    feedback.releaseDate = yearDiff <= 2 ? 'yellow' : 'red';

    const scoreDiff = Math.abs(selectedMovie.vote_average * 10 - guess.vote_average * 10);
    feedback.userScore = scoreDiff <= 10 ? (guess.vote_average < selectedMovie.vote_average ? 'yellow down' : 'yellow up') : 'red';

    const sharedActors = selectedMovie.credits.cast
      .filter(actor => actor.name !== "Stan Lee")
      .filter(actor => guess.credits.cast.some(guessActor => guessActor.id === actor.id && guessActor.name !== "Stan Lee"));
    feedback.actors = sharedActors.length > 0 ? `yellow - ${sharedActors.map(actor => actor.name).join(', ')}` : 'red';

    return feedback;
  };

  return (
    <div className={styles.container}>
      <h1>Marvel Cinematic Universe Movie Guessing Game</h1>
      <MovieList setMovies={setMovies} />
      {selectedMovie ? (
        <MovieDisplay movie={selectedMovie} onChangeMovie={getRandomMovie} />
      ) : (
        <p>Loading...</p>
      )}
      <MoviePoster poster={moviePoster} guesses={guesses} gameStatus={gameStatus} />
      <br />
      <MovieGuessInput 
        movies={movies} 
        onGuess={handleGuess} 
        disabled={gameStatus !== ''} 
        gameStatus={gameStatus} 
      />
      <div className={styles.feedbackHeader}>
        <div>Your Guess</div>
        <div>Release Date</div>
        <div>TMDB User Score</div>
        <div>Actors</div>
      </div>
      {guesses.map((guess, index) => (
        <MovieFeedback key={index} guess={guess} feedback={feedbacks[index] || {}} />
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
