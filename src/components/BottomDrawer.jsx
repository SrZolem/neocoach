import React from "react";

// Importa tus imágenes locales de roles
import fillIcon from "../assets/roles/fill.png";
import topIcon from "../assets/roles/top.png";
import jungleIcon from "../assets/roles/jungle.png";
import midIcon from "../assets/roles/middle.png";
import adcIcon from "../assets/roles/bottom.png";
import supportIcon from "../assets/roles/support.png";

// Importa tus imágenes locales de objetivos y súbditos (.webp) desde la carpeta assets
import larvasIcon from "../assets/objetives/Larvas.webp";
import minionCanonIcon from "../assets/objetives/Minion canon.webp";
import minionMagoIcon from "../assets/objetives/Minion mago.webp";
import minionMeleIcon from "../assets/objetives/Minion mele.webp";
import superMinionIcon from "../assets/objetives/Super minion.webp";

// Importa tus imágenes locales de súbditos Rojos
import minionMeleRedIcon from "../assets/objetives/Minion mele rojo.webp";
import minionMagoRedIcon from "../assets/objetives/Minion mago rojo.webp";
import minionCanonRedIcon from "../assets/objetives/Minion canon rojo.webp";
import superMinionRedIcon from "../assets/objetives/Super minion rojo.webp";

const OBJECTIVES_LIST = [
  { 
    id: "baron", 
    name: "Barón Nashor", 
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/baron-100.png" 
  },
  { 
    id: "dragon", 
    name: "Dragón", 
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/dragon-100.png" 
  },
  { 
    id: "herald", 
    name: "Heraldo", 
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/herald-100.png" 
  },
  { 
    id: "voidling", 
    name: "Larva del Vacío", 
    icon: larvasIcon 
  },
  { 
    id: "turret_blue", 
    name: "Torre Azul", 
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/tower-100.png" 
  },
  { 
    id: "turret_red", 
    name: "Torre Roja", 
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/tower-200.png" 
  },
  // Súbditos Azules
  { 
    id: "minion_meley", 
    name: "Minion Melé (Azul)", 
    icon: minionMeleIcon 
  },
  { 
    id: "minion_caster", 
    name: "Minion Mago (Azul)", 
    icon: minionMagoIcon 
  },
  { 
    id: "minion_siege", 
    name: "Minion Cañón (Azul)", 
    icon: minionCanonIcon 
  },
  { 
    id: "minion_super", 
    name: "Súper Minion (Azul)", 
    icon: superMinionIcon 
  },
  // Súbditos Rojos
  { 
    id: "minion_meley_red", 
    name: "Minion Melé (Rojo)", 
    icon: minionMeleRedIcon 
  },
  { 
    id: "minion_caster_red", 
    name: "Minion Mago (Rojo)", 
    icon: minionMagoRedIcon 
  },
  { 
    id: "minion_siege_red", 
    name: "Minion Cañón (Rojo)", 
    icon: minionCanonRedIcon 
  },
  { 
    id: "minion_super_red", 
    name: "Súper Minion (Rojo)", 
    icon: superMinionRedIcon 
  },
  { 
    id: "ward_yellow", 
    name: "Ward Centinela", 
    icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3340.png" 
  },
  { 
    id: "ward_control", 
    name: "Control Ward", 
    icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/2055.png" 
  },
  { 
    id: "ward_blue", 
    name: "Ward Azul", 
    icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3363.png" 
  },
];

const RoleIcon = ({ role, active }) => {
  const iconMap = {
    all: fillIcon,
    top: topIcon,
    jungle: jungleIcon,
    mid: midIcon,
    adc: adcIcon,
    support: supportIcon
  };

  return (
    <img 
      src={iconMap[role]} 
      alt={role}
      draggable="false"
      style={{ 
        width: "20px", 
        height: "20px", 
        filter: active ? "drop-shadow(0 0 2px #c8aa6e) brightness(1.2)" : "grayscale(80%) opacity(0.6)",
        display: "block" 
      }} 
    />
  );
};

