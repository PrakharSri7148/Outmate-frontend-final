import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './site-nav.css'

/**
 * SiteNav — the shared, site-wide top chrome.
 * Promo bar + navbar (with hover dropdowns) + mobile menu.
 * All styling is scoped under `.site-chrome`; all internal links are SPA
 * <Link>s. The little bit of JS (scrolled state + mobile menu toggle) is
 * scoped to this component's root ref and cleaned up on unmount.
 */
export default function SiteNav() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cleanups: Array<() => void> = []

    /* ---------- navbar scroll state ---------- */
    const navbar = root.querySelector('#navbar')
    const onNavScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 100)
    }
    window.addEventListener('scroll', onNavScroll, { passive: true })
    onNavScroll()
    cleanups.push(() => window.removeEventListener('scroll', onNavScroll))

    /* ---------- mobile menu ---------- */
    const burger = root.querySelector('#burger')
    const mm = root.querySelector('#mobileMenu')
    if (burger && mm) {
      const onBurger = () => mm.classList.toggle('open')
      burger.addEventListener('click', onBurger)
      cleanups.push(() => burger.removeEventListener('click', onBurger))
      const linkClose = () => mm.classList.remove('open')
      const mmLinks = mm.querySelectorAll('a')
      mmLinks.forEach((a) => a.addEventListener('click', linkClose))
      cleanups.push(() => mmLinks.forEach((a) => a.removeEventListener('click', linkClose)))
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div className="site-chrome" ref={rootRef}>
      {/* ===================== PROMO BAR ===================== */}
      <div className="promobar">
        <div className="pm-track" id="pmTrack">
          <span className="pm-item">
            <span className="badge">Free Trial</span> See exactly who&apos;s visiting your site — turn anonymous
            traffic into qualified leads. Start free, no card required.{' '}
            <Link to="/pricing" className="pm-cta">
              Start free trial →
            </Link>{' '}
            <span className="sep">/</span>
          </span>
          <span className="pm-item">
            <span className="badge">Free Trial</span> See exactly who&apos;s visiting your site — turn anonymous
            traffic into qualified leads. Start free, no card required.{' '}
            <Link to="/pricing" className="pm-cta">
              Start free trial →
            </Link>{' '}
            <span className="sep">/</span>
          </span>
        </div>
      </div>

      {/* ===================== NAVBAR ===================== */}
      <header className="navbar" id="navbar">
        <Link to="/" className="nav-logo">
          <img
            src="/images/logo.jpeg"
            alt="Outmate"
            style={{ width: '30px', height: '30px', borderRadius: '8px', objectFit: 'cover', flex: '0 0 auto' }}
          />
          Outmate
        </Link>
        <nav className="nav-links">
          <div className="nav-item">
            <button className="nav-trigger">
              Product <span className="chev">▾</span>
            </button>
            <div className="nav-dd wide">
              <Link className="dd-link" to="/product/website-identification">
                <span className="dd-ico">◎</span>
                <span className="dd-txt">
                  <span className="t">Website Identification</span>
                  <span className="d">Identify anonymous B2B visitors in real-time</span>
                </span>
              </Link>
              <Link className="dd-link" to="/product/b2b-database">
                <span className="dd-ico">▦</span>
                <span className="dd-txt">
                  <span className="t">B2B Database</span>
                  <span className="d">200M verified contacts, enriched &amp; signal-ready</span>
                </span>
              </Link>
              <Link className="dd-link" to="/product/co-pilot">
                <span className="dd-ico">✳</span>
                <span className="dd-txt">
                  <span className="t">Co-Pilot</span>
                  <span className="d">AI GTM co-pilot that writes outreach automatically</span>
                </span>
              </Link>
              <Link className="dd-link" to="/product/voice-ai-agent">
                <span className="dd-ico">◈</span>
                <span className="dd-txt">
                  <span className="t">Voice AI Agent</span>
                  <span className="d">Autonomous outbound calling, signal-triggered</span>
                </span>
              </Link>
              <Link className="dd-link" to="/product/social-agent">
                <span className="dd-ico">@</span>
                <span className="dd-txt">
                  <span className="t">Social Agent</span>
                  <span className="d">Turn social signals into pipeline automatically</span>
                </span>
              </Link>
              <Link className="dd-link" to="/product/workflow-automation">
                <span className="dd-ico">⚡</span>
                <span className="dd-txt">
                  <span className="t">Workflow Automation</span>
                  <span className="d">Route high-intent visitors into alerts, sequences, and next best actions</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="nav-item">
            <button className="nav-trigger">
              Use Cases <span className="chev">▾</span>
            </button>
            <div className="nav-dd">
              <Link className="dd-link" to="/use-cases/identify-visitors">
                <span className="dd-ico">◎</span>
                <span className="dd-txt">
                  <span className="t">Identify High-Intent Visitors</span>
                  <span className="d">Know who&apos;s on your site before they call you</span>
                </span>
              </Link>
              <Link className="dd-link" to="/use-cases/enrich-route-leads">
                <span className="dd-ico">▦</span>
                <span className="dd-txt">
                  <span className="t">Enrich &amp; Route Leads</span>
                  <span className="d">Instant context for every inbound prospect</span>
                </span>
              </Link>
              <Link className="dd-link" to="/use-cases/automate-workflows">
                <span className="dd-ico">⚡</span>
                <span className="dd-txt">
                  <span className="t">Automate GTM Workflows</span>
                  <span className="d">Signal-triggered actions across your entire stack</span>
                </span>
              </Link>
              <Link className="dd-link" to="/use-cases/ai-outbound">
                <span className="dd-ico">◈</span>
                <span className="dd-txt">
                  <span className="t">Run AI-Powered Outbound</span>
                  <span className="d">Autonomous calling and email at scale</span>
                </span>
              </Link>
              <Link className="dd-link" to="/use-cases/sales-team">
                <span className="dd-ico">◆</span>
                <span className="dd-txt">
                  <span className="t">Sales Teams</span>
                  <span className="d">Arm your sales team with AI-driven pipeline</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="nav-item">
            <button className="nav-trigger">
              Labs <span className="chev">▾</span>
            </button>
            <div className="nav-dd">
              <Link className="dd-link" to="/labs">
                <span className="dd-ico">⚗</span>
                <span className="dd-txt">
                  <span className="t">Labs Home</span>
                  <span className="d">Experiments from the Outmate team</span>
                </span>
              </Link>
              <Link className="dd-link" to="/labs/free-tools">
                <span className="dd-ico">⚙</span>
                <span className="dd-txt">
                  <span className="t">Free Tools</span>
                  <span className="d">Free GTM utilities, no signup</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="nav-item">
            <Link to="/pricing" className="nav-trigger">
              Pricing
            </Link>
          </div>
          <div className="nav-item">
            <button className="nav-trigger">
              Compare <span className="chev">▾</span>
            </button>
            <div className="nav-dd">
              <Link className="dd-link" to="/compare">
                <span className="dd-ico">⇄</span>
                <span className="dd-txt">
                  <span className="t">Comparisons</span>
                  <span className="d">How Outmate stacks up</span>
                </span>
              </Link>
              <Link className="dd-link" to="/compare/everyone">
                <span className="dd-ico">⊕</span>
                <span className="dd-txt">
                  <span className="t">Outmate vs Everyone</span>
                  <span className="d">The full breakdown</span>
                </span>
              </Link>
              <Link className="dd-link" to="/compare/rb2b">
                <span className="dd-ico">⊗</span>
                <span className="dd-txt">
                  <span className="t">Outmate vs RB2B</span>
                  <span className="d">Head to head</span>
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="nav-cta">
          <Link to="/pricing" className="pill">
            GET LEADS FREE
          </Link>
          <Link to="/book-demo" className="btn demo" style={{ height: '38px' }}>
            BOOK A DEMO →
          </Link>
          <button className="nav-burger" id="burger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* mobile menu */}
      <div className="mobile-menu" id="mobileMenu">
        <div className="mm-group">
          <h4>Product</h4>
          <Link to="/product/website-identification">Website Identification</Link>
          <Link to="/product/b2b-database">B2B Database</Link>
          <Link to="/product/co-pilot">Co-Pilot</Link>
          <Link to="/product/voice-ai-agent">Voice AI Agent</Link>
          <Link to="/product/social-agent">Social Agent</Link>
          <Link to="/product/workflow-automation">Workflow Automation</Link>
        </div>
        <div className="mm-group">
          <h4>Use Cases</h4>
          <Link to="/use-cases/identify-visitors">Identify High-Intent Visitors</Link>
          <Link to="/use-cases/enrich-route-leads">Enrich &amp; Route Leads</Link>
          <Link to="/use-cases/automate-workflows">Automate GTM Workflows</Link>
          <Link to="/use-cases/ai-outbound">Run AI-Powered Outbound</Link>
          <Link to="/use-cases/sales-team">Sales Teams</Link>
        </div>
        <div className="mm-group">
          <h4>More</h4>
          <Link to="/labs">Labs</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/compare">Compare</Link>
        </div>
        <div className="mm-group">
          <Link to="/book-demo" className="btn solid" style={{ display: 'inline-flex' }}>
            BOOK A DEMO →
          </Link>
        </div>
      </div>
    </div>
  )
}
