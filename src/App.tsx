import { useCallback, useEffect, useState } from 'react'
import { DropZone } from './components/DropZone'
import { Paywall } from './components/Paywall'
import { Processing } from './components/Processing'
import { Results } from './components/Results'
import { analyzeScreenshot, clipboardToDataUrl, fileToDataUrl } from './lib/api'
import { canAnalyze, consumeCredit, getCredits, isMockPro, mockCheckout } from './lib/payment'
import type { AppView } from './types'

export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [dragging, setDragging] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState('')
  const [demo, setDemo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState(() => getCredits())
  const [pro, setPro] = useState(() => isMockPro())
  const [paywallOpen, setPaywallOpen] = useState(false)
  const [pendingImage, setPendingImage] = useState<string | null>(null)

  const runAnalysis = useCallback(async (dataUrl: string) => {
    setError(null)
    setImage(dataUrl)
    setView('processing')
    const started = Date.now()
    try {
      const result = await analyzeScreenshot(dataUrl)
      const wait = 1600 - (Date.now() - started)
      if (wait > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, wait))
      }
      setCredits(consumeCredit())
      setAnalysis(result.analysis)
      setDemo(Boolean(result.demo))
      setView('results')
    } catch (err) {
      setView('landing')
      setImage(null)
      setError(err instanceof Error ? err.message : 'Something broke on the way to the model.')
    }
  }, [])

  const acceptImage = useCallback(
    (dataUrl: string) => {
      if (!canAnalyze()) {
        setPendingImage(dataUrl)
        setPaywallOpen(true)
        return
      }
      void runAnalysis(dataUrl)
    },
    [runAnalysis],
  )

  const onFile = useCallback(
    async (file: File) => {
      try {
        const dataUrl = await fileToDataUrl(file)
        acceptImage(dataUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not read that file.')
      }
    },
    [acceptImage],
  )

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      void clipboardToDataUrl(event).then((dataUrl) => {
        if (dataUrl) acceptImage(dataUrl)
      })
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [acceptImage])

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          AIcoderescue
        </div>
        <div className="credits">
          {pro ? 'mock pro' : `${credits} free left`}
        </div>
      </header>

      {view === 'landing' ? (
        <main className="landing">
          <p className="eyebrow">for CS / engineering labs</p>
          <h1>Paste the screenshot. Get the fix.</h1>
          <p className="lede">
            Drop an error, a stack trace, or that cursed autograder output. We read it like a
            classmate who already finished the lab.
          </p>
          <DropZone dragging={dragging} onFile={onFile} onDraggingChange={setDragging} />
          {error ? <p className="error">{error}</p> : null}
        </main>
      ) : null}

      {view === 'processing' && image ? (
        <main className="processing-wrap">
          <img src={image} alt="" className="processing-thumb" />
          <Processing />
        </main>
      ) : null}

      {view === 'results' && image ? (
        <Results
          image={image}
          analysis={analysis}
          demo={demo}
          onReset={() => {
            setView('landing')
            setImage(null)
            setAnalysis('')
            setError(null)
          }}
        />
      ) : null}

      <Paywall
        open={paywallOpen}
        onClose={() => {
          setPaywallOpen(false)
          setPendingImage(null)
        }}
        onUnlock={() => {
          setCredits(mockCheckout())
          setPro(true)
          setPaywallOpen(false)
          if (pendingImage) {
            const next = pendingImage
            setPendingImage(null)
            void runAnalysis(next)
          }
        }}
      />
    </div>
  )
}
