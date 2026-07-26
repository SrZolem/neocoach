import { useState, useRef } from "react";

export function useDragAndDrop() {
  const [boardTokens, setBoardTokens] = useState([]);
  
  // Referencia para guardar temporalmente el objeto que se está arrastrando
  // Esto soluciona el bloqueo de dataTransfer en apps de escritorio (Tauri/Electron)
  const draggedItemRef = useRef(null);

  // Se ejecuta cuando empezás a arrastrar un campeón
  const handleDragStart = (e, championData) => {
    draggedItemRef.current = championData;
    
    // Mantenemos esto por compatibilidad web, pero ya no dependemos exclusivamente de él
    try {
      e.dataTransfer.setData("application/json", JSON.stringify(championData));
      e.dataTransfer.dropEffect = "copy";
    } catch (err) {
      console.warn("dataTransfer restringido por el entorno nativo", err);
    }
  };

  // Se ejecuta cuando soltás el campeón sobre el mapa
  const handleDropOnMap = (e, mapRef) => {
    e.preventDefault();
    
    // Intentamos obtener primero de la referencia (seguro para escritorio)
    // y como fallback intentamos leer del dataTransfer (para la web)
    let champion = draggedItemRef.current;

    if (!champion) {
      try {
        const rawData = e.dataTransfer.getData("application/json");
        if (rawData) {
          champion = JSON.parse(rawData);
        }
      } catch (err) {
        console.error("Error al leer dataTransfer en el drop:", err);
      }
    }

    if (!champion || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    
    // Calculamos posición relativa en porcentaje (0% a 100%) para que sea responsivo
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newToken = {
      id: `${champion.id}-${Date.now()}`,
      champion,
      x,
      y,
    };

    setBoardTokens((prev) => [...prev, newToken]);
    
    // Limpiamos la referencia después de soltar
    draggedItemRef.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necesario para permitir el drop
    e.dataTransfer.dropEffect = "copy"; // Asegura el cursor de copiado en escritorio
  };

  const removeToken = (tokenId) => {
    setBoardTokens((prev) => prev.filter((token) => token.id !== tokenId));
  };

  return {
    boardTokens,
    handleDragStart,
    handleDropOnMap,
    handleDragOver,
    removeToken,
  };
}