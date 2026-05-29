import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Visitor = { id: number; company: string; page: string; badges: string[] };
type EnrichRow = { company: string; person: string; role: string; email: string; linkedIn: string };

const TABS = [
  'Visitor Intelligence',
  'Enrichment',
  'Signals',
  'Workflows',
  'Outbound AI',
  'Analytics',
];

export default function InteractiveSandbox() {
  const visitors = useMemo<Visitor[]>(() => [
    { id: 1, company: 'Stripe', page: 'Pricing Page', badges: ['Identified', 'High Intent'] },
    { id: 2, company: 'HubSpot', page: 'Integration Docs', badges: ['Identified'] },
    { id: 3, company: 'Gong', page: 'Compare Competitors', badges: ['High Intent', 'Decision Maker'] },
    { id: 4, company: 'Notion', page: 'Enterprise Page', badges: ['Identified', 'Buying Signal'] },
  ], []);

  const enrichment = useMemo<EnrichRow[]>(() => [
    { company: 'Stripe', person: 'Patrick Collison', role: 'CEO', email: 'patrick@stripe.com', linkedIn: 'patrick' },
    { company: 'HubSpot', person: 'Yamini Rangan', role: 'CEO', email: 'yamini@hubspot.com', linkedIn: 'yamini' },
    { company: 'Gong', person: 'CRO', role: 'CRO', email: 'cro@gong.com', linkedIn: '' },
    { company: 'Notion', person: 'VP Growth', role: 'VP Growth', email: 'vp@notion.com', linkedIn: '' },
  ], []);

  const signals = useMemo(() => [
    { id: 1, text: 'Pricing page visited', priority: 83, intent: 78, fit: 90 },
    { id: 2, text: 'Demo page revisited', priority: 75, intent: 69, fit: 85 },
    { id: 3, text: 'Competitor comparison viewed', priority: 88, intent: 82, fit: 78 },
    { id: 4, text: 'Team expansion detected', priority: 64, intent: 50, fit: 60 },
  ], []);

  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(() => visitors[0] ?? null);
  const [email, setEmail] = useState<string>('Hi Sarah, noticed your team has been evaluating...');
  const [metrics, setMetrics] = useState({ pipeline: 4200000, identified: 2847, meetings: 127, win: 41, influenced: 1800000 });

  useEffect(() => {
    const t = setInterval(() => {
      // subtle metric animation demo
      setMetrics((m) => ({ ...m, identified: m.identified + Math.round(Math.random() * 3) }));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  function regenerateEmail() {
    const samples = [
      `Hi ${selectedVisitor?.company || 'Team'}, I noticed your team has been evaluating...`,
      `Hey ${selectedVisitor?.company || 'there'}, quick note on how Outmate can help...`,
      `Hi ${selectedVisitor?.company || 'Friend'}, saw activity on your pricing page, curious...`,
    ];
    setEmail(samples[Math.floor(Math.random() * samples.length)]);
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Top Tabs */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E7EB] bg-gray-50">
        <div className="flex items-center gap-3">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active === i ? 'bg-white shadow-sm text-[#111111]' : 'text-[#4B5563] hover:bg-white/50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="h-full flex gap-4"
          >
            {active === 0 && (
              <div className="w-full h-full grid grid-cols-2 gap-4">
                <div className="col-span-1 bg-white border border-[#E5E7EB] rounded-2xl p-4 overflow-auto">
                  <div className="text-sm font-medium text-[#111111] mb-3">Live Visitor Feed</div>
                  <div className="space-y-3">
                    {visitors.map((v) => (
                      <div key={v.id} onClick={() => setSelectedVisitor(v)} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div>
                          <div className="font-medium text-[#111111]">{v.company}</div>
                          <div className="text-xs text-[#6B7280]">{v.page}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {v.badges.map((b: string) => (
                            <div key={b} className="text-[11px] px-2 py-1 rounded-full bg-[#F3F4F6] text-[#374151]">{b}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="text-sm font-semibold text-[#111111]">AI Summary</div>
                  <div className="text-sm text-[#4B5563]">{selectedVisitor ? `${selectedVisitor.company} — ${selectedVisitor.page}` : 'Select a visitor'}</div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="font-medium text-[#111111]">{selectedVisitor ? `VP Marketing at ${selectedVisitor.company}` : '—'}</div>
                    <div className="text-xs text-[#6B7280] mt-1">identified with high purchase intent.</div>
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    <button className="px-3 py-2 bg-[#111111] text-white rounded-md text-sm">Start sequence →</button>
                    <button className="px-3 py-2 border border-[#E5E7EB] text-[#111111] rounded-md text-sm">Enrich account →</button>
                    <button className="px-3 py-2 border border-[#E5E7EB] text-[#111111] rounded-md text-sm">Send to CRM →</button>
                  </div>
                </div>
              </div>
            )}

            {active === 1 && (
              <div className="w-full h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company or person" className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-md text-sm" />
                  <button onClick={() => setQuery('')} className="px-3 py-2 border border-[#E5E7EB] rounded-md text-sm">Clear</button>
                </div>
                <div className="flex-1 overflow-auto bg-white border border-[#E5E7EB] rounded-2xl p-3">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[#6B7280]">
                        <th className="py-2">Company</th>
                        <th className="py-2">Person</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">LinkedIn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrichment.filter(r => `${r.company} ${r.person}`.toLowerCase().includes(query.toLowerCase())).map((r) => (
                        <tr key={r.company} className="border-t border-transparent hover:bg-gray-50 cursor-pointer">
                          <td className="py-3 text-[#111111]">{r.company}</td>
                          <td className="py-3 text-[#111111]">{r.person}</td>
                          <td className="py-3 text-[#4B5563]">{r.role}</td>
                          <td className="py-3 text-[#4B5563]">{r.email}</td>
                          <td className="py-3 text-[#4B5563]">{r.linkedIn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {active === 2 && (
              <div className="w-full h-full grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 overflow-auto">
                  <div className="text-sm font-medium text-[#111111] mb-3">Signal Feed</div>
                  <div className="space-y-3">
                    {signals.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="font-medium text-[#111111]">{s.text}</div>
                          <div className="text-xs text-[#6B7280]">Priority {s.priority} • Intent {s.intent}</div>
                        </div>
                        <div className="text-sm text-[#4B5563]">Fit {s.fit}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <div className="text-sm font-medium text-[#111111] mb-2">Live Signals Summary</div>
                  <div className="text-[#4B5563] text-sm mb-4">Signals update in real-time to surface buyers and intent.</div>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between"><div className="text-sm text-[#111111]">Pricing page spikes</div><div className="text-sm text-[#7CFFCB]">+142%</div></div>
                    <div className="flex items-center justify-between"><div className="text-sm text-[#111111]">Competitor comparison views</div><div className="text-sm text-[#F59E0B]">+88%</div></div>
                    <div className="flex items-center justify-between"><div className="text-sm text-[#111111]">Hiring SDRs</div><div className="text-sm text-[#60A5FA]">New</div></div>
                  </div>
                </div>
              </div>
            )}

            {active === 3 && (
              <div className="w-full h-full bg-white border border-[#E5E7EB] rounded-2xl p-4 overflow-auto">
                <div className="text-sm font-medium text-[#111111] mb-3">Automation Builder</div>
                <div className="flex flex-col gap-4">
                  {['Visitor Identified','Enrich Contact','Score Intent','Create CRM Record','Launch Sequence','Notify SDR'].map((n, idx) => (
                    <div key={n} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#111111] font-medium">{idx+1}</div>
                      <div className="flex-1">
                        <div className="font-medium text-[#111111]">{n}</div>
                        <div className="text-xs text-[#6B7280]">Click node for options</div>
                      </div>
                      <div className="text-sm text-[#4B5563]">▶</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === 4 && (
              <div className="w-full h-full grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col">
                  <div className="text-sm font-medium text-[#111111] mb-2">Account</div>
                  <div className="text-lg font-semibold text-[#111111]">Stripe</div>
                  <div className="text-sm text-[#4B5563] mt-1">Contact • VP Marketing • Intent: High</div>

                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <div className="text-sm text-[#111111] font-medium mb-2">Generated Email</div>
                    <div className="text-sm text-[#4B5563] mb-3">{email}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={regenerateEmail} className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-sm">Regenerate</button>
                      <button onClick={() => alert('Approved (demo)')} className="px-3 py-2 bg-[#111111] text-white rounded text-sm">Approve</button>
                      <button onClick={() => alert('Sent (demo)')} className="px-3 py-2 border border-[#E5E7EB] rounded text-sm">Send</button>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <div className="text-sm font-medium text-[#111111] mb-2">Activity</div>
                  <div className="space-y-2">
                    <div className="text-sm text-[#6B7280]">Sequence queued</div>
                    <div className="text-sm text-[#6B7280]">Email personalization applied</div>
                    <div className="text-sm text-[#6B7280]">CRM record created</div>
                  </div>
                </div>
              </div>
            )}

            {active === 5 && (
              <div className="w-full h-full grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <div className="text-sm font-medium text-[#111111] mb-4">Key Metrics</div>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard label="Pipeline Generated" value={metrics.pipeline} prefix="$" />
                    <MetricCard label="Visitors Identified" value={metrics.identified} />
                    <MetricCard label="Meetings Booked" value={metrics.meetings} />
                    <MetricCard label="Win Rate" value={metrics.win} suffix="%" />
                    <MetricCard label="Revenue Influenced" value={metrics.influenced} prefix="$" />
                  </div>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
                  <div className="text-sm font-medium text-[#111111] mb-2">Pipeline Overview</div>
                  <div className="h-40 flex items-center justify-center text-[#6B7280]">[Animated charts demo]</div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MetricCard({ label, value, prefix = '', suffix = '' }: { label: string; value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const duration = 800;
    const from = 0;
    const to = value;
    function tick() {
      const t = Math.min(1, (Date.now() - start) / duration);
      const cur = Math.floor(from + (to - from) * t);
      setCount(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="p-3 bg-gray-50 rounded-md">
      <div className="text-xs text-[#4B5563]">{label}</div>
      <div className="text-lg font-semibold text-[#111111]">{prefix}{count.toLocaleString()}{suffix}</div>
    </div>
  );
}
