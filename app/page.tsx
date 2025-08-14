'use client'

import { useMemo, useRef, useState } from 'react'

type VipersChat = {
  branding?: string
  response?: string
}

type VipersIG = {
  type: 'instagram_download'
  igUrl: string
  name?: string
  username?: string
  images?: string[]
  videos?: string[]
}

type VipersTT = {
  type: 'tiktok_download'
  ttUrl: string
  title?: string
  author?: string
  cover?: string
  play?: string
}

type VipersResult = VipersChat | VipersIG | VipersTT | { [k: string]: any }

export default function Page() {
  const [prompt, setPrompt] = useState('Hallo bantu saya mendownload video berikut https://www.instagram.com/reel/DK1yQjdTm0I/?igsh=MTVpMHNpOHh4dGhpeA==')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VipersResult | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const isIG = (r: VipersResult): r is VipersIG => (r as any)?.type === 'instagram_download'
  const isTT = (r: VipersResult): r is VipersTT => (r as any)?.type === 'tiktok_download'

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/vipers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal memproses permintaan')
      setResult(data)
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const helperText = useMemo(() => (
    <details style={{ opacity: 0.9 }}>
      <summary style={{ cursor: 'pointer' }}>Contoh prompt</summary>
      <ul style={{ lineHeight: 1.6 }}>
        <li>Hallo</li>
        <li>Hallo bantu saya mendownload video berikut https://www.instagram.com/reel/DK1yQjdTm0I/?igsh=MTVpMHNpOHh4dGhpeA==</li>
        <li>Hallo bantu saya mendownload video tiktok berikut https://vt.tiktok.com/ZSSwyEUrd/</li>
      </ul>
    </details>
  ), [])

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111827', display: 'grid', placeItems: 'center', boxShadow: '0 4px 24px rgba(0,0,0,.4)' }}>
          <span style={{ fontWeight: 800 }}>V</span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Chat AI Vipers</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>Instagram & TikTok downloader + Chat</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label htmlFor="prompt" style={{ fontSize: 14, opacity: 0.9 }}>Masukkan perintah / link:</label>
        <textarea
          id="prompt"
          ref={inputRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Tulis sesuatu..."
          rows={4}
          style={{
            width: '100%',
            resize: 'vertical',
            padding: 12,
            borderRadius: 12,
            border: '1px solid #374151',
            outline: 'none',
            background: '#0b1220',
            color: '#e5e7eb',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)'
          }}
        />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            style={{
              background: loading ? '#374151' : 'linear-gradient(90deg,#22d3ee,#3b82f6)',
              color: '#0b1220',
              padding: '10px 16px',
              borderRadius: 12,
              border: 'none',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'filter .2s'
            }}
            onClick={() => {
              if (!prompt.trim()) inputRef.current?.focus()
            }}
          >{loading ? 'Memproses…' : 'Kirim'}</button>
          {helperText}
        </div>
      </form>

      {error && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: '#7f1d1d', color: '#fee2e2' }}>
          {error}
        </div>
      )}

      <section style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        {!result && !loading && (
          <div style={{ opacity: 0.7 }}>Hasil akan muncul di sini.</div>
        )}

        {result && <Renderer data={result} />}
      </section>

      <footer style={{ marginTop: 48, opacity: 0.5, fontSize: 12 }}>
        <p style={{ margin: 0 }}>Powered by <strong>AI Vipers</strong> • Demo educational use</p>
      </footer>
    </main>
  )
}

