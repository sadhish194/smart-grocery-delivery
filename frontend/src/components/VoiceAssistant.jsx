import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getMyOrders, getProducts } from '../services/api';

// ── Text-to-Speech helper ─────────────────────────────────────────────────────
const speak = (text, onEnd) => {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.05;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  // Prefer a natural-sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes('Google') || v.name.includes('Natural') || v.lang === 'en-IN'
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (preferred) utter.voice = preferred;
  utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
};

// ── Intent detector ───────────────────────────────────────────────────────────
const detectIntent = (text) => {
  const t = text.toLowerCase().trim();

  // ── Add to cart (must check BEFORE search to avoid conflict) ──────────────
  // Catches: "add X to cart/card/bag/basket", "put X in cart", "order X"
  const addMatch = t.match(
    /(?:add|put|place|order|i want to add|can you add)\s+(?:some\s+|a\s+|an\s+)?(.+?)\s+(?:to|in)\s+(?:my\s+)?(?:cart|card|basket|bag|order)/
  ) || t.match(
    /(?:add|put)\s+(?:some\s+|a\s+|an\s+)?(.+?)\s+(?:please|now)?$/
  );

  // Also catch if text contains "add" + product name + cart-like word (handles typos)
  const hasAddIntent = /(add|put|place|order)\s+\w/.test(t) &&
    /(cart|card|basket|bag|trolley)/.test(t);

  if ((addMatch && hasAddIntent) || (addMatch && /(cart|card|basket|bag)/.test(t))) {
    const item = (addMatch[1] || '')
      .replace(/\b(to|my|the|cart|card|basket|bag|please|now|some|a|an)\b/g, '')
      .trim();
    if (item.length > 1) return { type: 'add_to_cart', item, reply: '' };
  }

  // Navigation commands
  if (/(go to|open|show|take me to).*(home|main page)/.test(t) || t === 'home')
    return { type: 'navigate', path: '/', reply: 'Going to home page.' };

  if (/(go to|open|show).*(cart|basket|bag)/.test(t) || t === 'cart')
    return { type: 'navigate', path: '/cart', reply: 'Opening your cart.' };

  if (/(go to|open|show|my).*(order|purchase|track)/.test(t))
    return { type: 'navigate', path: '/orders', reply: 'Showing your orders.' };

  if (/(go to|open|show).*(checkout|payment|pay)/.test(t))
    return { type: 'navigate', path: '/checkout', reply: 'Opening checkout.' };

  if (/(go to|open|show).*(profile|account|settings)/.test(t))
    return { type: 'navigate', path: '/profile', reply: 'Opening your profile.' };

  if (/(go to|open|show|browse|all).*(product|shop|store|groceries)/.test(t))
    return { type: 'navigate', path: '/products', reply: 'Showing all products.' };

  if (/(help|support|contact)/.test(t))
    return { type: 'navigate', path: '/help', reply: 'Opening help center.' };

  if (/(admin|dashboard)/.test(t))
    return { type: 'navigate', path: '/admin', reply: 'Opening admin panel.' };

  // Search commands
  const searchMatch = t.match(/(?:search|find|show|look for|i want|i need|get me)\s+(?:some\s+)?(.+)/);
  if (searchMatch) {
    const query = searchMatch[1].replace(/\b(please|now|quickly|for me)\b/g, '').trim();
    return { type: 'search', query, reply: `Searching for ${query}.` };
  }

  // Cart info
  if (/(what.*(in my cart|cart have)|show.*cart|cart items)/.test(t))
    return { type: 'cart_info', reply: '' };

  // Order status
  if (/(where.*order|order status|track.*order|latest order)/.test(t))
    return { type: 'order_status', reply: '' };

  // Coupon
  const couponMatch = t.match(/(?:apply|use|enter)\s+(?:coupon|code|promo)?\s*([a-z0-9]+)/i);
  if (couponMatch)
    return { type: 'navigate', path: '/checkout', reply: `Opening checkout to apply coupon ${couponMatch[1].toUpperCase()}.` };

  // Greetings
  if (/^(hi|hello|hey|hola|namaste)/.test(t))
    return { type: 'reply', reply: 'Hello! How can I help you with your groceries today?' };

  if (/(thank|thanks|thank you)/.test(t))
    return { type: 'reply', reply: "You're welcome! Happy shopping!" };

  if (/(help|what can you do|commands|how to use)/.test(t))
    return {
      type: 'reply',
      reply: 'I can help you search for products, navigate pages, check your cart and orders. Try saying: search for tomatoes, go to cart, or track my order.',
    };

  // Default → send to AI
  return { type: 'ai', reply: '' };
};

