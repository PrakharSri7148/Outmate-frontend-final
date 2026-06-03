import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './enrich-route-leads.css';

export default function EnrichRouteLeads() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Outmate — Enrich & Route Leads";
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // --- reveal on scroll ---
    const revealEls = root.querySelectorAll('.reveal');
    let io: IntersectionObserver | null = null;

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io?.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach((el) => io?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('in'));
    }

    // --- giant ENRICH✳ROUTE headline: scroll-driven horizontal drift ---
    const strip = root.querySelector('.bighead .strip') as HTMLElement | null;
    const track = root.querySelector('#bigtrack') as HTMLElement | null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf: number | null = null;

    const update = () => {
      if (!track || !strip) return;
      raf = null;
      const rect = strip.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // progress: 0 when strip enters bottom, 1 when it leaves top
      let prog = (vh - rect.top) / (vh + rect.height);
      prog = Math.max(0, Math.min(1, prog));
      // overflow available to slide
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
    }

    // --- "What you get" tab switcher ---
    const tabs = Array.from(root.querySelectorAll<HTMLElement>('.kx-tab'));
    const panes = Array.from(root.querySelectorAll<HTMLElement>('.kx-pane'));
    const tabHandlers: Array<[HTMLElement, () => void]> = [];

    tabs.forEach((tab) => {
      const handler = () => {
        const k = tab.dataset.k;
        tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
        panes.forEach((p) => p.classList.remove('on'));
        tab.setAttribute('aria-selected', 'true');
        const target = root.querySelector(`.kx-pane[data-k="${k}"]`);
        if (target) target.classList.add('on');
      };
      tab.addEventListener('click', handler);
      tabHandlers.push([tab, handler]);
    });

    return () => {
      if (io) io.disconnect();
      if (raf !== null) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      tabHandlers.forEach(([tab, handler]) => tab.removeEventListener('click', handler));
    };
  }, []);

  return (
    <div className="erl-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">OUTMATE</span><span className="mark">✳</span><span className="ghost">ENRICH</span></h1>
          </div>
          <div className="hero-grid">

            {/* Left */}
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ ENRICHMENT &amp; LEAD ROUTING</span>
                <span className="comp">SOC 2 · GDPR · CCPA</span>
              </div>
              <h2 className="lp-headline reveal">
                We close the gap between<br /><span className="dim">"form filled"</span> and<br /><span className="acc">"first reply."</span>
              </h2>
              <p className="lp-sub reveal">
                The moment a lead fills your form, Outmate enriches them with verified email, title, firmographics, and intent signals — then routes them to the right rep with full context attached. No waiting. No guessing. No leads going cold.
              </p>
              <div className="cta-row reveal">
                <Link to="/book-demo" className="btn solid">ENRICH YOUR LEADS NOW →</Link>
                <a href="#how" className="btn">SEE IT IN ACTION</a>
              </div>
              <span className="micro reveal">Works with HubSpot, Salesforce, and any form you already use · Live in 10 minutes</span>
              <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
            </div>

            {/* Right: live enrichment mock */}
            <div className="hero-right">
              <span className="corner tl">outmate / enrichment_queue</span>
              <span className="corner bl">2026 · live</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>
              <div className="er-mock reveal">
                <div className="er-bar">
                  <span>enrichment_queue</span>
                  <span className="live"><span className="dot"></span>LIVE · 3 PROCESSING</span>
                </div>
                <div className="er-lead-head">
                  <div className="er-lead-name">Sarah Chen · Veritas Cloud</div>
                  <div className="er-lead-sub">FORM FILL · 10:17:02AM · ENRICHING NOW</div>
                </div>
                <div className="er-fields">
                  <div className="er-field">
                    <span className="el">Email</span>
                    <span className="ev ac"><span className="ck">✓</span>s.chen@veritascloud.io</span>
                  </div>
                  <div className="er-field">
                    <span className="el">Title</span>
                    <span className="ev"><span className="ck">✓</span>VP of Sales</span>
                  </div>
                  <div className="er-field">
                    <span className="el">Company</span>
                    <span className="ev"><span className="ck">✓</span>Series B · 280 emp · Austin</span>
                  </div>
                  <div className="er-field">
                    <span className="el">Tech Stack</span>
                    <span className="ev"><span className="ck">✓</span>Salesforce · HubSpot · Gong</span>
                  </div>
                  <div className="er-field">
                    <span className="el">Intent</span>
                    <span className="ev"><span className="ck">✓</span>/pricing · /case-studies · 3×</span>
                  </div>
                </div>
                <div className="er-score-strip">
                  <div className="sn">82<small>/100</small></div>
                  <div className="er-sb"><i style={{ width: '82%' }}></i></div>
                  <div className="er-hot">HOT</div>
                </div>
                <div className="er-route-strip">
                  <span className="arr">→</span>
                  <span className="dest">Marcus Reed — Enterprise West</span>
                  <span className="tm">47 sec total</span>
                </div>
                <div className="er-next-row">
                  <span className="co">James Holbrook · Apex Fintech · queued</span>
                  <div className="sc"><span className="bar"><i style={{ width: '44%' }}></i></span><b>44</b></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2 · THE PROBLEM ===================== */}
        <section className="section" data-screen-label="Problem">
          <div className="card-dark pad-xl reveal">
            <div className="sec-head">
              <span className="num">[01]</span><span className="kicker">The problem</span>
            </div>
            <div className="problem-grid">
              <div>
                <h2 className="sec-title">The lead came in<br />3 hours ago.<br /><span className="acc">Nobody knows<br />who they are.</span></h2>
              </div>
              <div className="problem-body">
                <p className="lead">A lead fills your form at 10:17am.</p>
                <p>By 10:18, it's sitting in your CRM with a name, a generic email, and a company nobody's heard of. The assigned rep is in a meeting. The SDR is heads-down. Ops is enriching last week's batch in a spreadsheet.</p>
                <p>By the time someone opens the lead at 1:30pm, three things have happened:</p>
                <ul className="prob-list">
                  <li><span className="mk">✳</span>The buyer has already compared you to two competitors</li>
                  <li><span className="mk">✳</span>The intent that drove the form fill has cooled off</li>
                  <li><span className="mk">✳</span>Your "5-minute response" SLA is dead</li>
                </ul>
                <p>This is where inbound revenue leaks out — not at the form fill, but in the silent hours after.</p>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat">
                <div className="n"><span className="acc">5 min</span></div>
                <div className="l">response window that 8× your conversion vs 1+ hour</div>
              </div>
              <div className="stat">
                <div className="n">78%</div>
                <div className="l">of inbound leads go to the vendor who responds first</div>
              </div>
              <div className="stat">
                <div className="n">4+ <small style={{ fontSize: '.4em' }}>hrs/wk</small></div>
                <div className="l">lost per rep on manual lead research</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">ENRICH</span><span className="mark">✳</span><span className="g1">ROUTE</span><span className="mark">✳</span><span className="g2">ENRICH</span><span className="mark">✳</span><span className="g0">ROUTE</span>
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-intro reveal">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <h2>The lead arrives. We do the heavy lifting before your rep opens it.</h2>
              <p>Connect your forms once. Every new lead gets enriched, scored, and routed automatically.</p>
            </div>
            <div className="cards">
              <article className="pcard reveal" data-screen-label="Step / Enrich">
                <span className="tag"><span className="g">✳</span>STEP 01 · ENRICH</span>
                <h3>The lead<br />lands. We<br /><span className="acc">fill in the</span><br /><span className="acc">blanks.</span></h3>
                <span className="cap">Verified email, phone, LinkedIn, title, company size, funding, tech stack, signals — in under 30 seconds. No Clay. No spreadsheet. No RevOps engineer.</span>
              </article>
              <article className="pcard light reveal" data-screen-label="Step / Score">
                <span className="tag"><span className="g">✳</span>STEP 02 · SCORE</span>
                <h3>We figure<br />out how<br /><span className="acc">warm they</span><br /><span className="acc">actually are.</span></h3>
                <span className="cap">Every lead scored 0–100 against your ICP and tagged with intent signals. Reps see the score before they see the name.</span>
              </article>
              <article className="pcard neon reveal" data-screen-label="Step / Route">
                <span className="tag"><span className="g">✳</span>STEP 03 · ROUTE</span>
                <h3>Right rep.<br />Right context.<br /><span className="acc">Right now.</span></h3>
                <span className="cap">Auto-assigned by territory, vertical, or round-robin. Slack alert for hot leads. CRM updated. Reply window: under 5 minutes.</span>
              </article>
            </div>
          </div>

          <div className="how-highlight">
            <span>Form fill → Enriched lead in the right rep's hands:</span>
            <span className="acc">under 60 seconds.</span>
            <span className="chip">end-to-end automated</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">What your reps actually see<br />when a lead <span className="acc">lands.</span></h2>
              <p className="sec-sub">Stop handing your reps blank lead records. Start handing them deal-ready profiles.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0">
                  <span className="kn">01</span><span className="kt">Waterfall enrichment</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1">
                  <span className="kn">02</span><span className="kt">Real-time scoring</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2">
                  <span className="kn">03</span><span className="kt">Smart routing</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3">
                  <span className="kn">04</span><span className="kt">Full context on every lead</span><span className="ka">→</span>
                </button>
              </div>
              <div className="kx-stage">

                {/* 01 Waterfall */}
                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Enrichment waterfall</span>
                  <h3>Waterfall enrichment</h3>
                  <p>Verified email, direct phone, LinkedIn, title, firmographics — all in one record. We try multiple providers automatically so you get the highest match rate at the lowest cost.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>enrichment_cascade</span><span className="live"><span className="dot"></span>RUNNING</span></div>
                      <div className="feed">
                        <div className="feed-row">
                          <div>
                            <div className="feed-co">Apollo — email</div>
                            <div className="feed-meta">s.chen@veritascloud.io · VERIFIED</div>
                          </div>
                          <div className="score hot"><b style={{ color: '#5bd984' }}>✓ MATCH</b></div>
                        </div>
                        <div className="feed-row">
                          <div>
                            <div className="feed-co">Clearbit — direct phone</div>
                            <div className="feed-meta">+1 (512) 4•• •••• · VERIFIED</div>
                          </div>
                          <div className="score hot"><b style={{ color: '#5bd984' }}>✓ MATCH</b></div>
                        </div>
                        <div className="feed-row">
                          <div>
                            <div className="feed-co">LinkedIn — title + firmographics</div>
                            <div className="feed-meta">VP Sales · Series B · 280 emp</div>
                          </div>
                          <div className="score hot"><b style={{ color: '#5bd984' }}>✓ MATCH</b></div>
                        </div>
                        <div className="feed-row">
                          <div>
                            <div className="feed-co">Bombora — intent signals</div>
                            <div className="feed-meta">CRM tools · sales automation · HIGH INTENT</div>
                          </div>
                          <div className="score hot"><b style={{ color: '#5bd984' }}>✓ MATCH</b></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 02 Scoring */}
                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ ICP scoring</span>
                  <h3>Real-time scoring</h3>
                  <p>Every lead scored 0–100 against your ICP the second it lands. Hot leads bubble to the top. Cold leads stay out of your reps' way.</p>
                  <div className="kx-vis kgauge">
                    <div className="g-top">
                      <span className="g-num">82</span>
                      <span className="g-lbl">ICP score<br />Sarah Chen · Veritas Cloud</span>
                    </div>
                    <div className="kbar"><i style={{ width: '82%' }}></i></div>
                    <div className="kticks"><span>0</span><span>BAD FIT</span><span>50</span><span>STRONG FIT</span><span>100</span></div>
                  </div>
                </div>

                {/* 03 Routing */}
                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ Smart routing</span>
                  <h3>Smart routing</h3>
                  <p>Route by territory, vertical, deal size, round-robin — or build your own logic. Hot leads (ICP 70+) can skip the queue and ping a specific rep directly.</p>
                  <div className="kx-vis">
                    <div className="route-vis">
                      <div className="rv-bar">routing_engine · Sarah Chen · ICP 82</div>
                      <div className="route-rule match">
                        <div className="ri">✓</div>
                        <div className="rl">Territory = "West Coast"</div>
                        <div className="rs">→ match</div>
                      </div>
                      <div className="route-rule match">
                        <div className="ri">✓</div>
                        <div className="rl">ICP score ≥ 70</div>
                        <div className="rs">→ match (82)</div>
                      </div>
                      <div className="route-rule match">
                        <div className="ri">✓</div>
                        <div className="rl">Vertical = "B2B SaaS"</div>
                        <div className="rs">→ match</div>
                      </div>
                      <div className="route-dest">
                        <span className="arr">→</span>
                        <div>
                          <div className="d">Marcus Reed — Enterprise West</div>
                          <div className="sub">Skip queue · Slack #hot-leads · CRM updated</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 04 Full context */}
                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Full context</span>
                  <h3>Full context on every lead</h3>
                  <p>Recent funding, current tech stack, job postings, and pages they've already viewed on your site — all attached to the lead before the rep opens it.</p>
                  <div className="kx-vis">
                    <div className="ctx-vis">
                      <div className="cv-bar">
                        <span>lead_context · Sarah Chen</span>
                        <span>ENRICHED</span>
                      </div>
                      <div className="ctx-section">
                        <div className="cl">Funding</div>
                        <div className="cv">Series B · <span className="ac">$24M raised</span> · Jun 2025 · investors: Accel, Bessemer</div>
                      </div>
                      <div className="ctx-section">
                        <div className="cl">Tech Stack</div>
                        <div className="cv">Salesforce · HubSpot · Gong · Outreach · Clearbit</div>
                      </div>
                      <div className="ctx-section">
                        <div className="cl">Signals</div>
                        <div className="cv"><span className="ac">4 AEs hired</span> this month · EU expansion announced · actively searching "CRM automation"</div>
                      </div>
                      <div className="ctx-section">
                        <div className="cl">Pages viewed</div>
                        <div className="cv">/pricing (3×) · /case-studies (2×) · /integrations · /demo</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ===================== 5b · COMPARISON ===================== */}
        <section className="section" data-screen-label="Comparison">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">Why teams switch</span></div>
              <h2 className="sec-title">Built to replace the<br /><span className="acc">spreadsheet stack.</span></h2>
              <p className="sec-sub">Manual research, Clay tables, and Apollo searches all stop at "here's the data." Outmate runs the whole motion — enrich, score, route — the second a lead lands.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="cmp">
              <div className="cmp-row cmp-head">
                <div className="cmp-feat">Capability</div>
                <div className="cmp-col">Manual / Sheets</div>
                <div className="cmp-col">Clay</div>
                <div className="cmp-col">Apollo</div>
                <div className="cmp-col best">✳ Outmate</div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">Enrich on form fill</div>
                <div className="cmp-col"><span className="mk no">✕</span>Manual</div>
                <div className="cmp-col"><span className="mk no">✕</span>Triggered</div>
                <div className="cmp-col"><span className="mk no">✕</span>Search</div>
                <div className="cmp-col best"><span className="mk yes">✓</span>Automatic</div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">Multi-provider waterfall</div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk partial">~</span>DIY setup</div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col best"><span className="mk yes">✓</span>Built-in</div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">ICP scoring</div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk partial">~</span>Basic</div>
                <div className="cmp-col best"><span className="mk yes">✓</span>0–100</div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">Auto-route to reps</div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col best"><span className="mk yes">✓</span>Rules engine</div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">Slack hot-lead alerts</div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col best"><span className="mk yes">✓</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">No RevOps engineer</div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk no">✕</span></div>
                <div className="cmp-col"><span className="mk yes">✓</span></div>
                <div className="cmp-col best"><span className="mk yes">✓</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-feat">Time to first routed lead</div>
                <div className="cmp-col">Days</div>
                <div className="cmp-col">Hours</div>
                <div className="cmp-col">Hours</div>
                <div className="cmp-col best"><span className="yes">10 minutes</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE ===================== */}
        <section className="section" data-screen-label="Deep dive">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(20px,2.4vw,32px)' }}>
              <div className="sec-head"><span className="num">[04]</span><span className="kicker">ENRICH ✳ ROUTE</span></div>
              <h2 className="sec-title">From form fill to the right rep —<br /><span className="acc">in one motion.</span></h2>
              <p className="sec-sub">Watch a lead waterfall through enrichment and branch to the right rep by territory, vertical, and ICP score. Speed-to-lead drops from 4 hours to 90 seconds.</p>
            </div>
            <div className="pipeline-vis">
              <div className="pipeline">
                <div className="pl-head">
                  <span className="dot"></span>
                  <span>form_fill → enrich → score → route</span>
                  <span style={{ marginLeft: 'auto', color: '#4a4a56', fontSize: '10px' }}>Sarah Chen · Veritas Cloud · 10:17:02am</span>
                </div>

                <div className="pl-stage-label">
                  <span className="sn">01</span>
                  <span>FORM FILL → INGEST</span>
                  <span className="ts">00:00</span>
                </div>
                <div className="pl-ingest-row">
                  <span style={{ color: '#6e6e78' }}>Lead: </span>
                  Sarah Chen · s.chen@veritascloud.io ·
                  <span style={{ color: '#4a4a56' }}> Webflow form → HubSpot CRM · raw record created</span>
                </div>

                <div className="pl-stage-label">
                  <span className="sn">02</span>
                  <span>WATERFALL ENRICHMENT</span>
                  <span className="ts">00:04–00:28</span>
                </div>
                <div className="pl-providers">
                  <div className="pl-prov">
                    <div className="pn">Apollo</div>
                    <div className="pv"><span className="ck">✓</span>Verified email</div>
                    <div className="pm">s.chen@veritascloud.io</div>
                  </div>
                  <div className="pl-prov">
                    <div className="pn">Clearbit</div>
                    <div className="pv"><span className="ck">✓</span>Direct phone</div>
                    <div className="pm">+1 (512) 4•• ••••</div>
                  </div>
                  <div className="pl-prov">
                    <div className="pn">LinkedIn</div>
                    <div className="pv"><span className="ck">✓</span>Title + firmographics</div>
                    <div className="pm">VP Sales · 280 emp · Series B</div>
                  </div>
                </div>

                <div className="pl-stage-label">
                  <span className="sn">03</span>
                  <span>ICP SCORE</span>
                  <span className="ts">00:28–00:35</span>
                </div>
                <div className="pl-score-row">
                  <div className="sn">82</div>
                  <div className="sb"><i style={{ width: '82%' }}></i></div>
                  <div className="sl">ICP match · high intent · West Coast · B2B SaaS · 200–500 emp</div>
                  <div className="pl-hot-badge">HOT</div>
                </div>

                <div className="pl-stage-label">
                  <span className="sn">04</span>
                  <span>SMART ROUTE</span>
                  <span className="ts">00:35–00:47</span>
                </div>
                <div className="pl-routes">
                  <div className="pl-route-item hot">
                    <div className="rc">ICP ≥ 70 · West</div>
                    <div className="rd">→ Marcus Reed<br /><span style={{ color: '#8a8a92', fontSize: '10px' }}>Enterprise West · skip queue · Slack alert</span></div>
                  </div>
                  <div className="pl-route-item">
                    <div className="rc">ICP 40–69</div>
                    <div className="rd">→ SDR Pool<br /><span style={{ color: '#4a4a56', fontSize: '10px' }}>Round-robin assignment</span></div>
                  </div>
                  <div className="pl-route-item">
                    <div className="rc">ICP &lt; 40</div>
                    <div className="rd">→ Nurture sequence<br /><span style={{ color: '#4a4a56', fontSize: '10px' }}>HubSpot workflow triggered</span></div>
                  </div>
                </div>

                <div className="pl-timer">
                  <span className="tl">FORM FILL → ENRICHED · SCORED · ROUTED</span>
                  <span className="tv">47 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7 · INTEGRATIONS ===================== */}
        <section className="section" data-screen-label="Integrations">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">Integrations</span></div>
              <h2 className="sec-title">Fits your stack.<br />No rip-and-<span className="acc">replace.</span></h2>
              <p className="sec-sub">Outmate connects to the tools you already run — bi-directional, OAuth, and native. Your data stays in sync; actions fire from your own accounts.</p>
              <div style={{ height: 'clamp(20px,2.4vw,36px)' }}></div>
            </div>
            <div className="integ-cats">
              <div className="integ-cat">
                <div className="integ-cat-label">✳ CRM</div>
                <ul className="integ-logo-list">
                  <li><span className="ig">◢</span>Salesforce</li>
                  <li><span className="ig">✳</span>HubSpot</li>
                  <li><span className="ig">▦</span>Pipedrive</li>
                </ul>
              </div>
              <div className="integ-cat">
                <div className="integ-cat-label">✳ Email</div>
                <ul className="integ-logo-list">
                  <li><span className="ig">✉</span>Gmail</li>
                  <li><span className="ig">▤</span>Outlook</li>
                </ul>
              </div>
              <div className="integ-cat">
                <div className="integ-cat-label">✳ Messaging</div>
                <ul className="integ-logo-list">
                  <li><span className="ig">▣</span>Slack</li>
                  <li><span className="ig">◑</span>Intercom</li>
                </ul>
              </div>
              <div className="integ-cat">
                <div className="integ-cat-label">✳ Outreach &amp; Data</div>
                <ul className="integ-logo-list">
                  <li><span className="ig">⬡</span>Apollo</li>
                  <li><span className="ig">◆</span>Lemlist</li>
                  <li><span className="ig">in</span>LinkedIn</li>
                  <li><span className="ig">⚡</span>Zapier</li>
                </ul>
              </div>
            </div>
            {/* logo marquee */}
            <div className="marquee" style={{ borderRadius: '0 0 var(--radius) var(--radius)', marginTop: 0, borderTop: '1px solid var(--line-soft)', overflow: 'hidden' }}>
              <div className="ribbon" style={{ height: 'clamp(48px,5vw,62px)' }}>
                <span className="logo-item"><span className="gl">◢</span>Salesforce</span>
                <span className="logo-item"><span className="gl">✳</span>HubSpot</span>
                <span className="logo-item"><span className="gl">▣</span>Slack</span>
                <span className="logo-item"><span className="gl">✉</span>Gmail</span>
                <span className="logo-item"><span className="gl">▤</span>Outlook</span>
                <span className="logo-item"><span className="gl">in</span>LinkedIn</span>
                <span className="logo-item"><span className="gl">▦</span>Pipedrive</span>
                <span className="logo-item"><span className="gl">⬡</span>Apollo</span>
                <span className="logo-item"><span className="gl">◑</span>Intercom</span>
                <span className="logo-item"><span className="gl">⚡</span>Zapier</span>
                <span className="logo-item"><span className="gl">◆</span>Lemlist</span>
                <span className="logo-item"><span className="gl">◢</span>Salesforce</span>
                <span className="logo-item"><span className="gl">✳</span>HubSpot</span>
                <span className="logo-item"><span className="gl">▣</span>Slack</span>
                <span className="logo-item"><span className="gl">✉</span>Gmail</span>
                <span className="logo-item"><span className="gl">▤</span>Outlook</span>
                <span className="logo-item"><span className="gl">in</span>LinkedIn</span>
                <span className="logo-item"><span className="gl">▦</span>Pipedrive</span>
                <span className="logo-item"><span className="gl">⬡</span>Apollo</span>
                <span className="logo-item"><span className="gl">◑</span>Intercom</span>
                <span className="logo-item"><span className="gl">⚡</span>Zapier</span>
                <span className="logo-item"><span className="gl">◆</span>Lemlist</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · OUTCOMES ===================== */}
        <section className="section" data-screen-label="Outcomes">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[06]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">Faster replies. Hotter pipeline.<br /><span className="acc">Less manual work.</span></h2>
              <p className="sec-sub">Teams using Outmate stop drowning in manual enrichment and start working leads while they're still hot.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="metrics">
              <div className="metric">
                <div className="n"><span className="acc">&lt;60 sec</span></div>
                <div className="l">from form fill to enriched, scored, and routed</div>
              </div>
              <div className="metric">
                <div className="n">8×</div>
                <div className="l">higher conversion on leads contacted in under 5 minutes vs over an hour</div>
              </div>
              <div className="metric">
                <div className="n">40–70%</div>
                <div className="l">match rate on email, phone, and firmographics</div>
              </div>
              <div className="metric">
                <div className="n">4+ <small style={{ fontSize: '.4em' }}>hrs/wk</small></div>
                <div className="l">saved per rep — no more Googling, copying, pasting</div>
              </div>
            </div>
            <div className="ba">
              <div className="ba-col before">
                <h4>Before Outmate</h4>
                <ul>
                  <li><span className="mk">✕</span>Leads sit in CRM for hours before anyone opens them</li>
                  <li><span className="mk">✕</span>Reps Google the company before every reply</li>
                  <li><span className="mk">✕</span>Hot leads get routed to the wrong rep</li>
                  <li><span className="mk">✕</span>Inbound SLAs slip every week</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>With Outmate</h4>
                <ul>
                  <li><span className="mk">✳</span>Every lead enriched and routed in under 60 seconds</li>
                  <li><span className="mk">✳</span>Reps reply with full context from the first message</li>
                  <li><span className="mk">✳</span>Hot leads skip the queue, land with the right rep</li>
                  <li><span className="mk">✳</span>5-minute SLAs become the default</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 9 · PROOF ===================== */}
        <section className="section" data-screen-label="Proof">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[07]</span><span className="kicker">Proof</span></div>
              <h2 className="sec-title">Built for teams that<br />live in the <span className="acc">pipeline.</span></h2>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="quotes">
              <div className="quote">
                <div className="qm">"</div>
                <p>Speed-to-lead went from 4 hours to under 2 minutes. Our reps now open every inbound with a full profile — funding, stack, intent. Close rates on inbound are up 40%.</p>
                <div className="who"><div className="nm">VP of Sales</div><div className="ro">B2B SaaS</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>We killed the spreadsheet enrichment process entirely. Outmate runs the waterfall automatically — we just pick up the scored, routed lead and reply. That's it.</p>
                <div className="who"><div className="nm">Head of RevOps</div><div className="ro">Fintech</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>The first enrichment tool that doesn't require a RevOps engineer. Set it up in an afternoon. By morning, every inbound was enriched and routed to the right person automatically.</p>
                <div className="who"><div className="nm">Founder / GTM Lead</div><div className="ro">Dev Tools</div></div>
              </div>
            </div>
            <div className="proof-foot">Customer names &amp; logos available on request.</div>
          </div>
        </section>

        {/* ===================== 10 · SECURITY ===================== */}
        <section className="section" data-screen-label="Security">
          <div className="card-dark pad-xl reveal">
            <div className="sec-head"><span className="num">[08]</span><span className="kicker">Security &amp; compliance</span></div>
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

        {/* ===================== 11 · FAQ ===================== */}
        <section className="section" data-screen-label="FAQ">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(24px,3vw,40px)' }}>
              <div className="sec-head"><span className="num">[09]</span><span className="kicker">FAQ</span></div>
              <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item" open>
                <summary><span className="q">Does this work with my existing forms?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. Webflow, HubSpot, Marketo, Typeform, custom forms, Calendly — if it captures a lead, we can enrich and route it. No re-platforming needed.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How is this different from Clay or Apollo?</span><span className="tog">+</span></summary>
                <div className="a"><p>Clay needs a RevOps engineer to set up tables and waterfalls. Apollo gives you a database to search manually. <span className="acc">Outmate runs enrichment automatically the second a lead lands</span> — no setup, no spreadsheets, no manual triggers.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">What if you can't find the data?</span><span className="tog">+</span></summary>
                <div className="a"><p>We try multiple sources in order — and only charge credits for what we actually find. Leads with low match rates still get routed to your reps with whatever data we have, <span className="acc">flagged honestly.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How do I set up custom routing rules?</span><span className="tog">+</span></summary>
                <div className="a"><p>Drag-and-drop in our routing builder. Set rules by territory, vertical, company size, deal value, or ICP score. Hot leads (ICP 70+) can skip the standard queue and go directly to a named rep.</p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 11b · SETUP TIMELINE ===================== */}
        <section className="section" data-screen-label="Setup">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[10]</span><span className="kicker">Getting started</span></div>
              <h2 className="sec-title">From signup to first<br />routed lead in <span className="acc">10 minutes.</span></h2>
              <p className="sec-sub">No onboarding calls. No dev sprint. No RevOps engineer. Four steps and you're live.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="setup-steps">
              <div className="setup-step">
                <div className="ss-top"><span className="ss-n">01</span><span className="ss-t">~1 min</span></div>
                <h3>Connect your forms</h3>
                <p>Drop one snippet or connect HubSpot / Salesforce in a click. Every new lead starts flowing in.</p>
              </div>
              <div className="setup-step">
                <div className="ss-top"><span className="ss-n">02</span><span className="ss-t">~3 min</span></div>
                <h3>Define your ICP</h3>
                <p>Set the firmographics, territories, and signals that make a lead worth chasing. Scoring kicks in instantly.</p>
              </div>
              <div className="setup-step">
                <div className="ss-top"><span className="ss-n">03</span><span className="ss-t">~5 min</span></div>
                <h3>Build routing rules</h3>
                <p>Drag-and-drop rules by territory, vertical, and ICP score. Hot leads skip the queue and ping a named rep.</p>
              </div>
              <div className="setup-step">
                <div className="ss-top"><span className="ss-n">04</span><span className="ss-t">Instant</span></div>
                <h3>Go live</h3>
                <p>The next form fill gets enriched, scored, and routed automatically — before your rep even opens the tab.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 12 · FINAL CTA ===================== */}
        <section className="section" id="start" data-screen-label="Final CTA">
          <div className="final-cta reveal">
            <span className="fc-ast">✳</span>
            <h2>See who's<br />on your site.</h2>
            <p>Free forever plan · 5-minute setup · No credit card</p>
            <div className="cta-row">
              <Link to="/book-demo" className="btn on-accent">START FREE →</Link>
              <Link to="/book-demo" className="btn ghost-accent">BOOK A DEMO</Link>
            </div>
            <span style={{ position: 'relative', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.05em', color: 'rgba(255,255,255,.7)' }}>★ 4.8 ON G2 · 200+ REVIEWS</span>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="foot" id="contact" data-screen-label="Footer">
          <div className="foot-services">
            <span className="idx">[00–9]</span>
            <div className="foot-col">
              <h5>Enrich</h5>
              <ul>
                <li>Waterfall Enrichment</li>
                <li>Email &amp; Phone Verify</li>
                <li>Firmographic Data</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Score</h5>
              <ul>
                <li>ICP Scoring</li>
                <li>Intent Signals</li>
                <li>Lead Qualification</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Route</h5>
              <ul>
                <li>Smart Routing</li>
                <li>Slack Alerts</li>
                <li>CRM Sync</li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <div className="contact-main">
              <h2>CONTACT</h2>
              <p className="contact-tag">
                <span className="dim">AND THAT'S THE PITCH.</span> <span className="ast">✳</span>
                IF YOU WANT EVERY INBOUND LEAD ENRICHED AND ROUTED IN UNDER 60 SECONDS, HIT US UP.
              </p>
              <div className="btns">
                <Link to="/book-demo" className="btn solid">BOOK A DEMO →</Link>
                <a href="#" className="btn">EMAIL →</a>
                <a href="#" className="btn">LINKEDIN →</a>
              </div>
            </div>
            <div className="contact-side">
              <div className="portrait">
                <span className="ph">[ DROP YOUR<br />PRODUCT SHOT<br />/ TEAM PHOTO ]</span>
              </div>
              <span className="small">2026 — Outmate. Built to close the gap.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
