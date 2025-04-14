import React from "react";
import MovieCard from "./MovieCard";

function AnimationPage({
  viewMode, 
  setViewMode, 
  timeWindow, 
  setTimeWindow, 
  animationGenres, 
  changeAnimationGenre, 
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
    <div className="animation-page">
      <section className="animation-page-header">
        <h1>Animations</h1>
        <p>Discover the best animated films from around the world</p>
      </section>

      <section className="animation-filters-container">
        <div className="animation-filters">
          <div className="view-modes animation-view-modes">
            <button 
              className={viewMode === "animation_trending" ? "active" : ""} 
              onClick={() => { setViewMode("animation_trending"); }}
            >
              Trending
            </button>
            <button 
              className={viewMode === "animation_popular" ? "active" : ""} 
              onClick={() => { setViewMode("animation_popular"); }}
            >
              Popular
            </button>
            <button 
              className={viewMode === "animation_topRated" ? "active" : ""} 
              onClick={() => { setViewMode("animation_topRated"); }}
            >
              Top Rated
            </button>
            <button 
              className={viewMode === "animation_upcoming" ? "active" : ""} 
              onClick={() => { setViewMode("animation_upcoming"); }}
            >
              Upcoming
            </button>
          </div>

          {viewMode === "animation_trending" && (
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

        <div className="advanced-filters animation-advanced-filters">
          <h3>Filter & Sort</h3>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Animation Genre</label>
              <select 
                onChange={(e) => changeAnimationGenre(e.target.value)} 
                value={viewMode === "animation_genre" ? animationGenres.find(genre => genre.id === parseInt(movies[0]?.genre_ids?.[0]))?.id || "" : ""}
              >
                <option value="">All Animation Types</option>
                {Array.isArray(animationGenres) && animationGenres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
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

      {/* Animations Grid */}
      <section className="movies-section animations-section">
        <h2>{getViewModeTitle()}</h2>
        
        {isLoading ? (
          <div className="loading">Loading animations...</div>
        ) : (
          <>
            <div className="movies-grid animation-grid">
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
              <div className="no-results">No animations found with the selected filters</div>
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

export default AnimationPage;