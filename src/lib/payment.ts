const CREDITS_KEY = 'coderescue.credits'
const UNLOCKED_KEY = 'coderescue.mockPro'
const FREE_CREDITS = 3

function readNumber(key: string, fallback: number) {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

export function getCredits() {
  return readNumber(CREDITS_KEY, FREE_CREDITS)
}

export function isMockPro() {
  return localStorage.getItem(UNLOCKED_KEY) === '1'
}

export function canAnalyze() {
  return isMockPro() || getCredits() > 0
}

export function consumeCredit() {
  if (isMockPro()) return getCredits()
  const next = Math.max(0, getCredits() - 1)
  localStorage.setItem(CREDITS_KEY, String(next))
  return next
}

export function mockCheckout() {
  localStorage.setItem(UNLOCKED_KEY, '1')
  localStorage.setItem(CREDITS_KEY, '99')
  return 99
}

export const MOCK_PLAN = {
  name: 'Rescue Pass',
  price: '$4.99',
  blurb: 'Mock checkout — no card charged. Unlocks the rest of the loop so we can keep testing.',
}
