// 1. DICCIONARIO CON NOMBRES Y CLASES NATIVAS DE RIOT
const CHAMPION_ROLE_MAP = {
  top: [
    "aatrox", "akali", "camille", "chogath", "darius", "drmundo", "fiora", "gangplank", 
    "garen", "gnar", "gragas", "gwen", "illaoi", "irelia", "jax", "jayce", "kled", 
    "ksante", "malphite", "mordekaiser", "nasus", "olaf", "ornn", "pantheon", "poppy", 
    "quinn", "renekton", "riven", "rumble", "ryze", "sett", "shen", "singed", 
    "sion", "tahmkench", "teemo", "trundle", "tryndamere", "urgot", "vayne", 
    "volibear", "yorick", "yone", "warwick", "ambessa",
    "fighter", "tank" // Soporte para tags de Riot
  ],
  jungle: [
    "amumu", "belveth", "briar", "diana", "ekko", "elise", "fiddlesticks", "gragas", 
    "graves", "hecarim", "ivern", "jarvaniv", "jax", "karthus", "kayn", "khazix", 
    "kindred", "leesin", "lillia", "masteryi", "nidalee", "nocturne", "nunu", "pantheon", 
    "poppy", "rammus", "reksai", "rengar", "sejuani", "shaco", "shyvana", "skarner", 
    "taliyah", "trundle", "udyr", "vi", "viego", "volibear", "warwick", "xinzhao", "zac"
  ],
  mid: [
    "ahri", "akali", "akshan", "anivia", "annie", "aurelionsol", "azir", "cassiopeia", 
    "corki", "diana", "ekko", "fizz", "galio", "hwei", "irelia", "kassadin", "katarina", 
    "leblanc", "lissandra", "lux", "malzahar", "naafiri", "neeko", "orianna", 
    "qiyana", "ryze", "sylas", "syndra", "taliyah", "talon", "twistedfate", "veigar", 
    "velkoz", "viktor", "vladimir", "xerath", "yasuo", "yone", "zed", "zoe",
    "mage", "assassin" // Soporte para tags de Riot
  ],
  bot: [
    "aphelios", "ashe", "caitlyn", "draven", "ezreal", "hwei", "jhin", "jinx", "kaisa", 
    "kalista", "kogmaw", "lucian", "missfortune", "nilah", "samira", "sivir", 
    "smolder", "tristana", "twitch", "varus", "vayne", "xayah", "zeri", "ziggs",
    "marksman" // Soporte para tags de Riot
  ],
  support: [
    "alistar", "bard", "blitzcrank", "brand", "braum", "hwei", "janna", "karma", "leona", 
    "lulu", "lux", "milio", "morgana", "nami", "nautilus", "pantheon", "pyke", 
    "rakan", "rell", "renata", "senna", "seraphine", "sona", "soraka", "swain", 
    "taric", "thresh", "velkoz", "xerath", "yuumi", "zilean", "zyra",
    "support" // Soporte para tags de Riot
  ]
};

// 2. FILTRADO ULTRA-COMPATIBLE
const listToDisplay = sourceArray.filter((champ) => {
  const champNameNorm = normalize(champ.name);
  const champIdNorm = normalize(champ.id);
  const champKeyNorm = normalize(champ.key);

  // Filtro de Búsqueda
  const searchNorm = normalize(champSearch);
  if (searchNorm) {
    const matchSearch =
      champNameNorm.includes(searchNorm) ||
      champIdNorm.includes(searchNorm) ||
      champKeyNorm.includes(searchNorm);
    if (!matchSearch) return false;
  }

  // Filtro por Rol
  if (selectedRole === "all") return true;

  const allowedRoleList = CHAMPION_ROLE_MAP[selectedRole] || [];

  // Match 1: Coincidencia por Nombre/ID/Key
  const isDirectMatch =
    allowedRoleList.includes(champNameNorm) ||
    allowedRoleList.includes(champIdNorm) ||
    allowedRoleList.includes(champKeyNorm);

  if (isDirectMatch) return true;

  // Match 2: Coincidencia por Tags/Clases de Riot (Fighter, Mage, Marksman, etc.)
  const champTags = champ.tags || champ.roles || champ.lanes || [];
  return champTags.some((tag) => allowedRoleList.includes(normalize(tag)));
});