import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'
import AnimatedCounter from '@/components/AnimatedCounter'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import type { UseCasePageConfig } from './types'
import G2Rating from './components/G2Rating'
import TrustBadges, { ComplianceLine } from './components/TrustBadges'
import BeforeAfter from './components/BeforeAfter'
import CardVisual from './components/CardVisual'
import LogoMarquee, { INTEGRATION_LOGOS } from './components/LogoMarquee'

const ease = [0.22, 1, 0.36, 1] as const
const VOID = '#0B0B0C'

// ── helpers ──────────────────────────────────────────────────────────────────
function scrollToHow() {
  const el = document.getElementById('how-it-works')
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function CtaButton({
  label,
  variant,
  tone = 'dark',
}: {
  label: string
  variant: 'primary' | 'ghost'
  tone?: 'light' | 'dark'
}) {
  const isScroll = /see (how it works|it in action)/i.test(label)
  let cls = ''

  if (variant === 'primary') {
    cls =
      'inline-flex items-center justify-center gap-2 rounded-full bg-[#4f46e5] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4338ca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C]'
  } else {
    // Ghost variant
    if (tone === 'light') {
      cls =
        'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/50 px-6 py-3.5 text-[15px] font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
    } else {
      cls =
        'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C]'
    }
  }

  if (isScroll)
    return (
      <button type="button" onClick={scrollToHow} className={cls}>
        {label}
      </button>
    )
  return (
    <Link to="/book-demo" className={cls}>
      {label}
    </Link>
  )
}

// Animated metric: "VALUE — description" → big animated VALUE + muted description.
function AnimatedMetric({ metric, i }: { metric: string; i: number }) {
  const [head, ...rest] = metric.split(/\s*—\s*/)
  const desc = rest.join(' — ')
  const m = head.match(/^(\D*)(\d+)(.*)$/s)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease, delay: i * 0.06 }}
      className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
    >
      <div className="font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] text-[#4f46e5] md:text-[34px]">
        {m ? (
          <>
            {m[1]}
            <AnimatedCounter value={Number(m[2])} />
            {m[3]}
          </>
        ) : (
          head
        )}
      </div>
      {desc && <p className="mt-3 text-[13.5px] leading-[1.55] text-slate-600">{desc}</p>}
    </motion.div>
  )
}

function Eyebrow({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={cn(
        'font-mono text-[11px] font-semibold uppercase tracking-[0.26em]',
        tone === 'dark' ? 'text-blue-400' : 'text-blue-600',
      )}
    >
      {children}
    </span>
  )
}

function SectionHeading({
  eyebrow,
  headline,
  subhead,
  tone = 'light',
  align = 'left',
}: {
  eyebrow?: string
  headline: string
  subhead?: string
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease }}
      className={cn('max-w-[760px]', align === 'center' && 'mx-auto text-center')}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'mt-4 font-display font-extrabold leading-[1.05] tracking-[-0.035em]',
          tone === 'dark' ? 'text-white' : 'text-black',
        )}
        style={{ fontSize: 'clamp(28px, 3.6vw, 46px)' }}
      >
        {headline}
      </h2>
      {subhead && (
        <p className={cn('mt-5 text-[16px] leading-[1.7] md:text-[17px]', tone === 'dark' ? 'text-white/55' : 'text-slate-600')}>
          {subhead}
        </p>
      )}
    </motion.div>
  )
}

// masked editorial grid for light sections
function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
      }}
    />
  )
}

// integration categories for the "fits your stack" band
const INTEGRATION_GROUPS = [
  { label: 'CRM', names: ['Salesforce', 'HubSpot', 'Pipedrive'] },
  { label: 'Email', names: ['Gmail', 'Outlook'] },
  { label: 'Messaging', names: ['Slack', 'Intercom'] },
  { label: 'Outreach & data', names: ['Apollo', 'Lemlist', 'LinkedIn', 'Zapier'] },
]
const logoSrc = (name: string) => INTEGRATION_LOGOS.find((l) => l.name === name)?.src ?? ''

