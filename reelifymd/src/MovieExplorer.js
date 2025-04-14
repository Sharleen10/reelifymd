import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetail";
import Footer from "./components/Footer";
import MoviePage from "./components/MoviePage";
import "./styles.css";

function MovieExplorer() {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("trending");
  const [timeWindow, setTimeWindow] = useState("day");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [filterYear, setFilterYear] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  // Define the handleNavigation function before using it
  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === "movies") {
      setViewMode("trending");
      setTimeWindow("day");
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchTrending();
    generateYears();
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [viewMode, currentPage, timeWindow, searchTerm, selectedMovie, filterYear, filterCountry, sortBy]);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let i = currentYear; i >= 1900; i--) {
      yearsList.push(i);
    }
    setYears(yearsList);
  };

  const fetchCountries = async () => {
    // In a real app, you would fetch this from an API
    // For now, using a static list of major film countries
    const countriesList = [
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
      { code: "FR", name: "France" },
      { code: "JP", name: "Japan" },
      { code: "KR", name: "South Korea" },
      { code: "IN", name: "India" },
      { code: "IT", name: "Italy" },
      { code: "DE", name: "Germany" },
      { code: "ES", name: "Spain" },
      { code: "CN", name: "China" }
    ];
    setCountries(countriesList);
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/genres");
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Genres data is not an array:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching genres:", error);
      setCategories([]);
    }
  };

  const fetchTrending = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/trending/day`);
      const data = await response.json();
      setTrending(data.results?.slice(0, 6) || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setIsLoading(false);
      setTrending([]);
    }
  };

  const fetchMovies = async () => {
    let url;
    setIsLoading(true);
    
    // Base URL based on view mode
    switch (viewMode) {
      case "trending":
        url = `http://localhost:5000/api/trending/${timeWindow}`;
        break;
      case "nowPlaying":
        url = `http://localhost:5000/api/now_playing?page=${currentPage}`;
        break;
      case "popular":
        url = `http://localhost:5000/api/movies?page=${currentPage}`;
        break;
      case "topRated":
        url = `http://localhost:5000/api/top_rated?page=${currentPage}`;
        break;
      case "upcoming":
        url = `http://localhost:5000/api/upcoming?page=${currentPage}`;
        break;
      case "genre":
        url = `http://localhost:5000/api/movies/genre/${selectedMovie}?page=${currentPage}`;
        break;
      case "search":
        if (searchTerm.trim()) {
          url = `http://localhost:5000/api/search?q=${searchTerm}`;
        } else {
          setIsLoading(false);
          return;
        }
        break;
      default:
        url = `http://localhost:5000/api/movies?page=${currentPage}`;
    }

    // Add filter parameters if available
    let params = new URLSearchParams();
    
    if (filterYear) {
      params.append('year', filterYear);
    }
    
    if (filterCountry) {
      params.append('region', filterCountry);
    }
    
    if (sortBy) {
      params.append('sort_by', sortBy);
    }
    
    // Append parameters to URL if any exist
    if (params.toString()) {
      url += (url.includes('?') ? '&' : '?') + params.toString();
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${viewMode} movies:`, error);
      setIsLoading(false);
      setMovies([]);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowDetail(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setViewMode("search");
      setCurrentPage(1);
      fetchMovies();
    }
  };

  const handleTrailerRequest = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}/trailer`);
      const data = await response.json();
      if (data.key) {
        setTrailerKey(data.key);
        return data.key;
      } else {
        alert("No trailer available for this movie");
        return null;
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      return null;
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedMovie(null);
    setTrailerKey(null);
  };

  const changeCategory = (categoryId) => {
    setSelectedMovie(categoryId);
    setViewMode("genre");
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const getViewModeTitle = () => {
    switch (viewMode) {
      case "trending": return `Trending ${timeWindow === "day" ? "Today" : "This Week"}`;
      case "nowPlaying": return "Now Playing";
      case "popular": return "Popular Movies";
      case "topRated": return "Top Rated";
      case "upcoming": return "Coming Soon";
      case "genre": 
        const categoryName = categories.find(cat => cat.id === parseInt(selectedMovie))?.name;
        return categoryName ? `${categoryName} Movies` : "Category";
      case "search": return `Search Results: "${searchTerm}"`;
      default: return "Movies";
    }
  };

  const resetFilters = () => {
    setFilterYear("");
    setFilterCountry("");
    setSortBy("popularity.desc");
  };

  return (
    <div className="movie-explorer">
      <Navbar 
        onSearch={handleSearch} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onNavigation={handleNavigation}
        currentView={currentView}
      />
      
      <main>
        {currentView === "home" && (
          <>
            {/* Trending Movies Section */}
            {viewMode === "trending" && (
              <section className="trending-preview">
                <h2>Featured & Trending</h2>
                <div className="trending-content">
                  {trending.length > 0 && trending[0] && (
                    <div className="featured-movie" onClick={() => handleMovieClick(trending[0])}>
                      <div className="featured-image" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w780${trending[0].backdrop_path})` }}>
                        <div className="featured-info">
                          <h3>{trending[0].title}</h3>
                          <p>{trending[0].overview?.substring(0, 150)}...</p>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleTrailerRequest(trending[0].id);
                          }}>Watch Trailer</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Filter Options */}
            <section className="filters">
              <div className="view-modes">
                <button 
                  className={viewMode === "trending" ? "active" : ""} 
                  onClick={() => { setViewMode("trending"); setCurrentPage(1); }}
                >
                  Trending
                </button>
                <button 
                  className={viewMode === "popular" ? "active" : ""} 
                  onClick={() => { setViewMode("popular"); setCurrentPage(1); }}
                >
                  Popular
                </button>
                <button 
                  className={viewMode === "nowPlaying" ? "active" : ""} 
                  onClick={() => { setViewMode("nowPlaying"); setCurrentPage(1); }}
                >
                  Now Playing
                </button>
                <button 
                  className={viewMode === "topRated" ? "active" : ""} 
                  onClick={() => { setViewMode("topRated"); setCurrentPage(1); }}
                >
                  Top Rated
                </button>
                <button 
                  className={viewMode === "upcoming" ? "active" : ""} 
                  onClick={() => { setViewMode("upcoming"); setCurrentPage(1); }}
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

              <div className="categories-filter">
                <select onChange={(e) => changeCategory(e.target.value)}>
                  <option value="">Filter by Genre</option>
                  {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Movies Grid */}
            <section className="movies-section">
              <h2>{getViewModeTitle()}</h2>
              
              {isLoading ? (
                <div className="loading">Loading movies...</div>
              ) : (
                <>
                  <div className="movies-grid">
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
                    <div className="no-results">No movies found</div>
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
          </>
        )}

        {currentView === "movies" && (
          <MoviePage 
            viewMode={viewMode}
            setViewMode={setViewMode}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
            categories={categories}
            changeCategory={changeCategory}
            movies={movies}
            handleMovieClick={handleMovieClick}
            handleTrailerRequest={handleTrailerRequest}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            getViewModeTitle={getViewModeTitle}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            filterCountry={filterCountry}
            setFilterCountry={setFilterCountry}
            sortBy={sortBy}
            setSortBy={setSortBy}
            countries={countries}
            years={years}
            resetFilters={resetFilters}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Movie Detail Modal */}
      {showDetail && selectedMovie && (
        <MovieDetail 
          movie={selectedMovie} 
          trailerKey={trailerKey}
          onClose={closeDetail}
          onPlayTrailer={() => handleTrailerRequest(selectedMovie.id)}
        />
      )}
    </div>
  );
}

export default MovieExplorer;