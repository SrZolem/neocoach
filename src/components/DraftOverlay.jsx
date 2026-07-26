import React, { useState, useEffect } from "react";
import "./DraftRoom.css";

const DRAFT_SEQUENCE = [
  { type: "ban", team: "blue", index: 0, label: "Ban 1 Azul" },
  { type: "ban", team: "red", index: 0, label: "Ban 1 Rojo" },
  { type: "ban", team: "blue", index: 1, label: "Ban 2 Azul" },
  { type: "ban", team: "red", index: 1, label: "Ban 2 Rojo" },
  { type: "ban", team: "blue", index: 2, label: "Ban 3 Azul" },
  { type: "ban", team: "red", index: 2, label: "Ban 3 Rojo" },

  { type: "pick", team: "blue", index: 0, label: "Pick 1 Azul" },
  { type: "pick", team: "red", index: 0, label: "Pick 1 Rojo" },
  { type: "pick", team: "red", index: 1, label: "Pick 2 Rojo" },
  { type: "pick", team: "blue", index: 1, label: "Pick 2 Azul" },
  { type: "pick", team: "blue", index: 2, label: "Pick 3 Azul" },
  { type: "pick", team: "red", index: 2, label: "Pick 3 Rojo" },

  { type: "ban", team: "red", index: 3, label: "Ban 4 Rojo" },
  { type: "ban", team: "blue", index: 3, label: "Ban 4 Azul" },
  { type: "ban", team: "red", index: 4, label: "Ban 5 Rojo" },
  { type: "ban", team: "blue", index: 4, label: "Ban 5 Azul" },

  { type: "pick", team: "red", index: 3, label: "Pick 4 Rojo" },
  { type: "pick", team: "blue", index: 3, label: "Pick 4 Azul" },
  { type: "pick", team: "blue", index: 4, label: "Pick 5 Azul" },
  { type: "pick", team: "red", index: 4, label: "Pick 5 Rojo" },
];

const RoleIcon = ({ role }) => {
  switch (role) {
    case "fighter":
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <path d="M14.59 15.41L5.41 6.23a1 1 0 0 1 0-1.41l1.41-1.41a1 1 0 0 1 1.41 0l9.18 9.18a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 0 1-1.41 0zM3.41 20.59l2.83-2.83 2.12 2.12-2.83 2.83a1 1 0 0 1-1.41 0L2 22a1 1 0 0 1 0-1.41zm17.18-18.36l-2.83 2.83-2.12-2.12 2.83-2.83a1 1 0 0 1 1.41 0l1.41 1.41a1 1 0 0 1 0 1.41z" />
        </svg>
      );
    case "mage":
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "assassin":
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <path d="M19 3L5 17l4 4L23 7l-4-4zm-2.5 7.5l-3-3L15 6l3 3-1.5 1.5z" />
        </svg>
      );
    case "tank":
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm0 18c-3.31-1.12-6-5.18-6-9.8V6.3l6-2.25 6 2.25v3.9c0 4.62-2.69 8.68-6 9.8z" />
        </svg>
      );
    case "support":
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case "marksman":
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z" />
        </svg>
      );
    default:
      return (
        <svg className="role-svg" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 0 1 4 18M12 3a15.3 15.3 0 0 0-4 18" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
};

