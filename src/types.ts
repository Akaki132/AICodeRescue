export type AppView = 'landing' | 'processing' | 'results'

export type AnalyzeResponse = {
  analysis: string
  demo?: boolean
  error?: string
}
