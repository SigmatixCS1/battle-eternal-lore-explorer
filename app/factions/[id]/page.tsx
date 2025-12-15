import { getAllFactions } from '@/lib/parseFactions';
import { getAllCharacters } from '@/lib/parseCharacters';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageCarousel from '@/components/ImageCarousel';
import {
  buildCharacterIndex,
  buildFactionIndex,
  createDefaultWikiLinkResolver,
  obsidianWikiLinksToAppLinks,
} from '@/lib/obsidianWikiLinksToAppLinks';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const factions = await getAllFactions();
  return factions.map((faction) => ({
    id: faction.order_id || faction.faction_id || faction.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function FactionDetailPage({ params }: Props) {
  const { id } = await params;
  const factions = await getAllFactions();
  const characters = await getAllCharacters();
  const faction = factions.find(
    (f) =>
      f.order_id === id ||
      f.faction_id === id ||
      f.name.toLowerCase().replace(/\s+/g, '-') === id
  );

  if (!faction) {
    notFound();
  }

  const resolver = createDefaultWikiLinkResolver({
    characterIndex: buildCharacterIndex(characters),
    factionIndex: buildFactionIndex(factions),
  });

  const markdown = obsidianWikiLinksToAppLinks(faction.content ?? '', resolver);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'house': return 'from-cyan-400 to-blue-500';
      case 'order': return 'from-purple-400 to-pink-500';
      case 'society': return 'from-green-400 to-emerald-500';
      case 'resistance': return 'from-red-400 to-orange-500';
      default: return 'from-gray-400 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/factions"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          ← Back to Factions
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden">
          {faction.images && faction.images.length > 0 && (
            <div className="relative w-full h-80 bg-slate-900/50">
              <ImageCarousel images={faction.images} alt={faction.name} className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none" />
            </div>
          )}
          <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${getCategoryColor(faction.category)} flex-1`}>
              {faction.name}
            </h1>
            <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(faction.category)} text-white font-semibold uppercase`}>
              {faction.category}
            </span>
          </div>

          {faction.motto && (
            <p className="text-2xl text-purple-300 italic mb-6">
              "{faction.motto}"
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {(faction.dorm || faction.fraternity) && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Location</h3>
                <p className="text-white">{faction.dorm || faction.fraternity}</p>
              </div>
            )}

            {faction.focus && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Focus</h3>
                <p className="text-white">{faction.focus}</p>
              </div>
            )}

            {faction.specialization && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Specialization</h3>
                <p className="text-white">{faction.specialization}</p>
              </div>
            )}

            {faction.status && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Status</h3>
                <p className="text-white capitalize">{faction.status}</p>
              </div>
            )}

            {faction.founding && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Founded</h3>
                <p className="text-white">{faction.founding}</p>
              </div>
            )}

            {faction.type && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Type</h3>
                <p className="text-white">{faction.type}</p>
              </div>
            )}
          </div>

          {faction.founders && faction.founders.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Founders</h3>
              <div className="flex flex-wrap gap-2">
                {faction.founders.map((founder) => (
                  <span
                    key={founder}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/50"
                  >
                    {founder}
                  </span>
                ))}
              </div>
            </div>
          )}

          {faction.signature_beasts && faction.signature_beasts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Signature Beasts</h3>
              <div className="flex flex-wrap gap-2">
                {faction.signature_beasts.map((beast) => (
                  <span
                    key={beast}
                    className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full border border-amber-500/50"
                  >
                    {beast}
                  </span>
                ))}
              </div>
            </div>
          )}

          {faction.rivalries && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Rivalries</h3>
              <p className="text-white">{faction.rivalries}</p>
            </div>
          )}

          {faction.aligned_with && (
            <div className="mb-8 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-400 mb-1">Aligned With</h3>
              <p className="text-white">{faction.aligned_with}</p>
            </div>
          )}

          {faction.opposes && (
            <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-1">Opposes</h3>
              <p className="text-white">{faction.opposes}</p>
            </div>
          )}

          {faction.tags && faction.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {faction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-700/50 text-gray-300 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-invert prose-purple max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-purple-400 mt-8 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-purple-300 mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-purple-200 mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                a: ({ node, ...props }) => <a className="text-purple-400 hover:text-purple-300 underline" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4" {...props} />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
