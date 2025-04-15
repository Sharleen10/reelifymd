// TVShowsPage.js
import React from "react";
import MovieCard from "./MovieCard";

function TVShowsPage({
  viewMode, 
  setViewMode, 
  timeWindow, 
  setTimeWindow, 
  categories = [], 
  changeCategory, 
  shows = [], 
  handleShowClick, 
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
  countries = [],
  years = [],
  resetFilters,
  selectedProvider
}) {
  return (
    <div className="tv-shows-page">
      <section className="tv-shows-page-header">
        <h1>TV Shows</h1>
        <p>Discover the best television series from around the world</p>
      </section>

      <section className="tv-shows-filters-container">
        <div className="tv-shows-filters">
          <div className="view-modes tv-view-modes">
            <button 
              className={viewMode === "tv_trending" ? "active" : ""} 
              onClick={() => { setViewMode("tv_trending"); }}
            >
              Trending
            </button>
            <button 
              className={viewMode === "tv_popular" ? "active" : ""} 
              onClick={() => { setViewMode("tv_popular"); }}
            >
              Popular
            </button>
            <button 
              className={viewMode === "tv_airing" ? "active" : ""} 
              onClick={() => { setViewMode("tv_airing"); }}
            >
              On Air
            </button>
            <button 
              className={viewMode === "tv_topRated" ? "active" : ""} 
              onClick={() => { setViewMode("tv_topRated"); }}
            >
              Top Rated
            </button>
          </div>

          {viewMode === "tv_trending" && (
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
                value={viewMode === "tv_genre" ? categories.find(cat => cat.id === parseInt(shows[0]?.genre_ids?.[0]))?.id || "" : ""}
              >
                <option value="">All Genres</option>
                {categories.map(category => (
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
                <option value="first_air_date.desc">Latest First</option>
                <option value="first_air_date.asc">Oldest First</option>
              </select>
            </div>
          </div>

          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </section>

      {/* TV Shows Grid */}
      <section className="shows-section">
        <h2>{getViewModeTitle()}</h2>
        
        {isLoading ? (
          <div className="loading">Loading TV shows...</div>
        ) : (
          <>
            <div className="shows-grid tv-shows-grid">
              {shows && shows.length > 0 ? (
                shows.map(show => (
                  <MovieCard 
                    key={show.id} 
                    movie={{
                      ...show,
                      title: show.name || show.title,
                      release_date: show.first_air_date || show.release_date
                    }} 
                    onClick={() => handleShowClick(show)}
                    onPlayTrailer={() => handleTrailerRequest(show.id)}
                  />
                ))
              ) : (
                <div className="no-results">No TV shows found</div>
              )}
            </div>
            
            {/* Pagination */}
            {shows && shows.length > 0 && (
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

export default TVShowsPage;