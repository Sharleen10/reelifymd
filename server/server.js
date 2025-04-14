// server.js - Express backend
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Verify API key existence
if (!process.env.TMDB_API_KEY) {
  console.error("ERROR: TMDB_API_KEY is not defined in .env file");
}

// Middleware to log API requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Helper function to build URL with filters
const buildTMDBUrl = (baseUrl, req) => {
  const { page = 1, year, region, sort_by, with_genres } = req.query;
  let url = `${baseUrl}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
  
  if (year) {
    url += `&primary_release_year=${year}`;
  }
  
  if (region) {
    url += `&region=${region}`;
  }
  
  if (sort_by) {
    url += `&sort_by=${sort_by}`;
  }
  
  if (with_genres) {
    url += `&with_genres=${with_genres}`;
  }
  
  return url;
};

// Route: Popular movies (with pagination and filters)
app.get("/api/movies", async (req, res) => {
  try {
    const url = buildTMDBUrl("https://api.themoviedb.org/3/movie/popular", req);
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching popular movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching popular movies", error: err.message });
  }
});

// Route: Now playing movies (with pagination and filters)
app.get("/api/now_playing", async (req, res) => {
  try {
    const url = buildTMDBUrl("https://api.themoviedb.org/3/movie/now_playing", req);
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching now playing:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching now playing", error: err.message });
  }
});

// Route: Search for movies
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  const { page = 1, year, region, with_genres } = req.query;
  
  try {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}`;
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    if (region) {
      url += `&region=${region}`;
    }
    
    if (with_genres) {
      url += `&with_genres=${with_genres}`;
    }
    
    console.log(`Searching from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error searching for movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error searching for movies", error: err.message });
  }
});

// Route: Genres list
app.get("/api/genres", async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`;
    console.log(`Fetching genres from: ${url}`);
    const response = await axios.get(url);
    
    // Make sure we're sending just the genres array
    if (response.data && response.data.genres && Array.isArray(response.data.genres)) {
      res.json(response.data.genres);
    } else {
      console.error("Unexpected genres response format:", response.data);
      res.status(500).json({ message: "Unexpected genres data format" });
    }
  } catch (err) {
    console.error("Error fetching genres:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching genres", error: err.message });
  }
});

// Route: Movies by genre (with pagination and filters)
app.get("/api/movies/genre/:genreId", async (req, res) => {
  const { genreId } = req.params;
  const { page = 1, year, region, sort_by } = req.query;
  
  try {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`;
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    if (region) {
      url += `&region=${region}`;
    }
    
    if (sort_by) {
      url += `&sort_by=${sort_by}`;
    }
    
    console.log(`Fetching movies by genre from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching movies by genre:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching movies by genre", error: err.message });
  }
});

// Route: Get movie trailer
app.get("/api/movies/:movieId/trailer", async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}`
    );
    const trailers = response.data.results.filter((vid) => vid.type === "Trailer" && vid.site === "YouTube");
    if (trailers.length > 0) {
      res.json({ key: trailers[0].key });
    } else {
      res.status(404).json({ message: "No trailer found" });
    }
  } catch (err) {
    console.error("Error fetching trailer:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching trailer", error: err.message });
  }
});

// Route: Top rated movies (with pagination and filters)
app.get("/api/top_rated", async (req, res) => {
  try {
    const url = buildTMDBUrl("https://api.themoviedb.org/3/movie/top_rated", req);
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching top rated movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching top rated movies", error: err.message });
  }
});

// Route: Upcoming movies (with pagination and filters)
app.get("/api/upcoming", async (req, res) => {
  try {
    const url = buildTMDBUrl("https://api.themoviedb.org/3/movie/upcoming", req);
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching upcoming movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching upcoming movies", error: err.message });
  }
});

// Route: Trending movies (day or week) with filters
app.get("/api/trending/:timeWindow", async (req, res) => {
  const { timeWindow } = req.params; // 'day' or 'week'
  const validTimeWindows = ['day', 'week'];
  
  if (!validTimeWindows.includes(timeWindow)) {
    return res.status(400).json({ message: "Time window must be 'day' or 'week'" });
  }
  
  const { page = 1, with_genres } = req.query;
  
  try {
    // Note: TMDB trending endpoint doesn't support most filters directly,
    // but we can use the discover endpoint with additional parameters 
    // to get similar functionality
    let url;
    
    if (with_genres) {
      // For filtered trending with genre, use discover with trending sorting
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${page}&with_genres=${with_genres}&sort_by=popularity.desc&time_window=${timeWindow}`;
    } else {
      // Standard trending endpoint
      url = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    }
    
    console.log(`Fetching trending from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching trending movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching trending movies", error: err.message });
  }
});

// Route: Recommended movies based on a movie
app.get("/api/movies/:movieId/recommendations", async (req, res) => {
  const { movieId } = req.params;
  const { page = 1 } = req.query;
  
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    console.log(`Fetching recommendations from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching recommended movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching recommended movies", error: err.message });
  }
});

