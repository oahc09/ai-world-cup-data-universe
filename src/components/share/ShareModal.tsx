import { useState, useEffect } from 'react'
import { captureElement } from './capture'
import { addWatermark } from './watermark'

interface Props {
  targetSelector: string
  currentUrl: string
  onClose: () => void
}

export function ShareModal({ targetSelector, currentUrl, onClose }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const target = document.querySelector(targetSelector) as HTMLElement
    if (!target) {
      setError('未找到截图目标')
      setLoading(false)
      return
    }

    captureElement(target)
      .then((dataUrl) => {
        const img = new Image()
        img.src = dataUrl
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0)
            await addWatermark(canvas, currentUrl)
            setPreview(canvas.toDataURL('image/png'))
            setLoading(false)
          } catch (e) {
            setError('截图处理失败')
            setLoading(false)
          }
        }
        img.onerror = () => {
          setError('截图加载失败')
          setLoading(false)
        }
      })
      .catch(() => {
        setError('截图生成失败')
        setLoading(false)
      })
  }, [targetSelector, currentUrl])

  const handleDownload = () => {
    if (!preview) return
    const a = document.createElement('a')
    a.href = preview
    a.download = `world-cup-${Date.now()}.png`
    a.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '绿茵数据宇宙', url: currentUrl })
      } catch {
        // User cancelled — no action needed
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(currentUrl)
        alert('链接已复制到剪贴板')
      } catch {
        alert('请手动复制链接：' + currentUrl)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">截图分享</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
        </div>
        {error ? (
          <div className="h-64 flex items-center justify-center text-red-400">{error}</div>
        ) : loading ? (
          <div className="h-64 flex items-center justify-center text-white/50">正在生成高清截图...</div>
        ) : (
          <>
            <img src={preview!} alt="预览" className="w-full rounded mb-4" />
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 rounded bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30"
              >
                下载图片
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 hover:bg-white/20"
              >
                分享链接
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
