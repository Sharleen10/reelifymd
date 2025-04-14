import React from "react";
import logo from "../assests/Reelify Logo.png"; // Adjust the path as necessary

function Navbar({ onSearch, searchTerm, setSearchTerm, onNavigation, currentView }) {
  // Handle navigation with fallback
  const handleNavigationClick = (view, e) => {
    e.preventDefault();
    // Check if onNavigation exists
    if (onNavigation) {
      onNavigation(view);
    } else {
      console.warn("Navigation function not available");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div 
          className="logo" 
          onClick={(e) => handleNavigationClick("home", e)}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Reelify" />
          <span>Reelify</span>
        </div>
        
        <div className="nav-search">
          <form onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>
        
        <div className="nav-links">
          <a
            href="#movies"
            className={currentView === "movies" ? "active" : ""}
            onClick={(e) => handleNavigationClick("movies", e) }
          >
            Movies
          </a>
          <a href="#tv">TV Shows</a>
          <a href="#animation">Animation</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
