import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  eventType: z.enum(['artwork_view','like','unlike','save','unsave','follow','unfollow','find_similar','search_result_click','purchase','commission_request']),
  artworkId: z.string().uuid().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ ok: false, reason: 'supabase_not_configured' }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, reason: 'authentication_required' }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, reason: 'invalid_request' }, { status: 400 });

  const { eventType, artworkId, metadata } = parsed.data;
  const { error } = await supabase.from('recommendation_events').insert({
    user_id: user.id,
    artwork_id: artworkId ?? null,
    event_type: eventType,
    metadata,
  });
  if (error) return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
