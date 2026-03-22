import { Countdown } from '@/components/Countdown';

export default function HomePage() {
  return (
    <>
      <main className="page">
        <section className="card" aria-labelledby="title">
          <p className="badge">Coming Soon</p>
          <h1 id="title">Mineplex Stats Tracking</h1>
          <p className="subtitle">
            We’re building a fast, simple way to track Mineplex player stats, trends, and leaderboards.
          </p>

          <Countdown />

          <p className="note">
            Launch target: <strong>Summer 2026</strong>
          </p>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Mineplex Stats. All rights reserved.</p>
      </footer>
    </>
  );
}
