import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import LogoMarquee from '../sections/use-cases/components/LogoMarquee'
import SiteNav from '../components/SiteNav'
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

    /* navbar scroll state + mobile menu now live in the shared <SiteNav>. */

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

    /* ---------- dynamic island scroll-spy ---------- */
    const island = root.querySelector<HTMLElement>('#island')
    const islLabel = root.querySelector('#islLabel')
    const islSub = root.querySelector('#islSub')
    const islDots = root.querySelector<HTMLElement>('#islDots')
    const ringProg = root.querySelector('#ringProg') as SVGElement | null
    const ringPct = root.querySelector('#ringPct')
    const spy = [
      { id: 'hero', label: 'Outmate', sub: 'Top' },
      { id: 'how', label: 'Process', sub: 'How Outmate Works' },
      { id: 'signals', label: 'Signals', sub: 'Live Signals' },
      { id: 'insights', label: 'Insights', sub: 'Analyzing Data' },
      { id: 'cta', label: 'Compare', sub: 'Outmate vs Others' },
      { id: 'footer', label: 'Connect', sub: 'Get in touch' },
    ]
    if (island && islDots) {
      spy.forEach((s, idx) => {
        const d = document.createElement('i')
        if (idx === 0) d.className = 'on'
        d.addEventListener('click', () => {
          const el = document.getElementById(s.id)
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' })
        })
        islDots.appendChild(d)
      })
      const dots = islDots.querySelectorAll('i')
      const onSpyScroll = () => {
        const sc = window.scrollY
        const dh = document.body.scrollHeight - window.innerHeight
        const pct = Math.max(0, Math.min(1, sc / (dh || 1)))
        if (ringProg) ringProg.style.strokeDashoffset = String(88 - 88 * pct)
        if (ringPct) ringPct.textContent = String(Math.round(pct * 100))
        island.classList.toggle('hidden', sc < 400)
        let active = 0
        spy.forEach((s, idx) => {
          const el = document.getElementById(s.id)
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) active = idx
        })
        if (islLabel) islLabel.textContent = spy[active].label
        if (islSub) islSub.textContent = spy[active].sub
        dots.forEach((d, i) => d.classList.toggle('on', i === active))
      }
      window.addEventListener('scroll', onSpyScroll, { passive: true })
      onSpyScroll()
      cleanups.push(() => window.removeEventListener('scroll', onSpyScroll))
      cleanups.push(() => {
        islDots.innerHTML = ''
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div className="home-root" id="top" ref={rootRef}>
      <SiteNav />

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
              <span style={{ whiteSpace: 'nowrap', display: 'block' }}>Push Your Leads Into</span>
              <span style={{ whiteSpace: 'nowrap', display: 'block' }}>Your Favorite Tools.</span>
            </h2>
            <p className="h-sub">
              Streamline your lead generation process by pushing your leads into your CRM, Slack, Email &amp; LinkedIn
              automation tools and more.
            </p>
          </div>
          <LogoMarquee />
        </section>

        {/* ===================== 6 · FEATURE SHOWCASE (bento) ===================== */}
        <section className="fshow h-sec" data-screen-label="Feature Showcase">
          <div className="h-head reveal">
            <span className="h-eyebrow">Platform Overview</span>
            <h2 className="h-title">
              IDENTIFY VISITORS IN
              <br />
              MINUTES, NOT MONTHS.
            </h2>
            <p className="h-sub">
              Outmate helps GTM teams identify anonymous visitors, enrich accounts instantly, and activate outbound
              workflows without manual research.
            </p>
            <div className="id-cta">
              <Link to="/book-demo" className="btn solid">
                See platform →
              </Link>
              <Link to="/book-demo" className="btn">
                Documentation
              </Link>
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
              Everything you need to
              <br />
              turn traffic into pipeline
            </h2>
            <p className="h-sub">
              Six products and the use cases they power — one platform that identifies your visitors, enriches them, and
              acts on intent automatically.
            </p>
          </div>

          {/* toggle */}
          <div className="caps-toggle">
            <button className="caps-tb" aria-selected="true" data-caps="products">
              <span className="ct">Products</span>
              <span className="cn">06</span>
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
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/b2b-database">
                <div className="ei">
                  <span className="en">02</span>
                  <span className="eico">▦</span>
                </div>
                <h4>B2B Database</h4>
                <p>200M verified contacts, enriched &amp; signal-ready</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/co-pilot">
                <div className="ei">
                  <span className="en">03</span>
                  <span className="eico">✳</span>
                </div>
                <h4>Co-Pilot</h4>
                <p>AI GTM co-pilot that writes outreach automatically</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/social-agent">
                <div className="ei">
                  <span className="en">05</span>
                  <span className="eico">@</span>
                </div>
                <h4>Social Agent</h4>
                <p>Turn social signals into pipeline automatically</p>
                <span className="ea">Learn more →</span>
              </Link>
              <Link className="ec" to="/product/workflow-automation">
                <div className="ei">
                  <span className="en">06</span>
                  <span className="eico">⚡</span>
                </div>
                <h4>Workflow Automation</h4>
                <p>Route high-intent visitors into alerts, sequences, and next best actions</p>
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
          <div className="proof-main reveal">
            <span className="pkick">Customer Stories</span>
            <h2>
              How Outmate Helps
              <br />
              Revenue Teams Win
            </h2>
            <p className="quote">
              &quot;Outmate quickly felt like part of our sales team. It helped us reach the right people faster, so our
              reps stopped guessing who to call and spent their time in real conversations that actually moved deals
              forward.&quot;
            </p>
            <div className="who">
              <span className="av">MW</span>
              <span>
                <span className="nm">Mark White</span>
                <div className="rl">Founder at RevScale</div>
              </span>
              <span className="brand-tag">REVOPS AI</span>
            </div>
          </div>
          <div className="proof-metric reveal">
            <span className="stripe"></span>
            <div className="n">+312%</div>
            <div className="l">Increase in qualified pipeline</div>
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

        {/* ===================== 11 · TRUST POSITIONING (sticky) ===================== */}
        <section className="trustpos h-sec" id="signals" data-screen-label="Trust Positioning">
          <div className="tp-grid">
            <div className="tp-left">
              <div className="tp-sticky">
                <span className="h-eyebrow">Signal Intelligence</span>
                <h2>
                  See what your GTM
                  <br />
                  team was missing.
                </h2>
              </div>
            </div>
            <div className="tp-right">
              <div className="tp-metric reveal">
                <div className="n">
                  <span className="count" data-count="97">
                    0
                  </span>
                  %
                </div>
                <div className="t">Anonymous Visitors Identified</div>
                <div className="d">Reveal who&apos;s actually researching your product.</div>
              </div>
              <div className="tp-metric reveal">
                <div className="n">
                  <span className="count" data-count="4.3" data-dec="1">
                    0
                  </span>
                  x
                </div>
                <div className="t">Faster GTM Response</div>
                <div className="d">Speed matters more than volume.</div>
              </div>
              <div className="tp-metric reveal">
                <div className="n">
                  <span className="count" data-count="200">
                    0
                  </span>
                  M+
                </div>
                <div className="t">Verified Contacts</div>
                <div className="d">Every visitor, matched to a 200M+ contact graph.</div>
              </div>
              <div className="tp-metric reveal">
                <div className="n">
                  <span className="count" data-count="18">
                    0
                  </span>
                  %
                </div>
                <div className="t">Pipeline Lift Generated</div>
                <div className="d">Pipeline should be measurable.</div>
              </div>
              <div className="tp-metric reveal">
                <div className="n">
                  <span className="count" data-count="12">
                    0
                  </span>
                  s
                </div>
                <div className="t">Signal Detection Speed</div>
                <div className="d">Intelligence at the speed of thought.</div>
              </div>
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
          <div className="an-window reveal">
            <div className="an-wbar">
              <div className="dots">
                <i style={{ background: '#ff5f57' }}></i>
                <i style={{ background: '#febc2e' }}></i>
                <i style={{ background: '#28c840' }}></i>
              </div>
              <span>outmate.os v4.2 — live</span>
              <span className="live">
                <span className="d"></span>LIVE
              </span>
            </div>
            <div className="an-wbody">
              <div className="an-cell">
                <div className="v">$4.8M</div>
                <div className="l">Revenue</div>
                <div className="c">+18.2%</div>
              </div>
              <div className="an-cell">
                <div className="v">$12.4M</div>
                <div className="l">Pipeline</div>
                <div className="c">+24.5%</div>
              </div>
              <div className="an-cell">
                <div className="v">186</div>
                <div className="l">Meetings</div>
                <div className="c">+31</div>
              </div>
              <div className="an-cell">
                <div className="v">11.6x</div>
                <div className="l">ROI</div>
                <div className="c">+2.1x</div>
              </div>
            </div>
            <div className="an-funnel">
              <div className="fb" style={{ height: '100%' }}>
                100%
              </div>
              <div className="fb" style={{ height: '74%' }}>
                74%
              </div>
              <div className="fb" style={{ height: '59%' }}>
                59%
              </div>
              <div className="fb" style={{ height: '33%' }}>
                33%
              </div>
              <div className="fb" style={{ height: '18%' }}>
                18%
              </div>
            </div>
          </div>
          <div className="an-float reveal">
            <span className="d"></span>Enterprise Certified · SOC 2 Type II
          </div>
          <div style={{ height: 'clamp(20px,2vw,30px)' }}></div>
          <div style={{ padding: '0 clamp(20px,4vw,48px) clamp(30px,4vw,56px)' }}>
            <Link to="/book-demo" className="btn white">
              Explore Platform →
            </Link>
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
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">API Docs</a>
              </li>
              <li>
                <a href="#">Integrations</a>
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
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="ai-card">
            <div className="ai-top">
              <span className="ai-dot">✳</span>
              <span className="ai-t">Ask AI</span>
            </div>
            <p>
              Ask AI about Outmate. Get answers about GTM workflows, visitor identification, and outbound automation.
            </p>
            <a href="#" className="btn solid" style={{ height: '40px' }}>
              Open AI Assistant
            </a>
          </div>
        </div>
        <div className="foot-bottom">
          <span className="cr">
            © Outmate <span id="yr">2026</span> · <a href="#">Privacy Policy</a> · <a href="#">Terms</a> ·{' '}
            <a href="#">Contact</a>
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

      {/* ===================== DYNAMIC ISLAND NAV ===================== */}
      <div className="island hidden" id="island">
        <div className="ring">
          <svg width="34" height="34">
            <circle cx="17" cy="17" r="14" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
            <circle
              id="ringProg"
              cx="17"
              cy="17"
              r="14"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="88"
              strokeDashoffset="88"
              strokeLinecap="round"
            />
          </svg>
          <span className="pct" id="ringPct">
            0
          </span>
        </div>
        <div>
          <div className="isl-label" id="islLabel">
            Outmate
          </div>
          <div className="isl-sub" id="islSub">
            Top
          </div>
        </div>
        <span className="live">
          <span className="d"></span>Live
        </span>
        <div className="isl-dots" id="islDots"></div>
      </div>
    </div>
  )
}
