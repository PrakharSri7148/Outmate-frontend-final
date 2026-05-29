import {
  LayoutDashboard,
  Radar,
  Building2,
  Activity,
  Database,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Live Visitors', icon: Radar, active: true },
  { label: 'Companies', icon: Building2 },
  { label: 'Signals', icon: Activity },
  { label: 'Enrichment', icon: Database },
  { label: 'Workflows', icon: Workflow },
]

export type VisitorRow = {
  /** invented company — never a real brand */
  company: string
  initials: string
  /** tailwind-free inline avatar color */
  avatar: string
  country: string
  path: string
  /** identified detail */
  title: string
  industry: string
  employees: string
  intent: number
  contact: string
  emailMasked: string
  pages: string[]
}

export const ROWS: VisitorRow[] = [
  {
    company: 'Atlas Robotics',
    initials: 'AR',
    avatar: '#6366F1',
    country: 'United States',
    path: '/pricing',
    title: 'VP of Sales',
    industry: 'Manufacturing',
    employees: '540',
    intent: 92,
    contact: 'Dana Whitfield',
    emailMasked: 'd•••••@atlasrobotics.com',
    pages: ['/pricing', '/integrations', '/demo'],
  },
  {
    company: 'Lumen Cloud',
    initials: 'LC',
    avatar: '#0EA5E9',
    country: 'Germany',
    path: '/enterprise',
    title: 'Head of RevOps',
    industry: 'SaaS',
    employees: '1,240',
    intent: 78,
    contact: 'Marco Feld',
    emailMasked: 'm•••@lumencloud.io',
    pages: ['/enterprise', '/security'],
  },
  {
    company: 'Vertex Health',
    initials: 'VH',
    avatar: '#14B8A6',
    country: 'United States',
    path: '/security',
    title: 'Director, IT',
    industry: 'Healthcare',
    employees: '3,400',
    intent: 64,
    contact: 'Priya Nair',
    emailMasked: 'p•••@vertexhealth.com',
    pages: ['/security', '/pricing'],
  },
  {
    company: 'Cobalt Systems',
    initials: 'CS',
    avatar: '#F59E0B',
    country: 'United Kingdom',
    path: '/docs',
    title: 'Growth Lead',
    industry: 'Fintech',
    employees: '220',
    intent: 57,
    contact: 'Owen Clarke',
    emailMasked: 'o•••@cobaltsys.co',
    pages: ['/docs', '/pricing'],
  },
  {
    company: 'Pareto Capital',
    initials: 'PC',
    avatar: '#F43F5E',
    country: 'Canada',
    path: '/pricing',
    title: 'Partner',
    industry: 'Finance',
    employees: '90',
    intent: 49,
    contact: 'Élise Roy',
    emailMasked: 'e•••@paretocap.com',
    pages: ['/pricing'],
  },
  {
    company: 'Northwind Labs',
    initials: 'NL',
    avatar: '#8B5CF6',
    country: 'Australia',
    path: '/product',
    title: 'Eng Manager',
    industry: 'AI / ML',
    employees: '75',
    intent: 41,
    contact: 'Sam Okafor',
    emailMasked: 's•••@northwindlabs.ai',
    pages: ['/product'],
  },
]

/** the high-intent row the demo zooms into */
export const FOCAL_INDEX = 0
