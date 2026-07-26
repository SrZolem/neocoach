import React, { useEffect, useState } from "react";
import "./SettingsModal.css";

export default function SettingsModal({ isOpen, onClose, volumes, setVolumes }) {
  const [isTauriDesktop, setIsTauriDesktop] = useState(false);

  useEffect(() => {
    // Detecta si se está ejecutando dentro de la app de escritorio de Tauri
    if (window.__TAURI_INTERNALS__ || window.isTauri) {
      setIsTauriDesktop(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleChange = (type, val) => {
    setVolumes((prev) => ({ ...prev, [type]: Number(val) }));
  };

  const handleUninstallRequest = () => {
    if (confirm("¿Estás seguro de que deseas desinstalar la aplicación?")) {
      alert("Para desinstalar la aplicación por completo, dirígete a 'Agregar o quitar programas' en la configuración de Windows.");
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h3>⚙️ CONFIGURACIÓN</h3>
        
        <div className="setting-item">
          <label>Volumen Maestro: {volumes.master}%</label>
          <input 
            type="range" min="0" max="100" 
            value={volumes.master} 
            onChange={(e) => handleChange("master", e.target.value)} 
          />
        </div>

        <div className="setting-item">
          <label>Música Ambiental: {volumes.music}%</label>
          <input 
            type="range" min="0" max="100" 
            value={volumes.music} 
            onChange={(e) => handleChange("music", e.target.value)} 
          />
        </div>

        <div className="setting-item">
          <label>Efectos de Sonido (SFX): {volumes.sfx}%</label>
          <input 
            type="range" min="0" max="100" 
            value={volumes.sfx} 
            onChange={(e) => handleChange("sfx", e.target.value)} 
          />
        </div>

        <div className="settings-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
          {/* El botón de desinstalar SOLO aparece si es la app de escritorio */}
          {isTauriDesktop && (
            <button 
              className="discreet-uninstall-btn" 
              onClick={handleUninstallRequest}
              title="Desinstalar aplicación"
            >
              🗑️ Desinstalar
            </button>
          )}

          <button className="close-settings-btn" onClick={onClose} style={{ marginLeft: "auto" }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}