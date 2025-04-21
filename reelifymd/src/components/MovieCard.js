import React from "react";

function MovieCard({ movie, onClick, onPlayTrailer, showTrailerButton = true }) {
  const handleTrailerClick = (e) => {
    e.stopPropagation();
    // First open the detail view
    onClick(); 
    // Then trigger trailer load
    setTimeout(() => onPlayTrailer(), 100); // Small delay to ensure detail view is open
  };

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-poster">
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
            alt={movie.title} 
          />
        ) : (
          <div className="no-poster">No Image</div>
        )}
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</span>
            {showTrailerButton && (
              <button 
                className="trailer-btn" 
                onClick={handleTrailerClick}
              >
                ▶ Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;