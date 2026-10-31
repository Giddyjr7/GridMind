"use client";

import * as React from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  MessageCircleMore,
  Send,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { envConfig } from "@/config/env";

interface ToolTrace {
  tool: string;
  input: Record<string, unknown>;
  ok: boolean;
  summary: string;
}

interface OperatorAnswer {
  answer: string;
  toolCalls: ToolTrace[];
  model: string | null;
  provider: "openai" | "unavailable";
  turns: number;
  limitations: string[];
}

interface ChatExchange {
  id: number;
  question: string;
  result?: OperatorAnswer;
  error?: string;
}

const suggestions = [
  "What is driving our outage risk right now?",
  "Which equipment needs attention first?",
  "Are our battery and generator ready for an outage?",
];

export function OperatorAgentCard() {
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [exchanges, setExchanges] = React.useState<ChatExchange[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [traceOpen, setTraceOpen] = React.useState<number | null>(null);
  const nextId = React.useRef(1);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [exchanges, loading, open]);

  async function askAgent(prompt = question) {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    const id = nextId.current++;
    setQuestion("");
    setExchanges((current) => [...current, { id, question: trimmed }]);
    setLoading(true);

    try {
      if (!envConfig.isApi) throw new Error("Switch GridMind to API mode to use the operator agent.");
      const response = await fetch(`${envConfig.apiBaseUrl}/ai/ask`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      if (!response.ok) throw new Error(`Operator agent request failed (${response.status}).`);
      const result = await response.json() as OperatorAnswer;
      setExchanges((current) => current.map((exchange) => (
        exchange.id === id ? { ...exchange, result } : exchange
      )));
    } catch (requestError) {
      const error = requestError instanceof Error ? requestError.message : "Operator agent unavailable.";
      setExchanges((current) => current.map((exchange) => (
        exchange.id === id ? { ...exchange, error } : exchange
      )));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#04110c] shadow-[0_14px_45px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a] sm:bottom-6 sm:right-6"
        aria-label="Open GridMind operator agent"
        aria-expanded={open}
        aria-controls="operator-agent-drawer"
      >
        <MessageCircleMore className="h-5 w-5" />
        <span className="hidden sm:inline">Ask GridMind</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close operator agent"
          />

          <aside
            id="operator-agent-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="operator-agent-title"
            className="relative z-10 flex h-full w-full flex-col border-l border-white/10 bg-[#08110d] text-white shadow-[-24px_0_70px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 sm:max-w-md"
          >
            <header className="border-b border-white/[0.08] bg-[#0a1510] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 id="operator-agent-title" className="truncate text-sm font-semibold">GridMind operator</h2>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.14em] text-slate-400">read-only</span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> OpenAI connected
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  aria-label="Close operator agent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite">
              {exchanges.length === 0 ? (
                <div className="flex min-h-full flex-col justify-center pb-16">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <Bot className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-center text-lg font-semibold">How can I help?</h3>
                  <p className="mx-auto mt-2 max-w-xs text-center text-xs leading-5 text-slate-400">
                    Ask about outage risk, feeder telemetry, equipment health, site configuration, or current recommendations.
                  </p>
                  <div className="mt-6 space-y-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void askAgent(suggestion)}
                        disabled={loading}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-left text-xs text-slate-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.05] hover:text-white disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-black/20 p-3 text-[10px] leading-4 text-slate-500">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    The agent can inspect GridMind data, but it cannot approve recommendations or control equipment.
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {exchanges.map((exchange) => (
                    <div key={exchange.id} className="space-y-3">
                      <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-emerald-400 px-3.5 py-2.5 text-xs leading-5 text-[#04110c]">
                        {exchange.question}
                      </div>

                      {exchange.result && (
                        <div className="max-w-[94%] rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.035] p-3.5">
                          <p className="whitespace-pre-wrap text-xs leading-5 text-slate-200">{exchange.result.answer}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-white/[0.06] pt-3 text-[9px] text-slate-500">
                            <span>{exchange.result.provider === "openai" ? exchange.result.model : "Agent not configured"}</span>
                            <span>{exchange.result.turns} turn{exchange.result.turns === 1 ? "" : "s"}</span>
                            <button
                              type="button"
                              onClick={() => setTraceOpen((current) => current === exchange.id ? null : exchange.id)}
                              className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                            >
                              <Wrench className="h-3 w-3" />
                              {exchange.result.toolCalls.length} tool call{exchange.result.toolCalls.length === 1 ? "" : "s"}
                              {traceOpen === exchange.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>

                          {traceOpen === exchange.id && exchange.result.toolCalls.length > 0 && (
                            <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
                              {exchange.result.toolCalls.map((call, index) => (
                                <div key={`${call.tool}-${index}`} className="flex items-start justify-between gap-3 text-[10px]">
                                  <code className={call.ok ? "text-emerald-300" : "text-rose-300"}>{call.tool}</code>
                                  <span className="text-right text-slate-500">{call.summary}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {exchange.result.limitations.length > 0 && (
                            <p className="mt-3 text-[9px] leading-4 text-amber-200/60">Limitation: {exchange.result.limitations[0]}</p>
                          )}
                        </div>
                      )}

                      {exchange.error && (
                        <div className="max-w-[94%] rounded-xl border border-rose-400/15 bg-rose-400/[0.06] p-3 text-xs text-rose-200">
                          {exchange.error}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.035] px-3.5 py-3 text-xs text-slate-400">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-emerald-300" />
                      Reading GridMind data…
                    </div>
                  )}
                </div>
              )}
            </div>

            <footer className="border-t border-white/[0.08] bg-[#0a1510] p-4 sm:p-5">
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/25 p-2 focus-within:border-emerald-400/35">
                <textarea
                  ref={inputRef}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  rows={1}
                  maxLength={1000}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void askAgent();
                    }
                  }}
                  placeholder="Ask what the system knows…"
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-xs text-white outline-none placeholder:text-slate-600"
                  aria-label="Message GridMind operator"
                />
                <button
                  type="button"
                  onClick={() => void askAgent()}
                  disabled={loading || question.trim().length < 3}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-[#04110c] hover:bg-emerald-300 disabled:opacity-35"
                  aria-label="Send message"
                >
                  {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-center text-[9px] text-slate-600">Read-only guidance. Verify critical decisions before acting.</p>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