// Route: Get movie details
app.get("/api/movies/:movieId", async (req, res) => {
  const { movieId } = req.params;
  
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,similar`;
    console.log(`Fetching movie details from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching movie details:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching movie details", error: err.message });
  }
});

// Route: Movies by streaming provider
app.get("/api/movies/provider/:providerId", async (req, res) => {
  const { providerId } = req.params;
  const { page = 1, year, region = "US", sort_by, with_genres } = req.query;
  
  try {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_watch_providers=${providerId}&watch_region=${region}&page=${page}`;
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    if (sort_by) {
      url += `&sort_by=${sort_by}`;
    }
    
    if (with_genres) {
      url += `&with_genres=${with_genres}`;
    }
    
    console.log(`Fetching movies by provider from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching movies by provider:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching movies by provider", error: err.message });
  }
});

// Route: Get available countries for filtering
app.get("/api/countries", async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.TMDB_API_KEY}`;
    console.log(`Fetching countries from: ${url}`);
    const response = await axios.get(url);
    
    // Return all countries from the TMDB API
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching countries:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching countries", error: err.message });
  }
});

// Route: Get available streaming providers
app.get("/api/providers", async (req, res) => {
  const { region = "US" } = req.query;
  
  try {
    const url = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${process.env.TMDB_API_KEY}&watch_region=${region}`;
    console.log(`Fetching providers from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data.results || []);
  } catch (err) {
    console.error("Error fetching providers:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching providers", error: err.message });
  }
});

// New route specifically for animation content
app.get("/api/animation", async (req, res) => {
  // Animation genre ID is 16 in TMDB
  req.query.with_genres = "16";
  
  try {
    const url = buildTMDBUrl("https://api.themoviedb.org/3/discover/movie", req);
    console.log(`Fetching animation movies from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching animation movies:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching animation movies", error: err.message });
  }
});

// New route for animation trending content
app.get("/api/animation/trending/:timeWindow", async (req, res) => {
  const { timeWindow } = req.params;
  const validTimeWindows = ['day', 'week'];
  
  if (!validTimeWindows.includes(timeWindow)) {
    return res.status(400).json({ message: "Time window must be 'day' or 'week'" });
  }
  
  // Add animation genre filter (16 is the animation genre ID)
  req.query.with_genres = "16";
  
  try {
    // For animation trending, we'll use discover with trending sorting and animation genre filter
    const { page = 1, year, region, sort_by = "popularity.desc" } = req.query;
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=16&page=${page}&sort_by=${sort_by}`;
    
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    if (region) {
      url += `&region=${region}`;
    }
    
    console.log(`Fetching animation trending from: ${url}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching animation trending:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ message: "Error fetching animation trending", error: err.message });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API key defined: ${process.env.TMDB_API_KEY ? 'Yes' : 'No'}`);
});