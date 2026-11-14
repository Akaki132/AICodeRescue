import { MarkdownView } from './MarkdownView'

type ResultsProps = {
  image: string
  analysis: string
  demo: boolean
  onReset: () => void
}

export function Results({ image, analysis, demo, onReset }: ResultsProps) {
  return (
    <div className="results">
      <section className="pane image-pane">
        <header className="pane-head">
          <span>Your screenshot</span>
          <button type="button" className="btn ghost compact" onClick={onReset}>
            New screenshot
          </button>
        </header>
        <div className="image-wrap">
          <img src={image} alt="Uploaded error screenshot" />
        </div>
      </section>
      <section className="pane response-pane">
        <header className="pane-head">
          <span>The fix</span>
          {demo ? <span className="badge">demo mode</span> : null}
        </header>
        <div className="response-body">
          <MarkdownView content={analysis} />
        </div>
      </section>
    </div>
  )
}