// ── Call Gemini via backend ───────────────────────────────────────────────────
const askGemini = async (text, context) => {
  try {
    const systemPrompt = `You are Genie, a voice assistant for Smart Grocery app.
Answer in 1-2 short sentences suitable for text-to-speech. No markdown, no bullet points.

CRITICAL RULES:
- NEVER say you added something to the cart. You cannot do that — only the app can.
- NEVER pretend to complete actions like adding items, placing orders, or making payments.
- If user asks to add something to cart, say: "Sorry, I couldn't find that product. Try saying the product name more clearly."
- Only answer questions about products, prices, delivery, coupons, or store policies.
- If unsure, say: "I'm not sure about that. Try browsing our products page."

User context: ${context}`;
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user') || '{}')?.token || ''),
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: text }],
        systemPrompt,
      }),
    });
    const data = await res.json();
    return data.reply || "I'm sorry, I couldn't process that. Please try again.";
  } catch {
    return "I'm having trouble connecting. Please try again.";
  }
};

// ── Voice Waveform animation ──────────────────────────────────────────────────
const Waveform = () => (
  <div className="flex items-center gap-0.5 h-5">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i}
        className="w-1 bg-white rounded-full animate-pulse"
        style={{
          height: `${8 + Math.random() * 12}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: `${0.4 + Math.random() * 0.3}s`,
        }}
      />
    ))}
  </div>
);

// ── Main VoiceAssistant component ─────────────────────────────────────────────
export default function VoiceAssistant() {
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const [state, setState] = useState('idle'); // idle | listening | processing | speaking
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [history, setHistory] = useState([]);

  const recognitionRef = useRef(null);
  const panelRef = useRef(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const processText = useCallback(async (text) => {
    if (!text.trim()) { setState('idle'); return; }

    setState('processing');
    setTranscript(text);

    const intent = detectIntent(text);
    let replyText = intent.reply;

    if (intent.type === 'navigate') {
      navigate(intent.path);
    } else if (intent.type === 'search') {
      navigate(`/products?keyword=${encodeURIComponent(intent.query)}`);

    } else if (intent.type === 'add_to_cart') {
      // Search for the product first, then add first result to cart
      if (!user || user.role !== 'customer') {
        replyText = 'Please log in as a customer to add items to cart.';
      } else {
        try {
          const { data } = await getProducts({ keyword: intent.item, limit: 1 });
          const product = data?.products?.[0];
          if (!product) {
            replyText = `Sorry, I could not find ${intent.item} in our store.`;
          } else {
            await addToCart(product._id, 1);
            replyText = `${product.name} has been added to your cart!`;
          }
        } catch (err) {
          replyText = `Sorry, I could not add ${intent.item} to your cart. Please try again.`;
        }
      }

    } else if (intent.type === 'cart_info') {
      const items = cart?.items || [];
      if (items.length === 0) {
        replyText = 'Your cart is empty. Want me to help you find something?';
      } else {
        const names = items.slice(0, 3).map(i => i.product?.name || 'item').join(', ');
        replyText = `You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart: ${names}${items.length > 3 ? ' and more' : ''}.`;
      }
    } else if (intent.type === 'order_status') {
      try {
        const { data } = await getMyOrders();
        const latest = Array.isArray(data) ? data[0] : null;
        if (latest) {
          replyText = `Your latest order is ${latest.orderStatus}. It contains ${latest.items?.length} item${latest.items?.length > 1 ? 's' : ''} worth rupees ${latest.totalPrice?.toFixed(0)}.`;
        } else {
          replyText = "You don't have any orders yet. Start shopping to place your first order!";
        }
      } catch {
        replyText = 'I could not fetch your order details right now.';
      }
    } else if (intent.type === 'ai') {
      // Build context for AI
      const context = user
        ? `User: ${user.name}, Role: ${user.role}, Cart items: ${cart?.items?.length || 0}`
        : 'User not logged in';
      replyText = await askGemini(text, context);
    }

    setResponse(replyText);
    setHistory(h => [...h.slice(-9), { q: text, a: replyText }]);

    // Speak the reply
    setState('speaking');
    speak(replyText, () => setState('idle'));
  }, [navigate, cart, user]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice recognition not supported in this browser. Please use Chrome.');
      return;
    }

    window.speechSynthesis.cancel();
    setTranscript('');
    setResponse('');
    setError('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setState('listening');

    recognition.onresult = (e) => {
      const interim = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(interim);
      if (e.results[e.results.length - 1].isFinal) {
        recognition.stop();
        processText(interim);
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (e.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permission.');
      } else {
        setError(`Voice error: ${e.error}`);
      }
      setState('idle');
    };

    recognition.onend = () => {
      if (state === 'listening') setState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, processText, state]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setState('idle');
  };

  const handleMicClick = () => {
    if (state === 'listening') { stopListening(); return; }
    if (state === 'speaking') { window.speechSynthesis.cancel(); setState('idle'); return; }
    setShowPanel(true);
    startListening();
  };

  if (!isSupported) return null;

  const stateColors = {
    idle:       'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary/10 hover:text-primary',
    listening:  'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse',
    processing: 'bg-primary text-white shadow-lg shadow-primary/40',
    speaking:   'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40',
  };

  const stateIcon = {
    idle:       'mic',
    listening:  'mic',
    processing: 'progress_activity',
    speaking:   'volume_up',
  };

  const stateLabel = {
    idle:       'Voice Assistant',
    listening:  'Listening...',
    processing: 'Thinking...',
    speaking:   'Speaking...',
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Mic button */}
      <button
        onClick={handleMicClick}
        title={stateLabel[state]}
        className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${stateColors[state]}`}>
        <span className={`material-symbols-outlined text-lg ${state === 'processing' ? 'animate-spin' : ''}`}
          style={{ fontVariationSettings: state !== 'idle' ? "'FILL' 1" : "'FILL' 0" }}>
          {stateIcon[state]}
        </span>
        {state === 'listening' && (
          <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40" />
        )}
      </button>

      {/* Voice panel */}
      {showPanel && (
        <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-12 w-80 dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              <p className="text-sm font-bold text-white">Genie Voice Assistant</p>
            </div>
            <button onClick={() => { setShowPanel(false); stopListening(); }}
              className="transition-colors text-white/70 hover:text-white">
              <span className="text-sm material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Status area */}
          <div className="p-4">
            <div className={`rounded-xl p-4 mb-3 text-center transition-all
              ${state === 'listening'  ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800' :
                state === 'processing' ? 'bg-primary/5 border border-primary/20' :
                state === 'speaking'   ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200' :
                'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>

              {state === 'listening' ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center h-6 gap-1">
                    {[1,2,3,4,5,6,7].map(i => (
                      <div key={i} className="w-1 bg-red-500 rounded-full"
                        style={{
                          height: `${10 + Math.sin(i) * 8}px`,
                          animation: `pulse ${0.3 + i * 0.05}s ease-in-out infinite alternate`,
                        }} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">Listening... speak now</p>
                  {transcript && <p className="text-xs italic text-slate-600 dark:text-slate-400">"{transcript}"</p>}
                </div>
              ) : state === 'processing' ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg material-symbols-outlined text-primary animate-spin">progress_activity</span>
                  <p className="text-xs font-semibold text-primary">Processing your request...</p>
                </div>
              ) : state === 'speaking' ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-1.5 bg-emerald-500 rounded-full animate-bounce"
                        style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Speaking response...</p>
                  {response && <p className="text-xs leading-relaxed text-center text-slate-600 dark:text-slate-400">"{response}"</p>}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl material-symbols-outlined text-slate-400">mic_none</span>
                  <p className="text-xs text-slate-500">Tap the mic to start</p>
                  {error && <p className="text-xs font-medium text-red-500">{error}</p>}
                </div>
              )}
            </div>

            {/* Last exchange */}
            {transcript && state === 'idle' && (
              <div className="mb-3 space-y-2">
                <div className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs material-symbols-outlined text-slate-600">person</span>
                  </span>
                  <p className="flex-1 text-xs italic text-slate-600 dark:text-slate-400">"{transcript}"</p>
                </div>
                {response && (
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[9px] font-black">G</span>
                    </span>
                    <p className="flex-1 text-xs text-slate-700 dark:text-slate-300">{response}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <button onClick={startListening} disabled={state === 'listening' || state === 'processing'}
                className="flex-1 bg-primary text-white py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all">
                <span className="text-sm material-symbols-outlined">mic</span>
                {state === 'listening' ? 'Listening...' : 'Speak'}
              </button>
              {(state === 'listening' || state === 'speaking') && (
                <button onClick={stopListening}
                  className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-red-100 hover:text-red-600 transition-all">
                  <span className="text-sm material-symbols-outlined">stop</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick commands */}
          <div className="px-4 pb-4">
            <p className="mb-2 text-xs font-bold tracking-wide uppercase text-slate-400">Try saying</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Search tomatoes',
                'Add tomato to cart',
                'Go to cart',
                'Track my order',
                'What\'s in my cart?',
                'Go to checkout',
              ].map(cmd => (
                <button key={cmd} onClick={() => processText(cmd)}
                  className="text-[11px] bg-primary/8 text-primary border border-primary/15 px-2.5 py-1 rounded-full hover:bg-primary hover:text-white transition-all font-medium">
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}