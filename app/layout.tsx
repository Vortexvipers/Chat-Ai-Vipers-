export const metadata = {
  title: 'Chat AI Vipers',
  description: 'Instagram & TikTok downloader + chatbot via AI Vipers API'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{
        margin: 0,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        color: '#e5e7eb'
      }}>
        {children}
      </body>
    </html>
  )
}
