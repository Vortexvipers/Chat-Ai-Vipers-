import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    if (!body || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong' }, { status: 400 })
    }

    const upstream = await fetch('https://vrx-restapi.vercel.app/api/ai-vipers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: body.prompt }),
      cache: 'no-store'
    })

    const data = await upstream.json().catch(() => null)

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Gagal dari upstream', detail: data }, { status: upstream.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Kesalahan server', detail: String(err?.message || err) }, { status: 500 })
  }
}
