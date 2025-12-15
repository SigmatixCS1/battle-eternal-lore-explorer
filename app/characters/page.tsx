import { getAllCharacters } from '@/lib/parseCharacters';
import Link from 'next/link';
import { Character } from '@/types/character';
import ImageCarousel from '@/components/ImageCarousel';

function CharacterCard({ character, featured = false }: { character: Character; featured?: boolean }) {
  return (
    <Link
      href={`/characters/${character.character_id}`}
      className="group"
    >
      <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-lg overflow-hidden transition-all h-full ${
        featured 
          ? 'border-purple-500/50 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/50' 
          : 'border-purple-500/30 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/50'
      }`}>
        {character.images && character.images.length > 0 && (
          <div className="relative w-full h-48 bg-slate-900/50">
            <ImageCarousel
              images={character.images}
              alt={character.name}
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h2 className={`font-bold text-white mb-2 group-hover:text-purple-400 transition-colors ${
            featured ? 'text-xl' : 'text-2xl'
          }`}>
            {character.name}
          </h2>
        
        {/* Display title for antagonists, archetype for protagonists */}
        {(character.title || character.archetype) && (
          <p className="text-purple-300 text-sm mb-3 italic">
            {character.title || character.archetype}
          </p>
        )}

        {/* Display affiliation for antagonists, order_house for protagonists */}
        {(character.affiliation || character.order_house) && (
          <div className="mb-3">
            <span className={`inline-block text-xs px-3 py-1 rounded-full border ${
              character.isAntagonist 
                ? 'bg-red-500/20 text-red-300 border-red-500/50'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
            }`}>
              {character.affiliation || character.order_house}
            </span>
          </div>
        )}

        {/* Display role/specialization for antagonists */}
        {character.role && (
          <div className="mb-3">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-orange-400">Role:</span> {character.role}
            </p>
          </div>
        )}

        {/* Display gift for protagonists */}
        {character.gift && (
          <div className="mb-3">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-pink-400">Gift:</span> {character.gift}
            </p>
          </div>
        )}

        {character.divine_link && (
          <div className="mb-3">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-cyan-400">Divine Link:</span> {character.divine_link}
            </p>
          </div>
        )}

        {character.overview && (
          <p className="text-gray-400 text-sm line-clamp-3 mt-4">
            {character.overview.substring(0, 150)}...
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {character.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CharactersPage() {
  const characters = await getAllCharacters();
  
  // Separate characters by type
  const nexusQuartet = characters.filter(c => c.quartet === 'nexus');
  const aetherforgeQuartet = characters.filter(c => c.quartet === 'aetherforge');
  const otherCharacters = characters.filter(c => !c.quartet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Battle Eternal Characters
          </h1>
          <p className="text-gray-300 text-lg">
            Explore the heroes, villains, and enigmatic figures of the Battle Eternal universe
          </p>
        </header>

        {/* Nexus Quartet Section */}
        {nexusQuartet.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 px-6">
                The Nexus Quartet
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-1"></div>
            </div>
            <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
              The primary protagonists bound by divine mantles and cosmic destiny
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nexusQuartet.map((character) => (
                <CharacterCard key={character.character_id} character={character} featured />
              ))}
            </div>
          </section>
        )}

        {/* Aetherforge Quartet Section */}
        {aetherforgeQuartet.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 px-6">
                The Aetherforge Quartet
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent flex-1"></div>
            </div>
            <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
              The investigators and protectors who bridge the human and mythic realms
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aetherforgeQuartet.map((character) => (
                <CharacterCard key={character.character_id} character={character} featured />
              ))}
            </div>
          </section>
        )}

        {/* Other Characters Section */}
        {otherCharacters.length > 0 && (
          <section>
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent flex-1"></div>
              <h2 className="text-3xl font-bold text-gray-300 px-6">
                Supporting Cast
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCharacters.map((character) => (
                <CharacterCard key={character.character_id} character={character} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
