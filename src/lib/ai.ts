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
 *
 * Robustness notes (learned the hard way):
 *  - The model frequently wraps output in ```json ... ``` fences (sometimes with
 *    leading/trailing newlines). We strip any leading fence line and any
 *    trailing fence.
 *  - The model sometimes returns a PARTIAL object (e.g. only `{"intent":"x"}`
 *    missing the other required fields, or `{"tool": null}`). We therefore
 *    DEEP-MERGE the parsed result over a clone of `fallback` so every field
 *    declared in the fallback is guaranteed to be present and non-null. Any
 *    field the model explicitly set to `null` is dropped so the fallback value
 *    wins.
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
  // Base result is always a clone of the fallback so every field is present.
  const base = cloneFallback(fallback)
  if (!raw) return base
  // Strip markdown fences — handle ```json\n ... \n``` as well as ```\n...\n```.
  let cleaned = raw.trim()
  cleaned = cleaned
    .replace(/^```(?:json|JSON)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim()
  let parsed: any = null
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // Try to extract the first {...} or [...] block
    const match = cleaned.match(/[{[][\s\S]*[}\]]/)
    if (match) {
      try {
        parsed = JSON.parse(match[0])
      } catch {
        /* give up — return fallback */
      }
    }
  }
  if (parsed === null || typeof parsed !== 'object') return base
  return deepMerge(base, parsed) as T
}

/** Shallow clone that handles plain objects and arrays (good enough for the
 *  structured-JSON fallbacks we use). */
function cloneFallback<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return [...(value as any)] as any
  return { ...(value as any) } as any
}

/** Deep-merge `src` over `dst`. For any key where `src` has a non-null value,
 *  the src value wins (recursively for plain objects). `null`/`undefined` in
 *  `src` are ignored so the dst (fallback) value is preserved. */
function deepMerge(dst: any, src: any): any {
  if (src === null || src === undefined) return dst
  if (typeof src !== 'object' || typeof dst !== 'object') return src
  if (Array.isArray(src)) return src
  const out: any = { ...dst }
  for (const key of Object.keys(src)) {
    const sv = src[key]
    if (sv === null || sv === undefined) continue // keep fallback
    if (typeof sv === 'object' && typeof out[key] === 'object' && !Array.isArray(sv)) {
      out[key] = deepMerge(out[key], sv)
    } else {
      out[key] = sv
    }
  }
  return out
}

export { getZAI }
