import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import SectionReveal from "../components/SectionReveal";
import {
  Phone,
  Mic,
  Zap,
  Target,
  Users,
  BarChart3,
  Play,
  Pause,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Building2,
  Calendar,
  Settings,
  Shield,
  Eye,
  Layers,
  Activity,
  Radio,
  Cpu,
  GitBranch,
  Volume2,
  Clock,
  Star,
  Headphones,
  RefreshCw,
  FileText,
  Sparkles,
  Workflow,
  Bot,
  Signal,
} from "lucide-react";
import Footer from "../components/Footer";

// ─── Ambient Background ───────────────────────────────────────────────────────
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Cinematic Fog & Light Blooms */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.035), transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.025), transparent 70%)",
          filter: "blur(160px)",
        }}
      />
      
      {/* Moving Ambient Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

// ─── Live Waveform Animation ──────────────────────────────────────────────────
function LiveWaveform({
  active = true,
  bars = 32,
  color = "#FFFFFF",
}: {
  active?: boolean;
  bars?: number;
  color?: string;
}) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: bars }, () => Math.random() * 60 + 10),
  );

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setHeights((prev) =>
        prev.map((_h, i) => {
          const center = bars / 2;
          const distFromCenter = Math.abs(i - center) / center;
          const maxH = 80 * (1 - distFromCenter * 0.4);
          return Math.random() * maxH + 8;
        }),
      );
    }, 80);
    return () => clearInterval(interval);
  }, [active, bars]);

  // default waveform to soft silver/white for premium aesthetic
  const waveColor = color || "#E5E5E5";
  return (
    <div className="flex items-center gap-[3px] h-16">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: active ? h : 4 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 18,
          }}
          className="rounded-full flex-shrink-0"
          style={{
            width: 2.5,
            background: i % 2 === 0 ? waveColor : `${waveColor}80`,
            opacity: active ? 0.8 : 0.2,
            filter: "blur(0.2px)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Pulse Dot ────────────────────────────────────────────────────────────────
function PulseDot({
  color = "#FFFFFF",
  size = 6,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 4, height: size * 4 }}
    >
      <motion.div
        animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          filter: "blur(1px)",
        }}
      />
      <div
        className="rounded-full z-10"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: "0 0 10px rgba(255,255,255,0.5)",
        }}
      />
    </div>
  );
}

// ─── Floating Glass Card ──────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
  glowColor = "rgba(255,255,255,0.08)",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 60, damping: 18 }}
      className={`relative rounded-[24px] border border-white/[0.08] overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Glow / Spotlight */}
      <div 
        className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(1000px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 40%)`
        }}
      />
      {/* Internal soft highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Hero AI Dashboard (Right Side) ──────────────────────────────────────────
function HeroAIDashboard() {
  const [activeCall, setActiveCall] = useState(0);
  const calls = [
    {
      name: "Sarah Chen",
      company: "Stripe",
      status: "Live",
      duration: "2:34",
      intent: 94,
      color: "#FFFFFF",
    },
    {
      name: "Marcus Webb",
      company: "Linear",
      status: "Qualifying",
      duration: "1:12",
      intent: 78,
      color: "#A1A1AA",
    },
    {
      name: "Priya Nair",
      company: "Notion",
      status: "Booked",
      duration: "4:01",
      intent: 100,
      color: "#E5E5E5",
    },
  ];

  useEffect(() => {
    const t = setInterval(
      () => setActiveCall((p) => (p + 1) % calls.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer soft grayscale glow */}
      <div
        className="absolute inset-0 rounded-[40px] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />

      <GlassCard
        className="w-full max-w-[520px] p-0 overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        glowColor="rgba(255,255,255,0.05)"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Radio
                className="w-4 h-4 text-white/80"
              />
            </div>
            <span className="text-sm font-bold text-white font-display tracking-tight">
              AI Core Processor
            </span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
            <PulseDot color="#FFFFFF" size={4} />
            <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">System Active</span>
          </div>
        </div>

        {/* Active calls */}
        <div className="p-5 space-y-4">
          {calls.map((call, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: activeCall === i ? 1 : 0.4,
                scale: activeCall === i ? 1 : 0.97,
              }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
              className="relative rounded-[16px] p-4 border cursor-pointer transition-colors duration-500"
              style={{
                background:
                  activeCall === i
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.02)",
                borderColor:
                  activeCall === i
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.05)",
              }}
              onClick={() => setActiveCall(i)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border border-white/10"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    }}
                  >
                    {call.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">
                      {call.name}
                    </p>
                    <p className="text-xs text-white/40 font-medium">
                      {call.company}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">
                    {call.duration}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#FFFFFF",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {call.status}
                  </span>
                </div>
              </div>
              {activeCall === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                >
                  <LiveWaveform active={true} bars={32} color={call.color} />
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Neural Intent</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${call.intent}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full rounded-full bg-white"
                          style={{ 
                            boxShadow: "0 0 12px rgba(255,255,255,0.4)"
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-mono font-bold text-white"
                      >
                        {call.intent}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06]">
          {[
            { label: "Throughput", value: "247", icon: Activity },
            { label: "Conversions", value: "31", icon: Zap },
            { label: "Success Rate", value: "12.6%", icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-5 gap-1.5 hover:bg-white/[0.02] transition-colors">
              <stat.icon
                className="w-4 h-4 text-white/40"
              />
              <span className="text-lg font-bold text-white font-display tracking-tight">
                {stat.value}
              </span>
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Floating orbital elements */}
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-8 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}
      >
        <PulseDot color="#FFFFFF" size={4} />
        Signal Intercepted
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], x: [0, -5, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-8 -left-10 flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        <Cpu className="w-3.5 h-3.5 text-white/40" />
        Spatial Processing
      </motion.div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      <div className="container-limit relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <SectionReveal>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest mb-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
              }}
            >
              <PulseDot color="#FFFFFF" size={4} />
              Spatial OS Redesign
            </div>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-white tracking-[-4px] leading-[0.9] mb-8">
              Every signal deserves a{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #FFFFFF 20%, #A1A1AA 60%, rgba(255,255,255,0.3) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                call.
              </span>
            </h1>
            <p className="text-xl text-white/40 max-w-lg mb-12 leading-relaxed font-medium">
              Autonomous voice agents that monitor your buyer signals and call
              interested prospects in under 90 seconds. Experience the future of
              GTM.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                to="/book-demo"
                className="group relative px-8 py-4 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </Link>
              <button
                className="px-8 py-4 rounded-full text-sm font-bold text-white border border-white/10 hover:border-white/30 hover:bg-white/[0.03] transition-all"
                style={{ backdropFilter: "blur(10px)" }}
              >
                Watch Workflow
              </button>
            </div>

            <div className="mt-16 flex items-center gap-8">
              {[
                { label: "Connect Rate", val: "94%" },
                { label: "Response", val: "<90s" },
                { label: "ROI", val: "3.2x" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-white font-display">
                    {item.val}
                  </span>
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2} direction="left">
            <HeroAIDashboard />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Agent Control Section (Orbital Node System) ─────────────────────────────
const agentControlNodes = [
  {
    icon: Mic,
    title: "Voice Persona Control",
    description:
      "Choose from 12 AI voices or clone your top rep. Adjust tone, pacing, and accent per campaign.",
    status: "ACTIVE",
    id: "persona",
    metrics: { efficiency: "98%", latency: "120ms" },
    connections: ["objective", "launch"],
  },
  {
    icon: Target,
    title: "Call Objective",
    description:
      "Set primary goals: qualify, book, nurture, or re-engage. AI adapts conversation flow dynamically.",
    status: "CONFIGURED",
    id: "objective",
    metrics: { accuracy: "94%", learning: "Deep" },
    connections: ["visibility", "persona"],
  },
  {
    icon: Layers,
    title: "Queue Management",
    description:
      "Priority-based call queues with smart retry logic. Never miss a hot lead window.",
    status: "RUNNING",
    id: "queue",
    metrics: { capacity: "10k/min", load: "Low" },
    connections: ["launch", "pause"],
  },
  {
    icon: Activity,
    title: "Live Pause / Resume",
    description:
      "Pause any agent mid-campaign, adjust scripts, and resume without losing context.",
    status: "STANDBY",
    id: "pause",
    metrics: { state: "Synced", resume: "Instant" },
    connections: ["visibility", "queue"],
  },
  {
    icon: Workflow,
    title: "Campaign Launch",
    description:
      "One-click launch across thousands of prospects. Stagger timing to avoid spam filters.",
    status: "SCHEDULED",
    id: "launch",
    metrics: { volume: "50k", start: "T-10m" },
    connections: ["queue", "persona"],
  },
  {
    icon: Eye,
    title: "Admin Visibility",
    description:
      "Real-time dashboard showing every active call, transcript, and outcome as it happens.",
    status: "MONITORING",
    id: "visibility",
    metrics: { streams: "Live", feed: "Realtime" },
    connections: ["objective", "pause"],
  },
];

function AgentControlSection() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const orbitalRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbitalRef.current) return;
      const rect = orbitalRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative py-48 overflow-hidden bg-[#050505]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3
            }}
            animate={{
              y: ["-10%", "110%"],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20
            }}
          />
        ))}
      </div>

      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-32">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
          >
            <Settings className="w-3.5 h-3.5" />
            System Architecture
          </div>
          <h2 className="font-display text-5xl sm:text-7xl font-bold text-white tracking-[-4px] mb-8">
            Full command over <br/> every autonomous agent.
          </h2>
          <p className="text-xl text-white/30 max-w-2xl mx-auto font-medium tracking-tight">
            Monitor, orchestrate, and optimize every AI conversation in real time with our orbital command matrix.
          </p>
        </SectionReveal>

        {/* Orbital System */}
        <div 
          ref={orbitalRef}
          className="relative h-[800px] flex items-center justify-center"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: "transform 0.2s ease-out text-rendering"
          }}
        >
          {/* Orbital Paths */}
          <div className="absolute w-[450px] h-[450px] rounded-full border border-white/[0.03]" />
          <div className="absolute w-[700px] h-[700px] rounded-full border border-white/[0.02]" />

          {/* Center Core */}
          <motion.div 
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 group"
          >
            {/* Core Glow */}
            <div className="absolute inset-0 rounded-full blur-[60px] bg-white/10 group-hover:bg-white/20 transition-all duration-1000" />
            
            <div className="relative w-40 h-40 rounded-full bg-white/[0.04] backdrop-blur-3xl border border-white/20 flex flex-col items-center justify-center p-4 shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-[inherit]" />
              
              <Radio className="w-8 h-8 text-white mb-2" />
              <div className="text-center">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-0.5">Outmate</p>
                <p className="text-xs font-bold tracking-widest text-white uppercase">Voice AI</p>
              </div>

              {/* Internal pulse ring */}
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-white/20"
              />
            </div>
          </motion.div>

          {/* Nodes */}
          {agentControlNodes.map((node, i) => {
            const angle = (i * 360) / agentControlNodes.length;
            const radius = 320;
            return (
              <OrbitalNode 
                key={node.id}
                node={node}
                angle={angle}
                radius={radius}
                isActive={hoveredNode === node.id || selectedNode === node.id}
                onHover={() => setHoveredNode(node.id)}
                onLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node.id)}
              />
            );
          })}
        </div>

        {/* Global Expand Portal */}
        <AnimatePresence>
          {selectedNode && (
            <DetailPanel 
              node={agentControlNodes.find(n => n.id === selectedNode)!} 
              onClose={() => setSelectedNode(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Orbital Node Component ──────────────────────────────────────────────────
function OrbitalNode({ node, angle, radius, isActive, onHover, onLeave, onClick }: any) {
  return (
    <motion.div
      initial={false}
      style={{
        width: 0,
        height: 0,
        position: 'absolute',
        top: '50%',
        left: '50%'
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          width: 0,
          height: 0,
          position: 'absolute'
        }}
      >
        <motion.div
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onClick={onClick}
          animate={{
            x: radius * Math.cos((angle * Math.PI) / 180),
            y: radius * Math.sin((angle * Math.PI) / 180),
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        >
          <motion.div
            animate={{
              rotate: - ( (angle + 0) % 360), // basic counter-rotate
            }}
            className="relative"
          >
            <motion.div
               animate={{
                y: [0, -10, 0],
                scale: isActive ? 1.1 : 1,
              }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: angle * 0.01 },
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative"
            >
              {/* Interaction ring */}
              <div className={`absolute -inset-4 rounded-full transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
              />

              <div className="relative w-20 h-20 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-[inherit]" />
                <node.icon className={`w-8 h-8 transition-all duration-500 ${isActive ? "text-white scale-110" : "text-white/40"}`} />
                
                {/* Active Indicator */}
                <div className="absolute top-2 right-2">
                  <PulseDot color="#FFFFFF" size={3} />
                </div>
              </div>

              <motion.div 
                animate={{ opacity: isActive ? 1 : 0.6, y: isActive ? 4 : 0 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
              >
                <p className="text-[10px] font-bold tracking-[0.2em] text-white uppercase drop-shadow-md">{node.title.split(' ')[0]}</p>
                <p className="text-[10px] font-medium text-white/30 tracking-widest uppercase">{node.status}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Detail Panel Component ──────────────────────────────────────────────────
function DetailPanel({ node, onClose }: { node: any; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 md:p-24 backdrop-blur-md bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl bg-white/[0.05] backdrop-blur-3xl border border-white/[0.08] rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Apple Glass Reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-[inherit]" />

        <div className="p-8 sm:p-12">
          <div className="flex items-start justify-between mb-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[20px] bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-lg">
                <node.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">{node.title}</h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] w-fit">
                  <PulseDot color="#FFFFFF" size={4} />
                  <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{node.status}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-lg text-white/50 leading-relaxed mb-10 font-medium tracking-tight">
            {node.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(node.metrics).map(([key, value]: any) => (
              <div key={key} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] group hover:bg-white/[0.05] transition-colors shadow-[0_8px_50px_rgba(0,0,0,0.55)]">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">{key}</p>
                <p className="text-2xl font-display font-bold text-white tracking-tighter">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-10">
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Connected Nodes</p>
              <div className="flex -space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/20 backdrop-blur-sm" />
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-bold hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.08)]">
              Launch Module <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Signal Triggered Section ─────────────────────────────────────────────────
const signalEvents = [
  {
    label: "Pricing Page Visit",
    company: "Stripe",
    time: "Just now",
    color: "#FFFFFF",
    icon: Target,
  },
  {
    label: "Repeat Visit (3x)",
    company: "Linear",
    time: "2m ago",
    color: "#FFFFFF",
    icon: Activity,
  },
  {
    label: "Job Change Detected",
    company: "Notion",
    time: "5m ago",
    color: "#FFFFFF",
    icon: Users,
  },
];

function SignalTriggeredSection() {
  const [visibleEvents] = useState(3);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Signal className="w-3.5 h-3.5" />
            Signal-Triggered Calling
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            Call while the intent is hot
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Our agents monitor 1st and 3rd party signals to trigger calls the
            moment a prospect shows interest.
          </p>
        </SectionReveal>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 max-w-5xl mx-auto">
          {/* Left: Signal Feed */}
          <SectionReveal direction="right">
            <GlassCard
              className="p-6 h-full"
              glowColor="rgba(255,255,255,0.05)"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white font-display">
                  Live Signal Feed
                </span>
                <div className="flex items-center gap-1.5">
                  <PulseDot color="#FFFFFF" size={5} />
                  <span className="text-xs text-white/40 font-mono">
                    Streaming
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {signalEvents.slice(0, visibleEvents).map((event, _i) => (
                    <motion.div
                      key={event.label}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <event.icon
                          className="w-4 h-4 text-white/60"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {event.label}
                        </p>
                        <p className="text-xs text-white/35">{event.company}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-white/30 font-mono">
                          {event.time}
                        </span>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.1)" }}
                        >
                          <Phone
                            className="w-2.5 h-2.5 text-white/80"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>
          </SectionReveal>

          {/* Right: Event Detail Cards */}
          <SectionReveal direction="left" delay={0.15}>
            <div className="space-y-4">
              {[
                {
                  title: "Pricing Page → Instant Call",
                  desc: "Visitor spends 3+ minutes on pricing. Agent calls within 90 seconds with pricing context loaded.",
                  metric: "90s",
                  metricLabel: "avg response",
                },
                {
                  title: "Repeat Visit → Re-engage",
                  desc: "Same company visits 3x in a week. Agent calls with personalized follow-up referencing prior visits.",
                  metric: "3x",
                  metricLabel: "visit threshold",
                },
                {
                  title: "Job Change → Warm Outreach",
                  desc: "Champion moves to new company. Agent calls within 24h with congratulations and relevant pitch.",
                  metric: "24h",
                  metricLabel: "detection window",
                },
              ].map((item, i) => (
                <GlassCard
                  key={i}
                  className="p-5"
                  glowColor="rgba(255,255,255,0.03)"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white mb-1.5 font-display">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/40 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p
                        className="text-xl font-bold font-display text-white"
                      >
                        {item.metric}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {item.metricLabel}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Script Builder Section ───────────────────────────────────────────────────
const scriptTabs = ["Opener", "Qualification", "Objection", "Close"];

function ScriptBuilderSection() {
  const [activeTab, setActiveTab] = useState(0);

  const scripts = [
    {
      lines: [
        {
          type: "agent",
          text: "Hi {{first_name}}, this is Aria from Outmate.",
        },
        {
          type: "agent",
          text: "I noticed {{company}} was on our pricing page — wanted to reach out personally.",
        },
        { type: "variable", text: "{{intent_signal}} → pricing_page_visit" },
        {
          type: "agent",
          text: "Do you have 2 minutes to chat about what you were looking at?",
        },
      ],
    },
    {
      lines: [
        {
          type: "agent",
          text: "What's your current outbound process look like?",
        },
        { type: "variable", text: "{{qualify_budget}} → check CRM field" },
        {
          type: "agent",
          text: "Are you the right person to evaluate tools like this?",
        },
        {
          type: "branch",
          text: "IF decision_maker → continue | ELSE → ask for referral",
        },
      ],
    },
    {
      lines: [
        {
          type: "agent",
          text: "I totally understand the concern about AI calls.",
        },
        {
          type: "variable",
          text: '{{objection_type}} → detected: "sounds robotic"',
        },
        {
          type: "agent",
          text: "Our agents are trained on 10M+ real sales calls — want to hear a sample?",
        },
        {
          type: "branch",
          text: "IF yes → play_sample | IF no → schedule_human_call",
        },
      ],
    },
    {
      lines: [
        {
          type: "agent",
          text: "Based on what you've shared, I think we're a great fit.",
        },
        {
          type: "variable",
          text: "{{calendar_link}} → auto-generated for {{rep_name}}",
        },
        {
          type: "agent",
          text: "I'm sending you a calendar link right now — does Thursday work?",
        },
        { type: "branch", text: "IF booked → CRM_update + Slack_notify" },
      ],
    },
  ];

  const lineColors: Record<string, string> = {
    agent: "#FFFFFF",
    variable: "#A1A1AA",
    branch: "#E5E5E5",
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <FileText className="w-3.5 h-3.5" />
            Script Builder
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            AI-native conversation design
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Build dynamic scripts with live variables, branching logic, and
            real-time context injection.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <GlassCard
            className="max-w-4xl mx-auto overflow-hidden"
            glowColor="rgba(255,255,255,0.03)"
          >
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-5 pt-5 pb-0 border-b border-white/[0.06]">
              {scriptTabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className="relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-t-lg"
                  style={{
                    color:
                      activeTab === i ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {tab}
                  {activeTab === i && (
                    <motion.div
                      layoutId="scriptTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-white"
                    />
                  )}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 pb-2">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-xs text-white/30 font-mono">
                  AI-generated
                </span>
              </div>
            </div>

            {/* Script editor */}
            <div className="p-6 font-mono text-sm space-y-3 min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {scripts[activeTab].lines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-white/20 text-xs mt-0.5 w-4 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-start gap-2 flex-1">
                        {line.type === "branch" && (
                          <GitBranch
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/40"
                          />
                        )}
                        {line.type === "variable" && (
                          <Cpu
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/40"
                          />
                        )}
                        {line.type === "agent" && (
                          <Mic className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/20" />
                        )}
                        <span
                          style={{ color: lineColors[line.type] || "#FFFFFF" }}
                          className="leading-relaxed"
                        >
                          {line.text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {/* Blinking cursor */}
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-white/20 text-xs w-4">05</span>
                    <div className="w-2 h-4 bg-white/20 rounded-sm" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-4">
                {[
                  { label: "Variables", count: 4, color: "#FFFFFF" },
                  { label: "Branches", count: 2, color: "#A1A1AA" },
                  { label: "Steps", count: 4, color: "#E5E5E5" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-white/40">
                      {item.count} {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Regenerate with AI
              </button>
            </div>
          </GlassCard>
        </SectionReveal>
      </div>
    </section>
  );
}

// ─── Call Recording & Playback ────────────────────────────────────────────────
function CallRecordingSection() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () => setProgress((p) => (p >= 100 ? 0 : p + 0.5)),
      100,
    );
    return () => clearInterval(t);
  }, [playing]);

  const insights = [
    { label: "Sentiment", value: "Positive", color: "#FFFFFF", pct: 82 },
    { label: "Objections", value: "2 detected", color: "#A1A1AA", pct: 40 },
    { label: "Qualification", value: "High fit", color: "#E5E5E5", pct: 91 },
    { label: "Booking Intent", value: "Strong", color: "#FFFFFF", pct: 88 },
  ];

  const transcript = [
    {
      speaker: "Agent",
      text: "Hi Marcus, this is Aria from Outmate. I noticed Linear was on our pricing page — wanted to reach out personally.",
      time: "0:04",
    },
    {
      speaker: "Marcus",
      text: "Oh interesting, yeah I was checking it out. How did you know I was there?",
      time: "0:12",
    },
    {
      speaker: "Agent",
      text: "We track intent signals from companies visiting our site. You're actually a perfect fit for what we do.",
      time: "0:18",
    },
    {
      speaker: "Marcus",
      text: "That's actually pretty cool. Tell me more about the voice AI piece.",
      time: "0:28",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02),transparent_50%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Headphones className="w-3.5 h-3.5" />
            Call Recording & Playback
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            Every call, analyzed and archived
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Full recordings, AI transcripts, sentiment analysis, and coaching
            insights — automatically.
          </p>
        </SectionReveal>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 max-w-6xl mx-auto">
          {/* Left: Player + Transcript */}
          <SectionReveal direction="right">
            <GlassCard
              className="overflow-hidden"
              glowColor="rgba(255,255,255,0.05)"
            >
              {/* Call header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                    MW
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Marcus Webb · Linear
                    </p>
                    <p className="text-xs text-white/35">
                      May 28, 2026 · 4:12 duration
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium text-white/80 border border-white/20"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  Meeting Booked
                </span>
              </div>

              {/* Waveform player */}
              <div className="px-6 py-5">
                <LiveWaveform active={playing} bars={48} color="#FFFFFF" />
                {/* Progress bar */}
                <div className="mt-3 relative">
                  <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-white/30 font-mono">
                      {Math.floor((progress * 4.12) / 100)}:
                      {String(
                        Math.floor((((progress * 4.12) / 100) % 1) * 60),
                      ).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-white/30 font-mono">
                      4:12
                    </span>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold transition-all hover:scale-105 bg-white"
                  >
                    {playing ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transcript */}
              <div className="px-6 pb-6 space-y-3 border-t border-white/[0.06] pt-5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Transcript
                </p>
                {transcript.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3"
                  >
                    <span className="text-xs font-mono text-white/25 mt-0.5 w-8 flex-shrink-0">
                      {line.time}
                    </span>
                    <div>
                      <span
                        className="text-xs font-semibold mr-2"
                        style={{
                          color:
                            line.speaker === "Agent" ? "#FFFFFF" : "#A1A1AA",
                        }}
                      >
                        {line.speaker}
                      </span>
                      <span className="text-xs text-white/50 leading-relaxed">
                        {line.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </SectionReveal>

          {/* Right: AI Insights */}
          <SectionReveal direction="left" delay={0.15}>
            <GlassCard
              className="p-6 h-full"
              glowColor="rgba(255,255,255,0.05)"
            >
              <p className="text-sm font-semibold text-white mb-5 font-display">
                AI Call Insights
              </p>
              <div className="space-y-5">
                {insights.map((insight, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-white/50">
                        {insight.label}
                      </span>
                      <span
                        className="text-xs font-semibold text-white"
                      >
                        {insight.value}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${insight.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: i * 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full rounded-full bg-white"
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-8 space-y-3">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Key Moments
                  </p>
                  {[
                    {
                      time: "0:28",
                      label: "Interest spike detected",
                      color: "#FFFFFF",
                    },
                    {
                      time: "1:45",
                      label: 'Objection: "too expensive"',
                      color: "#A1A1AA",
                    },
                    {
                      time: "2:12",
                      label: "Objection handled successfully",
                      color: "#E5E5E5",
                    },
                    { time: "3:50", label: "Meeting booked", color: "#FFFFFF" },
                  ].map((moment, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span className="text-xs font-mono text-white/30 w-8">
                        {moment.time}
                      </span>
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/40"
                      />
                      <span className="text-xs text-white/60">
                        {moment.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

// ─── Campaign Workflow Section ────────────────────────────────────────────────
const workflowSteps = [
  {
    num: "01",
    title: "Select Audience",
    desc: "Pull from B2B database, CRM, or upload a list. AI filters by ICP fit and intent score.",
    icon: Users,
    color: "#FFFFFF",
  },
  {
    num: "02",
    title: "Apply Logic",
    desc: "Set triggers, timing rules, call objectives, and fallback sequences.",
    icon: GitBranch,
    color: "#E5E5E5",
  },
  {
    num: "03",
    title: "Launch Campaign",
    desc: "One click deploys agents across your entire audience. Real-time monitoring from day one.",
    icon: Zap,
    color: "#FFFFFF",
  },
  {
    num: "04",
    title: "Sync Outcomes",
    desc: "Every call result, transcript, and booked meeting syncs to your CRM automatically.",
    icon: RefreshCw,
    color: "#A1A1AA",
  },
];

function CampaignWorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActiveStep((p) => (p + 1) % workflowSteps.length),
      2500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_60%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Workflow className="w-3.5 h-3.5" />
            Campaign Workflow
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            From audience to outcome in 4 steps
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            A futuristic orchestration engine that runs your entire outbound
            motion autonomously.
          </p>
        </SectionReveal>

        <div className="max-w-5xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[28px] top-8 bottom-8 w-px bg-white/10 hidden lg:block" />

            <div className="space-y-4">
              {workflowSteps.map((step, i) => (
                <SectionReveal key={i} delay={i * 0.1}>
                  <motion.div
                    animate={{
                      opacity: activeStep === i ? 1 : 0.5,
                      x: activeStep === i ? 0 : -4,
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex gap-6 cursor-pointer"
                    onClick={() => setActiveStep(i)}
                  >
                    {/* Step indicator */}
                    <div className="flex-shrink-0 relative z-10">
                      <motion.div
                        animate={{
                          background:
                            activeStep === i
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(255,255,255,0.04)",
                          borderColor:
                            activeStep === i
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.08)",
                        }}
                        className="w-14 h-14 rounded-2xl border flex items-center justify-center"
                      >
                        <step.icon
                          className="w-6 h-6 text-white"
                        />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <GlassCard
                      className="flex-1 p-5"
                      glowColor={
                        activeStep === i ? "rgba(255,255,255,0.05)" : "transparent"
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="text-xs font-mono text-white/40"
                            >
                              {step.num}
                            </span>
                            <h3 className="font-display text-base font-semibold text-white">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-sm text-white/40 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                        {activeStep === i && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 ml-4"
                          >
                            <PulseDot color="#FFFFFF" size={6} />
                          </motion.div>
                        )}
                      </div>
                      {activeStep === i && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.5, ease: "linear" }}
                          className="absolute bottom-0 left-0 h-[2px] rounded-full bg-white/20"
                        />
                      )}
                    </GlassCard>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases Section ────────────────────────────────────────────────────────
const useCases = [
  {
    icon: TrendingUp,
    title: "Inbound Speed-to-Lead",
    subtitle: "Call within 90 seconds of form fill",
    desc: "The moment a prospect fills out a form, your AI agent calls them before they even check their email. 10x higher connect rates.",
    metric: "10x",
    metricLabel: "connect rate",
    color: "#FFFFFF",
    tags: ["Inbound", "Speed", "Qualification"],
  },
  {
    icon: RotateCcw,
    title: "Re-engagement Campaigns",
    subtitle: "Revive cold leads automatically",
    desc: "AI identifies dormant leads showing new intent signals and re-engages them with personalized context from prior interactions.",
    metric: "34%",
    metricLabel: "revival rate",
    color: "#E5E5E5",
    tags: ["Re-engage", "Pipeline", "Automation"],
  },
  {
    icon: Building2,
    title: "Account-Based Outbound",
    subtitle: "Coordinate multi-threaded calling",
    desc: "Target multiple stakeholders at the same account simultaneously. AI coordinates messaging to avoid conflicts.",
    metric: "3.2x",
    metricLabel: "pipeline velocity",
    color: "#FFFFFF",
    tags: ["ABM", "Enterprise", "Multi-thread"],
  },
  {
    icon: Calendar,
    title: "Event Follow-up",
    subtitle: "Strike while intent is hot",
    desc: "After webinars, conferences, or product launches — AI calls every attendee within hours with relevant follow-up.",
    metric: "48h",
    metricLabel: "follow-up window",
    color: "#A1A1AA",
    tags: ["Events", "Follow-up", "Timing"],
  },
];

function UseCasesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.02),transparent_50%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Bot className="w-3.5 h-3.5" />
            Use Cases
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            Built for every outbound motion
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            From inbound speed-to-lead to enterprise ABM — Voice AI adapts to
            your GTM strategy.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mxauto">
          {useCases.map((uc, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <GlassCard
               
                className="p-7 h-full group"
                               glowColor="rgba(255,255,255,0.03)"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10"
                  >
                    <uc.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold font-display text-white"
                    >
                      {uc.metric}
                    </p>
                    <p className="text-xs text-white/30">{uc.metricLabel}</p>
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-1 tracking-tight">
                  {uc.title}
                </h3>
                <p
                  className="text-sm font-medium mb-3 text-white/60"
                >
                  {uc.subtitle}
                </p>
                <p className="text-sm text-white/40 leading-relaxed mb-5">
                  {uc.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {uc.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-2.5 py-1 rounded-full text-white/40 border border-white/[0.08]"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Performance Metrics Section ──────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const metrics = [
  {
    value: 247,
    suffix: "",
    label: "Calls per day",
    sublabel: "per agent",
    color: "#FFFFFF",
    icon: Phone,
  },
  {
    value: 12.6,
    suffix: "%",
    label: "Meeting rate",
    sublabel: "industry avg: 3.2%",
    color: "#FFFFFF",
    icon: Calendar,
  },
  {
    value: 94,
    suffix: "%",
    label: "Answer rate",
    sublabel: "with local presence",
    color: "#FFFFFF",
    icon: Activity,
  },
  {
    value: 4.8,
    suffix: "x",
    label: "Pipeline ROI",
    sublabel: "vs human SDR",
    color: "#FFFFFF",
    icon: TrendingUp,
  },
];

function PerformanceMetricsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Performance Metrics
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            Numbers that speak for themselves
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Real performance data from Outmate customers running autonomous
            voice campaigns.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {metrics.map((metric, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <GlassCard
                className="p-6 text-center"
                glowColor="rgba(255,255,255,0.03)"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 bg-white/5 border border-white/10"
                >
                  <metric.icon
                    className="w-5 h-5 text-white/60"
                  />
                </div>
                <p
                  className="text-3xl font-bold font-display mb-1 text-white"
                >
                  <AnimatedCounter
                    target={metric.value}
                    suffix={metric.suffix}
                  />
                </p>
                <p className="text-sm font-semibold text-white mb-1">
                  {metric.label}
                </p>
                <p className="text-xs text-white/30">{metric.sublabel}</p>
              </GlassCard>
            </SectionReveal>
          ))}
        </div>

        {/* Live activity bar */}
        <SectionReveal delay={0.3}>
          <GlassCard
            className="max-w-5xl mx-auto p-6"
            glowColor="rgba(255,255,255,0.03)"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-white font-display">
                  Live Campaign Performance
                </p>
                <p className="text-xs text-white/35 mt-0.5">
                  Last 7 days · Updated in real-time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PulseDot color="#FFFFFF" size={5} />
                <span className="text-xs text-white/40 font-mono">Live</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 items-end h-24">
              {[65, 82, 71, 94, 88, 76, 100].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full rounded-t-lg"
                    style={{
                      background:
                        i === 6
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.1)",
                      minHeight: 4,
                    }}
                  />
                  <span className="text-[10px] text-white/25 font-mono">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </SectionReveal>
      </div>
    </section>
  );
}

// ─── Customer Proof Section ───────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "We replaced 3 SDRs with Outmate Voice AI and tripled our meeting volume. The agents handle objections better than most humans I've hired.",
    name: "Jordan Kim",
    title: "VP of Sales",
    company: "Meridian SaaS",
    avatar: "JK",
    metric: "3x meetings",
  },
  {
    quote:
      "The signal-triggered calling is insane. A prospect visits our pricing page and gets a call within 90 seconds. Our close rate on those calls is 28%.",
    name: "Priya Sharma",
    title: "Head of Growth",
    company: "Flowstack",
    avatar: "PS",
    metric: "28% close rate",
  },
  {
    quote:
      "I was skeptical about AI calls. Then I listened to the recordings. Our prospects literally can't tell it's not a human. Game changer.",
    name: "Marcus Chen",
    title: "Founder & CEO",
    company: "Launchpad AI",
    avatar: "MC",
    metric: "94% answer rate",
  },
];

function CustomerProofSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_60%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Star className="w-3.5 h-3.5" />
            Customer Proof
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            Trusted by teams that close
          </h2>
        </SectionReveal>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard
                className="p-10 text-center relative overflow-hidden"
                glowColor="rgba(255,255,255,0.05)"
              >
                {/* Spotlight */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none opacity-20 bg-white"
                />

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-white text-white opacity-80"
                    />
                  ))}
                </div>

                <blockquote className="text-xl text-white/80 leading-relaxed font-display tracking-tight mb-8 max-w-2xl mx-auto">
                  "{testimonials[active].quote}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-white/10 border border-white/20 text-white"
                  >
                    {testimonials[active].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">
                      {testimonials[active].name}
                    </p>
                    <p className="text-xs text-white/40">
                      {testimonials[active].title} ·{" "}
                      {testimonials[active].company}
                    </p>
                  </div>
                  <div
                    className="ml-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/80"
                  >
                    {testimonials[active].metric}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Selector dots */}
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="transition-all duration-300"
              >
                <motion.div
                  animate={{
                    width: active === i ? 24 : 8,
                    opacity: active === i ? 1 : 0.3,
                  }}
                  className="h-2 rounded-full bg-white"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Integrations Section ─────────────────────────────────────────────────────
const integrations = [
  { name: "HubSpot", abbr: "HS" },
  { name: "Salesforce", abbr: "SF" },
  { name: "Slack", abbr: "SL" },
  { name: "Apollo", abbr: "AP" },
  { name: "Gmail", abbr: "GM" },
  { name: "Notion", abbr: "NT" },
  { name: "Clay", abbr: "CL" },
  { name: "Outreach", abbr: "OR" },
];

function IntegrationsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03),transparent_50%)]" />
      <div className="container-limit relative z-10">
        <SectionReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs font-medium mb-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Cpu className="w-3.5 h-3.5" />
            Integrations
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-[-2px] mb-4">
            Plugs into your entire stack
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Native integrations with every tool your GTM team already uses.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="relative max-w-3xl mx-auto">
            {/* Center hub */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 rounded-full border border-white/5"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-96 h-96 rounded-full border border-white/[0.03]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div
                className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center bg-white/5 border border-white/20 shadow-xl"
              >
                <Radio className="w-8 h-8 text-white/60" />
              </div>
            </div>

            {/* Integration grid */}
            <div className="grid grid-cols-4 gap-3 mt-8">
              {integrations.map((integration, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                >
                  <GlassCard
                    className="p-4 text-center"
                    glowColor="rgba(255,255,255,0.03)"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-sm font-bold bg-white/5 border border-white/10 text-white/60"
                    >
                      {integration.abbr}
                    </div>
                    <p className="text-xs text-white/40 font-medium">
                      {integration.name}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-white/30">
                + 40 more integrations via Zapier & native API
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

// ─── Final CTA Section ────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="relative py-40 overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px]" />
      </div>

      <div className="container-limit relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 text-white/60 text-xs font-medium mb-8"
          >
            <PulseDot color="#FFFFFF" size={5} />
            Ready to deploy
          </div>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-[-3px] mb-6 max-w-4xl mx-auto leading-[1.02]">
            Deploy your first autonomous outbound agent in minutes.
          </h2>

          <p className="text-xl text-white/40 max-w-xl mx-auto mb-12 leading-relaxed font-medium">
            No SDR training. No script writing. No missed signals. Just
            pipeline.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black text-base font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-300 bg-white/5 backdrop-blur-md"
            >
              Start Building
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-14">
            {[
              { icon: Shield, label: "SOC 2 Compliant" },
              { icon: Clock, label: "Setup in < 10 min" },
              { icon: CheckCircle2, label: "No credit card required" },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-white/30"
              >
                <badge.icon className="w-4 h-4 text-white/20" />
                {badge.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function VoiceAIAgent() {
  return (
    <>
      <div className="bg-[#0A0A0B] min-h-screen selection:bg-white selection:text-black">
        <AmbientBackground />
        <HeroSection />
        <AgentControlSection />
        <SignalTriggeredSection />
        <ScriptBuilderSection />
        <CallRecordingSection />
        <CampaignWorkflowSection />
        <UseCasesSection />
        <PerformanceMetricsSection />
        <CustomerProofSection />
        <IntegrationsSection />
        <FinalCTASection />
        <Footer />
      </div>
    </>
  );
}
