// backend/list_groq_models.js
require('dotenv').config();
const axios = require('axios');

(async () => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY missing in .env');
    process.exit(1);
  }
  try {
    const res = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('ERROR', err?.response?.data ?? err.message ?? err);
  }
})();
