// backend/routes/links.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Link = require('../models/Link');
const { nanoid } = require('nanoid');
const { suggestSlug } = require('../utils/aiSuggest');

const router = express.Router();

// try to decode auth if present
const optionalAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (e) {
    // ignore invalid token
  }
  return next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  return next();
};

/**
 * Create link
 * Request body:
 *  { url: string, desiredSlug?: string, useAi?: boolean }
 * Response includes aiUsed and aiSuggestion for transparency.
 */
router.post('/', optionalAuth, async (req, res) => {
  const { url, desiredSlug, useAi = true } = req.body || {};
  if (!url) return res.status(400).json({ error: 'url required' });

  let slug = (desiredSlug || '').trim() || null;
  let aiSuggestion = null;
  let aiUsed = false;
  let aiRaw = null;

  // Try AI if no desired slug and useAi=true
  if (!slug && useAi) {
    try {
      const { slug: aiSlug, raw } = await suggestSlug(url);
      aiRaw = raw;
      if (aiSlug) {
        aiSuggestion = aiSlug;
        slug = aiSlug;
        aiUsed = true;
      }
    } catch (err) {
      console.warn('AI suggestion failed:', err?.message || err);
    }
  }

  // Fallback to nanoid if still no slug
  if (!slug) slug = nanoid(7);

  // Ensure uniqueness
  let unique = false;
  let attempt = 0;
  while (!unique) {
    const existing = await Link.findOne({ slug });
    if (!existing) { unique = true; break; }
    slug = `${slug}-${nanoid(3)}`.slice(0, 30);
    attempt++;
    if (attempt > 5) slug = nanoid(8);
  }

  try {
    const doc = await Link.create({
      slug,
      url,
      owner: req.user?.id || undefined
    });

    const short = `${process.env.BASE_URL || 'http://localhost:5173'}/s/${doc.slug}`;

    // Development log — helpful to see AI raw output
    console.log('[LINK CREATED]', JSON.stringify({
  slug: doc.slug,
  url: doc.url,
  aiUsed,
  aiSuggestion,
  aiRaw
}, null, 2));


    res.json({
      slug: doc.slug,
      short,
      doc,
      aiUsed,
      aiSuggestion
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

// Redirect route used by frontend/public: GET /s/:slug
router.get('/r/:slug', async (req, res) => {
  const { slug } = req.params;
  const link = await Link.findOne({ slug });
  if (!link) return res.status(404).send('Not found');
  link.clicks.push({ ua: req.headers['user-agent'] || '', ip: req.ip });
  await link.save();
  return res.redirect(link.url);
});

// Dashboard/list
router.get('/', optionalAuth, async (req, res) => {
  if (req.user) {
    const links = await Link.find({ owner: req.user.id }).sort({ createdAt: -1 });
    const formatted = links.map(l => ({
      id: l._id,
      slug: l.slug,
      url: l.url,
      createdAt: l.createdAt,
      clicks: l.clicks.length,
      lastClick: l.clicks.length ? l.clicks[l.clicks.length - 1] : null
    }));
    return res.json(formatted);
  } else {
    const links = await Link.find().sort({ createdAt: -1 }).limit(20);
    return res.json(links.map(l => ({ id: l._id, slug:l.slug, url:l.url, clicks: l.clicks.length })));
  }
});

// Click details (owner-only)
router.get('/:id/clicks', optionalAuth, requireAuth, async (req, res) => {
  const id = req.params.id;
  const link = await Link.findById(id);
  if (!link) return res.status(404).json({ error: 'not found' });
  if (String(link.owner) !== String(req.user.id)) return res.status(403).json({ error: 'forbidden' });
  res.json({ clicks: link.clicks });
});

module.exports = router;