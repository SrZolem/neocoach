import React, { useState } from "react";
import "./DraftSidebars.css";

const getChampionSquareUrl = (champion) => {
  if (!champion) return "";
  if (champion.img && typeof champion.img === "string" && champion.img.startsWith("http")) {
    return champion.img;
  }
  if (champion.image && typeof champion.image === "string" && champion.image.startsWith("http")) {
    return champion.image;
  }
  if (champion.icon && typeof champion.icon === "string" && champion.icon.startsWith("http")) {
    return champion.icon;
  }
  
  const champKey = champion.id || champion.name;
  if (champKey) {
    return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champKey}.png`;
  }
  
  return champion.img || champion.image || champion.icon || "";
};

const getChampionSplashUrl = (champion) => {
  if (!champion) return "";
  if (champion.splash && typeof champion.splash === "string") return champion.splash;
  if (champion.img && typeof champion.img === "string" && champion.img.startsWith("http")) {
    return champion.img;
  }
  if (champion.image && typeof champion.image === "string" && champion.image.startsWith("http")) {
    return champion.image;
  }
  
  const champKey = champion.id || champion.name;
  if (champKey) {
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champKey}_0.jpg`;
  }
  
  return "";
};

const getChampionObjectPosition = (championName) => {
  if (!championName) return "center center";
  const name = championName.toLowerCase().trim();

  switch (name) {
    case "morgana":
      return "78% center";
    case "kayle":
      return "22% center";
    case "lux":
      return "50% 25%";
    case "malphite":
      return "50% 40%";
    case "lucian":
      return "45% 30%";
    case "k'sante":
    case "ksante":
      return "40% 30%";
    default:
      return "center 25%";
  }
};

