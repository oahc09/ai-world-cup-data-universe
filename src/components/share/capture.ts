import html2canvas from 'html2canvas'

export async function captureElement(element: HTMLElement): Promise<string> {
  const scale = (window.devicePixelRatio || 1) * 2 // PRD：2x 设备像素比
  const canvas = await html2canvas(element, {
    backgroundColor: '#000000',
    scale,
    useCORS: true,
    logging: false,
  })
  return canvas.toDataURL('image/png')
}
