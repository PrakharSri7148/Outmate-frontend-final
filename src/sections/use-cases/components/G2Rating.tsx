import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { G2 } from '../types'

// G2-style star rating + review count. `tone` adapts to dark hero vs light footer.
export default function G2Rating({
  className = '',
  tone = 'dark',
}: {
  className?: string
  tone?: 'dark' | 'light'
}) {
  const full = Math.floor(G2.rating)
  const hasHalf = G2.rating - full >= 0.5

  return (
    <div
      className={cn('inline-flex items-center gap-2.5', className)}
      aria-label={`Rated ${G2.rating} out of 5 ${G2.label}, ${G2.reviews}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && hasHalf)
          return (
            <Star
              key={i}
              className={cn('h-4 w-4', filled ? 'text-amber-400' : tone === 'dark' ? 'text-white/20' : 'text-slate-300')}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={filled ? 0 : 1.6}
            />
          )
        })}
      </div>
      <span className={cn('text-[13px] font-medium', tone === 'dark' ? 'text-white/80' : 'text-slate-700')}>
        <span className="font-semibold">{G2.rating}</span> {G2.label}
      </span>
      <span className={cn('text-[13px]', tone === 'dark' ? 'text-white/40' : 'text-slate-400')}>· {G2.reviews}</span>
    </div>
  )
}
