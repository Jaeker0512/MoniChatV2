import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from 'next-themes'
import { MouseFollow } from './components/ui/mouse-follow'
import { ThemeToggle } from './components/ui/theme-toggle'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MoniChat',
  description: 'A chat application with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={['light', 'dark', 'winter', 'spring', 'summer', 'autumn']}
        >
          <AuthProvider>
            <MouseFollow />
            <ThemeToggle />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
