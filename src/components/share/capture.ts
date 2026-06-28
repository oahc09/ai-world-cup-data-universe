import html2canvas from 'html2canvas'

function replaceCanvasWithImages(root: HTMLElement): Array<{ canvas: HTMLCanvasElement; img: HTMLImageElement }> {
  const canvases = root.querySelectorAll('canvas')
  const replacements: Array<{ canvas: HTMLCanvasElement; img: HTMLImageElement }> = []
  canvases.forEach((canvas) => {
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const img = document.createElement('img')
      img.src = dataUrl
      img.style.width = canvas.offsetWidth + 'px'
      img.style.height = canvas.offsetHeight + 'px'
      img.style.display = 'block'
      canvas.parentNode?.replaceChild(img, canvas)
      replacements.push({ canvas, img })
    } catch {
      // 某些 canvas 可能无法导出（如受污染的），跳过
    }
  })
  return replacements
}

function restoreCanvases(replacements: Array<{ canvas: HTMLCanvasElement; img: HTMLImageElement }>) {
  replacements.forEach(({ canvas, img }) => {
    img.parentNode?.replaceChild(canvas, img)
  })
}

export async function captureElement(element: HTMLElement): Promise<string> {
  const scale = (window.devicePixelRatio || 1) * 2

  const replacements = replaceCanvasWithImages(element)

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale,
      useCORS: true,
      logging: false,
    })
    return canvas.toDataURL('image/png')
  } finally {
    restoreCanvases(replacements)
  }
}
