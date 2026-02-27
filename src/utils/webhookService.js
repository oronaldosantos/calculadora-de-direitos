import { CONFIG } from '../config'

export async function enviarLeadWebhook(payload) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 9000)

  try {
    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Webhook retornou ${response.status}`)
    }

    return { ok: true }
  } finally {
    clearTimeout(timeout)
  }
}
