import { Users, ListChecks, CalendarCheck, Database, BarChart3 } from 'lucide-react'
import type { UseCaseContent } from '../types'

export const salesTeamContent: UseCaseContent = {
  icon: Users,

  hero: {
    eyebrow: 'FOR SALES TEAMS',
    headline: ["Give your sales team a pipeline they didn't have to build."],
    subhead:
      'Warm leads scored against your ICP. Emails drafted. CRM updated. A daily action list waiting at 8am. Your reps walk in and start closing — not searching, writing, or logging.',
    primaryCta: 'Start free →',
    secondaryCta: 'See it in action',
    microcopy: 'Built for AEs, SDRs, and sales managers · Works inside your existing CRM · 5-minute setup',
  },

  problem: {
    headline: 'Pipeline is leaking where the work is happening — not where the deals are.',
    body: [
      'Mornings start with manual prospecting. Pre-call prep happens 90 seconds before the dial. Pipeline reviews are half "what\'s happening on this deal" and half "why isn\'t this in HubSpot." Every quarter, headcount goes up to make up for the productivity lost to the tools that were supposed to fix this.',
      "This isn't a coverage problem. It's a time problem. The work AI should be doing is still on humans — and the work that actually moves revenue keeps slipping to tomorrow.",
    ],
    stats: [
      "70% of an average sales team's day is spent on non-selling work",
      '4+ hours/week lost per person to manual CRM updates alone',
      '30% of forecasted pipeline is missing or stale data in any given CRM',
    ],
  },

  howItWorks: {
    headline: 'The workflow that finally lets your team sell.',
    subhead: 'Outmate runs the busywork in the background. Your team shows up to a pipeline that\'s already moving.',
    steps: [
      {
        n: 1,
        key: 'MORNING',
        title: 'A pre-built action list. Waiting at 8am.',
        body: 'Every rep opens Outmate to a prioritised brief — hot visitors who hit the site overnight, replies that need a human touch, meetings happening today with prep already done, deals at risk, and accounts that just hit a buying signal. No "where do I start?" — the list is already there.',
        caption: 'Daily Co-Pilot brief · Auto-generated from live signals',
      },
      {
        n: 2,
        key: 'MIDDAY',
        title: 'Calls, emails, and conversations — fully loaded.',
        body: '30 minutes before every meeting, reps get a pre-call brief in Slack with company news, CRM history, likely objections, and recommended talking points. Every email sends from their own Gmail, drafted with the exact signals that triggered it. Every action gets logged to CRM automatically.',
        caption: 'Auto meeting prep · One-click outreach · Zero CRM data entry',
      },
      {
        n: 3,
        key: 'END OF DAY',
        title: 'CRM is up to date. Pipeline is accurate. Tomorrow\'s list is already building.',
        body: 'Every email, call, and signal from the day is logged. Stale deals are flagged with re-engagement angles. New signals from the night start queuing for tomorrow\'s brief. Your reps log off — Outmate keeps working.',
        caption: 'CRM auto-fill · Pipeline risk flagging · Continuous signal monitoring',
      },
    ],
    highlight: 'Your reps spend their day selling. Outmate spends it making them faster.',
  },

  whatYouGet: {
    headline: 'Less ops. More closing.',
    subhead: 'Every feature designed around one question — "does this make the next call easier?"',
    cards: [
      {
        icon: ListChecks,
        title: 'Daily Co-Pilot brief',
        body: 'Every rep starts the day with a prioritised action list — hot visitors, replies to handle, meetings to prep for, deals at risk. Auto-generated at 8am from live signals. Zero clicks to get started.',
      },
      {
        icon: CalendarCheck,
        title: 'Auto meeting prep',
        body: '30 minutes before every meeting, a pre-call brief lands in Slack — company news, CRM history, likely objections, talking points. No more 2-minute Google searches before the dial.',
      },
      {
        icon: Database,
        title: 'CRM that fills itself',
        body: 'Every email, call, signal, and reply auto-logged to HubSpot or Salesforce. Deal stages update on their own. Stale deals get flagged. Your reps never type into a CRM again.',
      },
      {
        icon: BarChart3,
        title: 'One pipeline, one truth',
        body: 'All the data, signals, and outreach in one place — across the whole team. Managers see what\'s actually happening. Reps see what\'s coming next. No more "let me check my dashboard."',
      },
    ],
  },

  deepDive: {
    eyebrow: 'IN-CONTEXT SURFACES',
    headline: 'The work shows up where your reps already are.',
    subhead:
      'A daily 8am brief, a Slack pre-call card, and a CRM panel that fills itself — surfaced by role, so every rep sees exactly what\'s next.',
  },

  outcomes: {
    headline: 'What your sales team looks like with Outmate running.',
    subhead:
      'Teams using Outmate stop measuring activity and start measuring outcomes — because every part of the workflow that used to be activity is now automated.',
    metrics: [
      '70% → 30% — the shift in non-selling time per rep, automated away by Outmate',
      '3-5x more meetings — booked per rep, from the same effort',
      '100% CRM hygiene — every email, call, and signal auto-logged',
      'Half the ramp time — new reps onboard faster because the playbook is built in',
    ],
    before: [
      'Reps spend their mornings prospecting, not selling',
      'Meeting prep happens in panic mode',
      'Pipeline reviews are half-data, half-guesswork',
      'Manager spends hours chasing reps for CRM updates',
    ],
    after: [
      'Reps open the app to a pre-built action list at 8am',
      'Every meeting starts with a full pre-call brief',
      'Pipeline is accurate because data updates automatically',
      'Manager spends time coaching, not auditing',
    ],
  },

  faq: [
    {
      q: 'Will my reps actually adopt this?',
      a: "Adoption is high because Outmate removes work — it doesn't add a new tool to log into. Reps get their daily brief in Slack, prep delivered before meetings, and CRM updated for them. Most teams hit 80%+ daily active usage in the first week.",
    },
    {
      q: 'Does it work with the CRM we already use?',
      a: 'Yes. Native, bi-directional integrations with HubSpot and Salesforce out of the box — every email, call, signal, and stage change syncs automatically. Slack, Gmail, Outlook, and LinkedIn all connect via OAuth.',
    },
    {
      q: 'How long does it take to train the team?',
      a: "Most reps are productive in under an hour. The daily brief and meeting prep don't need training — they just show up. The outreach and CRM features feel familiar to anyone who's used Apollo or HubSpot. Full onboarding is included.",
    },
    {
      q: 'Do I keep control of what gets sent?',
      a: 'Yes. Sales leaders set ICP rules, message templates, and approval gates. Reps can run in review mode until you trust the system, then switch to fully autonomous when ready. You stay in control of the toggle — at the rep level or the team level.',
    },
  ],

  finalCta: {
    headline: "See who's on your site.",
    subhead: 'Free forever plan. 5-minute setup. No credit card.',
    primaryCta: 'Start free →',
    secondaryCta: 'Book a demo',
  },
}
