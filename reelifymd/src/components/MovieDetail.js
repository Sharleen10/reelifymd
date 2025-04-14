// MovieDetail.js
import React from "react";

function MovieDetail({ movie, trailerKey, onClose, onPlayTrailer }) {
  return (
    <div className="movie-detail-overlay">
      <div className="movie-detail">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="movie-detail-content">
          <div className="movie-poster-detail">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
              />
            ) : (
              <div className="no-poster-detail">No Image</div>
            )}
          </div>
          
          <div className="movie-info-detail">
            <h2>{movie.title}</h2>
            <div className="movie-meta-detail">
              <span className="movie-release">Release: {movie.release_date}</span>
              <span className="movie-rating-detail">Rating: ⭐ {movie.vote_average.toFixed(1)}</span>
            </div>
            <p className="movie-overview">{movie.overview}</p>
            
            {!trailerKey ? (
              <button className="play-trailer-btn" onClick={onPlayTrailer}>
                ▶ Watch Trailer
              </button>
            ) : (
              <div className="trailer-container">
                <iframe
                  title={`${movie.title} Trailer`}
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;