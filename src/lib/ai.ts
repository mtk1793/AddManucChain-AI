/**
 * Shared AI helper for the AddManuChain platform.
 *
 * Wraps the z-ai-web-dev-sdk so every backend route can call the LLM with a
 * single one-liner.  The SDK is backend-only — never import this from a client
 * component.
 */
import ZAI from 'z-ai-web-dev-sdk'

type ZAIInstance = {
  chat: {
    completions: {
      create: (opts: {
        messages: { role: string; content: string }[]
        thinking?: { type: string }
      }) => Promise<{ choices: { message: { content?: string } }[] }>
    }
  }
}

let zaiPromise: Promise<ZAIInstance> | null = null

async function getZAI(): Promise<ZAIInstance> {
  if (!zaiPromise) {
    zaiPromise = ZAI.create() as Promise<ZAIInstance>
  }
  return zaiPromise
}

/**
 * Ask the LLM a single question and return the text response.
 *
 * @param systemPrompt - Instructions / persona for the assistant.
 * @param userMessage  - The question or task.
 * @returns The model's reply, or an empty string if nothing was returned.
 */
export async function askAI(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  try {
    const zai = await getZAI()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      thinking: { type: 'disabled' },
    })
    return completion.choices?.[0]?.message?.content?.trim() ?? ''
  } catch (err) {
    console.error('[askAI] LLM call failed:', err)
    return ''
  }
}

/**
 * Ask the LLM to return strict JSON.  Parses the response and falls back to
 * `fallback` when the model output cannot be decoded.
 */
export async function askAIJson<T = unknown>(
  systemPrompt: string,
  userMessage: string,
  fallback: T,
): Promise<T> {
  const raw = await askAI(
    `${systemPrompt}\n\nRespond with valid JSON only — no markdown fences, no commentary.`,
    userMessage,
  )
  if (!raw) return fallback
  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    // Try to extract the first {...} or [...] block
    const match = cleaned.match(/[{[][\s\S]*[}\]]/)
    if (match) {
      try {
        return JSON.parse(match[0]) as T
      } catch {
        /* give up */
      }
    }
    return fallback
  }
}

export { getZAI }
