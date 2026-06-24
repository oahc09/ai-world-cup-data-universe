import './globals.css'
import type { Metadata, Viewport } from 'next'

const SITE_URL = 'https://world-cup-data-universe.app'
const TITLE = '绿茵数据宇宙 · World Cup Data Universe'
const DESCRIPTION = '用 3D 交互式数据宇宙呈现世界杯 96 年历史 — 旋转、缩放、点击，在星空中探索每一届世界杯。'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['世界杯', 'World Cup', '2026', '3D 可视化', 'Three.js', '足球历史', '数据可视化'],
  authors: [{ name: '绿茵数据宇宙' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: '绿茵数据宇宙',
    images: [{ url: '/og-image.jpg', width: 1024, height: 576, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
