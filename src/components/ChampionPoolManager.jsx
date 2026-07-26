import React, { useState, useEffect } from "react";
import "./ChampionPool.css";

const ROLE_CHAMPIONS_MAP = {
  TOP: [
    "Aatrox", "Akali", "Ambessa", "Aurora", "Camille", "Cho'Gath", "Darius", "Dr. Mundo", 
    "Fiora", "Gangplank", "Garen", "Gnar", "Gragas", "Gwen", "Illaoi", "Irelia", 
    "Jax", "Jayce", "KSante", "Kayle", "Kennen", "Kled", "Malphite", "Maokai", "Mordekaiser", 
    "Nasus", "Olaf", "Ornn", "Pantheon", "Poppy", "Quinn", "Renekton", "Riven", "Rumble", 
    "Sett", "Shen", "Singed", "Sion", "Smolder", "Swain", "Teemo", "Tryndamere", "Twisted Fate", 
    "Udyr", "Urgot", "Vayne", "Vladimir", "Volibear", "Warwick", "Wukong", "Yasuo", "Yone", 
    "Yorick", "Zac"
  ],
  JG: [
    "Amumu", "BelVeth", "Brand", "Briar", "Diana", "Ekko", "Elise", "Evelynn", "Fiddlesticks", 
    "Gragas", "Gwen", "Hecarim", "Ivern", "Jarvan IV", "Karthus", "Kayn", "KhaZix", "Kindred", 
    "Lee Sin", "Lillia", "Master Yi", "Nidalee", "Nocturne", "Nunu", "Olaf", "Pantheon", "Poppy", 
    "Rammus", "RekSai", "Rengar", "Sejuani", "Shaco", "Shyvana", "Skarner", "Taliyah", "Talon", 
    "Trundle", "Udyr", "Vi", "Viego", "Volibear", "Warwick", "Wukong", "Xin Zhao", "Zac"
  ],
  MID: [
    "Ahri", "Akali", "Akshan", "Anivia", "Annie", "Aurelion Sol", "Azir", "Cassiopeia", "Corki", 
    "Diana", "Ekko", "Fizz", "Galio", "Garen", "Hwei", "Irelia", "Jayce", "Karma", "Kassadin", 
    "Katarina", "LeBlanc", "Lissandra", "Lux", "Malzahar", "Mel", "Naafiri", "Neeko", "Orianna", 
    "Pantheon", "Qiyana", "Ryze", "Smolder", "Swain", "Sylas", "Syndra", "Taliyah", "Talon", 
    "Tristana", "Twisted Fate", "Veigar", "Vex", "Viktor", "Vladimir", "Xerath", "Yasuo", 
    "Yone", "Zed", "Ziggs", "Zoe"
  ],
  BOT: [
    "Aphelios", "Ashe", "Caitlyn", "Corki", "Draven", "Ezreal", "Jhin", "Jinx", "Kaisa", 
    "Kalista", "Karthus", "KogMaw", "Lucian", "Miss Fortune", "Nilah", "Samira", "Senna", 
    "Seraphine", "Sivir", "Smolder", "Swain", "Tristana", "Twitch", "Varus", "Vayne", "Xayah", 
    "Yasuo", "Zeri", "Ziggs"
  ],
  SUP: [
    "Alistar", "Ashe", "Bard", "Blitzcrank", "Brand", "Braum", "Fiddlesticks", 
    "Janna", "Karma", "Leona", "Lulu", "Lux", "Maokai", "Milio", "Morgana", "Nami", "Nautilus", 
    "Pantheon", "Pyke", "Rakan", "Rell", "Renata Glasc", "Senna", "Seraphine", "Sona", "Soraka", 
    "Swain", "Tahm Kench", "Taric", "Thresh", "VelKoz", "Xerath", "Yuumi", "Zac", 
    "Zilean", "Zyra"
  ]
};

