'use client'
import { RecoilRoot } from 'recoil'
import Provider from './auth/Provider'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Twitter clone',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <RecoilRoot>
      <body className={inter.className}>{children}</body>
        </RecoilRoot>
      </Provider>
    </html>
  )
}
