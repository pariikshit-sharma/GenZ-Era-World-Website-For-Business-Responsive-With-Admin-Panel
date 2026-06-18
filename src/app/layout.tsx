import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'GenZ Era World | Premium Action Figures, Sneakers & Collectibles',
  description: 'Not your average pop culture store. Premium action figures, sneakers, apparel & collectibles. By Kabir Luthra.',
  keywords: 'action figures, sneakers, apparel, collectibles, pop culture, anime, marvel, dc, genzera',
  openGraph: {
    title: 'GenZ Era World',
    description: 'Not your average pop culture store. Premium action figures, sneakers, apparel & collectibles.',
    url: 'https://genzeraworld.vercel.app',
    siteName: 'GenZ Era World',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenZ Era World',
    description: 'Not your average pop culture store.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#13131f',
              color: '#fff',
              border: '1px solid #1e1e30',
            },
            success: {
              iconTheme: {
                primary: '#7c3aed',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
