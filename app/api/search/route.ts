import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = String(body?.query || '').trim();

  if (!query) {
    return NextResponse.json({ error: 'Enter a description to search.' }, { status: 400 });
  }

  return NextResponse.json({
    query,
    scope: 'all_modes',
    message: 'AureVeil search is intentionally cross-mode. Once embeddings are connected, results can come from Angel, Demon, or Both regardless of the currently selected theme.'
  });
}
