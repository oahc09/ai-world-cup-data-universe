import { describe, it, expect, vi, beforeAll } from 'vitest'
import { captureElement } from '@/components/share/capture'
import { addWatermark } from '@/components/share/watermark'

// jsdom does not implement HTMLCanvasElement.getContext() by default.
// Stub it so canvas 2d operations (font, fillText, drawImage) are no-ops.
beforeAll(() => {
  const noopCtx = {
    font: '',
    fillStyle: '',
    textAlign: '',
    fillText: vi.fn(),
    drawImage: vi.fn(),
  }
  HTMLCanvasElement.prototype.getContext = vi.fn(() => noopCtx) as unknown as typeof HTMLCanvasElement.prototype.getContext
})

// jsdom does not fire Image#onload when src is set. Stub Image so onload
// fires on the next tick, allowing addWatermark's await to resolve.
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''
  width = 0
  height = 0
  constructor() {
    // Defer to allow caller to assign onload before we invoke it.
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 0)
  }
}
globalThis.Image = MockImage as unknown as typeof Image

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      toDataURL: () => 'data:image/png;base64,mock',
      width: 200,
      height: 100,
      getContext: () => ({ drawImage: vi.fn() }),
    })
  ),
}))

// Mock qrcode
vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,qrmock')) },
  toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,qrmock')),
}))

describe('captureElement', () => {
  it('returns dataURL string', async () => {
    const el = document.createElement('div')
    const result = await captureElement(el)
    expect(typeof result).toBe('string')
    expect(result.startsWith('data:image/png')).toBe(true)
  })
})

describe('addWatermark', () => {
  it('returns canvas with watermark drawn', async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const result = await addWatermark(canvas, 'https://world-cup-data-universe.app')
    expect(result).toBeInstanceOf(HTMLCanvasElement)
  })
})
