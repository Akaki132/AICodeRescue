import { useEffect, useState } from 'react'
import { LOADING_LINES } from '../lib/messages'

export function Processing() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LOADING_LINES.length)
    }, 1800)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="processing" role="status" aria-live="polite">
      <div className="pulse" />
      <p className="processing-line">{LOADING_LINES[index]}</p>
      <p className="muted">hang tight, looking at the screenshot</p>
    </div>
  )
}
