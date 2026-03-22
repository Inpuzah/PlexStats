export default function HomePage() {
  const sections = ['Player Profiles', 'Game Stats', 'Leaderboards', 'Match History'];

  return (
    <div className="min-h-screen text-black relative overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] bg-[size:24px_24px]" />

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-3xl" />
      <div className="absolute top-[30%] -right-40 w-[400px] h-[400px] bg-orange-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] left-[20%] w-[450px] h-[450px] bg-orange-200/30 rounded-full blur-3xl" />

      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(135deg,black_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 border-b border-orange-200 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0">
        <h1 className="text-xl font-bold tracking-tight text-orange-600">Plexlytics</h1>

        <input
          placeholder="Search Mineplex player..."
          className="bg-white border border-orange-200 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
        />
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Plexlytics</h1>

          <p className="text-lg text-gray-600 mb-6">Mineplex Analytics Platform</p>

          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            Plexlytics is an up-coming stats tracker using Mineplex APIs. Currently in development and
            waiting for API information/documentation from Mineplex.
          </p>

          <p className="text-gray-500 mb-10">
            Check for updates for the Mineplex network here:
            <br />
            <a
              href="https://mineplex.com/"
              target="_blank"
              rel="noreferrer"
              className="text-orange-600 font-medium hover:underline"
            >
              https://mineplex.com/
            </a>
          </p>

          <div className="flex justify-center">
            <input
              placeholder="Search any player..."
              className="w-full max-w-md bg-white border border-orange-200 rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {sections.map((section) => (
          <div
            key={section}
            className="bg-white/90 backdrop-blur border border-orange-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-orange-600 mb-3">{section}</h3>

            <p className="text-gray-500 text-sm mb-6">
              This feature is currently in development and will be available once Mineplex API access is
              released.
            </p>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
              Coming Soon
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-20 text-center relative z-10">
        <h2 className="text-2xl font-semibold mb-4">Be ready when Plexlytics launches</h2>

        <p className="text-gray-500 mb-6">
          The platform is being built now so that full functionality is available immediately once Mineplex
          releases API access.
        </p>

        <button className="px-6 py-3 rounded-xl border border-orange-300 text-orange-600 hover:bg-orange-50 transition">
          Stay Updated
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-20 mb-10 text-center text-gray-400 text-sm relative z-10">
        <p className="mb-2">Mineplex stat integration is currently unavailable.</p>
        <p className="text-orange-600 font-medium">
          Plexlytics is preparing the infrastructure for future data access.
        </p>
      </div>
    </div>
  );
}
