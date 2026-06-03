import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './ai-outbound.css';

export default function AIOutbound() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — Run AI-Powered Outbound';
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

    /* ---------- giant OUTBOUND headline: scroll-driven horizontal drift ----------
       Matches the sibling use-case pages: the track slides left as the page
       scrolls down and reverses on scroll up (mapped to scroll progress).
       overflow and translate are measured in the same space, so it stays
       correct under the .aio-root zoom. */
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
    <div className="aio-root" id="top" ref={rootRef}>
      {/* ===================== NAV (shared site-wide) ===================== */}
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

          {/* ===================== 1 · HERO (dark) ===================== */}
          <section className="hero" data-screen-label="Hero">
            <div className="hero-top"></div>
            <div className="hero-headline">
              <h1><span className="g0">OUTBOUND</span><span className="mark">✳</span><span className="ghost">OUTMATE</span></h1>
            </div>
            <div className="hero-grid">
              <div className="hero-left lp">
                <div className="hero-eyebrow reveal">
                  <span className="tag">✳ AI-POWERED OUTBOUND</span>
                  <span className="comp">SOC 2 · GDPR · CCPA</span>
                </div>
                <h2 className="lp-headline reveal">
                  Your outbound team. <span className="dim">Without the burnout.</span>
                </h2>
                <p className="lp-sub reveal">Prospecting, writing, sending, replying, calling — handled by AI. Your reps focus on closing. Your pipeline keeps moving even when nobody's at their desk.</p>
                <div className="cta-row reveal">
                  <Link to="/book-demo" className="btn solid">START FREE →</Link>
                  <a href="#how" className="btn">SEE IT IN ACTION</a>
                </div>
                <span className="micro reveal">Sends from your real Gmail · Calls in local business hours · Logs everything to your CRM</span>
                <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
              </div>

              <div className="hero-right">
                <span className="corner tl">outmate / ai-sdr</span>
                <span className="corner bl">live · drafting from signal</span>
                <span className="plus p1">+</span><span className="plus p2">+</span>
                <span className="tick t1"></span><span className="tick t2"></span>

                <div className="mock ai-compose reveal">
                  <div className="mock-bar">
                    <span>ai_sdr_agent · composing</span>
                    <span className="live"><span className="dot"></span>WRITING</span>
                  </div>
                  <div className="sig-row">
                    <span className="sig-k">✳ Signal</span>
                    <span className="sig-v">Apex Systems · Series B raised · 2h ago</span>
                  </div>
                  <div className="compose">
                    <div className="c-line"><span className="c-k">To</span><span className="c-v">dana.k@apexsystems.com</span></div>
                    <div className="c-line"><span className="c-k">From</span><span className="c-v"><span className="acc">you@yourco.com</span> · real Gmail</span></div>
                    <div className="c-line"><span className="c-k">Subj</span><span className="c-v">Congrats on the Series B</span></div>
                  </div>
                  <div className="c-body">Hi Dana — saw Apex closed the Series B last week. Teams scaling eng headcount this fast usually hit a routing bottleneck around month three<span className="caret">▍</span></div>
                  <div className="c-foot">
                    <span>↳ inbox-native · no warmup domain</span>
                    <span className="send">1-CLICK SEND →</span>
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
                  <h2 className="sec-title">Outbound is broken. Bolting AI on top <span className="acc">hasn't fixed it.</span></h2>
                </div>
                <div className="prob-body">
                  <p>Your SDRs spend 6+ hours a day prospecting, list-building, and writing emails. Reply rates have dropped to 1-2%. Deliverability is shaky. And the "AI SDR" you tried last quarter sent obvious bot emails from a warmup domain — burning your sending reputation along with it.</p>
                  <p>Meanwhile, your best signals — pricing page visits, funding rounds, champion job changes — sit untouched in dashboards.</p>
                  <p>You don't need more volume. You need outbound that's relevant, autonomous, and actually lands.</p>
                </div>
              </div>
              <div className="prob-stats">
                <div className="prob-stat">
                  <div className="n">6+ hrs</div>
                  <div className="l">per day SDRs spend on manual prospecting and email writing</div>
                </div>
                <div className="prob-stat">
                  <div className="n">1-2%</div>
                  <div className="l">average cold email reply rate in 2026</div>
                </div>
                <div className="prob-stat">
                  <div className="n">$80K+</div>
                  <div className="l">per year — average loaded cost per SDR, for diminishing returns</div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== 4 · HOW IT WORKS ===================== */}
          <section className="bighead" id="how" data-screen-label="How it works">
            <div className="strip">
              <div className="track" id="bigtrack">
                <span className="g0">OUTBOUND</span><span className="mark">✳</span><span className="g1">OUTBOUND</span><span className="mark">✳</span><span className="g2">OUTBOUND</span><span className="mark">✳</span><span className="g0">OUTBOUND</span><span className="mark">✳</span>
              </div>
            </div>

            <div className="showcase">
              <div className="showcase-intro reveal">
                <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
                <h2>THE FULL OUTBOUND MOTION — HANDLED BY AI. APPROVED BY HUMANS.</h2>
                <p>Define your ICP and your message. Outmate handles the rest — and pings your reps only when there's a reply that matters.</p>
              </div>

              <div className="steps sales-steps">

                <div className="step reveal" data-screen-label="Step / Prospect">
                  <div className="sn">
                    <span className="step-badge">✳ PROSPECT &amp; PERSONALISE</span>
                    <b>01</b>
                  </div>
                  <div className="ico">◎</div>
                  <h3>AI builds the list. <span className="acc">AI writes the emails.</span></h3>
                  <p>Outmate finds ICP-matched prospects from our 500M+ database and writes a personalised email referencing real signals — funding, job changes, pages they viewed. No mail-merge.</p>
                  <div className="smock">
                    <div className="smock-bar"><span>prospect_engine · matching</span><span className="s-live">500M+ DB</span></div>
                    <div className="smock-row"><span className="sr-hot">✳ Apex Systems</span><span className="sr-tag">SERIES B · ICP 88</span></div>
                    <div className="smock-row"><span>Zephyr Logistics</span><span className="sr-tag">VISITED PRICING</span></div>
                    <div className="smock-row"><span>Cascade Health</span><span className="sr-tag">HIRED NEW CRO</span></div>
                    <div className="smock-row"><span className="sr-hot">✓ 3 emails drafted</span><span className="sr-tag">SIGNAL-MATCHED</span></div>
                  </div>
                  <div className="cap"><span className="d"></span>500M+ contacts · 4,000+ signals</div>
                </div>

                <div className="step reveal" data-screen-label="Step / Send">
                  <div className="sn">
                    <span className="step-badge">✳ SEND &amp; FOLLOW UP</span>
                    <b>02</b>
                  </div>
                  <div className="ico">✉</div>
                  <h3>From your rep's own Gmail. <span className="acc">Not a warmup domain.</span></h3>
                  <p>Every email sends from your rep's actual inbox — landing in inbox, not spam. AI follows up across email and LinkedIn, classifies every reply, and pings your rep only when it matters.</p>
                  <div className="s-slack">
                    <div className="sl-av">↩</div>
                    <div className="sl-bd">
                      <b>Reply classified</b> — <span className="acc">Apex Systems</span> replied: "interested, what's pricing?" Drafted response ready. <b>Worth a human touch.</b>
                      <div className="sl-meta">OUTMATE BOT · INTERESTED · PINGED REP</div>
                    </div>
                  </div>
                  <div className="cap"><span className="d"></span>Native Gmail / Outlook / LinkedIn</div>
                </div>

                <div className="step reveal" data-screen-label="Step / Call">
                  <div className="sn">
                    <span className="step-badge">✳ CALL &amp; CLOSE</span>
                    <b>03</b>
                  </div>
                  <div className="ico">☎</div>
                  <h3>Email got no reply? <span className="acc">Voice AI takes over.</span></h3>
                  <p>After 3 days of silence, Voice AI calls the prospect in local business hours, references the email, and books a meeting — or leaves a voicemail. Transcript auto-logged to CRM.</p>
                  <div className="scrm">
                    <div className="scrm-bar"><span>voice_ai · call placed</span><span className="s-sync">✓ LOGGED</span></div>
                    <div className="scrm-row"><span className="sr-label">Prospect</span><span className="sr-val">Zephyr Logistics · 11:04am</span><span className="sr-badge">LOCAL</span></div>
                    <div className="scrm-row"><span className="sr-label">Outcome</span><span className="sr-acc">Meeting booked · Thu 2pm</span><span className="sr-badge">CRM</span></div>
                    <div className="scrm-row"><span className="sr-label">Transcript</span><span className="sr-val">Auto-logged to HubSpot</span><span className="sr-badge">AUTO</span></div>
                    <div className="scrm-row"><span className="sr-label">Compliance</span><span className="sr-val">Introduced as AI · DNC checked</span></div>
                  </div>
                  <div className="cap"><span className="d"></span>Voice AI · Local business hours · Full transcripts in CRM</div>
                </div>

              </div>
            </div>

            <div className="how-highlight reveal">
              Signal → email → reply → call → meeting booked. <span className="acc">End-to-end. Autonomously.</span>
              <span className="chip">Fully autonomous · Human-approved</span>
            </div>
          </section>

          {/* ===================== 5 · WHAT YOU GET ===================== */}
          <section className="section" data-screen-label="What you get">
            <div className="card-lg reveal">
              <div className="pad-xl" style={{ paddingBottom: 0 }}>
                <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
                <h2 className="sec-title">Every part of the outbound motion —<br /><span className="acc">built in, not bolted on.</span></h2>
                <p className="sec-sub">No SDR seat licences. No warmup domains. No bot-sounding emails. Just outbound that actually works.</p>
                <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
              </div>
              <div className="kx">
                <div className="kx-tabs" role="tablist">
                  <button className="kx-tab" role="tab" aria-selected="true" data-k="0"><span className="kn">01</span><span className="kt">AI SDR</span><span className="ka">→</span></button>
                  <button className="kx-tab" role="tab" aria-selected="false" data-k="1"><span className="kn">02</span><span className="kt">Send from your rep's own Gmail</span><span className="ka">→</span></button>
                  <button className="kx-tab" role="tab" aria-selected="false" data-k="2"><span className="kn">03</span><span className="kt">Reply Handler</span><span className="ka">→</span></button>
                  <button className="kx-tab" role="tab" aria-selected="false" data-k="3"><span className="kn">04</span><span className="kt">Voice AI follow-up</span><span className="ka">→</span></button>
                </div>
                <div className="kx-stage">
                  <div className="kx-pane on" data-k="0">
                    <span className="ptag">✳ AI SDR</span>
                    <h3>AI SDR</h3>
                    <p>Finds your ICP, enriches the contacts, writes hyper-personalised emails referencing real signals, and sends them on your behalf. Multi-touch sequences across email and LinkedIn — fully autonomous.</p>
                    <div className="kx-vis">
                      <div className="kfeed">
                        <div className="kf-bar"><span>ai_sdr · queue</span><span className="live"><span className="dot"></span>8 PROSPECTS MATCHED</span></div>
                        <div className="feed">
                          <div className="feed-row"><div><div className="feed-co">Apex Systems — Series B raised</div><div className="feed-meta">EMAIL DRAFTED · SEND READY · ICP 88</div></div><div className="score hot"><span className="bar"><i style={{ width: '88%' }}></i></span><b>88</b></div></div>
                          <div className="feed-row"><div><div className="feed-co">Zephyr Logistics — Visited pricing</div><div className="feed-meta">EMAIL DRAFTED · PERSONALIZED</div></div><div className="score"><span className="bar"><i style={{ width: '76%' }}></i></span><b>76</b></div></div>
                          <div className="feed-row"><div><div className="feed-co">Cascade Health — Hired new CRO</div><div className="feed-meta">EMAIL DRAFTED · CHAMPION SIGNAL</div></div><div className="score"><span className="bar"><i style={{ width: '65%' }}></i></span><b>65</b></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="kx-pane" data-k="1">
                    <span className="ptag">✳ Real inbox</span>
                    <h3>Send from your rep's own Gmail</h3>
                    <p>No shared sending infrastructure. No warmup domains. Every email goes out from your rep's real Gmail or Outlook — landing in inbox, with reply rates 3-5x higher than typical AI SDR tools.</p>
                    <div className="kx-vis">
                      <div className="kcontact">
                        <div className="top">
                          <span className="av">✉</span>
                          <span><span className="nm">Gmail — Native OAuth</span><div className="rl">Sends as you@yourco.com · No warmup domain</div></span>
                        </div>
                        <div className="kfields">
                          <div className="kfield"><span className="l">SENDS FROM</span><span className="acc">you@yourco.com · real inbox</span></div>
                          <div className="kfield"><span className="l">DELIVERY</span><span>Inbox — not spam · SPF/DKIM aligned</span></div>
                          <div className="kfield"><span className="l">REPLY RATE</span><span>3-5× higher than typical AI SDR tools</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="kx-pane" data-k="2">
                    <span className="ptag">✳ Reply Handler</span>
                    <h3>Reply Handler</h3>
                    <p>Classifies every reply into 7 types — interested, not now, OOO, objection, referral, unsubscribe, negative. Drafts the right next action for each. Your rep only sees the ones worth a human touch.</p>
                    <div className="kx-vis">
                      <div className="kfeed">
                        <div className="kf-bar"><span>reply_handler · classifying</span><span className="live"><span className="dot"></span>7 TYPES</span></div>
                        <div className="feed">
                          <div className="feed-row"><div><div className="feed-co">✳ Apex Systems — Interested</div><div className="feed-meta">RESPONSE DRAFTED · PINGED REP</div></div><div className="score hot"><span className="bar"><i style={{ width: '94%' }}></i></span><b>act</b></div></div>
                          <div className="feed-row"><div><div className="feed-co">Halcyon — Objection: timeline</div><div className="feed-meta">REBUTTAL DRAFTED · REP REVIEW</div></div><div className="score"><span className="bar"><i style={{ width: '70%' }}></i></span><b>act</b></div></div>
                          <div className="feed-row"><div><div className="feed-co">Vanta — Out of office</div><div className="feed-meta">FOLLOW-UP RESCHEDULED · AUTO</div></div><div className="score"><span className="bar"><i style={{ width: '30%' }}></i></span><b>auto</b></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="kx-pane" data-k="3">
                    <span className="ptag">✳ Voice AI</span>
                    <h3>Voice AI follow-up</h3>
                    <p>After 3 days of no email reply, our Voice AI calls in the prospect's local business hours, asks one qualifying question, and books the meeting — or leaves a personalised voicemail. Transcript auto-logged to CRM.</p>
                    <div className="kx-vis">
                      <div className="kcontact">
                        <div className="top">
                          <span className="av">☎</span>
                          <span><span className="nm">Voice AI — Call placed</span><div className="rl">Zephyr Logistics · 11:04am local time</div></span>
                        </div>
                        <div className="kfields">
                          <div className="kfield"><span className="l">TRIGGER</span><span>3 days · no email reply</span></div>
                          <div className="kfield"><span className="l">OUTCOME</span><span className="acc">Meeting booked · Thu 2pm</span></div>
                          <div className="kfield"><span className="l">TRANSCRIPT</span><span>Auto-logged to CRM · TCPA-aware</span></div>
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
                <div className="sec-head"><span className="num">[03]</span><span className="kicker">AI agent, live</span></div>
                <h2 className="sec-title">Watch an AI SDR write outreach<br /><span className="acc">from real signals.</span></h2>
                <p className="sec-sub">The agent reads the signal, drafts a personalised email, and sends it from your rep's own inbox. A full roster of agents runs the rest of the motion.</p>
              </div>

              <div className="dd-pane on" style={{ display: 'grid' }}>
                <div className="dd-left">
                  <span className="dd-role">✳ AI SDR · composing</span>
                  <h3 className="dd-title">Signal in. Personalised email out.</h3>
                  <p className="dd-body">No mail-merge, no templates. The agent references the exact event that triggered the outreach — a funding round, a pricing-page visit, a new hire — and writes like a sharp rep who did 20 minutes of research. Then it sends from your rep's real Gmail.</p>
                  <div className="cap-line"><span className="d"></span>Under 4 minutes · signal detected → email in inbox</div>
                </div>
                <div className="dd-right">
                  <div className="mock ai-compose">
                    <div className="mock-bar">
                      <span>ai_sdr_agent · composing</span>
                      <span className="live"><span className="dot"></span>WRITING</span>
                    </div>
                    <div className="sig-row">
                      <span className="sig-k">✳ Signal</span>
                      <span className="sig-v">Cascade Health · hired new CRO · 4h ago</span>
                    </div>
                    <div className="compose">
                      <div className="c-line"><span className="c-k">To</span><span className="c-v">priya.n@cascadehealth.com</span></div>
                      <div className="c-line"><span className="c-k">From</span><span className="c-v"><span className="acc">you@yourco.com</span> · real Gmail</span></div>
                      <div className="c-line"><span className="c-k">Subj</span><span className="c-v">A note on your first 90 days</span></div>
                    </div>
                    <div className="c-body">Hi Priya — congrats on the CRO seat at Cascade. New revenue leaders usually want pipeline visibility fast, so I'll keep this short<span className="caret">▍</span></div>
                    <div className="c-foot">
                      <span>↳ inbox-native · no warmup domain</span>
                      <span className="send">1-CLICK SEND →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* agent roster */}
              <div className="agents-grid">
                <div className="agent-card">
                  <div className="a-top"><span className="a-ico">◎</span><span className="a-idx">01</span></div>
                  <span className="a-name">ICP Matcher</span>
                  <span className="a-desc">Scans the 500M+ database and 4,000+ signals to surface prospects that fit your ideal profile — and ranks them by buying intent.</span>
                </div>
                <div className="agent-card">
                  <div className="a-top"><span className="a-ico">✎</span><span className="a-idx">02</span></div>
                  <span className="a-name">Email Drafter</span>
                  <span className="a-desc">Writes a personalised email from the exact signal that triggered it — funding, job change, page viewed. No mail-merge, no blank page.</span>
                </div>
                <div className="agent-card">
                  <div className="a-top"><span className="a-ico">✉</span><span className="a-idx">03</span></div>
                  <span className="a-name">Sender</span>
                  <span className="a-desc">Sends from your rep's real Gmail or Outlook via OAuth — landing in inbox, not spam, with no warmup domain in the path.</span>
                </div>
                <div className="agent-card">
                  <div className="a-top"><span className="a-ico">↩</span><span className="a-idx">04</span></div>
                  <span className="a-name">Reply Handler</span>
                  <span className="a-desc">Classifies every reply into 7 types and drafts the right next action — pinging the rep only when a human touch is worth it.</span>
                </div>
                <div className="agent-card">
                  <div className="a-top"><span className="a-ico">in</span><span className="a-idx">05</span></div>
                  <span className="a-name">Follow-up Agent</span>
                  <span className="a-desc">Runs multi-touch sequences across email and LinkedIn, spacing the cadence and stopping the moment a prospect engages.</span>
                </div>
                <div className="agent-card">
                  <div className="a-top"><span className="a-ico">☎</span><span className="a-idx">06</span></div>
                  <span className="a-name">Voice AI</span>
                  <span className="a-desc">Calls after 3 days of silence in local business hours, books the meeting or leaves a voicemail, and logs the transcript to CRM.</span>
                </div>
              </div>
              <div className="agents-note"><span className="acc">✳</span> Every agent logs its work — full audit trail, and you can pause any one with a single toggle.</div>
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
                <h2 className="sec-title">More meetings.<br /><span className="acc">Zero burnout.</span></h2>
                <p className="sec-sub">Teams using Outmate stop drowning in busywork and start measuring outbound by the only metric that matters — meetings booked.</p>
                <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
              </div>
              <div className="sales-metrics">
                <div className="sales-metric">
                  <div className="sm-n">3–5×</div>
                  <div className="sm-l">higher reply rates — vs typical AI SDR tools, because we send from real inboxes</div>
                </div>
                <div className="sales-metric">
                  <div className="sm-n">80%</div>
                  <div className="sm-l">of SDR work eliminated — prospecting, writing, sending, following up</div>
                </div>
                <div className="sales-metric">
                  <div className="sm-n">&lt;4 min</div>
                  <div className="sm-l">from signal detected to personalised email in inbox</div>
                </div>
                <div className="sales-metric">
                  <div className="sm-n">$80K+</div>
                  <div className="sm-l">per year saved — per SDR seat replaced, at a fraction of the cost</div>
                </div>
              </div>
              <div className="ba">
                <div className="ba-col before">
                  <h4>Before Outmate</h4>
                  <ul>
                    <li><span className="mk">✕</span>SDRs burn 6+ hours/day on manual prospecting</li>
                    <li><span className="mk">✕</span>AI SDR tools send obvious bot emails from sketchy domains</li>
                    <li><span className="mk">✕</span>Replies sit unread, voicemails uncalled, follow-ups missed</li>
                    <li><span className="mk">✕</span>Reply rates stuck at 1-2%</li>
                  </ul>
                </div>
                <div className="ba-col after">
                  <h4>With Outmate</h4>
                  <ul>
                    <li><span className="mk">✓</span>AI does the prospecting, writing, sending, and calling</li>
                    <li><span className="mk">✓</span>Emails land in inbox from your rep's real Gmail</li>
                    <li><span className="mk">✓</span>Every reply classified, every voicemail logged, every follow-up fired</li>
                    <li><span className="mk">✓</span>Reply rates 3-5x higher — and reps focus only on closing</li>
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
                  <p>The emails read like a sharp rep did 20 minutes of research. Reply rates more than tripled in the first month — and nothing went out from a warmup domain.</p>
                  <div className="who"><div className="nm">VP of Sales</div><div className="ro">B2B SaaS</div></div>
                </div>
                <div className="quote">
                  <div className="qm">"</div>
                  <p>Voice AI booked meetings off emails that would have died in silence. Our reps walked into calls they didn't have to chase.</p>
                  <div className="who"><div className="nm">Head of Revenue</div><div className="ro">Series B Startup</div></div>
                </div>
                <div className="quote">
                  <div className="qm">"</div>
                  <p>We replaced three tools and a pile of manual work. Outbound runs overnight now, and my reps only see the replies worth their time.</p>
                  <div className="who"><div className="nm">Sales Manager</div><div className="ro">Enterprise Tech</div></div>
                </div>
              </div>
              <div className="proof-foot">Customer names &amp; logos available on request.</div>
            </div>
          </section>

          {/* ===================== WHY TEAMS SWITCH (comparison) ===================== */}
          <section className="section" data-screen-label="Comparison">
            <div className="card-lg reveal">
              <div className="pad-xl" style={{ paddingBottom: 0 }}>
                <div className="sec-head"><span className="num">[07]</span><span className="kicker">Why teams switch</span></div>
                <h2 className="sec-title">Not another SDR hire.<br />Not another <span className="acc">bot tool.</span></h2>
                <p className="sec-sub">The two usual options each break down somewhere. Here's how the full outbound motion compares — head to head.</p>
                <div style={{ height: 'clamp(26px,3vw,44px)' }}></div>
              </div>
              <div className="cmp">
                <div className="cmp-row cmp-head">
                  <div className="cmp-cell"><span className="cmp-h-old" style={{ color: 'var(--ink)', fontWeight: 700, fontFamily: 'var(--sans)', letterSpacing: '-.01em', fontSize: 'clamp(14px,1.3vw,17px)', textTransform: 'none' }}>The job to be done</span></div>
                  <div className="cmp-cell"><span className="cmp-h-old">Hiring SDRs / other AI tools</span></div>
                  <div className="cmp-cell cmp-col-new"><span className="cmp-h-new"><span className="ast">✳</span>With Outmate</span></div>
                </div>
                <div className="cmp-row">
                  <div className="cmp-cell"><span className="cmp-cap">Cost to run</span></div>
                  <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>$80K+ per SDR, per year — for diminishing returns</span></div>
                  <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>A fraction of one seat — the whole motion, autonomous</span></div>
                </div>
                <div className="cmp-row">
                  <div className="cmp-cell"><span className="cmp-cap">Where email sends from</span></div>
                  <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Shared warmup domains that burn your reputation</span></div>
                  <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>Your rep's real Gmail — inbox-native, no warmup</span></div>
                </div>
                <div className="cmp-row">
                  <div className="cmp-cell"><span className="cmp-cap">How emails read</span></div>
                  <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Obvious bot copy or generic mail-merge templates</span></div>
                  <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>Written from real signals — like a sharp rep who researched</span></div>
                </div>
                <div className="cmp-row">
                  <div className="cmp-cell"><span className="cmp-cap">Follow-up &amp; replies</span></div>
                  <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Replies sit unread, voicemails uncalled, touches missed</span></div>
                  <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>Every reply classified, every call placed, nothing dropped</span></div>
                </div>
                <div className="cmp-row">
                  <div className="cmp-cell"><span className="cmp-cap">Reply rate</span></div>
                  <div className="cmp-cell"><span className="cmp-old"><span className="cmp-mk">✕</span>Stuck at 1-2% — and trending down</span></div>
                  <div className="cmp-cell cmp-col-new"><span className="cmp-new"><span className="cmp-mk">✓</span>3-5× higher, because it lands and it's relevant</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== 10 · DELIVERABILITY BAND (unique) ===================== */}
          <section className="section" data-screen-label="Deliverability">
            <div className="card-lg reveal">
              <div className="pad-xl" style={{ paddingBottom: 0 }}>
                <div className="sec-head"><span className="num">[08]</span><span className="kicker">Deliverability</span></div>
                <h2 className="sec-title">Lands in the inbox.<br /><span className="acc">Protects your domain.</span></h2>
                <div style={{ height: 'clamp(24px,2.8vw,44px)' }}></div>
              </div>
              <div className="deliv">
                <div className="deliv-card">
                  <div className="di">✓</div>
                  <div className="dh">Sends from your rep's own inbox</div>
                  <div className="dp">Native Gmail &amp; Outlook via OAuth — not a shared warmup domain. Deliverability-wise, it is a real 1:1 email.</div>
                  <div className="dtag">OAuth · Inbox-native</div>
                </div>
                <div className="deliv-card">
                  <div className="di">✓</div>
                  <div className="dh">SPF · DKIM · DMARC aligned</div>
                  <div className="dp">Authentication stays on your own sending domain, so messages land in the inbox and protect your reputation.</div>
                  <div className="dtag">Domain-aligned auth</div>
                </div>
                <div className="deliv-card">
                  <div className="di">✓</div>
                  <div className="dh">TCPA-aware Voice AI</div>
                  <div className="dp">Honors Do Not Call lists, calls only in local business hours, and the AI introduces itself as AI on every call.</div>
                  <div className="dtag">TCPA · DNC respected</div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== 12 · FAQ ===================== */}
          <section className="section" data-screen-label="FAQ">
            <div className="card-lg reveal">
              <div className="pad-xl" style={{ paddingBottom: 'clamp(24px,3vw,40px)' }}>
                <div className="sec-head"><span className="num">[09]</span><span className="kicker">FAQ</span></div>
                <h2 className="sec-title">Questions, <span className="acc">answered.</span></h2>
              </div>
              <div className="faq">
                <details className="faq-item" open>
                  <summary><span className="q">Will this burn my domain reputation?</span><span className="tog">+</span></summary>
                  <div className="a"><p>No. We send from your rep's own Gmail or Outlook via OAuth — not a shared warmup domain. <span className="acc">Every email looks and behaves like a real one-to-one email because, deliverability-wise, it is one.</span></p></div>
                </details>
                <details className="faq-item">
                  <summary><span className="q">Won't recipients realise it's AI-written?</span><span className="tog">+</span></summary>
                  <div className="a"><p>The emails reference real signals — funding, hiring activity, pages they actually viewed on your site, recent LinkedIn posts. They read like a sharp SDR who did 20 minutes of research, because that's exactly what the AI does. <span className="acc">Reply rates are 3-5x higher than typical AI SDR tools.</span></p></div>
                </details>
                <details className="faq-item">
                  <summary><span className="q">Is the Voice AI compliant with calling laws?</span><span className="tog">+</span></summary>
                  <div className="a"><p>Yes. We're TCPA-aware, respect Do Not Call lists, only call during local business hours, and the AI introduces itself as AI at the start of every call. You can also set custom call windows and exclusions per geography.</p></div>
                </details>
                <details className="faq-item">
                  <summary><span className="q">Can I still review emails before they send?</span><span className="tog">+</span></summary>
                  <div className="a"><p>Yes. Every campaign can run in review mode until you trust the system — emails get queued for human approval. Once you're comfortable, switch any rep or campaign to fully autonomous. <span className="acc">You stay in control of the toggle.</span></p></div>
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
              <div className="hero-trust" style={{ justifyContent: 'center', color: 'rgba(255,255,255,.7)' }}><span className="stars" style={{ color: '#fff' }}>★ 4.8</span>&nbsp;ON G2 · 200+ REVIEWS</div>
            </div>
          </section>

          {/* ===================== FOOTER ===================== */}
          <footer className="foot" id="contact" data-screen-label="Footer">
            <div className="foot-services">
              <span className="idx">[00–09]</span>
              <div className="foot-col">
                <h5>Prospect</h5>
                <ul>
                  <li>AI SDR</li>
                  <li>500M+ Contact Database</li>
                  <li>Signal-Matched Personalisation</li>
                </ul>
              </div>
              <div className="foot-col">
                <h5>Send</h5>
                <ul>
                  <li>Send from Real Gmail</li>
                  <li>Reply Handler</li>
                  <li>Email &amp; LinkedIn Follow-up</li>
                </ul>
              </div>
              <div className="foot-col">
                <h5>Close</h5>
                <ul>
                  <li>Voice AI Follow-up</li>
                  <li>Auto CRM Logging</li>
                  <li>Deliverability &amp; Compliance</li>
                </ul>
              </div>
            </div>
            <div className="contact">
              <div className="contact-main">
                <h2>CONTACT</h2>
                <p className="contact-tag">
                  <span className="dim">YOUR OUTBOUND SHOULD RUN WHILE YOUR REPS CLOSE.</span> <span className="ast">✳</span>
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
                <span className="small">2026 — Outmate. Built for outbound that runs itself.</span>
              </div>
            </div>
          </footer>

      </main>
    </div>
  );
}
