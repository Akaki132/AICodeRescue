import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'

dotenv.config()

const PORT = Number(process.env.PORT) || 8787
const SYSTEM_PROMPT = `You are a highly capable senior CS student helping a friend debug their lab code. Never say 'As an AI...' or 'I am happy to help.' Be concise, direct, and slightly informal. Use natural developer slang (e.g., 'this function is a bit bloated', 'your loop is hanging here', 'easy fix'). Acknowledge if the professor's assignment structure is confusing or annoying. Prioritize getting them a working solution immediately so they can pass.`

const DEMO_ANALYSIS = `**yeah I see it**

your loop is hanging here — \`i\` never moves, so this never terminates. classic. also the professor's starter code is a bit annoying with that extra wrapper, ignore it.

easy fix: increment inside the loop and bail when you hit the sentinel.

\`\`\`python
def find_max(nums):
    if not nums:
        return None
    best = nums[0]
    for n in nums[1:]:
        if n > best:
            best = n
    return best
\`\`\`

drop that in, rerun the sample tests, you should be good.
`

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    model: 'gpt-4o-mini',
    demo: !process.env.OPENAI_API_KEY,
  })
})

app.post('/api/analyze', async (req, res) => {
  const image = req.body?.image
  if (typeof image !== 'string' || !image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Send a screenshot as a data URL.' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.json({ analysis: DEMO_ANALYSIS, demo: true })
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Here's a screenshot of my lab error / code. Tell me what's broken and give me a working fix I can paste.",
            },
            { type: 'image_url', image_url: { url: image } },
          ],
        },
      ],
    })

    const analysis = completion.choices[0]?.message?.content?.trim()
    if (!analysis) {
      return res.status(502).json({ error: 'Model came back empty. Try another screenshot.' })
    }

    res.json({ analysis, demo: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OpenAI request failed'
    res.status(502).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`AIcoderescue API on http://localhost:${PORT}`)
})
