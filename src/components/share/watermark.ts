import QRCode from 'qrcode'

const WATERMARK_TEXT = '绿茵数据宇宙'
const ENTRY_URL = 'https://world-cup-data-universe.app'

export async function addWatermark(canvas: HTMLCanvasElement, currentUrl: string): Promise<HTMLCanvasElement> {
  const ctx = canvas.getContext('2d')!
  const padding = 20
  const fontSize = 24

  // 平台名称水印
  ctx.font = `${fontSize}px sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.textAlign = 'right'
  ctx.fillText(WATERMARK_TEXT, canvas.width - padding - 80, canvas.height - padding - 40)

  // 入口 URL
  ctx.font = '14px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(ENTRY_URL, canvas.width - padding - 80, canvas.height - padding - 10)

  // 二维码（右下角 80x80）
  try {
    const qrDataUrl = await QRCode.toDataURL(currentUrl, { width: 80, margin: 1 })
    const img = new Image()
    img.src = qrDataUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = reject
    })
    ctx.drawImage(img, canvas.width - 80 - padding, canvas.height - 80 - padding, 80, 80)
  } catch {
    // QR code generation failed — skip it, watermark text is still drawn
  }

  return canvas
}
