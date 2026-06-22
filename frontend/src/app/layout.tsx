import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/shared/Navbar'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vendere',
  description: 'Seu catálogo de vendas'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} min-h-screen`} style={{ background: 'var(--background)' }}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}