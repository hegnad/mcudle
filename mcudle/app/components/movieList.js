import { useEffect } from 'react';
import axios from 'axios';

export default function MovieList({ setMovies }) {
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

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return null;
}
