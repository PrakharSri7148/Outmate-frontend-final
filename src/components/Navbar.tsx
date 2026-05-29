import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Users, Network, Zap, Bot, Target, FlaskConical, Wrench, BarChart2, Hash, Scale } from 'lucide-react'

const productLinks = [
  { label: 'Website Identification', href: '/product/website-identification', description: 'Identify anonymous B2B visitors in real-time' },
  { label: 'B2B Database', href: '/product/b2b-database', description: '200M verified contacts, enriched & signal-ready' },
  { label: 'Co-Pilot', href: '/product/co-pilot', description: 'AI GTM co-pilot that writes outreach automatically' },
  { label: 'Voice AI Agent', href: '/product/voice-ai-agent', description: 'Autonomous outbound calling, signal-triggered' },
  { label: 'Social Agent', href: '/product/social-agent', description: 'Turn social signals into pipeline automatically' },
  { label: 'Workflow Automation', href: '/product/workflow-automation', description: 'Route high-intent visitors into alerts, sequences, and next best actions without manual handoff.' },
]

const useCaseLinks = [
  { 
    label: 'Identify High-Intent Visitors', 
    href: '/use-cases/identify-visitors',
    description: "Know who's on your site before they call you",
    icon: Target
  },
  { 
    label: 'Enrich & Route Leads', 
    href: '/use-cases/enrich-route-leads',
    description: 'Instant context for every inbound prospect',
    icon: Network
  },
  { 
    label: 'Automate GTM Workflows', 
    href: '/use-cases/automate-workflows',
    description: 'Signal-triggered actions across your entire stack',
    icon: Zap
  },
  { 
    label: 'Run AI-Powered Outbound', 
    href: '/use-cases/ai-outbound',
    description: 'Autonomous calling and email at scale',
    icon: Bot
  },
  { 
    label: 'Sales Teams', 
    href: '/use-cases/sales-team',
    description: 'Arm your sales team with AI-driven pipeline',
    icon: Users
  },
]

const labsLinks = [
  {
    label: 'Labs Home',
    href: '/labs',
    description: 'Experimental tools & early access features',
    icon: FlaskConical
  },
  {
    label: 'Free Tools',
    href: '/labs/free-tools',
    description: 'No-signup utilities for GTM teams',
    icon: Wrench
  }
]

const compareLinks = [
  {
    label: 'Comparisons',
    href: '/compare',
    description: 'How we stack up against competitors',
    icon: Scale
  },
  {
    label: 'Outmate vs Everyone',
    href: '/compare/everyone',
    description: 'See how we compare against all tools',
    icon: BarChart2
  },
  {
    label: 'Outmate vs RB2B',
    href: '/compare/rb2b',
    description: 'A deep dive comparison vs RB2B',
    icon: Hash
  }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  const isHome = location.pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all`}> 
      <div className="container-limit">
        <div className={`nav-panel flex items-center justify-between transition-all duration-300 ${scrolled || !isHome ? 'scrolled' : ''} h-16 lg:h-18`}> 
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-text-primary nav-item no-underline">
          <img src="/images/logo.jpeg" alt="Outmate Logo" className="w-7 h-7 rounded-lg object-cover shadow-md shadow-purple/10" />
          Outmate
        </Link>

        {/* Center Nav - Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('product')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary transition-colors rounded-full nav-item ${activeDropdown === 'product' || productLinks.some(link => location.pathname.startsWith(link.href)) ? 'active' : ''}`}> 
              Product
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'product' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[580px] p-2 bg-surface backdrop-blur-3xl border border-white/5 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden grid grid-cols-2 gap-1"
                >
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group flex flex-col items-start gap-1 p-4 rounded-lg hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <p className="text-sm font-medium text-text-primary z-10 tracking-tight">
                        {link.label}
                      </p>
                      {link.description && (
                         <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-secondary transition-colors z-10">
                           {link.description}
                         </p>
                      )}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Use Cases Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('usecases')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary transition-colors rounded-full nav-item ${activeDropdown === 'usecases' || useCaseLinks.some(link => location.pathname.startsWith(link.href)) ? 'active' : ''}`}>
              Use Cases
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'usecases' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'usecases' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[580px] p-2 bg-surface backdrop-blur-3xl border border-white/5 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden grid grid-cols-2 gap-1"
                >
                  {useCaseLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="group flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex-shrink-0 mt-0.5 p-2 bg-white/5 rounded-md text-text-muted group-hover:text-white transition-colors z-10 relative">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1 z-10 relative">
                          <p className="text-sm font-medium text-text-primary tracking-tight">
                            {link.label}
                          </p>
                          <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-secondary transition-colors z-10">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Labs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('labs')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary transition-colors rounded-full nav-item ${activeDropdown === 'labs' || labsLinks.some(link => location.pathname.startsWith(link.href)) ? 'active' : ''}`}>
              Labs
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'labs' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'labs' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] p-2 bg-surface backdrop-blur-3xl border border-white/5 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden grid grid-cols-2 gap-1"
                >
                  {labsLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="group flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex-shrink-0 mt-0.5 p-2 bg-white/5 rounded-md text-text-muted group-hover:text-white transition-colors z-10 relative">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1 z-10 relative">
                          <p className="text-sm font-medium text-text-primary tracking-tight">
                            {link.label}
                          </p>
                          <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-secondary transition-colors z-10">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/pricing" className={`px-3 py-2 text-sm font-medium text-text-secondary transition-colors rounded-full nav-item ${location.pathname.startsWith('/pricing') ? 'active' : ''}`}>
            Pricing
          </Link>

          {/* Compare Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('compare')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary transition-colors rounded-full nav-item ${activeDropdown === 'compare' || compareLinks.some(link => location.pathname.startsWith(link.href)) ? 'active' : ''}`}>
              Compare
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'compare' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'compare' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-[550px] p-2 bg-surface backdrop-blur-3xl border border-white/5 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden grid grid-cols-2 gap-1"
                >
                  {compareLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="group flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex-shrink-0 mt-0.5 p-2 bg-white/5 rounded-md text-text-muted group-hover:text-white transition-colors z-10 relative">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-1 z-10 relative">
                          <p className="text-sm font-medium text-text-primary tracking-tight">
                            {link.label}
                          </p>
                          <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-secondary transition-colors z-10">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Actions - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/pricing" className={`text-sm font-medium text-text-secondary transition-colors nav-item ${location.pathname.startsWith('/pricing') ? 'active' : ''}`}>
            Get Leads Free
          </Link>
          <Link 
            to="/book-demo" 
            className="inline-flex items-center justify-center px-4 lg:px-6 py-2.5 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            Book a Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface border-t border-white/10 overflow-hidden"
          >
            <div className="container-limit py-4 space-y-1">
              <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">Product</div>
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider mt-4">Use Cases</div>
              {useCaseLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary group"
                >
                  <link.icon className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider mt-4">Labs</div>
              {labsLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary group"
                >
                  <link.icon className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-4 pt-4 space-y-1">
                <Link to="/pricing" className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary">
                  Pricing
                </Link>
              </div>
              <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider mt-4">Compare</div>
              {compareLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary group"
                >
                  <link.icon className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-2">
                <Link to="/pricing" className="text-sm font-medium text-text-secondary hover:text-purple px-3 py-2">
                  Get Leads Free
                </Link>
                <Link to="/pricing" className="btn-primary btn-small text-center justify-center">
                  Book a Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
