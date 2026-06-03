import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './identify-visitors.css';

export default function IdentifyVisitors() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Outmate — Website Visitor Identification";
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

    // --- giant "REVEAL" headline: scroll-driven horizontal drift ---
    const strip = root.querySelector('.bighead .strip') as HTMLElement;
    const track = root.querySelector('#bigtrack') as HTMLElement;
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

    return () => {
      if (io) io.disconnect();
      if (raf !== null) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="vid-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">OUTMATE</span><span className="mark">✳</span><span className="ghost">INTENT</span></h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ WEBSITE VISITOR IDENTIFICATION</span>
                <span className="comp">SOC 2 · GDPR · CCPA</span>
              </div>
              <h2 className="lp-headline reveal">
                97% of your website visitors leave <span className="dim">without a trace.</span><br />
                We bring them back with a <span className="acc">name, title, and email.</span>
              </h2>
              <p className="lp-sub reveal">
                Drop a script on your site and watch the invisible become visible. Every visitor gets
                identified, scored against your ICP, and surfaced to your team — with the context they
                need to actually reach out.
              </p>
              <div className="cta-row reveal">
                <Link to="/book-demo" className="btn solid">START IDENTIFYING VISITORS →</Link>
                <a href="#how" className="btn">SEE HOW IT WORKS</a>
              </div>
              <span className="micro reveal">Setup takes 5 minutes · Free forever plan · No credit card required</span>
              <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / live feed</span>
              <span className="corner bl">san francisco / 2026</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="mock reveal">
                <div className="mock-bar">
                  <span>outmate_dashboard</span>
                  <span className="live"><span className="dot"></span>LIVE · 14 ON-SITE</span>
                </div>
                <div className="feed">
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">Northwind Robotics</div>
                      <div className="feed-meta">PRICING · DEMO · RETURNED 3× — 2M AGO</div>
                    </div>
                    <div className="score hot"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">Halcyon Health</div>
                      <div className="feed-meta">CASE STUDY · INTEGRATIONS — 6M AGO</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">Atlas Freight Co.</div>
                      <div className="feed-meta">PRODUCT · BLOG — 9M AGO</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '58%' }}></i></span><b>58</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">Meridian Capital</div>
                      <div className="feed-meta">HOMEPAGE — 12M AGO</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '31%' }}></i></span><b>31</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2 · LOGO WALL ===================== */}
        <section className="marquee" aria-label="Integrations" data-screen-label="Logos">
          <div className="ribbon">
            <span className="logo-item sub">works with the tools your team already runs →</span>
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
            <span className="logo-item"><span className="gl">▥</span>Analytics</span>
            {/* dup */}
            <span className="logo-item sub">works with the tools your team already runs →</span>
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
            <span className="logo-item"><span className="gl">▥</span>Analytics</span>
          </div>
        </section>

        {/* ===================== 3 · THE PROBLEM ===================== */}
        <section className="section" data-screen-label="Problem">
          <div className="card-dark pad-xl reveal">
            <div className="sec-head">
              <span className="num">[01]</span><span className="kicker">The problem</span>
            </div>
            <div className="problem-grid">
              <div>
                <h2 className="sec-title">Your warmest leads<br />are leaving without<br />saying <span className="acc">hello.</span></h2>
              </div>
              <div className="problem-body">
                <p className="lead">Every day, decision-makers land on your website. They read your pricing. They compare your features. They sit on your demo page — and then they close the tab.</p>
                <p>You'll never know they were there.</p>
                <p>No form. No email. No CRM entry. Just a <span className="acc">"session bounced"</span> in Google Analytics.</p>
                <p>These aren't cold leads. They're your warmest prospects — already in market, already evaluating you. And you're letting them walk away invisible.</p>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat"><div className="n"><span className="acc">97%</span></div><div className="l">of B2B visitors never fill a form</div></div>
              <div className="stat"><div className="n">6+<small style={{ fontSize: '.4em' }}> hrs/day</small></div><div className="l">lost chasing cold lists</div></div>
              <div className="stat"><div className="n">&lt;2%</div><div className="l">average website-to-lead conversion</div></div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS (REVEAL showcase) ===================== */}
        <section className="bighead" id="how" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">REVEAL</span><span className="mark">✳</span><span className="g1">REVEAL</span><span className="mark">✳</span><span className="g2">REVEAL</span><span className="mark">✳</span><span className="g0">REVEAL</span>
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-intro reveal">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <h2>From anonymous visit to a named lead — in under 4 minutes</h2>
              <p>Drop our script. We handle the rest — detect the visit, identify the buyer, and act before the tab closes.</p>
            </div>

            <div className="cards">
              {/* card 1 — DETECT */}
              <article className="pcard reveal" data-screen-label="Step / Detect">
                <span className="tag"><span className="g">✳</span>STEP 01 · DETECT</span>
                <h3>Catch<br />every visit<br /><span className="acc">the second</span><br /><span className="acc">it lands</span></h3>
                <div className="chipart"><div className="chip"></div><div className="pin"></div></div>
                <span className="cap">Pixel fires instantly · high-intent pages auto-flagged.</span>
              </article>
              {/* card 2 — IDENTIFY */}
              <article className="pcard light reveal" data-screen-label="Step / Identify">
                <span className="tag"><span className="g">✳</span>STEP 02 · IDENTIFY</span>
                <div className="emboss"><div className="e-mark">✳</div></div>
                <div className="knobs"><i></i><i></i><i></i><i></i></div>
                <span className="cap">Company &amp; decision-maker — name, title, email. 40–65% match, auto-enriched.</span>
              </article>
              {/* card 3 — ACT */}
              <article className="pcard neon reveal" data-screen-label="Step / Act">
                <span className="tag"><span className="g">✳</span>STEP 03 · ACT</span>
                <h3>Act<br />before<br /><span className="acc">the tab</span><br /><span className="acc">closes</span></h3>
                <div className="glow"></div>
                <span className="cap">Routed to a rep in &lt;4 min via Slack, CRM &amp; AI auto-send.</span>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">Real visitors. Real context.<br />In <span className="acc">real-time.</span></h2>
              <p className="sec-sub">Most tools stop at "here's who visited." We give you the full picture.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="feat-grid">
              <div className="feat accent">
                <div className="fi">▤</div>
                <h3>Real-time visitor feed</h3>
                <p>A live dashboard of every company and person hitting your site. Sorted by ICP score. Updated the second they arrive.</p>
                <div className="tagn">LIVE · AUTO-SORTED</div>
              </div>
              <div className="feat">
                <div className="fi">⊹</div>
                <h3>Person-level identification</h3>
                <p>Not just "Acme Corp visited." Get the actual decision-maker — name, title, email, LinkedIn — ready to reach out to.</p>
                <div className="tagn">NAME · TITLE · EMAIL · LINKEDIN</div>
              </div>
              <div className="feat">
                <div className="fi">◷</div>
                <h3>ICP scoring on autopilot</h3>
                <p>Every visitor scored 0–100 against your ideal customer profile. Stop wasting time on bad-fit traffic.</p>
                <div className="tagn">0–100 ICP SCORE</div>
              </div>
              <div className="feat">
                <div className="fi">◔</div>
                <h3>Instant Slack alerts</h3>
                <p>Hot visitor hits your pricing page? Your team knows in seconds — with the context to respond before the tab closes.</p>
                <div className="tagn">REAL-TIME · IN SECONDS</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · LIVE VISITOR FEED (deep dive) ===================== */}
        <section className="section" data-screen-label="Live feed">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(20px,2.4vw,32px)' }}>
              <div className="sec-head"><span className="num">[04]</span><span className="kicker">Live visitor feed</span></div>
              <h2 className="sec-title">Watch your pipeline<br />arrive in <span className="acc">real time.</span></h2>
              <p className="sec-sub">Every identified visitor drops into a live feed — scored, enriched, and ready to action. Hot accounts fire a Slack alert the moment they land on a high-intent page.</p>
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
                <div className="slack-toast">
                  <div className="av">▣</div>
                  <div className="st-body">
                    <b>#hot-leads</b> — <span className="acc">Northwind Robotics</span> (ICP 92) just hit <b>/pricing</b> for the 3rd time.
                    <b>Dana Whitlock, VP RevOps</b> identified. Draft email ready in your inbox.
                    <div className="st-meta">OUTMATE BOT · NOW · 1-CLICK TO CRM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7 · OUTCOMES ===================== */}
        <section className="section" data-screen-label="Outcomes">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">Stop missing the leads<br />that were already <span className="acc">on your site.</span></h2>
              <p className="sec-sub">Teams using Outmate stop relying on form-fills and start working off real intent — the kind that actually closes.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="metrics">
              <div className="metric"><div className="n"><span className="acc">3–5x</span></div><div className="l">more meetings — from website traffic you were already paying for</div></div>
              <div className="metric"><div className="n">&lt;4<small style={{ fontSize: '.4em' }}> min</small></div><div className="l">from visit to personalised outreach in their inbox</div></div>
              <div className="metric"><div className="n">40–65%</div><div className="l">of B2B traffic identified down to the person</div></div>
              <div className="metric"><div className="n">6+<small style={{ fontSize: '.4em' }}> hrs/wk</small></div><div className="l">saved per rep — no more manual prospecting</div></div>
            </div>
            <div className="ba">
              <div className="ba-col before">
                <h4>Before Outmate</h4>
                <ul>
                  <li><span className="mk">✕</span>97% of visitors leave anonymously</li>
                  <li><span className="mk">✕</span>Reps chase cold lists, ignore warm intent</li>
                  <li><span className="mk">✕</span>"We tried emailing them but didn't know who to email"</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>With Outmate</h4>
                <ul>
                  <li><span className="mk">✳</span>Every high-intent visitor identified and scored</li>
                  <li><span className="mk">✳</span>Reps work the warmest leads first</li>
                  <li><span className="mk">✳</span>Outreach goes out while the buyer is still in research mode</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · PROOF / TESTIMONIALS ===================== */}
        <section className="section" data-screen-label="Proof">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[06]</span><span className="kicker">Proof</span></div>
              <h2 className="sec-title">Built for teams that<br />live in the <span className="acc">pipeline.</span></h2>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="quotes">
              <div className="quote">
                <div className="qm">"</div>
                <p>We turned anonymous pricing-page traffic into our best-converting channel. The reps finally trust the leads they're handed.</p>
                <div className="who"><div className="nm">VP of Sales</div><div className="ro">B2B SaaS</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>Setup was genuinely five minutes. By the afternoon we had named decision-makers dropping into Slack with full context.</p>
                <div className="who"><div className="nm">Head of RevOps</div><div className="ro">Fintech</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>It's the first tool that didn't oversell its match rate. What it identifies is real, and the AI drafts save my team hours every week.</p>
                <div className="who"><div className="nm">Founder / GTM Lead</div><div className="ro">Dev Tools</div></div>
              </div>
            </div>
            <div className="proof-foot">Customer names &amp; logos available on request.</div>
          </div>
        </section>

        {/* ===================== 9 · SECURITY & COMPLIANCE ===================== */}
        <section className="section" data-screen-label="Security">
          <div className="card-dark pad-xl reveal">
            <div className="sec-head"><span className="num">[07]</span><span className="kicker">Security &amp; compliance</span></div>
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

        {/* ===================== 10 · FAQ ===================== */}
        <section className="section" data-screen-label="FAQ">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(24px,3vw,40px)' }}>
              <div className="sec-head"><span className="num">[08]</span><span className="kicker">FAQ</span></div>
              <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item" open>
                <summary><span className="q">How accurate is the identification?</span><span className="tog">+</span></summary>
                <div className="a"><p>We identify 40–65% of business traffic down to the company, and a smaller portion down to the named decision-maker. Residential IPs, mobile traffic, and VPNs stay anonymous — <span className="acc">and we'll never pretend otherwise.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How long does setup take?</span><span className="tog">+</span></summary>
                <div className="a"><p>Five minutes. Drop one script on your site, set your ICP in a 5-step wizard, and you're live. No dev team needed.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Is this GDPR and privacy compliant?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. We never store raw IPs beyond 24 hours, use first-party cookies only, support consent mode, and sign DPAs with every customer.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Is there really a free plan?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. Identify visitors, set up ICP, and get Slack alerts — <span className="acc">free forever.</span> You only pay when you want to activate the AI agent or scale up volume.</p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 11 · FINAL CTA ===================== */}
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