function DraftSidebars({ draftState, onMouseDownPick }) {
  const { bluePicks, blueBans, redPicks, redBans } = draftState;

  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  return (
    <>
      {/* PANEL FLOTANTE IZQUIERDO - EQUIPO AZUL */}
      <aside 
        className="esports-hud-panel blue-team-panel" 
        aria-label="Equipo Azul"
        style={{
          transform: isLeftOpen ? "translateX(0)" : "translateX(-100%)",
          opacity: isLeftOpen ? 1 : 0.85,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
          position: "relative",
          pointerEvents: "auto"
        }}
      >
        <button
          onClick={() => setIsLeftOpen(!isLeftOpen)}
          style={{
            position: "absolute",
            right: "-26px",
            top: "15px",
            zIndex: 40,
            background: "rgba(4, 7, 13, 0.9)",
            border: "1px solid rgba(0, 240, 255, 0.5)",
            borderLeft: "none",
            color: "#00f0ff",
            width: "26px",
            height: "42px",
            borderRadius: "0 6px 6px 0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            boxShadow: "0 0 12px rgba(0, 240, 255, 0.3)",
            transition: "all 0.2s ease"
          }}
          title={isLeftOpen ? "Ocultar panel azul" : "Mostrar panel azul"}
        >
          {isLeftOpen ? "◀" : "▶"}
        </button>

        <div className="panel-header-wrapper">
          <div className="panel-team-title blue-glow-text">EQUIPO AZUL</div>
        </div>
        
        <div className="hud-category-section">
          <span className="category-title">SELECCIONES TÁCTICAS</span>
          <div className="picks-cards-stack" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {bluePicks.map((pick, idx) => {
              const splashUrl = getChampionSplashUrl(pick);
              const rolePretendido = pick?.role || pick?.position || "ROL";
              const objectPos = getChampionObjectPosition(pick?.name);

              return (
                <div 
                  key={idx} 
                  className={`neon-floating-card blue-neon ${pick ? "is-populated" : "is-empty"}`}
                  style={{
                    height: "72px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 240, 255, 0.4)",
                    cursor: pick ? "grab" : "default",
                    userSelect: "none"
                  }}
                  onMouseDown={(e) => pick && onMouseDownPick(e, pick, "blue")}
                  title={pick ? `Arrastrar a ${pick.name}` : `Slot ${idx + 1}`}
                >
                  {pick ? (
                    <>
                      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                        <img 
                          src={splashUrl} 
                          alt={pick.name} 
                          draggable="false" 
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover", 
                            objectPosition: objectPos,
                            filter: "brightness(0.7)" 
                          }} 
                        />
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(90deg, rgba(4,7,13,0.92) 15%, rgba(4,7,13,0.5) 60%, rgba(4,7,13,0.2) 100%)"
                        }}></div>
                      </div>

                      <div style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "12px", height: "100%", gap: "3px" }}>
                        <span className="pro-champion-name" style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
                          {pick.name}
                        </span>
                        <div className="pro-role-box" style={{ width: "fit-content", padding: "2px 6px", background: "rgba(0, 240, 255, 0.15)", border: "1px solid rgba(0, 240, 255, 0.4)", borderRadius: "3px" }}>
                          <span className="pro-role-text" style={{ fontSize: "10px", color: "#00f0ff", fontWeight: "600" }}>{rolePretendido}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-slot-inner" style={{ display: "flex", alignItems: "center", padding: "0 16px", width: "100%", height: "100%", justifyContent: "space-between" }}>
                      <span className="empty-number-badge" style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>0{idx + 1}</span>
                      <span className="empty-text-label" style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "1px" }}>DISPONIBLE</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="hud-category-section" style={{ marginTop: "12px" }}>
          <span className="category-title">BLOQUEOS (BANS)</span>
          <div className="bans-grid-wrapper">
            {blueBans.map((ban, idx) => {
              const banImgUrl = getChampionSquareUrl(ban);
              return (
                <div key={idx} className="tactical-ban-thumb blue-ban-neon" title={ban?.name || `Ban ${idx + 1}`}>
                  {ban && <img src={banImgUrl} alt={ban.name || "Ban"} draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* PANEL FLOTANTE DERECHO - EQUIPO ROJO */}
      <aside 
        className="esports-hud-panel red-team-panel" 
        aria-label="Equipo Rojo"
        style={{
          transform: isRightOpen ? "translateX(0)" : "translateX(100%)",
          opacity: isRightOpen ? 1 : 0.85,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
          position: "relative",
          pointerEvents: "auto"
        }}
      >
        <button
          onClick={() => setIsRightOpen(!isRightOpen)}
          style={{
            position: "absolute",
            left: "-26px",
            top: "15px",
            zIndex: 40,
            background: "rgba(4, 7, 13, 0.9)",
            border: "1px solid rgba(255, 42, 95, 0.5)",
            borderRight: "none",
            color: "#ff2a5f",
            width: "26px",
            height: "42px",
            borderRadius: "6px 0 0 6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            boxShadow: "0 0 12px rgba(255, 42, 95, 0.3)",
            transition: "all 0.2s ease"
          }}
          title={isRightOpen ? "Ocultar panel rojo" : "Mostrar panel rojo"}
        >
          {isRightOpen ? "▶" : "◀"}
        </button>

        <div className="panel-header-wrapper">
          <div className="panel-team-title red-glow-text">EQUIPO ROJO</div>
        </div>
        
        <div className="hud-category-section">
          <span className="category-title">SELECCIONES TÁCTICAS</span>
          <div className="picks-cards-stack" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {redPicks.map((pick, idx) => {
              const splashUrl = getChampionSplashUrl(pick);
              const rolePretendido = pick?.role || pick?.position || "ROL";
              const objectPos = getChampionObjectPosition(pick?.name);

              return (
                <div 
                  key={idx} 
                  className={`neon-floating-card red-neon ${pick ? "is-populated" : "is-empty"}`}
                  style={{
                    height: "72px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 42, 95, 0.4)",
                    cursor: pick ? "grab" : "default",
                    userSelect: "none"
                  }}
                  onMouseDown={(e) => pick && onMouseDownPick(e, pick, "red")}
                  title={pick ? `Arrastrar a ${pick.name}` : `Slot ${idx + 1}`}
                >
                  {pick ? (
                    <>
                      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                        <img 
                          src={splashUrl} 
                          alt={pick.name} 
                          draggable="false" 
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover", 
                            objectPosition: objectPos,
                            filter: "brightness(0.7)" 
                          }} 
                        />
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(90deg, rgba(4,7,13,0.92) 15%, rgba(4,7,13,0.5) 60%, rgba(4,7,13,0.2) 100%)"
                        }}></div>
                      </div>

                      <div style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "12px", height: "100%", gap: "3px" }}>
                        <span className="pro-champion-name" style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
                          {pick.name}
                        </span>
                        <div className="pro-role-box" style={{ width: "fit-content", padding: "2px 6px", background: "rgba(255, 42, 95, 0.15)", border: "1px solid rgba(255, 42, 95, 0.4)", borderRadius: "3px" }}>
                          <span className="pro-role-text" style={{ fontSize: "10px", color: "#ff2a5f", fontWeight: "600" }}>{rolePretendido}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="empty-slot-inner" style={{ display: "flex", alignItems: "center", padding: "0 16px", width: "100%", height: "100%", justifyContent: "space-between" }}>
                      <span className="empty-number-badge" style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>0{idx + 1}</span>
                      <span className="empty-text-label" style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "1px" }}>DISPONIBLE</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="hud-category-section" style={{ marginTop: "12px" }}>
          <span className="category-title">BLOQUEOS (BANS)</span>
          <div className="bans-grid-wrapper">
            {redBans.map((ban, idx) => {
              const banImgUrl = getChampionSquareUrl(ban);
              return (
                <div key={idx} className="tactical-ban-thumb red-ban-neon" title={ban?.name || `Ban ${idx + 1}`}>
                  {ban && <img src={banImgUrl} alt={ban.name || "Ban"} draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}

export default DraftSidebars;