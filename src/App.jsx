import React, { useState, useEffect } from "react";
import "./App.css";
import HomeDashboard from "./components/HomeDashboard";
import MapBoard from "./components/MapBoard";
import CustomDraftRoom from "./components/CustomDraftRoom";
import ChampionPoolManager from "./components/ChampionPoolManager";
import SavedPoolsList from "./components/SavedPoolsList";
import WelcomeScreen from "./components/WelcomeScreen";
import MapTourModal from "./components/MapTourModal";
import SettingsModal from "./components/SettingsModal";
import { useSoundSystem } from "./hooks/useSoundSystem";

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("inicio");
  
  // Estado para controlar las guías interactivas ('map', 'draft', 'pool' o null)
  const [activeTour, setActiveTour] = useState(null);

  // Estados para Configuración y Audio
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volumes, setVolumes] = useState({
    master: 80,
    music: 50,
    sfx: 70,
  });

  // Inicializamos el sistema de audio global
  useSoundSystem(volumes);

  const [currentDraft, setCurrentDraft] = useState({
    bluePicks: Array(5).fill(null),
    redPicks: Array(5).fill(null),
    blueBans: Array(5).fill(null),
    redBans: Array(5).fill(null)
  });

  const [draftHistory, setDraftHistory] = useState(() => {
    const saved = localStorage.getItem("neocoach_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [savedPools, setSavedPools] = useState(() => {
    const saved = localStorage.getItem("neocoach_champion_pools");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingPool, setEditingPool] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("neocoach_history", JSON.stringify(draftHistory));
  }, [draftHistory]);

  useEffect(() => {
    localStorage.setItem("neocoach_champion_pools", JSON.stringify(savedPools));
  }, [savedPools]);

  const handleSaveDraft = (draftData, mode) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }),
      mode: mode === "tournament" ? "Torneo" : "Libre",
      data: draftData
    };

    setCurrentDraft(draftData);
    setDraftHistory((prev) => [newEntry, ...prev]);
    setActiveTab("map"); // Redirección automática al Mapa Táctico
  };

  const handleDeleteHistoryEntry = (id) => {
    setDraftHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("¿Seguro que querés borrar todo el historial de drafts?")) {
      setDraftHistory([]);
    }
  };

  const handleLoadDraftFromHistory = (entry) => {
    setCurrentDraft(entry.data);
    setShowHistoryModal(false);
    setActiveTab("map");
  };

  const handleSavePool = (poolData) => {
    setSavedPools((prevPools) => {
      const exists = prevPools.find((p) => p.id === poolData.id);
      if (exists) {
        return prevPools.map((p) => (p.id === poolData.id ? poolData : p));
      } else {
        return [poolData, ...prevPools];
      }
    });
    setEditingPool(null);
  };

  const handleDeletePool = (id) => {
    setSavedPools((prev) => prev.filter((pool) => pool.id !== id));
    if (editingPool && editingPool.id === id) {
      setEditingPool(null);
    }
  };

  const handleStartEditPool = (pool) => {
    setEditingPool(pool);
  };

  const handleCancelEdit = () => {
    setEditingPool(null);
  };

  const getHeaderTitle = () => {
    if (activeTab === "inicio") return "PANEL DE CONTROL — NOVEDADES Y GUÍA";
    if (activeTab === "map") return "TABLERO TÁCTICO — GRIETA DEL INVOCADOR";
    if (activeTab === "draft") return "SIMULADOR DE DRAFT (PICKS & BANS)";
    if (activeTab === "pool") return "GESTIÓN Y SECCIÓN GENERAL DE CHAMPION POOLS";
    return "NEOCOACH ESPORTS";
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="layout">
      {/* Menú Lateral Izquierdo */}
      <aside className="sidebar-left" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div className="brand">
            <h2>NEOCOACH</h2>
            <span className="version">v1.0 ESPORTS</span>
          </div>

          <nav className="nav-menu">
            <button
              className={activeTab === "inicio" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActiveTab("inicio")}
            >
              🏠 INICIO
            </button>
            <button
              className={activeTab === "map" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActiveTab("map")}
            >
              🗺️ MAPA TÁCTICO
            </button>
            <button
              className={activeTab === "draft" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActiveTab("draft")}
            >
              ⚔️ SALA DE DRAFT
            </button>
            <button
              className={activeTab === "pool" ? "nav-btn active" : "nav-btn"}
              onClick={() => setActiveTab("pool")}
            >
              🏆 CHAMPION POOL
            </button>

            <button className="nav-btn history-btn" onClick={() => setShowHistoryModal(true)}>
              📜 HISTORIAL ({draftHistory.length})
            </button>
          </nav>
        </div>

        {/* Botón de Configuración abajo en la barra lateral */}
        <div className="sidebar-footer" style={{ padding: "15px" }}>
          <button 
            className="nav-btn"
            onClick={() => setIsSettingsOpen(true)}
            style={{ width: "100%", textAlign: "left", color: "#c8aa6d", borderColor: "#c8aa6d" }}
          >
            ⚙️ CONFIGURACIÓN
          </button>
        </div>
      </aside>

      {/* Área Central con Precarga y Cero Tirones */}
      <main className="main">
        <header className="top-bar">
          <h3>{getHeaderTitle()}</h3>
        </header>

        <div className="content-wrapper" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          
          {/* INICIO */}
          <div 
            style={{ display: activeTab === "inicio" ? "block" : "none", height: "100%" }}
          >
            <HomeDashboard 
              onNavigate={setActiveTab} 
              onOpenTour={(toolType) => {
                setActiveTab(toolType);   
                setActiveTour(toolType);  
              }} 
            />
          </div>

          {/* MAPA TÁCTICO: Se monta únicamente cuando está activo para garantizar dimensiones reales en Tauri */}
          {activeTab === "map" && (
            <div style={{ height: "100%", width: "100%", position: "relative" }}>
              <MapBoard currentDraft={currentDraft} />
            </div>
          )}

          {/* SALA DE DRAFT */}
          <div 
            style={{ display: activeTab === "draft" ? "block" : "none", height: "100%" }}
          >
            <CustomDraftRoom onSaveDraft={handleSaveDraft} />
          </div>

          {/* CHAMPION POOL */}
          <div 
            style={{ display: activeTab === "pool" ? "block" : "none", height: "100%" }}
          >
            <div className="pool-view-wrapper" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "30px", overflowY: "auto", height: "100%" }}>
              <ChampionPoolManager 
                onSavePool={handleSavePool} 
                editingPool={editingPool} 
                onCancelEdit={handleCancelEdit} 
              />
              <hr style={{ borderColor: "rgba(0, 240, 255, 0.2)" }} />
              <SavedPoolsList 
                savedPools={savedPools} 
                onDeletePool={handleDeletePool} 
                onStartEditPool={handleStartEditPool} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE CONFIGURACIÓN */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        volumes={volumes} 
        setVolumes={setVolumes} 
      />

      {/* MODAL DE GUÍA / TOUR INTERACTIVO */}
      {activeTour && (
        <MapTourModal 
          tool={activeTour} 
          onClose={() => setActiveTour(null)} 
        />
      )}

      {/* MODAL DE HISTORIAL */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📜 Historial de Drafts</h2>
              <button className="close-btn" onClick={() => setShowHistoryModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {draftHistory.length === 0 ? (
                <p className="no-history">No hay drafts guardados en el historial.</p>
              ) : (
                <div className="history-list">
                  {draftHistory.map((item) => (
                    <div key={item.id} className="history-card">
                      <div className="history-info">
                        <span className="history-date">📅 {item.date}</span>
                        <span className={`history-badge ${item.mode.toLowerCase()}`}>{item.mode}</span>
                      </div>

                      <div className="history-preview">
                        <div className="mini-team blue">
                          {item.data.bluePicks.map((p, i) => (
                            <span key={i} className="mini-champ">{p ? p.name : "-"}</span>
                          ))}
                        </div>
                        <span className="vs">VS</span>
                        <div className="mini-team red">
                          {item.data.redPicks.map((p, i) => (
                            <span key={i} className="mini-champ">{p ? p.name : "-"}</span>
                          ))}
                        </div>
                      </div>

                      <div className="history-actions">
                        <button className="load-btn" onClick={() => handleLoadDraftFromHistory(item)}>
                          Cargar en Mapa
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteHistoryEntry(item.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {draftHistory.length > 0 && (
              <div className="modal-footer">
                <button className="clear-all-btn" onClick={handleClearAllHistory}>
                  Vaciar Todo el Historial
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;