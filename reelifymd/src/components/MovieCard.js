// MovieCard.js
import React from "react";

function MovieCard({ movie, onClick, onPlayTrailer }) {
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
            <button 
              className="trailer-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer();
              }}
            >
              ▶ Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
