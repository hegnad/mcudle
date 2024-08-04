export default function MoviePoster({ poster, guesses, gameStatus }) {
  const blurLevel = gameStatus === 'correct' ? 0 : (gameStatus === '' && guesses.length === 2 ? 50 : (gameStatus === '' && guesses.length === 3 ? 25 : 0));

  return (
    <div style={{ border: '2px solid white', width: '200px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {(guesses.length >= 2 || gameStatus == 'correct') && poster ? (
        <img
          src={poster}
          alt="Movie Poster"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none'
          }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}></div>
      )}
    </div>
  );
}
