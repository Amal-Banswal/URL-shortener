const axios = require('axios');

/**
 * Single-suggestion AI helper (Groq/OpenAI-compatible chat endpoint)
 * Returns { slug: string|null, raw: any|null }
 */

function sanitizeSlug(candidate) {
  if (!candidate || typeof candidate !== 'string') return null;
  const s = candidate.trim()
    .replace(/\s+/g, '-')            // spaces -> dash
    .replace(/[^a-zA-Z0-9-]/g, '')   // keep only letters, numbers, hyphen
    .slice(0, 8)                     // limit length
    .toLowerCase();
  if (s.length < 4) return null;
  return s;
}

function extractTextFromResponse(raw) {
  if (!raw) return null;
  // Chat completions: choices[0].message.content
  if (raw.choices && Array.isArray(raw.choices) && raw.choices[0]) {
    const m = raw.choices[0].message || raw.choices[0];
    if (m && typeof m.content === 'string') return m.content;
    if (typeof m.text === 'string') return m.text;
  }
  // fallback shapes
  if (typeof raw.result === 'string') return raw.result;
  if (typeof raw.text === 'string') return raw.text;
  if (typeof raw === 'string') return raw;
  return null;
}

async function suggestSlug(longUrl) {
  // require config
  if (!process.env.GROQ_API_KEY || !process.env.GROQ_API_URL) {
    return { slug: null, raw: null };
  }

  const url = process.env.GROQ_API_URL; // e.g. https://api.groq.com/openai/v1/chat/completions
  const model = process.env.GROQ_MODEL;  // e.g. groq/compound-mini

  // Improved, constrained prompt for single high-quality slug
  const system = `You are a concise slug generator. Follow rules strictly:
- Output exactly ONE slug token and NOTHING ELSE.
- Slug MUST be 4 to 8 characters.
- Use only lowercase letters a-z, digits 0-9, and optional single hyphen.
- Prefer short, memorable words or meaningful abbreviations (no random strings).
- Do not include punctuation, explanation, or quotes.`;

  const user = `Create one slug for this URL: ${longUrl}
Return only the slug token (no extra text).`;

  const body = {
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    max_tokens: 12,
    temperature: 0.15
  };

  if (model) body.model = model;

  try {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 10000
    });

    const raw = res.data;
    if (raw && raw.error) return { slug: null, raw }; // do not use error as slug

    const text = extractTextFromResponse(raw);
    const slug = sanitizeSlug(text);
    return { slug: slug || null, raw };
  } catch (err) {
    const raw = err?.response?.data ?? err?.message ?? String(err);
    return { slug: null, raw };
  }
}

module.exports = { suggestSlug };
