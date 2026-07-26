import React from "react";
import "./HomeDashboard.css";

const HomeDashboard = ({ onOpenTour }) => {
  return (
    <div className="home-dashboard">
      <div className="home-header">
        <h1>PANEL DE CONTROL — NEOCOACH <span className="version-tag">v1.0 ESPORTS</span></h1>
        <p>Bienvenido al centro de operaciones tácticas para equipos competitivos de League of Legends.</p>
      </div>

      <div className="home-grid">
        {/* Sección de Novedades y Actualizaciones */}
        <div className="home-card updates-card">
          <h2>📢 Novedades y Actualizaciones (Patch Notes)</h2>
          <div className="update-item">
            <span className="update-date">23 JUL 2026</span>
            <h4>Lanzamiento Oficial V1.0</h4>
            <p>Implementación de la interfaz principal con estética oficial de e-sports, soporte para selección de campeones y mejoras en el renderizado de placas doradas.</p>
          </div>
          <div className="update-item">
            <span className="update-date">Próximamente</span>
            <h4>Sincronización en Vivo</h4>
            <p>Capacidad de conectar partidas personalizadas en tiempo real para reflejar posiciones de visión y objetivos automáticamente.</p>
          </div>
        </div>

        {/* Sección de Guía de Herramientas (Ahora Clicables de nuevo) */}
        <div className="home-card guide-card">
          <h2>🛠️ Guía Rápida de Herramientas</h2>
          
          <div className="guide-item clickable" onClick={() => onOpenTour("map")}>
            <div className="guide-icon">🗺️</div>
            <div>
              <h3>Mapa Táctico Interactivo</h3>
              <p>Diseña estrategias de rotaciones, posicionamiento de wards y control de objetivos sobre la Grieta del Invocador con herramientas de dibujo libre.</p>
            </div>
          </div>

          <div className="guide-item clickable" onClick={() => onOpenTour("draft")}>
            <div className="guide-icon">⚔️</div>
            <div>
              <h3>Sala de Draft y Estrategia</h3>
              <p>Simula fases de B&P (Bans y Picks) competitivas para entrenar contra composiciones enemigas y coordinar sinergias de equipo.</p>
            </div>
          </div>

          <div className="guide-item clickable" onClick={() => onOpenTour("pool")}>
            <div className="guide-icon">🏆</div>
            <div>
              <h3>Gestión de Champion Pool</h3>
              <p>Organiza los campeones prioritarios de cada miembro del roster, clasificándolos por nivel de maestría y comfort picks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;