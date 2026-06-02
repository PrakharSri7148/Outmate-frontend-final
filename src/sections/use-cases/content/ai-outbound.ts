import { Bot, Mail, MessageSquare, PhoneCall } from 'lucide-react'
import type { UseCaseContent } from '../types'

export const aiOutboundContent: UseCaseContent = {
  icon: Bot,

  hero: {
    eyebrow: 'AI-POWERED OUTBOUND',
    headline: ['Your outbound team. Without the burnout.'],
    subhead:
      "Prospecting, writing, sending, replying, calling — handled by AI. Your reps focus on closing. Your pipeline keeps moving even when nobody's at their desk.",
    primaryCta: 'Start free →',
    secondaryCta: 'See it in action',
    microcopy: 'Sends from your real Gmail · Calls in local business hours · Logs everything to your CRM',
  },

  problem: {
    headline: "Outbound is broken. Bolting AI on top hasn't fixed it.",
    body: [
      'Your SDRs spend 6+ hours a day prospecting, list-building, and writing emails. Reply rates have dropped to 1-2%. Deliverability is shaky. And the "AI SDR" you tried last quarter sent obvious bot emails from a warmup domain — burning your sending reputation along with it.',
      'Meanwhile, your best signals — pricing page visits, funding rounds, champion job changes — sit untouched in dashboards.',
      "You don't need more volume. You need outbound that's relevant, autonomous, and actually lands.",
    ],
    stats: [
      '6+ hours/day SDRs spend on manual prospecting and email writing',
      '1-2% average cold email reply rate in 2026',
      '$80K+/year average loaded cost per SDR — for diminishing returns',
    ],
  },

  howItWorks: {
    headline: 'The full outbound motion — handled by AI. Approved by humans.',
    subhead:
      'Define your ICP and your message. Outmate handles the rest — and pings your reps only when there\'s a reply that matters.',
    steps: [
      {
        n: 1,
        key: 'PROSPECT & PERSONALISE',
        title: 'AI builds the list. AI writes the emails.',
        body: 'Outmate finds ICP-matched prospects from our 500M+ database and writes a personalised email referencing real signals — funding, job changes, pages they viewed. No mail-merge.',
        caption: '500M+ contacts · 4,000+ signals',
      },
      {
        n: 2,
        key: 'SEND & FOLLOW UP',
        title: "From your rep's own Gmail. Not a warmup domain.",
        body: "Every email sends from your rep's actual inbox — landing in inbox, not spam. AI follows up across email and LinkedIn, classifies every reply, and pings your rep only when it matters.",
        caption: 'Native Gmail / Outlook / LinkedIn',
      },
      {
        n: 3,
        key: 'CALL & CLOSE',
        title: 'Email got no reply? Voice AI takes over.',
        body: 'After 3 days of silence, Voice AI calls the prospect in local business hours, references the email, and books a meeting — or leaves a voicemail. Transcript auto-logged to CRM.',
        caption: 'Voice AI · Local business hours · Full transcripts in CRM',
      },
    ],
    highlight: 'Signal → email → reply → call → meeting booked. End-to-end. Autonomously.',
  },

  whatYouGet: {
    headline: 'Every part of the outbound motion — built in, not bolted on.',
    subhead: 'No SDR seat licences. No warmup domains. No bot-sounding emails. Just outbound that actually works.',
    cards: [
      {
        icon: Bot,
        title: 'AI SDR',
        body: 'Finds your ICP, enriches the contacts, writes hyper-personalised emails referencing real signals, and sends them on your behalf. Multi-touch sequences across email and LinkedIn — fully autonomous.',
      },
      {
        icon: Mail,
        title: "Send from your rep's own Gmail",
        body: 'No shared sending infrastructure. No warmup domains. Every email goes out from your rep\'s real Gmail or Outlook — landing in inbox, with reply rates 3-5x higher than typical AI SDR tools.',
      },
      {
        icon: MessageSquare,
        title: 'Reply Handler',
        body: 'Classifies every reply into 7 types — interested, not now, OOO, objection, referral, unsubscribe, negative. Drafts the right next action for each. Your rep only sees the ones worth a human touch.',
      },
      {
        icon: PhoneCall,
        title: 'Voice AI follow-up',
        body: "After 3 days of no email reply, our Voice AI calls in the prospect's local business hours, asks one qualifying question, and books the meeting — or leaves a personalised voicemail. Transcript auto-logged to CRM.",
      },
    ],
  },

  deepDive: {
    eyebrow: 'AI AGENT, LIVE',
    headline: 'Watch an AI SDR write outreach from real signals.',
    subhead:
      "The agent reads the signal, drafts a personalised email, and sends it from your rep's own inbox. A full roster of agents runs the rest of the motion.",
  },

  outcomes: {
    headline: 'More meetings. Zero burnout.',
    subhead:
      'Teams using Outmate stop drowning in busywork and start measuring outbound by the only metric that matters — meetings booked.',
    metrics: [
      '3-5x higher reply rates — vs typical AI SDR tools, because we send from real inboxes',
      '80% of SDR work eliminated — prospecting, writing, sending, following up',
      'Under 4 minutes — from signal detected to personalised email in inbox',
      '$80K+/year saved — per SDR seat replaced, at a fraction of the cost',
    ],
    before: [
      'SDRs burn 6+ hours/day on manual prospecting',
      'AI SDR tools send obvious bot emails from sketchy domains',
      'Replies sit unread, voicemails uncalled, follow-ups missed',
      'Reply rates stuck at 1-2%',
    ],
    after: [
      'AI does the prospecting, writing, sending, and calling',
      "Emails land in inbox from your rep's real Gmail",
      'Every reply classified, every voicemail logged, every follow-up fired',
      'Reply rates 3-5x higher — and reps focus only on closing',
    ],
  },

  faq: [
    {
      q: 'Will this burn my domain reputation?',
      a: "No. We send from your rep's own Gmail or Outlook account via OAuth — not a shared warmup domain. Every email looks and behaves like a real one-to-one email because, deliverability-wise, it is one.",
    },
    {
      q: "Won't recipients realise it's AI-written?",
      a: 'The emails reference real signals — funding, hiring activity, pages they actually viewed on your site, recent LinkedIn posts. They read like a sharp SDR who did 20 minutes of research, because that\'s exactly what the AI does. Reply rates are 3-5x higher than typical AI SDR tools.',
    },
    {
      q: 'Is the Voice AI compliant with calling laws?',
      a: 'Yes. We\'re TCPA-aware, respect Do Not Call lists, only call during local business hours, and the AI introduces itself as AI at the start of every call. You can also set custom call windows and exclusions per geography.',
    },
    {
      q: 'Can I still review emails before they send?',
      a: "Yes. Every campaign can run in review mode until you trust the system — emails get queued for human approval. Once you're comfortable, switch any rep or campaign to fully autonomous. You stay in control of the toggle.",
    },
  ],

  finalCta: {
    headline: "See who's on your site.",
    subhead: 'Free forever plan. 5-minute setup. No credit card.',
    primaryCta: 'Start free →',
    secondaryCta: 'Book a demo',
  },
}
