import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

// ──────────────────────────────────────────────────────────────────────────────
//  Shared content schema for the use-case pages. One typed object per page drives
//  the reusable <UseCasePage /> template — no duplicated section markup.
// ──────────────────────────────────────────────────────────────────────────────

export type Step = {
  n: number
  key: string
  title: string
  body: string
  caption?: string
}

export type Card = {
  icon?: LucideIcon
  title: string
  body: string
}

export type Faq = {
  q: string
  a: string
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
}

export type UseCaseContent = {
  icon: LucideIcon

  hero: {
    eyebrow: string
    headline: string[]
    subhead: string
    primaryCta: string
    secondaryCta: string
    microcopy: string
  }

  problem: {
    headline: string
    /** body lines beginning with "•" render as a bullet */
    body: string[]
    stats: string[]
  }

  howItWorks: {
    headline: string
    subhead: string
    steps: Step[]
    highlight: string
  }

  whatYouGet: {
    headline: string
    subhead: string
    cards: Card[]
  }

  /** Section 6 — signature "wow" deep-dive copy (visual supplied per page) */
  deepDive: {
    eyebrow: string
    headline: string
    subhead: string
  }

  outcomes: {
    headline: string
    subhead: string
    metrics: string[]
    before: string[]
    after: string[]
  }

  faq: Faq[]

  finalCta: {
    headline: string
    subhead: string
    primaryCta: string
    secondaryCta: string
  }
}

// Per-page render config: content object + page-specific animated visuals.
export type UseCasePageConfig = {
  content: UseCaseContent
  /** Signature animated visual shown in the dark hero (right column). */
  heroVisual: ReactNode
  /** Secondary "wow" visual shown in the section-6 deep-dive band. */
  deepDiveVisual: ReactNode
  /** Optional extra band (e.g. the AI-Outbound deliverability block). */
  deliverability?: ReactNode
  /** Theme for the hero section. Defaults to 'dark'. */
  heroTheme?: 'dark' | 'light'
  /** Theme for the deep-dive section. Defaults to 'dark'. */
  deepDiveTheme?: 'dark' | 'light'
  /** Whether to show the integrations section. Defaults to true. */
  showIntegrations?: boolean
}

// G2-style aggregate rating shown near the top and again at the bottom.
// Consistent with the site's existing "4.8 G2" trust badge.
export const G2 = { rating: 4.8, label: 'on G2', reviews: '200+ reviews' } as const
