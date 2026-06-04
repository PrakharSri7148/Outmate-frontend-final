import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './co-pilot.css';

export default function CoPilot() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — Co-Pilot';
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

    /* ---------- Deep-Dive role tabs (.dd-tab) ---------- */
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
    <div className="copilot-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO (dark) ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">CO-PILOT</span><span className="mark">✳</span><span className="ghost">OUTMATE</span></h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ CO-PILOT</span>
                <span className="comp">SOC 2 · GDPR · CCPA</span>
              </div>
              <h2 className="lp-headline reveal">
                Stop asking "where do I start?" <span className="dim">Co-Pilot already knows.</span>
              </h2>
              <p className="lp-sub reveal">Co-Pilot reads your signals, your pipeline, your sequences, and your calendar — and delivers a prioritised action list every morning at 8am. Hot visitors, job changes, meeting prep, at-risk deals, reply approvals — all in one place, before your reps open a single tab.</p>
              <div className="cta-row reveal">
                <Link to="/book-demo" className="btn solid">START FREE →</Link>
                <a href="#how-it-works" className="btn">SEE IT IN ACTION</a>
              </div>
              <span className="micro reveal">Daily brief is always free · Zero credits consumed · Delivered via Slack + in-app · 8am in your timezone</span>
              <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / co-pilot brief</span>
              <span className="corner bl">8am · your timezone</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="mock cp-panel reveal">
                <div className="mock-bar">
                  <span className="cp-brand"><span className="cp-hex">❖</span> CO-PILOT</span>
                  <span className="live"><span className="dot"></span>ACTIVE · 08:00</span>
                </div>

                <div className="cp-voice">
                  <div className="cp-av">
                    <span className="cp-glyph">✳</span>
                    <span className="cp-ring"></span>
                  </div>
                  <div className="cp-msg">
                    <span className="cp-speaker">CO-PILOT · OUTMATE</span>
                    <p className="cp-text">Good morning. I scanned 847 signals overnight and built your list. 5 actions need you — here's what matters first.</p>
                  </div>
                </div>

                <div className="cp-actions">
                  <div className="cp-actions-hdr">
                    <span>PRIORITY ACTIONS</span>
                    <span className="cp-count">05 READY</span>
                  </div>
                  <div className="cp-item cp-hot">
                    <span className="cp-num">01</span>
                    <div className="cp-detail">
                      <span className="cp-co">Northwind Robotics</span>
                      <span className="cp-sig">HOT VISITOR · PRICING 3× · ICP 92 · DRAFT READY</span>
                    </div>
                    <span className="cp-badge">ACT</span>
                  </div>
                  <div className="cp-item">
                    <span className="cp-num">02</span>
                    <div className="cp-detail">
                      <span className="cp-co">Marcus Reed — Reply</span>
                      <span className="cp-sig">INTERESTED · MEETING REQUEST · RESPOND NOW</span>
                    </div>
                    <span className="cp-badge">REPLY</span>
                  </div>
                  <div className="cp-item">
                    <span className="cp-num">03</span>
                    <div className="cp-detail">
                      <span className="cp-co">Halcyon Health · 10:00 AM</span>
                      <span className="cp-sig">PRE-CALL BRIEF READY · 2 HRS FROM NOW</span>
                    </div>
                    <span className="cp-badge">PREP</span>
                  </div>
                  <div className="cp-item cp-warn">
                    <span className="cp-num">04</span>
                    <div className="cp-detail">
                      <span className="cp-co">Atlas Freight — At risk</span>
                      <span className="cp-sig">12 DAYS DARK · RE-ENGAGEMENT ANGLE READY</span>
                    </div>
                    <span className="cp-badge">RISK</span>
                  </div>
                </div>

                <div className="cp-ask">
                  <span className="cp-ask-icon">✳</span>
                  <span className="cp-ask-txt">Ask Co-Pilot anything<span className="cp-cursor">|</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 3 · THE PROBLEM ===================== */}
        <section className="section" data-screen-label="Problem">
          <div className="card-dark reveal">
            <div className="prob-grid">
              <div>
                <div className="sec-head"><span className="num">[01]</span><span className="kicker">The problem</span></div>
                <h2 className="sec-title">You have all the data. Nobody knows <span className="acc">what to do with it first.</span></h2>
              </div>
              <div className="prob-body">
                <p>A hot visitor hit your pricing page at 9pm. Your rep finds out at 11am. A champion moved to a new ICP company 3 days ago — the alert is sitting in a notification nobody opened. A sequence dropped to 3% open rate on Tuesday. It's Friday. Nobody noticed.</p>
                <p>The signals are firing — across visitor alerts, job changes, email opens, pipeline risks — but they're scattered across 6 tools with no priority order and no single place to act. The most important actions of the day get found last. Or not at all.</p>
              </div>
            </div>
            <div className="prob-stats">
              <div className="prob-stat">
                <div className="n">6+ tools</div>
                <div className="l">the average rep checks before knowing where to start each morning</div>
              </div>
              <div className="prob-stat">
                <div className="n">48 hrs</div>
                <div className="l">average window before a job change signal becomes irrelevant</div>
              </div>
              <div className="prob-stat">
                <div className="n">&lt; 60 min</div>
                <div className="l">the window to reach a hot visitor before intent cools</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how-it-works" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">BRIEF</span><span className="mark">✳</span><span className="g1">BRIEF</span><span className="mark">✳</span><span className="g2">BRIEF</span><span className="mark">✳</span><span className="g0">BRIEF</span><span className="mark">✳</span>
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-intro reveal">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <h2>FROM SCATTERED SIGNALS TO ONE ACTION LIST — AUTOMATICALLY.</h2>
              <p>Co-Pilot connects to every Outmate data source and delivers one clear brief — so your reps start the day knowing exactly what to do, in what order.</p>
            </div>

            <div className="steps sales-steps">

              <div className="step reveal" data-screen-label="Step / Listen">
                <div className="sn">
                  <span className="step-badge">✳ LISTEN</span>
                  <b>01</b>
                </div>
                <div className="ico">◎</div>
                <h3>Signals write to Co-Pilot's queue <span className="acc">continuously.</span></h3>
                <p>Every signal that fires — hot visitor, job change, reply classified, sequence health drop, pipeline risk, funding hit — writes to Co-Pilot's queue in real-time. Nothing requires a human to log it.</p>
                <div className="smock">
                  <div className="smock-bar"><span>signal_queue · live</span><span className="s-live">REAL-TIME</span></div>
                  <div className="smock-row"><span className="sr-hot">✳ Hot visitor · pricing 3×</span><span className="sr-tag">ICP 92</span></div>
                  <div className="smock-row"><span>↻ Reply classified · interested</span><span className="sr-tag">QUEUED</span></div>
                  <div className="smock-row"><span>↑ Champion job change</span><span className="sr-tag">NEW ICP CO.</span></div>
                  <div className="smock-row"><span className="sr-warn">⚠ Sequence health drop</span><span className="sr-tag">3% OPENS</span></div>
                </div>
                <div className="cap"><span className="d"></span>Visitor alerts · Job changes · Reply classifications · Sequence health · Pipeline risks</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Synthesise">
                <div className="sn">
                  <span className="step-badge">✳ SYNTHESISE</span>
                  <b>02</b>
                </div>
                <div className="ico">✦</div>
                <h3>At 8am, Co-Pilot <span className="acc">builds the brief.</span></h3>
                <p>Every morning at 8am in your timezone, Co-Pilot reads the queue and generates a prioritised action list per rep. ICP 80+ visitors, Interested replies, and champion job changes also fire an immediate Slack alert — no waiting for 8am.</p>
                <div className="scrm">
                  <div className="scrm-bar"><span>daily_brief · 08:00 generated</span><span className="s-sync">✓ PRIORITISED</span></div>
                  <div className="scrm-row"><span className="sr-label">01 · Hot visitor</span><span className="sr-acc">Northwind · ICP 92</span><span className="sr-badge">ACT</span></div>
                  <div className="scrm-row"><span className="sr-label">02 · Reply approval</span><span className="sr-val">Marcus Reed</span><span className="sr-badge">REVIEW</span></div>
                  <div className="scrm-row"><span className="sr-label">03 · Meeting prep</span><span className="sr-val">Halcyon · 10:00</span><span className="sr-badge">READY</span></div>
                  <div className="scrm-row"><span className="sr-label">04 · At-risk deal</span><span className="sr-warn">Atlas · 12d dark</span></div>
                </div>
                <div className="cap"><span className="d"></span>7 action types · Priority-ordered · Delivered via Slack + in-app</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Act">
                <div className="sn">
                  <span className="step-badge">✳ ACT</span>
                  <b>03</b>
                </div>
                <div className="ico">◆</div>
                <h3>Rep opens to a pre-built list. <span className="acc">Not a blank screen.</span></h3>
                <p>Every action has context attached — who, what signal, why now, suggested next step. One click to email, one click to CRM, or ask Outmate anything in plain English for deeper context on any account.</p>
                <div className="s-slack">
                  <div className="sl-av">✳</div>
                  <div className="sl-bd">
                    <b>Ask Outmate</b> — "<span className="acc">who should I contact today?</span>" Top priority: <b>Northwind Robotics</b>, hit pricing 3× overnight. Draft ready in your inbox.
                    <div className="sl-meta">NLP CHAT · LIVE PIPELINE + SIGNALS + CRM</div>
                  </div>
                </div>
                <div className="cap"><span className="d"></span>Zero clicks to get started · Ask Outmate NLP chat · Meeting prep auto-fires 30 min before calls</div>
              </div>

            </div>
          </div>

          <div className="how-highlight reveal">
            Signals in → prioritised action list in your rep's hands: <span className="acc">every morning at 8am. Free.</span>
            <span className="chip">Zero credits consumed · Always pre-built</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">The GTM assistant that works<br /><span className="acc">while your team sleeps.</span></h2>
              <p className="sec-sub">Co-Pilot isn't a dashboard you check. It's an assistant that comes to you.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0"><span className="kn">01</span><span className="kt">Daily brief</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1"><span className="kn">02</span><span className="kt">Auto meeting prep</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2"><span className="kn">03</span><span className="kt">Campaign optimizer</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3"><span className="kn">04</span><span className="kt">Ask Outmate</span><span className="ka">→</span></button>
              </div>
              <div className="kx-stage">
                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Daily brief</span>
                  <h3>Daily brief</h3>
                  <p>Every morning at 8am, Co-Pilot auto-generates a prioritised action list — hot visitors, job changes, reply approvals, meeting prep, sequence health drops, pipeline risks. Always pre-built. Always in priority order. Zero credits consumed. Free on every plan.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>daily_brief · 08:00</span><span className="live"><span className="dot"></span>PRE-BUILT · FREE</span></div>
                      <div className="feed">
                        <div className="feed-row"><div><div className="feed-co">✳ Northwind Robotics</div><div className="feed-meta">HOT VISITOR · PRICING 3× OVERNIGHT</div></div><div className="score hot"><span className="bar"><i style={{ width: '92%' }}></i></span><b>92</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">↑ Priya Nair — Job change</div><div className="feed-meta">CHAMPION · NEW ICP COMPANY</div></div><div className="score"><span className="bar"><i style={{ width: '84%' }}></i></span><b>84</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">↩ Marcus Reed — Reply approval</div><div className="feed-meta">INTERESTED · NEEDS A HUMAN TOUCH</div></div><div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ Meeting prep</span>
                  <h3>Auto meeting prep</h3>
                  <p>30 minutes before any calendar event, Co-Pilot detects the meeting, enriches the attendees, pulls CRM history and company news, flags 3 likely objections, and delivers a full pre-call brief to Slack. Your reps enter every call prepared — without filling a single form.</p>
                  <div className="kx-vis">
                    <div className="slack-toast">
                      <div className="av">◆</div>
                      <div className="st-body">
                        <b>#pre-call-briefs</b> — <span className="acc">Halcyon Health</span> meeting in 30min. <b>Priya Nair, RevOps Manager.</b> Visited pricing 3× this week. 3 likely objections flagged: timeline, integration, budget.
                        <div className="st-meta">CO-PILOT · 09:30 · ATTENDEES ENRICHED · NO FORM FILLED</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ Campaign optimizer</span>
                  <h3>Campaign optimizer</h3>
                  <p>When a sequence drops below 8% open rate or 2% reply rate, Co-Pilot fires a notification and pre-fills the optimizer with live performance data. No manual metric entry. Just open the notification and get rewrite suggestions — subject lines, body copy, send time — ready to deploy.</p>
                  <div className="kx-vis">
                    <div className="kcontact">
                      <div className="top">
                        <span className="av">⚠</span>
                        <span><span className="nm">Sequence health — below threshold</span><div className="rl">Optimizer pre-filled · Zero metric entry</div></span>
                      </div>
                      <div className="kfields">
                        <div className="kfield"><span className="l">OPEN RATE</span><span style={{ color: '#f97316' }}>3.1% · below 8% threshold</span></div>
                        <div className="kfield"><span className="l">SUGGESTED</span><span className="acc">New subject line · ready to deploy</span></div>
                        <div className="kfield"><span className="l">SEND TIME</span><span>Shift to 7:40am · +0.9% projected</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Ask Outmate</span>
                  <h3>Ask Outmate</h3>
                  <p>A floating NLP chat available on every page of Outmate. Ask anything — "who should I contact today?", "show me stuck deals over $10k", "prep me for my call with Rajiv at CloudBase" — and Co-Pilot queries your live pipeline, signals, and CRM to answer in seconds.</p>
                  <div className="kx-vis">
                    <div className="slack-toast">
                      <div className="av">✳</div>
                      <div className="st-body">
                        <b>You</b> — "prep me for my call with Rajiv at CloudBase"<br /><b className="acc">Outmate</b> — CloudBase visited pricing twice this week. Rajiv is new VP Eng (joined 6wk ago). Open deal: $24k, stuck 11 days. Suggested angle attached.
                        <div className="st-meta">NLP CHAT · LIVE PIPELINE + SIGNALS + CRM · ANSWERED IN 2s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE (dark) ===================== */}
        <section className="section" data-screen-label="Deep Dive">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">The 8am brief</span></div>
              <h2 className="sec-title">A prioritised action list,<br />before your reps <span className="acc">open a tab.</span></h2>
              <p className="sec-sub">One brief, surfaced by role — every signal synthesised into a priority-ordered list, with Ask Outmate one question away on every account.</p>
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
                    <div className="feed-row"><div><div className="feed-co">◆ Halcyon Health · 10:00 AM</div><div className="feed-meta">PRE-CALL BRIEF IN SLACK · READY</div></div><div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>74</b></div></div>
                  </div>
                </div>
                <div className="slack-toast" style={{ margin: 0 }}>
                  <div className="av">✳</div>
                  <div className="st-body">
                    <b>Ask Outmate</b> — "<span className="acc">who should I contact today?</span>" Start with <b>Northwind Robotics</b> — pricing 3× overnight, ICP 92. Draft's ready. Then prep for Halcyon at 10.
                    <div className="st-meta">NLP CHAT · LIVE PIPELINE + SIGNALS + CRM · ANSWERED IN 2s</div>
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
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">The metrics that move when<br /><span className="acc">Co-Pilot runs every morning.</span></h2>
              <p className="sec-sub">Teams using Co-Pilot stop losing signals to noise — and start acting on the ones that actually move revenue.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="sales-metrics">
              <div className="sales-metric">
                <div className="sm-n">8am</div>
                <div className="sm-l">every morning — a fully populated, priority-ordered action list waiting before your rep opens a single tab</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">20–35%</div>
                <div className="sm-l">improvement in call-to-opportunity conversion when reps enter every call with auto-generated prep</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">&lt; 60 min</div>
                <div className="sm-l">average time from signal fire to rep action, vs 6+ hours without Co-Pilot</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">80%+</div>
                <div className="sm-l">daily active usage — most teams hit this in the first week, because Co-Pilot removes work, not adds it</div>
              </div>
            </div>
            <div className="ba">
              <div className="ba-col before">
                <h4>Without Co-Pilot</h4>
                <ul>
                  <li><span className="mk">✕</span>Rep spends 45 minutes figuring out where to start</li>
                  <li><span className="mk">✕</span>Meeting prep happens in panic mode</li>
                  <li><span className="mk">✕</span>Sequence health drops go unnoticed for days</li>
                  <li><span className="mk">✕</span>Signals scatter across 6 tools with no priority order</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>With Co-Pilot</h4>
                <ul>
                  <li><span className="mk">✳</span>Rep opens Slack at 8am to a fully built action list</li>
                  <li><span className="mk">✳</span>Pre-call brief waiting 30 minutes before every meeting</li>
                  <li><span className="mk">✳</span>Sequence drops trigger instant notifications with rewrites ready</li>
                  <li><span className="mk">✳</span>Every signal synthesised into one place, in priority order</li>
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

        {/* ===================== 11 · FAQ ===================== */}
        <section className="section" data-screen-label="FAQ">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 'clamp(24px,3vw,40px)' }}>
              <div className="sec-head"><span className="num">[08]</span><span className="kicker">FAQ</span></div>
              <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
            </div>
            <div className="faq">
              <details className="faq-item" open>
                <summary><span className="q">Does the daily brief require any setup?</span><span className="tog">+</span></summary>
                <div className="a"><p>Minimal. Connect your Gmail or Outlook for calendar sync, your CRM for pipeline data, and your email sequencer for sequence health. Once connected, Co-Pilot starts writing your brief automatically from the next morning. <span className="acc">No workflow to build. No templates to fill. No Generate button to click.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How does Co-Pilot know about my calendar meetings?</span><span className="tog">+</span></summary>
                <div className="a"><p>Via Google Calendar OAuth. Once connected, Co-Pilot listens for any calendar event with external attendees. 30 minutes before the event fires, it runs enrichment on all attendees, pulls CRM history, pulls recent company news, flags likely objections, and delivers the brief to your Slack DM and in-app banner — automatically.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Is the daily brief just noise — or is it actually useful?</span><span className="tog">+</span></summary>
                <div className="a"><p>It's built to be signal, not noise. Only 7 action types surface in the brief — hot visitors, job changes, meeting prep, reply approvals, sequence health drops, pipeline risks, and funded companies. Every item has a direct action CTA. Items that need immediate attention fire as separate Slack alerts rather than waiting for 8am — <span className="acc">so the brief only shows what's actionable today, not everything that ever happened.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Does Co-Pilot cost extra?</span><span className="tog">+</span></summary>
                <div className="a"><p>No. The daily brief is free on every plan — it consumes zero credits. Meeting prep, campaign optimizer, and pipeline alerts are included on Activate plan and above. <span className="acc">Ask Outmate NLP chat is available on all paid plans.</span></p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 12 · FINAL CTA ===================== */}
        <section className="section" id="start" data-screen-label="Final CTA">
          <div className="final-cta reveal">
            <span className="fc-ast">✳</span>
            <h2>Start every morning<br />already ahead.</h2>
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
            <span className="idx">[00–08]</span>
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
                <span className="dim">YOUR REPS DESERVE TO START THE DAY ALREADY AHEAD.</span> <span className="ast">✳</span>
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
              <span className="small">2026 — Outmate. Your GTM Co-Pilot, every morning at 8am.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
