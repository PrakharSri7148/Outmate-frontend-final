import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

// Two-column Before / After comparison. Before = muted red X, After = emerald Check.
export default function BeforeAfter({ before, after }: { before: string[]; after: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="rounded-[24px] border border-slate-200 bg-white/60 p-7 md:p-8">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Before Outmate</span>
        <ul className="mt-5 flex flex-col gap-3.5">
          {before.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease, delay: i * 0.05 }}
              className="flex items-start gap-3 text-[14px] leading-[1.55] text-slate-500"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-400 ring-1 ring-rose-100">
                <X className="h-3 w-3" strokeWidth={3} />
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="rounded-[24px] border border-blue-100 bg-gradient-to-b from-blue-50/70 to-white p-7 md:p-8">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">With Outmate</span>
        <ul className="mt-5 flex flex-col gap-3.5">
          {after.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease, delay: i * 0.05 }}
              className="flex items-start gap-3 text-[14px] font-medium leading-[1.55] text-slate-800"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
