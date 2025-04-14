
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await axios.get("/api/movies?page=1"); // Proxy handles this
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div>
      <h1>Popular Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;