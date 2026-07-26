import React, { useState, useRef, useEffect, useCallback } from "react";

// ÍCONOS SVG ESTILIZADOS
const CAMERA_ICONS = {
  zoomIn: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  zoomOut: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  zoomStep: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  ),
  reset: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
};

const ZOOM_LEVELS = [1.0, 1.3, 1.6, 2.2];

export default function CameraView({ children, activeTool }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // MANTENER EL MAPA DENTRO DE LOS LÍMITES
  const clampPosition = useCallback((x, y, currentScale) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const { clientWidth, clientHeight } = containerRef.current;
    const maxShiftX = (clientWidth * (currentScale - 1)) / 2;
    const maxShiftY = (clientHeight * (currentScale - 1)) / 2;

    const clampedX = Math.min(maxShiftX, Math.max(x, -maxShiftX));
    const clampedY = Math.min(maxShiftY, Math.max(y, -maxShiftY));

    return { x: clampedX, y: clampedY };
  }, []);

  // 1. ZOOM RUEDA MOUSE
  const handleWheel = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomFactor = 0.15;
    const minScale = 1.0;
    const maxScale = 2.5;

    const delta = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
    const newScale = Math.min(Math.max(scale * delta, minScale), maxScale);

    if (newScale === 1.0) {
      handleReset();
      return;
    }

    setPosition((prev) => clampPosition(prev.x, prev.y, newScale));
    setScale(newScale);
  };

  // 2. ARRASTRE (Bloqueado si estás dibujando, borrando o en modo select/move de tokens)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    
    // Si la herramienta activa es dibujar o borrar, la cámara no debe hacer paneo
    if (activeTool === "draw" || activeTool === "eraser") return;
    
    // Si estás en modo select pero haces clic sobre un token o elemento interactivo, dejamos que pase
    if (activeTool === "select" && e.target.closest(".placed-token")) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setPosition(clampPosition(newX, newY, scale));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 3. CONTROLES POR BOTÓN
  const setZoomLevel = (newScale) => {
    if (newScale === 1.0) {
      handleReset();
      return;
    }
    setScale(newScale);
    setPosition((prev) => clampPosition(prev.x, prev.y, newScale));
  };

  const handleZoomIn = () => {
    const nextLevel = ZOOM_LEVELS.find((l) => l > scale + 0.05) || ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
    setZoomLevel(nextLevel);
  };

  const handleZoomOut = () => {
    const prevLevels = ZOOM_LEVELS.filter((l) => l < scale - 0.05);
    const prevLevel = prevLevels.length > 0 ? prevLevels[prevLevels.length - 1] : ZOOM_LEVELS[0];
    setZoomLevel(prevLevel);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const isPanningActive = scale > 1 && activeTool !== "draw" && activeTool !== "eraser";

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: isPanningActive ? (isDragging ? "grabbing" : "grab") : "default",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justify: "center"
      }}
    >
      {/* BOTONERA CÁMARA (Esquina superior derecha) */}
      <div className="camera-controls" style={{ zIndex: 50, position: "absolute", top: "15px", right: "15px", display: "flex", gap: "6px" }}>
        <button className="camera-btn" onClick={handleZoomIn} title="Acercar">
          {CAMERA_ICONS.zoomIn}
        </button>

        <button className="camera-btn" onClick={handleZoomOut} title="Alejar">
          {CAMERA_ICONS.zoomOut}
        </button>

        <button className="camera-btn" onClick={() => setZoomLevel(1.6)} title="Zoom Intermedio">
          {CAMERA_ICONS.zoomStep}
        </button>

        <button className="camera-btn" onClick={handleReset} title="Restablecer">
          {CAMERA_ICONS.reset}
        </button>
      </div>

      {/* CONTENEDOR DEL MAPA */}
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.05s ease-out",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1
        }}
      >
        {children}
      </div>
    </div>
  );
}