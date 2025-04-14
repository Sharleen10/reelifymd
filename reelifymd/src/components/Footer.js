// Footer.js
import React from "react";
import netflixLogo from "../assests/Netflix logo.png"; 
import disneyLogo from "../assests/disney.png";
import primeVideoLogo from "../assests/Prime video logo.png";
import appleTvLogo from "../assests/apple tv logo.png";

function Footer({ onProviderSelect }) {
  // Streaming service providers with their IDs from TMDB
  const streamingProviders = [
    { id: 8, name: "Netflix", logo: netflixLogo},
    { id: 337, name: "Disney+", logo: disneyLogo },
    { id: 531, name: "Prime Video", logo: primeVideoLogo },
    { id: 2, name: "Apple TV+", logo: appleTvLogo },
  ];

  return (
    <footer className="footer">
      <div className="streaming-services">
        <h3>Available on these platforms</h3>
        <div className="service-logos">
          {streamingProviders.map(provider => (
            <div 
              key={provider.id}
              className="service-logo"
              onClick={() => onProviderSelect(provider.id, provider.name)}
              title={`Show ${provider.name} movies`}
            >
              {provider.name}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} Reelify. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;