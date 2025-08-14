# Chat AI Vipers — Next.js + Vercel

## Cara pakai (lokal)
1. `pnpm i` atau `npm i` atau `yarn`
2. `npm run dev`
3. Buka `http://localhost:3000`

## Deploy ke Vercel
1. Push repo ke GitHub
2. Import ke Vercel
3. Deploy. Tidak perlu env key.

## API yang digunakan
POST `/api/vipers` → forward ke `https://vrx-restapi.vercel.app/api/ai-vipers` dengan body `{ prompt }`.

Contoh prompt:
- `Hallo`
- `Hallo bantu saya mendownload video berikut https://www.instagram.com/reel/DK1yQjdTm0I/?igsh=MTVpMHNpOHh4dGhpeA==`
- `Hallo bantu saya mendownload video tiktok berikut https://vt.tiktok.com/ZSSwyEUrd/`
