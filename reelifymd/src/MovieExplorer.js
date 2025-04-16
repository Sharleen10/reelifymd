//MovieExplorer
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetail";
import Footer from "./components/Footer";
import MoviePage from "./components/MoviePage";
import AnimationPage from "./components/AnimationPage";
import TVShowsPage from "./components/TVShowsPage";
import "./styles.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MovieExplorer() {
  const [movies, setMovies] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTVShow, setSelectedTVShow] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tvCategories, setTvCategories] = useState([]);
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
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [animationGenres, setAnimationGenres] = useState([]);
  const [selectedAnimationGenre, setSelectedAnimationGenre] = useState("");

  // Define the handleNavigation function before using it
  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === "movies") {
      setViewMode("trending");
      setTimeWindow("day");
    } else if (view === "tvshows") {
      setViewMode("tv_trending");
      setTimeWindow("day");
      setCurrentPage(1);
      fetchTVShows();
    } else if (view === "animation") {
      // Reset to initial state for animation view
      setViewMode("animation_trending");
      setTimeWindow("day");
      setCurrentPage(1);
      fetchAnimations();
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchTVGenres();
    fetchTrending();
    generateYears();
    fetchCountries();
    fetchAnimationGenres();
  }, []);

  useEffect(() => {
    if (currentView === "animation") {
      fetchAnimations();
    } else if (currentView === "tvshows") {
      fetchTVShows();
    } else {
      fetchMovies();
    }
  }, [viewMode, currentPage, timeWindow, searchTerm, selectedMovie, selectedTVShow, filterYear, filterCountry, sortBy, selectedProvider, currentView, selectedAnimationGenre]);

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

  const fetchAnimationGenres = async () => {
    try {
  
      // For now, we'll use the same genres endpoint
      const response = await fetch(`${API_BASE_URL}/api/genres`);
      const data = await response.json();
      if (Array.isArray(data)) {
        // Filter only animation-related genres
  
        const animationGenresList = data.filter(genre => 
          ["Animation", "Family", "Fantasy"].includes(genre.name)
        );
        setAnimationGenres(animationGenresList);
      } else {
        console.error("Animation genres data is not an array:", data);
        setAnimationGenres([]);
      }
    } catch (error) {
      console.error("Error fetching animation genres:", error);
      setAnimationGenres([]);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tv/genres`);
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

  const fetchTVGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tv/genres`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTvCategories(data);
      } else {
        console.error("TV Genres data is not an array:", data);
        setTvCategories([]);
      }
    } catch (error) {
      console.error("Error fetching TV genres:", error);
      setTvCategories([]);
    }
  };

  const fetchTrending = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/trending/day`);
      const data = await response.json();
      setTrending(data.results?.slice(0, 6) || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setIsLoading(false);
      setTrending([]);
    }
  };

  const fetchAnimations = async () => {
    let url;
    setIsLoading(true);
    
    // Base URL based on animation view mode
    switch (viewMode) {
      case "animation_trending":
        url = `${API_BASE_URL}/api/trending/${timeWindow}?with_genres=16`; // 16 is the genre ID for Animation
        break;
      case "animation_popular":
        url = `${API_BASE_URL}/api/movies?with_genres=16&page=${currentPage}`;
        break;
      case "animation_topRated":
        url = `${API_BASE_URL}/api/top_rated?with_genres=16&page=${currentPage}`;
        break;
      case "animation_upcoming":
        url = `${API_BASE_URL}/api/upcoming?with_genres=16&page=${currentPage}`;
        break;
      case "animation_genre":
        url = `${API_BASE_URL}/api/movies/genre/${selectedAnimationGenre}?page=${currentPage}`;
        break;
      case "animation_search":
        if (searchTerm.trim()) {
          url = `${API_BASE_URL}/api/search?q=${searchTerm}&with_genres=16`;
        } else {
          setIsLoading(false);
          return;
        }
        break;
      default:
        url = `${API_BASE_URL}/api/movies?with_genres=16&page=${currentPage}`;
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
      setAnimations(data.results || []);
      setTotalPages(data.total_pages || 1);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${viewMode} animations:`, error);
      setIsLoading(false);
      setAnimations([]);
    }
  };

  const fetchTVShows = async () => {
    let url;
    setIsLoading(true);
    
    // Base URL based on view mode for TV shows
    switch (viewMode) {
      case "tv_trending":
        url = `${API_BASE_URL}/api/tv/trending/${timeWindow}`;
        break;
      case "tv_popular":
        url = `${API_BASE_URL}/api/tv/popular?page=${currentPage}`;
        break;
      case "tv_topRated":
        url = `${API_BASE_URL}/api/tv/top_rated?page=${currentPage}`;
        break;
      case "tv_onAir":
        url = `${API_BASE_URL}/api/tv/on_the_air?page=${currentPage}`;
        break;
      case "tv_airing":
        url = `${API_BASE_URL}/api/tv/airing_today?page=${currentPage}`;
        break;
      case "tv_genre":
        url = `${API_BASE_URL}/api/tv/genre/${selectedTVShow}?page=${currentPage}`;
        break;
      case "tv_provider":
        url = `${API_BASE_URL}/api/tv/provider/${selectedProvider.id}?page=${currentPage}`;
        break;
      case "tv_search":
        if (searchTerm.trim()) {
          url = `${API_BASE_URL}/api/tv/search?q=${searchTerm}`;
        } else {
          setIsLoading(false);
          return;
        }
        break;
      default:
        url = `${API_BASE_URL}/api/tv/popular?page=${currentPage}`;
    }
  
    // Add filter parameters if available
    let params = new URLSearchParams();
    
    if (filterYear) {
      params.append('first_air_date_year', filterYear);
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
      setTvShows(data.results || []); // Ensure we set an empty array if results is undefined
      setTotalPages(data.total_pages || 1);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${viewMode} TV shows:`, error);
      setIsLoading(false);
      setTvShows([]); // Set empty array on error
    }
  };

  const fetchMovies = async () => {
    let url;
    setIsLoading(true);
    
    // Base URL based on view mode
    switch (viewMode) {
      case "trending":
        url = `${API_BASE_URL}/api/trending/${timeWindow}`;
        break;
      case "nowPlaying":
        url = `${API_BASE_URL}/api/now_playing?page=${currentPage}`;
        break;
      case "popular":
        url = `${API_BASE_URL}/api/movies?page=${currentPage}`;
        break;
      case "topRated":
        url = `${API_BASE_URL}/api/top_rated?page=${currentPage}`;
        break;
      case "upcoming":
        url = `${API_BASE_URL}/api/upcoming?page=${currentPage}`;
        break;
      case "genre":
        url = `${API_BASE_URL}/api/movies/genre/${selectedMovie}?page=${currentPage}`;
        break;
      case "provider":
        url = `${API_BASE_URL}/api/movies/provider/${selectedProvider.id}?page=${currentPage}`;
        break;
      case "search":
        if (searchTerm.trim()) {
          url = `${API_BASE_URL}/api/search?q=${searchTerm}`;
        } else {
          setIsLoading(false);
          return;
        }
        break;
      default:
        url = `${API_BASE_URL}/api/movies?page=${currentPage}`;
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

  const handleTVShowClick = (tvShow) => {
    setSelectedMovie(tvShow);
    setShowDetail(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (currentView === "animation") {
        setViewMode("animation_search");
      } else if (currentView === "tvshows") {
        setViewMode("tv_search");
      } else {
        setViewMode("search");
      }
      setCurrentPage(1);
    }
  };

  const handleTrailerRequest = async (movieId) => {
    try {
      let endpoint;
      if (currentView === "tvshows") {
        endpoint = `${API_BASE_URL}/api/tv/${movieId}/trailer`;
      } else {
        endpoint = `${API_BASE_URL}/api/movies/${movieId}/trailer`;
      }
      
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.key) {
        setTrailerKey(data.key);
        return data.key;
      } else {
        alert("No trailer available");
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
    setSelectedTVShow(null);
    setTrailerKey(null);
  };

  const changeCategory = (categoryId) => {
    setSelectedMovie(categoryId);
    setViewMode("genre");
    setCurrentPage(1);
  };

  const changeTVCategory = (categoryId) => {
    setSelectedTVShow(categoryId);
    setViewMode("tv_genre");
    setCurrentPage(1);
  };

  const changeAnimationGenre = (genreId) => {
    setSelectedAnimationGenre(genreId);
    setViewMode("animation_genre");
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleProviderSelect = (providerId, providerName) => {
    setSelectedProvider({ id: providerId, name: providerName });
    
    if (currentView === "tvshows") {
      setViewMode("tv_provider");
    } else {
      setViewMode("provider");
      // Switch to movies view to show provider movies
      setCurrentView("movies");
    }
    
    setCurrentPage(1);
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
      case "provider":
        return selectedProvider ? `${selectedProvider.name} Movies` : "Streaming Movies";
      case "search": return `Search Results: "${searchTerm}"`;
      
      // TV shows view mode titles
      case "tv_trending": return `Trending TV Shows ${timeWindow === "day" ? "Today" : "This Week"}`;
      case "tv_popular": return "Popular TV Shows";
      case "tv_topRated": return "Top Rated TV Shows";
      case "tv_onAir": return "Currently On Air";
      case "tv_airing": return "Airing Today";
      case "tv_genre": 
        const tvCategoryName = tvCategories.find(cat => cat.id === parseInt(selectedTVShow))?.name;
        return tvCategoryName ? `${tvCategoryName} TV Shows` : "TV Category";
      case "tv_provider":
        return selectedProvider ? `${selectedProvider.name} TV Shows` : "Streaming TV Shows";
      case "tv_search": return `TV Search Results: "${searchTerm}"`;
      
      // Animation view mode titles
      case "animation_trending": return `Trending Animation ${timeWindow === "day" ? "Today" : "This Week"}`;
      case "animation_popular": return "Popular Animations";
      case "animation_topRated": return "Top Rated Animations";
      case "animation_upcoming": return "Upcoming Animations";
      case "animation_genre": 
        const animGenreName = animationGenres.find(genre => genre.id === parseInt(selectedAnimationGenre))?.name;
        return animGenreName ? `${animGenreName} Animations` : "Animation Category";
      case "animation_search": return `Animation Search Results: "${searchTerm}"`;
      default: return "Movies";
    }
  };

  const resetFilters = () => {
    setFilterYear("");
    setFilterCountry("");
    setSortBy("popularity.desc");
    setSelectedProvider(null);
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
            selectedProvider={selectedProvider}
          />
        )}

{currentView === "tvshows" && (
  <TVShowsPage 
    viewMode={viewMode}
    setViewMode={setViewMode}
    timeWindow={timeWindow}
    setTimeWindow={setTimeWindow}
    categories={tvCategories}
    changeCategory={changeTVCategory}
    shows={tvShows} // Make sure this is properly set
    handleShowClick={handleTVShowClick}
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
    selectedProvider={selectedProvider}
  />
)}

        {currentView === "animation" && (
          <AnimationPage 
            viewMode={viewMode}
            setViewMode={setViewMode}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
            animationGenres={animationGenres}
            changeAnimationGenre={changeAnimationGenre}
            movies={animations}
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
      <Footer onProviderSelect={handleProviderSelect} />

      {/* Movie Detail Modal */}
      {showDetail && selectedMovie && (
        <MovieDetail 
          movie={selectedMovie} 
          trailerKey={trailerKey}
          onClose={closeDetail}
          onPlayTrailer={() => handleTrailerRequest(selectedMovie.id)}
          isTV={currentView === "tvshows"}
        />
      )}
    </div>
  );
}

export default MovieExplorer;