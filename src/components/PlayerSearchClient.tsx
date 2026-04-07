'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import PlayerSkinViewer from '@/components/PlayerSkinViewer';
import type { MinecraftProfile } from '@/lib/minecraft/fetchMinecraftProfile';

const DEBUG_SEARCH = process.env.NODE_ENV !== 'production';

function searchLog(message: string, details?: Record<string, unknown>) {
  if (!DEBUG_SEARCH) {
    return;
  }

  if (details) {
    console.info('[search-client]', message, details);
    return;
  }

  console.info('[search-client]', message);
}

type ProfileResponse = {
  source: 'mojang';
  data: {
    username: string;
    uuid: string;
    skinUrl: string;
    capeUrl: string | null;
  };
};

type PlayerSearchClientProps = {
  initialPlayer: string;
  initialProfile: MinecraftProfile | null;
  initialError: string | null;
};

export default function PlayerSearchClient({ initialPlayer, initialProfile, initialError }: PlayerSearchClientProps) {
  const [username, setUsername] = useState(initialPlayer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [profile, setProfile] = useState<ProfileResponse['data'] | null>(initialProfile);

  const loadProfile = useCallback(async (playerName: string) => {
    const startedAt = performance.now();
    searchLog('loadProfile started', { playerName });

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const response = await fetch(`/api/profile/${encodeURIComponent(playerName)}`, {
        method: 'GET',
        cache: 'no-store'
      });

      searchLog('api response received', {
        playerName,
        status: response.status
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Unable to fetch profile right now.');
      }

      const payload = (await response.json()) as ProfileResponse;
      setProfile(payload.data);
      searchLog('loadProfile succeeded', {
        playerName,
        username: payload.data.username,
        durationMs: Math.round(performance.now() - startedAt)
      });
    } catch (fetchError) {
      searchLog('loadProfile failed', {
        playerName,
        error: fetchError instanceof Error ? fetchError.message : 'UNKNOWN_ERROR',
        durationMs: Math.round(performance.now() - startedAt)
      });
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to fetch profile right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUsername(initialPlayer);
    setProfile(initialProfile);
    setError(initialError);
  }, [initialPlayer, initialProfile, initialError]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = username.trim();

    searchLog('submit clicked', {
      raw: username,
      normalized
    });

    if (!normalized) {
      setError('Please enter a username.');
      setProfile(null);
      return;
    }

    await loadProfile(normalized);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <div className="animated-grid absolute inset-0 opacity-35" />
      <div className="animated-lines absolute inset-0 opacity-20" />

      <div className="sticky top-0 relative z-30 border-b border-orange-200/80 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-orange-600">
            PlexStats
          </Link>
          <form action="/search" method="get" onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
            <input
              name="player"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Search Minecraft player..."
              className="w-full rounded-lg border border-orange-200 bg-white/90 px-4 py-2.5 text-zinc-800 outline-none transition focus:border-orange-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <section className="hero-clip relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-16 text-white md:py-20">
          <h1 className="hero-title text-4xl font-extrabold tracking-tight md:text-5xl">
            <span>PLAYER SEARCH</span>
          </h1>
          <p className="reveal-up mt-4 max-w-3xl text-orange-50/95" style={{ animationDelay: '220ms' }}>
            Enter a username to load UUID and skin. Mineplex stats coming soon!
          </p>
          {error ? (
            <div className="reveal-up mt-6 max-w-3xl rounded-xl border border-red-300/90 bg-red-50 px-4 py-3 text-sm text-red-700" style={{ animationDelay: '320ms' }}>
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        {profile ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-sm">
              <h2 className="text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">{profile.username}</h2>
              <div className="mt-5">
                <PlayerSkinViewer
                  skinUrl={profile.skinUrl}
                  username={profile.username}
                  uuid={profile.uuid}
                />
              </div>
              <p className="mt-3 text-xs text-zinc-500">UUID: {profile.uuid}</p>
            </article>

            <article className="rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">Mineplex Stats</h2>
              <p className="mt-3 text-zinc-600">Mineplex Stats not available.</p>
            </article>
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-zinc-300 bg-white/90 p-8 text-sm text-zinc-600 shadow-sm">
            Enter a username above to load profile details and preview the animated 3D model.
          </section>
        )}
      </section>
    </div>
  );
}
