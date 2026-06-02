import { ShieldCheck, Lock, FileCheck, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGES = [
  { label: 'SOC 2 Type II', icon: ShieldCheck },
  { label: 'GDPR-ready', icon: Globe },
  { label: 'CCPA', icon: FileCheck },
  { label: 'DPA on request', icon: Lock },
]

// Pill trust badges in the HeroSection style. `tone` adapts to dark vs light bands.
export default function TrustBadges({
  className = '',
  tone = 'light',
}: {
  className?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <ul className={cn('flex flex-wrap items-center justify-center gap-2.5', className)} aria-label="Compliance and security">
      {BADGES.map(({ label, icon: Icon }) => (
        <li
          key={label}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium',
            tone === 'dark'
              ? 'border-white/10 bg-white/[0.04] text-white/80'
              : 'border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
          )}
        >
          <Icon className={cn('h-4 w-4', tone === 'dark' ? 'text-white/55' : 'text-blue-600')} strokeWidth={1.8} />
          {label}
        </li>
      ))}
    </ul>
  )
}

// Compact inline compliance line for the hero eyebrow row.
export function ComplianceLine({ className = '', theme = 'dark' }: { className?: string; theme?: 'dark' | 'light' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[12px] font-medium',
        theme === 'dark' ? 'text-white/45' : 'text-slate-500',
        className,
      )}
    >
      <ShieldCheck className={cn('h-3.5 w-3.5', theme === 'dark' ? 'text-emerald-400/80' : 'text-emerald-600')} strokeWidth={2} />
      SOC 2 · GDPR · CCPA
    </span>
  )
}
