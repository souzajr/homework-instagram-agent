import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Instagram Agent - AI Content Generator',
  description: 'Generate Instagram posts and stories with AI-powered A/B testing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}