import React, { useState } from "react";
import ChampionPoolManager from "./ChampionPoolManager";
import SavedPoolsList from "./SavedPoolsList";

function ChampionPoolContainer() {
  const [savedPools, setSavedPools] = useState([]);
  const [editingPool, setEditingPool] = useState(null);

  // Guardar o actualizar la pool
  const handleSavePool = (poolData) => {
    setSavedPools((prevPools) => {
      const exists = prevPools.find((p) => p.id === poolData.id);
      if (exists) {
        // Si ya existe, la actualizamos
        return prevPools.map((p) => (p.id === poolData.id ? poolData : p));
      } else {
        // Si es nueva, la agregamos al inicio
        return [poolData, ...prevPools];
      }
    });
    // Limpiamos el estado de edición al terminar
    setEditingPool(null);
  };

  // Eliminar pool
  const handleDeletePool = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta Champion Pool?")) {
      setSavedPools(prev => prev.filter(p => p.id !== id));
      if (editingPool && editingPool.id === id) {
        setEditingPool(null);
      }
    }
  };

  // Iniciar la edición y hacer scroll hacia arriba
  const handleStartEditPool = (pool) => {
    setEditingPool(pool);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPool(null);
  };

  return (
    <div className="champion-pool-main-wrapper">
      {/* Formulario superior de gestión / edición */}
      <ChampionPoolManager 
        onSavePool={handleSavePool} 
        editingPool={editingPool} 
        onCancelEdit={handleCancelEdit} 
      />

      {/* Listado inferior de pools guardadas */}
      <SavedPoolsList 
        savedPools={savedPools} 
        onDeletePool={handleDeletePool} 
        onStartEditPool={handleStartEditPool} 
      />
    </div>
  );
}

export default ChampionPoolContainer; 