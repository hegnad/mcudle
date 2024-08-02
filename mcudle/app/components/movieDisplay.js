export default function MovieDisplay({ movie, onChangeMovie }) {
    return (
      <div>
        <h2>Today's Movie: {movie.title}</h2>
        <button onClick={onChangeMovie}>Change Movie</button>
      </div>
    );
  }
  