import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import './b2b-database.css';

const QUERIES = [
  'VP Sales at funded fintech companies in the UK hiring SDRs right now',
  'CTOs at Series B SaaS companies in the US hiring sales teams right now',
  'Heads of RevOps at companies using Salesforce and Outreach in North America',
];

export default function B2BDatabase() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Outmate — B2B Database';
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
      revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              revealIO?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
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
        const kxIO = new IntersectionObserver(
          (entries) => {
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
          },
          { threshold: 0.4 }
        );
        if (stage) kxIO.observe(stage);
        cleanups.push(() => { kxIO.disconnect(); stopTimer(); });
      }
    }

    /* ---------- Deep Dive: example-query tabs + typing animation ---------- */
    {
      const tabs = Array.from(root.querySelectorAll<HTMLElement>('.dd-tab[data-q]'));
      const panes = Array.from(root.querySelectorAll<HTMLElement>('.nlp-pane[data-q]'));
      if (panes.length) {
        let typingTimer: ReturnType<typeof setInterval> | null = null;

        const paneByQ = (q: string) => panes.find((p) => p.getAttribute('data-q') === q) || null;

        const resetPane = (pane: HTMLElement) => {
          const typed = pane.querySelector<HTMLElement>('.nlp-typed');
          const chips = pane.querySelectorAll('.nlp-chip');
          const results = pane.querySelector('.nlp-results');
          const search = pane.querySelector('.nlp-search');
          if (typed) typed.textContent = '';
          chips.forEach((c) => c.classList.remove('in'));
          if (results) results.classList.remove('in');
          if (search) search.classList.remove('live');
        };

        const revealResults = (pane: HTMLElement) => {
          const chips = pane.querySelectorAll('.nlp-chip');
          const results = pane.querySelector('.nlp-results');
          const search = pane.querySelector('.nlp-search');
          if (search) search.classList.add('live');
          chips.forEach((c, i) => {
            setTimeout(() => c.classList.add('in'), i * 110);
          });
          setTimeout(() => { if (results) results.classList.add('in'); }, chips.length * 110 + 180);
        };

        const playPane = (pane: HTMLElement) => {
          if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
          const q = pane.getAttribute('data-q') || '0';
          const text = QUERIES[parseInt(q, 10)] || '';
          const typed = pane.querySelector<HTMLElement>('.nlp-typed');
          resetPane(pane);
          if (reduce || !typed) {
            if (typed) typed.textContent = text;
            revealResults(pane);
            return;
          }
          let i = 0;
          typingTimer = setInterval(() => {
            i++;
            typed.textContent = text.slice(0, i);
            if (i >= text.length) {
              if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
              setTimeout(() => revealResults(pane), 260);
            }
          }, 26);
        };

        const select = (q: string) => {
          tabs.forEach((t) => t.setAttribute('aria-selected', t.getAttribute('data-q') === q ? 'true' : 'false'));
          panes.forEach((p) => {
            const on = p.getAttribute('data-q') === q;
            p.classList.toggle('on', on);
            if (!on) resetPane(p);
          });
          const pane = paneByQ(q);
          if (pane) playPane(pane);
        };

        tabs.forEach((t) => {
          const onClick = () => select(t.getAttribute('data-q') || '0');
          t.addEventListener('click', onClick);
          cleanups.push(() => t.removeEventListener('click', onClick));
        });

        let started = false;
        const first = paneByQ('0');
        if ('IntersectionObserver' in window && first) {
          const ddIO = new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting && !started) {
                  started = true;
                  playPane(first);
                  ddIO.disconnect();
                }
              });
            },
            { threshold: 0.35 }
          );
          ddIO.observe(first.closest('.card-dark') || first);
          cleanups.push(() => ddIO.disconnect());
        } else if (first) {
          playPane(first);
        }

        cleanups.push(() => { if (typingTimer) clearInterval(typingTimer); });
      }
    }

    /* ---------- Outcomes: metric entrance + before/after stagger + proof ---------- */
    {
      const metrics = Array.from(root.querySelectorAll<HTMLElement>('.oc-metric'));
      const miniCards = Array.from(root.querySelectorAll<HTMLElement>('.pf-mini'));
      if (!('IntersectionObserver' in window)) {
        metrics.forEach((m) => m.classList.add('animated'));
        root.querySelectorAll('.oc-ba li').forEach((li) => li.classList.add('in'));
        miniCards.forEach((c) => c.classList.add('in'));
      } else {
        const mio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) { e.target.classList.add('animated'); mio.unobserve(e.target); }
            });
          },
          { threshold: 0.3 }
        );
        metrics.forEach((m) => mio.observe(m));
        cleanups.push(() => mio.disconnect());

        const baio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                const lis = e.target.querySelectorAll('li');
                lis.forEach((li, i) => {
                  setTimeout(() => li.classList.add('in'), reduce ? 0 : i * 100);
                });
                baio.unobserve(e.target);
              }
            });
          },
          { threshold: 0.2 }
        );
        root.querySelectorAll('.oc-before, .oc-after').forEach((g) => baio.observe(g));
        cleanups.push(() => baio.disconnect());

        const pio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) { e.target.classList.add('in'); pio.unobserve(e.target); }
            });
          },
          { threshold: 0.25 }
        );
        miniCards.forEach((c) => pio.observe(c));
        cleanups.push(() => pio.disconnect());
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
    <div className="b2b-root" id="top" ref={rootRef}>
      <SiteNav />

      <main className="page" style={{ paddingTop: 'calc(40px + 72px + var(--pad))' }}>

        {/* ===================== 1 · HERO ===================== */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-top"></div>
          <div className="hero-headline">
            <h1><span className="g0">B2B</span><span className="mark">✳</span><span className="ghost">DATABASE</span></h1>
          </div>
          <div className="hero-grid">
            <div className="hero-left lp">
              <div className="hero-eyebrow reveal">
                <span className="tag">✳ B2B DATABASE</span>
                <span className="comp">200M+ CONTACTS · ZEROBOUNCE-VERIFIED</span>
              </div>
              <h2 className="lp-headline reveal">
                Your next 100 ICP prospects. <span className="dim">One sentence away.</span>
              </h2>
              <p className="lp-sub reveal">Outmate's B2B database is searchable via natural language — no filters, no dropdowns, no export tables. Type exactly who you're looking for, get a verified, ICP-scored, enriched contact list in under 3 seconds. Every record tagged with live buying signals in real-time.</p>
              <div className="cta-row reveal">
                <a href="#how-it-works" className="btn solid">SEARCH THE DATABASE →</a>
                <a href="#how-it-works" className="btn">SEE IT IN ACTION</a>
              </div>
              <span className="micro reveal">200M+ contacts · NLP search powered by AI · ZeroBounce-verified emails · Live buying signals</span>
              <div className="hero-trust reveal"><span className="stars">★ 4.8</span> ON G2 · 200+ REVIEWS</div>
            </div>

            <div className="hero-right">
              <span className="corner tl">outmate / nlp search</span>
              <span className="corner bl">200M+ contacts · 2026</span>
              <span className="plus p1">+</span><span className="plus p2">+</span>
              <span className="tick t1"></span><span className="tick t2"></span>

              <div className="mock reveal">
                {/* head */}
                <div className="db-mock-head">
                  <span className="db-title">outmate / b2b_database</span>
                  <span className="db-live"><span className="dot"></span>LIVE · 200M+ RECORDS</span>
                </div>
                {/* query */}
                <div className="db-query-bar">
                  <span className="dq-icon">⌕</span>
                  <span className="dq-text">CTOs at Series B SaaS in the US hiring sales teams</span>
                  <span className="dq-time">2.8s</span>
                </div>
                {/* column headers */}
                <div className="db-col-heads">
                  <span>CONTACT</span>
                  <span>SIGNALS</span>
                  <span>ICP</span>
                </div>
                {/* row 1 (hot) */}
                <div className="db-row db-hot">
                  <div className="db-contact">
                    <div className="db-name">Daniel Okafor</div>
                    <div className="db-role">CTO · APEX SYSTEMS · SF</div>
                  </div>
                  <div className="db-signals">
                    <span className="db-tag v">email ✓</span>
                    <span className="db-tag v">phone ✓</span>
                    <span className="db-tag sig">hiring 4 AEs</span>
                  </div>
                  <div className="db-score-col">
                    <div className="db-icp">94</div>
                    <div className="db-icp-lbl">ICP fit</div>
                    <div className="db-icp-bar"><i style={{ width: '94%' }}></i></div>
                  </div>
                </div>
                {/* row 2 */}
                <div className="db-row">
                  <div className="db-contact">
                    <div className="db-name">Priya Nair</div>
                    <div className="db-role">CTO · ZEPHYR CLOUD · NYC</div>
                  </div>
                  <div className="db-signals">
                    <span className="db-tag v">email ✓</span>
                    <span className="db-tag sig">$40M raised</span>
                  </div>
                  <div className="db-score-col">
                    <div className="db-icp">88</div>
                    <div className="db-icp-lbl">ICP fit</div>
                    <div className="db-icp-bar"><i style={{ width: '88%' }}></i></div>
                  </div>
                </div>
                {/* row 3 */}
                <div className="db-row">
                  <div className="db-contact">
                    <div className="db-name">Marcus Reed</div>
                    <div className="db-role">VP ENG · CASCADE LABS · BOSTON</div>
                  </div>
                  <div className="db-signals">
                    <span className="db-tag v">email ✓</span>
                    <span className="db-tag sig">new CRO hired</span>
                  </div>
                  <div className="db-score-col">
                    <div className="db-icp">81</div>
                    <div className="db-icp-lbl">ICP fit</div>
                    <div className="db-icp-bar"><i style={{ width: '81%' }}></i></div>
                  </div>
                </div>
                {/* row 4 */}
                <div className="db-row">
                  <div className="db-contact">
                    <div className="db-name">Lena Hart</div>
                    <div className="db-role">CTO · NORTHWIND · LONDON</div>
                  </div>
                  <div className="db-signals">
                    <span className="db-tag v">linkedin ✓</span>
                    <span className="db-tag sig">G2 intent</span>
                  </div>
                  <div className="db-score-col">
                    <div className="db-icp">76</div>
                    <div className="db-icp-lbl">ICP fit</div>
                    <div className="db-icp-bar"><i style={{ width: '76%' }}></i></div>
                  </div>
                </div>
                {/* foot */}
                <div className="db-foot">
                  <span>200M+ scanned · 142 matches · enriched</span>
                  <span className="df-acc">✳ READY</span>
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
                <h2 className="sec-title">Your contact database is large. Your pipeline from it is <span className="acc">tiny.</span></h2>
              </div>
              <div className="prob-body">
                <p>You set 12 filters. Export 500 contacts. Upload to Clay. Build a waterfall. Wait. Get 200 enriched records. Write a sequence. Send it.</p>
                <p>Three weeks later: 6 replies, 1 meeting.</p>
                <p>The problem isn't the data. It's the process. Every step between "I know who I want to reach" and "they got my email" is manual, slow, and technical. And by the time your sequence lands, half the signals that made those contacts relevant have already changed.</p>
              </div>
            </div>
            <div className="prob-stats">
              <div className="prob-stat">
                <div className="n">12+</div>
                <div className="l">steps between identifying a prospect and sending a personalised email</div>
              </div>
              <div className="prob-stat">
                <div className="n">3–5 days</div>
                <div className="l">average time from "I want to target funded fintechs" to first email sent</div>
              </div>
              <div className="prob-stat">
                <div className="n">30–40%</div>
                <div className="l">of B2B contact data goes stale every year</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 4 · HOW IT WORKS ===================== */}
        <section className="bighead" id="how-it-works" data-screen-label="How it works">
          <div className="strip">
            <div className="track" id="bigtrack">
              <span className="g0">SEARCH</span><span className="mark">✳</span><span className="g1">SEARCH</span><span className="mark">✳</span><span className="g2">SEARCH</span><span className="mark">✳</span><span className="g0">SEARCH</span><span className="mark">✳</span>
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-intro reveal">
              <span className="brand-chip"><span className="glyph">✳</span><span>Outmate</span></span>
              <h2>THE WAY PROSPECTING SHOULD HAVE ALWAYS WORKED.</h2>
              <p>No filters. No exports. No enrichment tables. Just tell Outmate who you're looking for.</p>
            </div>

            <div className="steps sales-steps">

              <div className="step reveal" data-screen-label="Step / Search">
                <div className="sn">
                  <span className="step-badge">✳ SEARCH</span>
                  <b>01</b>
                </div>
                <div className="ico">⌕</div>
                <h3>Type exactly who you want. <span className="acc">In plain English.</span></h3>
                <p>Type "CTOs at Series B SaaS companies in the US hiring sales teams right now" — Outmate queries 200M+ contacts in real-time and returns results in under 3 seconds. No dropdowns. No boolean logic.</p>
                <div className="smock">
                  <div className="smock-bar"><span>nlp_search · live</span><span className="s-live">&lt; 3 SECONDS</span></div>
                  <div className="smock-row"><span className="sr-hot">→ "VP Sales at funded UK SaaS…"</span><span className="sr-tag">PARSING</span></div>
                  <div className="smock-row"><span>ROLE · STAGE · GEO · SIGNAL</span><span className="sr-tag">MATCHED</span></div>
                  <div className="smock-row"><span>200M+ contacts scanned</span><span className="sr-tag">142 HITS</span></div>
                  <div className="smock-row"><span className="sr-hot">Ranked by ICP fit</span><span className="sr-tag">READY</span></div>
                </div>
                <div className="cap"><span className="d"></span>Natural language → contact list · Results in &lt; 3 seconds</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Enrich">
                <div className="sn">
                  <span className="step-badge">✳ ENRICH &amp; SCORE</span>
                  <b>02</b>
                </div>
                <div className="ico">✦</div>
                <h3>Every result verified and ICP-scored <span className="acc">before you see it.</span></h3>
                <p>Every contact is run through waterfall enrichment — verified email, phone, LinkedIn, firmographics, tech stack, funding stage — then scored 0–100 against your ICP. Ranked by fit, not alphabet.</p>
                <div className="scrm">
                  <div className="scrm-bar"><span>enrichment · waterfall</span><span className="s-sync">✓ VERIFIED</span></div>
                  <div className="scrm-row"><span className="sr-label">Email</span><span className="sr-acc">d.okafor@apex.io</span><span className="sr-badge">ZEROBOUNCE</span></div>
                  <div className="scrm-row"><span className="sr-label">Direct phone</span><span className="sr-val">+1 415 ••• ••42</span><span className="sr-badge">FOUND</span></div>
                  <div className="scrm-row"><span className="sr-label">Tech stack</span><span className="sr-val">Salesforce · Outreach</span><span className="sr-badge">PDL</span></div>
                  <div className="scrm-row"><span className="sr-label">ICP score</span><span className="sr-acc">94 / 100</span><span className="sr-badge">RANKED</span></div>
                </div>
                <div className="cap"><span className="d"></span>Waterfall enrichment · PDL, Hunter, BetterContact · ICP score on every record</div>
              </div>

              <div className="step reveal" data-screen-label="Step / Act">
                <div className="sn">
                  <span className="step-badge">✳ ACT</span>
                  <b>03</b>
                </div>
                <div className="ico">⚡</div>
                <h3>One click to outreach, CRM, <span className="acc">or sequence.</span></h3>
                <p>Select contacts, hit one button — added to a sequence, pushed to HubSpot or Salesforce, or handed to the AI SDR. No CSV. No copy-paste. No Zapier.</p>
                <div className="smock">
                  <div className="smock-bar"><span>action · 38 selected</span><span className="s-live">ONE CLICK</span></div>
                  <div className="smock-row"><span className="sr-hot">→ Enrol in sequence</span><span className="sr-tag">OUTMATE OUTREACH</span></div>
                  <div className="smock-row"><span>→ Push to CRM</span><span className="sr-tag">HUBSPOT · SALESFORCE</span></div>
                  <div className="smock-row"><span>→ Hand to AI SDR</span><span className="sr-tag">AUTO-WRITES</span></div>
                  <div className="smock-row"><span className="sr-hot">No CSV · No Zapier</span><span className="sr-tag">DONE</span></div>
                </div>
                <div className="cap"><span className="d"></span>One-click sequence enrol · CRM push · AI SDR activation</div>
              </div>

            </div>
          </div>

          <div className="how-highlight reveal">
            Query typed → enriched, ICP-scored contact list: <span className="acc">under 3 seconds.</span>
            <span className="chip">No filters · No exports</span>
          </div>
        </section>

        {/* ===================== 5 · WHAT YOU GET ===================== */}
        <section className="section" data-screen-label="What you get">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[02]</span><span className="kicker">What you get</span></div>
              <h2 className="sec-title">200M contacts. Live signals.<br /><span className="acc">Zero manual work.</span></h2>
              <p className="sec-sub">Every record enriched, scored, and tagged with live buying signals — ready to contact in one click.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="kx">
              <div className="kx-tabs" role="tablist">
                <button className="kx-tab" role="tab" aria-selected="true" data-k="0"><span className="kn">01</span><span className="kt">NLP search engine</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="1"><span className="kn">02</span><span className="kt">Live buying signals on every record</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="2"><span className="kn">03</span><span className="kt">Waterfall enrichment</span><span className="ka">→</span></button>
                <button className="kx-tab" role="tab" aria-selected="false" data-k="3"><span className="kn">04</span><span className="kt">Buying committee mapping</span><span className="ka">→</span></button>
              </div>
              <div className="kx-stage">
                <div className="kx-pane on" data-k="0">
                  <span className="ptag">✳ Plain-English search</span>
                  <h3>NLP search engine</h3>
                  <p>No filters. No dropdowns. Type "VP Sales at funded UK SaaS companies hiring SDRs" and get a verified, ICP-scored contact list in under 3 seconds. The only B2B database searchable in plain English.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>nlp_search · 200M+ contacts</span><span className="live"><span className="dot"></span>&lt; 3 SECONDS</span></div>
                      <div className="feed">
                        <div className="feed-row"><div><div className="feed-co">Daniel Okafor — VP Sales</div><div className="feed-meta">CAMBER PAY · SERIES B · LONDON</div></div><div className="score hot"><span className="bar"><i style={{ width: '94%' }}></i></span><b>94</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Priya Nair — VP Sales</div><div className="feed-meta">ZEPHYR CLOUD · HIRING 3 SDRS</div></div><div className="score"><span className="bar"><i style={{ width: '88%' }}></i></span><b>88</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Marcus Reed — Head of Sales</div><div className="feed-meta">CASCADE LABS · $22M RAISED</div></div><div className="score"><span className="bar"><i style={{ width: '80%' }}></i></span><b>80</b></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="1">
                  <span className="ptag">✳ Real-time intent</span>
                  <h3>Live buying signals on every record</h3>
                  <p>Every contact is tagged with active buying signals in real-time — funding rounds, hiring activity, tech stack changes, G2 intent, job changes. You don't just know who they are. You know why to reach out right now.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>live_signals · updated daily</span><span className="live"><span className="dot"></span>REAL-TIME</span></div>
                      <div className="feed">
                        <div className="feed-row"><div><div className="feed-co">Apex Systems</div><div className="feed-meta">✳ RAISED SERIES B · 2 DAYS AGO</div></div><div className="score hot"><span className="bar"><i style={{ width: '96%' }}></i></span><b>hot</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Zephyr Cloud</div><div className="feed-meta">→ HIRING 4 AES · G2 INTENT SPIKE</div></div><div className="score"><span className="bar"><i style={{ width: '84%' }}></i></span><b>new</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Cascade Labs</div><div className="feed-meta">✳ ADDED SALESFORCE · NEW CRO</div></div><div className="score"><span className="bar"><i style={{ width: '72%' }}></i></span><b>new</b></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="2">
                  <span className="ptag">✳ Multi-source</span>
                  <h3>Waterfall enrichment</h3>
                  <p>Every result enriched through a multi-source waterfall — PDL, Hunter, BetterContact — to give you verified work email, direct phone, LinkedIn URL, firmographics, and tech stack. Cheapest source tried first. You only pay credits for what we actually find.</p>
                  <div className="kx-vis">
                    <div className="kcontact">
                      <div className="top">
                        <span className="av">DO</span>
                        <span><span className="nm">Daniel Okafor — CTO, Apex Systems</span><div className="rl">Enriched via waterfall · 4 sources tried</div></span>
                      </div>
                      <div className="kfields">
                        <div className="kfield"><span className="l">WORK EMAIL</span><span className="acc">d.okafor@apex.io · verified</span></div>
                        <div className="kfield"><span className="l">DIRECT PHONE</span><span>+1 415 ••• ••42 · found</span></div>
                        <div className="kfield"><span className="l">TECH STACK</span><span>Salesforce · Outreach · AWS</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kx-pane" data-k="3">
                  <span className="ptag">✳ Full room</span>
                  <h3>Buying committee mapping</h3>
                  <p>Don't just reach one person. Outmate maps the full buying committee at every target account — decision-maker, champion, technical buyer, and blocker — so your outreach covers the full room, not just one inbox.</p>
                  <div className="kx-vis">
                    <div className="kfeed">
                      <div className="kf-bar"><span>account · Apex Systems</span><span className="live"><span className="dot"></span>COMMITTEE MAPPED</span></div>
                      <div className="feed">
                        <div className="feed-row"><div><div className="feed-co">Sara Lin — VP Revenue</div><div className="feed-meta">DECISION-MAKER · BUDGET OWNER</div></div><div className="score hot"><span className="bar"><i style={{ width: '93%' }}></i></span><b>DM</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Daniel Okafor — CTO</div><div className="feed-meta">TECHNICAL BUYER · EVALUATES</div></div><div className="score"><span className="bar"><i style={{ width: '78%' }}></i></span><b>TB</b></div></div>
                        <div className="feed-row"><div><div className="feed-co">Priya Nair — RevOps Lead</div><div className="feed-meta">CHAMPION · DAY-TO-DAY USER</div></div><div className="score"><span className="bar"><i style={{ width: '70%' }}></i></span><b>CH</b></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 6 · DEEP DIVE (signature NLP search) ===================== */}
        <section className="section" data-screen-label="Deep Dive">
          <div className="card-dark reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[03]</span><span className="kicker">NLP search</span></div>
              <h2 className="sec-title">Type who you want. Get them, enriched<br />and scored, <span className="acc">in 3 seconds.</span></h2>
              <p className="sec-sub">No filters. No dropdowns. No boolean logic. Describe your ideal prospect in a sentence — Outmate parses it, queries 200M+ contacts, and returns a verified, ICP-scored list.</p>
            </div>

            <div className="dd-tabs" role="tablist">
              <button className="dd-tab" role="tab" aria-selected="true" data-q="0">FUNDED FINTECH</button>
              <button className="dd-tab" role="tab" aria-selected="false" data-q="1">SERIES B SAAS</button>
              <button className="dd-tab" role="tab" aria-selected="false" data-q="2">BY TECH STACK</button>
            </div>

            <div className="nlp">
              {/* pane 0 */}
              <div className="nlp-pane on" data-q="0">
                <div className="nlp-search">
                  <span className="nlp-ico">⌕</span>
                  <span className="nlp-field"><span className="nlp-typed"></span><span className="nlp-caret"></span></span>
                  <span className="nlp-go">SEARCH</span>
                </div>
                <div className="nlp-parse">
                  <span className="nlp-chip"><span className="ck">role</span>VP Sales</span>
                  <span className="nlp-chip"><span className="ck">industry</span>Fintech</span>
                  <span className="nlp-chip"><span className="ck">stage</span>Funded</span>
                  <span className="nlp-chip"><span className="ck">geo</span>United Kingdom</span>
                  <span className="nlp-chip"><span className="ck">signal</span>Hiring SDRs</span>
                </div>
                <div className="nlp-results">
                  <div className="nlp-rmeta"><span>200M+ contacts scanned · <span className="hot">96 matches</span></span><span className="timer">2.8s</span></div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Henry Cole — VP Sales</div>
                      <div className="ro">CAMBER PAY · LONDON · SERIES B</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">phone <span className="v">✓</span></span><span className="nlp-badge">linkedin <span className="v">✓</span></span><span className="nlp-badge">hiring 3 sdrs</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">94<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '94%' }}></i></div></div>
                  </div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Amara Singh — VP Sales</div>
                      <div className="ro">VAULT FINANCE · MANCHESTER · $30M</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">phone <span className="v">✓</span></span><span className="nlp-badge">g2 intent</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">89<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '89%' }}></i></div></div>
                  </div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Tom Becker — Head of Sales</div>
                      <div className="ro">LEDGERLY · LONDON · SEED+</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">linkedin <span className="v">✓</span></span><span className="nlp-badge">hiring</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">82<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '82%' }}></i></div></div>
                  </div>
                </div>
              </div>

              {/* pane 1 */}
              <div className="nlp-pane" data-q="1">
                <div className="nlp-search">
                  <span className="nlp-ico">⌕</span>
                  <span className="nlp-field"><span className="nlp-typed"></span><span className="nlp-caret"></span></span>
                  <span className="nlp-go">SEARCH</span>
                </div>
                <div className="nlp-parse">
                  <span className="nlp-chip"><span className="ck">role</span>CTO</span>
                  <span className="nlp-chip"><span className="ck">stage</span>Series B</span>
                  <span className="nlp-chip"><span className="ck">industry</span>SaaS</span>
                  <span className="nlp-chip"><span className="ck">geo</span>United States</span>
                  <span className="nlp-chip"><span className="ck">signal</span>Hiring sales</span>
                </div>
                <div className="nlp-results">
                  <div className="nlp-rmeta"><span>200M+ contacts scanned · <span className="hot">142 matches</span></span><span className="timer">2.6s</span></div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Daniel Okafor — CTO</div>
                      <div className="ro">APEX SYSTEMS · SF · SERIES B</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">phone <span className="v">✓</span></span><span className="nlp-badge">linkedin <span className="v">✓</span></span><span className="nlp-badge">hiring 4 aes</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">94<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '94%' }}></i></div></div>
                  </div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Priya Nair — CTO</div>
                      <div className="ro">ZEPHYR CLOUD · NYC · $40M RAISED</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">phone <span className="v">✓</span></span><span className="nlp-badge">g2 intent</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">88<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '88%' }}></i></div></div>
                  </div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Marcus Reed — VP Engineering</div>
                      <div className="ro">CASCADE LABS · BOSTON · SERIES B</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">linkedin <span className="v">✓</span></span><span className="nlp-badge">new cro</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">81<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '81%' }}></i></div></div>
                  </div>
                </div>
              </div>

              {/* pane 2 */}
              <div className="nlp-pane" data-q="2">
                <div className="nlp-search">
                  <span className="nlp-ico">⌕</span>
                  <span className="nlp-field"><span className="nlp-typed"></span><span className="nlp-caret"></span></span>
                  <span className="nlp-go">SEARCH</span>
                </div>
                <div className="nlp-parse">
                  <span className="nlp-chip"><span className="ck">role</span>Head of RevOps</span>
                  <span className="nlp-chip"><span className="ck">tech</span>Salesforce</span>
                  <span className="nlp-chip"><span className="ck">tech</span>Outreach</span>
                  <span className="nlp-chip"><span className="ck">geo</span>North America</span>
                </div>
                <div className="nlp-results">
                  <div className="nlp-rmeta"><span>200M+ contacts scanned · <span className="hot">211 matches</span></span><span className="timer">2.9s</span></div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Elena Vance — Head of RevOps</div>
                      <div className="ro">NORTHWIND · CHICAGO · 500–1K</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">phone <span className="v">✓</span></span><span className="nlp-badge">salesforce</span><span className="nlp-badge">outreach</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">92<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '92%' }}></i></div></div>
                  </div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Raj Patel — RevOps Director</div>
                      <div className="ro">HALCYON · TORONTO · 200–500</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">linkedin <span className="v">✓</span></span><span className="nlp-badge">salesforce</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">85<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '85%' }}></i></div></div>
                  </div>
                  <div className="nlp-row">
                    <div className="nlp-id">
                      <div className="nm">Mia Torres — Head of RevOps</div>
                      <div className="ro">MERIDIAN · AUSTIN · 1K+</div>
                      <div className="nlp-badges"><span className="nlp-badge">email <span className="v">✓</span></span><span className="nlp-badge">phone <span className="v">✓</span></span><span className="nlp-badge">outreach</span></div>
                    </div>
                    <div className="nlp-right"><div className="nlp-score">79<span className="lbl">ICP fit</span></div><div className="nlp-bar"><i style={{ width: '79%' }}></i></div></div>
                  </div>
                </div>
              </div>

              <div className="nlp-note"><span className="acc">✳</span> Every record is enriched and ICP-scored before it reaches you — and tagged with the live signal that makes it relevant today.</div>
            </div>
          </div>
        </section>

        {/* ===================== 7 · INTEGRATIONS ===================== */}
        <section className="section" data-screen-label="Integrations">
          <div className="card-lg reveal">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[04]</span><span className="kicker">Integrations</span></div>
              <h2 className="sec-title">Enrich from the best.<br /><span className="acc">Act in your stack.</span></h2>
            </div>
            <div className="ig-rows ig-light">
              <div className="ig-row reveal">
                <span className="ig-idx">01</span>
                <span className="ig-cat">Enrichment</span>
                <div className="ig-pills-wrap">
                  <span className="ig-pill"><span className="gl">◇</span>PDL</span>
                  <span className="ig-pill"><span className="gl">◉</span>Hunter</span>
                  <span className="ig-pill"><span className="gl">✦</span>BetterContact</span>
                  <span className="ig-pill"><span className="gl">✓</span>ZeroBounce</span>
                </div>
              </div>
              <div className="ig-row reveal">
                <span className="ig-idx">02</span>
                <span className="ig-cat">CRM</span>
                <div className="ig-pills-wrap">
                  <span className="ig-pill"><span className="gl">◢</span>Salesforce</span>
                  <span className="ig-pill"><span className="gl">✳</span>HubSpot</span>
                  <span className="ig-pill"><span className="gl">▦</span>Pipedrive</span>
                </div>
              </div>
              <div className="ig-row reveal">
                <span className="ig-idx">03</span>
                <span className="ig-cat">Outreach</span>
                <div className="ig-pills-wrap">
                  <span className="ig-pill"><span className="gl">✉</span>Gmail</span>
                  <span className="ig-pill"><span className="gl">▤</span>Outlook</span>
                  <span className="ig-pill"><span className="gl">⬡</span>Apollo</span>
                  <span className="ig-pill"><span className="gl">◆</span>Lemlist</span>
                </div>
              </div>
              <div className="ig-row reveal">
                <span className="ig-idx">04</span>
                <span className="ig-cat">Workflow</span>
                <div className="ig-pills-wrap">
                  <span className="ig-pill"><span className="gl">▣</span>Slack</span>
                  <span className="ig-pill"><span className="gl">in</span>LinkedIn</span>
                  <span className="ig-pill"><span className="gl">⚡</span>Zapier</span>
                </div>
              </div>
            </div>
            <div className="ig-mq">
              <div className="ig-mq-track">
                <span className="ig-mq-item sub">all integrations native · no glue code →</span>
                <span className="ig-mq-item"><span className="gl">◇</span>PDL</span>
                <span className="ig-mq-item"><span className="gl">◉</span>Hunter</span>
                <span className="ig-mq-item"><span className="gl">✦</span>BetterContact</span>
                <span className="ig-mq-item"><span className="gl">◢</span>Salesforce</span>
                <span className="ig-mq-item"><span className="gl">✳</span>HubSpot</span>
                <span className="ig-mq-item"><span className="gl">▣</span>Slack</span>
                <span className="ig-mq-item"><span className="gl">✉</span>Gmail</span>
                <span className="ig-mq-item"><span className="gl">▤</span>Outlook</span>
                <span className="ig-mq-item"><span className="gl">in</span>LinkedIn</span>
                <span className="ig-mq-item"><span className="gl">⬡</span>Apollo</span>
                <span className="ig-mq-item"><span className="gl">⚡</span>Zapier</span>
                <span className="ig-mq-item sub">all integrations native · no glue code →</span>
                <span className="ig-mq-item"><span className="gl">◇</span>PDL</span>
                <span className="ig-mq-item"><span className="gl">◉</span>Hunter</span>
                <span className="ig-mq-item"><span className="gl">✦</span>BetterContact</span>
                <span className="ig-mq-item"><span className="gl">◢</span>Salesforce</span>
                <span className="ig-mq-item"><span className="gl">✳</span>HubSpot</span>
                <span className="ig-mq-item"><span className="gl">▣</span>Slack</span>
                <span className="ig-mq-item"><span className="gl">✉</span>Gmail</span>
                <span className="ig-mq-item"><span className="gl">▤</span>Outlook</span>
                <span className="ig-mq-item"><span className="gl">in</span>LinkedIn</span>
                <span className="ig-mq-item"><span className="gl">⬡</span>Apollo</span>
                <span className="ig-mq-item"><span className="gl">⚡</span>Zapier</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8 · OUTCOMES ===================== */}
        <section className="section" data-screen-label="Outcomes">
          <div className="card-lg reveal" id="oc-section">
            <div className="pad-xl" style={{ paddingBottom: 0 }}>
              <div className="sec-head"><span className="num">[05]</span><span className="kicker">Outcomes</span></div>
              <h2 className="sec-title">Less time finding prospects.<br /><span className="acc">More time closing them.</span></h2>
              <p className="sec-sub">Teams using Outmate's database stop spending half their week on research — and start spending it on conversations.</p>
              <div style={{ height: 'clamp(26px,3vw,48px)' }}></div>
            </div>
            <div className="oc-metrics oc-light">
              <div className="oc-metric" style={{ ['--bar-scale' as string]: 1 }}>
                <div className="oc-n">&lt;&nbsp;3s</div>
                <div className="oc-l">from NLP query to verified, ICP-scored contact list across 200M+ records</div>
                <div className="oc-bar"><i></i></div>
              </div>
              <div className="oc-metric" style={{ ['--bar-scale' as string]: 0.8 }}>
                <div className="oc-n">12+</div>
                <div className="oc-l">steps eliminated — Apollo → Clay → CRM → sequence collapsed into one</div>
                <div className="oc-bar"><i></i></div>
              </div>
              <div className="oc-metric" style={{ ['--bar-scale' as string]: 0.65 }}>
                <div className="oc-n">3–5×</div>
                <div className="oc-l">higher reply rates when outreach references live buying signals vs static data</div>
                <div className="oc-bar"><i></i></div>
              </div>
              <div className="oc-metric" style={{ ['--bar-scale' as string]: 0.72 }}>
                <div className="oc-n">5+ hrs</div>
                <div className="oc-l">saved per rep, per week, on prospecting, list-building, and enrichment</div>
                <div className="oc-bar"><i></i></div>
              </div>
            </div>
            <div className="oc-ba oc-ba-light">
              <div className="oc-before">
                <div className="oc-ba-hdr">Before Outmate</div>
                <ul>
                  <li><span className="mk">✕</span>12 filter dropdowns to build a prospect list</li>
                  <li><span className="mk">✕</span>Export CSV → upload to Clay → wait for enrichment → push to CRM</li>
                  <li><span className="mk">✕</span>Contacts are stale before the sequence even starts</li>
                  <li><span className="mk">✕</span>No signal context — just a name, title, and email</li>
                </ul>
              </div>
              <div className="oc-after">
                <div className="oc-ba-hdr">With Outmate</div>
                <ul>
                  <li><span className="mk">✳</span>One sentence search returns enriched, scored contacts in 3 seconds</li>
                  <li><span className="mk">✳</span>One click to sequence, CRM, or AI SDR</li>
                  <li><span className="mk">✳</span>Every contact tagged with the live signal that makes them relevant today</li>
                  <li><span className="mk">✳</span>Buying committee mapped before the first email goes out</li>
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
              <h2 className="sec-title">Built for teams that live<br />in the <span className="acc">pipeline.</span></h2>
            </div>
            <div className="pf-grid">
              <div className="pf-featured">
                <div className="pf-qmark">"</div>
                <blockquote className="pf-quote">We deleted three tools the week we switched. One sentence in, an enriched and scored list out — our SDRs stopped living in spreadsheets.</blockquote>
                <div className="pf-stars">★ ★ ★ ★ ★</div>
                <div className="pf-who">
                  <span className="pf-nm">VP of Sales</span>
                  <span className="pf-ro">B2B SaaS</span>
                </div>
              </div>
              <div className="pf-stack">
                <div className="pf-mini">
                  <div className="pf-mini-stars">★★★★★</div>
                  <div className="pf-mini-q">"</div>
                  <p className="pf-mini-text">The live signals are the difference. We reach out the day a company raises, not three weeks later when the list finally finishes enriching.</p>
                  <div className="pf-mini-who">
                    <span className="pf-mini-nm">Head of Growth</span>
                    <span className="pf-mini-ro">Fintech</span>
                  </div>
                </div>
                <div className="pf-mini">
                  <div className="pf-mini-stars">★★★★★</div>
                  <div className="pf-mini-q">"</div>
                  <p className="pf-mini-text">Typing what I want and getting verified contacts in three seconds felt illegal the first time. Now my whole team prospects this way.</p>
                  <div className="pf-mini-who">
                    <span className="pf-mini-nm">SDR Manager</span>
                    <span className="pf-mini-ro">Enterprise Tech</span>
                  </div>
                </div>
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
                <div className="badge"><div className="bi">✓</div><div className="bt">GDPR-ready</div><div className="bd">Consent mode · DSAR support</div></div>
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
                <summary><span className="q">How is this different from Apollo or ZoomInfo?</span><span className="tog">+</span></summary>
                <div className="a"><p>Apollo and ZoomInfo use filter-based UIs — you set dropdowns, export a CSV, and enrich separately. <span className="acc">Outmate's database is searchable in plain English</span>, every result is pre-enriched and ICP-scored before you see it, and every contact is tagged with live buying signals. No exports. No separate enrichment tool. No Clay waterfall to build.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">How fresh is the contact data?</span><span className="tog">+</span></summary>
                <div className="a"><p>Contacts are refreshed weekly via our enrichment waterfall — PDL, Hunter, and BetterContact. Email addresses are ZeroBounce-verified before being surfaced. Buying signals — funding, hiring, tech stack, job changes — are updated daily. <span className="acc">If a contact's data has changed, you'll see the updated record</span>, not a stale export from 6 months ago.</p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">What does the NLP search actually understand?</span><span className="tog">+</span></summary>
                <div className="a"><p>It understands role, seniority, company type, geography, company stage, recent signals, and combinations of all of them. "VP Sales at funded fintech companies in the UK hiring SDRs right now" — it parses every part of that sentence and queries accordingly. <span className="acc">If your query is too narrow to return results, it tells you and suggests a broader version.</span></p></div>
              </details>
              <details className="faq-item">
                <summary><span className="q">Do I need to export anything to use the contacts?</span><span className="tog">+</span></summary>
                <div className="a"><p>No. From the search results you can enrol contacts directly into an Outmate outreach sequence, push them to HubSpot or Salesforce, or activate the AI SDR to write and send emails on your behalf — <span className="acc">all without leaving the platform or touching a CSV.</span></p></div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== 12 · FINAL CTA ===================== */}
        <section className="section" id="start" data-screen-label="Final CTA">
          <div className="final-cta reveal">
            <span className="fc-ast">✳</span>
            <h2>Find your next<br />100 prospects.</h2>
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
              <h5>Search</h5>
              <ul>
                <li>NLP Search Engine</li>
                <li>Live Buying Signals</li>
                <li>ICP Scoring</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Enrich</h5>
              <ul>
                <li>Waterfall Enrichment</li>
                <li>Email &amp; Phone Verify</li>
                <li>Buying Committee Map</li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Act</h5>
              <ul>
                <li>One-click Sequence</li>
                <li>CRM Push</li>
                <li>AI SDR Activation</li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <div className="contact-main">
              <h2>CONTACT</h2>
              <p className="contact-tag">
                <span className="dim">YOUR NEXT 100 ICP PROSPECTS ARE ONE SENTENCE AWAY.</span> <span className="ast">✳</span>
                LET'S SHOW YOU THE SEARCH.
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
              <span className="small">2026 — Outmate. The B2B database you search in plain English.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
