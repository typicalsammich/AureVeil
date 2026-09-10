import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const [events, searches] = await Promise.all([
    supabase.from('recommendation_events').delete().eq('user_id', user.id),
    supabase.from('search_history').delete().eq('user_id', user.id),
  ]);
  if (events.error || searches.error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
