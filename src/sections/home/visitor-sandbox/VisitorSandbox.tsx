import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Search, Check, ChevronRight, Sparkles, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, ROWS, FOCAL_INDEX } from './data'

// ── Fixed internal "design" resolution. Everything is laid out in these px and
//    the whole stage is uniformly scaled to fit its container, so the cursor can
//    animate in stable transform-space and stay crisp at any width.
const DESIGN_W = 700
const DESIGN_H = 720

const SIDEBAR_W = 184
const TOPBAR_H = 56
const LIST_TOP = 150
const ROW_H = 82
const ROW_GAP = 6

const ease = [0.22, 1, 0.36, 1] as const

// Key focal coordinates (design px)
const IDENTIFY_BTN = { x: 612, y: 28 }
const focalRowTop = LIST_TOP + FOCAL_INDEX * (ROW_H + ROW_GAP)
const FOCAL_HOVER = { x: 648, y: focalRowTop + ROW_H / 2 }
const LENS_CENTER = { x: SIDEBAR_W + 150, y: focalRowTop + ROW_H / 2 }
const PUSH_BTN = { x: 540, y: focalRowTop + 250 }
const CURSOR_START = { x: 660, y: 690 }

type Cursor = { x: number; y: number }

// ────────────────────────────────────────────────────────────────────────────
//  Scale-to-fit hook
// ────────────────────────────────────────────────────────────────────────────
function useFitScale(ref: React.RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      setScale(Math.min(width / DESIGN_W, height / DESIGN_H))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return scale
}

