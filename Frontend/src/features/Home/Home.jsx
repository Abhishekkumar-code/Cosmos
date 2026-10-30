import React, { useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Mail,
  Globe,
  Database,
  Search,
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Box,
} from "lucide-react";

// In case you have your Spline 3D robot URL, paste it here:
// Example: "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
const SPLINE_URL = "";

// Lazy load Spline to keep initial page render instant
const Spline = lazy(() => import("@splinetool/react-spline"));

const agentsList = [
  {
    id: "email-agent",
    name: "Email Agent",
    badge: "Autonomous Dispatcher",
    icon: Mail,
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.15)",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    description:
      "Context-aware communication pipeline built for high-throughput developers. Parses incoming issues, drafts transactional responses, generates tokenized verification triggers, and syncs summaries directly to your workspace.",
    capabilities: [
      "Auto-triaging incoming developer queries",
      "Cryptographic email verification dispatch",
      "Multi-channel digests & event notifications",
      "Human-in-the-loop review queues",
    ],
    image:
      "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Futuristic digital communication interface",
    route: "/chat",
  },
  {
    id: "web-rag-agent",
    name: "Web RAG Agent",
    badge: "Live Knowledge Crawler",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.15)",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description:
      "Performs real-time web exploration and multi-hop internet discovery. Strips noisy HTML, checks domain authority, and grounds answers with exact citations and source timestamps for hallucination-free output.",
    capabilities: [
      "Real-time Tavily & search API synthesis",
      "Automated source validation & citation anchors",
      "Dynamic token window summarization",
      "Sub-second scraping of API documentations",
    ],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Matrix digital cyberspace network web visual",
    route: "/chat",
  },
  {
    id: "rag-pipeline-agent",
    name: "RAG Pipeline Agent",
    badge: "ChromaDB & Vector Store",
    icon: Database,
    color: "from-violet-500 to-purple-600",
    glowColor: "rgba(168, 85, 247, 0.15)",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description:
      "Heavy-duty document ingestion and vector retrieval engine. Parses multi-page technical PDFs, chunks documents with smart overlap, embeds with Gemini embeddings, and executes top-K cosine similarity searches in ChromaDB.",
    capabilities: [
      "Full PDF & technical documentation parsing",
      "Multi-tenant vector namespace isolation",
      "Context reranking for pinpoint code snippets",
      "Incremental chunk indexing with zero downtime",
    ],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "High performance server rack cluster and vector storage",
    route: "/chat",
  },
  {
    id: "research-agent",
    name: "Research Agent",
    badge: "Deep Reasoning & Synthesis",
    icon: Search,
    color: "from-amber-500 to-rose-500",
    glowColor: "rgba(244, 63, 94, 0.15)",
    tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    description:
      "Autonomous problem decomposer. Formulates hypotheses, executes comparative code analysis across different paradigms, benchmarks runtime trade-offs, and compiles comprehensive architectural decision records (ADRs).",
    capabilities: [
      "Multi-step thought tree & hypothesis testing",
      "Algorithm complexity & security audits",
      "Peer-reviewed engineering benchmark generation",
      "Self-correcting synthesis with Gemini & Llama",
    ],
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Abstract neural intelligence visual",
    route: "/arena",
  },
  {
    id: "data-analysis-agent",
    name: "Data Analysis Agent",
    badge: "Statistical & Compute Core",
    icon: BarChart3,
    color: "from-indigo-500 to-pink-500",
    glowColor: "rgba(99, 102, 241, 0.15)",
    tagColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    description:
      "Transforms raw JSON, tabular logs, and system metrics into actionable insights. Computes distributions, predicts bottlenecks, formats schema validations, and yields structured visualization feeds on the fly.",
    capabilities: [
      "Automated anomaly detection across system logs",
      "Real-time tabular aggregations and metrics",
      "Predictive latency & throughput forecasting",
      "Zero-config schema inference & data cleanup",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "High-tech analytics dashboard and telemetry graph",
    route: "/arena",
  },
];