function ChampionPoolManager({ onSavePool, editingPool, onCancelEdit }) {
  const [playerName, setPlayerName] = useState("");
  const [role, setRole] = useState("MID");
  const [champions, setChampions] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);
  
  const [championList, setChampionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("TODOS");

  // Si se pasa una pool para editar, cargamos sus datos en el form
  useEffect(() => {
    if (editingPool) {
      setPlayerName(editingPool.playerName);
      setRole(editingPool.role);
      setChampions(editingPool.champions);
      setCurrentEditId(editingPool.id);
    }
  }, [editingPool]);

  useEffect(() => {
    fetch("https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/champion.json")
      .then((res) => res.json())
      .then((data) => {
        const champArray = Object.values(data.data).map((c) => ({
          id: c.id,
          name: c.name,
          squareUrl: `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${c.id}.png`
        }));
        champArray.sort((a, b) => a.name.localeCompare(b.name));
        setChampionList(champArray);
      })
      .catch((err) => console.error("Error al cargar campeones:", err));
  }, []);

  const filteredChampions = championList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedRoleFilter === "TODOS") return true;

    const roleList = ROLE_CHAMPIONS_MAP[selectedRoleFilter] || [];
    return roleList.some(
      (name) => name.toLowerCase().replace(/['\s]/g, "") === c.name.toLowerCase().replace(/['\s]/g, "")
    );
  });

  const addChampionToPool = (champ, targetTier = "S") => {
    if (champions.some((c) => c.id === champ.id)) return;
    const newEntry = {
      uniqueId: Date.now() + Math.random(),
      id: champ.id,
      name: champ.name,
      squareUrl: champ.squareUrl,
      level: targetTier
    };
    setChampions((prev) => [...prev, newEntry]);
  };

  const handleRemoveChampion = (uniqueId) => {
    setChampions(champions.filter((c) => c.uniqueId !== uniqueId));
  };

  const handleClearAll = () => {
    if (champions.length === 0) return;
    if (window.confirm("¿Estás seguro de limpiar toda la tier list?")) {
      setChampions([]);
    }
  };

  const handleClearTier = (tierLetter) => {
    setChampions(champions.filter((c) => c.level !== tierLetter));
  };

  const handleDragStart = (e, champ) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(champ));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnTier = (e, targetTier, targetUniqueId = null) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData("text/plain");
    if (!rawData) return;

    try {
      const draggedData = JSON.parse(rawData);

      if (!draggedData.uniqueId) {
        const existing = champions.find((c) => c.id === draggedData.id);
        if (existing) {
          setChampions(champions.map(c => c.uniqueId === existing.uniqueId ? { ...c, level: targetTier } : c));
        } else {
          const newEntry = {
            uniqueId: Date.now() + Math.random(),
            id: draggedData.id,
            name: draggedData.name,
            squareUrl: draggedData.squareUrl,
            level: targetTier
          };
          setChampions(prev => [...prev, newEntry]);
        }
        return;
      }

      const draggedUniqueId = draggedData.uniqueId;
      const sourceChamp = champions.find(c => c.uniqueId === draggedUniqueId);
      if (!sourceChamp) return;

      let updatedList = champions.map(c => 
        c.uniqueId === draggedUniqueId ? { ...c, level: targetTier } : c
      );

      if (targetUniqueId && targetUniqueId !== draggedUniqueId) {
        const targetIndex = updatedList.findIndex(c => c.uniqueId === targetUniqueId);
        const sourceIndex = updatedList.findIndex(c => c.uniqueId === draggedUniqueId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
          const [removed] = updatedList.splice(sourceIndex, 1);
          updatedList.splice(targetIndex, 0, removed);
        }
      }

      setChampions(updatedList);
    } catch (err) {
      console.error("Error al procesar drop:", err);
    }
  };

  const handleSaveAll = () => {
    if (!playerName.trim() || champions.length === 0) {
      alert("Por favor ingresa el nombre del jugador y selecciona al menos un campeón para el pool.");
      return;
    }

    const poolData = {
      id: currentEditId || Date.now(), // Mantiene el ID original si estamos editando
      playerName: playerName.trim(),
      role,
      champions,
      date: new Date().toLocaleDateString("es-AR") // Actualiza automáticamente a la fecha de hoy al guardar
    };

    onSavePool(poolData);
    setPlayerName("");
    setChampions([]);
    setCurrentEditId(null);
    if (onCancelEdit) onCancelEdit();
    
    alert(currentEditId ? "¡Champion Pool actualizada exitosamente!" : "¡Champion Pool guardada exitosamente!");
  };

  const tiers = ["S", "A", "B", "C"];
  const roleTabs = ["TODOS", "TOP", "JG", "MID", "BOT", "SUP"];

  return (
    <div className="cp-esports-container">
      <div className="cp-esports-header">
        <div className="cp-esports-title-group">
          <h2>{currentEditId ? "✏️ EDITANDO CHAMPION POOL" : "GESTIÓN DE CHAMPION POOL"}</h2>
          <span className="cp-esports-subtitle">PANEL TÁCTICO PROFESIONAL</span>
        </div>
        <div className="cp-esports-config-mini" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)} 
            placeholder="Nombre del Jugador" 
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="TOP">TOP LANE</option>
            <option value="JG">JUNGLE</option>
            <option value="MID">MID LANE</option>
            <option value="BOT">BOT CARRY</option>
            <option value="SUP">SUPPORT</option>
          </select>
          {currentEditId && onCancelEdit && (
            <button 
              onClick={() => {
                setPlayerName("");
                setChampions([]);
                setCurrentEditId(null);
                onCancelEdit();
              }}
              className="cp-clear-all-btn"
              style={{ padding: "6px 12px", cursor: "pointer" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="cp-esports-workspace">
        <div className="cp-esports-pane cp-left-pane">
          <div className="cp-pane-header">
            <h3>BANCO DE CAMPEONES</h3>
            <span className="cp-badge-count">{filteredChampions.length} Disp.</span>
          </div>

          <div className="cp-role-tabs">
            {roleTabs.map((rtab) => (
              <button
                key={rtab}
                className={`cp-role-tab-btn ${selectedRoleFilter === rtab ? "active" : ""}`}
                onClick={() => setSelectedRoleFilter(rtab)}
              >
                {rtab}
              </button>
            ))}
          </div>

          <div className="cp-search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="cp-search-input"
              placeholder="Buscar campeón..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="cp-champs-grid">
            {filteredChampions.map((champ) => {
              const isSelected = champions.some((c) => c.id === champ.id);
              return (
                <div 
                  key={champ.id} 
                  className={`cp-champ-card-item ${isSelected ? "is-selected" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, champ)}
                  onClick={() => addChampionToPool(champ, "S")}
                >
                  <div className="cp-avatar-wrap">
                    <img src={champ.squareUrl} alt={champ.name} />
                    {isSelected && <div className="selected-badge">✓</div>}
                  </div>
                  <span className="cp-champ-name">{champ.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cp-esports-pane cp-right-pane">
          <div className="cp-pane-header cp-right-pane-header">
            <div className="cp-title-with-clear">
              <h3>TIER LIST TÁCTICA</h3>
              {champions.length > 0 && (
                <button onClick={handleClearAll} className="cp-clear-all-btn">Limpiar Todo</button>
              )}
            </div>
            <span className="cp-badge-count">Asignados: {champions.length}</span>
          </div>

          <div className="cp-tiers-wrapper-esports">
            {tiers.map((tier) => {
              const champsInTier = champions.filter((c) => c.level === tier);
              return (
                <div 
                  key={tier} 
                  className={`cp-tier-row-esports cp-tier-${tier}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnTier(e, tier)}
                >
                  <div className="cp-tier-badge-col">
                    <span className="tier-letter">TIER {tier}</span>
                    <div className="cp-tier-sub-info">
                      <span className="tier-count">({champsInTier.length})</span>
                      {champsInTier.length > 0 && (
                        <button onClick={() => handleClearTier(tier)} className="cp-clear-tier-btn">🗑️</button>
                      )}
                    </div>
                  </div>
                  
                  <div className="cp-tier-content-col">
                    {champsInTier.length === 0 ? (
                      <span className="cp-empty-tier-text">Arrastra aquí...</span>
                    ) : (
                      champsInTier.map((c) => (
                        <div 
                          key={c.uniqueId} 
                          className="cp-minimal-icon-chip"
                          draggable
                          onDragStart={(e) => handleDragStart(e, c)}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDropOnTier(e, tier, c.uniqueId);
                          }}
                        >
                          <img src={c.squareUrl} alt={c.name} />
                          <button onClick={(e) => { e.stopPropagation(); handleRemoveChampion(c.uniqueId); }} className="cp-minimal-remove">✕</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleSaveAll} className="cp-save-master-btn">
            <span>💾</span> {currentEditId ? "ACTUALIZAR POOL GUARDADA" : "GUARDAR POOL EN SECCIÓN GENERAL"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChampionPoolManager;