import React from "react";
import "./WelcomeScreen.css";

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="welcome-screen-container">
      <div className="welcome-glow-effect"></div>
      
      <div className="welcome-content-box">
        <div className="welcome-brand-tag">v1.0 ESPORTS</div>
        
        <div className="lol-logo-container">
          <span className="lol-logo-text">NEOCOACH</span>
          <div className="lol-logo-underline"></div>
        </div>
        
        <p className="welcome-subtitle">
          Plataforma avanzada de análisis táctico, gestión de draft y optimización de jugadas para equipos competitivos de League of Legends.
        </p>

        <div className="welcome-features-grid">
          {/* Herramienta 1: Mapa Táctico */}
          <div className="welcome-feature-item">
            <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            <span>Mapa Táctico Interactivo</span>
          </div>

          {/* Herramienta 2: Sala de Draft */}
          <div className="welcome-feature-item">
            <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="13" y2="17"></line>
            </svg>
            <span>Sala de Draft y Estrategia</span>
          </div>

          {/* Herramienta 3: Champion Pool */}
          <div className="welcome-feature-item">
            <svg className="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
            </svg>
            <span>Gestión de Champion Pool</span>
          </div>
        </div>

        <button className="welcome-start-btn" onClick={onStart}>
          <span className="btn-glitch-text">INICIAR SESIÓN DE COACHING</span>
          <div className="btn-border-glow"></div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;