export default function Home() {
  const [splineError, setSplineError] = useState(false);

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 overflow-x-hidden relative selection:bg-purple-500/30">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[580px]">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                Cosmos Autonomous Runtime
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                MULTI AGENT SYSTEM
              </h1>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent leading-[1.1]">
                AND DEVELOPER HEAVEN
              </h2>
            </div>

            {/* Subtext */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Unleash a coordinated squad of specialized AI agents. From
              autonomous RAG ingestion and real-time web exploration to
              side-by-side model combat and automated email pipelines — code, test,
              and deploy at terminal velocity.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/arena"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-purple-900/30 border border-purple-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Enter AI Arena</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/chat"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Launch Agent Chat</span>
              </Link>
            </div>

            {/* Quick Metrics Strip */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06]">
              <div>
                <p className="text-lg sm:text-xl font-bold font-mono text-white">5+</p>
                <p className="text-[11px] text-slate-500">Autonomous Agents</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold font-mono text-cyan-400">14ms</p>
                <p className="text-[11px] text-slate-500">Retrieval Latency</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold font-mono text-fuchsia-400">Multi-LLM</p>
                <p className="text-[11px] text-slate-500">Groq · Cohere · Gemini</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Spline Robot Canvas / Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl bg-[#090D1C]/80 border border-purple-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-950/40 flex items-center justify-center group"
          >
            {/* Ambient Background Gradient for the 3D space */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-cyan-950/20 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* If user provided a Spline URL, render it safely */}
            {SPLINE_URL && !splineError ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="w-10 h-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
                    <span className="text-xs font-mono">Loading 3D Robot...</span>
                  </div>
                }
              >
                <Spline
                  scene={SPLINE_URL}
                  onError={() => setSplineError(true)}
                  className="w-full h-full"
                />
              </Suspense>
            ) : (
              /* High-tech Interactive 3D Robot Hologram Preview & URL ready dropzone */
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                {/* Floating Holographic Cyber Robot Visual */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotateZ: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative mb-6"
                >
                  {/* Glowing Rings */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 blur-2xl opacity-35 scale-125" />

                  {/* Core 3D Robot Sphere representation */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-[#121730] to-[#0A0D1F] border-2 border-purple-400/40 p-1 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                    <div className="w-full h-full rounded-[22px] bg-[#070A18]/90 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />

                      {/* Robot Face / Eyes */}
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative z-10 flex flex-col items-center gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-5 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
                          <span className="w-5 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
                        </div>
                        <Bot className="w-12 h-12 text-violet-300 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          COSMOS-BOT v3
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Spline Hook badge & hint */}
                <div className="max-w-xs space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-medium">
                    <Box className="w-3.5 h-3.5" />
                    <span>Spline 3D Ready</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Interactive 3D Robot viewport. Put your Spline scene code in{" "}
                    <code className="text-fuchsia-300 font-mono text-[11px] bg-white/5 px-1 rounded">
                      SPLINE_URL
                    </code>{" "}
                    to render real-time interactive mesh.
                  </p>
                </div>

                {/* Floating telemetry pills */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060814]/90 border border-white/10 text-[10px] font-mono text-slate-300">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>mesh: interactive</span>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060814]/90 border border-white/10 text-[10px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>runtime: active</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===================== MULTI-AGENT FLEET SHOWCASE ===================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/[0.06]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Autonomous Intelligence Fleet</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meet the Cosmos Multi-Agent Core
          </h2>
          <p className="text-sm text-slate-400">
            Each agent is purpose-built to solve a distinct developer bottleneck
            with isolated memory, retrieval tooling, and structured outputs.
          </p>
        </div>

        {/* Alternating Multi-Agent Cards */}
        <div className="space-y-16 sm:space-y-24">
          {agentsList.map((agent, index) => {
            const isEven = index % 2 === 0;
            const Icon = agent.icon;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Text Side */}
                <div
                  className={`lg:col-span-6 space-y-5 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {/* Badge & Icon Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.color} p-[1.5px] shadow-lg`}
                    >
                      <div className="w-full h-full bg-[#0A0D1B] rounded-[10px] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border ${agent.tagColor}`}
                      >
                        {agent.badge}
                      </span>
                    </div>
                  </div>

                  {/* Agent Name */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {agent.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-2.5 pt-1">
                    {agent.capabilities.map((cap, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-xs text-slate-400"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>

                  {/* Link CTA */}
                  <div className="pt-2">
                    <Link
                      to={agent.route}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-fuchsia-300 group transition-colors"
                    >
                      <span>Explore {agent.name} in action</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Image Side */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="relative rounded-2xl bg-[#0C1022] border border-white/10 p-2 overflow-hidden shadow-xl shadow-purple-950/20 group hover:border-purple-500/30 transition-all duration-300">
                    {/* Glowing Backdrop */}
                    <div
                      className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 pointer-events-none transition-opacity group-hover:opacity-75"
                      style={{ background: agent.glowColor }}
                    />

                    {/* Image Container */}
                    <div className="relative w-full h-[260px] sm:h-[320px] rounded-xl overflow-hidden">
                      <img
                        src={agent.image}
                        alt={agent.imageAlt}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080B18] via-transparent to-transparent opacity-80" />

                      {/* Floating Info Pill on the Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-lg bg-[#060814]/85 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-[11px] font-medium text-slate-200">
                            {agent.name} Vector Node
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== FOOTER CALL TO ACTION ===================== */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center border-t border-white/[0.06]">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0C1022] to-[#070A16] border border-purple-500/20 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_70%)]" />

          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <Sparkles className="w-6 h-6 text-fuchsia-400 mx-auto" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to Orchestrate Your Agent Squad?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Step into the Arena to compare reasoning models or launch chat to
              stream context-aware responses with your specialized developer agents.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/arena"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40"
              >
                Go to AI Arena
              </Link>
              <Link
                to="/chat"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Open Chat Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
