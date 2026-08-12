/**
 * Talks to the Spring Boot API.
 *
 * Everything falls back to a bundled copy of the same payload, so the site
 * still renders if the API is down — it just stops being live.
 */
import { FALLBACK } from './fallback';

const BASE = import.meta.env.VITE_API_BASE ?? '';

export async function loadPortfolio() {
  try {
    // Free hosting sleeps. Fail over to bundled content fast rather than
    // making the visitor watch a cold start; the stream fills in when it wakes.
    const res = await fetch(`${BASE}/api/bootstrap`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(`bootstrap ${res.status}`);
    return { ...(await res.json()), live: true };
  } catch (err) {
    console.warn('API unreachable, rendering bundled content.', err);
    return { ...FALLBACK, live: false };
  }
}

/**
 * Subscribes to the throughput stream. Returns an unsubscribe function.
 * If SSE fails, polls the snapshot endpoint instead of going silent.
 */
export function subscribeThroughput(onTick) {
  // Retries on its own, so a backend that wakes up 40s later still lights the HUD.
  let source;
  let poll;

  try {
    source = new EventSource(`${BASE}/api/throughput/stream`);
    source.addEventListener('tick', (e) => onTick(JSON.parse(e.data)));
    source.onerror = () => {
      source.close();
      source = undefined;
      startPolling();
    };
  } catch {
    startPolling();
  }

  function startPolling() {
    if (poll) return;
    poll = setInterval(async () => {
      try {
        const res = await fetch(`${BASE}/api/throughput`);
        if (res.ok) onTick(await res.json());
      } catch {
        /* stay quiet; the HUD keeps its last value */
      }
    }, 2000);
  }

  return () => {
    source?.close();
    if (poll) clearInterval(poll);
  };
}

export async function sendMessage(payload) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.error ?? 'Message did not send.'), { fields: body.fields });
  return body;
}
