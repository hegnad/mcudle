"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieGuessInput from '../components/movieGuessInput';
import MovieFeedback from '../components/movieFeedback';
import MoviePoster from '../components/moviePoster';
import MovieList from '../components/movieList';
import HelpModal from '../components/helpModal';
import styles from '../page.module.css';
import Link from 'next/link';

const Home = () => {

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [moviePoster, setMoviePoster] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalPlays, setTotalPlays] = useState(0);

  useEffect(() => {
    if (movies.length > 0 && initialLoad) {
      selectMovie();
      setInitialLoad(false); // Ensure this runs only once on initial load
    }
  }, [movies, initialLoad]);

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
    }
  };

  const resetGame = () => {
    getRandomMovie();
    setGuesses([]);
    setFeedbacks([]);
    setGameStatus('');
    setMoviePoster('');
  };

  const handleGuess = (movie) => {
    if (guesses.length >= 4 || gameStatus) return;
    setGuesses([...guesses, movie]);
    const newFeedback = generateFeedback(movie);
    setFeedbacks([...feedbacks, newFeedback]);
    
    let guessPosition = guesses.length + 1; // declare guess position variable
    let newTotalPlays = totalPlays + 1; // declare total plays variable

    if (movie.id === selectedMovie.id) {
      setGameStatus('correct');
      guessPosition = guessPosition < 4 ? guessPosition : "4";
      updateUserStats(guessPosition);
      setTotalPlays(newTotalPlays);
      localStorage.setItem('totalPlays', newTotalPlays);
    } else if (guesses.length === 3) {
      setGameStatus('outOfGuesses');
      updateUserStats(null);
      setTotalPlays(newTotalPlays);
      localStorage.setItem('totalPlays', newTotalPlays);
    }
  };

  const updateUserStats = (correctGuessPos) => {
    const userStats = JSON.parse(localStorage.getItem('userStats')) || 
      { totalGames: 0, correctGuesses: {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
        } 
      };

    userStats.totalGames += 1;
    
    if (correctGuessPos) {
      userStats.correctGuesses[correctGuessPos] += 1;
    }
    
    localStorage.setItem('userStats', JSON.stringify(userStats));

  };



  const generateFeedback = (guess) => {
    if (!selectedMovie) return {};

    const feedback = {correct: guess.id === selectedMovie.id };
    const guessDate = new Date(guess.release_date);
    const selectedDate = new Date(selectedMovie.release_date);

    // Release Date Feedback

    const yearDiff = Math.abs(selectedDate.getFullYear() - guessDate.getFullYear());
    if (yearDiff === 0) {
      feedback.releaseDate = '✅ Correct!';
    } else if (yearDiff <= 3) {
      feedback.releaseDate = guessDate < selectedDate ? '🔺 Close!' : '🔻 Close!';
    } else {
      feedback.releaseDate = 'Far';
    }

    // TMDB User Score Feedback

    const selectedMovieScore = Math.round(selectedMovie.vote_average * 10); // Converting to whole percentage
    const guessScore = Math.round(guess.vote_average * 10); // Converting to whole percentage
    const scoreDiff = Math.abs(selectedMovieScore - guessScore);

    if (scoreDiff <= 5) {
      feedback.userScore = `✅ Correct! ${selectedMovieScore}%`;
    } else if (scoreDiff <= 15) {
      feedback.userScore = guessScore < selectedMovieScore ? '🔺 Close!' : '🔻 Close!';
    } else {
      feedback.userScore = 'Far';
    }


    // Actors Feedback

    if (guess.id === selectedMovie.id) {
      feedback.actors = '✅ Correct!';
    } else {
      const sharedActors = selectedMovie.credits.cast
        .filter(actor => actor.name !== "Stan Lee")
        .filter(actor => guess.credits.cast.some(guessActor => guessActor.id === actor.id && guessActor.name !== "Stan Lee"));
      feedback.actors = sharedActors.length > 0 ? `${sharedActors.map(actor => actor.name).join(', ')}` : 'None';
    }

    return feedback;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.mainHeader}>MCUDLE</h1>
        <div className={styles.headerImages}>
          <img
            src="/help.svg"
            alt="Help"
            className={styles.headerImage}
            onClick={() => setIsHelpOpen(true)} // Open the modal on click
          />
          <Link href="/">
            <img src="/profile.svg" alt="Profile" className={styles.headerImage} />
          </Link>
        </div>
      </div>
      <hr className={styles.headerLine} />
      <MovieList setMovies={setMovies} />
      <div className={styles.posterContainer}>
        <MoviePoster poster={moviePoster} guesses={guesses} gameStatus={gameStatus} />
      </div>
      <hr className={styles.headerLine} />
      <MovieGuessInput 
        movies={movies} 
        onGuess={handleGuess} 
        disabled={gameStatus !== ''} 
        gameStatus={gameStatus} 
        className={styles.guessInput}
      />
            <hr className={styles.headerLine} />

      <div className={styles.feedbackHeader}>
        <div>Your Guess</div>
        <div>Release Year</div>
        <div>TMDB User Score</div>
        <div>Shared Actors</div>
      </div>
      {[...Array(4)].map((_, index) => (
        <MovieFeedback key={index} guess={guesses[index]} feedback={feedbacks[index] || { correct: false }} guessNumber={index + 1} />
      ))}
      {gameStatus === 'outOfGuesses' && (
        <div>
          <button onClick={resetGame} className={styles.playAgainButton}>Play Again!</button>
        </div>
      )}
      {gameStatus === 'correct' && (
        <div>
          <button onClick={() => { resetGame(); document.querySelector('input').value = ''; }} className={styles.playAgainButton}>Play Again!</button>
        </div>
      )}
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default Home;
