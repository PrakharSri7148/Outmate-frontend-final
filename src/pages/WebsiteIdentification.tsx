import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './website-identification.css';

export default function WebsiteIdentification() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — Website Identification';
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];

    /* ---------- reveal on scroll ---------- */
    let revealIO: IntersectionObserver | null = null;
    const revealEls = root.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealIO?.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach((el) => revealIO?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('in'));
    }
    cleanups.push(() => revealIO?.disconnect());

    /* ---------- giant "PIPELINE" headline: scroll-driven horizontal drift ---------- */
    const strip = root.querySelector('.bighead .strip') as HTMLElement | null;
    const track = root.querySelector('#bigtrack') as HTMLElement | null;
    let raf: number | null = null;
    const update = () => {
      if (!track || !strip) return;
      raf = null;
      const rect = strip.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      let prog = (vh - rect.top) / (vh + rect.height);
      prog = Math.max(0, Math.min(1, prog));
      const overflow = Math.max(0, track.scrollWidth - strip.clientWidth);
      const x = -prog * overflow;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    const onScroll = () => {
      if (raf === null) raf = window.requestAnimationFrame(update);
    };
    if (track && strip && !reduce) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();
      cleanups.push(() => {
        if (raf !== null) window.cancelAnimationFrame(raf);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    }

    /* ---------- "What you get" tabs (.kx) ---------- */
    const kxTabs = Array.from(root.querySelectorAll<HTMLElement>('.kx-tab'));
    const kxPanes = Array.from(root.querySelectorAll<HTMLElement>('.kx-pane'));
    if (kxTabs.length && kxPanes.length) {
      let kxTimer: ReturnType<typeof setInterval> | null = null;
      let userActed = false;

      const selectKx = (k: string | number) => {
        const key = String(k);
        kxTabs.forEach((t) => t.setAttribute('aria-selected', t.getAttribute('data-k') === key ? 'true' : 'false'));
        kxPanes.forEach((p) => p.classList.toggle('on', p.getAttribute('data-k') === key));
      };
      const stopTimer = () => {
        if (kxTimer) { clearInterval(kxTimer); kxTimer = null; }
      };

      kxTabs.forEach((t) => {
        const onClick = () => { userActed = true; stopTimer(); selectKx(t.getAttribute('data-k') || 0); };
        const onEnter = () => { stopTimer(); selectKx(t.getAttribute('data-k') || 0); };
        t.addEventListener('click', onClick);
        t.addEventListener('mouseenter', onEnter);
        cleanups.push(() => {
          t.removeEventListener('click', onClick);
          t.removeEventListener('mouseenter', onEnter);
        });
      });

      if (!reduce && 'IntersectionObserver' in window) {
        let i = 0;
        const stage = root.querySelector('.kx');
        const kxIO = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !userActed && !kxTimer) {
              kxTimer = setInterval(() => {
                if (userActed) { stopTimer(); return; }
                i = (i + 1) % kxTabs.length;
                selectKx(i);
              }, 3200);
            } else if (!e.isIntersecting) {
              stopTimer();
            }
          });
        }, { threshold: 0.4 });
        if (stage) kxIO.observe(stage);
        cleanups.push(() => { kxIO.disconnect(); stopTimer(); });
      }
    }

    /* ---------- live pipeline terminal: stages light up sequentially ---------- */
    const pipe = root.querySelector('.pipeline');
    if (pipe) {
      const rows = Array.from(pipe.querySelectorAll<HTMLElement>('.pl-row'));
      const timer = pipe.querySelector('.pl-timer');
      if (rows.length) {
        if (reduce) {
          rows.forEach((r) => r.classList.add('on'));
          if (timer) timer.textContent = rows[rows.length - 1].getAttribute('data-t');
        } else {
          let running = false;
          let stepTimeout: ReturnType<typeof setTimeout> | null = null;
          const run = () => {
            running = true;
            rows.forEach((r) => r.classList.remove('on'));
            if (timer) timer.textContent = '00:00';
            let i = 0;
            const step = () => {
              if (i >= rows.length) { stepTimeout = setTimeout(run, 2800); return; }
              rows[i].classList.add('on');
              if (timer) timer.textContent = rows[i].getAttribute('data-t');
              i++;
              stepTimeout = setTimeout(step, 620);
            };
            step();
          };
          if ('IntersectionObserver' in window) {
            const pio = new IntersectionObserver((entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting && !running) run();
              });
            }, { threshold: 0.3 });
            pio.observe(pipe);
            cleanups.push(() => pio.disconnect());
          } else {
            run();
          }
          cleanups.push(() => { if (stepTimeout) clearTimeout(stepTimeout); });
        }
      }
    }

    /* ---------- stagger reveal: observe parent, cascade 'in' to children ---------- */
    const staggerReveal = (parentSel: string, childSel: string, delay: number) => {
      const parents = Array.from(root.querySelectorAll(parentSel));
      parents.forEach((parent) => {
        const children = Array.from(parent.querySelectorAll(childSel));
        if (reduce || !('IntersectionObserver' in window)) {
          children.forEach((c) => c.classList.add('in'));
          return;
        }
        const sio = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              children.forEach((c, i) => {
                setTimeout(() => c.classList.add('in'), 180 + i * delay);
              });
              sio.unobserve(e.target);
            }
          });
        }, { threshold: 0.12 });
        sio.observe(parent);
        cleanups.push(() => sio.disconnect());
      });
    };
    staggerReveal('.metric-wall', '.mw-row', 90);
    staggerReveal('.ba-new', '.ban-item', 65);
    staggerReveal('.q-list', '.q-row', 110);
    staggerReveal('.stax-new', '.stax-strip', 90);

    /* ---------- ROI calculator ---------- */
    const v = root.querySelector<HTMLInputElement>('#roi-visitors');
    if (v) {
      const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
      const set = (id: string, n: number) => {
        const el = root.querySelector(`#${id}`);
        if (el) el.textContent = fmt(n);
      };
      const calc = () => {
        const visitors = +v.value;
        set('roi-visitors-out', visitors);
        const b2b = visitors * 0.35;      // share that is identifiable B2B corporate
        const identified = b2b * 0.52;    // 40–65% match — midpoint
        const people = identified * 0.6;  // person-level subset
        const hot = identified * 0.18;    // ICP 70+
        const meetings = hot * 0.30;      // meetings in reach
        set('roi-identified', identified);
        set('roi-people', people);
        set('roi-hot', hot);
        set('roi-meetings', meetings);
      };
      v.addEventListener('input', calc);
      calc();
      cleanups.push(() => v.removeEventListener('input', calc));
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <div className="wid-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">IDENTIFY</span><span className="mark">✳</span><span className="ghost">ALL</span></h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ WEBSITE IDENTIFICATION</span>
                <span className="comp">&lt; 2KB · GDPR · NO COOKIE POPUP</span>
              </div>
              <h2 className="lp-headline reveal">
                Know every company and decision-maker visiting your site.
                <span className="acc"> In real-time.</span>
              </h2>
              <p className="lp-sub reveal">
                Outmate's tracking pixel installs in 5 minutes, identifies 40–65% of your B2B traffic
                down to the person, scores every visitor against your ICP, and alerts your team in Slack
                the second a hot prospect lands. No forms. No cookies popup. No Lighthouse score drop.
              </p>
              <div className="cta-row reveal">
                <Link to="/book-demo" className="btn solid">START IDENTIFYING VISITORS →</Link>
                <a href="#how-it-works" className="btn">SEE HOW IT WORKS</a>
              </div>
              <span className="micro reveal">&lt; 2KB gzipped · Zero Lighthouse impact · GDPR compliant · Free forever plan</span>
              <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / pixel active</span>
              <span className="corner bl">northwind.io / identified</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="wi-mock reveal">
                {/* browser chrome */}
                <div className="wi-bar">
                  <div className="wi-dots"><i></i><i></i><i></i></div>
                  <div className="wi-url">yoursite.com<span>/pricing</span></div>
                  <div className="wi-badge"><span className="dot"></span>PIXEL ACTIVE</div>
                </div>

                {/* page skeleton + floating ID card */}
                <div className="wi-page">
                  <div className="wi-skeleton">
                    <div className="wi-line w60"></div>
                    <div className="wi-line w35"></div>
                  </div>
                  <div className="wi-pcards">
                    <div className="wi-pcard"><div className="pt"></div><div className="pp"></div></div>
                    <div className="wi-pcard hi"><div className="pt"></div><div className="pp"></div></div>
                    <div className="wi-pcard"><div className="pt"></div><div className="pp"></div></div>
                  </div>

                  {/* IDENTIFICATION CARD */}
                  <div className="wi-id">
                    <div className="wi-id-head">
                      <span className="wi-id-badge"><span className="dot"></span>VISITOR IDENTIFIED</span>
                      <span className="wi-id-ts">03:48 · /pricing</span>
                    </div>

                    {/* IP → domain resolution */}
                    <div className="wi-id-resolve">
                      <span className="wi-id-ip">203.0.113.42</span>
                      <span className="wi-id-arr">→</span>
                      <span className="wi-id-domain">northwind.io</span>
                      <span className="wi-id-arr">→</span>
                      <span style={{ color: '#fff', fontSize: '10.5px' }}>person found</span>
                    </div>

                    {/* identified person */}
                    <div className="wi-id-person">
                      <div className="wi-id-av">DW</div>
                      <div>
                        <div className="wi-id-name">Dana Whitlock</div>
                        <div className="wi-id-role">VP Revenue Ops · Northwind Robotics</div>
                        <div className="wi-id-email">d.whitlock@northwind.io</div>
                      </div>
                    </div>

                    {/* ICP score bar */}
                    <div className="wi-id-score">
                      <span className="wi-id-sl">ICP SCORE</span>
                      <div className="wi-id-bar"><i style={{ width: '92%' }}></i></div>
                      <span className="wi-id-sn">92</span>
                    </div>

                    {/* action pills */}
                    <div className="wi-id-actions">
                      <span className="wi-id-act on">✳ Slack alert fired</span>
                      <span className="wi-id-act on">✳ CRM synced</span>
                      <span className="wi-id-act">AI email drafted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 3 · THE PROBLEM ===================== */}
        <section className="section" data-screen-label="Problem">
          <div className="card-lg problem-light pad-xl reveal">
            <div className="sec-head">
              <span className="num">[01]</span><span className="kicker">The problem</span>
            </div>
            <div className="problem-grid">
              <div>
                <h2 className="sec-title">Your website gets traffic.<br />We tell you <span className="acc">who it was.</span></h2>
              </div>
              <div className="problem-body">
                <p className="lead">Your website is the first place buyers go when they're evaluating you. They check your pricing. They read your docs. They compare your integrations. But unless they fill out a form — which 97% of them never will — they're invisible.</p>
                <p>Google Analytics tells you there were 2,400 sessions last Tuesday. It doesn't tell you that a VP of Sales at a Series B fintech spent 4 minutes on your pricing page, compared two plans, and left without a trace.</p>
                <p>That's not a traffic problem. That's an <span className="acc">intelligence problem.</span> The buyers are already there — you just can't see them.</p>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat"><div className="n"><span className="acc">97%</span></div><div className="l">of B2B website visitors never fill a form</div></div>
              <div className="stat"><div className="n">&lt;3%</div><div className="l">of website traffic converts to a known lead</div></div>
              <div className="stat"><div className="n">4<small style={{ fontSize: '.4em' }}> min</small></div><div className="l">average time a buyer spends evaluating your pricing before closing the tab</div></div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how-it-works" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">PIPELINE</span><span className="mark">✳</span><span className="g1">PIPELINE</span><span className="mark">✳</span><span className="g2">PIPELINE</span><span className="mark">✳</span><span className="g0">PIPELINE</span>
            </div>
          </div>

          <div className="pad-xl" style={{ paddingBottom: 0 }}>
            <div className="sec-head"><span className="num">[02]</span><span className="kicker">How it works</span></div>
            <h2 className="sec-title">How a page visit becomes a named lead<br />— <span className="acc">technically speaking.</span></h2>
            <p className="sec-sub">Install one script. Outmate runs an 8-stage pipeline in the background — from anonymous visit to identified decision-maker — without touching your site's performance.</p>
            <div style={{ height: 'clamp(26px,3vw,42px)' }}></div>
          </div>

          <div className="steps">
            <div className="step reveal" data-screen-label="Step / Detect">
              <div className="sn"><span>STEP 01</span><b>DETECT</b></div>
              <div className="ico">✳</div>
              <h3>The pixel fires.<br />Everything is captured.</h3>
              <p>A single &lt; 2KB async script loads on your site — zero blocking, zero Lighthouse impact. The moment a visitor lands, it captures page URL, referrer, session ID, scroll depth, time on page, and intent signals. Pricing pages, demo pages, and integration pages are auto-flagged as high-intent. The pixel sends events to Outmate's ingestion API every 30 seconds and on exit — via sendBeacon so nothing is lost on tab close.</p>
              <div className="cap"><span className="d"></span>First-party cookie (90-day, SameSite=Strict) · No cross-site tracking · Consent mode supported</div>
            </div>
            <div className="step reveal" data-screen-label="Step / Identify">
              <div className="sn"><span>STEP 02</span><b>IDENTIFY</b></div>
              <div className="ico">→</div>
              <h3>IP resolved.<br />Company matched.<br />Person surfaced.</h3>
              <p>The visitor's IP is resolved to a company domain via MaxMind GeoIP2, reverse DNS lookup, and ASN mapping. Residential IPs, VPNs, and mobile carriers are filtered out. The domain is matched to a company record — name, industry, size, funding stage, tech stack. Then the most likely decision-maker is identified via our enrichment waterfall — verified email, job title, and LinkedIn URL.</p>
              <div className="cap"><span className="d"></span>40–65% match rate on B2B traffic · Company + person-level ID · US, UK, EU coverage</div>
            </div>
            <div className="step reveal" data-screen-label="Step / Score & act">
              <div className="sn"><span>STEP 03</span><b>SCORE &amp; ACT</b></div>
              <div className="ico">⚡</div>
              <h3>ICP scored.<br />Slack alert fired.<br />AI email sent.</h3>
              <p>Every identified visitor is scored 0–100 against your ICP profile — set once in a 5-step wizard. Hot visitors (ICP 70+) trigger an instant Slack alert with the full visitor card. On paid plans, Outmate's AI agent sends a personalised email from your rep's own Gmail — referencing the exact pages they visited — in under 4 minutes.</p>
              <div className="cap"><span className="d"></span>Slack alerts in &lt; 60 sec · AI email in &lt; 4 min · CRM sync included</div>
            </div>
          </div>

          <div className="how-highlight">
            <span className="chip">END TO END</span>
            Visitor hits pricing page → named lead in your team's hands: <span className="acc">under 4 minutes.</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">Every feature. Built for one job —<br />turning traffic into <span className="acc">pipeline.</span></h2>
              <p className="sec-sub">From the pixel to the Slack alert to the AI email — every part of the identification loop is built in.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0"><span className="kn">01</span><span className="kt">Real-time visitor feed</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1"><span className="kn">02</span><span className="kt">Person-level identification</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2"><span className="kn">03</span><span className="kt">ICP scoring engine</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3"><span className="kn">04</span><span className="kt">Instant Slack alerts</span><span className="ka">→</span></button>
              </div>
              <div className="kx-stage">
                {/* 01 */}
                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Live feed</span>
                  <h3>Real-time visitor feed</h3>
                  <p>A live dashboard showing every identified company and person hitting your site — right now. Sorted by ICP score. Filterable by page, session length, and visit count. Updated the second a new visitor is identified. No refresh needed.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>visitor_feed</span><span className="live"><span className="dot"></span>14 ON-SITE</span></div>
                      <div className="feed">
                        <div className="feed-row"><div><div className="feed-co">Northwind Robotics</div><div className="feed-meta">PRICING · DEMO — 2M AGO</div></div><div className="score hot"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Halcyon Health</div><div className="feed-meta">CASE STUDY — 6M AGO</div></div><div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Atlas Freight Co.</div><div className="feed-meta">PRODUCT — 9M AGO</div></div><div className="score"><span className="bar"><i style={{ width: '58%' }}></i></span><b>58</b></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 02 */}
                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ Decision-maker</span>
                  <h3>Person-level identification</h3>
                  <p>We don't just tell you Acme Corp visited. We surface the most likely decision-maker — name, job title, verified work email, and LinkedIn URL — identified via a multi-source enrichment waterfall. 40–65% match rate on real B2B traffic.</p>
                  <div className="kx-vis">
                    <div className="kcontact">
                      <div className="top">
                        <span className="av">DW</span>
                        <span><span className="nm">Dana Whitlock</span><div className="rl">VP Revenue Ops · Northwind Robotics</div></span>
                      </div>
                      <div className="kfields">
                        <div className="kfield"><span className="l">EMAIL</span><span className="acc">d.whitlock@northwind.io</span></div>
                        <div className="kfield"><span className="l">LINKEDIN</span><span>/in/danawhitlock</span></div>
                        <div className="kfield"><span className="l">SEEN ON</span><span>/pricing · /demo · returned 3×</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 03 */}
                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ Fit score</span>
                  <h3>ICP scoring engine</h3>
                  <p>Every visitor scored 0–100 against your ideal customer profile — set once via a 5-step wizard. Score updates in real-time as your ICP evolves. Hot (70+), Warm (40–69), Cold (&lt;40). Only the scores that matter reach your team.</p>
                  <div className="kx-vis kgauge">
                    <div className="g-top"><span className="g-num">92</span><span className="g-lbl">ICP score<br />Northwind Robotics</span></div>
                    <div className="kbar"><i style={{ width: '92%' }}></i></div>
                    <div className="kticks"><span>0</span><span>COLD</span><span>50</span><span>HOT 70+</span><span>100</span></div>
                  </div>
                </div>
                {/* 04 */}
                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Alert</span>
                  <h3>Instant Slack alerts</h3>
                  <p>The second a Hot visitor (ICP 70+) lands on a key page, your sales channel gets a full visitor card — company, person, ICP score, pages visited, time on site, and a suggested opening line. No dashboard-checking. No manual monitoring.</p>
                  <div className="kx-vis">
                    <div className="slack-toast">
                      <div className="av">▣</div>
                      <div className="st-body">
                        <b>#hot-leads</b> — <span className="acc">Northwind Robotics</span> (ICP 92) just hit <b>/pricing</b> for the 3rd time. <b>Dana Whitlock, VP RevOps</b> identified.
                        <div className="st-meta">OUTMATE BOT · NOW · SUGGESTED OPENER ATTACHED</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE — LIVE PIPELINE ===================== */}
        <section className="section" data-screen-label="Deep dive">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(20px,2.4vw,32px)' }}>
              <div className="sec-head"><span className="num">[04]</span><span className="kicker">Live pipeline</span></div>
              <h2 className="sec-title">Watch a page visit become a named lead<br />in <span className="acc">under 4 minutes.</span></h2>
              <p className="sec-sub">Every identified visitor drops into a live feed — scored, enriched, and ready to action. Hot accounts fire a Slack alert and sync to your CRM the moment they land on a high-intent page.</p>
            </div>
            <div className="feed-wrap">
              <div className="dashboard">
                <div className="db-top">
                  <span className="dot"></span>
                  <span className="ttl">visitor_feed</span>
                  <span className="live">LIVE · 14 on-site now</span>
                  <span className="filters">
                    <span className="chip2 on">ICP 70+</span>
                    <span className="chip2">Pricing page</span>
                    <span className="chip2">This week</span>
                  </span>
                </div>
                <div className="db-cols">
                  <span>Company</span><span>Decision-maker</span><span>Last page</span><span>Seen</span><span style={{ textAlign: 'right' }}>ICP</span>
                </div>
                <div className="db-row hot">
                  <div className="db-co"><span className="c">Northwind Robotics</span><span className="p">Series C · 480 emp · SF</span></div>
                  <div className="db-person">Dana Whitlock<small>VP Revenue Ops</small></div>
                  <div className="db-page">/pricing</div>
                  <div className="db-time">2m ago</div>
                  <div className="db-score"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div>
                </div>
                <div className="db-row hot">
                  <div className="db-co"><span className="c">Vanta Logistics</span><span className="p">Series B · 210 emp · Austin</span></div>
                  <div className="db-person">Marcus Reed<small>Head of Sales</small></div>
                  <div className="db-page">/demo</div>
                  <div className="db-time">4m ago</div>
                  <div className="db-score"><span className="bar"><i style={{ width: '87%' }}></i></span><b>87</b></div>
                </div>
                <div className="db-row">
                  <div className="db-co"><span className="c">Halcyon Health</span><span className="p">Enterprise · 1.2k emp · Boston</span></div>
                  <div className="db-person">Priya Nair<small>RevOps Manager</small></div>
                  <div className="db-page">/case-studies</div>
                  <div className="db-time">6m ago</div>
                  <div className="db-score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div>
                </div>
                <div className="db-row">
                  <div className="db-co"><span className="c">Atlas Freight Co.</span><span className="p">Mid-market · 90 emp · Denver</span></div>
                  <div className="db-person">— <small>company-level</small></div>
                  <div className="db-page">/product</div>
                  <div className="db-time">9m ago</div>
                  <div className="db-score"><span className="bar"><i style={{ width: '58%' }}></i></span><b>58</b></div>
                </div>
                <div className="db-row">
                  <div className="db-co"><span className="c">Meridian Capital</span><span className="p">Enterprise · 3.4k emp · NYC</span></div>
                  <div className="db-person">— <small>company-level</small></div>
                  <div className="db-page">/</div>
                  <div className="db-time">12m ago</div>
                  <div className="db-score"><span className="bar"><i style={{ width: '31%' }}></i></span><b>31</b></div>
                </div>
              </div>
            </div>

            {/* signature: real-time pipeline terminal */}
            <div className="pipeline reveal">
              <div className="pl-bar">
                <span className="dot"></span>
                <span>pipeline · northwind robotics · /pricing</span>
                <span className="pl-timer">00:00</span>
              </div>
              <div className="pl-rows">
                <div className="pl-row" data-t="00:00"><span className="ts">00:00</span><span className="stg">PIXEL</span><span className="dsc">Visit detected — /pricing · returned 3× · high-intent flag set</span></div>
                <div className="pl-row" data-t="00:30"><span className="ts">00:30</span><span className="stg">INGEST</span><span className="dsc">6 intent events captured — scroll depth, dwell time, plan comparison</span></div>
                <div className="pl-row" data-t="00:44"><span className="ts">00:44</span><span className="stg">RESOLVE</span><span className="dsc">IP → northwind.io · MaxMind GeoIP2 + reverse DNS · VPN check passed</span></div>
                <div className="pl-row" data-t="01:12"><span className="ts">01:12</span><span className="stg">MATCH</span><span className="dsc">Company matched — Northwind Robotics · Series C · 480 emp · SF</span></div>
                <div className="pl-row" data-t="02:06"><span className="ts">02:06</span><span className="stg">ENRICH</span><span className="dsc">Decision-maker surfaced — Dana Whitlock, VP Revenue Ops</span></div>
                <div className="pl-row" data-t="02:41"><span className="ts">02:41</span><span className="stg">VERIFY</span><span className="dsc">d.whitlock@northwind.io verified · LinkedIn /in/danawhitlock confirmed</span></div>
                <div className="pl-row" data-t="03:08"><span className="ts">03:08</span><span className="stg">SCORE</span><span className="dsc">Scored against ICP — <span className="ok">92 / 100 · HOT</span></span></div>
                <div className="pl-row" data-t="03:24"><span className="ts">03:24</span><span className="stg">ALERT</span><span className="dsc">Slack #hot-leads fired with full visitor card + suggested opener</span></div>
                <div className="pl-row final" data-t="03:48"><span className="ts">03:48</span><span className="stg">SYNC</span><span className="dsc">Synced to Salesforce · AI email drafted from rep's Gmail <span className="ok">✓</span></span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7 · ROI CALCULATOR ===================== */}
        <section className="section" data-screen-label="ROI calculator">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">ROI calculator</span></div>
              <h2 className="sec-title">How much pipeline is hiding<br />in your <span className="acc">current traffic?</span></h2>
              <p className="sec-sub">Drag the slider to your monthly website visitors. We'll estimate what Outmate surfaces from traffic you're already paying for.</p>
              <div style={{ height: 'clamp(26px,3vw,44px)' }}></div>
            </div>
            <div className="roi">
              <div className="roi-in">
                <div className="rlab"><span>Monthly website visitors</span></div>
                <div className="roi-val"><span id="roi-visitors-out">25,000</span></div>
                <input type="range" id="roi-visitors" min="2000" max="250000" step="1000" defaultValue="25000" aria-label="Monthly website visitors" />
                <p className="roi-note">Estimate assumes ~35% of traffic is identifiable B2B corporate, a 52% match rate (midpoint of 40–65%), and typical ICP-hit and meeting-conversion ratios. Your numbers will vary — book a demo for a tailored projection.</p>
              </div>
              <div className="roi-out">
                <div className="roi-cell"><div className="n" id="roi-identified">4,550</div><div className="l">Companies identified / month</div></div>
                <div className="roi-cell"><div className="n" id="roi-people">2,730</div><div className="l">Named decision-makers / month</div></div>
                <div className="roi-cell"><div className="n" id="roi-hot">819</div><div className="l">Hot ICP leads (70+) / month</div></div>
                <div className="roi-cell"><div className="n" id="roi-meetings">246</div><div className="l">Est. meetings in reach / month</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · INTEGRATIONS — FITS YOUR STACK ===================== */}
        <section className="section" data-screen-label="Integrations">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[06]</span><span className="kicker">Integrations</span></div>
              <h2 className="sec-title">Fits your <span className="acc">stack.</span></h2>
              <p className="sec-sub">Outmate plugs into the tools your team already lives in — no rip-and-replace, no new dashboard to babysit. Every identified lead flows straight to where you work.</p>
              <div style={{ height: 'clamp(20px,2.4vw,36px)' }}></div>
            </div>
            <div className="stax-new">
              <div className="stax-strip">
                <span className="ss-cat">CRM sync</span>
                <div className="ss-main">
                  <div className="ss-tools">Salesforce · HubSpot · Pipedrive</div>
                  <div className="ss-desc">Every identified lead — scored and enriched — written to your CRM in real-time, so reps work warm intent from the system they already trust.</div>
                </div>
                <span className="ss-arrow">→</span>
              </div>
              <div className="stax-strip">
                <span className="ss-cat">Alerts</span>
                <div className="ss-main">
                  <div className="ss-tools">Slack</div>
                  <div className="ss-desc">Hot visitors fire a full visitor card to your sales channel in under 60 seconds — company, person, ICP score, and a suggested opening line.</div>
                </div>
                <span className="ss-arrow">→</span>
              </div>
              <div className="stax-strip">
                <span className="ss-cat">Email</span>
                <div className="ss-main">
                  <div className="ss-tools">Gmail · Outlook</div>
                  <div className="ss-desc">The AI agent sends a personalised email from your rep's own inbox, referencing the exact pages the buyer viewed — in under 4 minutes.</div>
                </div>
                <span className="ss-arrow">→</span>
              </div>
              <div className="stax-strip">
                <span className="ss-cat">Outbound &amp; more</span>
                <div className="ss-main">
                  <div className="ss-tools">Apollo · Lemlist · LinkedIn · Zapier</div>
                  <div className="ss-desc">Push enriched contacts into your sequences, or wire identification events to anything in your stack with Zapier webhooks.</div>
                </div>
                <span className="ss-arrow">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 9 · OUTCOMES ===================== */}
        <section className="section" data-screen-label="Outcomes">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[07]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">Less invisible traffic.<br />More <span className="acc">booked meetings.</span></h2>
              <p className="sec-sub">Teams running Outmate's visitor identification stop guessing who's evaluating them — and start reaching out while the buyer is still in research mode.</p>
              <div style={{ height: 'clamp(20px,2.4vw,36px)' }}></div>
            </div>

            {/* metric wall: staggered slide-in rows */}
            <div className="metric-wall">
              <div className="mw-row">
                <span className="mw-idx">01</span>
                <div className="mw-n"><span className="acc">40–65%</span></div>
                <p className="mw-l">identification rate — on real B2B traffic, company and person-level</p>
              </div>
              <div className="mw-row">
                <span className="mw-idx">02</span>
                <div className="mw-n">&lt;<span className="acc">60</span><span style={{ fontSize: '.42em', color: 'var(--muted)', fontWeight: 400 }}> sec</span></div>
                <p className="mw-l">from visitor landing to Slack alert fired with full visitor card</p>
              </div>
              <div className="mw-row">
                <span className="mw-idx">03</span>
                <div className="mw-n">&lt;<span className="acc">4</span><span style={{ fontSize: '.42em', color: 'var(--muted)', fontWeight: 400 }}> min</span></div>
                <p className="mw-l">from high-intent visit to personalised AI email in prospect's inbox</p>
              </div>
              <div className="mw-row">
                <span className="mw-idx">04</span>
                <div className="mw-n"><span className="acc">5</span><span style={{ fontSize: '.42em', color: 'var(--muted)', fontWeight: 400 }}> min</span></div>
                <p className="mw-l">setup — one script tag, one ICP wizard, live visitor feed running before your next meeting</p>
              </div>
            </div>

            {/* animated before / after */}
            <div className="ba-new">
              <div className="ban-col before">
                <div className="ban-hd"><span className="ban-line"></span>Before Outmate</div>
                <div className="ban-item"><span className="ban-mk">✕</span><span>Pricing page visits disappear into Google Analytics</span></div>
                <div className="ban-item"><span className="ban-mk">✕</span><span>Sales team has no idea who's evaluating them</span></div>
                <div className="ban-item"><span className="ban-mk">✕</span><span>Outreach goes to cold lists while hot buyers browse uncontacted</span></div>
                <div className="ban-item"><span className="ban-mk">✕</span><span>Every form non-fill is a permanently lost lead</span></div>
              </div>
              <div className="ban-col after">
                <div className="ban-hd"><span className="ban-line"></span>With Outmate</div>
                <div className="ban-item"><span className="ban-mk">✳</span><span>Every B2B visit identified, scored, and surfaced in real-time</span></div>
                <div className="ban-item"><span className="ban-mk">✳</span><span>Sales team gets Slack alerts on hot visitors within 60 seconds</span></div>
                <div className="ban-item"><span className="ban-mk">✳</span><span>AI email reaches the buyer while they're still on your site</span></div>
                <div className="ban-item"><span className="ban-mk">✳</span><span>Non-form visitors become your highest-converting pipeline source</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 10 · PROOF / TESTIMONIALS ===================== */}
        <section className="section" data-screen-label="Proof">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[08]</span><span className="kicker">Proof</span></div>
              <h2 className="sec-title">Built for teams that<br />live in the <span className="acc">pipeline.</span></h2>
              <div style={{ height: 'clamp(20px,2.4vw,36px)' }}></div>
            </div>
            <div className="q-list">
              <div className="q-row">
                <span className="q-idx">01</span>
                <div className="q-body">
                  <span className="q-mark">"</span>
                  <p className="q-text">We turned anonymous pricing-page traffic into our best-converting channel. The reps finally trust the leads they're handed.</p>
                </div>
                <div className="q-who"><div className="nm">VP of Sales</div><div className="ro">B2B SaaS · placeholder</div></div>
              </div>
              <div className="q-row">
                <span className="q-idx">02</span>
                <div className="q-body">
                  <span className="q-mark">"</span>
                  <p className="q-text">Setup was genuinely five minutes. By the afternoon we had named decision-makers dropping into Slack with full context.</p>
                </div>
                <div className="q-who"><div className="nm">Head of RevOps</div><div className="ro">Fintech · placeholder</div></div>
              </div>
              <div className="q-row">
                <span className="q-idx">03</span>
                <div className="q-body">
                  <span className="q-mark">"</span>
                  <p className="q-text">It's the first tool that didn't oversell its match rate. What it identifies is real, and the AI drafts save my team hours every week.</p>
                </div>
                <div className="q-who"><div className="nm">Founder / GTM Lead</div><div className="ro">Dev Tools · placeholder</div></div>
              </div>
            </div>
            <div className="proof-foot">Placeholder testimonials — customer names &amp; logos available on request.</div>
          </div>
        </section>

        {/* ===================== 11 · SECURITY & COMPLIANCE ===================== */}
        <section className="section" data-screen-label="Security">
          <div className="card-dark pad-xl reveal">
            <div className="sec-head"><span className="num">[09]</span><span className="kicker">Security &amp; compliance</span></div>
            <div className="sec-security">
              <h2 className="sec-title">Enterprise-grade trust,<br />baked in from <span className="acc">day one.</span></h2>
              <div className="badges">
                <div className="badge"><div className="bi">✓</div><div className="bt">SOC 2 Type II</div><div className="bd">Independently audited</div></div>
                <div className="badge"><div className="bi">✓</div><div className="bt">GDPR-ready</div><div className="bd">First-party · consent mode</div></div>
                <div className="badge"><div className="bi">✓</div><div className="bt">CCPA</div><div className="bd">Opt-out supported</div></div>
                <div className="badge"><div className="bi">✓</div><div className="bt">DPA on request</div><div className="bd">Signed with every customer</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 12 · FAQ ===================== */}
        <section className="section" data-screen-label="FAQ">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(24px,3vw,40px)' }}>
              <div className="sec-head"><span className="num">[10]</span><span className="kicker">FAQ</span></div>
              <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item" open>
                <summary><span className="q">Will the pixel slow down my website?</span><span className="tog">+</span></summary>
                <div className="a"><p>No. The script is under 2KB gzipped, loads asynchronously, and never blocks page rendering. It has <span className="acc">zero impact on your Lighthouse score</span> — we test every release against PageSpeed Insights before shipping.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How does person-level identification actually work?</span><span className="tog">+</span></summary>
                <div className="a"><p>When a visitor's IP resolves to a company domain, we run the domain through a multi-source enrichment waterfall — our own database, Crustdata, BetterContact, and Hunter — to surface the most likely decision-maker at that company. We return the highest-confidence match with a verified work email, title, and LinkedIn URL. For US traffic, we also integrate RB2B for higher person-level match rates.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Is this compliant with GDPR and other privacy laws?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. Raw IP addresses are never stored beyond 24 hours. We use first-party cookies only — SameSite=Strict, no cross-site tracking. Consent mode is supported via <span className="acc">om("consent", "denied")</span> which disables all tracking. We sign Data Processing Agreements with every customer, and all enrichment providers on our waterfall hold valid DPAs.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">What if a visitor's IP doesn't resolve to a company?</span><span className="tog">+</span></summary>
                <div className="a"><p>Residential IPs, mobile carriers, and VPNs are filtered out before enrichment runs — so you're never billed credits for unresolvable traffic. Only confirmed B2B corporate IP ranges pass through to the identification pipeline.</p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 13 · FINAL CTA ===================== */}
        <section className="section" id="start" data-screen-label="Final CTA">
          <div className="final-cta reveal">
            <span className="fc-ast">✳</span>
            <h2>See who's<br />on your site.</h2>
            <p>Free forever plan · 5-minute setup · No credit card</p>
            <div className="cta-row">
              <Link to="/book-demo" className="btn on-accent">START FREE →</Link>
              <Link to="/book-demo" className="btn ghost-accent">BOOK A DEMO</Link>
            </div>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="foot" id="contact" data-screen-label="Footer">
          <div className="foot-services">
            <span className="idx">[00–9]</span>
            <div className="foot-col">
              <h5>Identify</h5>
              <ul><li>Company Reveal</li><li>Person-Level Match</li><li>IP &amp; Identity Graph</li></ul>
            </div>
            <div className="foot-col">
              <h5>Score</h5>
              <ul><li>ICP Scoring</li><li>Page &amp; Signal Tracking</li><li>Enrichment</li></ul>
            </div>
            <div className="foot-col">
              <h5>Act</h5>
              <ul><li>Real-Time Slack Alerts</li><li>CRM Sync · AI Auto-send</li><li>Integrations</li></ul>
            </div>
          </div>

          <div className="contact">
            <div className="contact-main">
              <h2>CONTACT</h2>
              <p className="contact-tag">
                <span className="dim">AND THAT'S THE PITCH.</span> <span className="ast">✳</span>
                IF YOU WANT TO SEE WHO'S ON YOUR SITE RIGHT NOW, HIT US UP.
              </p>
              <div className="btns">
                <Link to="/book-demo" className="btn solid">BOOK A DEMO →</Link>
                <a href="mailto:hello@outmate.ai" className="btn">EMAIL →</a>
                <a href="#" className="btn">LINKEDIN →</a>
                <a href="#" className="btn">TWITTER →</a>
              </div>
            </div>
            <div className="contact-side">
              <div className="portrait">
                <span className="ph">[ DROP YOUR<br />PRODUCT SHOT<br />/ TEAM PHOTO ]</span>
              </div>
              <span className="small">2026 — Outmate. Built to reveal demand.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