export default function DraftRoom({ onCompleteDraft }) {
  const [draftMode, setDraftMode] = useState(null);
  const [champions, setChampions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChamp, setSelectedChamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [draftFinished, setDraftFinished] = useState(false);

  const [bluePicks, setBluePicks] = useState(Array(5).fill(null));
  const [redPicks, setRedPicks] = useState(Array(5).fill(null));
  const [blueBans, setBlueBans] = useState(Array(5).fill(null));
  const [redBans, setRedBans] = useState(Array(5).fill(null));

  useEffect(() => {
    async function loadData() {
      try {
        const vRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await vRes.json();
        const latestVer = versions[0];

        const cRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVer}/data/es_ES/champion.json`);
        const cData = await cRes.json();

        const list = Object.values(cData.data).map((c) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          tags: c.tags,
          splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
          square: `https://ddragon.leagueoflegends.com/cdn/${latestVer}/img/champion/${c.image.full}`,
        }));
        setChampions(list);
      } catch (err) {
        console.error("Error al cargar campeones:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (draftMode !== "tournament" || draftFinished) return;
    if (timeLeft <= 0) {
      handleLockIn();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, draftFinished, draftMode]);

  const currentStep = DRAFT_SEQUENCE[currentStepIndex];

  const usedChampionIds = [
    ...bluePicks.filter(Boolean).map((c) => c.id),
    ...redPicks.filter(Boolean).map((c) => c.id),
    ...blueBans.filter(Boolean).map((c) => c.id),
    ...redBans.filter(Boolean).map((c) => c.id),
  ];

  function handleSelectChampion(champ) {
    if (usedChampionIds.includes(champ.id)) return;
    setSelectedChamp(champ);
  }

  function handleLockIn() {
    if (!selectedChamp || draftFinished) return;

    if (draftMode === "tournament") {
      if (currentStep.type === "pick") {
        if (currentStep.team === "blue") {
          const u = [...bluePicks]; u[currentStep.index] = selectedChamp; setBluePicks(u);
        } else {
          const u = [...redPicks]; u[currentStep.index] = selectedChamp; setRedPicks(u);
        }
      } else {
        if (currentStep.team === "blue") {
          const u = [...blueBans]; u[currentStep.index] = selectedChamp; setBlueBans(u);
        } else {
          const u = [...redBans]; u[currentStep.index] = selectedChamp; setRedBans(u);
        }
      }

      setSelectedChamp(null);
      setTimeLeft(30);

      if (currentStepIndex + 1 < DRAFT_SEQUENCE.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setDraftFinished(true);
      }
    }
  }

  function handleAssignFreeSlot(type, team, index) {
    if (draftMode !== "free" || !selectedChamp) return;
    if (type === "pick") {
      if (team === "blue") { const u = [...bluePicks]; u[index] = selectedChamp; setBluePicks(u); }
      else { const u = [...redPicks]; u[index] = selectedChamp; setRedPicks(u); }
    } else {
      if (team === "blue") { const u = [...blueBans]; u[index] = selectedChamp; setBlueBans(u); }
      else { const u = [...redBans]; u[index] = selectedChamp; setRedBans(u); }
    }
    setSelectedChamp(null);
  }

  function handleSendToMap() {
    onCompleteDraft({ bluePicks, redPicks, blueBans, redBans });
  }

  if (!draftMode) {
    return (
      <div className="mode-selector-container">
        <h2>Elegí el modo de Draft</h2>
        <div className="mode-cards-wrapper">
          <div className="mode-card" onClick={() => setDraftMode("tournament")}>
            <div className="mode-icon">🏆</div>
            <h3>MODO TORNEO</h3>
            <p>Fase oficial de Picks & Bans con tiempo estricto (Esports Oficial).</p>
          </div>
          <div className="mode-card" onClick={() => setDraftMode("free")}>
            <div className="mode-icon">⚡</div>
            <h3>MODO LIBRE / SANDBOX</h3>
            <p>Armá composiciones sin límite de tiempo para practicar tácticas rápido.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredChampions = champions.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (selectedRole === "all") return matchesSearch;
    return matchesSearch && c.tags.map((t) => t.toLowerCase()).includes(selectedRole.toLowerCase());
  });

  return (
    <div className="draft-room-container">
      <header className="draft-header">
        <div className="team-bans blue-bans">
          {blueBans.map((ban, i) => (
            <div
              key={`bb-${i}`}
              className="ban-slot"
              onClick={() => handleAssignFreeSlot("ban", "blue", i)}
            >
              {ban && <img src={ban.square} alt={ban.name} />}
            </div>
          ))}
        </div>

        <div className="timer-box">
          <button className="change-mode-btn" onClick={() => setDraftMode(null)}>
            ⚙️ MODO
          </button>
          <div className="timer-turn">
            {draftMode === "free" ? "MODO LIBRE" : draftFinished ? "FINALIZADO" : currentStep?.label}
          </div>
          {draftMode === "tournament" && (
            <div className={`timer-count ${timeLeft <= 5 ? "warning" : ""}`}>{timeLeft}</div>
          )}
        </div>

        <div className="team-bans red-bans">
          {redBans.map((ban, i) => (
            <div
              key={`rb-${i}`}
              className="ban-slot"
              onClick={() => handleAssignFreeSlot("ban", "red", i)}
            >
              {ban && <img src={ban.square} alt={ban.name} />}
            </div>
          ))}
        </div>
      </header>

      <div className="draft-main">
        {/* LADO AZUL */}
        <div className="team-column blue-team">
          <h2 className="team-title">BLUE SIDE</h2>
          {bluePicks.map((pick, i) => (
            <div
              key={`bp-${i}`}
              className={`pick-card ${pick ? "locked" : ""}`}
              onClick={() => handleAssignFreeSlot("pick", "blue", i)}
            >
              {pick ? (
                <>
                  <img src={pick.square} alt={pick.name} className="pick-img" />
                  <div className="champ-info">
                    <span className="champ-name">{pick.name}</span>
                  </div>
                </>
              ) : (
                <div className="empty-slot">PICK {i + 1}</div>
              )}
            </div>
          ))}
        </div>

        {/* SELECTOR CENTRAL */}
        <div className="center-picker">
          <div className="picker-controls">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="champ-search-input"
            />
            
            <div className="role-filters">
              {["all", "fighter", "mage", "assassin", "tank", "support", "marksman"].map((role) => (
                <button
                  key={role}
                  className={`role-btn ${selectedRole === role ? "active" : ""}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <RoleIcon role={role} />
                  <span className="role-text">{role.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="champions-grid">
            {filteredChampions.map((champ) => {
              const isUsed = usedChampionIds.includes(champ.id);
              const isSelected = selectedChamp?.id === champ.id;
              return (
                <div
                  key={champ.id}
                  className={`champ-grid-card ${isUsed ? "disabled" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectChampion(champ)}
                >
                  <img src={champ.square} alt={champ.name} />
                  <span>{champ.name}</span>
                </div>
              );
            })}
          </div>

          {draftMode === "tournament" ? (
            <button
              className={`lock-in-btn ${selectedChamp ? "ready" : ""}`}
              disabled={!selectedChamp || draftFinished}
              onClick={handleLockIn}
            >
              LOCK IN
            </button>
          ) : null}

          <button className="export-map-btn" onClick={handleSendToMap}>
            🗺️ IR AL MAPA TÁCTICO CON ESTA COMPOSICIÓN
          </button>
        </div>

        {/* LADO ROJO */}
        <div className="team-column red-team">
          <h2 className="team-title">RED SIDE</h2>
          {redPicks.map((pick, i) => (
            <div
              key={`rp-${i}`}
              className={`pick-card ${pick ? "locked" : ""}`}
              onClick={() => handleAssignFreeSlot("pick", "red", i)}
            >
              {pick ? (
                <>
                  <img src={pick.square} alt={pick.name} className="pick-img" />
                  <div className="champ-info">
                    <span className="champ-name">{pick.name}</span>
                  </div>
                </>
              ) : (
                <div className="empty-slot">PICK {i + 1}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}