// ────────────────────────────────────────────────────────────────────────────
//  Visitor row
// ────────────────────────────────────────────────────────────────────────────
function VisitorRowCard({
  index,
  identified,
  focal,
}: {
  index: number
  identified: boolean
  focal: boolean
}) {
  const r = ROWS[index]
  return (
    <div
      className={cn(
        'flex h-full items-center gap-3 rounded-2xl border px-4 transition-colors duration-500',
        focal && identified
          ? 'border-[#bbf7d0] bg-[#f0fdf4]'
          : 'border-[#EDEFF2] bg-white',
      )}
    >
      {/* avatar / pulsing dot */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {identified ? (
            <motion.div
              key="avatar"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold text-white"
              style={{ background: r.avatar }}
            >
              {r.initials}
            </motion.div>
          ) : (
            <motion.span
              key="dot"
              exit={{ scale: 0, opacity: 0 }}
              className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]"
              style={{ animation: 'sandbox-pulse 1.6s ease-in-out infinite' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* identity */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'truncate text-[14px] font-semibold tracking-[-0.01em]',
              identified ? 'text-[#0F172A]' : 'text-[#94A3B8]',
            )}
          >
            {identified ? r.company : 'Anonymous visitor'}
          </span>
          {identified && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-medium text-[#64748B]"
            >
              {r.title}
            </motion.span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
          <Globe className="h-3 w-3" strokeWidth={2} />
          <span>{r.country}</span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="font-mono text-[#64748B]">{r.path}</span>
        </div>
      </div>

      {/* enrichment chips */}
      <div className="hidden w-[150px] shrink-0 items-center justify-end gap-1.5 sm:flex">
        <AnimatePresence>
          {identified && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="rounded-md bg-[#F8FAFC] px-2 py-1 text-[10px] font-medium text-[#475569] ring-1 ring-[#EDEFF2]"
              >
                {r.industry}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.06 }}
                className="rounded-md bg-[#F8FAFC] px-2 py-1 text-[10px] font-medium text-[#475569] ring-1 ring-[#EDEFF2]"
              >
                {r.employees}
              </motion.span>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* intent score */}
      <div className="flex w-[64px] shrink-0 flex-col items-end">
        {identified ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-1"
          >
            <span
              className={cn(
                'text-[15px] font-bold tabular-nums',
                r.intent >= 80
                  ? 'text-[#16A34A]'
                  : r.intent >= 60
                    ? 'text-[#475569]'
                    : 'text-[#94A3B8]',
              )}
            >
              {r.intent}
            </span>
            <span className="text-[10px] text-[#CBD5E1]">/100</span>
          </motion.div>
        ) : (
          <span className="text-[13px] text-[#CBD5E1]">—</span>
        )}
        <span className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[#CBD5E1]">
          intent
        </span>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
//  Magnify lens (loupe over the focal row) + detail popover
// ────────────────────────────────────────────────────────────────────────────
function MagnifyLens({ pushPressed }: { pushPressed: boolean }) {
  const r = ROWS[FOCAL_INDEX]
  return (
    <>
      {/* circular loupe */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.2, opacity: 0 }}
        transition={{ duration: 0.45, ease }}
        className="pointer-events-none absolute z-30 flex items-center justify-center rounded-full bg-white"
        style={{
          left: LENS_CENTER.x - 96,
          top: LENS_CENTER.y - 96,
          width: 192,
          height: 192,
          boxShadow:
            '0 0 0 6px rgba(255,255,255,0.9), 0 0 0 7px #E2E8F0, 0 24px 50px -12px rgba(15,23,42,0.45)',
          willChange: 'transform',
        }}
      >
        {/* magnified focal content (≈1.9x of the row) */}
        <div className="flex flex-col items-center gap-2 px-3 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-[22px] font-semibold text-white"
            style={{ background: r.avatar }}
          >
            {r.initials}
          </div>
          <div className="text-[16px] font-bold tracking-[-0.01em] text-[#0F172A]">
            {r.company}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[26px] font-black leading-none text-[#16A34A] tabular-nums">
              {r.intent}
            </span>
            <span className="text-[12px] font-semibold text-[#16A34A]">HIGH</span>
          </div>
        </div>
        {/* glass sheen */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.65) 0%, transparent 42%)',
          }}
        />
      </motion.div>

      {/* detail popover */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.4, ease, delay: 0.1 }}
        className="absolute z-20 w-[300px] rounded-2xl border border-[#E6E8EC] bg-white p-4"
        style={{
          left: SIDEBAR_W + 232,
          top: focalRowTop + 96,
          boxShadow: '0 24px 60px -18px rgba(15,23,42,0.35)',
          willChange: 'transform',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[#0F172A]">{r.contact}</span>
          <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A]">
            <Sparkles className="h-3 w-3" /> Intent: High
          </span>
        </div>
        <div className="mt-1 font-mono text-[11px] text-[#64748B]">{r.emailMasked}</div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.pages.map((p) => (
            <span
              key={p}
              className="rounded-md bg-[#F8FAFC] px-2 py-1 font-mono text-[10px] text-[#475569] ring-1 ring-[#EDEFF2]"
            >
              {p}
            </span>
          ))}
        </div>

        <div
          className={cn(
            'mt-4 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-semibold text-white transition-transform duration-150',
            pushPressed ? 'scale-[0.97] bg-[#15803D]' : 'bg-[#16A34A]',
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} /> Push to CRM
        </div>
      </motion.div>
    </>
  )
}

// ────────────────────────────────────────────────────────────────────────────
//  The app window (shared by animated + reduced-motion render)
// ────────────────────────────────────────────────────────────────────────────
function AppWindow({
  identifiedCount,
  rowIdentified,
  buttonPressed,
}: {
  identifiedCount: number
  rowIdentified: boolean[]
  buttonPressed: boolean
}) {
  return (
    <div
      className="absolute inset-0 flex overflow-hidden rounded-[20px] bg-white"
      style={{ border: '1px solid #E6E8EC' }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col gap-1 border-r border-[#EDEFF2] bg-[#FBFCFD] py-4"
        style={{ width: SIDEBAR_W }}
      >
        <div className="flex items-center gap-2 px-4 pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F172A] text-[13px] font-black text-white">
            O
          </div>
          <span className="text-[14px] font-bold tracking-[-0.02em] text-[#0F172A]">
            Outmate
          </span>
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className={cn(
                'mx-2 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium',
                item.active
                  ? 'bg-[#EEF1F5] text-[#0F172A]'
                  : 'text-[#6B7280]',
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
              {item.active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              )}
            </div>
          )
        })}
        <div className="mt-auto mx-3 rounded-xl bg-[#F1F5F9] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
            Identified today
          </div>
          <div className="mt-1 text-[22px] font-black tabular-nums text-[#0F172A]">
            {identifiedCount}
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col">
        {/* top bar */}
        <div
          className="flex items-center gap-3 border-b border-[#EDEFF2] px-4"
          style={{ height: TOPBAR_H }}
        >
          <div className="flex items-center gap-1.5 rounded-lg bg-[#F1F5F9] px-2.5 py-1.5 text-[12px] font-medium text-[#475569]">
            <Globe className="h-3.5 w-3.5" /> yoursite.com
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#F8FAFC] px-2.5 py-1.5 text-[12px] text-[#94A3B8] ring-1 ring-[#EDEFF2]">
            <Search className="h-3.5 w-3.5" /> Search visitors…
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-transform duration-150',
              buttonPressed ? 'scale-[0.96] bg-[#1e293b]' : 'bg-[#0F172A]',
            )}
          >
            <Sparkles className="h-3.5 w-3.5" /> Identify visitors
          </div>
        </div>

        {/* panel header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-bold tracking-[-0.02em] text-[#0F172A]">
                Live Visitors
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
                  style={{ animation: 'sandbox-pulse 1.6s ease-in-out infinite' }}
                />
                Live
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-[#94A3B8]">
              Real-time account-level identification
            </p>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748B]">
            Last 30 min <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* rows */}
        <div className="flex flex-col gap-1.5 px-5">
          {ROWS.map((_, i) => (
            <div key={i} style={{ height: ROW_H }}>
              <VisitorRowCard
                index={i}
                identified={rowIdentified[i]}
                focal={i === FOCAL_INDEX}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
//  Main export
// ────────────────────────────────────────────────────────────────────────────
export default function VisitorSandbox() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const scale = useFitScale(containerRef)
  const inView = useInView(containerRef, { amount: 0.3 })
  const reduceMotion = useReducedMotion()

  const allIdentified = ROWS.map(() => true)

  const [rowIdentified, setRowIdentified] = useState<boolean[]>(ROWS.map(() => false))
  const [identifiedCount, setIdentifiedCount] = useState(0)
  const [cursor, setCursor] = useState<Cursor>(CURSOR_START)
  const [clicking, setClicking] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)
  const [pushPressed, setPushPressed] = useState(false)
  const [lensOn, setLensOn] = useState(false)
  const [toast, setToast] = useState(false)
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number } | null>(null)
  const rippleId = useRef(0)

  useEffect(() => {
    if (reduceMotion || !inView) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms)
        timers.push(t)
      })

    const fireClick = (x: number, y: number) => {
      setClicking(true)
      rippleId.current += 1
      setRipple({ id: rippleId.current, x, y })
      setTimeout(() => !cancelled && setClicking(false), 200)
    }

    async function run() {
      while (!cancelled) {
        // ── reset ──
        setRowIdentified(ROWS.map(() => false))
        setIdentifiedCount(0)
        setLensOn(false)
        setToast(false)
        setButtonPressed(false)
        setPushPressed(false)
        setCursor(CURSOR_START)
        await wait(900)
        if (cancelled) return

        // ── 1. move to Identify button & click ──
        setCursor(IDENTIFY_BTN)
        await wait(1100)
        if (cancelled) return
        setButtonPressed(true)
        fireClick(IDENTIFY_BTN.x, IDENTIFY_BTN.y)
        await wait(260)
        setButtonPressed(false)
        await wait(220)

        // ── 2. resolve rows one-by-one ──
        for (let i = 0; i < ROWS.length; i++) {
          if (cancelled) return
          setRowIdentified((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          })
          setIdentifiedCount(i + 1)
          await wait(360)
        }
        await wait(500)

        // ── 3. move to focal row, magnify ──
        setCursor(FOCAL_HOVER)
        await wait(1000)
        if (cancelled) return
        setLensOn(true)
        await wait(1400)

        // ── 4. move to "Push to CRM" & click → toast ──
        setCursor(PUSH_BTN)
        await wait(900)
        if (cancelled) return
        setPushPressed(true)
        fireClick(PUSH_BTN.x, PUSH_BTN.y)
        setToast(true)
        await wait(280)
        setPushPressed(false)

        // ── 5. hold, then loop ──
        await wait(1700)
        setLensOn(false)
        setToast(false)
        await wait(700)
      }
    }

    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduceMotion, inView])

  const staticMode = reduceMotion

  return (
    <div ref={containerRef} className="relative h-full w-full" aria-hidden="true">
      {/* ambient lift so the light window floats off the dark hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,255,255,0.10) 0%, transparent 60%)',
          filter: 'blur(20px)',
        }}
      />

      {/* scaled fixed-resolution stage */}
      <div
        ref={stageRef}
        className="absolute left-1/2 top-1/2"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* window shell with elevation */}
        <div
          className="relative h-full w-full rounded-[22px]"
          style={{
            boxShadow:
              '0 50px 100px -30px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06), 0 0 80px rgba(124,58,237,0.10)',
          }}
        >
          <AppWindow
            identifiedCount={staticMode ? ROWS.length : identifiedCount}
            rowIdentified={staticMode ? allIdentified : rowIdentified}
            buttonPressed={!staticMode && buttonPressed}
          />

          {/* magnify lens + popover */}
          <AnimatePresence>
            {!staticMode && lensOn && <MagnifyLens key="lens" pushPressed={pushPressed} />}
          </AnimatePresence>

          {/* success toast */}
          <AnimatePresence>
            {!staticMode && toast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.35, ease }}
                className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-[13px] font-semibold text-white"
                style={{ boxShadow: '0 18px 40px -12px rgba(0,0,0,0.5)', willChange: 'transform' }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                Atlas Robotics pushed to CRM
              </motion.div>
            )}
          </AnimatePresence>

          {/* click ripple */}
          <AnimatePresence>
            {ripple && (
              <motion.span
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                onAnimationComplete={() => setRipple(null)}
                className="pointer-events-none absolute z-50 rounded-full border-2 border-[#0F172A]/40"
                style={{ left: ripple.x - 22, top: ripple.y - 22, width: 44, height: 44 }}
              />
            )}
          </AnimatePresence>

          {/* animated cursor */}
          {!staticMode && (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-50"
              animate={{ x: cursor.x, y: cursor.y, scale: clicking ? 0.82 : 1 }}
              transition={{
                x: { duration: 0.9, ease },
                y: { duration: 0.9, ease },
                scale: { duration: 0.18, ease },
              }}
              style={{ willChange: 'transform' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.35))' }}>
                <path
                  d="M5.5 3.2l13.4 7.9-5.9 1.2-1.2 0.3 0.3 1.2 1.9 6.4-2.1 0.8-2.4-6.6-0.4-1.1-0.9 0.8-3.4 3z"
                  fill="#0F172A"
                  stroke="#fff"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      <p className="sr-only">
        A live demonstration of the Outmate dashboard automatically identifying anonymous website
        visitors — resolving them into named companies with enrichment data and intent scores, then
        pushing a high-intent account to the CRM.
      </p>
    </div>
  )
}
