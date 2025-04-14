import React from "react";
import MovieCard from "./MovieCard";

function MoviePage({
  viewMode, 
  setViewMode, 
  timeWindow, 
  setTimeWindow, 
  categories, 
  changeCategory, 
  movies, 
  handleMovieClick, 
  handleTrailerRequest, 
  isLoading, 
  currentPage, 
  totalPages, 
  handlePageChange, 
  getViewModeTitle,
  filterYear,
  setFilterYear,
  filterCountry,
  setFilterCountry,
  sortBy,
  setSortBy,
  countries,
  years,
  resetFilters
}) {
  return (
    <div className="movie-page">
      <section className="movie-page-header">
        <h1>Movies</h1>
        <p>Discover the best films from around the world</p>
      </section>

      <section className="movie-filters-container">
        <div className="movie-filters">
          <div className="view-modes movie-view-modes">
            <button 
              className={viewMode === "trending" ? "active" : ""} 
              onClick={() => { setViewMode("trending"); }}
            >
              Trending
            </button>
            <button 
              className={viewMode === "popular" ? "active" : ""} 
              onClick={() => { setViewMode("popular"); }}
            >
              Popular
            </button>
            <button 
              className={viewMode === "nowPlaying" ? "active" : ""} 
              onClick={() => { setViewMode("nowPlaying"); }}
            >
              Now Playing
            </button>
            <button 
              className={viewMode === "topRated" ? "active" : ""} 
              onClick={() => { setViewMode("topRated"); }}
            >
              Top Rated
            </button>
            <button 
              className={viewMode === "upcoming" ? "active" : ""} 
              onClick={() => { setViewMode("upcoming"); }}
            >
              Upcoming
            </button>
          </div>

          {viewMode === "trending" && (
            <div className="time-filter">
              <button 
                className={timeWindow === "day" ? "active" : ""} 
                onClick={() => setTimeWindow("day")}
              >
                Today
              </button>
              <button 
                className={timeWindow === "week" ? "active" : ""} 
                onClick={() => setTimeWindow("week")}
              >
                This Week
              </button>
            </div>
          )}
        </div>

        <div className="advanced-filters">
          <h3>Filter & Sort</h3>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Genre</label>
              <select 
                onChange={(e) => changeCategory(e.target.value)} 
                value={viewMode === "genre" ? categories.find(cat => cat.id === parseInt(movies[0]?.genre_ids?.[0]))?.id || "" : ""}
              >
                <option value="">All Genres</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Year</label>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Country</label>
              <select 
                value={filterCountry} 
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity.desc">Popularity (High to Low)</option>
                <option value="popularity.asc">Popularity (Low to High)</option>
                <option value="vote_average.desc">Rating (High to Low)</option>
                <option value="vote_average.asc">Rating (Low to High)</option>
                <option value="release_date.desc">Latest First</option>
                <option value="release_date.asc">Oldest First</option>
              </select>
            </div>
          </div>

          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="movies-section">
        <h2>{getViewModeTitle()}</h2>
        
        {isLoading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <>
            <div className="movies-grid movie-page-grid">
              {movies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => handleMovieClick(movie)}
                  onPlayTrailer={() => handleTrailerRequest(movie.id)}
                />
              ))}
            </div>
            
            {movies.length === 0 && (
              <div className="no-results">No movies found with the selected filters</div>
            )}
            
            {/* Pagination */}
            {movies.length > 0 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange("prev")} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => handlePageChange("next")} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default MoviePage;