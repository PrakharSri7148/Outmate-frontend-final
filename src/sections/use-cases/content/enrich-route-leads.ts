import { Network, Layers, Gauge, Route, FileText } from 'lucide-react'
import type { UseCaseContent } from '../types'

export const enrichRouteLeadsContent: UseCaseContent = {
  icon: Network,

  hero: {
    eyebrow: 'ENRICHMENT & LEAD ROUTING',
    headline: ['We close the gap between "form filled" and "first reply."'],
    subhead:
      'The moment a lead fills your form, Outmate enriches them with verified email, title, firmographics, and intent signals — then routes them to the right rep with full context attached. No waiting. No guessing. No leads going cold.',
    primaryCta: 'Enrich your leads now →',
    secondaryCta: 'See it in action',
    microcopy: 'Works with HubSpot, Salesforce, and any form you already use · Live in 10 minutes',
  },

  problem: {
    headline: 'The lead came in 3 hours ago. Nobody knows who they are.',
    body: [
      'A lead fills your form at 10:17am.',
      "By 10:18, it's sitting in your CRM with a name, a generic email, and a company nobody's heard of. The assigned rep is in a meeting. The SDR is heads-down. Ops is enriching last week's batch in a spreadsheet.",
      'By the time someone opens the lead at 1:30pm, three things have happened:',
      '• The buyer has already compared you to two competitors',
      '• The intent that drove the form fill has cooled off',
      '• Your "5-minute response" SLA is dead',
      'This is where inbound revenue leaks out — not at the form fill, but in the silent hours after.',
    ],
    stats: [
      '5 minutes — the response window that 8x your conversion vs 1+ hour',
      '78% of inbound leads go to the vendor who responds first',
      '4+ hours/week lost per rep on manual lead research',
    ],
  },

  howItWorks: {
    headline: 'The lead arrives. We do the heavy lifting before your rep opens it.',
    subhead: 'Connect your forms once. Every new lead gets enriched, scored, and routed automatically.',
    steps: [
      {
        n: 1,
        key: 'ENRICH',
        title: 'The lead lands. We fill in the blanks.',
        body: 'Verified email, phone, LinkedIn, title, company size, funding, tech stack, signals — in under 30 seconds. No Clay. No spreadsheet. No RevOps engineer.',
      },
      {
        n: 2,
        key: 'SCORE',
        title: 'We figure out how warm they actually are.',
        body: 'Every lead scored 0-100 against your ICP and tagged with intent signals. Reps see the score before they see the name.',
      },
      {
        n: 3,
        key: 'ROUTE',
        title: 'Right rep. Right context. Right now.',
        body: 'Auto-assigned by territory, vertical, or round-robin. Slack alert for hot leads. CRM updated. Reply window: under 5 minutes.',
      },
    ],
    highlight: "Form fill → Enriched lead in the right rep's hands: under 60 seconds.",
  },

  whatYouGet: {
    headline: 'What your reps actually see when a lead lands.',
    subhead: 'Stop handing your reps blank lead records. Start handing them deal-ready profiles.',
    cards: [
      {
        icon: Layers,
        title: 'Waterfall enrichment',
        body: 'Verified email, direct phone, LinkedIn, title, firmographics — all in one record. We try multiple providers automatically so you get the highest match rate at the lowest cost.',
      },
      {
        icon: Gauge,
        title: 'Real-time scoring',
        body: "Every lead scored 0-100 against your ICP the second it lands. Hot leads bubble to the top. Cold leads stay out of your reps' way.",
      },
      {
        icon: Route,
        title: 'Smart routing',
        body: 'Route by territory, vertical, deal size, round-robin — or build your own logic. Hot leads can skip the queue and ping a specific rep directly.',
      },
      {
        icon: FileText,
        title: 'Full context on every lead',
        body: "Recent funding, current tech stack, job postings, and pages they've already viewed on your site — all attached to the lead before the rep opens it.",
      },
    ],
  },

  deepDive: {
    eyebrow: 'ENRICH → ROUTE',
    headline: 'From form fill to the right rep — in one motion.',
    subhead:
      'Watch a lead waterfall through enrichment and branch to the right rep by territory, vertical, and ICP score. Speed-to-lead drops from 4 hours to 90 seconds.',
  },

  outcomes: {
    headline: 'Faster replies. Hotter pipeline. Less manual work.',
    subhead:
      'Teams using Outmate stop drowning in manual enrichment and start working leads while they\'re still hot.',
    metrics: [
      'Under 60 seconds — from form fill to enriched, scored, and routed',
      '8x higher conversion — on leads contacted in under 5 minutes vs over an hour',
      '40-70% — match rate on email, phone, and firmographics',
      '4+ hours/week saved — per rep, no more Googling, copying, pasting',
    ],
    before: [
      'Leads sit in CRM for hours before anyone opens them',
      'Reps Google the company before every reply',
      'Hot leads get routed to the wrong rep',
      'Inbound SLAs slip every week',
    ],
    after: [
      'Every lead enriched and routed in under 60 seconds',
      'Reps reply with full context from the first message',
      'Hot leads skip the queue, land with the right rep',
      '5-minute SLAs become the default',
    ],
  },

  faq: [
    {
      q: 'Does this work with my existing forms?',
      a: 'Yes. Webflow, HubSpot, Marketo, Typeform, custom forms, Calendly — if it captures a lead, we can enrich and route it. No re-platforming needed.',
    },
    {
      q: 'How is this different from Clay or Apollo?',
      a: 'Clay needs a RevOps engineer to set up tables and waterfalls. Apollo gives you a database to search manually. Outmate runs enrichment automatically the second a lead lands — no setup, no spreadsheets, no manual triggers.',
    },
    {
      q: "What if you can't find the data?",
      a: 'We try multiple sources in order — and only charge credits for what we actually find. Leads with low match rates still get routed to your reps with whatever data we have, flagged honestly.',
    },
    {
      q: 'How do I set up custom routing rules?',
      a: 'Drag-and-drop in our routing builder. Set rules by territory, vertical, company size, deal value, or ICP score. Hot leads (ICP 70+) can skip the standard queue and go directly to a named rep.',
    },
  ],

  finalCta: {
    headline: "See who's on your site.",
    subhead: 'Free forever plan. 5-minute setup. No credit card.',
    primaryCta: 'Start free →',
    secondaryCta: 'Book a demo',
  },
}
