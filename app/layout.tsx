import type { Metadata } from 'next'
import { Rajdhani, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const rajdhani = Rajdhani({
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Warframe - NEXUS',
  description: 'Real-time telemetry and utility hub',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        suppressHydrationWarning
        className={`${rajdhani.variable} ${jetbrainsMono.variable} antialiased bg-[#07070a] text-zinc-100 font-sans h-full`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}