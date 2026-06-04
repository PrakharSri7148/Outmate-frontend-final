import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './social-agent.css';

export default function SocialAgent() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — Social Agent';
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
    <div className="sa-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">SOCIAL</span><span className="mark">✳</span><span className="ghost">AGENT</span></h1>
          </div>
          <div className="hero-grid">

            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ SOCIAL AGENT</span>
                <span className="comp">LINKEDIN · EMAIL · COORDINATED</span>
              </div>
              <h2 className="lp-headline reveal">
                Connect on LinkedIn first. <span className="dim">Your emails land 4-8% better because of it.</span>
              </h2>
              <p className="lp-sub reveal">Outmate's Social Agent sends personalised connection requests, follow-up messages, and InMails from your rep's actual LinkedIn account — coordinated with your email sequence so every touchpoint feels like a warm conversation, not a cold blast.</p>
              <div className="cta-row reveal">
                <a href="#start" className="btn solid">START FREE →</a>
                <a href="#how-it-works" className="btn">SEE IT IN ACTION</a>
              </div>
              <span className="micro reveal">Sends from your real LinkedIn account · Respects LinkedIn rate limits · Reply classification included · 1 credit per message</span>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / social agent</span>
              <span className="corner bl">linkedin · email · coordinated</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="mock reveal">
                <div className="mock-bar">
                  <span>social_agent · rep@yourco.com</span>
                  <span className="live"><span className="dot"></span>SEQUENCE ACTIVE</span>
                </div>
                <div className="seq-head">
                  <span className="sh-date">MON 03 JUNE 2026</span>
                  <span className="sh-title">MULTI-CHANNEL SEQUENCE — 4 PROSPECTS ADVANCING</span>
                </div>
                <div className="feed">
                  <div className="feed-row">
                    <div>
                      <div className="feed-co"><span className="li-icon">in</span>Sarah Chen — Stripe</div>
                      <div className="feed-meta">CONNECTION ACCEPTED · EMAIL QUEUED WARM</div>
                    </div>
                    <div className="score hot"><span className="bar"><i style={{ width: '88%' }}></i></span><b>warm</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co"><span className="li-icon">in</span>Marcus Reid — Vercel</div>
                      <div className="feed-meta">CONNECT REQUEST SENT · EMAIL ON STANDBY</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '60%' }}></i></span><b>pend</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co"><span className="li-icon">in</span>Priya Nair — Figma</div>
                      <div className="feed-meta">7-DAY TIMEOUT · INMAIL FIRED · CLASSIFIED</div>
                    </div>
                    <div className="score"><span className="bar"><i style={{ width: '74%' }}></i></span><b>inml</b></div>
                  </div>
                  <div className="feed-row">
                    <div>
                      <div className="feed-co">↗ James Okafor — Notion</div>
                      <div className="feed-meta">PROFILE VIEW DETECTED · CONNECT AUTO-FIRED</div>
                    </div>
                    <div className="score hot"><span className="bar"><i style={{ width: '95%' }}></i></span><b>hot</b></div>
                  </div>
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
                <h2 className="sec-title">Email-only outbound is a <span className="acc">one-legged stool.</span></h2>
              </div>
              <div className="prob-body">
                <p>Most teams pick one channel and commit. Email sequences run on autopilot. LinkedIn gets opened occasionally — a connection request here, a message there — manual, inconsistent, and completely disconnected from the email sequence.</p>
                <p>The result: a cold email from someone the prospect has never heard of. No LinkedIn presence. No prior connection. Just another email to ignore.</p>
                <p>The teams hitting 15-20% reply rates do it differently. They connect on LinkedIn first. Then the email lands — and it lands warm. The problem isn't LinkedIn. It's that nobody has made it easy to do this at scale, from your real account, coordinated with email, without spending 3 hours a day on it manually.</p>
              </div>
            </div>
            <div className="prob-stats">
              <div className="prob-stat">
                <div className="n">4–8%</div>
                <div className="l">increase in email reply rates when LinkedIn connection precedes the email</div>
              </div>
              <div className="prob-stat">
                <div className="n">72%</div>
                <div className="l">of B2B buyers research sellers on LinkedIn before responding to outreach</div>
              </div>
              <div className="prob-stat">
                <div className="n">3+ hrs</div>
                <div className="l">per week the average rep spends on manual LinkedIn outreach — disconnected from email</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how-it-works" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">CONNECT</span><span className="mark">✳</span>
              <span className="g1">CONNECT</span><span className="mark">✳</span>
              <span className="g2">CONNECT</span><span className="mark">✳</span>
              <span className="g0">CONNECT</span><span className="mark">✳</span>
            </div>
          </div>

          <div className="va-how-hdr">
            <div className="va-how-hdr-left">
              <span className="va-how-eyebrow">[04] How it works</span>
              <h2>A FULL MULTI-CHANNEL SEQUENCE.</h2>
            </div>
            <div className="va-how-hdr-right">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <p>Connect your LinkedIn via OAuth once. Social Agent handles the sequence — from first connection to booked meeting.</p>
            </div>
          </div>

          {/* Step 01 */}
          <div className="va-step-row reveal" data-screen-label="Step 01 / Connect">
            <div className="va-step-n">01</div>
            <div className="va-step-content">
              <span className="step-badge">✳ CONNECT</span>
              <h3>Personalised connection request. <span className="acc">From your rep's real account.</span></h3>
              <p>When a prospect enters your sequence, Social Agent sends a personalised connection request — referencing a shared connection, recent post, or company signal. Not a generic note. A reason to accept. Sent from your rep's actual LinkedIn via Unipile OAuth.</p>
              <div className="cap"><span className="d"></span>Personalised notes · Rep's real account · 50 connections/day respected</div>
            </div>
            <div className="va-step-visual">
              <div className="li-mock">
                <div className="li-mock-bar">
                  <span>linkedin_connect · rep@yourco.com</span>
                  <span className="lm-sent">✓ SENT</span>
                </div>
                <div className="li-msg">
                  <div className="li-av">JR</div>
                  <div className="li-body">
                    <div className="li-name">James R. → Sarah Chen · Stripe</div>
                    <div className="li-text">"Hi Sarah — saw your post on RevOps at Stripe last week. Thought it'd be worth connecting — working on something in the same space."</div>
                    <div className="li-foot">PERSONALISED NOTE · REP'S REAL ACCOUNT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 02 */}
          <div className="va-step-row reveal" data-screen-label="Step 02 / Message">
            <div className="va-step-n">02</div>
            <div className="va-step-content">
              <span className="step-badge">✳ MESSAGE</span>
              <h3>Connection accepted. <span className="acc">Follow-up fires in 2 days.</span></h3>
              <p>Two days after acceptance, a short follow-up message goes out — referencing the connection note and introducing the outreach context. The email sequence runs in parallel, so by the time the email lands, the prospect already recognises the name.</p>
              <div className="cap"><span className="d"></span>2-day delay · Coordinated with email · 100 messages/day respected</div>
            </div>
            <div className="va-step-visual">
              <div className="dual-mock">
                <div className="dm-row">
                  <span className="dm-lbl" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10px' }}>in</span>
                  <div className="dm-card">
                    <div className="dm-tag">LI MESSAGE · DAY +2</div>
                    <div className="dm-text">"Thanks for connecting Sarah — I'll keep it short. We help RevOps teams like yours..."</div>
                  </div>
                </div>
                <div className="dm-row">
                  <span className="dm-lbl">✉</span>
                  <div className="dm-card">
                    <div className="dm-tag">EMAIL · COORDINATED · LANDS WARM</div>
                    <div className="dm-text">"Hey Sarah, following up from LinkedIn — wanted to share how teams like yours are..."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="va-step-row reveal" data-screen-label="Step 03 / Escalate">
            <div className="va-step-n">03</div>
            <div className="va-step-content">
              <span className="step-badge">✳ ESCALATE</span>
              <h3>No connection after 7 days? <span className="acc">InMail fires automatically.</span></h3>
              <p>If the prospect hasn't accepted after 7 days, Social Agent sends a LinkedIn InMail. Every reply — on LinkedIn or email — is classified by the same Reply Handler. Right next action fires automatically. CRM updated.</p>
              <div className="cap"><span className="d"></span>InMail fallback · Reply classification included · CRM updated on every action</div>
            </div>
            <div className="va-step-visual">
              <div className="smock">
                <div className="smock-bar">
                  <span>inmail_fallback · day_7</span>
                  <span className="s-live">AUTO-FIRED</span>
                </div>
                <div className="smock-row">
                  <span className="sr-hot">⚡ InMail sent</span>
                  <span className="sr-tag">FALLBACK · DELIVERED</span>
                </div>
                <div className="smock-row">
                  <span>↩ Reply classified</span>
                  <span className="sr-tag">INTERESTED · FLAGGED</span>
                </div>
                <div className="smock-row">
                  <span>▦ CRM updated</span>
                  <span className="sr-tag">AUTO-LOGGED</span>
                </div>
              </div>
            </div>
          </div>

          <div className="va-how-foot">
            LinkedIn connect → email lands warm → reply rate 4-8% higher. <span className="acc">Every sequence.</span>
            <span className="chip">Fully automated · Your real account</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">One platform. Email and LinkedIn.<br /><span className="acc">Coordinated automatically.</span></h2>
              <p className="sec-sub">No switching tabs. No separate LinkedIn tool. No manual coordination between channels.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0">
                  <span className="kn">01</span><span className="kt">Sends from your real LinkedIn account</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1">
                  <span className="kn">02</span><span className="kt">Profile view trigger</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2">
                  <span className="kn">03</span><span className="kt">Multi-channel reply classification</span><span className="ka">→</span>
                </button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3">
                  <span className="kn">04</span><span className="kt">Built-in rate limit management</span><span className="ka">→</span>
                </button>
              </div>
              <div className="kx-stage">

                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Real account</span>
                  <h3>Sends from your real LinkedIn account</h3>
                  <p>Every connection request, message, and InMail goes out from your rep's actual LinkedIn profile via Unipile OAuth. Not a fake account. Not a managed profile. The prospect sees your rep's real name, photo, and company — the same profile they'd find if they searched manually.</p>
                  <div className="kx-vis">
                    <div className="kcontact">
                      <div className="top">
                        <span className="av" style={{ fontSize: '12px', fontFamily: 'var(--sans)', fontWeight: 700 }}>in</span>
                        <span><span className="nm">Connected via Unipile OAuth</span><div className="rl">Rep's real account · Verified identity</div></span>
                      </div>
                      <div className="kfields">
                        <div className="kfield"><span className="l">FROM</span><span className="acc">James R. · Senior AE · YourCo — Real profile</span></div>
                        <div className="kfield"><span className="l">SENDS</span><span>Connection requests · Messages · InMails</span></div>
                        <div className="kfield"><span className="l">STATUS</span><span className="acc">OAuth active · All actions authorised</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ Profile view trigger</span>
                  <h3>Profile view trigger</h3>
                  <p>When a prospect from your target account list views your rep's LinkedIn profile, Social Agent detects it and automatically fires a connection request within minutes — while the profile view is still fresh in their mind. The warmest possible opening for a LinkedIn conversation.</p>
                  <div className="kx-vis">
                    <div className="slack-toast">
                      <div className="av" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '13px' }}>in</div>
                      <div className="st-body">
                        <b>Profile view detected</b> — <span className="acc">Sarah Chen · Stripe</span> viewed James R.'s profile 4 min ago. <b>Connection request auto-fired.</b>
                        <div className="st-meta">SOCIAL AGENT · PROFILE VIEW TRIGGER · ICP MATCH · WARM OPENING</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ Reply classification</span>
                  <h3>Multi-channel reply classification</h3>
                  <p>Every LinkedIn reply is classified by the same Reply Handler used for email — interested, not now, OOO, objection, referral, unsubscribe, negative. The right next action fires automatically per classification. Your rep only sees the replies worth a human touch.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar">
                        <span>reply_handler · multi-channel</span>
                        <span className="live"><span className="dot"></span>CLASSIFYING</span>
                      </div>
                      <div className="feed">
                        <div className="feed-row">
                          <div>
                            <div className="feed-co">↩ Sarah Chen — LinkedIn</div>
                            <div className="feed-meta">INTERESTED · SEQUENCE PAUSED · REP FLAGGED</div>
                          </div>
                          <div className="score hot"><span className="bar"><i style={{ width: '95%' }}></i></span><b>hot</b></div>
                        </div>
                        <div className="feed-row">
                          <div>
                            <div className="feed-co">↩ Marcus Reid — Email</div>
                            <div className="feed-meta">NOT NOW · FOLLOW-UP QUEUED · 30 DAYS</div>
                          </div>
                          <div className="score"><span className="bar"><i style={{ width: '40%' }}></i></span><b>snz</b></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Rate limits</span>
                  <h3>Built-in rate limit management</h3>
                  <p>LinkedIn's daily limits — 50 connection requests, 100 messages — are respected automatically. No manual throttling. No account flags. No bans. Outmate queues and spaces every action to stay within safe limits while maximising daily reach.</p>
                  <div className="kx-vis kgauge">
                    <div className="g-top">
                      <span className="g-num">50</span>
                      <span className="g-lbl">Connections/day<br />Safe limit respected</span>
                    </div>
                    <div className="kbar"><i style={{ width: '82%' }}></i></div>
                    <div className="kticks"><span>0</span><span>QUEUED &amp; SPACED</span><span>25</span><span>SAFE ZONE</span><span>50</span></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE (Magazine Split) ===================== */}
        <section className="section" data-screen-label="Deep Dive">
          <div className="va-dd-wrap reveal">
            <div className="va-dd-grid">

              <div className="va-dd-left">
                <div>
                  <div className="va-dd-sec-head">
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'rgba(255,255,255,.3)' }}>[03]</span>
                    <span className="kicker" style={{ color: 'rgba(255,255,255,.3)' }}>Multi-channel</span>
                  </div>
                  <div className="va-dd-big-label">MULTI-<br /><span className="dim">CHANNEL</span></div>
                </div>
                <div className="va-dd-metrics">
                  <div className="va-dd-m">
                    <div className="n">4–8%</div>
                    <div className="l">higher email reply rates when LinkedIn connection precedes the email</div>
                  </div>
                  <div className="va-dd-m">
                    <div className="n">90%+</div>
                    <div className="l">connection acceptance on warm visitors vs 30-40% cold</div>
                  </div>
                </div>
              </div>

              <div className="va-dd-right">
                <div className="va-dd-right-hdr">
                  <span>CH</span><span>DAY</span><span>EVENT</span><span style={{ textAlign: 'right' }}>STATUS</span>
                </div>
                <div className="va-dd-event">
                  <span className="va-dd-ch-b" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10px' }}>in</span>
                  <span className="va-dd-day">Day 0</span>
                  <span className="va-dd-ev-title">Personalised LinkedIn connection request sent from rep's real account</span>
                  <span className="va-dd-status sent">SENT</span>
                </div>
                <div className="va-dd-event">
                  <span className="va-dd-ch-b em">✉</span>
                  <span className="va-dd-day">Day 2</span>
                  <span className="va-dd-ev-title">Email lands warm — prospect already recognises the name from LinkedIn</span>
                  <span className="va-dd-status sent">WARM</span>
                </div>
                <div className="va-dd-event">
                  <span className="va-dd-ch-b" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10px' }}>in</span>
                  <span className="va-dd-day">Day 2</span>
                  <span className="va-dd-ev-title">LinkedIn follow-up message fires on acceptance, coordinated with email</span>
                  <span className="va-dd-status sent">SENT</span>
                </div>
                <div className="va-dd-event">
                  <span className="va-dd-ch-b em">✉</span>
                  <span className="va-dd-day">Day 4</span>
                  <span className="va-dd-ev-title">Email follow-up — coordinated, timed after LinkedIn touchpoint</span>
                  <span className="va-dd-status muted">QUEUED</span>
                </div>
                <div className="va-dd-event">
                  <span className="va-dd-ch-b" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '10px' }}>in</span>
                  <span className="va-dd-day">Day 7</span>
                  <span className="va-dd-ev-title">InMail fallback — fires automatically if no connection after 7 days</span>
                  <span className="va-dd-status warn">FALLBACK</span>
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
                <div className="int-cat-lbl">LinkedIn</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl" style={{ fontFamily: 'var(--sans)', fontWeight: 700 }}>in</span>LinkedIn (Unipile OAuth)</span>
                  <span className="int-pill"><span className="gl">⚡</span>InMail</span>
                  <span className="int-pill"><span className="gl">◉</span>Profile View Trigger</span>
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
                <div className="int-cat-lbl">CRM</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">◢</span>Salesforce</span>
                  <span className="int-pill"><span className="gl">✳</span>HubSpot</span>
                  <span className="int-pill"><span className="gl">▦</span>Pipedrive</span>
                </div>
              </div>
              <div className="int-cat">
                <div className="int-cat-lbl">Reply &amp; Routing</div>
                <div className="int-pills">
                  <span className="int-pill"><span className="gl">↩</span>Reply Handler</span>
                  <span className="int-pill"><span className="gl">▣</span>Slack</span>
                  <span className="int-pill"><span className="gl">⚡</span>Zapier</span>
                </div>
              </div>
            </div>
            <div className="int-mq">
              <div className="int-track">
                <span className="logo-item sub">all integrations native · no glue code →</span>
                <span className="logo-item"><span className="gl" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '.75em' }}>in</span>LinkedIn</span>
                <span className="logo-item"><span className="gl">✉</span>Gmail</span>
                <span className="logo-item"><span className="gl">▤</span>Outlook</span>
                <span className="logo-item"><span className="gl">◢</span>Salesforce</span>
                <span className="logo-item"><span className="gl">✳</span>HubSpot</span>
                <span className="logo-item"><span className="gl">▣</span>Slack</span>
                <span className="logo-item"><span className="gl">↩</span>Reply Handler</span>
                <span className="logo-item"><span className="gl">▦</span>Pipedrive</span>
                <span className="logo-item"><span className="gl">⚡</span>Zapier</span>
                <span className="logo-item sub">all integrations native · no glue code →</span>
                <span className="logo-item"><span className="gl" style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '.75em' }}>in</span>LinkedIn</span>
                <span className="logo-item"><span className="gl">✉</span>Gmail</span>
                <span className="logo-item"><span className="gl">▤</span>Outlook</span>
                <span className="logo-item"><span className="gl">◢</span>Salesforce</span>
                <span className="logo-item"><span className="gl">✳</span>HubSpot</span>
                <span className="logo-item"><span className="gl">▣</span>Slack</span>
                <span className="logo-item"><span className="gl">↩</span>Reply Handler</span>
                <span className="logo-item"><span className="gl">▦</span>Pipedrive</span>
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
              <h2 className="sec-title">More replies. Warmer pipeline.<br /><span className="acc">One less tool to manage.</span></h2>
              <p className="sec-sub">Teams using Outmate's Social Agent stop treating LinkedIn as an afterthought — and start using it as the warm-up layer that makes everything else convert better.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="sales-metrics">
              <div className="sales-metric">
                <div className="sm-n">4–8%</div>
                <div className="sm-l">higher email reply rates when a LinkedIn connection precedes the email, every sequence, automatically</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">90%+</div>
                <div className="sm-l">LinkedIn connection acceptance for warm visitors who already viewed your site, vs 30-40% cold</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">3+ hrs</div>
                <div className="sm-l">per week saved per rep on manual LinkedIn outreach, fully automated from your real account</div>
              </div>
              <div className="sales-metric">
                <div className="sm-n">1</div>
                <div className="sm-l">credit per message — vs $50-150/month for standalone LinkedIn tools, included in your Outmate plan</div>
              </div>
            </div>
            <div className="ba">
              <div className="ba-col before">
                <h4>Before Outmate</h4>
                <ul>
                  <li><span className="mk">✕</span>LinkedIn outreach is manual, occasional, and disconnected from email</li>
                  <li><span className="mk">✕</span>Generic connection notes — low acceptance rates</li>
                  <li><span className="mk">✕</span>No coordination between LinkedIn and email sequences</li>
                  <li><span className="mk">✕</span>Rep switches between tools to manage two channels</li>
                </ul>
              </div>
              <div className="ba-col after">
                <h4>With Outmate</h4>
                <ul>
                  <li><span className="mk">✳</span>LinkedIn connect fires automatically when prospect enters the sequence</li>
                  <li><span className="mk">✳</span>Personalised notes referencing real signals — 90%+ acceptance on warm visitors</li>
                  <li><span className="mk">✳</span>LinkedIn and email coordinated in one sequence, one platform</li>
                  <li><span className="mk">✳</span>Every reply classified and actioned — rep only sees what needs a human</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 9 · PROOF (Editorial Quotes) ===================== */}
        <section className="section" data-screen-label="Proof">
          <div className="va-proof-wrap reveal">
            <div className="va-proof-hdr">
              <div className="sec-head" style={{ marginBottom: 0 }}><span className="num">[06]</span><span className="kicker">Proof</span></div>
            </div>
            <div className="va-featured-q">
              <span className="va-qm">"</span>
              <blockquote>Our reply rates went up the week we turned on Social Agent. The connection note before the email genuinely changes how it lands.</blockquote>
              <div className="va-q-who">Head of Sales · B2B SaaS · Series A</div>
            </div>
            <div className="va-sub-quotes">
              <div className="va-sub-q">
                <span className="va-sub-idx">✳ 01</span>
                <p>We replaced Expandi and our email sequencer with one tool. Outmate runs the whole thing from the same platform — and it's actually coordinated.</p>
                <div className="who"><div className="nm">VP of Growth</div><div className="ro">Enterprise Tech</div></div>
              </div>
              <div className="va-sub-q">
                <span className="va-sub-idx">✳ 02</span>
                <p>The profile view trigger is genuinely different. Someone views your LinkedIn and a connect fires within minutes. The warmest possible opening — and it happens automatically.</p>
                <div className="who"><div className="nm">Founder &amp; CEO</div><div className="ro">B2B Startup</div></div>
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
                <summary><span className="q">Will my LinkedIn account get restricted or banned?</span><span className="tog">+</span></summary>
                <div className="a"><p>No. Outmate respects LinkedIn's daily limits — 50 connection requests and 100 messages per day — automatically. Every action is spaced and queued to stay within safe thresholds. No bulk blasting. No suspicious activity patterns. <span className="acc">Your account stays clean.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Does it actually send from my real LinkedIn profile?</span><span className="tog">+</span></summary>
                <div className="a"><p>Yes. Social Agent connects via Unipile OAuth — your rep authorises their LinkedIn account once, and every connection request, message, and InMail goes out from their real profile. The prospect sees your rep's actual name, photo, title, and company. <span className="acc">No fake accounts. No managed profiles.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">What if a prospect replies on LinkedIn but ignores the email?</span><span className="tog">+</span></summary>
                <div className="a"><p>Every LinkedIn reply is classified by Outmate's Reply Handler — the same one used for email. If they reply as Interested on LinkedIn, the sequence pauses the email thread automatically and flags the rep to follow up on LinkedIn. <span className="acc">No double-messaging. No crossed wires between channels.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Do I need a separate LinkedIn automation tool if I use Outmate?</span><span className="tog">+</span></summary>
                <div className="a"><p>No. Social Agent replaces standalone LinkedIn tools like Expandi, Dripify, and LaGrowthMachine — and unlike those tools, it's fully coordinated with your email sequence, your CRM, and your signal data. <span className="acc">One platform, one login, one sequence across both channels.</span></p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 12 · FINAL CTA ===================== */}
        <section className="section" id="start" data-screen-label="Final CTA">
          <div className="final-cta reveal">
            <span className="fc-ast">✳</span>
            <h2>Make every<br />email land warm.</h2>
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
              <h5>Connect</h5>
              <ul>
                <li>LinkedIn Connection Requests</li>
                <li>Personalised Notes</li>
                <li>Profile View Trigger</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Coordinate</h5>
              <ul>
                <li>Multi-channel Sequences</li>
                <li>InMail Fallback</li>
                <li>Email Coordination</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Close</h5>
              <ul>
                <li>Reply Classification</li>
                <li>CRM Auto-update</li>
                <li>Rate Limit Management</li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <div className="contact-main">
              <h2>CONTACT</h2>
              <p className="contact-tag">
                <span className="dim">YOUR EMAILS DESERVE A WARM LANDING.</span> <span className="ast">✳</span>
                LET'S SHOW YOU WHAT THAT LOOKS LIKE.
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
              <span className="small">2026 — Outmate. LinkedIn and email, coordinated.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
