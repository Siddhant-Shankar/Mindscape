// server/utils/sentiment.js
import dotenv from 'dotenv';
dotenv.config();

const MODEL_PATH = 'distilbert/distilbert-base-uncased-finetuned-sst-2-english';
const HF_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_PATH}`;

export async function analyzeSentiment(text, { timeoutMs = 8000 } = {}) {
  if (!process.env.HF_API_KEY) {
    console.warn('HF_API_KEY not set; skipping sentiment.');
    return null;
  }
  if (!text || !text.trim()) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const t = await res.text().catch(() => '');
      console.warn(`HF error ${res.status} on ${HF_URL}: ${t.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    const arr = Array.isArray(first) ? first : [];
    if (!arr.length) return null;

    const best = arr.reduce((a, b) => (a.score > b.score ? a : b));

    let sign = 0;
    if (/pos/i.test(best.label)) sign = 1;
    else if (/neg/i.test(best.label)) sign = -1;

    return {
      label: best.label,                  // "POSITIVE" or "NEGATIVE"
      confidence: best.score,             // raw confidence score
      sentimentScore: sign * best.score,   // signed number
    };
  } catch (e) {
    console.warn('Sentiment request failed:', e.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
