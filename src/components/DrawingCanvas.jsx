import React, { useRef, useEffect, useState, useCallback } from "react";

export default function DrawingCanvas({ activeTool, activeColor, brushSize }) {
  const canvasRef = useRef(null);
  const [paths, setPaths] = useState([]);
  
  const isDrawing = useRef(false);
  const currentPathRef = useRef(null);
  const activeToolRef = useRef(activeTool);
  const activeColorRef = useRef(activeColor);
  const brushSizeRef = useRef(brushSize);

  useEffect(() => {
    activeToolRef.current = activeTool;
    activeColorRef.current = activeColor;
    brushSizeRef.current = brushSize;
  }, [activeTool, activeColor, brushSize]);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  useEffect(() => {
    const handleClearCanvas = () => {
      setPaths([]);
      currentPathRef.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      }
    };
    window.addEventListener("clear-tactical-canvas", handleClearCanvas);
    return () => window.removeEventListener("clear-tactical-canvas", handleClearCanvas);
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    paths.forEach((path) => {
      if (!path || !path.points || path.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.color || "#c8aa6e";
      ctx.lineWidth = path.size || 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });

    if (currentPathRef.current && currentPathRef.current.points.length >= 2) {
      const cp = currentPathRef.current;
      ctx.beginPath();
      ctx.strokeStyle = cp.color || "#c8aa6e";
      ctx.lineWidth = cp.size || 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(cp.points[0].x, cp.points[0].y);
      for (let i = 1; i < cp.points.length; i++) {
        ctx.lineTo(cp.points[i].x, cp.points[i].y);
      }
      ctx.stroke();
    }
  }, [paths]);

  useEffect(() => {
    redrawCanvas();
  }, [paths, redrawCanvas]);

  const getCanvasMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    const scaleX = (canvas.width / dpr) / rect.width;
    const scaleY = (canvas.height / dpr) / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const eraseNearPoint = (x, y) => {
    const threshold = 30;
    setPaths((prevPaths) =>
      prevPaths.filter(
        (path) =>
          path &&
          Array.isArray(path.points) &&
          !path.points.some((pt) => Math.hypot(pt.x - x, pt.y - y) < threshold)
      )
    );
  };

  // Usamos PointerEvents nativos compatibles al 100% con WebViews de Tauri en escritorio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (e) => {
      if (activeToolRef.current !== "draw" && activeToolRef.current !== "eraser") return;
      
      e.preventDefault();
      // Capturamos el puntero para que Tauri no pierda el foco aunque el cursor salga del canvas
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (err) {
        // Ignorar si el entorno no lo soporta
      }

      isDrawing.current = true;
      const { x, y } = getCanvasMousePos(e);

      if (activeToolRef.current === "draw") {
        currentPathRef.current = {
          color: activeColorRef.current || "#c8aa6e",
          size: brushSizeRef.current || 4,
          points: [{ x, y }],
        };
      } else if (activeToolRef.current === "eraser") {
        eraseNearPoint(x, y);
      }
    };

    const handlePointerMove = (e) => {
      if (!isDrawing.current) return;
      
      if (activeToolRef.current === "draw" || activeToolRef.current === "eraser") {
        e.preventDefault();
      }

      const { x, y } = getCanvasMousePos(e);

      if (activeToolRef.current === "draw" && currentPathRef.current) {
        currentPathRef.current.points.push({ x, y });
        redrawCanvas();
      } else if (activeToolRef.current === "eraser") {
        eraseNearPoint(x, y);
      }
    };

    const handlePointerUp = (e) => {
      if (!isDrawing.current) return;

      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignorar
      }

      e.preventDefault();

      if (activeToolRef.current === "draw" && currentPathRef.current) {
        if (currentPathRef.current.points.length > 1) {
          const finishedPath = { ...currentPathRef.current };
          setPaths((prev) => [...prev, finishedPath]);
        }
        currentPathRef.current = null;
      }

      isDrawing.current = false;
      redrawCanvas();
    };

    // Añadimos los eventos de puntero directamente al canvas
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [redrawCanvas]);

  const isDrawingOrEraser = activeTool === "draw" || activeTool === "eraser";

  return (
    <canvas
      ref={canvasRef}
      className={`tactical-canvas tool-${activeTool}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 999999,
        pointerEvents: isDrawingOrEraser ? "auto" : "none",
        cursor: activeTool === "draw" ? "crosshair" : activeTool === "eraser" ? "cell" : "default",
        background: "transparent",
        touchAction: "none", // Evita gestos táctiles por defecto de Windows/Tauri
      }}
    />
  );
}