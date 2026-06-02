import React, { useEffect, useRef } from 'react';
import './automate-workflows.css';

const AutomateWorkflows: React.FC = () => {
  const bigtrackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Reveal on Scroll ---
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));

    // --- Giant "REVEAL" headline: scroll-driven horizontal drift ---
    const strip = stripRef.current;
    const track = bigtrackRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf: number | null = null;
    const updateHeader = () => {
      if (!track || !strip || reduce) return;
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
      if (raf === null) {
        raf = window.requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateHeader();

    // --- Count-up ---
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const formatCount = (v: number, dec: boolean) => {
      if (dec) return v.toFixed(1);
      return Math.round(v).toLocaleString('en-US');
    };

    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.getAttribute('data-count') || '0');
      const dec = el.getAttribute('data-dec') === '1';
      const dur = 1200;
      if (reduce) {
        el.textContent = formatCount(target, dec);
        return;
      }
      let start: number | null = null;
      const stepCount = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min(1, (ts - start) / dur);
        const v = target * easeOut(p);
        el.textContent = formatCount(v, dec);
        if (p < 1) requestAnimationFrame(stepCount);
        else el.textContent = formatCount(target, dec);
      };
      requestAnimationFrame(stepCount);
    };

    const counters = document.querySelectorAll('[data-count]');
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCount(e.target as HTMLElement);
          countIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countIO.observe(el));

    // --- Hero workflow: cycle 'fired' state + travelling spark ---
    const flow = flowRef.current;
    let intervalId: any;
    if (flow && !reduce) {
      const nodes = Array.from(flow.querySelectorAll('.node'));
      const spark = flow.querySelector('.spark') as HTMLElement;
      let i = 0;
      const tick = () => {
        nodes.forEach((n, idx) => {
          n.classList.toggle('fired', idx <= i);
          n.classList.toggle('pending', idx > i);
          const st = n.querySelector('.nstatus');
          if (st) st.textContent = idx < i ? '✓ done' : (idx === i ? '● running' : 'queued');
        });

        if (spark && i > 0 && i < nodes.length) {
          const first = (nodes[0] as HTMLElement).getBoundingClientRect();
          const cur = (nodes[i] as HTMLElement).getBoundingClientRect();
          const flowRect = flow.getBoundingClientRect();
          
          // Calculate drop distance relative to the first node
          spark.style.setProperty('--drop', `${cur.top - first.top}px`);
          // Set spark initial position relative to flow container
          spark.style.top = `${(nodes[0] as HTMLElement).offsetTop + 12}px`;
          
          spark.style.animation = 'none';
          void spark.offsetWidth;
          spark.style.animation = 'gtm-sparkdrop .7s ease-in forwards';
        }
        i++;
        if (i > nodes.length) {
          i = 0;
        }
      };
      tick();
      intervalId = setInterval(tick, 1600);
    }

    return () => {
      io.disconnect();
      countIO.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="gtm-root">
      <nav className="topbar">
        <a href="/" className="pill brand">
          <span className="ast">✳</span> OUTMATE
        </a>
        <div className="nav-actions">
          <a href="/pricing" className="pill">Pricing</a>
          <a href="/book-demo" className="pill">Book Demo</a>
        </div>
      </nav>

      <main className="page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1>
              AUTOMATE <span className="ghost">GTM</span> <span className="mark">✳</span>
            </h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow">
                <span className="tag">Workflow Automation</span>
                <span className="comp">→ No-code Engine</span>
              </div>
              <h2 className="lp-headline">
                Orchestrate your entire outbound stack <span className="acc">on autopilot.</span>
              </h2>
              <p className="lp-sub">
                Connect your data, identity, and sending tools into a single fluid motion. Reclaim 20+ hours of manual ops every week.
              </p>
              <div className="cta-row">
                <a href="/book-demo" className="btn solid">Build a Workflow →</a>
                <a href="/pricing" className="btn">View Agents</a>
              </div>
              <div className="hero-trust">
                <span className="stars">★★★★★</span>
                <span>Powered by Agentic Logic</span>
              </div>
            </div>
            <div className="hero-right">
              <span className="corner tl">ID: 4829-X</span>
              <span className="corner bl">EST RUNTIME: 2.1s</span>
              <span className="plus p1">+</span>
              <span className="plus p2">+</span>
              <span className="tick t1"></span>
              <span className="tick t2"></span>

              <div className="run">
                <div className="run-bar">
                  <div className="live"><i className="dot"></i> LIVE_WORKFLOW</div>
                  <div>GTM_ORCHESTRATOR_V2</div>
                </div>
                <div className="run-flow" ref={flowRef}>
                  <div className="spark"></div>
                  <div className="node fired">
                    <div className="stage">1</div>
                    <div className="nlabel">
                      <span className="t">Identify Visitor</span>
                      <span className="s">Website Reveal API</span>
                    </div>
                    <div className="nstatus">✓ done</div>
                  </div>
                  <div className="node fired">
                    <div className="stage">2</div>
                    <div className="nlabel">
                      <span className="t">Enrich Profile</span>
                      <span className="s">B2B Database + LinkedIn</span>
                    </div>
                    <div className="nstatus">✓ done</div>
                  </div>
                  <div className="node pending">
                    <div className="stage">3</div>
                    <div className="nlabel">
                      <span className="t">Filter & Score</span>
                      <span className="s">ICP Fit Check</span>
                    </div>
                    <div className="nstatus">● running</div>
                  </div>
                  <div className="node pending">
                    <div className="stage">4</div>
                    <div className="nlabel">
                      <span className="t">Trigger Outreach</span>
                      <span className="s">Instantly / Smartlead</span>
                    </div>
                    <div className="nstatus">queued</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO MARQUEE */}
        <section className="marquee reveal">
          <div className="ribbon">
            <div className="logo-item"><span className="gl">✳</span> UNSTRUCTURED</div>
            <div className="logo-item">GHOSTWRITER</div>
            <div className="logo-item"><span className="gl">✳</span> FLOWSTATE</div>
            <div className="logo-item">PHANTOM</div>
            <div className="logo-item"><span className="gl">✳</span> BORDERLESS</div>
            <div className="logo-item">SYNTHETIC</div>
            <div className="logo-item.sub">Enterprise Ready</div>
            {/* Duplicate for loop */}
            <div className="logo-item"><span className="gl">✳</span> UNSTRUCTURED</div>
            <div className="logo-item">GHOSTWRITER</div>
            <div className="logo-item"><span className="gl">✳</span> FLOWSTATE</div>
            <div className="logo-item">PHANTOM</div>
            <div className="logo-item"><span className="gl">✳</span> BORDERLESS</div>
            <div className="logo-item">SYNTHETIC</div>
            <div className="logo-item.sub">Enterprise Ready</div>
          </div>
        </section>

        {/* PROBLEM: scenario cards */}
        <section className="section problem-light">
          <div className="sec-head reveal">
            <span className="num">01.</span>
            <span className="kicker">The Friction</span>
          </div>
          <h2 className="sec-title reveal">Your GTM is currently a <span className="acc">manual mess.</span></h2>
          
          <div className="scards reveal">
            <div className="scard">
              <span className="sig">✳ FRAGMENTED</span>
              <p className="desc">Toggling between <b>12 different tabs</b> just to find, enrich, and email a single warm lead.</p>
              <div className="missed"><span className="x">✕</span> High Latency</div>
            </div>
            <div className="scard">
              <span className="sig">✳ INCONSISTENT</span>
              <p className="desc">Sales reps spending <b>40% of their day</b> on data entry instead of having conversations.</p>
              <div className="missed"><span className="x">✕</span> Rep Burnout</div>
            </div>
            <div className="scard">
              <span className="sig">✳ UNRELIABLE</span>
              <p className="desc">Leads going cold because there’s <b>no trigger-based action</b> when intent is high.</p>
              <div className="missed"><span className="x">✕</span> Lost Revenue</div>
            </div>
          </div>

          <div className="statrow-light reveal">
            <div className="stat">
              <div className="n"><span className="count" data-count="65">0</span>%</div>
              <div className="l">Of time spent on <br/> admin vs selling</div>
            </div>
            <div className="stat">
              <div className="n"><span className="count" data-count="22">0</span>hr</div>
              <div className="l">Saved per rep <br/> every single week</div>
            </div>
            <div className="stat">
              <div className="n"><span className="count" data-count="4.5" data-dec="1">0</span>x</div>
              <div className="l">Increase in <br/> meeting volume</div>
            </div>
          </div>
        </section>

        {/* ORCHESTRATION: the "REVEAL" track */}
        <section className="bighead reveal">
          <div className="strip" ref={stripRef}>
            <div className="track" id="bigtrack" ref={bigtrackRef}>
              ORCHESTRATE <span className="g1">EVERY</span> <span className="g2">TOUCHPOINT</span> <span className="mark">✳</span> AUTOMATE <span className="g1">EVERY</span> <span className="g2">OUTCOME</span>
            </div>
          </div>
          
          <div className="card-dark" style={{ border: '0', borderRadius: '0' }}>
            <div className="agentflow">
              <div className="achip lead">
                <div className="ai">1</div>
                <div className="txt"><span className="n">Trigger</span><span className="r">Identity Reveal</span></div>
              </div>
              <div className="aflow-arrow">→</div>
              <div className="achip">
                <div className="ai">2</div>
                <div className="txt"><span className="n">Enrich</span><span className="r">B2B + Person</span></div>
              </div>
              <div className="aflow-arrow">→</div>
              <div className="achip">
                <div className="ai">3</div>
                <div className="txt"><span className="n">Verify</span><span className="r">Deliverability</span></div>
              </div>
              <div className="aflow-arrow">→</div>
              <div className="achip">
                <div className="ai">4</div>
                <div className="txt"><span className="n">Execute</span><span className="r">Send Outreach</span></div>
              </div>
              <div className="aflow-arrow">→</div>
              <div className="achip more">
                <div className="ai">+</div>
                <div className="txt"><span className="n">Infinite</span><span className="r">Custom Steps</span></div>
              </div>
            </div>
          </div>
          
          <div className="agents-note">
            <span className="acc">●</span> Our Agentic Orchestrator handles the logic. You just set the rules.
          </div>
        </section>

        {/* FEATURE ROWS */}
        <section className="section">
          <div className="sec-head reveal">
            <span className="num">02.</span>
            <span className="kicker">The Engine</span>
          </div>
          <h2 className="sec-title reveal">Built for <span className="acc">technical marketers.</span></h2>
          
          <div className="frows reveal">
            <div className="frow">
              <div className="frow-txt">
                <span className="frow-num">01/</span>
                <h3>Conditional Logic</h3>
                <p>Route leads based on any attribute—industry, revenue, tech stack, or recent funding rounds.</p>
              </div>
              <div className="frow-vis">
                <div className="mini-toggles">
                  <div className="tg on"><div className="sw"></div> Enrich CEO?</div>
                  <div className="tg"><div className="sw"></div> Pass to SDR</div>
                  <div className="tg on"><div className="sw"></div> Verify Email</div>
                  <div className="tg on"><div className="sw"></div> Sync CRM</div>
                </div>
              </div>
            </div>

            <div className="frow">
              <div className="frow-txt">
                <span className="frow-num">02/</span>
                <h3>Deep Integrations</h3>
                <p>Native connections to Clay, Instantly, Smartlead, HubSpot, and Salesforce. No Zapier lag.</p>
              </div>
              <div className="frow-vis">
                <div className="mini-logos">
                  <div className="mlogo">CLAY</div>
                  <div className="mlogo"><span className="gl">✳</span> HUBS</div>
                  <div className="mlogo">INST</div>
                  <div className="mlogo">SL</div>
                  <div className="mlogo"><span className="gl">✳</span> SFDC</div>
                  <div className="mlogo">APO</div>
                </div>
              </div>
            </div>

            <div className="frow">
              <div className="frow-txt">
                <span className="frow-num">03/</span>
                <h3>Waterfall Enrichment</h3>
                <p>If Provider A fails, Provider B kicks in. Always get the right data point, every time.</p>
              </div>
              <div className="frow-vis">
                <div className="mini-stack">
                  <div className="mst lead"><div className="d">A</div> <span className="nm">Apollo API</span> <span className="ar">→</span></div>
                  <div className="mst"><div className="d">B</div> <span className="nm">Hunter.io</span> <span className="ar">→</span></div>
                  <div className="mst"><div className="d">C</div> <span className="nm">Dropcontact</span> <span className="ar">→</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUTCOMES / METRICS */}
        <section className="section reveal">
          <div className="card-lg">
            <div className="pad-xl">
              <div className="sec-head">
                <span className="num">03.</span>
                <span className="kicker">Performance</span>
              </div>
              <h2 className="sec-title">The <span className="acc">Autopilot</span> Advantage</h2>
              <p className="sec-sub">Companies using Outmate Workflows see a radical shift in their efficiency metrics within the first 14 days.</p>
            </div>
            
            <div className="metrics">
              <div className="metric">
                <div className="n"><span className="count" data-count="94">0</span>%</div>
                <div className="l">Reduction in time-to-lead</div>
              </div>
              <div className="metric">
                <div className="n"><span className="count" data-count="12">0</span>x</div>
                <div className="l">More leads processed per rep</div>
              </div>
              <div className="metric">
                <div className="n"><span className="count" data-count="0">0</span></div>
                <div className="l">Manual tasks required daily</div>
              </div>
              <div className="metric">
                <div className="n"><span className="count" data-count="310">0</span>%</div>
                <div className="l">Increase in pipeline speed</div>
              </div>
            </div>

            <div className="ba">
              <div className="ba-col before">
                <h4>Before Outmate</h4>
                <ul>
                  <li><span className="mk">✕</span> Manual LinkedIn research</li>
                  <li><span className="mk">✕</span> Human data entry into CRM</li>
                  <li><span className="mk">✕</span> Fragile Zapier connections</li>
                  <li><span className="mk">✕</span> Delayed outreach (24h+)</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>After Outmate</h4>
                <ul>
                  <li><span className="mk">✳</span> Instant Deanonymization</li>
                  <li><span className="mk">✳</span> Automated enrichment waterfalls</li>
                  <li><span className="mk">✳</span> Real-time Hubspot sync</li>
                  <li><span className="mk">✳</span> Instant personalized outreach</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section reveal">
          <div className="card-lg">
            <div className="pad-xl" style={{ paddingBottom: '0' }}>
              <div className="sec-head">
                <span className="num">04.</span>
                <span className="kicker">Details</span>
              </div>
              <h2 className="sec-title">Common <span className="acc">Questions.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item">
                <summary>
                  <span className="q">Do I need to be a developer to build workflows?</span>
                  <span className="tog">+</span>
                </summary>
                <div className="a">
                  <p>No. Our interface is purely visual and <b>no-code</b>. If you can define a logical process (e.g., "If this happens, then do that"), you can build an enterprise-grade GTM workflow.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="q">How does this differ from Zapier?</span>
                  <span className="tog">+</span>
                </summary>
                <div className="a">
                  <p>Zapier is a generic connector. Outmate is a <b>specialized GTM engine</b>. We handle enrichment waterfalls, identity reveal, and deliverability verification natively, meaning higher reliability and zero latency.</p>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="q">Does this work with my existing CRM?</span>
                  <span className="tog">+</span>
                </summary>
                <div className="a">
                  <p>Yes. We have <b>bi-directional native sync</b> with HubSpot and Salesforce. We can also push data to any platform via custom Webhooks.</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section reveal">
          <div className="final-cta">
            <div className="fc-ast">✳</div>
            <p>Ready to automate?</p>
            <h2>Start building <br/> your engine.</h2>
            <div className="cta-row">
              <a href="/book-demo" className="btn on-accent">Book a Demo →</a>
              <a href="/pricing" className="btn ghost-accent">View Pricing</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="foot reveal">
          <div className="contact">
            <div className="contact-main">
              <h2>OUTMATE <span className="ast">✳</span></h2>
              <div className="contact-tag">
                THE SYSTEM <span className="dim">OF RECORD</span> <br/> FOR <span className="ast">MODERN GTM.</span>
              </div>
              <div className="btns">
                <a href="/book-demo" className="btn solid">Get Started →</a>
                <a href="/pricing" className="btn">Full Toolkit</a>
              </div>
            </div>
            <div className="contact-side">
              <div className="portrait">
                <span className="ph">PORTRAIT_PLACEHOLDER <br/> [DESIGN_ASSET_4]</span>
              </div>
              <div className="small">©2024 OUTMATE — SWISS DESIGNED</div>
            </div>
          </div>
          
          <div className="foot-services">
            <div className="idx">NAV_INDEX</div>
            <div className="foot-col">
              <h5>Product</h5>
              <ul>
                <li><a href="/use-cases/identify-visitors">Identify Visitors</a></li>
                <li><a href="/use-cases/automate-workflows">Automate Workflows</a></li>
                <li><a href="/b2b-database">B2B Database</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Solutions</h5>
              <ul>
                <li><a href="/sales-team">For Sales Teams</a></li>
                <li><a href="/marketing-teams">For Marketing</a></li>
                <li><a href="/revops">For RevOps</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/labs">Labs</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AutomateWorkflows;

