import { Slack } from 'lucide-react'

// Compact, real-looking mini UI previews paired with each "What you get" card.
// Variant is chosen by card index so every feature block shows the product.

function FeedVisual() {
  const rows = [
    { i: 'AR', n: 'Atlas Robotics', s: 92 },
    { i: 'LC', n: 'Lumen Cloud', s: 78 },
    { i: 'VH', n: 'Vertex Health', s: 64 },
  ]
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.n} className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2 ring-1 ring-slate-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">{r.i}</span>
          <span className="flex-1 truncate text-[12px] font-medium text-slate-700">{r.n}</span>
          <span className={`font-mono text-[11px] font-bold ${r.s >= 80 ? 'text-emerald-600' : 'text-slate-400'}`}>{r.s}</span>
        </div>
      ))}
    </div>
  )
}

function ScoreVisual() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-1">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="97" strokeDashoffset="18" strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[15px] font-bold text-slate-800">81</span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">ICP score</span>
    </div>
  )
}

function SlackVisual() {
  return (
    <div className="rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
      <div className="flex items-center gap-1.5">
        <Slack className="h-3.5 w-3.5 text-[#4A154B]" />
        <span className="text-[11px] font-semibold text-slate-700">#hot-leads</span>
      </div>
      <div className="mt-2 rounded-md bg-blue-50/60 p-2 ring-1 ring-blue-100">
        <p className="text-[11px] leading-snug text-slate-600">
          <span className="font-semibold text-slate-800">VP Sales @ Atlas Robotics</span> is on your pricing page — ICP 92.
        </p>
        <div className="mt-1.5 flex gap-1.5">
          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">Email</span>
          <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-600 ring-1 ring-slate-200">CRM</span>
        </div>
      </div>
    </div>
  )
}

function RouteVisual() {
  return (
    <div className="flex items-center justify-between gap-1.5 py-3">
      <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-white">Lead</span>
      <span className="h-px flex-1 bg-gradient-to-r from-slate-300 to-blue-400" />
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-[9px] font-bold text-white">AI</span>
      <span className="h-px flex-1 bg-gradient-to-r from-blue-400 to-emerald-400" />
      <span className="rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-medium text-white">Rep</span>
    </div>
  )
}

const VARIANTS = [FeedVisual, ScoreVisual, SlackVisual, RouteVisual]

export default function CardVisual({ index }: { index: number }) {
  const Variant = VARIANTS[index % VARIANTS.length]
  return (
    <div aria-hidden className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <Variant />
    </div>
  )
}
