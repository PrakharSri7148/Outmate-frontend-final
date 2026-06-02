import { Zap, Radio, Bot, Plug, Workflow } from 'lucide-react'
import type { UseCaseContent } from '../types'

export const automateWorkflowsContent: UseCaseContent = {
  icon: Zap,

  hero: {
    eyebrow: 'AUTOMATED GTM WORKFLOWS',
    headline: ['A buying signal just fired. Your stack should already be moving.', 'Now it does.'],
    subhead:
      "You already have the signals. You just don't have anything turning them into action. Outmate is the layer between every signal you track and every action your team should be taking — without Zapier, glue code, or another tool to babysit.",
    primaryCta: 'Start free →',
    secondaryCta: 'See it in action',
    microcopy: 'Connects to HubSpot, Salesforce, Slack, Gmail, LinkedIn · Setup in minutes, not weeks',
  },

  problem: {
    headline: 'A signal without an action is just an expensive dashboard.',
    body: [
      'A target account just raised a Series B. Nobody on your team sees it.',
      'Your champion at a closed-won account just moved to a new company. The job change alert sits in someone\'s inbox until Friday.',
      'A competitor got mentioned on a Slack community thread by 3 of your ICP buyers. Marketing notices. Sales doesn\'t.',
      "You've built a stack that detects everything — and acts on almost none of it. Every signal you miss is a deal you didn't close. Every signal that fires too late is a buying window that's already closed.",
      "The problem isn't data. It's the gap between data and action.",
    ],
    stats: [
      '4,000+ buying signals B2B teams could track — most teams act on under 50',
      '3-5 days average lag between signal fire and human follow-up',
      '80% of intent data goes unused, according to industry benchmarks',
    ],
  },

  howItWorks: {
    headline: 'Every signal. Every action. Wired together. Automatically.',
    subhead: 'Connect your sources once. Define the actions once. Outmate runs the loop 24/7.',
    steps: [
      {
        n: 1,
        key: 'DETECT',
        title: 'The signal fires from wherever it lives.',
        body: 'Funding rounds, hiring signals, job changes, website visits, G2 intent, competitor mentions, tech stack shifts, CRM events — Outmate listens across 4,000+ signals from your existing sources and our own data layer. No new tools to install.',
        caption: 'Works with Crunchbase, G2, LinkedIn, your CRM, your website, and more',
      },
      {
        n: 2,
        key: 'DECIDE',
        title: 'The signal is scored. The right play is picked.',
        body: 'Every signal is filtered through your ICP and routed to the right play — fire an email, queue a LinkedIn DM, alert a rep in Slack, update the CRM, or chain multiple actions together. The right play for the right signal, every time.',
        caption: 'ICP scoring + signal weight + agent orchestration',
      },
      {
        n: 3,
        key: 'ACT',
        title: 'The action fires. Automatically. End-to-end.',
        body: 'The chosen play runs across your stack — Gmail, Slack, LinkedIn, HubSpot, Salesforce, voice. No Zapier. No human approval needed. Every action logged, every outcome measured, every result fed back into the next round of scoring.',
        caption: 'Native integrations · No glue code · Full audit trail',
      },
    ],
    highlight: 'Signal fired → action live across your stack: under 60 seconds.',
  },

  whatYouGet: {
    headline: 'A GTM engine that runs itself.',
    subhead: 'Stop stitching tools together. Start running plays.',
    cards: [
      {
        icon: Radio,
        title: '4,000+ signal library',
        body: 'Funding, hiring, job changes, website visits, G2 intent, tech stack changes, competitor mentions, CRM events — all in one place. Toggle on what matters. Ignore what doesn\'t.',
      },
      {
        icon: Bot,
        title: '12 AI agents working together',
        body: 'ICP Scorer, AI SDR, Reply Handler, Voice AI, LinkedIn Outreach, Champion Tracker, CRM Auto-Fill, and more. Each agent has one job. Together they run your full sales motion.',
      },
      {
        icon: Plug,
        title: 'Native integrations, zero glue code',
        body: 'HubSpot, Salesforce, Slack, Gmail, Outlook, LinkedIn — all native, all OAuth, all bi-directional. Your data stays in sync. Your actions fire from your own accounts.',
      },
      {
        icon: Workflow,
        title: 'Visual workflow builder',
        body: 'Drag-and-drop your way to custom plays — or use pre-built templates for funding rounds, champion job changes, hot visitor reactivation, and more. No code. No engineers.',
      },
    ],
  },

  deepDive: {
    eyebrow: 'WORKFLOW CANVAS',
    headline: 'Build the play once. Outmate runs it forever.',
    subhead:
      'Drag triggers, enrichment, scoring, and actions onto one canvas — or start from a templated play. No Zapier, no glue code, no babysitting.',
  },

  outcomes: {
    headline: 'What happens when your stack actually works as one.',
    subhead:
      'Teams using Outmate stop firefighting their stack and start running the plays that move revenue.',
    metrics: [
      '4,000+ signals — monitored 24/7 across funding, hiring, intent, and CRM events',
      'Under 60 seconds — from signal fired to action live across your stack',
      '12 AI agents — working in coordination, no Zapier, no glue code',
      '10+ hours/week saved — across your RevOps and sales team combined',
    ],
    before: [
      'Signals fire across 8 tools, nobody acts on them',
      'RevOps spends Mondays cleaning Zapier breaks',
      'Champion job changes get noticed weeks late',
      'Hot accounts cool off before sales even sees them',
    ],
    after: [
      'Every signal triggers the right action in seconds',
      'One platform, zero glue code, no babysitting',
      'Champion moves trigger warm re-intros automatically',
      'Hot accounts get touched while the window is open',
    ],
  },

  faq: [
    {
      q: 'How is this different from Zapier or n8n?',
      a: "Zapier connects apps. Outmate runs GTM plays. We come pre-loaded with 4,000+ signals, 12 AI agents, ICP scoring, and full enrichment — so you're not building workflows from scratch. You're turning them on.",
    },
    {
      q: 'Do I need a RevOps engineer to set this up?',
      a: 'No. Connect your CRM and inbox via OAuth, set your ICP in a 5-step wizard, and pick the plays you want to run. Most teams are live in under 30 minutes. Custom workflows use a visual builder — no code, no scripts.',
    },
    {
      q: 'Can I bring my own signal sources?',
      a: 'Yes. Native signals come built-in (funding, hiring, intent, CRM events). For custom signals, you can pipe in any webhook or API and trigger Outmate plays from it. Your data, your sources, our orchestration.',
    },
    {
      q: 'What if something fires by mistake?',
      a: 'Every play can run in review mode before going fully autonomous — actions get queued for human approval until you trust the system. You can also pause any agent or signal at any time from one toggle.',
    },
  ],

  finalCta: {
    headline: "See who's on your site.",
    subhead: 'Free forever plan. 5-minute setup. No credit card.',
    primaryCta: 'Start free →',
    secondaryCta: 'Book a demo',
  },
}
