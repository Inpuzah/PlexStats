import PlayerSearchClient from '@/components/PlayerSearchClient';
import { fetchMinecraftProfile, type MinecraftProfile } from '@/lib/minecraft/fetchMinecraftProfile';

type SearchPageProps = {
  searchParams?: Promise<{ player?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialPlayer = typeof params.player === 'string' ? params.player : '';
  const normalizedPlayer = initialPlayer.trim();
  let initialProfile: MinecraftProfile | null = null;
  let initialError: string | null = null;

  if (normalizedPlayer) {
    try {
      initialProfile = await fetchMinecraftProfile(normalizedPlayer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';

      if (message === 'PLAYER_NOT_FOUND') {
        initialError = 'Minecraft player not found.';
      } else if (message === 'Username is required.') {
        initialError = 'Player username is required.';
      } else {
        initialError = 'Unable to reach Mojang profile services right now. Please try again shortly.';
      }
    }
  }

  return <PlayerSearchClient initialPlayer={initialPlayer} initialProfile={initialProfile} initialError={initialError} />;
}
