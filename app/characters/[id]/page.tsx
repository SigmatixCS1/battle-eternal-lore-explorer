import { getAllCharacters } from '@/lib/parseCharacters';
import { getAllFactions } from '@/lib/parseFactions';
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
  const characters = await getAllCharacters();
  return characters.map((character) => ({
    id: character.character_id,
  }));
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const characters = await getAllCharacters();
  const factions = await getAllFactions();
  const character = characters.find((c) => c.character_id === id);

  if (!character) {
    notFound();
  }

  const resolver = createDefaultWikiLinkResolver({
    characterIndex: buildCharacterIndex(characters),
    factionIndex: buildFactionIndex(factions),
  });

  const markdown = obsidianWikiLinksToAppLinks(character.content ?? '', resolver);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/characters"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          ← Back to Characters
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden">
          {character.images && character.images.length > 0 && (
            <div className="relative w-full h-96 bg-slate-900/50">
              <ImageCarousel
                images={character.images}
                alt={character.name}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none" />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              {character.name}
            </h1>

          {character.archetype && (
            <p className="text-2xl text-purple-300 italic mb-6">
              {character.archetype}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {character.order_house && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Order House</h3>
                <p className="text-white">{character.order_house}</p>
              </div>
            )}

            {character.dorm && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Dorm</h3>
                <p className="text-white">{character.dorm}</p>
              </div>
            )}

            {character.gift && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Gift</h3>
                <p className="text-white">{character.gift}</p>
              </div>
            )}

            {character.divine_link && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Divine Link</h3>
                <p className="text-white">{character.divine_link}</p>
              </div>
            )}

            {character.status && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Status</h3>
                <p className="text-white capitalize">{character.status}</p>
              </div>
            )}
          </div>

          {character.tags && character.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {character.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/50"
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