function Renderer({ data }: { data: VipersResult }) {
  const isIG = (data as any)?.type === 'instagram_download'
  const isTT = (data as any)?.type === 'tiktok_download'

  if (isIG) {
    const ig = data as any as VipersIG
    return (
      <div style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>Instagram Downloader</h3>
        <p style={muted()}>Sumber: <a href={ig.igUrl} target="_blank" rel="noreferrer">{ig.igUrl}</a></p>
        {(ig.name || ig.username) && (
          <p style={{ margin: '6px 0' }}>
            {ig.name && <><strong>Nama</strong>: {ig.name} </>}
            {ig.username && <><strong>• Username</strong>: @{ig.username}</>}
          </p>
        )}
        {ig.images && ig.images.length > 0 && (
          <div style={{ display: 'grid', gap: 12 }}>
            <h4>Gambar:</h4>
            <div style={gridWrap()}>
              {ig.images.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" style={mediaThumb()}>
                  <img src={url} alt={`image-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                </a>
              ))}
            </div>
          </div>
        )}
        {ig.videos && ig.videos.length > 0 && (
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            <h4>Video:</h4>
            <div style={{ display: 'grid', gap: 12 }}>
              {ig.videos.map((url, i) => (
                <div key={i} style={videoBox()}>
                  <video controls preload="metadata" style={{ width: '100%', borderRadius: 12 }}>
                    <source src={url} />
                  </video>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <a href={url} download target="_blank" rel="noreferrer" style={btnSecondary()}>Download</a>
                    <a href={url} target="_blank" rel="noreferrer" style={btnGhost()}>Buka di tab baru</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <RawJson data={data} />
      </div>
    )
  }

  if (isTT) {
    const tt = data as any as VipersTT
    return (
      <div style={cardStyle()}>
        <h3 style={{ marginTop: 0 }}>TikTok Downloader</h3>
        <p style={muted()}>Sumber: <a href={tt.ttUrl} target="_blank" rel="noreferrer">{tt.ttUrl}</a></p>
        {(tt.title || tt.author) && (
          <p style={{ margin: '6px 0' }}>
            {tt.title && <><strong>Judul</strong>: {tt.title} </>}
            {tt.author && <><strong>• Author</strong>: @{tt.author}</>}
          </p>
        )}
        {tt.cover && (
          <div style={{ margin: '8px 0 12px' }}>
            <img src={tt.cover} alt="cover" style={{ maxWidth: '320px', width: '100%', borderRadius: 12 }} />
          </div>
        )}
        {tt.play && (
          <div style={videoBox()}>
            <video controls preload="metadata" style={{ width: '100%', borderRadius: 12 }}>
              <source src={tt.play} />
            </video>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={tt.play} download target="_blank" rel="noreferrer" style={btnSecondary()}>Download</a>
              <a href={tt.play} target="_blank" rel="noreferrer" style={btnGhost()}>Buka di tab baru</a>
            </div>
          </div>
        )}
        <RawJson data={data} />
      </div>
    )
  }

  // Default: chatbot
  const chat = data as VipersChat
  return (
    <div style={cardStyle()}>
      <h3 style={{ marginTop: 0 }}>{chat.branding || 'Vipers'}</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{chat.response || 'Tidak ada respons.'}</p>
      <RawJson data={data} />
    </div>
  )
}

function RawJson({ data }: { data: any }) {
  return (
    <details style={{ marginTop: 12 }}>
      <summary style={{ cursor: 'pointer' }}>Lihat JSON mentah</summary>
      <pre style={{
        background: '#0b1220',
        border: '1px solid #374151',
        padding: 12,
        borderRadius: 12,
        overflowX: 'auto'
      }}>{JSON.stringify(data, null, 2)}</pre>
    </details>
  )
}

// ---- inline style helpers ----
function cardStyle(): React.CSSProperties {
  return {
    background: 'rgba(17, 24, 39, 0.6)',
    border: '1px solid #374151',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,.35)'
  }
}
function muted(): React.CSSProperties { return { opacity: .8, fontSize: 14 } }
function gridWrap(): React.CSSProperties { return { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 } }
function mediaThumb(): React.CSSProperties { return { display: 'block', width: '100%', aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', border: '1px solid #374151' } }
function videoBox(): React.CSSProperties { return { display: 'grid', gap: 8 } }
function btnSecondary(): React.CSSProperties { return { background: '#10b981', color: '#031016', padding: '8px 12px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 } }
function btnGhost(): React.CSSProperties { return { border: '1px solid #374151', color: '#e5e7eb', padding: '8px 12px', borderRadius: 10, textDecoration: 'none' } }
          
