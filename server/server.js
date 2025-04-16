require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check (Required by Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://reelify-frontend.onrender.com'
  ],
  credentials: true
}));

// ======================
// TMDB API Routes
// ======================

// Trending Content (Movies/TV)
app.get('/api/trending/:timeWindow', async (req, res, next) => {
  try {
    const { timeWindow } = req.params;
    const url = `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

// Movies Routes
app.get('/api/movies', async (req, res, next) => {
  try {
    const { page = 1, year, region, sort_by, with_genres } = req.query;
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    
    if (year) url += `&year=${year}`;
    if (region) url += `&region=${region}`;
    if (sort_by) url += `&sort_by=${sort_by}`;
    if (with_genres) url += `&with_genres=${with_genres}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/now_playing', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/top_rated', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/upcoming', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/genre/:genreId', async (req, res, next) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/:movieId', async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/:movieId/trailer', async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    const trailers = response.data.results.filter(vid => vid.type === "Trailer");
    res.json(trailers.length > 0 ? trailers[0] : {});
  } catch (err) {
    next(err);
  }
});

// TV Shows Routes
app.get('/api/tv', async (req, res, next) => {
  try {
    const { page = 1, year, region, sort_by } = req.query;
    let url = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    
    if (year) url += `&first_air_date_year=${year}`;
    if (region) url += `&region=${region}`;
    if (sort_by) url += `&sort_by=${sort_by}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/trending/:timeWindow', async (req, res, next) => {
  try {
    const { timeWindow } = req.params;
    const url = `https://api.themoviedb.org/3/trending/tv/${timeWindow}?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/top_rated', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/on_the_air', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/airing_today', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.TMDB_API_KEY}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/genre/:genreId', async (req, res, next) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/:tvId', async (req, res, next) => {
  try {
    const { tvId } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/:tvId/trailer', async (req, res, next) => {
  try {
    const { tvId } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    const trailers = response.data.results.filter(vid => vid.type === "Trailer");
    res.json(trailers.length > 0 ? trailers[0] : {});
  } catch (err) {
    next(err);
  }
});

// Genres Routes
app.get('/api/genres', async (req, res, next) => {
  try {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data.genres);
  } catch (err) {
    next(err);
  }
});

app.get('/api/tv/genres', async (req, res, next) => {
  try {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data.genres);
  } catch (err) {
    next(err);
  }
});

// Search Route
app.get('/api/search', async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });
    
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=${page}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

// Static Files (for React frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error Handling (Must be last middleware)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});