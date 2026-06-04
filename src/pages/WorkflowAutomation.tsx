import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './workflow-automation.css';

export default function WorkflowAutomation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — Workflow Automation';
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

    /* ---------- "What you get" tab switcher (.kx) — click only ---------- */
    const kxTabs = Array.from(root.querySelectorAll<HTMLElement>('.kx-tab'));
    const kxPanes = Array.from(root.querySelectorAll<HTMLElement>('.kx-pane'));
    if (kxTabs.length && kxPanes.length) {
      const selectKx = (k: string) => {
        kxTabs.forEach((t) => t.setAttribute('aria-selected', t.getAttribute('data-k') === k ? 'true' : 'false'));
        kxPanes.forEach((p) => p.classList.toggle('on', p.getAttribute('data-k') === k));
      };
      kxTabs.forEach((t) => {
        const onClick = () => selectKx(t.getAttribute('data-k') || '0');
        t.addEventListener('click', onClick);
        cleanups.push(() => t.removeEventListener('click', onClick));
      });
    }

    /* ---------- giant headline: scroll-driven horizontal drift ---------- */
    const strip = root.querySelector('.bighead .strip') as HTMLElement | null;
    const track = root.querySelector('#bigtrack') as HTMLElement | null;
    let bhRaf: number | null = null;
    const bhUpdate = () => {
      if (!track || !strip) return;
      bhRaf = null;
      const rect = strip.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      let prog = (vh - rect.top) / (vh + rect.height);
      prog = Math.max(0, Math.min(1, prog));
      const overflow = Math.max(0, track.scrollWidth - strip.clientWidth);
      track.style.transform = `translate3d(${-prog * overflow}px,0,0)`;
    };
    const bhOnScroll = () => { if (bhRaf === null) bhRaf = window.requestAnimationFrame(bhUpdate); };
    if (track && strip && !reduce) {
      window.addEventListener('scroll', bhOnScroll, { passive: true });
      window.addEventListener('resize', bhOnScroll, { passive: true });
      bhUpdate();
      cleanups.push(() => {
        if (bhRaf !== null) window.cancelAnimationFrame(bhRaf);
        window.removeEventListener('scroll', bhOnScroll);
        window.removeEventListener('resize', bhOnScroll);
      });
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <div className="wfa-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">WORKFLOW</span><span className="mark">✳</span><span className="ghost">OUTMATE</span></h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ WORKFLOW AUTOMATION</span>
                <span className="comp">NO-CODE · 52 AI AGENTS</span>
              </div>
              <h2 className="lp-headline reveal">
                Build any GTM workflow.<br />
                <span className="dim">No engineers. No Zapier. No limits.</span>
              </h2>
              <p className="lp-sub reveal">Drag-and-drop signals, agents, and actions into fully automated GTM plays. Or describe what you want in plain English — Co-Pilot builds it on the canvas. Test on one contact. Deploy to thousands.</p>
              <div className="cta-row reveal">
                <Link to="/book-demo" className="btn solid">START FREE →</Link>
                <a href="#how" className="btn">SEE IT IN ACTION</a>
              </div>
              <span className="micro reveal">No-code visual canvas · 52 AI agents · Pre-built templates · Test before you deploy</span>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / workflow canvas</span>
              <span className="corner bl">build · test · deploy</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="wf-canvas reveal">
                <div className="wf-canvas-bar">
                  <span className="title">funded_company_blitz · canvas</span>
                  <span className="wf-live"><span className="wf-live-dot"></span>LIVE · 2,847 CONTACTS</span>
                </div>
                <div className="wf-palette">
                  <span className="wf-pnode wf-on">◆ TRIGGER</span>
                  <span className="wf-pnode">▹ LOGIC</span>
                  <span className="wf-pnode wf-on">✦ ENRICH</span>
                  <span className="wf-pnode">✉ ACTION</span>
                  <span className="wf-pnode wf-on">⚡ AGENT</span>
                  <span className="wf-pnode">▢ OUTPUT</span>
                </div>
                <div className="wf-flow">
                  <div className="wf-node wf-done">
                    <div className="wf-node-ico">◆</div>
                    <div className="wf-node-label">
                      <span className="wft">Funding signal detected</span>
                      <span className="wfs">TRIGGER · Crunchbase · Series B+</span>
                    </div>
                    <span className="wf-node-status">✓ done</span>
                  </div>
                  <div className="wf-connector"></div>
                  <div className="wf-node wf-done">
                    <div className="wf-node-ico">✦</div>
                    <div className="wf-node-label">
                      <span className="wft">Enrich CEO · Apollo + Clearbit</span>
                      <span className="wfs">ENRICHMENT · contact + company</span>
                    </div>
                    <span className="wf-node-status">✓ done</span>
                  </div>
                  <div className="wf-connector"></div>
                  <div className="wf-node wf-running">
                    <div className="wf-node-ico">▹</div>
                    <div className="wf-node-label">
                      <span className="wft">Score vs ICP → 88 · play picked</span>
                      <span className="wfs">LOGIC · ICP Scorer agent</span>
                    </div>
                    <span className="wf-node-status">running</span>
                  </div>
                  <div className="wf-connector wf-dim"></div>
                  <div className="wf-node">
                    <div className="wf-node-ico">✉</div>
                    <div className="wf-node-label">
                      <span className="wft">AI SDR drafts personalised email</span>
                      <span className="wfs">ACTION · Gmail · from rep's account</span>
                    </div>
                    <span className="wf-node-status">queued</span>
                  </div>
                  <div className="wf-connector wf-dim"></div>
                  <div className="wf-node">
                    <div className="wf-node-ico">▢</div>
                    <div className="wf-node-label">
                      <span className="wft">Log to CRM · alert rep in Slack</span>
                      <span className="wfs">OUTPUT · HubSpot + Slack</span>
                    </div>
                    <span className="wf-node-status">queued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2 · THE PROBLEM ===================== */}
        <section className="section" data-screen-label="Problem">
          <div className="card-dark wf-glow-dark reveal">
            <div className="prob-grid">
              <div>
                <div className="sec-head"><span className="num">[01]</span><span className="kicker">The problem</span></div>
                <h2 className="sec-title">You know what you want to automate. You just <span className="acc">can't build it</span> without an engineer.</h2>
              </div>
              <div className="prob-body">
                <p>You know exactly what you want. Funded company detected → enrich the CEO → score against ICP → send personalised email → call if no reply in 3 days → log to CRM. Simple in theory.</p>
                <p>In practice: a Zapier zap triggers the wrong step, Clay breaks the waterfall, nobody knows if the email went out, and the whole thing falls apart when your RevOps hire goes on leave.</p>
                <p>Most GTM teams don't have bad ideas for automation. They have no reliable way to build, test, and run them without technical help. So the workflows stay manual. The signals go unacted on. The pipeline stays stuck.</p>
              </div>
            </div>
            <div className="prob-stats">
              <div className="prob-stat">
                <div className="n">6+</div>
                <div className="l">tools stitched together by the average RevOps team to run one outbound workflow</div>
              </div>
              <div className="prob-stat">
                <div className="n">3–5<br /><span style={{ fontSize: '.42em', letterSpacing: 0, opacity: .7 }}>days</span></div>
                <div className="l">to build, test, and deploy a new GTM workflow in a typical stack</div>
              </div>
              <div className="prob-stat">
                <div className="n">80%</div>
                <div className="l">of intent signals go unacted on because no automated workflow exists to catch them</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">BUILD</span><span className="mark">✳</span><span className="g1">TEST</span><span className="mark">✳</span><span className="g2">DEPLOY</span><span className="mark">✳</span><span className="g0">BUILD</span><span className="mark">✳</span><span className="g1">TEST</span><span className="mark">✳</span><span className="g2">DEPLOY</span><span className="mark">✳</span>
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-intro reveal">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <h2>BUILD IT, TEST IT, DEPLOY IT. NO ENGINEERS REQUIRED.</h2>
              <p>Start from a pre-built template, describe what you want, or build from scratch — Outmate's canvas turns your GTM logic into a running workflow in minutes.</p>
            </div>

            <div className="steps sales-steps">

              <div className="step reveal" data-screen-label="Step / Build">
                <div className="sn">
                  <span className="step-badge">✳ STEP 01</span>
                  <b>BUILD</b>
                </div>
                <div className="ico">◆</div>
                <h3>Start from a template or describe it <span className="acc">in plain English.</span></h3>
                <p>Pick a pre-built Agent Army template — Funded Company Blitz, Full Outbound Army, Champion Reactivation — or type what you want and Co-Pilot generates the workflow on the canvas. Drag and drop to customise.</p>
                <div className="sbuild">
                  <div className="sbuild-bar">
                    <span>canvas · new workflow</span>
                    <span className="son">CO-PILOT ON</span>
                  </div>
                  <div className="sbuild-nodes">
                    <div className="sbuild-node"><span className="sbuild-ni">◆</span>Funding signal · Series B+</div>
                    <div className="sbuild-conn"></div>
                    <div className="sbuild-node"><span className="sbuild-ni">✦</span>Enrich CEO contact</div>
                    <div className="sbuild-conn"></div>
                    <div className="sbuild-node"><span className="sbuild-ni">▹</span>Score vs ICP → route</div>
                    <div className="sbuild-conn"></div>
                    <div className="sbuild-node"><span className="sbuild-ni">✉</span>AI SDR sends email</div>
                  </div>
                  <div className="sbuild-tags">
                    <span className="sbuild-tag">6 node types</span>
                    <span className="sbuild-tag">Templates</span>
                    <span className="sbuild-tag">Co-Pilot mode</span>
                  </div>
                </div>
                <div className="cap"><span className="d"></span>Pre-built templates · Co-Pilot build · 6 node types</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Test">
                <div className="sn">
                  <span className="step-badge">✳ STEP 02</span>
                  <b>TEST</b>
                </div>
                <div className="ico">✦</div>
                <h3>Run on one contact before deploying <span className="acc">to thousands.</span></h3>
                <p>Test mode runs the workflow against one real contact — showing exactly what fires, what gets enriched, what emails get drafted, what CRM fields update. Every step logged in plain English.</p>
                <div className="stest">
                  <div className="stest-bar">
                    <span>test_run · sarah@northwind.io</span>
                    <span className="stest-ok">✓ 4/4 PASSED</span>
                  </div>
                  <div className="stest-row">
                    <span className="stest-mk">✓</span>
                    <div className="stest-desc">Funding signal · Series B $24M
                      <span className="stest-sub">TRIGGER · crunchbase · 0.3s</span>
                    </div>
                  </div>
                  <div className="stest-row">
                    <span className="stest-mk">✓</span>
                    <div className="stest-desc">Enriched: Sarah Chen, CEO · 312 emp
                      <span className="stest-sub">ENRICHMENT · apollo · 1.1s</span>
                    </div>
                  </div>
                  <div className="stest-row">
                    <span className="stest-mk">✓</span>
                    <div className="stest-desc">ICP Score: 91 · Funded Blitz selected
                      <span className="stest-sub">LOGIC · icp scorer · 0.6s</span>
                    </div>
                  </div>
                  <div className="stest-row">
                    <span className="stest-mk">✓</span>
                    <div className="stest-desc">Email drafted · CRM field updated
                      <span className="stest-sub">ACTION · gmail + hubspot · 0.8s</span>
                    </div>
                  </div>
                </div>
                <div className="cap"><span className="d"></span>Test mode · Execution log · Version history + rollback</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Deploy">
                <div className="sn">
                  <span className="step-badge">✳ STEP 03</span>
                  <b>DEPLOY</b>
                </div>
                <div className="ico">⚡</div>
                <h3>Go live. Outmate runs it <span className="acc">24/7.</span></h3>
                <p>Flip it live — Outmate monitors trigger conditions continuously and fires the moment they're met. Every action logged, every outcome measured. Debug mode tells you exactly which step failed and why.</p>
                <div className="sdeploy">
                  <div className="sdeploy-bar">
                    <span>funded_company_blitz · live</span>
                    <span className="sdeploy-live"><span className="dot"></span>RUNNING</span>
                  </div>
                  <div className="sdeploy-stats">
                    <div className="sdeploy-num">
                      <span className="sdeploy-n">2,847</span>
                      <span className="sdeploy-l">processed</span>
                    </div>
                    <div className="sdeploy-num">
                      <span className="sdeploy-n">312</span>
                      <span className="sdeploy-l">sent today</span>
                    </div>
                    <div className="sdeploy-num">
                      <span className="sdeploy-n">100%</span>
                      <span className="sdeploy-l">audit trail</span>
                    </div>
                  </div>
                  <div className="sdeploy-row">
                    <span>Northwind Robotics</span>
                    <span className="sdeploy-ok">✓ FIRED</span>
                  </div>
                  <div className="sdeploy-row">
                    <span>Apex Systems · ICP 88</span>
                    <span className="sdeploy-ok">✓ EMAIL SENT</span>
                  </div>
                  <div className="sdeploy-row">
                    <span>Zephyr Logistics</span>
                    <span className="sdeploy-run">RUNNING</span>
                  </div>
                </div>
                <div className="cap"><span className="d"></span>24/7 monitoring · Full audit trail · Debug mode</div>
              </div>

            </div>
          </div>

          <div className="how-highlight reveal">
            Idea → live automated GTM workflow: <span className="acc">minutes, not days.</span>
            <span className="chip">No engineers · No Zapier · No limits</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">Every tool you need to automate your <span className="acc">entire GTM motion.</span></h2>
              <p className="sec-sub">Not a generic automation tool. Built specifically for the signals, agents, and actions that move B2B revenue.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0">
                  <span className="kn">01</span><span className="kt">Visual workflow canvas</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1">
                  <span className="kn">02</span><span className="kt">Agent Army templates</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2">
                  <span className="kn">03</span><span className="kt">Co-Pilot build mode</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3">
                  <span className="kn">04</span><span className="kt">Test mode + debug</span><span className="ka">→</span>
                </button>
              </div>
              <div className="kx-stage">

                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Visual canvas</span>
                  <h3>Drag-and-drop workflow canvas</h3>
                  <p>Connect any signal to any action in any order. Trigger, Logic, Enrichment, Action, Agent, and Output nodes. Version history on every workflow — rollback to any version in one click.</p>
                  <div className="kx-vis">
                    <div className="kx-wf-canvas">
                      <div className="kx-wf-bar">
                        <span>funded_company_blitz</span>
                        <span className="saved">✓ SAVED · v4</span>
                      </div>
                      <div className="kx-wf-body">
                        <div className="kx-wf-node">
                          <span className="kx-wf-ico">◆</span>
                          <span className="kx-wf-lbl">Funding raised · Series B+</span>
                          <span className="kx-wf-typ">Trigger</span>
                        </div>
                        <div className="kx-wf-ln"></div>
                        <div className="kx-wf-node">
                          <span className="kx-wf-ico dim">✦</span>
                          <span className="kx-wf-lbl">Enrich CEO · Apollo</span>
                          <span className="kx-wf-typ">Enrich</span>
                        </div>
                        <div className="kx-wf-ln dim"></div>
                        <div className="kx-wf-node">
                          <span className="kx-wf-ico dim">▹</span>
                          <span className="kx-wf-lbl">ICP score &gt; 80 → route</span>
                          <span className="kx-wf-typ">Logic</span>
                        </div>
                        <div className="kx-wf-ln dim"></div>
                        <div className="kx-wf-node">
                          <span className="kx-wf-ico dim">✉</span>
                          <span className="kx-wf-lbl">AI SDR sends email</span>
                          <span className="kx-wf-typ">Action</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ Agent Army</span>
                  <h3>Pre-built Agent Army templates</h3>
                  <p>Battle-tested templates — Funded Company Blitz, Full Outbound Army, Champion Reactivation. Each is a fully wired multi-agent workflow ready to customise and deploy in minutes.</p>
                  <div className="kx-vis">
                    <div className="kx-tpls">
                      <div className="kx-tpl">
                        <span className="kx-tpl-ico">⚡</span>
                        <div>
                          <div className="kx-tpl-name">Funded Company Blitz</div>
                          <div className="kx-tpl-sub">Trigger · Enrich · Score · Send</div>
                        </div>
                        <span className="kx-tpl-use">USE →</span>
                      </div>
                      <div className="kx-tpl">
                        <span className="kx-tpl-ico">◆</span>
                        <div>
                          <div className="kx-tpl-name">Full Outbound Army</div>
                          <div className="kx-tpl-sub">6 agents · full sequence</div>
                        </div>
                        <span className="kx-tpl-use">USE →</span>
                      </div>
                      <div className="kx-tpl">
                        <span className="kx-tpl-ico">◈</span>
                        <div>
                          <div className="kx-tpl-name">Champion Reactivation</div>
                          <div className="kx-tpl-sub">Job change → warm re-intro</div>
                        </div>
                        <span className="kx-tpl-use">USE →</span>
                      </div>
                      <div className="kx-tpl">
                        <span className="kx-tpl-ico">✦</span>
                        <div>
                          <div className="kx-tpl-name">Inbound Speed-to-Lead</div>
                          <div className="kx-tpl-sub">Form fill → reply in &lt;60s</div>
                        </div>
                        <span className="kx-tpl-use">USE →</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ Co-Pilot</span>
                  <h3>Co-Pilot build mode</h3>
                  <p>Type what you want in plain English — "build a workflow for funded fintech companies hiring VP Sales" — and Co-Pilot generates the full workflow on the canvas for your review.</p>
                  <div className="kx-vis">
                    <div className="kx-copilot">
                      <div className="kx-cop-bar">co-pilot · build mode</div>
                      <div className="kx-cop-prompt">"build a workflow for funded fintech companies hiring VP Sales"<span className="kx-cop-cursor"></span></div>
                      <div className="kx-cop-gen"><span className="gacc">✳</span>Generating workflow on canvas → 4 nodes</div>
                      <div className="kx-cop-nodes">
                        <div className="kx-cop-node"><span className="gico">◆</span>Funding raised + VP Sales hire detected</div>
                        <div className="kx-cop-node"><span className="gico">✦</span>Enrich decision maker · fintech filter</div>
                        <div className="kx-cop-node"><span className="gico">▹</span>Score vs ICP · if &gt; 75 continue</div>
                        <div className="kx-cop-node"><span className="gico">✉</span>AI SDR: personalised outreach</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Test mode</span>
                  <h3>Test mode + debug</h3>
                  <p>Run any workflow on one real contact before deploying to thousands. Every step logged in plain English. If a live workflow breaks, debug mode tells you exactly which step failed and why.</p>
                  <div className="kx-vis">
                    <div className="kx-testlog">
                      <div className="kx-log-bar">
                        <span>test_run · one contact</span>
                        <span className="lok">✓ ALL STEPS PASSED</span>
                      </div>
                      <div className="kx-log-row">
                        <span className="kx-log-mk">✓</span>
                        <div className="kx-log-body">Funding signal matched · Series B $24M
                          <span className="lsub">TRIGGER · 0.3s · crunchbase</span>
                        </div>
                      </div>
                      <div className="kx-log-row">
                        <span className="kx-log-mk">✓</span>
                        <div className="kx-log-body">Enriched: Sarah Chen, CEO · 312 employees
                          <span className="lsub">ENRICHMENT · 1.1s · apollo</span>
                        </div>
                      </div>
                      <div className="kx-log-row">
                        <span className="kx-log-mk">✓</span>
                        <div className="kx-log-body">ICP Score: 91 · Funded Blitz selected
                          <span className="lsub">LOGIC · 0.6s · icp scorer</span>
                        </div>
                      </div>
                      <div className="kx-log-row">
                        <span className="kx-log-mk">✓</span>
                        <div className="kx-log-body">Email drafted · CRM updated · Slack alert sent
                          <span className="lsub">OUTPUT · 0.8s · gmail + hubspot</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE ===================== */}
        <section className="section" data-screen-label="Deep Dive">
          <div className="card-dark wf-glow-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">Visual canvas</span></div>
              <h2 className="sec-title">Build, test on one contact,<br />deploy to <span className="acc">thousands.</span></h2>
              <p className="sec-sub">The canvas is the whole product. Every GTM workflow you can imagine, built visually — no code, no engineers, no Zapier.</p>
            </div>
            <div className="dd-cv-wrap">
              <div className="dd-cv">
                <div className="dd-cv-top">
                  <span className="dd-cv-title">funded_company_blitz · v4 · visual canvas</span>
                  <div className="dd-cv-actions">
                    <span className="dd-cv-btn">VERSION HISTORY</span>
                    <span className="dd-cv-btn">TEST MODE</span>
                    <span className="dd-cv-btn primary">▶ DEPLOY</span>
                  </div>
                </div>
                <div className="dd-cv-body">
                  <div className="dd-col">
                    <div className="dd-node done">
                      <div className="dd-node-hd">
                        <span className="dd-node-type trigger">◆ TRIGGER</span>
                        <span className="dd-node-ico">◆</span>
                      </div>
                      <div className="dd-node-title">Funding signal detected</div>
                      <div className="dd-node-val">Crunchbase · Series B+ · $10M+</div>
                    </div>
                    <div className="dd-node-conn"></div>
                    <div className="dd-node done">
                      <div className="dd-node-hd">
                        <span className="dd-node-type logic">▹ LOGIC</span>
                        <span className="dd-node-ico">▹</span>
                      </div>
                      <div className="dd-node-title">If ICP score &gt; 75</div>
                      <div className="dd-node-val">Continue → Funded Blitz play</div>
                    </div>
                  </div>
                  <div className="dd-col">
                    <div className="dd-node active">
                      <div className="dd-node-hd">
                        <span className="dd-node-type enrich">✦ ENRICHMENT</span>
                        <span className="dd-node-ico">✦</span>
                      </div>
                      <div className="dd-node-title">Enrich CEO + company</div>
                      <div className="dd-node-val">Apollo · Clearbit · LinkedIn</div>
                    </div>
                    <div className="dd-node-conn"></div>
                    <div className="dd-node">
                      <div className="dd-node-hd">
                        <span className="dd-node-type action">✉ ACTION</span>
                        <span className="dd-node-ico">✉</span>
                      </div>
                      <div className="dd-node-title">AI SDR sends email</div>
                      <div className="dd-node-val">From rep's Gmail · personalised</div>
                    </div>
                    <div className="dd-node-conn dim"></div>
                    <div className="dd-node">
                      <div className="dd-node-hd">
                        <span className="dd-node-type agent">⚡ AGENT</span>
                        <span className="dd-node-ico">⚡</span>
                      </div>
                      <div className="dd-node-title">Wait 3 days · call if no reply</div>
                      <div className="dd-node-val">Voice AI agent · qualify</div>
                    </div>
                  </div>
                  <div className="dd-col">
                    <div className="dd-node">
                      <div className="dd-node-hd">
                        <span className="dd-node-type output">▢ OUTPUT</span>
                        <span className="dd-node-ico">▢</span>
                      </div>
                      <div className="dd-node-title">Log to CRM</div>
                      <div className="dd-node-val">HubSpot · auto deal stage</div>
                    </div>
                    <div className="dd-node-conn dim"></div>
                    <div className="dd-node">
                      <div className="dd-node-hd">
                        <span className="dd-node-type output">▢ OUTPUT</span>
                        <span className="dd-node-ico">▣</span>
                      </div>
                      <div className="dd-node-title">Alert rep in Slack</div>
                      <div className="dd-node-val">Pre-call brief · action ready</div>
                    </div>
                  </div>
                </div>
                <div className="dd-cv-test">
                  <div className="dd-cv-test-info">
                    <span className="dd-cv-test-lbl">TEST MODE — running on 1 contact</span>
                    <span className="dd-cv-test-val">sarah@northwind.io · Series B · ICP 91</span>
                  </div>
                  <div className="dd-cv-steps">
                    <span className="dd-cv-step done">✓ Trigger</span>
                    <span className="dd-cv-step done">✓ Enrich</span>
                    <span className="dd-cv-step active">▶ Logic</span>
                    <span className="dd-cv-step">Email</span>
                    <span className="dd-cv-step">CRM</span>
                    <span className="dd-cv-step">Slack</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 7 · INTEGRATIONS ===================== */}
        <section className="section" data-screen-label="Integrations">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[04]</span><span className="kicker">Integrations</span></div>
              <h2 className="sec-title">Fits your stack.<br /><span className="acc">No rip-and-replace.</span></h2>
              <div style={{ height: 'clamp(24px,2.8vw,44px)' }}></div>
            </div>
            <div className="int-cats">
              <div className="int-cat">
                <div className="int-cat-lbl">CRM</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">◢</span>Salesforce</span>
                  <span className="int-pill"><span className="gl">✳</span>HubSpot</span>
                  <span className="int-pill"><span className="gl">▦</span>Pipedrive</span>
                </div>
              </div>
              <div className="int-cat">
                <div className="int-cat-lbl">Email &amp; Messaging</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">✉</span>Gmail</span>
                  <span className="int-pill"><span className="gl">▤</span>Outlook</span>
                  <span className="int-pill"><span className="gl">▣</span>Slack</span>
                  <span className="int-pill"><span className="gl">in</span>LinkedIn</span>
                </div>
              </div>
              <div className="int-cat">
                <div className="int-cat-lbl">Signals &amp; Data</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">◆</span>Crunchbase</span>
                  <span className="int-pill"><span className="gl">★</span>G2</span>
                  <span className="int-pill"><span className="gl">⬡</span>Apollo</span>
                  <span className="int-pill"><span className="gl">◆</span>Clearbit</span>
                </div>
              </div>
              <div className="int-cat">
                <div className="int-cat-lbl">Custom &amp; Outreach</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">⚡</span>Webhooks</span>
                  <span className="int-pill"><span className="gl">◆</span>API</span>
                  <span className="int-pill"><span className="gl">◆</span>Lemlist</span>
                  <span className="int-pill"><span className="gl">⬡</span>Clay</span>
                </div>
              </div>
            </div>
            <div className="int-mq">
              <div className="int-track">
                <span className="logo-item sub">all integrations native · no glue code →</span>
                <span className="logo-item"><span className="gl">◢</span>Salesforce</span>
                <span className="logo-item"><span className="gl">✳</span>HubSpot</span>
                <span className="logo-item"><span className="gl">▣</span>Slack</span>
                <span className="logo-item"><span className="gl">✉</span>Gmail</span>
                <span className="logo-item"><span className="gl">▤</span>Outlook</span>
                <span className="logo-item"><span className="gl">in</span>LinkedIn</span>
                <span className="logo-item"><span className="gl">◆</span>Crunchbase</span>
                <span className="logo-item"><span className="gl">⬡</span>Apollo</span>
                <span className="logo-item"><span className="gl">★</span>G2</span>
                <span className="logo-item"><span className="gl">⚡</span>Webhooks</span>
                <span className="logo-item sub">all integrations native · no glue code →</span>
                <span className="logo-item"><span className="gl">◢</span>Salesforce</span>
                <span className="logo-item"><span className="gl">✳</span>HubSpot</span>
                <span className="logo-item"><span className="gl">▣</span>Slack</span>
                <span className="logo-item"><span className="gl">✉</span>Gmail</span>
                <span className="logo-item"><span className="gl">▤</span>Outlook</span>
                <span className="logo-item"><span className="gl">in</span>LinkedIn</span>
                <span className="logo-item"><span className="gl">◆</span>Crunchbase</span>
                <span className="logo-item"><span className="gl">⬡</span>Apollo</span>
                <span className="logo-item"><span className="gl">★</span>G2</span>
                <span className="logo-item"><span className="gl">⚡</span>Webhooks</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · OUTCOMES ===================== */}
        <section className="section" data-screen-label="Outcomes">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">What your GTM motion looks like<br />when <span className="acc">everything is automated.</span></h2>
              <p className="sec-sub">Teams using Outmate's workflow builder stop letting GTM ideas die in Notion docs — and start running them as live, automated plays within minutes.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="wf-metrics">
              <div className="wf-metric">
                <div className="wm-n">Minutes<br /><span style={{ fontSize: '.38em', opacity: .45, letterSpacing: 0, fontWeight: 700 }}>not days</span></div>
                <div className="wm-l">from GTM workflow idea to live, deployed automation — no engineering support</div>
              </div>
              <div className="wf-metric">
                <div className="wm-n">80%</div>
                <div className="wm-l">of intent signals previously unacted on — now caught and actioned automatically</div>
              </div>
              <div className="wf-metric">
                <div className="wm-n">6+</div>
                <div className="wm-l">tools replaced — no Zapier, no Clay, no n8n, no separate enrichment setup</div>
              </div>
              <div className="wf-metric">
                <div className="wm-n">100%</div>
                <div className="wm-l">audit trail — every action logged, every outcome measured, every failure explained</div>
              </div>
            </div>
            <div className="ba">
              <div className="ba-col before">
                <h4>Before Outmate</h4>
                <ul>
                  <li><span className="mk">✕</span>GTM workflows live in Notion docs and someone's head</li>
                  <li><span className="mk">✕</span>Zapier zaps break silently, nobody knows</li>
                  <li><span className="mk">✕</span>Every new automation needs a developer</li>
                  <li><span className="mk">✕</span>Signals go unacted on because no workflow catches them</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>With Outmate</h4>
                <ul>
                  <li><span className="mk">✳</span>Any workflow built on a visual canvas in minutes</li>
                  <li><span className="mk">✳</span>Every workflow tested on one contact before deployment</li>
                  <li><span className="mk">✳</span>Co-Pilot builds workflows from plain English descriptions</li>
                  <li><span className="mk">✳</span>Every signal caught, every action fired, every outcome logged</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 9 · PROOF ===================== */}
        <section className="section" data-screen-label="Proof">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[06]</span><span className="kicker">Proof</span></div>
              <h2 className="sec-title">Built for teams that think<br />in <span className="acc">workflows.</span></h2>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="quotes">
              <div className="quote">
                <div className="qm">"</div>
                <p>I described our outbound playbook in plain English, Co-Pilot built the canvas, I hit deploy. That's it. What took us three weeks in Zapier took 20 minutes.</p>
                <div className="who"><div className="nm">Head of RevOps</div><div className="ro">Series B SaaS</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>Test mode is the thing nobody else has. I can run the whole workflow on one contact and see every step before it goes to our full list. Game-changer.</p>
                <div className="who"><div className="nm">VP of Marketing</div><div className="ro">Enterprise Tech</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>We replaced Zapier, Clay, and half our manual RevOps process in one week. The visual canvas is so much cleaner — you can see the whole play at once.</p>
                <div className="who"><div className="nm">CRO</div><div className="ro">B2B Fintech</div></div>
              </div>
            </div>
            <div className="proof-foot">Customer names &amp; logos available on request.</div>
          </div>
        </section>

        {/* ===================== 10 · SECURITY ===================== */}
        <section className="section" data-screen-label="Security">
          <div className="card-dark wf-glow-dark pad-xl reveal">
            <div className="sec-security">
              <div>
                <div className="sec-head"><span className="num">[07]</span><span className="kicker">Security &amp; compliance</span></div>
                <h2 className="sec-title">Enterprise-grade trust,<br />baked in from <span className="acc">day one.</span></h2>
                <p className="sec-sub" style={{ color: '#9c9ca3', marginTop: 20 }}>Every workflow runs on infrastructure enterprise security teams trust. Full audit trail. Role-based access. Data stays yours.</p>
              </div>
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
              <div className="sec-head"><span className="num">[08]</span><span className="kicker">FAQ</span></div>
              <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item" open>
                <summary><span className="q">How is this different from Zapier or n8n?</span><span className="tog">+</span></summary>
                <div className="a"><p>Zapier and n8n connect generic apps. Outmate's workflow builder is built specifically for GTM — every node understands signals, contacts, ICP scores, enrichment, and outreach. Pre-built Agent Army templates are ready to deploy in minutes. And Co-Pilot can generate an entire workflow from a plain English description — <span className="acc">no trigger-action mapping required.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Do I need to know how to code?</span><span className="tog">+</span></summary>
                <div className="a"><p>No. The canvas is fully drag-and-drop. Every node has a plain English label and a simple configuration panel. For teams that want even less setup, Co-Pilot generates the entire workflow from a description. The only optional code is if you want to connect a custom webhook or API endpoint — <span className="acc">and even that is a single text field.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">What happens when a workflow breaks in production?</span><span className="tog">+</span></summary>
                <div className="a"><p>Debug mode queries the execution log for the failed run and returns a plain English explanation — which step broke, what data it received, what it expected, and what to fix. Every workflow also has version history — <span className="acc">roll back to any previous version in one click</span> while you fix the issue.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Can I build completely custom logic beyond the templates?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. The canvas supports if/else branches, multi-split A/B/C logic, delays, loops, filters, and wait-for-condition nodes. You can call any of the 52 Outmate agents as a step, connect any external webhook or API, and chain as many actions as needed. <span className="acc">The templates are a starting point — the canvas has no limits.</span></p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 12 · FINAL CTA ===================== */}
        <section className="section" id="start" data-screen-label="Final CTA">
          <div className="final-cta reveal">
            <span className="fc-ast">✳</span>
            <h2>Put your entire GTM<br />on autopilot.</h2>
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
            <span className="idx">[00–08]</span>
            <div className="foot-col">
              <h5>Build</h5>
              <ul>
                <li>Visual Workflow Canvas</li>
                <li>Co-Pilot Build Mode</li>
                <li>6 Node Types</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Test &amp; Deploy</h5>
              <ul>
                <li>Test Mode</li>
                <li>Execution Logs</li>
                <li>24/7 Monitoring</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Templates</h5>
              <ul>
                <li>Agent Army Plays</li>
                <li>52 AI Agents</li>
                <li>Custom Webhooks</li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <div className="contact-main">
              <h2>CONTACT</h2>
              <p className="contact-tag">
                <span className="dim">YOUR GTM PLAYS DESERVE TO RUN THEMSELVES.</span> <span className="ast">✳</span>
                LET'S SHOW YOU WHAT THAT LOOKS LIKE.
              </p>
              <div className="btns">
                <Link to="/book-demo" className="btn solid">BOOK A DEMO →</Link>
                <a href="#" className="btn">EMAIL →</a>
                <a href="#" className="btn">LINKEDIN →</a>
                <a href="#" className="btn">TWITTER →</a>
              </div>
            </div>
            <div className="contact-side">
              <div className="portrait">
                <span className="ph">[ DROP YOUR<br />PRODUCT SHOT<br />/ TEAM PHOTO ]</span>
              </div>
              <span className="small">2026 — Outmate. Built to automate every GTM play.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