const ROLE_META_CHAMPIONS = {
  top: [
    "Aatrox", "Camille", "Darius", "Fiora", "Gangplank", "Garen", "Gnar", "Gragas", "Gwen", "Illaoi", 
    "Irelia", "Jax", "Jayce", "KSante", "Kayle", "Kennen", "Malphite", "Mordekaiser", "Nasus", "Ornn", 
    "Pantheon", "Quinn", "Renekton", "Riven", "Rumble", "Sett", "Shen", "Singed", "Sion", "Teemo", 
    "Tryndamere", "Urgot", "Vayne", "Vladimir", "Volibear", "Wukong", "Yasuo", "Yone", "Yorick"
  ],
  jungle: [
    "Amumu", "BelVeth", "Brand", "Diana", "Ekko", "Elise", "Evelynn", "Fiddlesticks", "Graves", "Gwen", 
    "Hecarim", "Ivern", "JarvanIV", "Karthus", "Kayn", "KhaZix", "Kindred", "LeeSin", "Lillia", "MasterYi", 
    "Nidalee", "Nocturne", "Nunu", "Olaf", "Poppy", "Rammus", "RekSai", "Rengar", "Sejuani", "Shaco", 
    "Shyvana", "Skarner", "Taliyah", "Talon", "Trundle", "Udyr", "Vi", "Viego", "Volibear", "Warwick", 
    "XinZhao", "Zac", "Zed"
  ],
  mid: [
    "Ahri", "Akali", "Akshan", "Anivia", "Annie", "AurelionSol", "Aurora", "Azir", "Cassiopeia", "Corki", 
    "Diana", "Ekko", "Fizz", "Galio", "Hwei", "Irelia", "Jayce", "Kassadin", "Katarina", "Leblanc", 
    "Lissandra", "Lux", "Malzahar", "Naafiri", "Neeko", "Orianna", "Pantheon", "Qiyana", "Ryze", "Swain", 
    "Sylas", "Syndra", "Taliyah", "Talon", "TwistedFate", "Veigar", "Vex", "Viktor", "Vladimir", "Xerath", 
    "Yasuo", "Yone", "Zed", "Ziggs", "Zoe"
  ],
  adc: [
    "Aphelios", "Ashe", "Caitlyn", "Draven", "Ezreal", "Jhin", "Jinx", "Kaisa", "Kalista", "KogMaw", 
    "Lucian", "MissFortune", "Nilah", "Samira", "Senna", "Sivir", "Smolder", "Tristana", "Twitch", "Varus", 
    "Vayne", "Xayah", "Zeri"
  ],
  support: [
    "Alistar", "Bard", "Blitzcrank", "Brand", "Braum", "Janna", "Karma", "Leona", "Lulu", "Lux", 
    "Milio", "Morgana", "Nami", "Nautilus", "Pantheon", "Pyke", "Rakan", "Rell", "Renata", "Senna", 
    "Seraphine", "Sona", "Soraka", "Swain", "TahmKench", "Taric", "Thresh", "VelKoz", "Xerath", "Yuumi", 
    "Zilean", "Zyra"
  ]
};

