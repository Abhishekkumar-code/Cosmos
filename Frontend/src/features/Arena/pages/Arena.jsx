import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Loader2, Trophy, Brain, RotateCcw,
  AlertCircle, ChevronRight, Sparkles, Scale
} from "lucide-react";
import { invokeArena } from "../service/arena.api.js";

const GROQ = {
  id: "groq",
  name: "Groq",
  model: "Llama 3.1 · 70B",
  dot: "bg-violet-400",
  accent: "violet",
  border: "border-violet-500/30",
  glow: "shadow-violet-500/10",
  score: "text-violet-300",
  bar: "bg-violet-500",
};

const COHERE = {
  id: "cohere",
  name: "Cohere",
  model: "Command-A 2025",
  dot: "bg-sky-400",
  accent: "sky",
  border: "border-sky-500/30",
  glow: "shadow-sky-500/10",
  score: "text-sky-300",
  bar: "bg-sky-500",
};

export default function Arena() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!result) return;
    const el = resultRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(timer);
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await invokeArena(trimmed);
      setResult(data.result);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Arena execution failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setResult(null);
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const winner =
    result?.judge?.solution_1 > result?.judge?.solution_2
      ? "groq"
      : result?.judge?.solution_2 > result?.judge?.solution_1
        ? "cohere"
        : result
          ? "tie"
          : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080F] relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-violet-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 sm:py-14">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-medium text-violet-300">
              <Sparkles className="w-3 h-3" />
              AI Arena
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Model Battle
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            One question · Two models · Gemini judges
          </p>
        </motion.div>

        {/* Model tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-6"
        >
          <ModelTag model={GROQ} />
          <span className="text-slate-600 text-xs">vs</span>
          <ModelTag model={COHERE} />
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 font-medium">Gemini</span>
            <span>judges</span>
          </div>
        </motion.div>

        {/* Input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative rounded-2xl bg-[#0C0F1C] border border-white/[0.07] focus-within:border-violet-500/30 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question to both models..."
              disabled={loading}
              rows={3}
              className="w-full bg-transparent text-[13.5px] text-slate-200 placeholder-slate-600 px-4 pt-4 pb-14 resize-none outline-none disabled:opacity-40 leading-relaxed"
            />
            <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-600">
                {question.length > 0 ? `${question.length} chars` : "↵ Enter to submit"}
              </span>
              <div className="flex items-center gap-2">
                {result && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-medium text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Run
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* API Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-[12px] text-rose-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                </div>
                <span className="text-[11px] text-slate-500">Groq</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-slate-600"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                </div>
                <span className="text-[11px] text-slate-500">Cohere</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">Models generating answers in parallel...</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Results</span>
              </div>

              {/* Two answer cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnswerCard
                  model={GROQ}
                  content={result.solution_1}
                  modelError={result.solution_1_error}
                  score={result.judge?.solution_1}
                  reasoning={result.judge?.solution_1_reasoning}
                  isWinner={winner === "groq"}
                  isTie={winner === "tie"}
                />
                <AnswerCard
                  model={COHERE}
                  content={result.solution_2}
                  modelError={result.solution_2_error}
                  score={result.judge?.solution_2}
                  reasoning={result.judge?.solution_2_reasoning}
                  isWinner={winner === "cohere"}
                  isTie={winner === "tie"}
                />
              </div>

              {/* Verdict */}
              {result.judge && (
                <Verdict judge={result.judge} winner={winner} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ModelTag({ model }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07]">
      <div className={`w-1.5 h-1.5 rounded-full ${model.dot}`} />
      <span className="text-[11px] font-medium text-slate-300">{model.name}</span>
      <span className="text-[10px] text-slate-600 font-mono">{model.model}</span>
    </div>
  );
}

function AnswerCard({ model, content, modelError, score, reasoning, isWinner, isTie }) {
  const isError = !!modelError && !content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: model.id === "groq" ? 0.05 : 0.15 }}
      className={`rounded-2xl bg-[#0C0F1C] border overflow-hidden transition-shadow ${
        isWinner
          ? `${model.border} shadow-lg ${model.glow}`
          : "border-white/[0.07]"
      }`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${model.dot}`} />
          <span className="text-[12px] font-semibold text-white">{model.name}</span>
          <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">{model.model}</span>
        </div>
        <div className="flex items-center gap-2">
          {isWinner && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <Trophy className="w-2.5 h-2.5" />
              Winner
            </span>
          )}
          {isTie && (
            <span className="text-[10px] text-slate-500 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full">
              Tie
            </span>
          )}
          {score != null && !isError && (
            <span className={`text-[11px] font-bold tabular-nums ${
              score >= 7 ? "text-emerald-400" : score >= 4 ? "text-amber-400" : "text-rose-400"
            }`}>
              {score}/10
            </span>
          )}
        </div>
      </div>

      {/* Answer body */}
      <div className="px-4 py-3 min-h-[120px]">
        {isError ? (
          <div className="flex items-start gap-2 text-[12px] text-rose-400/80">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{modelError}</span>
          </div>
        ) : (
          <p className="text-[12.5px] text-slate-300 leading-relaxed whitespace-pre-wrap break-words max-h-72 overflow-y-auto">
            {content || "—"}
          </p>
        )}
      </div>

      {/* Judge reasoning */}
      {reasoning && !isError && (
        <div className="px-4 py-3 border-t border-white/[0.05] bg-white/[0.015]">
          <p className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold mb-1.5">
            Judge Reasoning
          </p>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">{reasoning}</p>
        </div>
      )}
    </motion.div>
  );
}

function Verdict({ judge, winner }) {
  const total = (judge.solution_1 || 0) + (judge.solution_2 || 0) || 1;
  const groqPct = ((judge.solution_1 || 0) / total) * 100;
  const coherePct = ((judge.solution_2 || 0) / total) * 100;

  const text =
    winner === "groq"
      ? "Groq wins"
      : winner === "cohere"
        ? "Cohere wins"
        : "It's a tie";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl bg-[#0C0F1C] border border-white/[0.07] px-4 py-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-300">Gemini Judge</p>
            <p className="text-[10px] text-slate-600">gemini-2.0-flash</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          {winner !== "tie" && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
          <span className={
            winner === "groq" ? "text-violet-300" : winner === "cohere" ? "text-sky-300" : "text-slate-400"
          }>
            {text}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="flex items-center justify-between mb-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="text-slate-400">Groq</span>
          <span className="font-bold text-violet-300 tabular-nums">{judge.solution_1}/10</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sky-300 tabular-nums">{judge.solution_2}/10</span>
          <span className="text-slate-400">Cohere</span>
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden flex gap-px">
        <div
          className="h-full bg-violet-500 rounded-l-full transition-all duration-700"
          style={{ width: `${groqPct}%` }}
        />
        <div
          className="h-full bg-sky-500 rounded-r-full transition-all duration-700"
          style={{ width: `${coherePct}%` }}
        />
      </div>
    </motion.div>
  );
}
