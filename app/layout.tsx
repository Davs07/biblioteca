import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { LibraryProvider } from "@/context/library-context"
import { AuthProvider } from "@/context/auth-context"
// import { ThemeProvider } from "next-themes" 
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Clasificación de Biblioteca",
  description: "Aplicación para la clasificación y gestión de libros en una biblioteca",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LibraryProvider>{children}</LibraryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

