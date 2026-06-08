import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './home.css'

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)

  // reset scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // smooth-scroll helpers for in-page anchors (scroll-behavior:smooth lives on
  // .home-root, which doesn't make document-level anchor jumps smooth)
  const scrollToId = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' })
  }
  // ── all ported interactions (outmate.js + home.js), scoped to the root ──
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    /* ---------- year ---------- */
    const yr = root.querySelector('#yr')
    if (yr) yr.textContent = String(new Date().getFullYear())

    /* ---------- reveal on scroll ---------- */
    const revealEls = root.querySelectorAll('.reveal')
    let revealIO: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              revealIO!.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      revealEls.forEach((el) => revealIO!.observe(el))
      cleanups.push(() => revealIO!.disconnect())
    } else {
      revealEls.forEach((el) => el.classList.add('in'))
    }

    /* ---------- navbar scroll state ---------- */
    const navbar = root.querySelector('#navbar')
    const onNavScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 100)
    }
    window.addEventListener('scroll', onNavScroll, { passive: true })
    onNavScroll()
    cleanups.push(() => window.removeEventListener('scroll', onNavScroll))

    /* ---------- dropdown hover-intent + keyboard ---------- */
    const navItems = Array.from(root.querySelectorAll<HTMLElement>('.nav-links .nav-item'))
    navItems.forEach((item) => {
      // only items that actually have a dropdown panel (simple .nav-dd or wide .mega-dd)
      if (!item.querySelector('.nav-dd, .mega-dd')) return
      let hideTimer: ReturnType<typeof setTimeout> | null = null
      const clearHide = () => {
        if (hideTimer) {
          clearTimeout(hideTimer)
          hideTimer = null
        }
      }
      const open = () => {
        clearHide()
        // mega panels are fixed + centered, so close any sibling before opening
        navItems.forEach((i) => { if (i !== item) i.classList.remove('open') })
        item.classList.add('open')
      }
      const scheduleClose = () => {
        clearHide()
        // grace period: stay open long enough to cross the trigger→panel gap
        hideTimer = setTimeout(() => item.classList.remove('open'), 280)
      }
      const onEnter = () => open()
      const onLeave = () => scheduleClose()
      const onFocusIn = () => open()
      const onFocusOut = (e: FocusEvent) => {
        // close only when focus moves outside this nav-item
        if (!item.contains(e.relatedTarget as Node)) scheduleClose()
      }
      const onLinkClick = () => {
        clearHide()
        item.classList.remove('open')
      }
      const ddLinks = Array.from(item.querySelectorAll('a'))
      ddLinks.forEach((a) => a.addEventListener('click', onLinkClick))
      item.addEventListener('mouseenter', onEnter)
      item.addEventListener('mouseleave', onLeave)
      item.addEventListener('focusin', onFocusIn)
      item.addEventListener('focusout', onFocusOut)
      cleanups.push(() => {
        clearHide()
        ddLinks.forEach((a) => a.removeEventListener('click', onLinkClick))
        item.removeEventListener('mouseenter', onEnter)
        item.removeEventListener('mouseleave', onLeave)
        item.removeEventListener('focusin', onFocusIn)
        item.removeEventListener('focusout', onFocusOut)
      })
    })
    const closeAllDd = () => navItems.forEach((i) => i.classList.remove('open'))
    const onDdKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllDd()
    }
    const onDocClickDd = (e: MouseEvent) => {
      if (!root.contains(e.target as Node)) closeAllDd()
    }
    document.addEventListener('keydown', onDdKeyDown)
    document.addEventListener('click', onDocClickDd)
    cleanups.push(() => {
      document.removeEventListener('keydown', onDdKeyDown)
      document.removeEventListener('click', onDocClickDd)
    })

    /* ---------- mobile menu ---------- */
    const burger = root.querySelector('#burger')
    const mm = root.querySelector('#mobileMenu')
    if (burger && mm) {
      const toggle = () => mm.classList.toggle('open')
      burger.addEventListener('click', toggle)
      cleanups.push(() => burger.removeEventListener('click', toggle))
      mm.querySelectorAll('a').forEach((a) => {
        const h = () => mm.classList.remove('open')
        a.addEventListener('click', h)
        cleanups.push(() => a.removeEventListener('click', h))
      })
    }

    /* ---------- analytics step flow animation ---------- */
    const anSteps = Array.from(root.querySelectorAll<HTMLElement>('.an-step'))
    if (anSteps.length && 'IntersectionObserver' in window) {
      let stepI = 0
      let stepTimer = 0
      const anSection = root.querySelector('.analytics')
      const runSteps = () => {
        anSteps.forEach((s) => s.classList.remove('as-active'))
        anSteps[stepI].classList.add('as-active')
        stepI = (stepI + 1) % anSteps.length
      }
      const sio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting && !stepTimer) {
              runSteps()
              stepTimer = window.setInterval(runSteps, 1400)
            } else if (!e.isIntersecting && stepTimer) {
              clearInterval(stepTimer)
              stepTimer = 0
              anSteps.forEach((s) => s.classList.remove('as-active'))
            }
          })
        },
        { threshold: 0.3 },
      )
      if (anSection) {
        sio.observe(anSection)
        cleanups.push(() => sio.disconnect())
      }
      cleanups.push(() => {
        if (stepTimer) clearInterval(stepTimer)
      })
    }

    /* ---------- generic tab switcher ---------- */
    const wireTabs = (
      tabSel: string,
      paneSel: string,
      attr: string,
      onChange?: (k: string) => void,
      paneAttr?: string,
    ) => {
      const pa = paneAttr || attr
      const tabs = Array.from(root.querySelectorAll<HTMLElement>(tabSel))
      const panes = Array.from(root.querySelectorAll<HTMLElement>(paneSel))
      const select = (k: string) => {
        tabs.forEach((t) => t.setAttribute('aria-selected', t.getAttribute(attr) === k ? 'true' : 'false'))
        panes.forEach((p) => p.classList.toggle('on', p.getAttribute(pa) === k))
        onChange?.(k)
      }
      tabs.forEach((t) => {
        const h = () => {
          const v = t.getAttribute(attr)
          if (v != null) select(v)
        }
        t.addEventListener('click', h)
        cleanups.push(() => t.removeEventListener('click', h))
      })
      return { tabs, select }
    }

    /* ---------- sandbox cursor guide ---------- */
    const sbCursor = root.querySelector('#sbCursor')
    if (sbCursor) {
      root.querySelectorAll<HTMLElement>('.tab-btn').forEach((b) => {
        const h = () => sbCursor.classList.add('gone')
        b.addEventListener('click', h, { once: true })
        cleanups.push(() => b.removeEventListener('click', h))
      })
    }

    /* ---------- sandbox tabs ---------- */
    const wsLabel = root.querySelector('#wsLabel')
    const tabLabels: Record<string, string> = {
      visitor: 'Visitor Intelligence',
      enrich: 'Database Enrichment',
      copilot: 'AI Copilot',
      signals: 'Signal Intelligence',
      workflows: 'Workflows',
      outbound: 'Outbound Engine',
      voice: 'Voice Agent',
      analytics: 'Analytics',
    }
    wireTabs(
      '#tabBar .tab-btn',
      '#panelWrap .panel',
      'data-tab',
      (k) => {
        if (wsLabel) wsLabel.textContent = tabLabels[k] || k
      },
      'data-panel',
    )

    /* ---------- sandbox sidebar jumps ---------- */
    root.querySelectorAll<HTMLElement>('.side-item[data-jump]').forEach((s) => {
      const h = () => {
        const k = s.getAttribute('data-jump')
        root.querySelectorAll('.side-item').forEach((x) => x.classList.remove('active'))
        s.classList.add('active')
        const btn = root.querySelector<HTMLElement>(`.tab-btn[data-tab="${k}"]`)
        if (btn) btn.click()
      }
      s.addEventListener('click', h)
      cleanups.push(() => s.removeEventListener('click', h))
    })

    /* ---------- live note rotation ---------- */
    const liveNote = root.querySelector('#liveNote')
    const liveNotes = [
      'OpenAI renewed pricing view',
      'Anthropic triggered SDR hiring signal',
      'Stripe account enriched with direct phone',
      'HubSpot moved to outbound queue',
    ]
    if (liveNote && !reduce) {
      let li = 0
      const id = window.setInterval(() => {
        li = (li + 1) % liveNotes.length
        liveNote.textContent = liveNotes[li]
      }, 2400)
      cleanups.push(() => clearInterval(id))
    }

    /* ---------- how it works (auto-advance 6s, pause on hover) ---------- */
    const hwData = [
      {
        t: 'Reveal the people behind anonymous traffic.',
        d: 'Deploy one lightweight pixel and instantly resolve names, companies, and roles from the 70–80% of visitors who never fill out a form.',
        b: ['Real-time account-level ID', 'No forms / cookies-only guesswork', 'Works on every page'],
      },
      {
        t: 'Read buying intent as it happens.',
        d: 'Track page paths, visit depth, and behavioral clusters to see exactly who is in-market right now.',
        b: ['Live behavioral signal tracking', 'Intent scoring out of 100', 'Catch buyers before they go cold'],
      },
      {
        t: 'Score every lead against your ICP.',
        d: 'Combine firmographics, tech stack, and intent into one automatic fit score.',
        b: ['Automatic ICP fit scoring', 'Custom qualification rules', 'Filter noise before it reaches sales'],
      },
      {
        t: 'Append verified contact data instantly.',
        d: 'Emails, mobiles, and firmographics from a 32M+ contact graph, appended in seconds.',
        b: ['97% match accuracy', 'Verified emails & direct dials', 'Enrichment in under 2 seconds'],
      },
      {
        t: 'Reach out with AI personalization.',
        d: 'Launch multi-channel sequences personalized to each visitor’s behavior.',
        b: ['AI-personalized at scale', 'Email + LinkedIn sequences', 'Automatic timed follow-ups'],
      },
      {
        t: 'Replies, meetings, and leads — automatically in your CRM.',
        d: 'Push everything to HubSpot, Salesforce, or Pipedrive the moment it happens.',
        b: ['Multiple native integrations', 'Zapier + webhooks', 'Custom integrations on demand'],
      },
    ]
    const hwTitle = root.querySelector('#hwTitle')
    const hwDesc = root.querySelector('#hwDesc')
    const hwBullets = root.querySelector('#hwBullets')
    let hwUserActed = false
    let hwTimer = 0
    let hwI = 0
    const hwCtl = wireTabs('#hwTabs .hw-tab', '.hw-visual .hw-pane', 'data-hw', (k) => {
      const d = hwData[+k]
      if (!d) return
      if (hwTitle) hwTitle.textContent = d.t
      if (hwDesc) hwDesc.textContent = d.d
      if (hwBullets) hwBullets.innerHTML = d.b.map((x) => `<li><span class="mk">✳</span>${x}</li>`).join('')
      hwI = +k
    })
    root.querySelectorAll<HTMLElement>('#hwTabs .hw-tab').forEach((t) => {
      const h = () => {
        hwUserActed = true
        if (hwTimer) {
          clearInterval(hwTimer)
          hwTimer = 0
        }
      }
      t.addEventListener('click', h)
      cleanups.push(() => t.removeEventListener('click', h))
    })
    const howSec = root.querySelector('#how')
    if (howSec && !reduce && 'IntersectionObserver' in window) {
      const hio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting && !hwUserActed && !hwTimer) {
              hwTimer = window.setInterval(() => {
                if (hwUserActed) {
                  clearInterval(hwTimer)
                  hwTimer = 0
                  return
                }
                hwI = (hwI + 1) % 6
                hwCtl.select(String(hwI))
              }, 6000)
            } else if (!e.isIntersecting && hwTimer) {
              clearInterval(hwTimer)
              hwTimer = 0
            }
          })
        },
        { threshold: 0.3 },
      )
      hio.observe(howSec)
      cleanups.push(() => hio.disconnect())
      const onEnter = () => {
        if (hwTimer) {
          clearInterval(hwTimer)
          hwTimer = 0
        }
      }
      howSec.addEventListener('mouseenter', onEnter)
      cleanups.push(() => howSec.removeEventListener('mouseenter', onEnter))
    }
    cleanups.push(() => {
      if (hwTimer) clearInterval(hwTimer)
    })

    /* ---------- platform capabilities toggle + use case tabs ---------- */
    wireTabs('.caps-toggle .caps-tb', '.caps-panel', 'data-caps', undefined, 'data-caps')
    wireTabs('#ucTabs .uc-tab', '.uc-stage .uc-pane', 'data-uc')

    /* ---------- count-ups ---------- */
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const fmt = (v: number, dec: boolean) => (dec ? v.toFixed(1) : Math.round(v).toLocaleString('en-US'))
    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.getAttribute('data-count') || '0')
      const dec = el.getAttribute('data-dec') === '1'
      if (reduce) {
        el.textContent = fmt(target, dec)
        return
      }
      const dur = 1400
      let start: number | null = null
      let rafId = 0
      const step = (ts: number) => {
        if (start === null) start = ts
        const p = Math.min(1, (ts - start) / dur)
        el.textContent = fmt(target * easeOut(p), dec)
        if (p < 1) rafId = requestAnimationFrame(step)
        else el.textContent = fmt(target, dec)
      }
      rafId = requestAnimationFrame(step)
      cleanups.push(() => cancelAnimationFrame(rafId))
    }
    const counters = root.querySelectorAll<HTMLElement>('[data-count]')
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              runCount(e.target as HTMLElement)
              cio.unobserve(e.target)
            }
          })
        },
        { threshold: 0.5 },
      )
      counters.forEach((el) => cio.observe(el))
      cleanups.push(() => cio.disconnect())
    } else {
      counters.forEach((el) => {
        el.textContent = el.getAttribute('data-count')
      })
    }

    /* ---------- identity pixel reveal ---------- */
    const idPix = root.querySelector<HTMLElement>('#idPix')
    if (idPix && !reduce) {
      const names = ['M', 'MAYA', 'Maya Chen']
      let ni = 0
      const id = window.setInterval(() => {
        ni = (ni + 1) % names.length
        idPix.textContent = names[ni]
        idPix.style.color = ni === 2 ? '#fff' : ni === 1 ? '#6a5cf0' : '#2a2a30'
        idPix.style.fontSize = ni === 2 ? '22px' : ni === 1 ? '40px' : '64px'
      }, 1400)
      cleanups.push(() => clearInterval(id))
    }

    /* ---------- hero particle constellation (no-op if #heroCanvas absent) ---------- */
    const canvas = root.querySelector<HTMLCanvasElement>('#heroCanvas')
    if (canvas && !reduce) {
      const ctx = canvas.getContext('2d')!
      let pts: Array<{ x: number; y: number; vx: number; vy: number }> = []
      let W = 0
      let H = 0
      let raf = 0
      const resize = () => {
        const r = canvas.getBoundingClientRect()
        W = canvas.width = r.width * devicePixelRatio
        H = canvas.height = r.height * devicePixelRatio
      }
      const init = () => {
        resize()
        const n = Math.min(70, Math.floor(W / 26))
        pts = []
        for (let i = 0; i < n; i++) {
          pts.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
            vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
          })
        }
      }
      const draw = () => {
        ctx.clearRect(0, 0, W, H)
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i]
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > W) p.vx *= -1
          if (p.y < 0 || p.y > H) p.vy *= -1
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j]
            const dx = p.x - q.x
            const dy = p.y - q.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const max = 130 * devicePixelRatio
            if (dist < max) {
              ctx.strokeStyle = 'rgba(80,70,230,' + 0.18 * (1 - dist / max) + ')'
              ctx.lineWidth = devicePixelRatio
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.stroke()
            }
          }
          ctx.fillStyle = 'rgba(150,145,235,0.7)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.4 * devicePixelRatio, 0, Math.PI * 2)
          ctx.fill()
        }
        raf = requestAnimationFrame(draw)
      }
      init()
      draw()
      const onResize = () => {
        cancelAnimationFrame(raf)
        init()
        draw()
      }
      window.addEventListener('resize', onResize)
      cleanups.push(() => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', onResize)
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div className="home-root" id="top" ref={rootRef}>
      {/* ===================== HOME CHROME (promobar + mega navbar) ===================== */}
      <div className="site-chrome">
        {/* PROMO BAR */}
        <div className="promobar">
          <div className="pm-track" id="pmTrack">
            <span className="pm-item">
              <span className="badge">Free Trial</span> See exactly who&apos;s visiting your site — turn anonymous
              traffic into qualified leads. Start free, no card required.{' '}
              <Link to="/book-demo" className="pm-cta">
                Start free trial →
              </Link>{' '}
              <span className="sep">/</span>
            </span>
            <span className="pm-item">
              <span className="badge">Free Trial</span> See exactly who&apos;s visiting your site — turn anonymous
              traffic into qualified leads. Start free, no card required.{' '}
              <Link to="/book-demo" className="pm-cta">
                Start free trial →
              </Link>{' '}
              <span className="sep">/</span>
            </span>
          </div>
        </div>

        {/* NAVBAR */}
        <header className="navbar" id="navbar">
          <a href="#top" className="nav-logo" onClick={scrollToId('top')}>
            <img src="/images/logo.jpeg" alt="Outmate" />Outmate
          </a>
          <nav className="nav-links">
            {/* PLATFORM mega */}
            <div className="nav-item mega-item">
              <button className="nav-trigger">
                Platform <span className="chev">▼</span>
              </button>
              <div className="mega-dd">
                <div className="mega-inner">
                  <div className="mega-col">
                    <span className="mega-group-label">Identify</span>
                    <Link className="mega-link" to="/product/website-identification">
                      <span className="ml-ico">◎</span>
                      <span className="ml-txt">
                        <span className="ml-t">Website Identification</span>
                        <span className="ml-d">Identify anonymous B2B visitors in real-time</span>
                      </span>
                    </Link>
                    <Link className="mega-link" to="/product/b2b-database">
                      <span className="ml-ico">▦</span>
                      <span className="ml-txt">
                        <span className="ml-t">B2B Database</span>
                        <span className="ml-d">200M verified contacts, enriched &amp; signal-ready</span>
                      </span>
                    </Link>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">Engage</span>
                    <Link className="mega-link" to="/product/co-pilot">
                      <span className="ml-ico">✳</span>
                      <span className="ml-txt">
                        <span className="ml-t">AI Co-Pilot</span>
                        <span className="ml-d">Writes personalized outreach automatically</span>
                      </span>
                    </Link>
                    <Link className="mega-link" to="/product/social-agent">
                      <span className="ml-ico">@</span>
                      <span className="ml-txt">
                        <span className="ml-t">Social Agent</span>
                        <span className="ml-d">Turn social signals into pipeline</span>
                      </span>
                    </Link>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">☏</span>
                      <span className="ml-txt">
                        <span className="ml-t">Voice AI Agent</span>
                        <span className="ml-d">Autonomous outbound calling, signal-triggered</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">Automate</span>
                    <Link className="mega-link" to="/product/workflow-automation">
                      <span className="ml-ico">⚡</span>
                      <span className="ml-txt">
                        <span className="ml-t">Workflow Automation</span>
                        <span className="ml-d">Signal-triggered actions across your stack</span>
                      </span>
                    </Link>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">⇄</span>
                      <span className="ml-txt">
                        <span className="ml-t">CRM Sync</span>
                        <span className="ml-d">Auto-push leads to HubSpot, Salesforce, Pipedrive</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col mega-col-dark">
                    <span className="mega-group-label" style={{ color: 'rgba(255,255,255,.45)' }}>
                      Platform
                    </span>
                    <a className="mega-link mega-link-dark placeholder-link">
                      <span className="ml-txt">
                        <span className="ml-t">Integrations</span>
                        <span className="ml-d">Connect 50+ tools in your stack</span>
                      </span>
                    </a>
                    <a className="mega-link mega-link-dark placeholder-link">
                      <span className="ml-txt">
                        <span className="ml-t">API Docs</span>
                        <span className="ml-d">Build on top of Outmate</span>
                      </span>
                    </a>
                    <a className="mega-link mega-link-dark placeholder-link">
                      <span className="ml-txt">
                        <span className="ml-t">Security &amp; Privacy</span>
                        <span className="ml-d">SOC 2 Type II · GDPR · CCPA</span>
                      </span>
                    </a>
                    <div className="mega-cta-strip">
                      <Link to="/book-demo" className="btn solid" style={{ height: '34px', fontSize: '11px', padding: '0 14px' }}>
                        Try free →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* USE CASES mega */}
            <div className="nav-item mega-item">
              <button className="nav-trigger">
                Use Cases <span className="chev">▼</span>
              </button>
              <div className="mega-dd">
                <div className="mega-inner">
                  <div className="mega-col">
                    <span className="mega-group-label">By Goal</span>
                    <Link className="mega-link" to="/use-cases/identify-visitors">
                      <span className="ml-ico">◎</span>
                      <span className="ml-txt">
                        <span className="ml-t">Identify High-Intent Visitors</span>
                        <span className="ml-d">Know who&apos;s on your site before they call</span>
                      </span>
                    </Link>
                    <Link className="mega-link" to="/use-cases/enrich-route-leads">
                      <span className="ml-ico">▦</span>
                      <span className="ml-txt">
                        <span className="ml-t">Enrich &amp; Route Leads</span>
                        <span className="ml-d">Instant context for every inbound prospect</span>
                      </span>
                    </Link>
                    <Link className="mega-link" to="/use-cases/automate-workflows">
                      <span className="ml-ico">⚡</span>
                      <span className="ml-txt">
                        <span className="ml-t">Automate GTM Workflows</span>
                        <span className="ml-d">Signal-triggered actions across your stack</span>
                      </span>
                    </Link>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">By Team</span>
                    <Link className="mega-link" to="/use-cases/sales-team">
                      <span className="ml-ico">◷</span>
                      <span className="ml-txt">
                        <span className="ml-t">Sales Teams</span>
                        <span className="ml-d">Arm reps with real-time intent data</span>
                      </span>
                    </Link>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◭</span>
                      <span className="ml-txt">
                        <span className="ml-t">Marketing Teams</span>
                        <span className="ml-d">Convert anonymous traffic into named leads</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◍</span>
                      <span className="ml-txt">
                        <span className="ml-t">RevOps</span>
                        <span className="ml-d">Clean CRM, seamless routing, full attribution</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">By Role</span>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◆</span>
                      <span className="ml-txt">
                        <span className="ml-t">Founder-Led GTM</span>
                        <span className="ml-d">Automate pipeline while you build the product</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">⬣</span>
                      <span className="ml-txt">
                        <span className="ml-t">Agencies</span>
                        <span className="ml-d">Scale client results from one workspace</span>
                      </span>
                    </a>
                    <Link className="mega-link" to="/use-cases/ai-outbound">
                      <span className="ml-ico">◈</span>
                      <span className="ml-txt">
                        <span className="ml-t">Run AI-Powered Outbound</span>
                        <span className="ml-d">Autonomous calling and email at scale</span>
                      </span>
                    </Link>
                  </div>
                  <div className="mega-col mega-col-dark">
                    <span className="mega-group-label" style={{ color: 'rgba(255,255,255,.45)' }}>
                      Results
                    </span>
                    <div className="mega-stat">
                      <span className="ms-n">+312%</span>
                      <span className="ms-l">Pipeline generated</span>
                    </div>
                    <div className="mega-stat">
                      <span className="ms-n">97%</span>
                      <span className="ms-l">Visitor match accuracy</span>
                    </div>
                    <div className="mega-stat">
                      <span className="ms-n">&lt;2s</span>
                      <span className="ms-l">Resolution time</span>
                    </div>
                    <div className="mega-cta-strip" style={{ marginTop: 'auto' }}>
                      <Link to="/use-cases/identify-visitors" className="btn solid" style={{ height: '34px', fontSize: '11px', padding: '0 14px' }}>
                        See all use cases →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESOURCES mega */}
            <div className="nav-item mega-item">
              <button className="nav-trigger">
                Resources <span className="chev">▼</span>
              </button>
              <div className="mega-dd">
                <div className="mega-inner">
                  <div className="mega-col">
                    <span className="mega-group-label">Learn</span>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">⌘</span>
                      <span className="ml-txt">
                        <span className="ml-t">Documentation</span>
                        <span className="ml-d">Everything you need to get started</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◌</span>
                      <span className="ml-txt">
                        <span className="ml-t">API Docs</span>
                        <span className="ml-d">Build on top of Outmate</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◷</span>
                      <span className="ml-txt">
                        <span className="ml-t">Blog</span>
                        <span className="ml-d">GTM playbooks &amp; product updates</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">Connect</span>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◇</span>
                      <span className="ml-txt">
                        <span className="ml-t">Integrations</span>
                        <span className="ml-d">Connect 50+ tools in your stack</span>
                      </span>
                    </a>
                    <Link className="mega-link" to="/compare">
                      <span className="ml-ico">◑</span>
                      <span className="ml-txt">
                        <span className="ml-t">Compare</span>
                        <span className="ml-d">See how Outmate stacks up</span>
                      </span>
                    </Link>
                    <Link className="mega-link" to="/labs/free-tools">
                      <span className="ml-ico">✦</span>
                      <span className="ml-txt">
                        <span className="ml-t">Labs &amp; Free Tools</span>
                        <span className="ml-d">Experiments &amp; free GTM utilities</span>
                      </span>
                    </Link>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">Support</span>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◔</span>
                      <span className="ml-txt">
                        <span className="ml-t">Help Center</span>
                        <span className="ml-d">Guides, FAQs &amp; support</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">♥</span>
                      <span className="ml-txt">
                        <span className="ml-t">Customer Stories</span>
                        <span className="ml-d">How teams win with Outmate</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">▦</span>
                      <span className="ml-txt">
                        <span className="ml-t">Security &amp; Privacy</span>
                        <span className="ml-d">SOC 2 Type II · GDPR · CCPA</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col mega-col-dark">
                    <span className="mega-group-label" style={{ color: 'rgba(255,255,255,.45)' }}>
                      Get Started
                    </span>
                    <Link className="mega-link mega-link-dark" to="/book-demo">
                      <span className="ml-txt">
                        <span className="ml-t">Book a Demo</span>
                        <span className="ml-d">See Outmate live in 20 minutes</span>
                      </span>
                    </Link>
                    <Link className="mega-link mega-link-dark" to="/book-demo">
                      <span className="ml-txt">
                        <span className="ml-t">Start Free Trial</span>
                        <span className="ml-d">14 days, no credit card</span>
                      </span>
                    </Link>
                    <div className="mega-cta-strip">
                      <Link to="/book-demo" className="btn solid" style={{ height: '34px', fontSize: '11px', padding: '0 14px' }}>
                        Try free →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPANY mega */}
            <div className="nav-item mega-item">
              <button className="nav-trigger">
                Company <span className="chev">▼</span>
              </button>
              <div className="mega-dd">
                <div className="mega-inner">
                  <div className="mega-col">
                    <span className="mega-group-label">About</span>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">⬡</span>
                      <span className="ml-txt">
                        <span className="ml-t">About Outmate</span>
                        <span className="ml-d">Our mission &amp; the team behind it</span>
                      </span>
                    </a>
                    <a className="mega-link placeholder-link">
                      <span className="ml-ico">◭</span>
                      <span className="ml-txt">
                        <span className="ml-t">Careers</span>
                        <span className="ml-d">Join us building the GTM OS</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">Connect</span>
                    <Link className="mega-link" to="/book-demo">
                      <span className="ml-ico">✉</span>
                      <span className="ml-txt">
                        <span className="ml-t">Contact Sales</span>
                        <span className="ml-d">Talk to our team</span>
                      </span>
                    </Link>
                    <a
                      className="mega-link"
                      href="https://www.linkedin.com/company/outmateai/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="ml-ico">in</span>
                      <span className="ml-txt">
                        <span className="ml-t">LinkedIn</span>
                        <span className="ml-d">Follow our journey</span>
                      </span>
                    </a>
                  </div>
                  <div className="mega-col">
                    <span className="mega-group-label">Pricing</span>
                    <Link className="mega-link" to="/pricing">
                      <span className="ml-ico">◐</span>
                      <span className="ml-txt">
                        <span className="ml-t">Plans &amp; Pricing</span>
                        <span className="ml-d">Simple, transparent pricing</span>
                      </span>
                    </Link>
                    <Link className="mega-link" to="/pricing">
                      <span className="ml-ico">◷</span>
                      <span className="ml-txt">
                        <span className="ml-t">For Startups</span>
                        <span className="ml-d">Special pricing for early teams</span>
                      </span>
                    </Link>
                  </div>
                  <div className="mega-col mega-col-dark">
                    <span className="mega-group-label" style={{ color: 'rgba(255,255,255,.45)' }}>
                      Trusted By
                    </span>
                    <div className="mega-stat">
                      <span className="ms-n">100+</span>
                      <span className="ms-l">Revenue teams</span>
                    </div>
                    <div className="mega-stat">
                      <span className="ms-n">4.8★</span>
                      <span className="ms-l">G2 &amp; Capterra</span>
                    </div>
                    <div className="mega-stat">
                      <span className="ms-n">SOC 2</span>
                      <span className="ms-l">Type II certified</span>
                    </div>
                    <div className="mega-cta-strip" style={{ marginTop: 'auto' }}>
                      <Link to="/book-demo" className="btn solid" style={{ height: '34px', fontSize: '11px', padding: '0 14px' }}>
                        Book a demo →
                      </Link>
                    </div>
                  </div>
                </div>
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

        {/* MOBILE MENU */}
        <div className="mobile-menu" id="mobileMenu">
          <div className="mm-group">
            <h4>Platform</h4>
            <Link to="/product/website-identification">Website Identification</Link>
            <Link to="/product/b2b-database">B2B Database</Link>
            <Link to="/product/co-pilot">AI Co-Pilot</Link>
            <Link to="/product/social-agent">Social Agent</Link>
            <Link to="/product/workflow-automation">Workflow Automation</Link>
          </div>
          <div className="mm-group">
            <h4>Use Cases</h4>
            <Link to="/use-cases/identify-visitors">Identify High-Intent Visitors</Link>
            <Link to="/use-cases/enrich-route-leads">Enrich &amp; Route Leads</Link>
            <Link to="/use-cases/automate-workflows">Automate GTM Workflows</Link>
            <Link to="/use-cases/sales-team">Sales Teams</Link>
            <Link to="/use-cases/ai-outbound">Run AI-Powered Outbound</Link>
          </div>
          <div className="mm-group">
            <h4>Resources</h4>
            <Link to="/compare">Compare</Link>
            <Link to="/labs/free-tools">Labs &amp; Free Tools</Link>
            <Link to="/labs">Labs</Link>
          </div>
          <div className="mm-group">
            <h4>Company</h4>
            <Link to="/pricing">Pricing</Link>
            <Link to="/book-demo">Contact</Link>
          </div>
          <div className="mm-group">
            <Link to="/book-demo" className="btn solid" style={{ display: 'inline-flex' }}>
              BOOK A DEMO →
            </Link>
          </div>
        </div>
      </div>

      <main>
        {/* ===================== 1 · HERO + SANDBOX (joined) ===================== */}
        <section className="hero hhome" id="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1>
              <span className="g0">OUTMATE</span>
              <span className="mark acc-dot">.</span>
              <span className="ghost">AI</span>
            </h1>
          </div>
          <div className="hero-centered">
            <div className="hc-left">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ #1 WEBSITE VISITOR IDENTIFICATION PLATFORM</span>
              </div>
              <h2 className="lp-headline hc-title reveal">
                Convert anonymous visitors into <span className="acc">qualified pipeline.</span>
              </h2>
            </div>
            <div className="hc-right">
              <p className="lp-sub hc-sub reveal">
                Identify anonymous website visitors, enrich contact data in real time, and trigger outbound workflows
                automatically — before competitors even know the account exists.
              </p>
              <div className="cta-row hc-cta reveal">
                <Link to="/book-demo" className="btn solid">
                  Book a Demo →
                </Link>
                <a href="#platform-sandbox" className="btn" onClick={scrollToId('platform-sandbox')}>
                  See Platform →
                </a>
              </div>
              <span className="micro reveal">14-day free trial · No credit card · 5 min setup · Cancel anytime</span>
              <div className="hero-trust-badges reveal">
                <span className="htb">
                  <span className="hs">★</span>4.8 on G2
                </span>
                <span className="htb">
                  <span className="hs">★</span>4.8 Capterra
                </span>
                <span className="htb">
                  <span className="dot"></span>SOC 2 Type II
                </span>
                <span className="htb">
                  <span className="dot"></span>GDPR &amp; CCPA
                </span>
                <span className="htb">
                  <span className="dot"></span>100+ Revenue Teams
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2 · PLATFORM SANDBOX (joined to hero) ===================== */}
        <section className="sandbox h-sec joined" id="platform-sandbox" data-screen-label="Platform Sandbox">
          <div className="app reveal">
            {/* animated cursor guide */}
            <div className="sb-cursor" id="sbCursor">
              <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 2L2 26L8 20L12 30L15.5 28.5L11.5 18.5L20 18.5L2 2Z"
                  fill="#0A0A0A"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="app-chrome">
              <div className="lights">
                <i className="r"></i>
                <i className="a"></i>
                <i className="g"></i>
              </div>
              <div className="addr">app.outmate.ai/platform</div>
              <div className="chrome-actions">
                <span className="ca">⛃ Filter</span>
                <span className="ca">◷ Activity</span>
              </div>
            </div>
            <div className="app-body">
              {/* sidebar */}
              <aside className="app-side">
                <div className="brand">
                  <span className="bi">⬡</span>
                  <span>
                    <span className="bt">Outmate</span>
                    <span className="bs">GTM operating system</span>
                  </span>
                </div>
                <div className="grp">Workspace</div>
                <div className="side-item active" data-jump="visitor">
                  <span className="si">▦</span>Dashboard
                </div>
                <div className="side-item" data-jump="outbound">
                  <span className="si">◎</span>Visitors
                </div>
                <div className="side-item" data-jump="enrich">
                  <span className="si">▣</span>Accounts
                </div>
                <div className="side-item" data-jump="copilot">
                  <span className="si">◇</span>Contacts
                </div>
                <div className="side-item" data-jump="signals">
                  <span className="si">◈</span>Signals
                </div>
                <div className="side-item" data-jump="outbound">
                  <span className="si">⇄</span>Sequences
                </div>
                <div className="side-item" data-jump="voice">
                  <span className="si">◐</span>Voice
                </div>
                <div className="side-item" data-jump="copilot">
                  <span className="si">✉</span>Inbox<span className="badge">14</span>
                </div>
                <div className="side-item" data-jump="analytics">
                  <span className="si">▤</span>Analytics
                </div>
                <div className="side-item">
                  <span className="si">⚙</span>Settings
                </div>
                <div className="credits">
                  <div className="ct">
                    <span>Credits left</span>
                    <span>12k / 67%</span>
                  </div>
                  <div className="cbar">
                    <i></i>
                  </div>
                  <button className="upg">Upgrade</button>
                </div>
              </aside>

              {/* main */}
              <div className="app-main">
                <div className="tab-bar" id="tabBar">
                  <button className="tab-btn" aria-selected="true" data-tab="visitor">
                    <span className="ti">◎</span>Visitor Intelligence
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="enrich">
                    <span className="ti">▦</span>Database Enrichment
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="copilot">
                    <span className="ti">✳</span>AI Copilot
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="signals">
                    <span className="ti">◈</span>Signal Intelligence
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="workflows">
                    <span className="ti">⚡</span>Workflows
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="outbound">
                    <span className="ti">⇄</span>Outbound Engine
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="voice">
                    <span className="ti">◐</span>Voice Agent
                  </button>
                  <button className="tab-btn" aria-selected="false" data-tab="analytics">
                    <span className="ti">▤</span>Analytics
                  </button>
                  <span className="live-pill">
                    <span className="d"></span>
                    <span id="liveNote">OpenAI renewed pricing view</span>
                  </span>
                </div>
                <div className="workspace-head">
                  <span className="d"></span>Live workspace · <span id="wsLabel">Visitor Intelligence</span>
                </div>

                <div className="panel-wrap" id="panelWrap">
                  {/* VISITOR */}
                  <div className="panel on" data-panel="visitor">
                    <h4>Anonymous Visitors Identified</h4>
                    <div className="panel-metrics">
                      <span className="pm-chip">
                        <b>2,486</b>live accounts today
                      </span>
                      <span className="pm-chip">
                        <b className="acc">+14</b>detected in the last 5 min
                      </span>
                    </div>
                    <div className="dtable visitors">
                      <div className="dh">
                        <span>Company</span>
                        <span>Visitor</span>
                        <span>Intent</span>
                        <span>Pages</span>
                        <span>Status</span>
                      </div>
                      <div className="dr">
                        <span className="co">
                          <span className="logo">O</span>OpenAI
                        </span>
                        <span>Growth leadership team</span>
                        <span className="score">
                          <span className="bar">
                            <i style={{ width: '96%' }}></i>
                          </span>
                          <b>96</b>
                        </span>
                        <span>Pricing · Demo · Security</span>
                        <span>
                          <span className="status hot">Hot</span>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">
                          <span className="logo">H</span>HubSpot
                        </span>
                        <span>RevOps director</span>
                        <span className="score">
                          <span className="bar">
                            <i style={{ width: '91%' }}></i>
                          </span>
                          <b>91</b>
                        </span>
                        <span>Comparisons · Use cases</span>
                        <span>
                          <span className="status engaged">Engaged</span>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">
                          <span className="logo">S</span>Stripe
                        </span>
                        <span>Enterprise marketing</span>
                        <span className="score">
                          <span className="bar">
                            <i style={{ width: '88%' }}></i>
                          </span>
                          <b>88</b>
                        </span>
                        <span>Platform · Integrations</span>
                        <span>
                          <span className="status monitoring">Monitoring</span>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">
                          <span className="logo">S</span>Salesforce
                        </span>
                        <span>Demand gen leader</span>
                        <span className="score">
                          <span className="bar">
                            <i style={{ width: '84%' }}></i>
                          </span>
                          <b>84</b>
                        </span>
                        <span>Outbound · Security</span>
                        <span>
                          <span className="status qualified">Qualified</span>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">
                          <span className="logo">N</span>Notion
                        </span>
                        <span>Operations manager</span>
                        <span className="score">
                          <span className="bar">
                            <i style={{ width: '79%' }}></i>
                          </span>
                          <b>79</b>
                        </span>
                        <span>Workflow · Inbox</span>
                        <span>
                          <span className="status warm">Warm</span>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">
                          <span className="logo">A</span>Anthropic
                        </span>
                        <span>Pipeline owner</span>
                        <span className="score">
                          <span className="bar">
                            <i style={{ width: '94%' }}></i>
                          </span>
                          <b>94</b>
                        </span>
                        <span>Demo · AI Copilot</span>
                        <span>
                          <span className="status live">Live</span>
                        </span>
                      </div>
                    </div>
                    <div className="activity">
                      <span className="ap">
                        <span className="d"></span>OpenAI visited pricing
                      </span>
                      <span className="ap">
                        <span className="d"></span>Anthropic revisited demo
                      </span>
                      <span className="ap">
                        <span className="d"></span>Stripe returned from comparison
                      </span>
                      <span className="ap">
                        <span className="d"></span>HubSpot hit the contact page
                      </span>
                      <span className="online">● Online now: 184</span>
                    </div>
                  </div>

                  {/* ENRICH */}
                  <div className="panel" data-panel="enrich">
                    <h4>Database Enrichment</h4>
                    <p className="psub">
                      Apollo-like data density — every visitor matched to a verified contact record.
                    </p>
                    <div className="dtable enrich" style={{ marginTop: '16px' }}>
                      <div className="dh">
                        <span>Name</span>
                        <span>Company</span>
                        <span>Role</span>
                        <span>Email</span>
                        <span>Phone</span>
                        <span>Score</span>
                      </div>
                      <div className="dr">
                        <span className="co">Maya Chen</span>
                        <span>OpenAI</span>
                        <span>VP Marketing</span>
                        <span className="em">maya.chen@openai.com</span>
                        <span>+1 (415) 555-0184</span>
                        <span className="score">
                          <b>98</b>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">Jordan Patel</span>
                        <span>HubSpot</span>
                        <span>Head of Revenue Ops</span>
                        <span className="em">jordan.patel@hubspot.com</span>
                        <span>+1 (617) 555-0128</span>
                        <span className="score">
                          <b>95</b>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">Leila Morgan</span>
                        <span>Stripe</span>
                        <span>Demand Gen Director</span>
                        <span className="em">leila.morgan@stripe.com</span>
                        <span>+1 (628) 555-0146</span>
                        <span className="score">
                          <b>93</b>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">Ethan Brooks</span>
                        <span>Salesforce</span>
                        <span>VP Sales</span>
                        <span className="em">ethan.brooks@salesforce.com</span>
                        <span>+1 (212) 555-0177</span>
                        <span className="score">
                          <b>91</b>
                        </span>
                      </div>
                      <div className="dr">
                        <span className="co">Sara Kim</span>
                        <span>Notion</span>
                        <span>Marketing Ops Lead</span>
                        <span className="em">sara.kim@notion.so</span>
                        <span>+1 (310) 555-0132</span>
                        <span className="score">
                          <b>89</b>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COPILOT */}
                  <div className="panel" data-panel="copilot">
                    <h4>Ask Outmate Copilot</h4>
                    <div className="copilot" style={{ marginTop: '14px' }}>
                      <div className="cp-prompt">
                        <div className="pq">
                          &quot;Find VP Marketing leaders at SaaS companies hiring SDRs in North America.&quot;
                        </div>
                        <div className="pbadges">
                          <span className="pb">Reasoning active</span>
                          <span className="pb">9 signals matched</span>
                        </div>
                      </div>
                      <div className="cp-cards">
                        <div className="cp-card">
                          <span className="ct">Suggested contacts</span>
                          <p>47 VP Marketing and RevOps leaders across North America SaaS.</p>
                        </div>
                        <div className="cp-card">
                          <span className="ct">Intent insights</span>
                          <p>16 accounts hit pricing, demo, and comparison pages in one session.</p>
                        </div>
                        <div className="cp-card">
                          <span className="ct">Recommended actions</span>
                          <p>Prioritize email, then route high-intent visitors to outbound sequences.</p>
                        </div>
                      </div>
                      <div className="cp-reason">
                        <div className="rt">Why these accounts rank highest</div>
                        <div className="cp-scores">
                          <span className="s">
                            OpenAI <b>98</b>
                          </span>
                          <span className="s">
                            HubSpot <b>96</b>
                          </span>
                          <span className="s">
                            Stripe <b>94</b>
                          </span>
                          <span className="s">
                            Anthropic <b>92</b>
                          </span>
                        </div>
                        <div className="cp-checks">
                          <span className="ck">
                            <span className="x">✓</span>Push to SDR queue (score &gt; 90)
                          </span>
                          <span className="ck">
                            <span className="x">✓</span>Generate personalized opener
                          </span>
                          <span className="ck">
                            <span className="x">✓</span>Trigger sequence + notify owner
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SIGNALS */}
                  <div className="panel" data-panel="signals">
                    <h4>Signal Intelligence</h4>
                    <div className="sig-grid" style={{ marginTop: '16px' }}>
                      <div className="sig-card">
                        <span className="stone" style={{ background: 'var(--accent)' }}></span>
                        <div className="st">Pricing Page Viewed</div>
                        <div className="sscore">98</div>
                        <div className="stime">2m ago</div>
                      </div>
                      <div className="sig-card">
                        <span className="stone" style={{ background: '#6a5cf0' }}></span>
                        <div className="st">Demo Page Revisited</div>
                        <div className="sscore">95</div>
                        <div className="stime">5m ago</div>
                      </div>
                      <div className="sig-card">
                        <span className="stone" style={{ background: '#7d72e8' }}></span>
                        <div className="st">Competitor Comparison Viewed</div>
                        <div className="sscore">91</div>
                        <div className="stime">11m ago</div>
                      </div>
                      <div className="sig-card">
                        <span className="stone" style={{ background: '#8f86e0' }}></span>
                        <div className="st">Raised Funding</div>
                        <div className="sscore">88</div>
                        <div className="stime">18m ago</div>
                      </div>
                      <div className="sig-card">
                        <span className="stone" style={{ background: '#a39bd8' }}></span>
                        <div className="st">Hiring SDRs</div>
                        <div className="sscore">86</div>
                        <div className="stime">23m ago</div>
                      </div>
                      <div className="sig-card">
                        <span className="stone" style={{ background: '#b3acdf' }}></span>
                        <div className="st">New Leadership Hire</div>
                        <div className="sscore">84</div>
                        <div className="stime">31m ago</div>
                      </div>
                    </div>
                  </div>

                  {/* WORKFLOWS */}
                  <div className="panel" data-panel="workflows">
                    <h4>Workflows</h4>
                    <p className="psub">Node-based automation — drag, connect, and let signals trigger the flow.</p>
                    <div className="nodeflow" style={{ marginTop: '16px' }}>
                      <div className="nf-node accent">
                        <span className="nfi">◎</span>
                        <span className="nft">Visitor Identified</span>
                        <span className="nfs">Trigger</span>
                      </div>
                      <span className="nf-arrow">→</span>
                      <div className="nf-node">
                        <span className="nfi">▦</span>
                        <span className="nft">Enrich Account</span>
                        <span className="nfs">Enrichment</span>
                      </div>
                      <span className="nf-arrow">→</span>
                      <div className="nf-node">
                        <span className="nfi">◈</span>
                        <span className="nft">Score Intent</span>
                        <span className="nfs">Scoring</span>
                      </div>
                      <span className="nf-arrow">→</span>
                      <div className="nf-node">
                        <span className="nfi">✉</span>
                        <span className="nft">Send Email</span>
                        <span className="nfs">Action</span>
                      </div>
                      <span className="nf-arrow">→</span>
                      <div className="nf-node">
                        <span className="nfi">◆</span>
                        <span className="nft">Notify Sales Rep</span>
                        <span className="nfs">Routing</span>
                      </div>
                    </div>
                    <div className="flow-summary">
                      <div className="fs">
                        <span className="ft">Triggers</span>
                        <p>Anonymous visitor intent above threshold.</p>
                      </div>
                      <div className="fs">
                        <span className="ft">Enrichment</span>
                        <p>Resolve company, role &amp; contact channels.</p>
                      </div>
                      <div className="fs">
                        <span className="ft">Routing</span>
                        <p>Assign owner + create task.</p>
                      </div>
                      <div className="fs">
                        <span className="ft">Action</span>
                        <p>Send email + notify rep.</p>
                      </div>
                    </div>
                  </div>

                  {/* OUTBOUND */}
                  <div className="panel" data-panel="outbound">
                    <h4>Outbound Engine</h4>
                    <div className="ob-channels" style={{ marginTop: '16px' }}>
                      <div className="ob-ch">
                        <div className="obh">
                          <span className="obt">Email</span>
                          <span className="obs sent">Sent</span>
                        </div>
                        <p>Personalized opener based on page intent.</p>
                        <div className="obbar">
                          <i style={{ width: '85%' }}></i>
                        </div>
                      </div>
                      <div className="ob-ch">
                        <div className="obh">
                          <span className="obt">LinkedIn</span>
                          <span className="obs">Queued</span>
                        </div>
                        <p>Connection request after profile visit.</p>
                        <div className="obbar">
                          <i style={{ width: '78%' }}></i>
                        </div>
                      </div>
                      <div className="ob-ch">
                        <div className="obh">
                          <span className="obt">Voice</span>
                          <span className="obs">Planned</span>
                        </div>
                        <p>Escalate to human call once threshold is met.</p>
                        <div className="obbar">
                          <i style={{ width: '71%' }}></i>
                        </div>
                      </div>
                      <div className="ob-ch">
                        <div className="obh">
                          <span className="obt">Tasks</span>
                          <span className="obs active">Active</span>
                        </div>
                        <p>Route to owner, update CRM, set follow-up.</p>
                        <div className="obbar">
                          <i style={{ width: '64%' }}></i>
                        </div>
                      </div>
                    </div>
                    <div className="ob-foot">
                      Running across <b>1,246</b> active contacts · Email 85% · LinkedIn 78% · Voice 71% · Tasks 64%
                    </div>
                  </div>

                  {/* VOICE */}
                  <div className="panel" data-panel="voice">
                    <h4>Voice Agent</h4>
                    <div className="voice" style={{ marginTop: '16px' }}>
                      <div className="voice-metrics">
                        <div className="vm">
                          <div className="vv">18</div>
                          <div className="vl">Calls Active</div>
                        </div>
                        <div className="vm">
                          <div className="vv">142</div>
                          <div className="vl">Calls Completed</div>
                        </div>
                        <div className="vm">
                          <div className="vv">27</div>
                          <div className="vl">Meetings Booked</div>
                        </div>
                        <div className="vm">
                          <div className="vv">18.9%</div>
                          <div className="vl">Conversion Rate</div>
                        </div>
                      </div>
                      <div className="voice-call">
                        <div className="waveform">
                          <i style={{ animationDelay: '0s' }}></i>
                          <i style={{ animationDelay: '.1s' }}></i>
                          <i style={{ animationDelay: '.2s' }}></i>
                          <i style={{ animationDelay: '.3s' }}></i>
                          <i style={{ animationDelay: '.15s' }}></i>
                          <i style={{ animationDelay: '.25s' }}></i>
                          <i style={{ animationDelay: '.05s' }}></i>
                          <i style={{ animationDelay: '.35s' }}></i>
                          <i style={{ animationDelay: '.2s' }}></i>
                          <i style={{ animationDelay: '.1s' }}></i>
                          <i style={{ animationDelay: '.3s' }}></i>
                          <i style={{ animationDelay: '.4s' }}></i>
                          <i style={{ animationDelay: '.15s' }}></i>
                          <i style={{ animationDelay: '.25s' }}></i>
                        </div>
                        <div className="transcript">
                          <div className="tr">
                            <span className="who">Rep</span> I saw your team is hiring SDRs — usually that means
                            pipeline targets just went up.
                          </div>
                          <div className="tr prospect">
                            <span className="who">Prospect</span> That&apos;s exactly the bottleneck we&apos;re trying
                            to solve right now.
                          </div>
                          <div className="tr">
                            <span className="who">Rep</span> We can book a 15-minute session this week to show you how
                            Outmate fills that gap.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ANALYTICS */}
                  <div className="panel" data-panel="analytics">
                    <h4>Analytics</h4>
                    <div className="an-panel-metrics" style={{ marginTop: '16px' }}>
                      <div className="an-pm">
                        <div className="v">$4.8M</div>
                        <div className="l">Revenue Generated</div>
                        <div className="c">+18.2%</div>
                      </div>
                      <div className="an-pm">
                        <div className="v">$12.4M</div>
                        <div className="l">Pipeline Influenced</div>
                        <div className="c">+24.5%</div>
                      </div>
                      <div className="an-pm">
                        <div className="v">186</div>
                        <div className="l">Meetings Booked</div>
                        <div className="c">+31</div>
                      </div>
                      <div className="an-pm">
                        <div className="v">11.6x</div>
                        <div className="l">ROI</div>
                        <div className="c">+2.1x</div>
                      </div>
                    </div>
                    <div className="an-panel-funnel">
                      <div className="f" style={{ height: '100%' }}>
                        <span>100%</span>
                        <span className="fl">Audience</span>
                      </div>
                      <div className="f" style={{ height: '74%' }}>
                        <span>74%</span>
                        <span className="fl">Engaged</span>
                      </div>
                      <div className="f" style={{ height: '59%' }}>
                        <span>59%</span>
                        <span className="fl">Contacted</span>
                      </div>
                      <div className="f" style={{ height: '33%' }}>
                        <span>33%</span>
                        <span className="fl">Replied</span>
                      </div>
                      <div className="f" style={{ height: '18%' }}>
                        <span>18%</span>
                        <span className="fl">Positive</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 3 · IDENTITY RESOLUTION ===================== */}
        <section className="identity h-sec" data-screen-label="Identity Resolution">
          <div className="id-grid">
            <div className="id-left reveal">
              <span className="h-eyebrow" style={{ alignSelf: 'flex-start' }}>
                Real-Time Visitor Intelligence
              </span>
              <h2>
                Turn anonymous
                <br />
                traffic into
                <br />
                <span className="acc">identified pipeline.</span>
              </h2>
              <p>
                Outmate identifies high-intent visitors, enriches decision-maker data, and activates outbound workflows
                before competitors even know the account exists.
              </p>
              <div className="id-stats">
                <div className="id-stat">
                  <div className="n">
                    <span className="count" data-count="2400">
                      0
                    </span>
                    <span className="acc">+</span>
                  </div>
                  <div className="l">Companies identified</div>
                </div>
                <div className="id-stat">
                  <div className="n">
                    <span className="count" data-count="97">
                      0
                    </span>
                    %
                  </div>
                  <div className="l">Match accuracy</div>
                </div>
                <div className="id-stat">
                  <div className="n">&lt;2s</div>
                  <div className="l">Resolution time</div>
                </div>
              </div>
              <div className="id-cta">
                <Link to="/book-demo" className="btn solid">
                  See platform →
                </Link>
                <Link to="/book-demo" className="btn">
                  Documentation
                </Link>
              </div>
            </div>
            <div className="id-visual">
              <div className="id-scan">
                <div className="pix" id="idPix">
                  ?
                </div>
                <div className="frame"></div>
                <div className="line"></div>
                <div className="id-tag">
                  <span>resolving…</span>
                  <span>97% match</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="howit h-sec" id="how" data-screen-label="How It Works">
          <div style={{ padding: 'clamp(30px,4vw,64px) clamp(20px,4vw,48px) 0' }}>
            <div className="h-head reveal" style={{ textAlign: 'left', alignItems: 'flex-start', margin: 0 }}>
              <span className="h-eyebrow">How it works</span>
              <h2 className="h-title">
                <span className="block" style={{ whiteSpace: 'nowrap' }}>FROM ANONYMOUS CLICK</span>
                <span className="block" style={{ whiteSpace: 'nowrap' }}>TO CLOSED DEAL.</span>
              </h2>
              <p className="h-sub">
                One platform takes a visitor through every step — identified, qualified, enriched, engaged, and handed
                to your team, ready to close.
              </p>
            </div>
            <div style={{ height: 'clamp(26px,3vw,44px)' }}></div>
          </div>
          <div className="hw-tabs" id="hwTabs">
            <button className="hw-tab" aria-selected="true" data-hw="0">
              <span className="hw-n">01</span>
              <span className="hw-l">Identify</span>
            </button>
            <button className="hw-tab" aria-selected="false" data-hw="1">
              <span className="hw-n">02</span>
              <span className="hw-l">Intent</span>
            </button>
            <button className="hw-tab" aria-selected="false" data-hw="2">
              <span className="hw-n">03</span>
              <span className="hw-l">Qualify</span>
            </button>
            <button className="hw-tab" aria-selected="false" data-hw="3">
              <span className="hw-n">04</span>
              <span className="hw-l">Enrich</span>
            </button>
            <button className="hw-tab" aria-selected="false" data-hw="4">
              <span className="hw-n">05</span>
              <span className="hw-l">Engage</span>
            </button>
            <button className="hw-tab" aria-selected="false" data-hw="5">
              <span className="hw-n">06</span>
              <span className="hw-l">Close</span>
            </button>
          </div>
          <div className="hw-body">
            <div className="hw-info">
              <h3 id="hwTitle">Reveal the people behind anonymous traffic.</h3>
              <p id="hwDesc">
                Deploy one lightweight pixel and instantly resolve names, companies, and roles from the 70–80% of
                visitors who never fill out a form.
              </p>
              <ul className="hw-bullets" id="hwBullets">
                <li>
                  <span className="mk">✳</span>Real-time account-level ID
                </li>
                <li>
                  <span className="mk">✳</span>No forms / cookies-only guesswork
                </li>
                <li>
                  <span className="mk">✳</span>Works on every page
                </li>
              </ul>
              <Link to="/book-demo" className="btn" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                Learn more →
              </Link>
            </div>
            <div className="hw-visual">
              {/* pane 0: identify */}
              <div className="hw-pane on" data-hw="0">
                <div className="mmock">
                  <div className="mm-bar">
                    <span>visitor_resolution</span>
                    <span className="live">
                      <span className="dot"></span>RESOLVING
                    </span>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">OpenAI · Growth team</div>
                      <div className="mm-meta">ANON → IDENTIFIED · 118ms</div>
                    </div>
                    <div className="mm-score">
                      <span className="bar">
                        <i style={{ width: '96%' }}></i>
                      </span>
                      <b>96</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Anthropic · Pipeline owner</div>
                      <div className="mm-meta">ANON → IDENTIFIED · 134ms</div>
                    </div>
                    <div className="mm-score">
                      <span className="bar">
                        <i style={{ width: '94%' }}></i>
                      </span>
                      <b>94</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">HubSpot · RevOps director</div>
                      <div className="mm-meta">ANON → IDENTIFIED · 102ms</div>
                    </div>
                    <div className="mm-score">
                      <span className="bar">
                        <i style={{ width: '91%' }}></i>
                      </span>
                      <b>91</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* pane 1: intent */}
              <div className="hw-pane" data-hw="1">
                <div className="mmock">
                  <div className="mm-bar">
                    <span>intent_signals</span>
                    <span className="live">
                      <span className="dot"></span>TRACKING
                    </span>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">/pricing → /demo → /security</div>
                      <div className="mm-meta">DEEP SESSION · 3 high-intent pages</div>
                    </div>
                    <div className="mm-score">
                      <b>98</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Returned 3× this week</div>
                      <div className="mm-meta">BEHAVIORAL CLUSTER · buying</div>
                    </div>
                    <div className="mm-score">
                      <b>92</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Comparison page · 4m dwell</div>
                      <div className="mm-meta">EVALUATING VENDORS</div>
                    </div>
                    <div className="mm-score">
                      <b>89</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* pane 2: qualify */}
              <div className="hw-pane" data-hw="2">
                <div className="mmock">
                  <div className="mm-bar">
                    <span>icp_scoring</span>
                    <span className="live">
                      <span className="dot"></span>SCORING
                    </span>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">SaaS · 500–1k emp · US</div>
                      <div className="mm-meta">FIRMOGRAPHIC FIT</div>
                    </div>
                    <div className="mm-score">
                      <span className="bar">
                        <i style={{ width: '95%' }}></i>
                      </span>
                      <b>ICP</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Uses Salesforce + Outreach</div>
                      <div className="mm-meta">TECH STACK MATCH</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Filtered: 1,204 → 318 accounts</div>
                      <div className="mm-meta">NOISE REMOVED BEFORE SALES</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* pane 3: enrich */}
              <div className="hw-pane" data-hw="3">
                <div className="mmock">
                  <div className="mm-bar">
                    <span>enrichment</span>
                    <span className="live">
                      <span className="dot"></span>APPENDING
                    </span>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">maya.chen@openai.com</div>
                      <div className="mm-meta">VERIFIED EMAIL · 97% confidence</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">+1 (415) 555-0184</div>
                      <div className="mm-meta">DIRECT DIAL</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">32M+ contact graph</div>
                      <div className="mm-meta">ENRICHED IN &lt;2s</div>
                    </div>
                    <div className="mm-score">
                      <b>2s</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* pane 4: engage */}
              <div className="hw-pane" data-hw="4">
                <div className="mmock">
                  <div className="mm-bar">
                    <span>engagement</span>
                    <span className="live">
                      <span className="dot"></span>SENDING
                    </span>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">AI-personalized opener sent</div>
                      <div className="mm-meta">EMAIL · based on page intent</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">LinkedIn connection queued</div>
                      <div className="mm-meta">MULTI-CHANNEL SEQUENCE</div>
                    </div>
                    <div className="mm-score">
                      <b>◇</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Follow-up scheduled +3d</div>
                      <div className="mm-meta">AUTOMATIC TIMED CADENCE</div>
                    </div>
                    <div className="mm-score">
                      <b>↻</b>
                    </div>
                  </div>
                </div>
              </div>
              {/* pane 5: close */}
              <div className="hw-pane" data-hw="5">
                <div className="mmock">
                  <div className="mm-bar">
                    <span>crm_sync</span>
                    <span className="live">
                      <span className="dot"></span>SYNCED
                    </span>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Reply → meeting booked</div>
                      <div className="mm-meta">PUSHED TO HUBSPOT</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Lead created in Salesforce</div>
                      <div className="mm-meta">NATIVE INTEGRATION</div>
                    </div>
                    <div className="mm-score">
                      <b>✓</b>
                    </div>
                  </div>
                  <div className="mm-row">
                    <div>
                      <div className="mm-co">Zapier + webhooks fired</div>
                      <div className="mm-meta">CUSTOM INTEGRATIONS ON DEMAND</div>
                    </div>
                    <div className="mm-score">
                      <b>⚡</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 5 · INTEGRATIONS ===================== */}
        <section className="integ h-sec" data-screen-label="Integrations">
          <div className="h-head reveal">
            <span className="h-eyebrow">Integrations</span>
            <h2 className="h-title">
              Push your leads
              <br />
              into your favourite tools.
            </h2>
            <p className="h-sub">
              Connect Outmate to your CRM, communication tools, cloud docs, and project management stack — one platform,
              all your tools.
            </p>
          </div>
          <div className="istrip">
            <div className="itrack l">
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=docs.google.com&sz=32" alt="Google Docs" />
                Google Docs
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=drive.google.com&sz=32" alt="Google Drive" />
                Google Drive
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=onedrive.live.com&sz=32" alt="OneDrive" />
                Microsoft OneDrive
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=sharepoint.com&sz=32" alt="SharePoint" />
                SharePoint
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=atlassian.com&sz=32" alt="Confluence" />
                Confluence
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=github.com&sz=32" alt="GitHub" />
                GitHub
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=asana.com&sz=32" alt="Asana" />
                Asana
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=airtable.com&sz=32" alt="Airtable" />
                Airtable
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=gmail.com&sz=32" alt="Gmail" />
                Gmail / Outlook
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=docs.google.com&sz=32" alt="Google Docs" />
                Google Docs
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=drive.google.com&sz=32" alt="Google Drive" />
                Google Drive
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=onedrive.live.com&sz=32" alt="OneDrive" />
                Microsoft OneDrive
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=sharepoint.com&sz=32" alt="SharePoint" />
                SharePoint
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=atlassian.com&sz=32" alt="Confluence" />
                Confluence
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=github.com&sz=32" alt="GitHub" />
                GitHub
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=asana.com&sz=32" alt="Asana" />
                Asana
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=airtable.com&sz=32" alt="Airtable" />
                Airtable
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=gmail.com&sz=32" alt="Gmail" />
                Gmail / Outlook
              </span>
            </div>
          </div>
          <div className="istrip">
            <div className="itrack r">
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=slack.com&sz=32" alt="Slack" />
                Slack
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=32" alt="Teams" />
                Microsoft Teams
              </span>
              <span className="ilogo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#5046E6" strokeWidth="2" />
                  <path d="M8 12h8M12 8l4 4-4 4" stroke="#5046E6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Webhooks
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=hubspot.com&sz=32" alt="HubSpot" />
                HubSpot
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=salesforce.com&sz=32" alt="Salesforce" />
                Salesforce
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=outlook.com&sz=32" alt="Outlook" />
                Outlook
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=32" alt="WhatsApp" />
                WhatsApp / SMS
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=slack.com&sz=32" alt="Slack" />
                Slack
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=32" alt="Teams" />
                Microsoft Teams
              </span>
              <span className="ilogo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#5046E6" strokeWidth="2" />
                  <path d="M8 12h8M12 8l4 4-4 4" stroke="#5046E6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Webhooks
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=hubspot.com&sz=32" alt="HubSpot" />
                HubSpot
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=salesforce.com&sz=32" alt="Salesforce" />
                Salesforce
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=outlook.com&sz=32" alt="Outlook" />
                Outlook
              </span>
              <span className="ilogo">
                <img src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=32" alt="WhatsApp" />
                WhatsApp / SMS
              </span>
            </div>
          </div>
        </section>

        {/* ===================== 6 · FEATURE SHOWCASE (bento) ===================== */}
        <section className="fshow h-sec" data-screen-label="Feature Showcase">
          <div className="fshow-header reveal">
            <div className="fshow-left">
              <span className="h-eyebrow">Platform Overview</span>
              <h2 className="h-title fshow-title">
                IDENTIFY
                <br />
                VISITORS IN
                <br />
                MINUTES,
                <br />
                NOT MONTHS.
              </h2>
              <div className="id-cta" style={{ marginTop: '16px' }}>
                <Link to="/book-demo" className="btn solid">
                  See platform →
                </Link>
                <Link to="/book-demo" className="btn">
                  Docs
                </Link>
              </div>
            </div>
            <div className="fshow-right">
              <p className="fshow-sub">
                Outmate helps GTM teams identify anonymous visitors, enrich accounts instantly, and activate outbound
                workflows without manual research.
              </p>
              <div className="fshow-stats">
                <div className="fst">
                  <span className="fst-n">97%</span>
                  <span className="fst-l">Match accuracy</span>
                </div>
                <div className="fst">
                  <span className="fst-n">&lt;2s</span>
                  <span className="fst-l">Resolution time</span>
                </div>
                <div className="fst">
                  <span className="fst-n">200M+</span>
                  <span className="fst-l">Contact graph</span>
                </div>
                <div className="fst">
                  <span className="fst-n">118ms</span>
                  <span className="fst-l">Avg response</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fbento reveal">
            <div className="fb dash">
              <span className="fb-tag">Dashboard · Live visitor feed</span>
              <div className="fb-dashboard">
                <div className="fb-metrics">
                  <div className="m">
                    <div className="mv">2,847</div>
                    <div className="ml">
                      Visitors <span className="mc">+18%</span>
                    </div>
                  </div>
                  <div className="m">
                    <div className="mv">1,203</div>
                    <div className="ml">
                      Accounts <span className="mc">+31%</span>
                    </div>
                  </div>
                  <div className="m">
                    <div className="mv">489</div>
                    <div className="ml">
                      Sequences <span className="mc">+24%</span>
                    </div>
                  </div>
                  <div className="m">
                    <div className="mv">$4.2M</div>
                    <div className="ml">
                      Pipeline <span className="mc">+41%</span>
                    </div>
                  </div>
                </div>
                <div className="fb-feed">
                  <div className="r">
                    <span>Salesforce · enterprise marketing</span>
                    <b>94</b>
                  </div>
                  <div className="r">
                    <span>HubSpot · RevOps director</span>
                    <b>91</b>
                  </div>
                  <div className="r">
                    <span>Gong.io · sales leader</span>
                    <b>88</b>
                  </div>
                  <div className="r">
                    <span>Outreach · demand gen</span>
                    <b>85</b>
                  </div>
                  <div className="r">
                    <span>Drift · growth team</span>
                    <b>82</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="fb">
              <span className="fb-tag">Identity Resolution</span>
              <h3>Anonymous → identified</h3>
              <p>Resolve every visitor in an average of 118ms.</p>
              <div className="fb-identity">
                <span className="blk">ANON</span>
                <span className="ar">→</span>
                <span className="blk id">IDENTIFIED</span>
              </div>
            </div>
            <div className="fb">
              <span className="fb-tag">Real-time enrichment</span>
              <h3>Salesforce Inc.</h3>
              <p>Company, role &amp; contact fields appended at 94% confidence.</p>
              <div className="fb-identity">
                <span className="blk id" style={{ flex: 1, textAlign: 'left' }}>
                  ✓ 94% confidence
                </span>
              </div>
            </div>
            <div className="fb quote">
              <div className="q">
                &quot;Outmate replaced hours of manual prospecting with instant pipeline visibility. We went from 3-day
                research cycles to real-time intent activation.&quot;
              </div>
              <div className="who">Jordan Rivera · VP Sales · Momentum.io</div>
            </div>
            <div className="fb">
              <span className="fb-tag">Workflow Automation</span>
              <h3>6-node pipeline</h3>
              <p>Identify → enrich → score → route → engage → sync.</p>
              <div className="fb-identity" style={{ gap: '5px' }}>
                <span className="blk" style={{ padding: '6px' }}>
                  ◎
                </span>
                <span className="blk" style={{ padding: '6px' }}>
                  ▦
                </span>
                <span className="blk" style={{ padding: '6px' }}>
                  ◈
                </span>
                <span className="blk id" style={{ padding: '6px' }}>
                  ✓
                </span>
              </div>
            </div>
            <div className="fb">
              <span className="fb-tag">Pipeline Analytics</span>
              <h3 className="big-metric">
                <span className="acc">$4.2M</span>
              </h3>
              <div className="metric-sub">+41% MoM</div>
              <div className="fb-bars">
                <i style={{ height: '40%' }}></i>
                <i style={{ height: '55%' }}></i>
                <i style={{ height: '48%' }}></i>
                <i style={{ height: '70%' }}></i>
                <i style={{ height: '62%' }}></i>
                <i className="acc" style={{ height: '90%' }}></i>
                <i className="acc" style={{ height: '100%' }}></i>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7 · TRUST METRICS ===================== */}
        <section className="tmetrics h-sec" data-screen-label="Trust Metrics">
          <div className="lamp"></div>
          <div className="h-head reveal" style={{ marginBottom: 0 }}>
            <h2 className="h-title" style={{ color: '#fff' }}>
              Trusted by sales teams scaling fast
            </h2>
            <p className="h-sub" style={{ color: '#9c9ca3' }}>
              Outmate powers signal-driven GTM workflows for modern revenue teams.
            </p>
          </div>
          <div className="tm-grid reveal">
            <div className="tm">
              <div className="n">
                <span className="count" data-count="3">
                  0
                </span>
                x
              </div>
              <div className="t">Pipeline generation</div>
              <div className="d">More qualified pipeline from the same traffic</div>
            </div>
            <div className="tm">
              <div className="n">
                <span className="count" data-count="45">
                  0
                </span>
                %
              </div>
              <div className="t">Increase in win rate</div>
              <div className="d">Better targeting with intent data</div>
            </div>
            <div className="tm">
              <div className="n">&lt;1m</div>
              <div className="t">Lead response time</div>
              <div className="d">Instant engagement when intent is hot</div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · PLATFORM CAPABILITIES ===================== */}
        <section className="caps h-sec" data-screen-label="Platform Capabilities">
          <div
            className="h-head reveal"
            style={{ textAlign: 'left', alignItems: 'flex-start', margin: '0 0 clamp(24px,3vw,40px)' }}
          >
            <span className="h-eyebrow">Platform</span>
            <h2 className="h-title">
              Everything you need
              <br />
              to turn traffic into pipeline
            </h2>
            <p className="h-sub">
              Six products and the use cases they power — one platform that identifies your visitors, enriches them, and
              acts on intent automatically.
            </p>
          </div>

          {/* products only, toggle hidden */}
          <div className="caps-toggle" style={{ display: 'none' }}>
            <button className="caps-tb" aria-selected="true" data-caps="products">
              <span className="ct">Products</span>
              <span className="cn">05</span>
            </button>
            <button className="caps-tb" aria-selected="false" data-caps="usecases">
              <span className="ct">Use Cases</span>
              <span className="cn">05</span>
            </button>
          </div>

          {/* products panel */}
          <div className="caps-panel on" data-caps="products">
            <div className="caps-editorial reveal">
              <Link className="ec" to="/product/website-identification">
                <div className="ei">
                  <span className="en">01</span>
                  <span className="eico">◎</span>
                </div>
                <h4>Website Identification</h4>
                <p>Identify anonymous B2B visitors in real-time</p>
                <div className="ec-preview">
                  <span>→ Real-time visitor ID</span>
                  <span>→ Company &amp; person match</span>
                  <span>→ 97% accuracy</span>
                  <span>→ Works without forms</span>
                  <span>→ &lt;2s resolution</span>
                </div>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/b2b-database">
                <div className="ei">
                  <span className="en">02</span>
                  <span className="eico">▦</span>
                </div>
                <h4>B2B Database</h4>
                <p>200M verified contacts, enriched &amp; signal-ready</p>
                <div className="ec-preview">
                  <span>→ 200M+ verified contacts</span>
                  <span>→ Direct dials &amp; emails</span>
                  <span>→ Firmographic data</span>
                  <span>→ Tech stack signals</span>
                  <span>→ Real-time enrichment</span>
                </div>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/co-pilot">
                <div className="ei">
                  <span className="en">03</span>
                  <span className="eico">✳</span>
                </div>
                <h4>Co-Pilot</h4>
                <p>AI GTM co-pilot that writes outreach automatically</p>
                <div className="ec-preview">
                  <span>→ AI-personalized openers</span>
                  <span>→ Natural language queries</span>
                  <span>→ Multi-channel sequences</span>
                  <span>→ Intent-based targeting</span>
                  <span>→ Auto follow-ups</span>
                </div>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/social-agent">
                <div className="ei">
                  <span className="en">04</span>
                  <span className="eico">@</span>
                </div>
                <h4>Social Agent</h4>
                <p>Turn social signals into pipeline automatically</p>
                <div className="ec-preview">
                  <span>→ LinkedIn signal tracking</span>
                  <span>→ Profile visit detection</span>
                  <span>→ Auto connection requests</span>
                  <span>→ Social intent scoring</span>
                  <span>→ Pipeline from social</span>
                </div>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/workflow-automation">
                <div className="ei">
                  <span className="en">05</span>
                  <span className="eico">⚡</span>
                </div>
                <h4>Workflow Automation</h4>
                <p>Route high-intent visitors into alerts, sequences, and next best actions</p>
                <div className="ec-preview">
                  <span>→ Node-based builder</span>
                  <span>→ Signal-triggered flows</span>
                  <span>→ CRM auto-sync</span>
                  <span>→ Slack &amp; email routing</span>
                  <span>→ Zero manual work</span>
                </div>
                <span className="ea">Learn more →</span>
              </Link>
            </div>
          </div>

          {/* use cases panel */}
          <div className="caps-panel" data-caps="usecases">
            <div className="caps-uc reveal">
              <Link className="ec" to="/use-cases/identify-visitors">
                <div className="ei">
                  <span className="en">01</span>
                  <span className="eico">◎</span>
                </div>
                <h4>Identify High-Intent Visitors</h4>
                <p>Know who&apos;s on your site before they call you</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/use-cases/enrich-route-leads">
                <div className="ei">
                  <span className="en">02</span>
                  <span className="eico">▦</span>
                </div>
                <h4>Enrich &amp; Route Leads</h4>
                <p>Instant context for every inbound prospect</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/use-cases/automate-workflows">
                <div className="ei">
                  <span className="en">03</span>
                  <span className="eico">⚡</span>
                </div>
                <h4>Automate GTM Workflows</h4>
                <p>Signal-triggered actions across your entire stack</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/use-cases/ai-outbound">
                <div className="ei">
                  <span className="en">04</span>
                  <span className="eico">◈</span>
                </div>
                <h4>Run AI-Powered Outbound</h4>
                <p>Autonomous calling and email at scale</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/use-cases/sales-team">
                <div className="ei">
                  <span className="en">05</span>
                  <span className="eico">◆</span>
                </div>
                <h4>Sales Teams</h4>
                <p>Arm your sales team with AI-driven pipeline</p>
                <span className="ea">Learn more →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== 9 · CUSTOMER PROOF ===================== */}
        <section className="proof h-sec" data-screen-label="Customer Proof">
          <div style={{ padding: 'clamp(24px,3vw,48px) clamp(20px,4vw,48px) 0' }}>
            <div className="h-head reveal" style={{ textAlign: 'left', alignItems: 'flex-start', margin: 0 }}>
              <span className="h-eyebrow">Customer Stories</span>
              <h2 className="h-title">
                How Outmate Helps
                <br />
                Revenue Teams Win
              </h2>
            </div>
          </div>
          <div className="proof-grid reveal">
            <div className="proof-card pc-dark">
              <p className="pc-quote">
                &quot;Outmate quickly felt like part of our sales team. It helped us reach the right people faster, so our
                reps spent their time in real conversations that actually moved deals forward.&quot;
              </p>
              <div className="pc-who">
                <span className="pc-av">MW</span>
                <span>
                  <span className="pc-nm">Mark White</span>
                  <div className="pc-rl">Founder · RevScale</div>
                </span>
                <span className="pc-stat">+312% pipeline</span>
              </div>
            </div>
            <div className="proof-card">
              <p className="pc-quote">
                &quot;Within two weeks of deploying Outmate, we identified 800+ high-intent accounts we had no idea were
                visiting. Pipeline doubled in 30 days.&quot;
              </p>
              <div className="pc-who">
                <span className="pc-av">JR</span>
                <span>
                  <span className="pc-nm">Jordan Rivera</span>
                  <div className="pc-rl">VP Sales · Momentum.io</div>
                </span>
                <span className="pc-stat">2× pipeline in 30d</span>
              </div>
            </div>
            <div className="proof-card">
              <p className="pc-quote">
                &quot;We replaced three tools with Outmate. Visitor ID, enrichment, and outbound sequences — all from one
                place. Our SDRs close 40% more meetings now.&quot;
              </p>
              <div className="pc-who">
                <span className="pc-av">AL</span>
                <span>
                  <span className="pc-nm">Aisha Lee</span>
                  <div className="pc-rl">Head of Growth · Archway Labs</div>
                </span>
                <span className="pc-stat">+40% meetings</span>
              </div>
            </div>
            <div className="proof-card pc-accent">
              <p className="pc-quote">
                &quot;The signal intelligence alone is worth it. We knew a $200k account was evaluating us before they
                ever filled a form — and we closed them in 11 days.&quot;
              </p>
              <div className="pc-who">
                <span className="pc-av">DP</span>
                <span>
                  <span className="pc-nm">Daniel Park</span>
                  <div className="pc-rl">CRO · Launchpad AI</div>
                </span>
                <span className="pc-stat">$200k deal in 11d</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 10 · USE CASES ===================== */}
        <section className="usecases h-sec" data-screen-label="Use Cases">
          <div style={{ padding: 'clamp(30px,4vw,64px) clamp(20px,4vw,48px) 0' }}>
            <div className="h-head reveal" style={{ textAlign: 'left', alignItems: 'flex-start', margin: 0 }}>
              <span className="h-eyebrow">Use Cases</span>
              <h2 className="h-title">
                <span style={{ whiteSpace: 'nowrap', display: 'block' }}>Built For Every Team</span>
                <span style={{ whiteSpace: 'nowrap', display: 'block' }}>Running Outbound.</span>
              </h2>
              <p className="h-sub">
                Whether you&apos;re a founder, GTM lead, or RevOps team — Outmate runs the play.
              </p>
            </div>
            <div style={{ height: 'clamp(26px,3vw,44px)' }}></div>
          </div>
          <div className="uc-body">
            <div className="uc-tabs" id="ucTabs">
              <button className="uc-tab" aria-selected="true" data-uc="0">
                <span className="uc-i">◆</span>
                <span className="uc-n">Founder / Solopreneur</span>
                <span className="uc-ar">→</span>
              </button>
              <button className="uc-tab" aria-selected="false" data-uc="1">
                <span className="uc-i">◎</span>
                <span className="uc-n">GTM &amp; Sales Teams</span>
                <span className="uc-ar">→</span>
              </button>
              <button className="uc-tab" aria-selected="false" data-uc="2">
                <span className="uc-i">⚙</span>
                <span className="uc-n">RevOps &amp; Operations</span>
                <span className="uc-ar">→</span>
              </button>
              <button className="uc-tab" aria-selected="false" data-uc="3">
                <span className="uc-i">◈</span>
                <span className="uc-n">Marketing Teams</span>
                <span className="uc-ar">→</span>
              </button>
              <button className="uc-tab" aria-selected="false" data-uc="4">
                <span className="uc-i">⬡</span>
                <span className="uc-n">Agencies</span>
                <span className="uc-ar">→</span>
              </button>
            </div>
            <div className="uc-stage">
              <div className="uc-pane on" data-uc="0">
                <h3>
                  Automate your <span className="acc">entire pipeline.</span>
                </h3>
                <p>
                  You&apos;re the founder, the SDR, and the closer. Outmate identifies who&apos;s on your site, enriches
                  them, and runs the outreach — so pipeline builds while you build the product.
                </p>
                <div className="uc-sim">
                  <div className="sr">
                    <span>Visitor identified</span>
                    <b>Northwind Robotics</b>
                  </div>
                  <div className="sr">
                    <span>Auto-enriched + scored</span>
                    <span className="acc">ICP 92</span>
                  </div>
                  <div className="sr">
                    <span>Opener drafted &amp; sent</span>
                    <b>✓ in your inbox</b>
                  </div>
                </div>
                <Link to="/book-demo" className="btn solid uc-cta" style={{ alignSelf: 'flex-start' }}>
                  Explore use case
                </Link>
              </div>
              <div className="uc-pane" data-uc="1">
                <h3>
                  Close more accounts, <span className="acc">faster.</span>
                </h3>
                <p>
                  Stop guessing who to call. Reps get the warmest accounts first, with full context — name, role,
                  intent — surfaced the moment they land.
                </p>
                <div className="uc-sim">
                  <div className="sr">
                    <span>Hot account on /pricing</span>
                    <b>HubSpot</b>
                  </div>
                  <div className="sr">
                    <span>Routed to rep</span>
                    <span className="acc">Slack alert</span>
                  </div>
                  <div className="sr">
                    <span>Meeting booked</span>
                    <b>✓ 18.9% conv</b>
                  </div>
                </div>
                <Link to="/book-demo" className="btn solid uc-cta" style={{ alignSelf: 'flex-start' }}>
                  Explore use case
                </Link>
              </div>
              <div className="uc-pane" data-uc="2">
                <h3>
                  Seamless <span className="acc">CRM syncing.</span>
                </h3>
                <p>
                  Every identified visitor, enriched and pushed to your CRM automatically — clean records, no manual
                  entry, no Zapier breaks to babysit.
                </p>
                <div className="uc-sim">
                  <div className="sr">
                    <span>Record enriched</span>
                    <b>32 fields</b>
                  </div>
                  <div className="sr">
                    <span>Synced bi-directional</span>
                    <span className="acc">HubSpot + SF</span>
                  </div>
                  <div className="sr">
                    <span>Owner assigned</span>
                    <b>✓ auto-routed</b>
                  </div>
                </div>
                <Link to="/book-demo" className="btn solid uc-cta" style={{ alignSelf: 'flex-start' }}>
                  Explore use case
                </Link>
              </div>
              <div className="uc-pane" data-uc="3">
                <h3>
                  Convert <span className="acc">anonymous traffic.</span>
                </h3>
                <p>
                  Turn the 97% who never fill a form into named, scored accounts — and prove marketing&apos;s pipeline
                  contribution with real attribution.
                </p>
                <div className="uc-sim">
                  <div className="sr">
                    <span>Anonymous sessions</span>
                    <b>2,847</b>
                  </div>
                  <div className="sr">
                    <span>Identified</span>
                    <span className="acc">40–65%</span>
                  </div>
                  <div className="sr">
                    <span>Pipeline influenced</span>
                    <b>$4.2M</b>
                  </div>
                </div>
                <Link to="/book-demo" className="btn solid uc-cta" style={{ alignSelf: 'flex-start' }}>
                  Explore use case
                </Link>
              </div>
              <div className="uc-pane" data-uc="4">
                <h3>
                  Scale <span className="acc">client results.</span>
                </h3>
                <p>
                  Run identification + outbound for every client from one workspace. White-glove pipeline, multiplied
                  across your book of business.
                </p>
                <div className="uc-sim">
                  <div className="sr">
                    <span>Clients managed</span>
                    <b>12 workspaces</b>
                  </div>
                  <div className="sr">
                    <span>Avg pipeline lift</span>
                    <span className="acc">+312%</span>
                  </div>
                  <div className="sr">
                    <span>Reporting</span>
                    <b>✓ per-client</b>
                  </div>
                </div>
                <Link to="/book-demo" className="btn solid uc-cta" style={{ alignSelf: 'flex-start' }}>
                  Explore use case
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 11 · SIGNAL INTELLIGENCE (static grid) ===================== */}
        <section className="trustpos h-sec" id="signals" data-screen-label="Signal Intelligence">
          <div className="tp-header reveal">
            <span className="h-eyebrow">Signal Intelligence</span>
            <h2 className="h-title">
              See what your GTM
              <br />
              team was missing.
            </h2>
          </div>
          <div className="tp-stat-grid reveal">
            <div className="tp-stat">
              <div className="tps-n">
                <span className="count" data-count="97">
                  0
                </span>
                %
              </div>
              <div className="tps-t">Anonymous Visitors Identified</div>
              <div className="tps-d">Reveal who&apos;s actually researching your product.</div>
            </div>
            <div className="tp-stat">
              <div className="tps-n">
                <span className="count" data-count="4" data-dec="0">
                  0
                </span>
                x
              </div>
              <div className="tps-t">Faster GTM Response</div>
              <div className="tps-d">Speed matters more than volume.</div>
            </div>
            <div className="tp-stat">
              <div className="tps-n">
                <span className="count" data-count="200">
                  0
                </span>
                M+
              </div>
              <div className="tps-t">Verified Contacts</div>
              <div className="tps-d">Every visitor, matched to a 200M+ contact graph.</div>
            </div>
            <div className="tp-stat">
              <div className="tps-n">
                <span className="count" data-count="18">
                  0
                </span>
                %
              </div>
              <div className="tps-t">Pipeline Lift Generated</div>
              <div className="tps-d">Pipeline should be measurable.</div>
            </div>
            <div className="tp-stat">
              <div className="tps-n">
                <span className="count" data-count="12">
                  0
                </span>
                s
              </div>
              <div className="tps-t">Signal Detection Speed</div>
              <div className="tps-d">Intelligence at the speed of thought.</div>
            </div>
          </div>
        </section>

        {/* ===================== 13 · ANALYTICS ===================== */}
        <section className="analytics h-sec" data-screen-label="Analytics">
          <div className="an-top reveal">
            <div>
              <span className="h-eyebrow">AI GTM Infrastructure</span>
              <h2>Operate your entire outbound engine from one intelligence layer.</h2>
            </div>
            <p>
              Outmate connects visitor identification, enrichment, workflows, outbound execution, and AI agents into a
              single GTM operating system.
            </p>
          </div>
          {/* 2-col split — metric wall left, step flow right */}
          <div className="an-split reveal">
            <div className="an-metrics">
              <div className="an-m">
                <span className="an-mv">$4.8M</span>
                <span className="an-ml">Revenue generated</span>
                <span className="an-mc">↑ 18.2%</span>
              </div>
              <div className="an-m">
                <span className="an-mv">$12.4M</span>
                <span className="an-ml">Pipeline influenced</span>
                <span className="an-mc">↑ 24.5%</span>
              </div>
              <div className="an-m">
                <span className="an-mv">186</span>
                <span className="an-ml">Meetings booked</span>
                <span className="an-mc">+31 this month</span>
              </div>
              <div className="an-m">
                <span className="an-mv">11.6x</span>
                <span className="an-ml">Return on investment</span>
                <span className="an-mc">↑ 2.1x YoY</span>
              </div>
              <div className="an-badge">
                <span className="d"></span>Enterprise Certified · SOC 2 Type II
              </div>
              <Link to="/book-demo" className="btn solid" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
                Explore Platform →
              </Link>
            </div>
            <div className="an-flow">
              <div className="an-step">
                <span className="as-n">01</span>
                <div className="as-body">
                  <span className="as-t">Visitor lands on your site</span>
                  <span className="as-d">Pixel fires — anonymous session captured in real time.</span>
                </div>
              </div>
              <div className="an-connector"></div>
              <div className="an-step">
                <span className="as-n">02</span>
                <div className="as-body">
                  <span className="as-t">Identity resolved in &lt;2s</span>
                  <span className="as-d">Company, decision-maker, intent signals — all appended.</span>
                </div>
              </div>
              <div className="an-connector"></div>
              <div className="an-step">
                <span className="as-n">03</span>
                <div className="as-body">
                  <span className="as-t">ICP score calculated</span>
                  <span className="as-d">Firmographics + behavior scored against your ideal profile.</span>
                </div>
              </div>
              <div className="an-connector"></div>
              <div className="an-step">
                <span className="as-n">04</span>
                <div className="as-body">
                  <span className="as-t">Workflow triggers automatically</span>
                  <span className="as-d">Alert Slack, push to CRM, launch sequence — zero manual work.</span>
                </div>
              </div>
              <div className="an-connector"></div>
              <div className="an-step as-accent">
                <span className="as-n">05</span>
                <div className="as-body">
                  <span className="as-t">Revenue attributed</span>
                  <span className="as-d">Every meeting, deal and dollar traced back to the original signal.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 14 · SIGNAL ENGINE CTA ===================== */}
        <section className="signalcta h-sec" id="cta" data-screen-label="Signal Engine CTA">
          <h2>
            Build your signal
            <br />
            engine today
          </h2>
          <p>Stop chasing leads. Let intent come to you.</p>
          <div className="sc-cta">
            <Link to="/pricing" className="btn white">
              Try free →
            </Link>
            <Link to="/pricing" className="btn ghost-d">
              View pricing
            </Link>
          </div>
          <span className="disc">7 days unlimited leads, no credit card required</span>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="home-foot" id="footer" data-screen-label="Footer">
        <div className="foot-cols">
          <div className="fcol">
            <h5>Platform</h5>
            <ul>
              <li>
                <Link to="/product/website-identification">Website Identification</Link>
              </li>
              <li>
                <Link to="/product/b2b-database">B2B Database</Link>
              </li>
              <li>
                <Link to="/product/co-pilot">Co-Pilot</Link>
              </li>
              <li>
                <Link to="/product/social-agent">Social Agent</Link>
              </li>
              <li>
                <Link to="/product/workflow-automation">Workflow Automation</Link>
              </li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Use Cases</h5>
            <ul>
              <li>
                <Link to="/use-cases/sales-team">Sales Teams</Link>
              </li>
              <li>
                <Link to="/use-cases/sales-team">Marketing Teams</Link>
              </li>
              <li>
                <Link to="/use-cases/sales-team">RevOps</Link>
              </li>
              <li>
                <Link to="/use-cases/sales-team">Agencies</Link>
              </li>
              <li>
                <Link to="/use-cases/sales-team">Founder-Led GTM</Link>
              </li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Resources</h5>
            <ul>
              <li>
                <a className="placeholder-link">Documentation</a>
              </li>
              <li>
                <a className="placeholder-link">API Docs</a>
              </li>
              <li>
                <a className="placeholder-link">Integrations</a>
              </li>
              <li>
                <Link to="/compare">Compare</Link>
              </li>
              <li>
                <Link to="/labs">Labs</Link>
              </li>
            </ul>
          </div>
          <div className="fcol">
            <h5>Company</h5>
            <ul>
              <li>
                <a className="placeholder-link">About</a>
              </li>
              <li>
                <a className="placeholder-link">Careers</a>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <a className="placeholder-link">Contact</a>
              </li>
            </ul>
          </div>
          <div className="ai-card">
            <div className="ai-top">
              <span className="ai-dot">✳</span>
              <span className="ai-t">Ask about Outmate</span>
            </div>
            <p>Click any AI to ask directly about Outmate, GTM workflows, or visitor identification.</p>
            <div className="ai-tools">
              <a
                href="https://chat.openai.com/?q=Tell+me+about+Outmate.ai+and+how+it+helps+B2B+sales+teams+identify+website+visitors"
                target="_blank"
                rel="noopener noreferrer"
                className="ai-tool"
              >
                <img src="https://www.google.com/s2/favicons?domain=openai.com&sz=32" alt="ChatGPT" />
                <span>ChatGPT</span>
              </a>
              <a
                href="https://claude.ai/new?q=Tell+me+about+Outmate.ai+website+visitor+identification"
                target="_blank"
                rel="noopener noreferrer"
                className="ai-tool"
              >
                <img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=32" alt="Claude" />
                <span>Claude</span>
              </a>
              <a
                href="https://chat.deepseek.com/?q=What+is+Outmate.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="ai-tool"
              >
                <img src="https://www.google.com/s2/favicons?domain=deepseek.com&sz=32" alt="DeepSeek" />
                <span>DeepSeek</span>
              </a>
              <a
                href="https://x.com/i/grok?text=Tell+me+about+Outmate.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="ai-tool"
              >
                <img src="https://www.google.com/s2/favicons?domain=x.com&sz=32" alt="Grok" />
                <span>Grok</span>
              </a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span className="cr">
            © Outmate <span id="yr">2026</span> · <a className="placeholder-link">Privacy Policy</a> · <a className="placeholder-link">Terms</a> ·{' '}
            <a className="placeholder-link">Contact</a>
          </span>
          <span className="cr">
            Sign up to our newsletter ·{' '}
            <a
              href="https://www.linkedin.com/company/outmateai/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on LinkedIn →
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
