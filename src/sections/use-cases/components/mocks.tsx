import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ──────────────────────────────────────────────────────────────────────────────
//  Small, reusable "product UI" primitives shared by the per-page wow visuals so
//  every mock reads as the same product. Decorative — aria-hidden by the caller.
// ──────────────────────────────────────────────────────────────────────────────

// A floating dark glass app window with a faux title bar.
export function GlassWindow({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121214]/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        {title && <span className="ml-2 font-mono text-[11px] text-white/40">{title}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// Light variant for the light deep-dive bands.
export function LightWindow({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        {title && <span className="ml-2 font-mono text-[11px] text-slate-400">{title}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

const AVATAR_COLORS = ['#6366F1', '#0EA5E9', '#14B8A6', '#F59E0B', '#F43F5E', '#8B5CF6', '#10B981']

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  )
}

// 0-100 ICP score chip, colour-graded by heat.
export function ScoreChip({ score, tone = 'dark' }: { score: number; tone?: 'dark' | 'light' }) {
  const isDark = tone === 'dark'
  const style =
    score >= 80
      ? 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/25'
      : score >= 60
        ? 'bg-amber-500/15 text-amber-500 ring-amber-500/25'
        : isDark
          ? 'bg-white/5 text-white/50 ring-white/10'
          : 'bg-slate-100 text-slate-400 ring-slate-200'
  return (
    <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold ring-1', style)}>
      {score}
    </span>
  )
}

// A live "● Live" pulsing status dot.
export function LiveDot({ label = 'Live' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: 'sandbox-pulse 1.6s ease-in-out infinite' }} />
      {label}
    </span>
  )
}
