import React, { useState, useEffect } from "react";
import "./CustomDraftRoom.css";

const CHAMPIONS_LIST = [
  // --- TOPLANE ---
  { id: "Aatrox", name: "Aatrox", role: "TOP" },
  { id: "Camille", name: "Camille", role: "TOP" },
  { id: "Chogath", name: "Cho'Gath", role: "TOP" },
  { id: "Darius", name: "Darius", role: "TOP" },
  { id: "DrMundo", name: "Dr. Mundo", role: "TOP" },
  { id: "Fiora", name: "Fiora", role: "TOP" },
  { id: "Gangplank", name: "Gangplank", role: "TOP" },
  { id: "Garen", name: "Garen", role: "TOP" },
  { id: "Gnar", name: "Gnar", role: "TOP" },
  { id: "Gragas", name: "Gragas", role: "TOP" },
  { id: "Gwen", name: "Gwen", role: "TOP" },
  { id: "Illaoi", name: "Illaoi", role: "TOP" },
  { id: "Irelia", name: "Irelia", role: "TOP" },
  { id: "Jax", name: "Jax", role: "TOP" },
  { id: "Jayce", name: "Jayce", role: "TOP" },
  { id: "KSante", name: "K'Sante", role: "TOP" },
  { id: "Kayle", name: "Kayle", role: "TOP" },
  { id: "Kennen", name: "Kennen", role: "TOP" },
  { id: "Kled", name: "Kled", role: "TOP" },
  { id: "Malphite", name: "Malphite", role: "TOP" },
  { id: "Mordekaiser", name: "Mordekaiser", role: "TOP" },
  { id: "Nasus", name: "Nasus", role: "TOP" },
  { id: "Olaf", name: "Olaf", role: "TOP" },
  { id: "Ornn", name: "Ornn", role: "TOP" },
  { id: "Pantheon", name: "Pantheon", role: "TOP" },
  { id: "Poppy", name: "Poppy", role: "TOP" },
  { id: "Quinn", name: "Quinn", role: "TOP" },
  { id: "Renekton", name: "Renekton", role: "TOP" },
  { id: "Riven", name: "Riven", role: "TOP" },
  { id: "Rumble", name: "Rumble", role: "TOP" },
  { id: "Sett", name: "Sett", role: "TOP" },
  { id: "Shen", name: "Shen", role: "TOP" },
  { id: "Singed", name: "Singed", role: "TOP" },
  { id: "Sion", name: "Sion", role: "TOP" },
  { id: "TahmKench", name: "Tahm Kench", role: "TOP" },
  { id: "Teemo", name: "Teemo", role: "TOP" },
  { id: "Trundle", name: "Trundle", role: "TOP" },
  { id: "Tryndamere", name: "Tryndamere", role: "TOP" },
  { id: "Urgot", name: "Urgot", role: "TOP" },
  { id: "Volibear", name: "Volibear", role: "TOP" },
  { id: "MonkeyKing", name: "Wukong", role: "TOP" },
  { id: "Yorick", name: "Yorick", role: "TOP" },

  // --- JUNGLE ---
  { id: "Amumu", name: "Amumu", role: "JUNGLE" },
  { id: "Belveth", name: "Bel'Veth", role: "JUNGLE" },
  { id: "Briar", name: "Briar", role: "JUNGLE" },
  { id: "Diana", name: "Diana", role: "JUNGLE" },
  { id: "Ekko", name: "Ekko", role: "JUNGLE" },
  { id: "Elise", name: "Elise", role: "JUNGLE" },
  { id: "Evelynn", name: "Evelynn", role: "JUNGLE" },
  { id: "Fiddlesticks", name: "Fiddlesticks", role: "JUNGLE" },
  { id: "Graves", name: "Graves", role: "JUNGLE" },
  { id: "Hecarim", name: "Hecarim", role: "JUNGLE" },
  { id: "Ivern", name: "Ivern", role: "JUNGLE" },
  { id: "JarvanIV", name: "Jarvan IV", role: "JUNGLE" },
  { id: "Karthus", name: "Karthus", role: "JUNGLE" },
  { id: "Kayn", name: "Kayn", role: "JUNGLE" },
  { id: "Khazix", name: "Kha'Zix", role: "JUNGLE" },
  { id: "Kindred", name: "Kindred", role: "JUNGLE" },
  { id: "LeeSin", name: "Lee Sin", role: "JUNGLE" },
  { id: "Lillia", name: "Lillia", role: "JUNGLE" },
  { id: "MasterYi", name: "Master Yi", role: "JUNGLE" },
  { id: "Nidalee", name: "Nidalee", role: "JUNGLE" },
  { id: "Nocturne", name: "Nocturne", role: "JUNGLE" },
  { id: "Nunu", name: "Nunu & Willump", role: "JUNGLE" },
  { id: "Rammus", name: "Rammus", role: "JUNGLE" },
  { id: "RekSai", name: "Rek'Sai", role: "JUNGLE" },
  { id: "Rengar", name: "Rengar", role: "JUNGLE" },
  { id: "Sejuani", name: "Sejuani", role: "JUNGLE" },
  { id: "Shaco", name: "Shaco", role: "JUNGLE" },
  { id: "Shyvana", name: "Shyvana", role: "JUNGLE" },
  { id: "Skarner", name: "Skarner", role: "JUNGLE" },
  { id: "Talon", name: "Talon", role: "JUNGLE" },
  { id: "Udyr", name: "Udyr", role: "JUNGLE" },
  { id: "Vi", name: "Vi", role: "JUNGLE" },
  { id: "Viego", name: "Viego", role: "JUNGLE" },
  { id: "Warwick", name: "Warwick", role: "JUNGLE" },
  { id: "XinZhao", name: "Xin Zhao", role: "JUNGLE" },
  { id: "Zac", name: "Zac", role: "JUNGLE" },

  // --- MID ---
  { id: "Ahri", name: "Ahri", role: "MID" },
  { id: "Akali", name: "Akali", role: "MID" },
  { id: "Akshan", name: "Akshan", role: "MID" },
  { id: "Anivia", name: "Anivia", role: "MID" },
  { id: "Annie", name: "Annie", role: "MID" },
  { id: "AurelionSol", name: "Aurelion Sol", role: "MID" },
  { id: "Azir", name: "Azir", role: "MID" },
  { id: "Cassiopeia", name: "Cassiopeia", role: "MID" },
  { id: "Corki", name: "Corki", role: "MID" },
  { id: "Fizz", name: "Fizz", role: "MID" },
  { id: "Galio", name: "Galio", role: "MID" },
  { id: "Heimerdinger", name: "Heimerdinger", role: "MID" },
  { id: "Hwei", name: "Hwei", role: "MID" },
  { id: "Kassadin", name: "Kassadin", role: "MID" },
  { id: "Katarina", name: "Katarina", role: "MID" },
  { id: "Leblanc", name: "LeBlanc", role: "MID" },
  { id: "Lissandra", name: "Lissandra", role: "MID" },
  { id: "Lux", name: "Lux", role: "MID" },
  { id: "Malzahar", name: "Malzahar", role: "MID" },
  { id: "Naafiri", name: "Naafiri", role: "MID" },
  { id: "Neeko", name: "Neeko", role: "MID" },
  { id: "Orianna", name: "Orianna", role: "MID" },
  { id: "Qiyana", name: "Qiyana", role: "MID" },
  { id: "Ryze", name: "Ryze", role: "MID" },
  { id: "Swain", name: "Swain", role: "MID" },
  { id: "Sylas", name: "Sylas", role: "MID" },
  { id: "Syndra", name: "Syndra", role: "MID" },
  { id: "TwistedFate", name: "Twisted Fate", role: "MID" },
  { id: "Veigar", name: "Veigar", role: "MID" },
  { id: "Velkoz", name: "Vel'Koz", role: "MID" },
  { id: "Vex", name: "Vex", role: "MID" },
  { id: "Viktor", name: "Viktor", role: "MID" },
  { id: "Vladimir", name: "Vladimir", role: "MID" },
  { id: "Xerath", name: "Xerath", role: "MID" },
  { id: "Yasuo", name: "Yasuo", role: "MID" },
  { id: "Yone", name: "Yone", role: "MID" },
  { id: "Zed", name: "Zed", role: "MID" },
  { id: "Ziggs", name: "Ziggs", role: "MID" },
  { id: "Zoe", name: "Zoe", role: "MID" },

  // --- ADC ---
  { id: "Aphelios", name: "Aphelios", role: "ADC" },
  { id: "Ashe", name: "Ashe", role: "ADC" },
  { id: "Caitlyn", name: "Caitlyn", role: "ADC" },
  { id: "Draven", name: "Draven", role: "ADC" },
  { id: "Ezreal", name: "Ezreal", role: "ADC" },
  { id: "Jhin", name: "Jhin", role: "ADC" },
  { id: "Jinx", name: "Jinx", role: "ADC" },
  { id: "Kaisa", name: "Kai'Sa", role: "ADC" },
  { id: "Kalista", name: "Kalista", role: "ADC" },
  { id: "KogMaw", name: "Kog'Maw", role: "ADC" },
  { id: "Lucian", name: "Lucian", role: "ADC" },
  { id: "MissFortune", name: "Miss Fortune", role: "ADC" },
  { id: "Nilah", name: "Nilah", role: "ADC" },
  { id: "Samira", name: "Samira", role: "ADC" },
  { id: "Sivir", name: "Sivir", role: "ADC" },
  { id: "Smolder", name: "Smolder", role: "ADC" },
  { id: "Tristana", name: "Tristana", role: "ADC" },
  { id: "Twitch", name: "Twitch", role: "ADC" },
  { id: "Varus", name: "Varus", role: "ADC" },
  { id: "Vayne", name: "Vayne", role: "ADC" },
  { id: "Xayah", name: "Xayah", role: "ADC" },
  { id: "Zeri", name: "Zeri", role: "ADC" },

  // --- SUPPORT ---
  { id: "Alistar", name: "Alistar", role: "SUPPORT" },
  { id: "Bard", name: "Bard", role: "SUPPORT" },
  { id: "Blitzcrank", name: "Blitzcrank", role: "SUPPORT" },
  { id: "Braum", name: "Braum", role: "SUPPORT" },
  { id: "Janna", name: "Janna", role: "SUPPORT" },
  { id: "Karma", name: "Karma", role: "SUPPORT" },
  { id: "Leona", name: "Leona", role: "SUPPORT" },
  { id: "Lulu", name: "Lulu", role: "SUPPORT" },
  { id: "Milio", name: "Milio", role: "SUPPORT" },
  { id: "Morgana", name: "Morgana", role: "SUPPORT" },
  { id: "Nami", name: "Nami", role: "SUPPORT" },
  { id: "Nautilus", name: "Nautilus", role: "SUPPORT" },
  { id: "Pyke", name: "Pyke", role: "SUPPORT" },
  { id: "Rakan", name: "Rakan", role: "SUPPORT" },
  { id: "Rell", name: "Rell", role: "SUPPORT" },
  { id: "Renata", name: "Renata Glasc", role: "SUPPORT" },
  { id: "Senna", name: "Senna", role: "SUPPORT" },
  { id: "Seraphine", name: "Seraphine", role: "SUPPORT" },
  { id: "Sona", name: "Sona", role: "SUPPORT" },
  { id: "Soraka", name: "Soraka", role: "SUPPORT" },
  { id: "Taric", name: "Taric", role: "SUPPORT" },
  { id: "Thresh", name: "Thresh", role: "SUPPORT" },
  { id: "Yuumi", name: "Yuumi", role: "SUPPORT" },
  { id: "Zilean", name: "Zilean", role: "SUPPORT" },
  { id: "Zyra", name: "Zyra", role: "SUPPORT" }
].map(champ => ({
  ...champ,
  img: `https://ddragon.leagueoflegends.com/cdn/14.5.1/img/champion/${champ.id}.png`,
  splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`
}));

const ROLES = ["TODOS", "TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

const COMPETITIVE_SEQUENCE = [
  { phase: "ban", team: "blue", index: 0 }, { phase: "ban", team: "red", index: 0 },
  { phase: "ban", team: "blue", index: 1 }, { phase: "ban", team: "red", index: 1 },
  { phase: "ban", team: "blue", index: 2 }, { phase: "ban", team: "red", index: 2 },
  { phase: "pick", team: "blue", index: 0 }, { phase: "pick", team: "red", index: 0 },
  { phase: "pick", team: "red", index: 1 }, { phase: "pick", team: "blue", index: 1 },
  { phase: "pick", team: "blue", index: 2 }, { phase: "pick", team: "red", index: 2 },
  { phase: "ban", team: "red", index: 3 }, { phase: "ban", team: "blue", index: 3 },
  { phase: "ban", team: "red", index: 4 }, { phase: "ban", team: "blue", index: 4 },
  { phase: "pick", team: "red", index: 3 }, { phase: "pick", team: "blue", index: 3 },
  { phase: "pick", team: "blue", index: 4 }, { phase: "pick", team: "red", index: 4 }
];

export default function CustomDraftRoom({ onSaveDraft }) {
  const [draftMode, setDraftMode] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeExpired, setTimeExpired] = useState(false);
  
  const [freeModeTeam, setFreeModeTeam] = useState("blue");
  const [freeModeHistory, setFreeModeHistory] = useState([]);

  const [activeRole, setActiveRole] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChamp, setSelectedChamp] = useState(null);

  const [blueBans, setBlueBans] = useState(Array(5).fill(null));
  const [redBans, setRedBans] = useState(Array(5).fill(null));
  const [bluePicks, setBluePicks] = useState(Array(5).fill(null));
  const [redPicks, setRedPicks] = useState(Array(5).fill(null));

  const isDraftFinished = draftMode === "competitive" 
    ? currentStep >= COMPETITIVE_SEQUENCE.length 
    : (bluePicks.every(p => p) && redPicks.every(p => p) && blueBans.every(b => b) && redBans.every(b => b));

  const currentAction = draftMode === "competitive" && !isDraftFinished 
    ? COMPETITIVE_SEQUENCE[currentStep] 
    : null;

  useEffect(() => {
    if (draftMode !== "competitive" || isDraftFinished || timeExpired) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, isDraftFinished, draftMode, timeExpired]);

  const handleReset = () => {
    setBlueBans(Array(5).fill(null));
    setRedBans(Array(5).fill(null));
    setBluePicks(Array(5).fill(null));
    setRedPicks(Array(5).fill(null));
    setFreeModeHistory([]);
    setCurrentStep(0);
    setTimeLeft(30);
    setTimeExpired(false);
    setSelectedChamp(null);
    setSearchTerm("");
  };

  const handleUndoFreeMode = () => {
    if (draftMode !== "free" || freeModeHistory.length === 0) return;
    const lastAction = freeModeHistory[freeModeHistory.length - 1];

    if (lastAction.type === "ban") {
      if (lastAction.team === "blue") {
        const newBans = [...blueBans];
        newBans[lastAction.index] = null;
        setBlueBans(newBans);
      } else {
        const newBans = [...redBans];
        newBans[lastAction.index] = null;
        setRedBans(newBans);
      }
    } else {
      if (lastAction.team === "blue") {
        const newPicks = [...bluePicks];
        newPicks[lastAction.index] = null;
        setBluePicks(newPicks);
      } else {
        const newPicks = [...redPicks];
        newPicks[lastAction.index] = null;
        setRedPicks(newPicks);
      }
    }
    setFreeModeHistory(prev => prev.slice(0, prev.length - 1));
  };

  const handleGoToTacticalMap = () => {
    const draftData = { bluePicks, redPicks, blueBans, redBans };
    if (onSaveDraft) {
      onSaveDraft(draftData, "tournament");
    }
  };

  const handleAction = (forcedPhase) => {
    if (!selectedChamp || (draftMode === "competitive" && timeExpired)) return;

    if (draftMode === "competitive") {
      const { phase, team } = currentAction;
      const targetArray = phase === "ban" 
        ? (team === "blue" ? blueBans : redBans) 
        : (team === "blue" ? bluePicks : redPicks);
      const setTargetArray = phase === "ban" 
        ? (team === "blue" ? setBlueBans : setRedBans) 
        : (team === "blue" ? setBluePicks : setRedPicks);

      const emptyIndex = currentAction.index;
      if (emptyIndex !== -1 && targetArray[emptyIndex] === null) {
        const newArray = [...targetArray];
        newArray[emptyIndex] = selectedChamp;
        setTargetArray(newArray);
        setSelectedChamp(null);
        setCurrentStep(currentStep + 1);
        setTimeLeft(30);
      }
    } else if (draftMode === "free") {
      const targetArray = forcedPhase === "ban" 
        ? (freeModeTeam === "blue" ? blueBans : redBans) 
        : (freeModeTeam === "blue" ? bluePicks : redPicks);
      const setTargetArray = forcedPhase === "ban" 
        ? (freeModeTeam === "blue" ? setBlueBans : setRedBans) 
        : (freeModeTeam === "blue" ? setBluePicks : setRedPicks);

      const emptyIndex = targetArray.findIndex(slot => slot === null);
      if (emptyIndex !== -1) {
        const newArray = [...targetArray];
        newArray[emptyIndex] = selectedChamp;
        setTargetArray(newArray);
        setFreeModeHistory(prev => [...prev, { team: freeModeTeam, type: forcedPhase, index: emptyIndex, champ: selectedChamp }]);
        setSelectedChamp(null);
      }
    }
  };

  const filteredChampions = CHAMPIONS_LIST.filter((champ) => {
    const isUsed = blueBans.some(b => b?.id === champ.id) || redBans.some(b => b?.id === champ.id) ||
                   bluePicks.some(p => p?.id === champ.id) || redPicks.some(p => p?.id === champ.id);
    if (isUsed) return false;
    
    const matchesRole = activeRole === "TODOS" || champ.role === activeRole;
    const matchesSearch = champ.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className={`draft-wrapper bg-${currentAction?.team || 'neutral'}`}>
      
      {!draftMode && (
        <div className="mode-selection-modal">
          <div className="modal-content">
            <h2>SELECCIONA EL MODO DE DRAFT</h2>
            <div className="modal-buttons">
              <button onClick={() => setDraftMode("competitive")} className="btn-mode comp">COMPETITIVO OFICIAL</button>
              <button onClick={() => setDraftMode("free")} className="btn-mode free">MODO LIBRE</button>
            </div>
          </div>
        </div>
      )}

      <header className="draft-header">
        <h2>SIMULADOR DE DRAFT {draftMode === "competitive" ? "(COMPETITIVO)" : draftMode === "free" ? "(LIBRE)" : ""}</h2>
        
        <div className="header-right-actions">
          <button className="discreet-btn" onClick={() => setDraftMode(null)}>
            CAMBIAR MODO
          </button>
          <button className="reset-btn" onClick={handleReset}>
            REINICIAR DRAFT
          </button>
        </div>
      </header>

      <div className="draft-main-grid">
        {/* EQUIPO AZUL */}
        <div className="team-column blue-side">
          <div className="bans-row">
            {blueBans.map((ban, i) => {
              const isActive = draftMode === "competitive" 
                ? (currentAction?.team === 'blue' && currentAction?.phase === 'ban' && currentAction?.index === i)
                : (draftMode === "free" && freeModeTeam === 'blue');
              return (
                <div 
                  key={`bb-${i}`} 
                  className={`ban-box ${isActive ? 'neon-active-blue' : ''}`}
                  style={isActive ? { border: '2px solid #00f0ff', boxShadow: '0 0 15px #00f0ff' } : {}}
                >
                  {ban && <img src={ban.img} alt={ban.name} />}
                </div>
              );
            })}
          </div>
          <div className="picks-vertical">
            {bluePicks.map((pick, i) => {
              const isActive = draftMode === "competitive" 
                ? (currentAction?.team === 'blue' && currentAction?.phase === 'pick' && currentAction?.index === i)
                : (draftMode === "free" && freeModeTeam === 'blue');
              return (
                <div 
                  key={`bp-${i}`} 
                  className={`pick-frame ${isActive ? 'neon-active-blue' : ''}`}
                  style={isActive ? { border: '2px solid #00f0ff', boxShadow: '0 0 15px #00f0ff' } : {}}
                >
                  {pick ? <img src={pick.splash} alt={pick.name} className="splash-img" /> : <span className="empty-text">ESPERANDO</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL CENTRAL */}
        <div className="center-panel">
          
          <div className="center-controls">
            {draftMode === "competitive" && (
              <div className={`timer-box ${isDraftFinished ? 'finished' : timeExpired ? 'expired' : ''}`}>
                {isDraftFinished ? "FINALIZADO" : timeExpired ? "TIEMPO AGOTADO" : `00:${timeLeft.toString().padStart(2, '0')}`}
              </div>
            )}
          </div>

          <div className="search-and-filters">
            <input 
              type="text" 
              className="champ-search-input" 
              placeholder="Buscar campeón..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div className="role-filters">
              {ROLES.map(role => (
                <button key={role} className={activeRole === role ? 'active-role' : ''} onClick={() => setActiveRole(role)}>
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="champions-scroll-grid">
            {filteredChampions.map(champ => (
              <div key={champ.id} className={`champ-icon ${selectedChamp?.id === champ.id ? 'selected' : ''}`} onClick={() => setSelectedChamp(champ)}>
                <img src={champ.img} alt={champ.name} />
              </div>
            ))}
          </div>

          {/* BOTONES PRINCIPALES DE SELECCIÓN / BANEO */}
          <div className="action-buttons-row">
            {draftMode === "competitive" && !isDraftFinished ? (
              <>
                <button 
                  className="action-btn select-btn" 
                  disabled={!selectedChamp || currentAction.phase !== 'pick'} 
                  onClick={() => handleAction('pick')}
                >
                  SELECCIONAR
                </button>
                <button 
                  className="action-btn ban-btn" 
                  disabled={!selectedChamp || currentAction.phase !== 'ban'} 
                  onClick={() => handleAction('ban')}
                >
                  BANEAR
                </button>
              </>
            ) : draftMode === "free" && !isDraftFinished ? (
              <>
                <button 
                  className="action-btn select-btn" 
                  disabled={!selectedChamp} 
                  onClick={() => handleAction('pick')}
                >
                  SELECCIONAR
                </button>
                <button 
                  className="action-btn ban-btn" 
                  disabled={!selectedChamp} 
                  onClick={() => handleAction('ban')}
                >
                  BANEAR
                </button>
              </>
            ) : (
              <button className="action-btn ready-btn" onClick={handleGoToTacticalMap}>
                LISTO (IR AL MAPA TÁCTICO)
              </button>
            )}
          </div>

          {/* SECCIÓN ABAJO EN EL MEDIO: MODO LIBRE SIMPLIFICADO */}
          {draftMode === "free" && (
            <div className="free-mode-controls centralized-bottom-buttons" style={{ marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div className="buttons-row-grid" style={{ display: "flex", gap: "10px" }}>
                <button 
                  className={`fm-btn blue-fm ${freeModeTeam === 'blue' ? 'active' : ''}`} 
                  onClick={() => setFreeModeTeam('blue')}
                  style={{ background: "#0284c7", color: "#fff", border: freeModeTeam === 'blue' ? "2px solid #fff" : "none", padding: "8px 20px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                  EQUIPO AZUL
                </button>
                <button 
                  className={`fm-btn red-fm ${freeModeTeam === 'red' ? 'active' : ''}`} 
                  onClick={() => setFreeModeTeam('red')}
                  style={{ background: "#e11d48", color: "#fff", border: freeModeTeam === 'red' ? "2px solid #fff" : "none", padding: "8px 20px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                  EQUIPO ROJO
                </button>
                <button 
                  className="fm-btn undo-fm" 
                  onClick={handleUndoFreeMode} 
                  disabled={freeModeHistory.length === 0}
                  style={{ background: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                  DESHACER
                </button>
              </div>
              <div className="teams-labels-row" style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 40px", fontSize: "11px", fontWeight: "bold", color: "#94a3b8" }}>
                <span style={{ color: "#38bdf8" }}>SELECCIONADO: AZUL</span>
                <span style={{ color: "#fb7185" }}>SELECCIONADO: ROJO</span>
              </div>
            </div>
          )}

        </div>

        {/* EQUIPO ROJO */}
        <div className="team-column red-side">
          <div className="bans-row justify-end">
            {redBans.map((ban, i) => {
              const isActive = draftMode === "competitive" 
                ? (currentAction?.team === 'red' && currentAction?.phase === 'ban' && currentAction?.index === i)
                : (draftMode === "free" && freeModeTeam === 'red');
              return (
                <div 
                  key={`rb-${i}`} 
                  className={`ban-box ${isActive ? 'neon-active-red' : ''}`}
                  style={isActive ? { border: '2px solid #ff0055', boxShadow: '0 0 15px #ff0055' } : {}}
                >
                  {ban && <img src={ban.img} alt={ban.name} />}
                </div>
              );
            })}
          </div>
          <div className="picks-vertical">
            {redPicks.map((pick, i) => {
              const isActive = draftMode === "competitive" 
                ? (currentAction?.team === 'red' && currentAction?.phase === 'pick' && currentAction?.index === i)
                : (draftMode === "free" && freeModeTeam === 'red');
              return (
                <div 
                  key={`rp-${i}`} 
                  className={`pick-frame ${isActive ? 'neon-active-red' : ''}`}
                  style={isActive ? { border: '2px solid #ff0055', boxShadow: '0 0 15px #ff0055' } : {}}
                >
                  {pick ? <img src={pick.splash} alt={pick.name} className="splash-img" /> : <span className="empty-text">ESPERANDO</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}