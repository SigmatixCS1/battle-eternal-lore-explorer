import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6">
            Battle Eternal
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            Lore Explorer
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mb-12">
            Dive into the dystopian world of the Hegemony, where the Order of the Black Sun 
            manipulates reality through the F-Link, and heroes awaken to their divine gifts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <Link
              href="/characters"
              className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Characters
              </h2>
              <p className="text-gray-400">
                Explore the heroes, villains, and enigmatic figures
              </p>
            </Link>

            <Link
              href="/factions"
              className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              <div className="text-5xl mb-4">🏛️</div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Factions
              </h2>
              <p className="text-gray-400">
                Explore the Houses, Orders, and Societies
              </p>
            </Link>

            <div className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 opacity-50 cursor-not-allowed">
              <div className="text-5xl mb-4">📜</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Story Arcs
              </h2>
              <p className="text-gray-400">
                Coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
