export default function MovieFeedback({ guess, feedback }) {
    return (
      <div>
        <h2>Your Guess: {guess.title}</h2>
        <ul>
          <li>Release Date: <span>{feedback.releaseDate === 'yellow' ? 'Close' : 'Far'}</span></li>
          <li>TMDB User Score: <span>{feedback.userScore.includes('yellow') ? feedback.userScore.includes('down') ? 'Close (Down)' : 'Close (Up)' : 'Far'}</span></li>
          <li>Revenue: <span>{feedback.revenue === 'yellow' ? 'Close' : 'Far'}</span></li>
        </ul>
      </div>
    );
  }
  