import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Komivox - Baca Manga Online Gratis',
  description: 'Platform baca manga online terlengkap dengan update terbaru setiap hari. Temukan ribuan judul manga favorit Anda di Komivox.',
  keywords: 'manga, komik, baca manga, manga online, komik indonesia',
  authors: [{ name: 'Komivox Team' }],
  creator: 'Komivox',
  publisher: 'Komivox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Komivox - Baca Manga Online Gratis',
    description: 'Platform baca manga online terlengkap dengan update terbaru setiap hari.',
    url: 'https://komivox.vercel.app',
    siteName: 'Komivox',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komivox - Baca Manga Online Gratis',
    description: 'Platform baca manga online terlengkap dengan update terbaru setiap hari.',
    creator: '@komivox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        {children}
      </body>
    </html>
  )
}
