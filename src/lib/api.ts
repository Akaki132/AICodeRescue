import type { AnalyzeResponse } from '../types'

export async function analyzeScreenshot(image: string): Promise<AnalyzeResponse> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  })

  const data = (await res.json()) as AnalyzeResponse
  if (!res.ok) {
    throw new Error(data.error || 'Analysis failed')
  }
  return data
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('That file is not an image.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read that screenshot.'))
    reader.readAsDataURL(file)
  })
}

export function clipboardToDataUrl(event: ClipboardEvent) {
  const items = event.clipboardData?.items
  if (!items) return Promise.resolve(null)

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) return fileToDataUrl(file)
    }
  }
  return Promise.resolve(null)
}
