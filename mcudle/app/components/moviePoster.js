export default function MoviePoster({ poster, blurLevel }) {
    return (
      <div>
        <img 
          src={poster} 
          alt="Movie Poster" 
          style={{
            width: '15%', 
            maxHeight: '15%', 
            objectFit: 'cover', 
            filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none'
          }} 
        />
      </div>
    );
  }
  