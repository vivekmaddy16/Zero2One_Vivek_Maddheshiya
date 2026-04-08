import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  GraduationCap,
  IndianRupee,
  Loader2,
  MessageSquareText,
  Package,
  SendHorizontal,
  Sparkles,
  Star,
  User,
  Wrench,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { askServiceAssistant } from '../api';
import { formatPriceUnit } from '../utils/serviceMeta';

const PROMPTS = [
  { text: 'My tap is leaking', icon: Wrench },
  { text: 'Washing machine is not working', icon: Zap },
  { text: 'Need a math tutor for class 10', icon: GraduationCap },
  { text: 'I want same-day package delivery', icon: Package },
];

const INTRO_MESSAGES = [
  {
    id: 'assistant-welcome',
    role: 'assistant',
    text: "Hi! I'm your AI service assistant. Tell me what you need — in plain, everyday language — and I'll match you with the right provider.",
  },
];

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getAssistantHeadline(result) {
  if (!result?.category) {
    return 'I need one more detail';
  }

  return `You likely need a ${result.label}`;
}

function getConfidenceLabel(confidence) {
  if (confidence === 'high') return 'High confidence';
  if (confidence === 'medium') return 'Good match';
  return 'Low confidence';
}

function getConfidenceStyle(confidence) {
  if (confidence === 'high') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (confidence === 'medium') return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

function AssistantResult({ result }) {
  const browseTo = result?.browseCategory ? `/services?category=${result.browseCategory}` : '/services';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-[22px] border border-[#eadfc8] bg-white p-4 shadow-[0_4px_20px_-8px_rgba(120,87,29,0.12)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          <Sparkles className="h-3.5 w-3.5" />
          {result?.label || 'Assistant'}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getConfidenceStyle(result?.confidence)}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${result?.confidence === 'high' ? 'bg-emerald-500' : result?.confidence === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
          {getConfidenceLabel(result?.confidence)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-600">{result?.reason}</p>

      {result?.matchedKeywords?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.matchedKeywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Link to={browseTo} className="btn-primary inline-flex items-center justify-center gap-2 !px-5 !py-2.5 text-xs">
          Browse matches
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {result?.suggestedServices?.length ? (
        <div className="mt-4 grid gap-2.5">
          {result.suggestedServices.map((service) => (
            <Link
              key={service._id}
              to={`/services/${service._id}`}
              className="group rounded-[18px] border border-[#eee4d2] bg-[#fffdf9] px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900 transition-colors group-hover:text-primary-700">{service.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{service.providerId?.name || 'Trusted provider'}</p>
                </div>
                <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {result?.label}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <div className="inline-flex items-center gap-1 font-semibold text-primary-700">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {service.price?.toLocaleString()}
                </div>
                <span>{formatPriceUnit(service.priceUnit)}</span>
                {service.totalRatings > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                    {service.avgRating}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

/* ── Typing dots animation ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-primary-400"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ServiceAssistant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(INTRO_MESSAGES);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const sendPrompt = async (rawValue) => {
    const trimmed = rawValue.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: createId('user'),
      role: 'user',
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await askServiceAssistant(trimmed);
      setMessages((current) => [
        ...current,
        {
          id: createId('assistant'),
          role: 'assistant',
          text: getAssistantHeadline(data),
          result: data,
        },
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assistant could not respond right now.');
      setMessages((current) => [
        ...current,
        {
          id: createId('assistant'),
          role: 'assistant',
          text: 'I hit a problem while checking that. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendPrompt(input);
  };

  return (
    <section className="section-shell mt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-[36px] border border-[#eee4d1] shadow-soft-lg"
      >
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          {/* ── Left panel — dark with animated mesh gradient ── */}
          <div className="relative overflow-hidden px-8 py-10 text-white sm:px-10 lg:py-12">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

            {/* Animated mesh blobs */}
            <div
              className="absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(245,158,11,0.6) 0%, transparent 70%)',
                animation: 'pulse 6s ease-in-out infinite',
              }}
            />
            <div
              className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(47,155,89,0.6) 0%, transparent 70%)',
                animation: 'pulse 8s ease-in-out infinite reverse',
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
                animation: 'pulse 7s ease-in-out infinite 2s',
              }}
            />

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" style={{ animationDuration: '3s' }} />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
                  AI-Powered Assistant
                </span>
              </div>

              <h2 className="mt-7 max-w-lg font-display text-[2.5rem] font-semibold leading-[1.1] tracking-tight">
                Just describe your problem.{' '}
                <span className="bg-gradient-to-r from-amber-300 via-primary-300 to-accent-300 bg-clip-text text-transparent">
                  We handle the rest.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-7 text-white/60">
                Speak naturally — like texting a friend. Our AI understands your issue and
                instantly connects you with the right professional.
              </p>

              {/* Prompt pills */}
              <div className="mt-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Try saying...
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {PROMPTS.map((prompt) => {
                    const PromptIcon = prompt.icon;
                    return (
                      <button
                        key={prompt.text}
                        onClick={() => sendPrompt(prompt.text)}
                        className="group inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[13px] font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/12 hover:text-white hover:shadow-[0_0_20px_-4px_rgba(245,158,11,0.15)]"
                      >
                        <PromptIcon className="h-4 w-4 text-white/40 transition-colors group-hover:text-amber-300" />
                        {prompt.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feature highlights */}
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  { emoji: '🎯', text: 'Smart category matching' },
                  { emoji: '💡', text: 'Understands natural language' },
                  { emoji: '⚡', text: 'Instant listing suggestions' },
                  { emoji: '🔗', text: 'Direct booking shortcuts' },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="text-base">{feature.emoji}</span>
                    <span className="text-[13px] font-medium text-white/60">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel — chat interface ── */}
          <div className="bg-gradient-to-b from-[#fffbf3] to-[#fff7eb] p-4 sm:p-6">
            <div className="flex h-full flex-col rounded-[28px] border border-[#eadfc8] bg-white shadow-soft">
              {/* Chat header */}
              <div className="flex items-center justify-between gap-3 border-b border-[#f1e6d5] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f2e4c5] bg-white shadow-soft">
                      <img src="/logo.png" alt="Fixify" className="h-8 w-8 rounded-xl object-cover" />
                    </div>
                    {/* Online pulse */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-300" />
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-900">Fixify AI</p>
                    <p className="text-xs text-emerald-600 font-medium">Online — ready to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-600">
                    <Sparkles className="h-3 w-3" />
                    Beta
                  </span>
                </div>
              </div>

              {/* Message list */}
              <div ref={listRef} className="max-h-[480px] flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="mt-1 flex-shrink-0">
                          <div className="rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 p-2 text-primary-700">
                            <Bot className="h-4 w-4" />
                          </div>
                        </div>
                      ) : null}

                      <div
                        className={`max-w-[85%] rounded-[22px] px-4 py-3.5 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-ink-800 to-ink-900 text-white shadow-[0_4px_16px_-6px_rgba(23,32,51,0.4)]'
                            : 'border border-[#eadfc8] bg-gradient-to-br from-[#fffcf5] to-[#fff8ee] text-ink-900'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <p className="font-semibold text-ink-900">{message.text}</p>
                        ) : (
                          <p className="font-medium text-white">{message.text}</p>
                        )}

                        {message.role === 'assistant' && message.result ? <AssistantResult result={message.result} /> : null}
                      </div>

                      {message.role === 'user' ? (
                        <div className="mt-1 flex-shrink-0">
                          <div className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-2 text-slate-600">
                            <User className="h-4 w-4" />
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 p-2 text-primary-700">
                        <Bot className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-[22px] border border-[#eadfc8] bg-gradient-to-br from-[#fffcf5] to-[#fff8ee] px-5 py-4 text-sm text-slate-500">
                      <TypingDots />
                      <span className="text-slate-400">Analyzing your request...</span>
                    </div>
                  </motion.div>
                ) : null}
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="border-t border-[#f1e6d5] px-4 py-4">
                <div className="flex items-center gap-2 rounded-[22px] border border-[#eadfc8] bg-[#fffdf8] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-100/60">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Describe what you need..."
                    className="flex-1 border-none bg-transparent px-3 py-2.5 text-sm text-ink-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-[0_4px_12px_-4px_rgba(245,158,11,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-4px_rgba(245,158,11,0.5)] disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2.5 text-center text-[11px] text-slate-400">
                  Powered by AI · Your queries are not stored
                </p>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CSS keyframe for blob pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
