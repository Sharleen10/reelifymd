// Footer.js
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="streaming-services">
        <h3>Available on these platforms</h3>
        <div className="service-logos">
          <div className="service-logo">Netflix</div>
          <div className="service-logo">Disney+</div>
          <div className="service-logo">HBO Max</div>
          <div className="service-logo">Apple TV+</div>
        </div>
      </div>
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} Real TV. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;