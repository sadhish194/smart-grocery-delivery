// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');

// // POST /api/chat
// // Proxies messages to Anthropic API — avoids browser CORS restrictions
// router.post('/', async (req, res) => {
//   try {
//     const { messages, systemPrompt } = req.body;

//     if (!messages || !Array.isArray(messages)) {
//       return res.status(400).json({ message: 'messages array is required' });
//     }

//     const apiKey = process.env.ANTHROPIC_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ message: 'ANTHROPIC_API_KEY not configured in .env' });
//     }

//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': apiKey,
//         'anthropic-version': '2023-06-01',
//       },
//       body: JSON.stringify({
//         model: 'claude-sonnet-4-6',
//         max_tokens: 1000,
//         system: systemPrompt || 'You are a helpful grocery assistant.',
//         messages: messages.map(m => ({ role: m.role, content: m.content })),
//       }),
//     });

//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}));
//       console.error('Anthropic API error:', err);
//       return res.status(response.status).json({ message: err.error?.message || 'Anthropic API error' });
//     }

//     const data = await response.json();
//     const text = data.content?.[0]?.text || '';
//     res.json({ reply: text });

//   } catch (error) {
//     console.error('Chat proxy error:', error.message);
//     res.status(500).json({ message: 'Chat service unavailable. Please try again.' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();

// const MODELS = [
//   'gemini-2.0-flash',
//   'gemini-1.5-flash-latest',
//   'gemini-1.5-flash',
//   'gemini-pro',
// ];

// async function callGemini(apiKey, model, body) {
//   const res = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
//     { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
//   );
//   const data = await res.json();
//   return { ok: res.ok, status: res.status, data };
// }

// // POST /api/chat
// router.post('/', async (req, res) => {
//   try {
//     const { messages, systemPrompt } = req.body;
//     if (!messages || !Array.isArray(messages)) {
//       return res.status(400).json({ message: 'messages array is required' });
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return res.status(500).json({ message: 'GEMINI_API_KEY not configured in .env' });
//     }

//     const geminiHistory = messages.slice(0, -1).map(m => ({
//       role: m.role === 'assistant' ? 'model' : 'user',
//       parts: [{ text: m.content }],
//     }));
//     const latestMessage = messages[messages.length - 1];

//     const body = {
//       system_instruction: { parts: [{ text: systemPrompt || 'You are a helpful grocery assistant.' }] },
//       contents: [
//         ...geminiHistory,
//         { role: 'user', parts: [{ text: latestMessage.content }] },
//       ],
//       generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
//     };

//     // Try each model until one works
//     let lastError = null;
//     for (const model of MODELS) {
//       const { ok, status, data } = await callGemini(apiKey, model, body);
//       if (ok) {
//         const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';
//         return res.json({ reply: text });
//       }
//       lastError = data.error;
//       // Only retry on 404 (model not found) or 429 (quota). Stop on auth errors.
//       if (status === 400 || status === 401 || status === 403) break;
//     }

//     // All models failed — give a helpful message
//     const isQuota = lastError?.status === 'RESOURCE_EXHAUSTED';
//     const isNotFound = lastError?.status === 'NOT_FOUND';

//     if (isQuota) {
//       console.error('Gemini quota exceeded:', lastError?.message?.split('\n')[0]);
//       return res.status(429).json({
//         message: 'QUOTA_EXCEEDED: Your Gemini API key has hit its free limit. Please create a new API key at aistudio.google.com'
//       });
//     }
//     if (isNotFound) {
//       console.error('Gemini model not found:', lastError?.message);
//       return res.status(404).json({ message: 'Gemini model unavailable. Please check your API key region.' });
//     }

//     console.error('Gemini API error:', lastError);
//     res.status(500).json({ message: lastError?.message || 'Gemini API error' });

//   } catch (error) {
//     console.error('Chat proxy error:', error.message);
//     res.status(500).json({ message: 'Chat service unavailable. Please try again.' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

// GET /api/chat/models — lists all models available for your API key (for debugging)
router.get('/models', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ message: 'GEMINI_API_KEY not set' });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await r.json();
    // Return just names that support generateContent
    const models = (data.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name);
    res.json({ models });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

async function callGemini(apiKey, model, body) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// Discover available models dynamically and cache them
let cachedModels = null;
const getAvailableModels = async (apiKey) => {
  if (cachedModels) return cachedModels;
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await r.json();
    cachedModels = (data.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name); // e.g. "models/gemini-2.0-flash"
    console.log('Available Gemini models:', cachedModels);
    return cachedModels;
  } catch (_) {
    // Fallback list using full model paths
    return [
      'models/gemini-2.0-flash',
      'models/gemini-2.0-flash-lite',
      'models/gemini-1.5-flash-latest',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro-latest',
    ];
  }
};

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY not configured in .env' });
    }

    const models = await getAvailableModels(apiKey);

    const geminiHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const latestMessage = messages[messages.length - 1];

    const body = {
      system_instruction: { parts: [{ text: systemPrompt || 'You are a helpful grocery assistant.' }] },
      contents: [
        ...geminiHistory,
        { role: 'user', parts: [{ text: latestMessage.content }] },
      ],
      generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
    };

    let lastError = null;
    for (const model of models) {
      const { ok, status, data } = await callGemini(apiKey, model, body);
      if (ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';
        console.log(`✅ Chat responded using: ${model}`);
        return res.json({ reply: text });
      }
      lastError = data.error;
      console.warn(`Model ${model} failed (${status}):`, data.error?.status);
      if (status === 400 || status === 401 || status === 403) break;
      if (status === 429) {
        // Quota hit — reset cache so next request re-discovers models
        cachedModels = null;
        break;
      }
    }

    const isQuota = lastError?.status === 'RESOURCE_EXHAUSTED';
    if (isQuota) {
      return res.status(429).json({
        message: 'QUOTA_EXCEEDED: Create a new API key at aistudio.google.com → "Create API key in new project"'
      });
    }

    console.error('All Gemini models failed. Last error:', lastError);
    res.status(500).json({ message: lastError?.message || 'Gemini API error' });

  } catch (error) {
    console.error('Chat proxy error:', error.message);
    res.status(500).json({ message: 'Chat service unavailable. Please try again.' });
  }
});

module.exports = router;