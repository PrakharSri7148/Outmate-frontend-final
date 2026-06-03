import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './sales-team.css';

export default function SalesTeam() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — Sales Teams';
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

    /* ---------- Deep Dive role tabs (.dd-tab) ---------- */
    const ddTabs = Array.from(root.querySelectorAll<HTMLElement>('.dd-tab'));
    const ddPanes = Array.from(root.querySelectorAll<HTMLElement>('.dd-pane'));
    if (ddTabs.length) {
      const selectDd = (dd: string) => {
        ddTabs.forEach((t) => t.setAttribute('aria-selected', t.getAttribute('data-dd') === dd ? 'true' : 'false'));
        ddPanes.forEach((p) => p.classList.toggle('on', p.getAttribute('data-dd') === dd));
      };
      ddTabs.forEach((t) => {
        const onClick = () => selectDd(t.getAttribute('data-dd') || '');
        t.addEventListener('click', onClick);
        cleanups.push(() => t.removeEventListener('click', onClick));
      });
    }

    /* ---------- giant CLOSE headline: scroll-driven horizontal drift ----------
       (matches the REVEAL headline on the other use-case pages) */
    const strip = root.querySelector('.bighead .strip') as HTMLElement | null;
    const track = root.querySelector('#bigtrack') as HTMLElement | null;
    let raf: number | null = null;
    const update = () => {
      if (!track || !strip) return;
      raf = null;
      const rect = strip.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // progress: 0 when strip enters bottom, 1 when it leaves top
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

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <div className="sales-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO (dark) ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">OUTMATE</span><span className="mark">✳</span><span className="ghost">SALES</span></h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ FOR SALES TEAMS</span>
                <span className="comp">SOC 2 · GDPR · CCPA</span>
              </div>
              <h2 className="lp-headline reveal">
                Give your sales team a pipeline they <span className="dim">didn't have to build.</span>
              </h2>
              <p className="lp-sub reveal">Warm leads scored against your ICP. Emails drafted. CRM updated. A daily action list waiting at 8am. Your reps walk in and start closing — not searching, writing, or logging.</p>
              <div className="cta-row reveal">
                <Link to="/book-demo" className="btn solid">START FREE →</Link>
                <a href="#how" className="btn">SEE IT IN ACTION</a>
              </div>
              <span className="micro reveal">Built for AEs, SDRs, and sales managers · Works inside your existing CRM · 5-minute setup</span>
              <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / daily co-pilot</span>
              <span className="corner bl">ae view · 08:00 am</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="mock reveal">
                <div className="mock-bar">
                  <span>outmate_co-pilot · ae@yourco.com</span>
                  <span className="live"><span className="dot"></span>08:00 · 5 ACTIONS</span>
                </div>
                <div className="brief-hdr">
                  <span className="bh-date">MON 03 JUNE 2026</span>
                  <span className="bh-title">GOOD MORNING — YOUR PIPELINE IS READY.</span>
                </div>
                <div className="feed">
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">✳ Northwind Robotics</div>
                      <div className="feed-meta">HIT PRICING 3× OVERNIGHT · DRAFT EMAIL READY</div>
                    </div>
                    <div className="score hot"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">↩ Marcus Reed — Reply</div>
                      <div className="feed-meta">VANTA LOGISTICS · MEETING REQUEST</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '87%' }}></i></span><b>87</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">◷ Halcyon Health · 10:00 AM</div>
                      <div className="feed-meta">PRE-CALL BRIEF IN SLACK · READY</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">⚠ Atlas Freight — At risk</div>
                      <div className="feed-meta">12 DAYS DARK · RE-ENGAGEMENT ANGLE READY</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '44%' }}></i></span><b>44</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">✦ 3 new ICP matches overnight</div>
                      <div className="feed-meta">SERIES B SIGNAL · APEX, ZEPHYR, CASCADE</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '80%' }}></i></span><b>new</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2 · THE PROBLEM ===================== */}
        <section className="section" data-screen-label="Problem">
          <div className="card-dark reveal">
            <div className="prob-grid">
              <div>
                <div className="sec-head"><span className="num">[01]</span><span className="kicker">The problem</span></div>
                <h2 className="sec-title">Pipeline is leaking where the <span className="acc">work is happening</span> — not where the deals are.</h2>
              </div>
              <div className="prob-body">
                <p>Mornings start with manual prospecting. Pre-call prep happens 90 seconds before the dial. Pipeline reviews are half "what's happening on this deal" and half "why isn't this in HubSpot." Every quarter, headcount goes up to make up for the productivity lost to the tools that were supposed to fix this.</p>
                <p>This isn't a coverage problem. It's a time problem. The work AI should be doing is still on humans — and the work that actually moves revenue keeps slipping to tomorrow.</p>
              </div>
            </div>
            <div className="prob-stats">
              <div className="prob-stat">
                <div className="n">70%</div>
                <div className="l">of an average sales team's day spent on non-selling work</div>
              </div>
              <div className="prob-stat">
                <div className="n">4+ hrs</div>
                <div className="l">per week lost per rep to manual CRM updates alone</div>
              </div>
              <div className="prob-stat">
                <div className="n">30%</div>
                <div className="l">of forecasted pipeline has missing or stale data in any given CRM</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">CLOSE</span><span className="mark">✳</span><span className="g1">CLOSE</span><span className="mark">✳</span><span className="g2">CLOSE</span><span className="mark">✳</span><span className="g0">CLOSE</span><span className="mark">✳</span>
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-intro reveal">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <h2>THE WORKFLOW THAT FINALLY LETS YOUR TEAM SELL.</h2>
              <p>Outmate runs the busywork in the background. Your team shows up to a pipeline that's already moving.</p>
            </div>

            <div className="steps sales-steps">

              <div className="step reveal" data-screen-label="Step / Morning">
                <div className="sn">
                  <span className="step-badge">✳ MORNING</span>
                  <b>01</b>
                </div>
                <div className="ico">▤</div>
                <h3>A pre-built action list. <span className="acc">Waiting at 8am.</span></h3>
                <p>Every rep opens Outmate to a prioritised brief — hot visitors who hit the site overnight, replies that need a human touch, meetings happening today with prep already done, deals at risk, and accounts that just hit a buying signal. No "where do I start?" — the list is already there.</p>
                <div className="smock">
                  <div className="smock-bar"><span>daily_brief · 08:00</span><span className="s-live">5 ACTIONS</span></div>
                  <div className="smock-row"><span className="sr-hot">✳ Northwind Robotics</span><span className="sr-tag">ICP 92 · DRAFT READY</span></div>
                  <div className="smock-row"><span>↩ Marcus Reed reply</span><span className="sr-tag">NEEDS RESPONSE</span></div>
                  <div className="smock-row"><span>◷ Halcyon 10am</span><span className="sr-tag">BRIEF READY</span></div>
                  <div className="smock-row"><span className="sr-warn">⚠ Atlas Freight</span><span className="sr-tag">12 DAYS DARK</span></div>
                </div>
                <div className="cap"><span className="d"></span>Daily Co-Pilot brief · Auto-generated from live signals</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Midday">
                <div className="sn">
                  <span className="step-badge">✳ MIDDAY</span>
                  <b>02</b>
                </div>
                <div className="ico">▣</div>
                <h3>Calls, emails, conversations — <span className="acc">fully loaded.</span></h3>
                <p>30 minutes before every meeting, reps get a pre-call brief in Slack with company news, CRM history, likely objections, and recommended talking points. Every email sends from their own Gmail, drafted with the exact signals that triggered it. Every action gets logged to CRM automatically.</p>
                <div className="s-slack">
                  <div className="sl-av">▣</div>
                  <div className="sl-bd">
                    <b>#pre-call-briefs</b> — <span className="acc">Halcyon Health</span> meeting in 30min. <b>Priya Nair, RevOps Mgr.</b> Pricing 3× this week. Likely objection: timeline.
                    <div className="sl-meta">OUTMATE BOT · 09:30 · TALKING POINTS READY</div>
                  </div>
                </div>
                <div className="cap"><span className="d"></span>Auto meeting prep · One-click outreach · Zero CRM data entry</div>
              </div>

              <div className="step reveal" data-screen-label="Step / End of Day">
                <div className="sn">
                  <span className="step-badge">✳ END OF DAY</span>
                  <b>03</b>
                </div>
                <div className="ico">▦</div>
                <h3>CRM updated. Pipeline accurate. <span className="acc">Tomorrow's list already building.</span></h3>
                <p>Every email, call, and signal from the day is logged. Stale deals are flagged with re-engagement angles. New signals from the night start queuing for tomorrow's brief. Your reps log off — Outmate keeps working.</p>
                <div className="scrm">
                  <div className="scrm-bar"><span>hubspot_sync · auto-logged</span><span className="s-sync">✓ SYNCED</span></div>
                  <div className="scrm-row"><span className="sr-label">Last activity</span><span className="sr-val">Email sent · 2:34pm</span><span className="sr-badge">AUTO</span></div>
                  <div className="scrm-row"><span className="sr-label">Deal stage</span><span className="sr-acc">Demo Scheduled</span><span className="sr-badge">UPDATED</span></div>
                  <div className="scrm-row"><span className="sr-label">Next action</span><span className="sr-val">Follow-up · queued</span><span className="sr-badge">AUTO</span></div>
                  <div className="scrm-row"><span className="sr-label">Risk flag</span><span className="sr-warn">Atlas Freight · 12d dark</span></div>
                </div>
                <div className="cap"><span className="d"></span>CRM auto-fill · Pipeline risk flagging · Continuous signal monitoring</div>
              </div>

            </div>
          </div>

          <div className="how-highlight reveal">
            Your reps spend their day selling. <span className="acc">Outmate spends it making them faster.</span>
            <span className="chip">Fully autonomous · Zero logging</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">Less ops.<br /><span className="acc">More closing.</span></h2>
              <p className="sec-sub">Every feature designed around one question — "does this make the next call easier?"</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0"><span className="kn">01</span><span className="kt">Daily Co-Pilot brief</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1"><span className="kn">02</span><span className="kt">Auto meeting prep</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2"><span className="kn">03</span><span className="kt">CRM that fills itself</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3"><span className="kn">04</span><span className="kt">One pipeline, one truth</span><span className="ka">→</span></button>
              </div>
              <div className="kx-stage">
                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Daily brief</span>
                  <h3>Daily Co-Pilot brief</h3>
                  <p>Every rep starts the day with a prioritised action list — hot visitors, replies to handle, meetings to prep for, deals at risk. Auto-generated at 8am from live signals. Zero clicks to get started.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>daily_brief · 08:00</span><span className="live"><span className="dot"></span>5 ACTIONS TODAY</span></div>
                      <div className="feed">
                        <div className="feed-row"><div><div className="feed-co">✳ Northwind Robotics</div><div className="feed-meta">PRICING 3× OVERNIGHT · DRAFT READY</div></div><div className="score hot"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">↩ Marcus Reed — Reply</div><div className="feed-meta">VANTA LOGISTICS · MEETING REQUEST</div></div><div className="score"><span className="bar"><i style={{ width: '87%' }}></i></span><b>87</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">◷ Halcyon Health · 10:00 AM</div><div className="feed-meta">PRE-CALL BRIEF IN SLACK · READY</div></div><div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ Meeting prep</span>
                  <h3>Auto meeting prep</h3>
                  <p>30 minutes before every meeting, a pre-call brief lands in Slack — company news, CRM history, likely objections, talking points. No more 2-minute Google searches before the dial.</p>
                  <div className="kx-vis">
                    <div className="slack-toast">
                      <div className="av">▣</div>
                      <div className="st-body">
                        <b>#pre-call-briefs</b> — <span className="acc">Halcyon Health</span> meeting in 30min. <b>Priya Nair, RevOps Manager.</b> Visited pricing 3× this week. Likely objection: implementation timeline.
                        <div className="st-meta">OUTMATE BOT · 09:30 · TALKING POINTS ATTACHED</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ CRM auto-fill</span>
                  <h3>CRM that fills itself</h3>
                  <p>Every email, call, signal, and reply auto-logged to HubSpot or Salesforce. Deal stages update on their own. Stale deals get flagged. Your reps never type into a CRM again.</p>
                  <div className="kx-vis">
                    <div className="kcontact">
                      <div className="top">
                        <span className="av">HB</span>
                        <span><span className="nm">HubSpot — Auto Sync</span><div className="rl">All activity logged · Zero data entry</div></span>
                      </div>
                      <div className="kfields">
                        <div className="kfield"><span className="l">LAST TOUCH</span><span className="acc">Email sent · 2:34pm · Auto-logged</span></div>
                        <div className="kfield"><span className="l">DEAL STAGE</span><span>Demo Scheduled — auto-updated</span></div>
                        <div className="kfield"><span className="l">RISK FLAG</span><span style={{ color: '#f97316' }}>Atlas Freight · 12 days dark</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Pipeline clarity</span>
                  <h3>One pipeline, one truth</h3>
                  <p>All the data, signals, and outreach in one place — across the whole team. Managers see what's actually happening. Reps see what's coming next. No more "let me check my dashboard."</p>
                  <div className="kx-vis kgauge">
                    <div className="g-top">
                      <span className="g-num">100%</span>
                      <span className="g-lbl">CRM hygiene<br />Every deal current</span>
                    </div>
                    <div className="kbar"><i style={{ width: '100%' }}></i></div>
                    <div className="kticks"><span>0%</span><span>STALE DATA</span><span>50%</span><span>FULL HYGIENE</span><span>100%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== AGENTS (dark) ===================== */}
        <section className="section" data-screen-label="Agents">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">Under the hood</span></div>
              <h2 className="sec-title">The agents doing the work<br />your reps <span className="acc">used to.</span></h2>
              <p className="sec-sub">Each agent owns one job. Together they run the busywork your team never sees — so the brief, the prep, and the CRM just happen.</p>
              <div style={{ height: 'clamp(24px,2.8vw,40px)' }}></div>
            </div>
            <div className="agents-grid">
              <div className="agent-card">
                <div className="a-top"><span className="a-ico">◎</span><span className="a-idx">01</span></div>
                <span className="a-name">ICP Scorer</span>
                <span className="a-desc">Scores every visitor, reply, and signal against your ideal profile — so the brief surfaces the accounts worth a rep's time first.</span>
              </div>
              <div className="agent-card">
                <div className="a-top"><span className="a-ico">▤</span><span className="a-idx">02</span></div>
                <span className="a-name">Brief Builder</span>
                <span className="a-desc">Assembles the 8am action list from overnight signals — hot visitors, waiting replies, today's meetings, and deals going dark.</span>
              </div>
              <div className="agent-card">
                <div className="a-top"><span className="a-ico">▣</span><span className="a-idx">03</span></div>
                <span className="a-name">Meeting Prepper</span>
                <span className="a-desc">Writes the pre-call brief 30 minutes out — company news, CRM history, likely objections, and recommended talking points, in Slack.</span>
              </div>
              <div className="agent-card">
                <div className="a-top"><span className="a-ico">✉</span><span className="a-idx">04</span></div>
                <span className="a-name">Email Drafter</span>
                <span className="a-desc">Drafts outreach from the rep's own Gmail, using the exact signal that triggered it. One click to send, never a blank page.</span>
              </div>
              <div className="agent-card">
                <div className="a-top"><span className="a-ico">▦</span><span className="a-idx">05</span></div>
                <span className="a-name">CRM Logger</span>
                <span className="a-desc">Logs every email, call, and reply to HubSpot or Salesforce, and moves deal stages on their own. Reps never type into a CRM again.</span>
              </div>
              <div className="agent-card">
                <div className="a-top"><span className="a-ico">⚠</span><span className="a-idx">06</span></div>
                <span className="a-name">Risk Watcher</span>
                <span className="a-desc">Flags deals going stale before the forecast call, with a re-engagement angle attached — so nothing slips through quietly.</span>
              </div>
            </div>
            <div className="agents-note"><span className="acc">✳</span> Every agent logs its work — full audit trail, and you can pause any one with a single toggle.</div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE (dark) ===================== */}
        <section className="section" data-screen-label="Deep Dive">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[04]</span><span className="kicker">In-context surfaces</span></div>
              <h2 className="sec-title">The work shows up where<br />your reps <span className="acc">already are.</span></h2>
              <p className="sec-sub">A daily 8am brief, a Slack pre-call card, and a CRM panel that fills itself — surfaced by role, so every rep sees exactly what's next.</p>
            </div>

            <div className="dd-tabs" role="tablist">
              <button className="dd-tab" role="tab" aria-selected="true" data-dd="ae">AE VIEW</button>
              <button className="dd-tab" role="tab" aria-selected="false" data-dd="sdr">SDR VIEW</button>
              <button className="dd-tab" role="tab" aria-selected="false" data-dd="mgr">MANAGER VIEW</button>
            </div>

            <div className="dd-pane on" data-dd="ae">
              <div className="dd-left">
                <span className="dd-role">✳ Account Executive</span>
                <h3 className="dd-title">Start the day knowing exactly what to do.</h3>
                <p className="dd-body">The 8am brief surfaces the accounts that matter most — who visited overnight, what replies are waiting, which meetings need prep. Then 30 minutes before every call, a Slack card with full context. Zero research.</p>
              </div>
              <div className="dd-right">
                <div className="mock">
                  <div className="mock-bar"><span>daily_brief_ae · 08:00</span><span className="live"><span className="dot"></span>READY</span></div>
                  <div className="brief-hdr">
                    <span className="bh-date">MON 03 JUNE 2026</span>
                    <span className="bh-title">GOOD MORNING — YOUR PIPELINE IS READY.</span>
                  </div>
                  <div className="feed">
                    <div className="feed-row"><div><div className="feed-co">✳ Northwind Robotics</div><div className="feed-meta">PRICING 3× · ICP 92 · EMAIL READY</div></div><div className="score hot"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div></div>
                    <div className="feed-row"><div><div className="feed-co">◷ Halcyon Health · 10:00 AM</div><div className="feed-meta">PRE-CALL BRIEF IN SLACK · READY</div></div><div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div></div>
                  </div>
                </div>
                <div className="slack-toast" style={{ margin: 0 }}>
                  <div className="av">▣</div>
                  <div className="st-body">
                    <b>#pre-call-briefs</b> — <span className="acc">Halcyon Health</span> in 30min. <b>Priya Nair</b> — pricing 3×, likely objection: timeline.
                    <div className="st-meta">OUTMATE BOT · 09:30 · TALKING POINTS READY</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dd-pane" data-dd="sdr">
              <div className="dd-left">
                <span className="dd-role">✳ Sales Development Rep</span>
                <h3 className="dd-title">A full outreach queue. Drafted and prioritised.</h3>
                <p className="dd-body">Every morning, the brief lists the accounts that hit buying signals overnight — site visits, funding events, job changes. Outreach emails drafted with the exact context that triggered them. Send in one click.</p>
              </div>
              <div className="dd-right">
                <div className="mock">
                  <div className="mock-bar"><span>outreach_queue · sdr@yourco.com</span><span className="live"><span className="dot"></span>8 DRAFTED</span></div>
                  <div className="feed">
                    <div className="feed-row"><div><div className="feed-co">Apex Systems — Series B raised</div><div className="feed-meta">EMAIL DRAFTED · SEND READY · ICP 88</div></div><div className="score hot"><span className="bar"><i style={{ width: '88%' }}></i></span><b>88</b></div></div>
                    <div className="feed-row"><div><div className="feed-co">Zephyr Logistics — Visited pricing</div><div className="feed-meta">EMAIL DRAFTED · PERSONALIZED</div></div><div className="score"><span className="bar"><i style={{ width: '76%' }}></i></span><b>76</b></div></div>
                    <div className="feed-row"><div><div className="feed-co">Cascade Health — Hired new CRO</div><div className="feed-meta">EMAIL DRAFTED · CHAMPION SIGNAL</div></div><div className="score"><span className="bar"><i style={{ width: '65%' }}></i></span><b>65</b></div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dd-pane" data-dd="mgr">
              <div className="dd-left">
                <span className="dd-role">✳ Sales Manager</span>
                <h3 className="dd-title">Pipeline you can actually trust.</h3>
                <p className="dd-body">Every deal updated automatically. Stale accounts flagged before the forecast call. No more chasing reps for CRM hygiene — the data is always current. Spend your time coaching, not auditing.</p>
              </div>
              <div className="dd-right">
                <div className="mock">
                  <div className="mock-bar"><span>pipeline_view · manager@yourco.com</span><span className="live"><span className="dot"></span>LIVE</span></div>
                  <div className="feed">
                    <div className="feed-row"><div><div className="feed-co">Team activity today</div><div className="feed-meta">12 EMAILS · 3 MEETINGS · 2 DEMOS</div></div><div className="score hot"><span className="bar"><i style={{ width: '100%' }}></i></span><b>100%</b></div></div>
                    <div className="feed-row"><div><div className="feed-co">Pipeline hygiene</div><div className="feed-meta">ALL DEALS UPDATED · 1 RISK FLAG</div></div><div className="score"><span className="bar"><i style={{ width: '96%' }}></i></span><b>96%</b></div></div>
                    <div className="feed-row"><div><div className="feed-co">⚠ Atlas Freight — Risk</div><div className="feed-meta">12 DAYS DARK · RE-ENGAGEMENT QUEUED</div></div><div className="score"><span className="bar"><i style={{ width: '44%' }}></i></span><b>risk</b></div></div>
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
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">Integrations</span></div>
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
                <div className="int-cat-lbl">Email</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">✉</span>Gmail</span>
                  <span className="int-pill"><span className="gl">▤</span>Outlook</span>
                </div>
              </div>
              <div className="int-cat">
                <div className="int-cat-lbl">Messaging</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">▣</span>Slack</span>
                  <span className="int-pill"><span className="gl">in</span>LinkedIn</span>
                </div>
              </div>
              <div className="int-cat">
                <div className="int-cat-lbl">Outreach &amp; Data</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">⬡</span>Apollo</span>
                  <span className="int-pill"><span className="gl">◑</span>Intercom</span>
                  <span className="int-pill"><span className="gl">⚡</span>Zapier</span>
                  <span className="int-pill"><span className="gl">◆</span>Lemlist</span>
                  <span className="int-pill"><span className="gl">▥</span>Analytics</span>
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
                <span className="logo-item"><span className="gl">▦</span>Pipedrive</span>
                <span className="logo-item"><span className="gl">⬡</span>Apollo</span>
                <span className="logo-item"><span className="gl">◑</span>Intercom</span>
                <span className="logo-item"><span className="gl">⚡</span>Zapier</span>
                <span className="logo-item sub">all integrations native · no glue code →</span>
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
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · OUTCOMES ===================== */}
        <section className="section" data-screen-label="Outcomes">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[06]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">What your sales team looks like<br /><span className="acc">with Outmate running.</span></h2>
              <p className="sec-sub">Teams using Outmate stop measuring activity and start measuring outcomes — because every part of the workflow that used to be activity is now automated.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="sales-metrics">
              <div className="sales-metric">
                <div className="sm-n">70%<br /><span style={{ fontSize: '.45em', letterSpacing: '-.02em', opacity: .5 }}>→ 30%</span></div>
                <div className="sm-l">the shift in non-selling time per rep, automated away by Outmate</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">3–5×</div>
                <div className="sm-l">more meetings booked per rep, from the same effort</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">100%</div>
                <div className="sm-l">CRM hygiene — every email, call, and signal auto-logged</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">½</div>
                <div className="sm-l">the ramp time — new reps onboard faster because the playbook is built in</div>
              </div>
            </div>
            <div className="ba">
              <div className="ba-col before">
                <h4>Before Outmate</h4>
                <ul>
                  <li><span className="mk">✕</span>Reps spend their mornings prospecting, not selling</li>
                  <li><span className="mk">✕</span>Meeting prep happens in panic mode</li>
                  <li><span className="mk">✕</span>Pipeline reviews are half-data, half-guesswork</li>
                  <li><span className="mk">✕</span>Manager spends hours chasing reps for CRM updates</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>With Outmate</h4>
                <ul>
                  <li><span className="mk">✓</span>Reps open the app to a pre-built action list at 8am</li>
                  <li><span className="mk">✓</span>Every meeting starts with a full pre-call brief</li>
                  <li><span className="mk">✓</span>Pipeline is accurate because data updates automatically</li>
                  <li><span className="mk">✓</span>Manager spends time coaching, not auditing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== WHY TEAMS SWITCH (comparison) ===================== */}
        <section className="section" data-screen-label="Comparison">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[07]</span><span className="kicker">Why teams switch</span></div>
              <h2 className="sec-title">One platform instead of<br /><span className="acc">five open tabs.</span></h2>
              <p className="sec-sub">Most teams duct-tape a prospecting tool, a CRM, an AI writer, and a pile of manual work. Here's what that costs — and what replaces it.</p>
              <div style={{ height: 'clamp(26px,3vw,44px)' }}></div>
            </div>
            <div className="cmp">
              <div className="cmp-row cmp-head">
                <div className="cmp-cell"><span className="cmp-h-old" style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'var(--sans)', letterSpacing: '-.01em', fontSize: 'clamp(14px,1.3vw,17px)', textTransform: 'none' }}>The job to be done</span></div>
                <div className="cmp-cell"><span className="cmp-h-old">The duct-taped stack</span></div>
                <div className="cmp-cell cmp-col-new"><span className="cmp-h-new"><span className="ast">✳</span>With Outmate</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-cell"><span className="cmp-cap">Morning prospecting</span></div>
                <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Reps build their own list across Apollo, LinkedIn &amp; tabs</span></div>
                <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>A prioritised action list waiting at 8am</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-cell"><span className="cmp-cap">Meeting prep</span></div>
                <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>90-second Google search before the dial</span></div>
                <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>A Slack pre-call brief 30 minutes out</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-cell"><span className="cmp-cap">Outreach writing</span></div>
                <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Copy-paste between ChatGPT and the inbox</span></div>
                <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>Drafted from the rep's Gmail, one click to send</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-cell"><span className="cmp-cap">CRM updates</span></div>
                <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>4+ hours a week of manual data entry</span></div>
                <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>Auto-logged — reps never type into a CRM</span></div>
              </div>
              <div className="cmp-row">
                <div className="cmp-cell"><span className="cmp-cap">Pipeline visibility</span></div>
                <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Reviews half-data, half-guesswork</span></div>
                <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>One source of truth, always current</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 9 · PROOF ===================== */}
        <section className="section" data-screen-label="Proof">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[08]</span><span className="kicker">Proof</span></div>
              <h2 className="sec-title">Built for teams that<br />live in the <span className="acc">pipeline.</span></h2>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="quotes">
              <div className="quote">
                <div className="qm">"</div>
                <p>Reps walk in and their list is already there. No "where do I start." First week, daily active usage was above 80%.</p>
                <div className="who"><div className="nm">VP of Sales</div><div className="ro">B2B SaaS</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>I stopped auditing CRM and started coaching. Every deal is up to date without me asking anyone to update anything.</p>
                <div className="who"><div className="nm">Sales Manager</div><div className="ro">Enterprise Tech</div></div>
              </div>
              <div className="quote">
                <div className="qm">"</div>
                <p>The pre-call brief in Slack genuinely changed how our AEs show up to meetings. They stopped Googling and started closing.</p>
                <div className="who"><div className="nm">Head of Revenue</div><div className="ro">Series B Startup</div></div>
              </div>
            </div>
            <div className="proof-foot">Customer names &amp; logos available on request.</div>
          </div>
        </section>

        {/* ===================== 10 · SECURITY ===================== */}
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

        {/* ===================== 11 · FAQ ===================== */}
        <section className="section" data-screen-label="FAQ">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(24px,3vw,40px)' }}>
              <div className="sec-head"><span className="num">[10]</span><span className="kicker">FAQ</span></div>
              <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item" open>
                <summary><span className="q">Will my reps actually adopt this?</span><span className="tog">+</span></summary>
                <div className="a"><p>Adoption is high because Outmate removes work — it doesn't add a new tool to log into. Reps get their daily brief in Slack, prep delivered before meetings, and CRM updated for them. <span className="acc">Most teams hit 80%+ daily active usage in the first week.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Does it work with the CRM we already use?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. Native, bi-directional integrations with HubSpot and Salesforce out of the box — every email, call, signal, and stage change syncs automatically. Slack, Gmail, Outlook, and LinkedIn all connect via OAuth.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How long does it take to train the team?</span><span className="tog">+</span></summary>
                <div className="a"><p>Most reps are productive in under an hour. The daily brief and meeting prep don't need training — they just show up. The outreach and CRM features feel familiar to anyone who's used Apollo or HubSpot. <span className="acc">Full onboarding is included.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Do I keep control of what gets sent?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. Sales leaders set ICP rules, message templates, and approval gates. Reps can run in review mode until you trust the system, then switch to fully autonomous when ready. <span className="acc">You stay in control of the toggle — at the rep level or the team level.</span></p></div>
              </details>
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
            <div className="hero-trust" style={{ justifyContent: 'center', color: 'rgba(255,255,255,.7)' }}><span className="stars" style={{ color: '#fff' }}>★ 4.8</span>&nbsp;ON G2 · 200+ REVIEWS</div>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="foot" id="contact" data-screen-label="Footer">
          <div className="foot-services">
            <span className="idx">[00–10]</span>
            <div className="foot-col">
              <h5>Brief</h5>
              <ul>
                <li>Daily Co-Pilot Brief</li>
                <li>Signal Prioritisation</li>
                <li>8am Action List</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Prep</h5>
              <ul>
                <li>Auto Meeting Prep</li>
                <li>Slack Pre-call Cards</li>
                <li>AI Talking Points</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Close</h5>
              <ul>
                <li>CRM Auto-fill</li>
                <li>Pipeline Risk Flagging</li>
                <li>One-click Outreach</li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <div className="contact-main">
              <h2>CONTACT</h2>
              <p className="contact-tag">
                <span className="dim">YOUR REPS DESERVE A PIPELINE THAT'S ALREADY BUILT.</span> <span className="ast">✳</span>
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
              <span className="small">2026 — Outmate. Built for sales teams that close.</span>
            </div>
          </div>
        </footer>

      </main>

    </div>
  );
}
