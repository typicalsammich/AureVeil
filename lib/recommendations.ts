import type { Artwork } from '@/lib/demo-data';
import { createClient } from '@/lib/supabase/server';

type RecEvent = {
  event_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type SearchRow = { query: string; created_at: string };

const EVENT_WEIGHTS: Record<string, number> = {
  purchase: 10,
  commission_request: 9,
  save: 7,
  like: 5,
  find_similar: 5,
  follow: 4,
  artwork_view: 2,
  search_result_click: 2,
  search: 1,
};

function addTerms(target: Map<string, number>, raw: unknown, weight: number) {
  if (!raw) return;
  const values = Array.isArray(raw) ? raw : [raw];
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const phrases = [value, ...value.toLowerCase().split(/[^a-z0-9]+/g)].filter(x => x.length > 2);
    for (const phrase of phrases) target.set(phrase.toLowerCase(), (target.get(phrase.toLowerCase()) ?? 0) + weight);
  }
}

function scoreArtwork(art: Artwork, interests: Map<string, number>) {
  const haystack = `${art.title} ${art.artist} ${art.category} ${art.medium} ${art.style}`.toLowerCase();
  let score = 0;
  for (const [term, weight] of interests) if (haystack.includes(term)) score += weight;
  return score;
}

export async function rememberSearch(query: string) {
  const clean = query.trim().slice(0, 300);
  if (!clean) return;
  const supabase = await createClient();
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await Promise.all([
    supabase.from('search_history').insert({ user_id: user.id, query: clean }),
    supabase.from('recommendation_events').insert({
      user_id: user.id,
      event_type: 'search',
      metadata: { query: clean },
    }),
  ]);
}

export async function personalizeArtworks(artworks: Artwork[]) {
  const supabase = await createClient();
  if (!supabase) return artworks;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return artworks;

  const [{ data: events }, { data: searches }, { data: prefs }] = await Promise.all([
    supabase.from('recommendation_events').select('event_type,metadata,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(250),
    supabase.from('search_history').select('query,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(80),
    supabase.from('user_preferences').select('interests,goals,personalization_enabled').eq('user_id', user.id).maybeSingle(),
  ]);

  if (prefs?.personalization_enabled === false) return artworks;

  const interests = new Map<string, number>();
  const now = Date.now();
  const freshness = (date: string) => Math.max(0.25, Math.exp(-(now - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 45)));

  for (const row of (searches ?? []) as SearchRow[]) addTerms(interests, row.query, 1.5 * freshness(row.created_at));
  for (const event of (events ?? []) as RecEvent[]) {
    const base = EVENT_WEIGHTS[event.event_type] ?? 1;
    const weight = base * freshness(event.created_at);
    const m = event.metadata ?? {};
    addTerms(interests, m.query, weight);
    addTerms(interests, m.category, weight);
    addTerms(interests, m.style, weight);
    addTerms(interests, m.medium, weight * 0.7);
    addTerms(interests, m.subject, weight);
    addTerms(interests, m.tags, weight);
    addTerms(interests, m.artist, weight * 0.8);
  }
  addTerms(interests, prefs?.interests, 4);
  addTerms(interests, prefs?.goals, 1);

  if (!interests.size) return artworks;
  return artworks
    .map((art, index) => ({ art, index, score: scoreArtwork(art, interests) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(x => x.art);
}
