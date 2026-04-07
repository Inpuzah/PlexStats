type BottomSection = {
  heading: string;
  body: string;
  theme: string;
  reverse: boolean;
  accent?: 'navy';
  alignRight?: boolean;
  discord?: boolean;
};

const bottomSections: BottomSection[] = [
  {
    heading: 'Player Profiles',
    body: 'Track player performance, progression, and game-by-game trends in one place.',
    theme: 'bg-white text-zinc-800',
    reverse: false,
    accent: 'navy',
    alignRight: true
  },
  {
    heading: 'Game Stats',
    body: 'Analyze wins, losses, K/D style metrics, and historical snapshots over time.',
    theme: 'bg-[#435582] text-white',
    reverse: true
  },
  {
    heading: 'Leaderboards',
    body: 'Browse leaderboard history and compare players as soon as API data is available.',
    theme: 'bg-white text-zinc-800',
    reverse: false,
    accent: 'navy',
    alignRight: true
  },
  {
    heading: 'Discord Bot',
    body: 'PlexStats will provide a free, feature-complete Discord bot that can be added anywhere for an easy way to check stats anywhere you use Discord.',
    theme: 'bg-[#7289DA] text-white',
    reverse: true,
    discord: true
  }
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <div className="animated-grid absolute inset-0 opacity-35" />
      <div className="animated-lines absolute inset-0 opacity-20" />

      <div className="sticky top-0 relative z-30 border-b border-orange-200/80 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-orange-600">PlexStats</h1>

          <form action="/search" method="get" className="relative">
            <input
              name="player"
              placeholder="Search Mineplex player..."
              required
              className="w-64 rounded-lg border border-orange-200 bg-white/90 px-4 py-2 shadow-sm outline-none transition focus:border-orange-400"
            />
          </form>
        </div>
      </div>

      <section className="hero-clip relative z-10">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center text-white">
          <h1 className="hero-title mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            <span>PLEXSTATS</span>
          </h1>

          <p className="reveal-up max-w-xl text-orange-50/95" style={{ animationDelay: '300ms' }}>
            PlexStats is an up-coming stats tracker using Mineplex APIs. Currently in development and
            waiting for API information/documentation from Mineplex.
          </p>

          <p className="reveal-up mt-8 text-orange-100" style={{ animationDelay: '420ms' }}>
            Check for updates for the Mineplex network here:
            <br />
            <a
              href="https://mineplex.com/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white underline decoration-white/70 underline-offset-4"
            >
              https://mineplex.com/
            </a>
          </p>

          <div className="reveal-up mt-10 flex w-full justify-center" style={{ animationDelay: '520ms' }}>
            <form action="/search" method="get" className="w-full max-w-md">
              <input
                name="player"
                placeholder="Search any player..."
                required
                className="w-full rounded-xl border border-white/60 bg-white px-5 py-3 text-zinc-800 shadow-md outline-none transition focus:border-orange-300"
              />
            </form>
          </div>

          <p className="reveal-up mt-8 max-w-2xl text-orange-100" style={{ animationDelay: '620ms' }}>
            Interested in contributing? Message @Inpuzah on Discord and mention your interest!
          </p>
        </div>
      </section>

      <div className="band-stack relative z-10 mt-10">
        {bottomSections.map((section, index) => {
          const isLightText = section.theme.includes('text-white');
          const isNavyAccent = section.accent === 'navy';
          const rightAligned = Boolean(section.alignRight);

          const bodyTextClass = isNavyAccent ? 'text-[#1e3a8a]/90' : isLightText ? 'text-white/90' : 'text-zinc-600';
          const headingTextClass = isNavyAccent ? 'text-[#1e3a8a]' : isLightText ? 'text-white' : 'text-[#e85d0f]';
          const statusTextClass = isNavyAccent ? 'text-[#1e3a8a]/80' : isLightText ? 'text-white/80' : 'text-zinc-500';
          const statusDotClass = isNavyAccent ? 'bg-[#1e3a8a]/80' : isLightText ? 'bg-white/90' : 'bg-orange-400';

          return (
            <section
              key={section.heading}
              className={`band-section band-animate ${index % 2 === 0 ? 'band-rise-left' : 'band-rise-right'} ${section.theme}`}
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <div
                className={`mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 ${
                  section.reverse ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''
                }`}
              >
                <div>
                  <p className={`text-base ${bodyTextClass}`}>{section.body}</p>
                </div>

                <div className={rightAligned ? 'md:text-right' : ''}>
                  <h2 className={`text-4xl font-bold ${headingTextClass}`}>{section.heading}</h2>

                  <div className={`${rightAligned ? 'mt-3 md:justify-end' : 'mt-5'} flex items-center gap-2 text-sm ${statusTextClass}`}>
                    <div className={`h-2 w-2 rounded-full ${statusDotClass} animate-pulse`} />
                    Coming Soon
                  </div>

                  {section.discord ? (
                    <button
                      type="button"
                      aria-disabled="true"
                      className="discord-btn mt-6 inline-flex cursor-not-allowed items-center gap-3 rounded-xl bg-[#5865F2] px-6 py-3 font-medium text-white"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">◎</span>
                      Invite Bot (Coming Soon)
                    </button>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="relative z-10 mx-auto mb-10 mt-10 max-w-6xl px-6 text-center text-sm text-gray-500">
        <p className="mb-2">© 2026 PlexStats. All rights reserved.</p>
        <p className="font-medium text-orange-600">
          PlexStats is not affiliated with Mojang or Mineplex. Mojang and Mineplex are registered trademarks.
        </p>
      </div>
    </div>
  );
}
