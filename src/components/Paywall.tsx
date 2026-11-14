import { MOCK_PLAN } from '../lib/payment'

type PaywallProps = {
  open: boolean
  onClose: () => void
  onUnlock: () => void
}

export function Paywall({ open, onClose, onUnlock }: PaywallProps) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="modal">
        <p className="eyebrow">mock payment</p>
        <h2 id="paywall-title">Out of free rescues</h2>
        <p className="muted">{MOCK_PLAN.blurb}</p>
        <div className="plan">
          <span>{MOCK_PLAN.name}</span>
          <strong>{MOCK_PLAN.price}</strong>
        </div>
        <button type="button" className="btn primary" onClick={onUnlock}>
          Unlock with mock card
        </button>
        <button type="button" className="btn ghost" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  )
}