// ── template ───────────────────────────────────────────────────────────────────
export default function UseCasePage({
  content,
  heroVisual,
  deepDiveVisual,
  deliverability,
  heroTheme = 'dark',
  deepDiveTheme = 'dark',
  showIntegrations = true,
}: UseCasePageConfig) {
  const reduceMotion = useReducedMotion()

  // scroll to top on mount (each page is its own route)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const Icon = content.icon

  return (
    <div className="bg-white">
      {/* ─────────────────────────── 1 · HERO ─────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: heroTheme === 'dark' ? VOID : '#F6F6F4' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              heroTheme === 'dark'
                ? 'radial-gradient(ellipse 90% 60% at 70% 0%, rgba(79,70,229,0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 15% 20%, rgba(59,130,246,0.10) 0%, transparent 55%)'
                : 'radial-gradient(ellipse 90% 60% at 70% 0%, rgba(79,70,229,0.06) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 15% 20%, rgba(59,130,246,0.04) 0%, transparent 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
                  heroTheme === 'dark'
                    ? 'border-white/10 bg-white/[0.04]'
                    : 'border-slate-200 bg-white shadow-sm',
                )}
              >
                <Icon
                  className={cn('h-3.5 w-3.5', heroTheme === 'dark' ? 'text-blue-400' : 'text-blue-600')}
                  strokeWidth={2}
                />
                <span
                  className={cn(
                    'font-mono text-[11px] font-semibold uppercase tracking-[0.2em]',
                    heroTheme === 'dark' ? 'text-white/70' : 'text-slate-600',
                  )}
                >
                  {content.hero.eyebrow}
                </span>
              </span>
              <ComplianceLine theme={heroTheme} />
            </div>

            <h1
              className={cn(
                'mt-7 font-display font-extrabold leading-[1.04] tracking-[-0.04em]',
                heroTheme === 'dark' ? 'text-white' : 'text-slate-900',
              )}
              style={{ fontSize: 'clamp(30px, 4.4vw, 56px)' }}
            >
              {content.hero.headline.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              className={cn(
                'mt-6 max-w-[600px] text-[16px] leading-[1.7] md:text-[17px]',
                heroTheme === 'dark' ? 'text-white/60' : 'text-slate-600',
              )}
            >
              {content.hero.subhead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton label={content.hero.primaryCta} variant="primary" tone={heroTheme} />
              <CtaButton label={content.hero.secondaryCta} variant="ghost" tone={heroTheme} />
            </div>

            <p className={cn('mt-4 text-[13px]', heroTheme === 'dark' ? 'text-white/40' : 'text-slate-500')}>
              {content.hero.microcopy}
            </p>
            <G2Rating className="mt-6" tone={heroTheme} />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="relative"
            aria-hidden
          >
            {heroVisual}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── 2 · LOGO WALL (light) ─────────────────── */}
      <section className="border-b border-slate-100 bg-white py-12">
        <p className="mb-7 text-center font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
          Works with the tools your team already runs
        </p>
        <LogoMarquee />
      </section>

      {/* ─────────────────────────── 3 · THE PROBLEM (light) ─────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F6F6F4] py-24 md:py-32">
        <GridOverlay />
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          <SectionHeading eyebrow="The problem" headline={content.problem.headline} />
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="max-w-[640px] space-y-4">
              {content.problem.body.map((line, i) =>
                line.trim().startsWith('•') ? (
                  <p key={i} className="flex items-start gap-3 pl-1 text-[16px] leading-[1.7] text-slate-700">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                    {line.replace(/^\s*•\s*/, '')}
                  </p>
                ) : (
                  <p key={i} className="text-[16px] leading-[1.7] text-slate-600 md:text-[17px]">
                    {line}
                  </p>
                ),
              )}
            </div>
            <div className="flex flex-col gap-4">
              {content.problem.stats.map((stat, i) => (
                <motion.div
                  key={stat}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                  className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
                >
                  <p className="text-[15px] font-semibold leading-[1.5] text-slate-900">{stat}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── 4 · HOW IT WORKS (light) ─────────────────────────── */}
      <section id="how-it-works" className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          <SectionHeading eyebrow="How it works" headline={content.howItWorks.headline} subhead={content.howItWorks.subhead} />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {content.howItWorks.steps.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className="relative flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] md:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4f46e5] font-mono text-[14px] font-bold text-white">
                    {step.n}
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">{step.key}</span>
                </div>
                <h3 className="mt-5 font-display text-[19px] font-bold tracking-[-0.02em] text-slate-900">{step.title}</h3>
                <p className="mt-2.5 flex-1 text-[14px] leading-[1.65] text-slate-600">{step.body}</p>
                {step.caption && (
                  <p className="mt-4 font-mono text-[11px] tracking-[0.04em] text-slate-400">{step.caption}</p>
                )}
                <CardVisual index={i} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease }}
            className="mt-8 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4f46e5] text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#3730a3] md:text-[16px]">{content.howItWorks.highlight}</p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── 5 · WHAT YOU GET (light) ─────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F6F6F4] py-24 md:py-32">
        <GridOverlay />
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          <SectionHeading eyebrow="What you get" headline={content.whatYouGet.headline} subhead={content.whatYouGet.subhead} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {content.whatYouGet.cards.map((card, i) => {
              const CardIcon = card.icon ?? content.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, ease, delay: (i % 2) * 0.08 }}
                  className="flex flex-col rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-blue-600">
                    <CardIcon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-[18px] font-bold tracking-[-0.02em] text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-slate-600">{card.body}</p>
                  <CardVisual index={i} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── 6 · DEEP DIVE ─────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: deepDiveTheme === 'dark' ? VOID : '#F6F6F4' }}
      >
        {deepDiveTheme === 'light' && <GridOverlay />}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              deepDiveTheme === 'dark'
                ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,70,229,0.14) 0%, transparent 60%)'
                : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-24 md:px-8 md:py-32">
          <SectionHeading
            eyebrow={content.deepDive.eyebrow}
            headline={content.deepDive.headline}
            subhead={content.deepDive.subhead}
            tone={deepDiveTheme}
            align="center"
          />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease }}
            className="mt-14"
            aria-hidden
          >
            {deepDiveVisual}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────── 7 · INTEGRATIONS (light) ─────────────────────────── */}
      {showIntegrations && (
        <section className="relative overflow-hidden bg-white py-24 md:py-32">
          <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
            <SectionHeading
              eyebrow="Integrations"
              headline="Fits your stack. No rip-and-replace."
              subhead="Outmate connects to the tools you already run — bi-directional, OAuth, and native. Your data stays in sync; actions fire from your own accounts."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {INTEGRATION_GROUPS.map((group) => (
                <div key={group.label} className="rounded-[22px] border border-slate-200 bg-slate-50/60 p-6">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {group.label}
                  </span>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-4">
                    {group.names.map((name) => (
                      <img
                        key={name}
                        src={logoSrc(name)}
                        alt={name}
                        loading="lazy"
                        className="h-7 w-auto object-contain md:h-8"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14">
            <LogoMarquee duration={36} />
          </div>
        </section>
      )}

      {/* ─────────────────────────── 8 · OUTCOMES (light) ─────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F6F6F4] py-24 md:py-32">
        <GridOverlay />
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          <SectionHeading eyebrow="Outcomes" headline={content.outcomes.headline} subhead={content.outcomes.subhead} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.outcomes.metrics.map((metric, i) => (
              <AnimatedMetric key={metric} metric={metric} i={i} />
            ))}
          </div>
          <div className="mt-12">
            <BeforeAfter before={content.outcomes.before} after={content.outcomes.after} />
          </div>
        </div>
      </section>

      {/* ─────────────────── 9 · TESTIMONIALS (light) ─────────────────── */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          <SectionHeading eyebrow="Proof" headline="Built for teams that live in the pipeline." align="center" />
          {/* TODO: replace with real, approved customer testimonials (name + logo on file). */}
          <div className="mx-auto mt-14 grid max-w-[1040px] gap-5 md:grid-cols-3">
            {[
              { role: 'VP of Sales', segment: 'B2B SaaS · Series B' },
              { role: 'Head of RevOps', segment: 'Fintech · Mid-market' },
              { role: 'Founder / GTM lead', segment: 'Dev tools · Seed' },
            ].map((t, i) => (
              <motion.figure
                key={t.role}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-slate-50/60 p-7"
              >
                <Quote className="h-6 w-6 text-blue-200" fill="currentColor" strokeWidth={0} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-[1.65] text-slate-700">
                  Representative outcome — a real, attributed quote from this customer segment will appear here once approved.
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
                  <span className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300" aria-hidden />
                  <span className="text-[13px]">
                    <span className="block font-semibold text-slate-800">{t.role}</span>
                    <span className="block text-slate-400">{t.segment}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">
            Customer names &amp; logos available on request
          </p>
        </div>
      </section>

      {/* ─────────────── optional deliverability band (AI Outbound) ─────────────── */}
      {deliverability}

      {/* ─────────────────── 10 · TRUST / COMPLIANCE (light) ─────────────────── */}
      <section className="bg-[#F6F6F4] py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-5 text-center md:px-8">
          <Eyebrow>Security &amp; compliance</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-[28ch] font-display text-[24px] font-bold tracking-[-0.02em] text-black md:text-[30px]">
            Enterprise-grade trust, baked in from day one.
          </h2>
          <TrustBadges className="mt-8" />
        </div>
      </section>

      {/* ─────────────────────────── 11 · FAQ (light) ─────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[820px] px-5 md:px-8">
          <SectionHeading eyebrow="FAQ" headline="Questions, answered." align="center" />
          <Accordion type="single" collapsible className="mt-16 w-full space-y-0">
            {content.faq.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="group border-b border-slate-200 py-2 first:border-t"
              >
                <AccordionTrigger className="flex w-full items-center justify-between py-6 text-left transition-all hover:no-underline">
                  <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-slate-900 transition-colors group-hover:text-blue-600 md:text-[18px]">
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-[15.5px] leading-[1.7] text-slate-600 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="max-w-[90%]">{item.a}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─────────────────────────── 12 · FINAL CTA (dark band) ─────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: VOID }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(79,70,229,0.22) 0%, transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-[820px] px-5 py-24 text-center md:px-8 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="font-display font-extrabold leading-[1.05] tracking-[-0.04em] text-white" style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}>
              {content.finalCta.headline}
            </h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-[16px] leading-[1.7] text-white/55 md:text-[17px]">{content.finalCta.subhead}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton label={content.finalCta.primaryCta} variant="primary" />
              <CtaButton label={content.finalCta.secondaryCta} variant="ghost" />
            </div>
            <G2Rating className="mt-8 justify-center" tone="dark" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
