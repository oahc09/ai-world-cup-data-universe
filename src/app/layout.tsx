import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '绿茵数据宇宙 · World Cup Data Universe',
  description: '用 3D 交互式数据宇宙呈现世界杯 96 年历史',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
