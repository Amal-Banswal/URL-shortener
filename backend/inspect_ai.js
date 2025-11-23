// backend/inspect_ai.js
require('dotenv').config();
const { suggestSlug } = require('./utils/aiSuggest');

(async () => {
  const url = 'https://platform.openai.com/docs/api-reference/introduction';
  console.log('Calling suggestSlug for:', url);
  try {
    const out = await suggestSlug(url);
    // Print full structured result so we can inspect provider error/value
    console.log('RESULT (full):', JSON.stringify(out, null, 2));
  } catch (e) {
    console.error('ERROR calling suggestSlug():', e);
  }
})();