export default function BottomDrawer({
  champions,
  champSearch,
  setChampSearch,
  selectedRole,
  setSelectedRole,
  selectedTeam,
  setSelectedTeam,
  activeBottomTab,
  setActiveBottomTab,
  isDrawerOpen,
  setIsDrawerOpen,
  onStartExternalDrag,
}) {
  const filteredChampions = champions.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(champSearch.toLowerCase());
    if (selectedRole === "all") return matchesSearch;

    const allowedList = ROLE_META_CHAMPIONS[selectedRole] || [];
    const matchesRole = allowedList.includes(c.id);

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ position: "absolute", bottom: "45px", left: 0, right: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
      
      <div style={{ display: "flex", gap: "8px", pointerEvents: "auto", marginBottom: "-1px" }}>
        <button 
          onClick={() => {
            if (activeBottomTab === "champions") {
              setIsDrawerOpen(!isDrawerOpen);
            } else {
              setActiveBottomTab("champions");
              setIsDrawerOpen(true);
            }
          }}
          style={{ 
            background: "#090d16", 
            color: activeBottomTab === "champions" && isDrawerOpen ? "#f0e6d2" : "#785a28", 
            border: "1px solid #1e293b", 
            borderBottom: activeBottomTab === "champions" && isDrawerOpen ? "1px solid #090d16" : "1px solid #1e293b",
            padding: "5px 16px", 
            borderRadius: "6px 6px 0 0", 
            cursor: "pointer", 
            fontWeight: "700", 
            fontSize: "11px",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.4)"
          }}
        >
          <span style={{ color: "#c8aa6e" }}>⚔️</span> CAMPEONES <span style={{ fontSize: "9px" }}>{activeBottomTab === "champions" && isDrawerOpen ? "▼" : "▲"}</span>
        </button>

        <button 
          onClick={() => {
            if (activeBottomTab === "objectives") {
              setIsDrawerOpen(!isDrawerOpen);
            } else {
              setActiveBottomTab("objectives");
              setIsDrawerOpen(true);
            }
          }}
          style={{ 
            background: "#090d16", 
            color: activeBottomTab === "objectives" && isDrawerOpen ? "#f0e6d2" : "#785a28", 
            border: "1px solid #1e293b", 
            borderBottom: activeBottomTab === "objectives" && isDrawerOpen ? "1px solid #090d16" : "1px solid #1e293b",
            padding: "5px 16px", 
            borderRadius: "6px 6px 0 0", 
            cursor: "pointer", 
            fontWeight: "700", 
            fontSize: "11px",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.4)"
          }}
        >
          <span style={{ color: "#c8aa6e" }}>🛡️</span> OBJETIVOS Y UNIDADES <span style={{ fontSize: "9px" }}>{activeBottomTab === "objectives" && isDrawerOpen ? "▼" : "▲"}</span>
        </button>
      </div>

      <div 
        style={{ 
          width: "96%", 
          maxWidth: "1350px",
          background: "#090d16", 
          border: "1px solid #c8aa6e", 
          borderRadius: "10px 10px 0 0", 
          boxShadow: "0 -12px 35px rgba(0,0,0,0.8)",
          pointerEvents: "auto",
          transition: "all 0.25s ease-in-out",
          maxHeight: isDrawerOpen ? "150px" : "0px",
          opacity: isDrawerOpen ? 1 : 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box"
        }}
      >
        {activeBottomTab === "champions" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 14px", borderBottom: "1px solid #1e293b", background: "#05080e" }}>
            
            <div style={{ display: "flex", background: "#111827", borderRadius: "6px", padding: "2px", border: "1px solid #1f2937" }}>
              <button 
                onClick={() => setSelectedTeam("blue")}
                style={{ background: selectedTeam === "blue" ? "#0284c7" : "transparent", color: "#fff", border: "none", padding: "3px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}
              >
                Azul
              </button>
              <button 
                onClick={() => setSelectedTeam("red")}
                style={{ background: selectedTeam === "red" ? "#e11d48" : "transparent", color: "#fff", border: "none", padding: "3px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}
              >
                Rojo
              </button>
            </div>

            <div style={{ display: "flex", gap: "4px", background: "#0b101b", padding: "3px 6px", borderRadius: "4px", border: "1px solid #1e293b", alignItems: "center" }}>
              {[
                { id: "all", label: "Todos" },
                { id: "top", label: "Top" },
                { id: "jungle", label: "Jungla" },
                { id: "mid", label: "Mid" },
                { id: "adc", label: "ADC" },
                { id: "support", label: "Soporte" }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  title={role.label}
                  style={{
                    background: selectedRole === role.id ? "linear-gradient(180deg, #1f242d 0%, #11151d 100%)" : "transparent",
                    border: selectedRole === role.id ? "1px solid #c8aa6e" : "1px solid transparent",
                    borderRadius: "4px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: "4px",
                    boxShadow: selectedRole === role.id ? "inset 0 0 6px rgba(200, 170, 110, 0.3)" : "none",
                    transition: "all 0.15s ease"
                  }}
                >
                  <RoleIcon role={role.id} active={selectedRole === role.id} />
                </button>
              ))}
            </div>

            <input 
              type="text" 
              placeholder="Buscar campeón..." 
              value={champSearch}
              onChange={(e) => setChampSearch(e.target.value)}
              style={{ background: "#111827", color: "#f0e6d2", border: "1px solid #c8aa6e", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", outline: "none", width: "170px" }}
            />
          </div>
        )}

        <div 
          style={{ 
            padding: "8px 14px", 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center", 
            gap: "10px", 
            overflowX: "auto", 
            overflowY: "hidden", 
            maxHeight: "105px",
            scrollbarWidth: "thin",
            scrollbarColor: "#c8aa6e #090d16"
          }}
          className="custom-gold-scrollbar"
        >
          <style>{`
            .custom-gold-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-gold-scrollbar::-webkit-scrollbar-track {
              background: #05080e;
              border-radius: 4px;
              border: 1px solid #1e293b;
            }
            .custom-gold-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #c8aa6e 0%, #785a28 100%);
              border-radius: 4px;
              border: 1px solid #f0e6d2;
            }
            .custom-gold-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #f0e6d2 0%, #c8aa6e 100%);
            }
          `}</style>

          {activeBottomTab === "champions" ? (
            filteredChampions.length > 0 ? (
              filteredChampions.map((champ) => (
                <div
                  key={champ.id}
                  onMouseDown={(e) => onStartExternalDrag(e, champ, "champion", selectedTeam)}
                  title={`Arrastrar ${champ.name} (${selectedTeam.toUpperCase()})`}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "grab",
                    border: `2px solid ${selectedTeam === "red" ? "#e11d48" : "#0284c7"}`,
                    background: "#111827",
                    flexShrink: 0,
                    transition: "transform 0.1s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <img src={champ.image} alt={champ.name} width="52" height="52" draggable="false" style={{ display: "block" }} />
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", fontSize: "12px", padding: "6px" }}>No se encontraron campeones para este rol.</div>
            )
          ) : (
            OBJECTIVES_LIST.map((obj) => (
              <div
                key={obj.id}
                onMouseDown={(e) => onStartExternalDrag(e, obj, "objective", null)}
                title={`Arrastrar ${obj.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#111827",
                  border: "1px solid #c8aa6e",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "grab",
                  height: "38px",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#1e293b"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1e293b"}
              >
                <img src={obj.icon} alt={obj.name} width="24" height="24" draggable="false" />
                <span style={{ color: "#f0e6d2", fontSize: "12px", whiteSpace: "nowrap" }}>{obj.name}</span>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}