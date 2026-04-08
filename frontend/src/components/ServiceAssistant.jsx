import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  IndianRupee,
  Loader2,
  SendHorizontal,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { askServiceAssistant } from '../api';
import { formatPriceUnit } from '../utils/serviceMeta';

const PROMPTS = [
  'My tap is leaking',
  'Washing machine is not working',
  'Need a math tutor for class 10',
  'I want same-day package delivery',
];

const INTRO_MESSAGES = [
  {
    id: 'assistant-welcome',
    role: 'assistant',
    text: 'Tell me what you need in plain language. I will suggest the right service category and matching listings.',
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

function AssistantResult({ result }) {
  const browseTo = result?.browseCategory ? `/services?category=${result.browseCategory}` : '/services';

  return (
    <div className="mt-3 rounded-[24px] border border-[#eadfc8] bg-white/95 p-4 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          <Sparkles className="h-3.5 w-3.5" />
          {result?.label || 'Assistant'}
        </span>
        <span className="inline-flex rounded-full border border-[#eadfc8] bg-[#fffaf2] px-3 py-1 text-xs font-semibold text-slate-600">
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
        <Link to={browseTo} className="btn-primary inline-flex items-center justify-center gap-2 !px-4 !py-3 text-xs">
          Browse matches
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {result?.suggestedServices?.length ? (
        <div className="mt-4 grid gap-3">
          {result.suggestedServices.map((service) => (
            <Link
              key={service._id}
              to={`/services/${service._id}`}
              className="rounded-[22px] border border-[#eee4d2] bg-[#fffdf9] px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{service.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{service.providerId?.name || 'Trusted provider'}</p>
                </div>
                <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {result?.label}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <div className="inline-flex items-center gap-1 text-primary-700">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-semibold">{service.price?.toLocaleString()}</span>
                </div>
                <span>{formatPriceUnit(service.priceUnit)}</span>
                {service.totalRatings > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary-400 text-primary-400" />
                    {service.avgRating}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
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
        className="card-elevated overflow-hidden"
      >
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_76%_18%,rgba(47,155,89,0.15),transparent_24%),linear-gradient(145deg,#172033_0%,#243553_58%,#314d7d_100%)] px-8 py-10 text-white sm:px-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              AI Assistant
            </span>

            <h2 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-tight">
              Describe the problem naturally and let Fixify point you to the right service.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white/72">
              Try everyday language like "my tap is leaking" or "I need a coding tutor". The assistant maps the request
              to a service category and recommends matching listings.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendPrompt(prompt)}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 transition-all duration-300 hover:border-white/30 hover:bg-white/16"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Works with short natural-language messages',
                'Explains why a category was chosen',
                'Shows matching listings right away',
                'Lets users jump straight to booking flow',
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/12 bg-white/8 px-4 py-4 text-sm text-white/78">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#fffaf2] p-5 sm:p-6">
            <div className="flex h-full flex-col rounded-[30px] border border-[#eadfc8] bg-white/95 shadow-soft">
              <div className="flex items-center justify-between gap-3 border-b border-[#f1e6d5] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary-50 p-3 text-primary-700">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-ink-900">Service Assistant</p>
                    <p className="text-sm text-slate-500">Ask for help in your own words</p>
                  </div>
                </div>
                <div className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                  Beta
                </div>
              </div>

              <div ref={listRef} className="max-h-[520px] flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' ? (
                      <div className="mt-1 rounded-2xl bg-primary-50 p-2 text-primary-700">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : null}

                    <div
                      className={`max-w-[85%] rounded-[26px] px-4 py-4 ${
                        message.role === 'user'
                          ? 'bg-ink-900 text-white shadow-soft'
                          : 'border border-[#eadfc8] bg-[#fffaf2] text-ink-900'
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
                      <div className="mt-1 rounded-2xl bg-ink-100 p-2 text-ink-700">
                        <User className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
                ))}

                {loading ? (
                  <div className="flex gap-3">
                    <div className="mt-1 rounded-2xl bg-primary-50 p-2 text-primary-700">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-[24px] border border-[#eadfc8] bg-[#fffaf2] px-4 py-4 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking the best match...
                    </div>
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-[#f1e6d5] px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Example: My tap is leaking"
                    className="input-field !bg-[#fffdf8]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    Ask assistant
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
