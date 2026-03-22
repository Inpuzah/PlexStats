export type PlayerStats = {
  username: string;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  gamesPlayed: number;
  calculatedScore: number;
};

function hashUsername(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export async function fetchPlayerStats(username: string): Promise<PlayerStats> {
  const normalized = username.trim();
  const seed = hashUsername(normalized);

  const wins = (seed % 5000) + 100;
  const losses = (seed % 1700) + 50;
  const kills = (seed % 20000) + 300;
  const deaths = (seed % 14000) + 250;
  const gamesPlayed = wins + losses;

  return {
    username: normalized,
    wins,
    losses,
    kills,
    deaths,
    gamesPlayed,
    calculatedScore: wins * 3 + kills - deaths
  };
}
