import { getAllFactions } from '@/lib/parseFactions';
import Link from 'next/link';
import { Faction } from '@/types/faction';
import ImageCarousel from '@/components/ImageCarousel';

function FactionCard({ faction }: { faction: Faction }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'house': return 'from-blue-500 to-cyan-500';
      case 'order': return 'from-purple-500 to-pink-500';
      case 'society': return 'from-green-500 to-emerald-500';
      case 'resistance': return 'from-red-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'house': return 'border-cyan-500/30 hover:border-cyan-500';
      case 'order': return 'border-purple-500/30 hover:border-purple-500';
      case 'society': return 'border-green-500/30 hover:border-green-500';
      case 'resistance': return 'border-red-500/30 hover:border-red-500';
      default: return 'border-gray-500/30 hover:border-gray-500';
    }
  };

  const id = faction.order_id || faction.faction_id || faction.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`/factions/${id}`} className="group">
      <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-lg overflow-hidden transition-all h-full ${getCategoryBorder(faction.category)} hover:shadow-lg`}>
        {faction.images && faction.images.length > 0 && (
          <div className="relative w-full h-48 bg-slate-900/50">
            <ImageCarousel images={faction.images} alt={faction.name} className="object-cover" />
          </div>
        )}
        <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors flex-1">
            {faction.name}
          </h2>
          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(faction.category)} text-white font-semibold uppercase`}>
            {faction.category}
          </span>
        </div>

        {faction.motto && (
          <p className="text-purple-300 text-sm mb-4 italic">
            "{faction.motto}"
          </p>
        )}

        {(faction.dorm || faction.fraternity) && (
          <div className="mb-3">
            <span className="inline-block bg-slate-700/50 text-gray-300 text-xs px-3 py-1 rounded-full">
              🏛️ {faction.dorm || faction.fraternity}
            </span>
          </div>
        )}

        {faction.focus && (
          <p className="text-sm text-gray-400 mb-2">
            <span className="font-semibold text-cyan-400">Focus:</span> {faction.focus}
          </p>
        )}

        {faction.specialization && (
          <p className="text-sm text-gray-400 mb-2">
            <span className="font-semibold text-pink-400">Specialty:</span> {faction.specialization}
          </p>
        )}

        {faction.signature_beasts && faction.signature_beasts.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Signature Beasts:</p>
            <div className="flex flex-wrap gap-2">
              {faction.signature_beasts.map((beast) => (
                <span key={beast} className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/50">
                  {beast}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </Link>
  );
}

export default async function FactionsPage() {
  const factions = await getAllFactions();
  const visibleFactions = factions.filter(f => !f.hidden);
  
  const houses = visibleFactions.filter(f => f.category === 'house');
  const orders = visibleFactions.filter(f => f.category === 'order');
  const societies = visibleFactions.filter(f => f.category === 'society');
  const resistance = visibleFactions.filter(f => f.category === 'resistance');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Factions of Battle Eternal
          </h1>
          <p className="text-gray-300 text-lg">
            Houses, Orders, Societies, and Resistance Networks shaping the world
          </p>
        </header>

        {/* Orders Section */}
        {orders.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 px-6">
                The Orders
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
            </div>
            <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
              Elite organizations dedicated to specific arcane disciplines and philosophies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((faction) => (
                <FactionCard key={faction.order_id || faction.faction_id} faction={faction} />
              ))}
            </div>
          </section>
        )}

        {/* Houses Section */}
        {houses.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 px-6">
                The Houses
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
            </div>
            <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
              Noble houses with ancient traditions and mystical legacies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map((faction) => (
                <FactionCard key={faction.order_id || faction.faction_id} faction={faction} />
              ))}
            </div>
          </section>
        )}

        {/* Societies Section */}
        {societies.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 px-6">
                The Societies
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent flex-1"></div>
            </div>
            <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
              Academic and technical societies advancing specific fields of study
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {societies.map((faction) => (
                <FactionCard key={faction.order_id || faction.faction_id} faction={faction} />
              ))}
            </div>
          </section>
        )}

        {/* Resistance Section */}
        {resistance.length > 0 && (
          <section>
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 px-6">
                The Resistance
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent flex-1"></div>
            </div>
            <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
              Underground networks fighting against the Order's control
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resistance.map((faction) => (
                <FactionCard key={faction.order_id || faction.faction_id} faction={faction} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
