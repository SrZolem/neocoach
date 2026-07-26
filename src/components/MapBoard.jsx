import React, { useRef, useEffect, useState, useCallback } from "react";
import mapa from "../assets/GrietaDelInvocador.webp";
import CameraView from "./camera/CameraView";
import DrawingCanvas from "./DrawingCanvas"; // <--- Importas el archivo nuevo aquí
import BottomDrawer from "./BottomDrawer";
import DraftSidebars from "./DraftSidebars";

const TOOL_ICONS = {
  draw: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  move: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>,
  eraser: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.78-.78 2.05 0 2.83L7.17 22h11.41l4.83-4.83c.78-.78.78-2.05 0-2.83L16.56 3.59c-.39-.39-.9-.59-1.42-.59zm-3.73 14L6 11.59l7.73-7.73 5.41 5.41L11.41 17z"/></svg>,
  clear: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
};

const COLORS = ["#c8aa6e", "#38bdf8", "#f43f5e", "#ffffff", "#4ade80"];
const BRUSH_SIZES = [2, 4, 8, 14];

function MapBoard({ currentDraft }) {
  const [activeTool, setActiveTool] = useState("select");
  const [drawColor, setDrawColor] = useState("#c8aa6e");
  const [brushSize, setBrushSize] = useState(4);

  const [champions, setChampions] = useState([]);
  const [champSearch, setChampSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("blue");

  const [placedIcons, setPlacedIcons] = useState([]);
  const [draggingTokenId, setDraggingTokenId] = useState(null);
  const [activeDragItem, setActiveDragItem] = useState(null);

  const [activeBottomTab, setActiveBottomTab] = useState("champions");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const safeDraftState = {
    bluePicks: currentDraft?.bluePicks || Array(5).fill(null),
    blueBans: currentDraft?.blueBans || Array(5).fill(null),
    redPicks: currentDraft?.redPicks || Array(5).fill(null),
    redBans: currentDraft?.redBans || Array(5).fill(null),
  };

  const isDraggingToken = useRef(false);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    async function fetchRiotData() {
      try {
        const versionsRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await versionsRes.json();
        const latestVer = versions[0];

        const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVer}/data/es_ES/champion.json`);
        const champData = await champRes.json();
        const champList = Object.values(champData.data).map((c) => ({
          id: c.id,
          name: c.name,
          tags: c.tags || [],
          image: `https://ddragon.leagueoflegends.com/cdn/${latestVer}/img/champion/${c.image.full}`,
        }));
        setChampions(champList);
      } catch (err) {
        console.error("Error al cargar datos de Riot API:", err);
      }
    }
    fetchRiotData();
  }, []);

  const getMapCoordinates = useCallback((e) => {
    if (!mapContainerRef.current) return { pctX: 0, pctY: 0 };
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    return { pctX, pctY };
  }, []);

  useEffect(() => {
    function handleGlobalMouseMove(e) {
      if (draggingTokenId) {
        isDraggingToken.current = true;
        const { pctX, pctY } = getMapCoordinates(e);
        setPlacedIcons((prev) =>
          prev.map((token) => (token.id === draggingTokenId ? { ...token, x: pctX, y: pctY } : token))
        );
      }

      if (activeDragItem) {
        setActiveDragItem((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
      }
    }

    function handleGlobalMouseUp(e) {
      if (draggingTokenId) {
        setDraggingTokenId(null);
        setTimeout(() => { isDraggingToken.current = false; }, 50);
      }

      if (activeDragItem) {
        if (mapContainerRef.current) {
          const rect = mapContainerRef.current.getBoundingClientRect();
          const inMap =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (inMap) {
            const { pctX, pctY } = getMapCoordinates(e);
            setPlacedIcons((prev) => [
              ...prev,
              {
                id: Date.now(),
                x: pctX,
                y: pctY,
                type: activeDragItem.type,
                team: activeDragItem.type === "champion" ? activeDragItem.team : null,
                data: activeDragItem.item,
              },
            ]);
          }
        }
        setActiveDragItem(null);
      }
    }

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [draggingTokenId, activeDragItem, getMapCoordinates]);

  function handleStartExternalDrag(e, item, type, team = selectedTeam) {
    e.preventDefault();
    e.stopPropagation();
    setActiveDragItem({
      item,
      type,
      team,
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handleTokenMouseDown(e, icon) {
    e.stopPropagation();
    if (activeTool === "eraser") {
      removeIcon(icon.id);
      return;
    }
    isDraggingToken.current = false;
    setDraggingTokenId(icon.id);
  }

  function toggleTokenTeam(e, icon) {
    e.stopPropagation();
    if (activeTool === "eraser" || isDraggingToken.current) return;

    if (icon.type === "champion") {
      setPlacedIcons((prev) =>
        prev.map((token) => (token.id === icon.id ? { ...token, team: token.team === "blue" ? "red" : "blue" } : token))
      );
    }
  }

  function removeIcon(id) {
    setPlacedIcons((prev) => prev.filter((icon) => icon.id !== id));
  }

  function clearAll() {
    setPlacedIcons([]);
    setActiveDragItem(null);
    window.dispatchEvent(new Event("clear-tactical-canvas"));
  }

  return (
    <div className="workspace-container" style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#05080e", color: "#f0e6d2" }}>
      
      {activeDragItem && (
        <div
          style={{
            position: "fixed",
            left: `${activeDragItem.x}px`,
            top: `${activeDragItem.y}px`,
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            pointerEvents: "none",
            background: activeDragItem.team === "red" ? "rgba(225, 29, 72, 0.2)" : "rgba(2, 132, 199, 0.2)",
            border: `2px solid ${activeDragItem.team === "red" ? "#e11d48" : "#0284c7"}`,
            borderRadius: "50%",
            padding: "4px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src={activeDragItem.item.image || activeDragItem.item.icon}
            alt=""
            width="36"
            height="36"
            style={{ borderRadius: "50%", display: "block", objectFit: "cover" }}
          />
        </div>
      )}

      <div className="workspace" style={{ width: "100%", flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        
        {/* BARRA DE HERRAMIENTAS PRINCIPAL */}
        <div className="toolbar" style={{ zIndex: 5, position: "relative", marginBottom: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", background: "#090d16", border: "1px solid #1e293b", padding: "8px 16px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          
          <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { id: "draw", label: "Dibujar", icon: TOOL_ICONS.draw },
              { id: "select", label: "Mover", icon: TOOL_ICONS.move },
              { id: "eraser", label: "Borrar", icon: TOOL_ICONS.eraser }
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                style={{
                  background: activeTool === tool.id ? "linear-gradient(180deg, #c8aa6e 0%, #785a28 100%)" : "#111827",
                  color: activeTool === tool.id ? "#05080e" : "#c8aa6e",
                  border: "1px solid #c8aa6e",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
              >
                {tool.icon} <span>{tool.label}</span>
              </button>
            ))}

            <button 
              onClick={clearAll}
              style={{ background: "#2a080c", color: "#f87171", border: "1px solid #7f1d1d", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease" }}
            >
              {TOOL_ICONS.clear} <span>Limpiar</span>
            </button>
          </div>

          {/* Selector de Colores y Tamaños */}
          {activeTool === "draw" && (
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "4px", paddingTop: "6px", borderTop: "1px solid #1e293b", width: "100%", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Color:</span>
                {COLORS.map((col) => (
                  <button
                    key={col}
                    onClick={() => setDrawColor(col)}
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: col,
                      border: drawColor === col ? "2px solid #fff" : "2px solid transparent",
                      cursor: "pointer",
                      padding: 0,
                      transform: drawColor === col ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.1s"
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Tamaño:</span>
                {BRUSH_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    style={{
                      background: brushSize === size ? "#c8aa6e" : "#111827",
                      color: brushSize === size ? "#05080e" : "#94a3b8",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      width: "22px",
                      height: "22px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        <CameraView activeTool="select">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div
              ref={mapContainerRef}
              className={`map-wrapper tool-${activeTool}`}
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <img
                className="map-image"
                src={mapa}
                alt="Grieta del Invocador"
                draggable="false"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />

              {/* LLAMADA AL NUEVO COMPONENTE DE DIBUJO AISLADO */}
              <DrawingCanvas 
                activeTool={activeTool} 
                activeColor={drawColor} 
                brushSize={brushSize} 
              />

              {placedIcons.map((icon) => (
                <div
                  key={icon.id}
                  className={`placed-token ${icon.team ? `team-${icon.team}` : ""} ${draggingTokenId === icon.id ? "dragging" : ""}`}
                  style={{ left: `${icon.x}%`, top: `${icon.y}%`, position: "absolute", transform: "translate(-50%, -50%)", zIndex: 1000000 }}
                  onMouseDown={(e) => handleTokenMouseDown(e, icon)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTokenTeam(e, icon);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    removeIcon(icon.id);
                  }}
                >
                  <img 
                    src={icon.data?.image || icon.data?.icon} 
                    alt={icon.data?.name || "Token"} 
                    draggable="false" 
                    width="32" 
                    height="32" 
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CameraView>
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", boxSizing: "border-box" }}>
        <DraftSidebars 
          draftState={safeDraftState} 
          onMouseDownPick={(e, champ, team) => {
            e.preventDefault();
            e.stopPropagation();

            const champKey = champ.id || champ.name?.toLowerCase().trim();
            const squareIcon = 
              champ.icon || 
              champ.square || 
              (champ.image && !champ.image.includes("splash") ? champ.image : null) || 
              (champKey ? `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champKey}.png` : champ.image);

            setActiveDragItem({
              item: { 
                id: champ.id || champ.name, 
                name: champ.name, 
                image: squareIcon, 
              },
              type: "champion",
              team,
              x: e.clientX,
              y: e.clientY,
            });
          }} 
        />
      </div>

      <BottomDrawer 
        champions={champions}
        champSearch={champSearch}
        setChampSearch={setChampSearch}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        activeBottomTab={activeBottomTab}
        setActiveBottomTab={setActiveBottomTab}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        onStartExternalDrag={handleStartExternalDrag}
      />

    </div>
  );
}

export default MapBoard;