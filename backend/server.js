require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const linksRoutes = require('./routes/links');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Connect to MongoDB
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/url_shortener_db';
mongoose.connect(MONGO, {});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linksRoutes);

// Public redirect: /s/:slug
app.get('/s/:slug', async (req, res) => {
  const Link = require('./models/Link');
  const slug = req.params.slug;
  const link = await Link.findOne({ slug });
  if (!link) return res.status(404).send('Not found');
  link.clicks.push({ ua: req.headers['user-agent'] || '', ip: req.ip });
  await link.save();
  return res.redirect(link.url);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Backend running on ${PORT}`));