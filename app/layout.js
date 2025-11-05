import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lizly Skin Care Clinic - Professional Dermatology & Beauty Treatments',
  description: 'Transform your skin with our expert dermatologists and advanced beauty treatments. Book your consultation today.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}