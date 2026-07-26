import React, { useState } from "react";
import "./ChampionPool.css";

function SavedPoolsList({ savedPools = [], onDeletePool, onStartEditPool }) {
  const [selectedPoolForView, setSelectedPoolForView] = useState(null);

  const handleTriggerEdit = (pool) => {
    if (onStartEditPool) {
      onStartEditPool(pool); 
    }
    setSelectedPoolForView(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedPoolForView) {
    const pool = selectedPoolForView;
    const tiers = ["S", "A", "B", "C"];

    return (
      <div className="cp-esports-container">
        <div className="cp-esports-header">
          <div className="cp-esports-title-group">
            <h2>DETALLE DE CHAMPION POOL</h2>
            <span className="cp-esports-subtitle">JUGADOR: {pool.playerName} ({pool.role})</span>
          </div>
          <div className="cp-esports-config-mini" style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => setSelectedPoolForView(null)} 
              className="cp-clear-all-btn"
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              ⬅ Volver al Roster
            </button>
            <button 
              onClick={() => handleTriggerEdit(pool)} 
              className="cp-save-master-btn"
              style={{ margin: 0, padding: "8px 16px", cursor: "pointer" }}
            >
              ✏️ Modificar / Editar Pool
            </button>
          </div>
        </div>

        <div className="cp-esports-workspace" style={{ display: "block" }}>
          <div className="cp-esports-pane" style={{ width: "100%" }}>
            <div className="cp-pane-header">
              <h3>TIER LIST TÁCTICA GUARDADA</h3>
              <span className="cp-badge-count">Guardado / Modificado: {pool.date}</span>
            </div>

            <div className="cp-tiers-wrapper-esports">
              {tiers.map((tier) => {
                const champsInTier = pool.champions.filter((c) => c.level === tier);
                if (champsInTier.length === 0) return null;

                return (
                  <div key={tier} className={`cp-tier-row-esports cp-tier-${tier}`}>
                    <div className="cp-tier-badge-col">
                      <span className="tier-letter">TIER {tier}</span>
                      <span className="tier-count">({champsInTier.length})</span>
                    </div>
                    <div className="cp-tier-content-col" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {champsInTier.map((c) => (
                        <div 
                          key={c.uniqueId || c.id} 
                          className="cp-minimal-icon-chip"
                          style={{ width: "55px", height: "55px" }}
                          title={c.name}
                        >
                          <img src={c.squareUrl} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-saved-section-modern">
      <div className="cp-saved-section-header">
        <div className="cp-saved-title-box">
          <h3>ROSTER & POOLS GUARDADAS</h3>
          <span className="cp-saved-subtitle">REGISTRO TÁCTICO DE JUGADORES</span>
        </div>
        <span className="cp-saved-total-badge">{savedPools.length} Pools Registradas</span>
      </div>

      {savedPools.length === 0 ? (
        <div className="cp-saved-empty-state">
          <span className="empty-icon">📂</span>
          <p>No hay champion pools guardadas todavía. Configura una arriba y guárdala.</p>
        </div>
      ) : (
        <div className="cp-saved-grid-container">
          {savedPools.map((pool) => (
            <div key={pool.id} className="cp-saved-card-modern">
              <div className="cp-saved-card-top">
                <div className="cp-saved-player-info">
                  <span className="cp-saved-player-name">{pool.playerName}</span>
                  <span className="cp-saved-role-badge">{pool.role}</span>
                </div>
                <div className="cp-saved-card-actions">
                  <span className="cp-saved-date">{pool.date}</span>
                  <button 
                    onClick={() => setSelectedPoolForView(pool)} 
                    className="cp-clear-tier-btn"
                    style={{ background: "#2563eb", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", marginRight: "6px" }}
                    title="Ver en detalle"
                  >
                    🔍 Ver
                  </button>
                  {onDeletePool && (
                    <button 
                      onClick={() => onDeletePool(pool.id)} 
                      className="cp-delete-pool-btn"
                      title="Eliminar pool"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div 
                className="cp-saved-tiers-preview" 
                onClick={() => setSelectedPoolForView(pool)}
                style={{ cursor: "pointer" }}
                title="Haz clic para ver en detalle"
              >
                {["S", "A", "B", "C"].map((tierLetter) => {
                  const champsInThisTier = pool.champions.filter(c => c.level === tierLetter);
                  if (champsInThisTier.length === 0) return null;

                  return (
                    <div key={tierLetter} className={`cp-saved-tier-row tier-${tierLetter}`}>
                      <span className="cp-saved-tier-tag">T{tierLetter}</span>
                      <div className="cp-saved-tier-champs">
                        {champsInThisTier.map(c => (
                          <div key={c.uniqueId || c.id} className="cp-saved-champ-mini" title={`${c.name} (Tier ${tierLetter})`}>
                            <img src={c.squareUrl} alt={c.name} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPoolsList;