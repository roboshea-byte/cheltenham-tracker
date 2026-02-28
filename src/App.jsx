import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine,
} from 'recharts';
import {
  FESTIVAL_START, FESTIVAL_DAYS, CURRENT_GOING, GOING_HISTORY,
  WEATHER_FORECAST, FESTIVAL_FORECAST, RAIL_MOVEMENTS,
  KEY_RACES, GOING_OUTLOOK, DAY_PREDICTIONS, GOING_GUIDE,
  TRACK_FEATURES,
} from './data';

/* ──────────── PALETTE — Light theme matching Inside Rail ──────────── */
const C = {
  bg:       '#f8faf9',
  white:    '#ffffff',
  card:     '#ffffff',
  cardAlt:  '#f1f5f3',
  border:   '#e2e8e4',
  borderDk: '#d0d8d3',
  accent:   '#0f766e',    /* teal-green from Inside Rail */
  accentLt: '#e6f5f3',
  gold:     '#b8860b',
  goldLt:   '#fdf6e3',
  text:     '#1a2e23',
  textMid:  '#3d5a4a',
  textDim:  '#6b8a78',
  red:      '#dc2626',
  redLt:    '#fef2f2',
  orange:   '#d97706',
  orangeLt: '#fffbeb',
  blue:     '#2563eb',
  blueLt:   '#eff6ff',
  green:    '#16a34a',
  greenLt:  '#f0fdf4',
  oldLine:  '#b8860b',
  newLine:  '#0f766e',
  ccLine:   '#d97706',
  rainBar:  'rgba(37, 99, 235, 0.25)',
};

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace";

/* ──────────── HELPERS ──────────── */
function getGoingColour(going) {
  const g = going.toLowerCase();
  if (g.includes('heavy')) return C.red;
  if (g.includes('soft') && !g.includes('good')) return C.orange;
  if (g.includes('good to soft') || (g.includes('good') && g.includes('soft'))) return '#ca8a04';
  if (g.includes('good') && !g.includes('firm')) return C.green;
  if (g.includes('firm')) return C.accent;
  return C.text;
}
function getGoingBg(going) {
  const g = going.toLowerCase();
  if (g.includes('heavy')) return C.redLt;
  if (g.includes('soft') && !g.includes('good')) return C.orangeLt;
  if (g.includes('good to soft') || (g.includes('good') && g.includes('soft'))) return C.goldLt;
  if (g.includes('good') && !g.includes('firm')) return C.greenLt;
  return C.accentLt;
}
function getGoingStickColour(val) {
  if (val < 4) return C.red; if (val < 5.5) return C.orange;
  if (val < 7) return '#ca8a04'; if (val < 8.5) return C.green; return C.accent;
}
function getGradeColour(grade) {
  if (grade === 'G1') return { bg: C.gold, color: '#fff' };
  if (grade === 'G2') return { bg: '#64748b', color: '#fff' };
  return { bg: '#a16207', color: '#fff' };
}
function getCountdown() {
  const now = new Date(), start = new Date(FESTIVAL_START), diff = start - now;
  if (diff <= 0) return { days: 0, hours: 0, label: 'Festival is LIVE!' };
  return { days: Math.floor(diff / 864e5), hours: Math.floor((diff % 864e5) / 36e5), label: 'until first race' };
}
function goingValueToLabel(val) {
  if (val<=1.25) return 'Heavy'; if (val<=1.75) return 'Hvy/Sft'; if (val<=2.25) return 'Soft';
  if (val<=2.75) return 'Sft/GS'; if (val<=3.25) return 'Gd/Sft'; if (val<=3.75) return 'GS/Gd';
  if (val<=4.25) return 'Good'; if (val<=4.75) return 'Gd/GF'; if (val<=5.25) return 'Gd/Fm';
  if (val<=5.75) return 'GF/Fm'; if (val<=6.25) return 'Firm'; return 'Hard';
}

function GoingTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 16px',fontSize:13,boxShadow:'0 4px 12px rgba(0,0,0,0.08)',fontFamily:font}}>
      <div style={{fontWeight:700,color:C.text,marginBottom:6}}>{label}</div>
      {payload.map((p,i) => p.dataKey !== 'rainfall'
        ? <div key={i} style={{color:p.color,marginBottom:3,fontWeight:500}}>{p.name}: {goingValueToLabel(p.value)}</div>
        : <div key={i} style={{color:C.blue,marginBottom:3}}>Rainfall: {p.value}mm</div>
      )}
    </div>
  );
}

/* ──────────── REUSABLE COMPONENTS ──────────── */
const Card = ({ children, style }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: 28, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', ...style
  }}>{children}</div>
);

const CardTitle = ({ icon, children, right }) => (
  <div style={{
    fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 18,
    textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex',
    alignItems: 'center', gap: 8, fontFamily: font,
  }}>
    {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
    <span>{children}</span>
    {right && <span style={{ fontSize: 11, fontWeight: 500, color: C.textDim, marginLeft: 'auto', textTransform: 'none', letterSpacing: 0 }}>{right}</span>}
  </div>
);

const Pill = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s', fontFamily: font,
    border: active ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
    background: active ? C.accentLt : '#fff',
    color: active ? C.accent : C.textDim,
  }}>{children}</button>
);

function GoingScaleBar() {
  return (
    <div style={{ display: 'flex', borderRadius: 100, overflow: 'hidden', height: 10, marginBottom: 12 }}>
      {GOING_GUIDE.map((g, i) => <div key={i} style={{ flex: 1, background: g.colour, opacity: 0.85 }} title={g.name} />)}
    </div>
  );
}

/* ──────────── MAIN APP ──────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [raceDay, setRaceDay] = useState(1);
  const [predDay, setPredDay] = useState(1);
  const [countdown, setCountdown] = useState(getCountdown());
  useEffect(() => { const t = setInterval(() => setCountdown(getCountdown()), 60000); return () => clearInterval(t); }, []);

  const tabs = [
    { id: 'overview', label: '📋 Going Report' },
    { id: 'predictions', label: '🎯 Day Predictions' },
    { id: 'weather', label: '🌤️ Weather' },
    { id: 'chart', label: '📈 Going Trend' },
    { id: 'course', label: '🗺️ Course Map' },
    { id: 'guide', label: '📖 Going Guide' },
    { id: 'races', label: '🏆 Racecard' },
  ];

  return (
    <div style={{ fontFamily: font, background: C.bg, color: C.text, minHeight: '100vh', margin: 0, padding: 0 }}>

      {/* ───── HEADER ───── */}
      <header style={{
        background: '#fff', borderBottom: `1px solid ${C.border}`,
        padding: '24px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.5px' }}>
              <span style={{ color: C.accent }}>Cheltenham Festival 2026</span>
            </h1>
            <p style={{ fontSize: 14, color: C.textDim, margin: '4px 0 0', fontWeight: 400 }}>
              Going & Weather Tracker — Updated Daily
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {countdown.days > 0 ? (<>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: mono, color: C.accent, lineHeight: 1 }}>
                {countdown.days}<span style={{ fontSize: 16, color: C.textDim }}>d </span>
                {countdown.hours}<span style={{ fontSize: 16, color: C.textDim }}>h</span>
              </div>
              <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>{countdown.label}</div>
            </>) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>🟢 {countdown.label}</div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* ───── TAB BAR ───── */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}`,
          paddingBottom: 0, flexWrap: 'wrap', overflowX: 'auto',
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '12px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: 'none', background: 'transparent', fontFamily: font,
              color: activeTab === t.id ? C.accent : C.textDim,
              borderBottom: activeTab === t.id ? `2px solid ${C.accent}` : '2px solid transparent',
              transition: 'all 0.15s', marginBottom: -1, whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══════════ OVERVIEW ══════════ */}
        {activeTab === 'overview' && (<>
          <Card>
            <CardTitle icon="📋" right={new Date(CURRENT_GOING.asOf).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}>
              Current Going Report
            </CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {CURRENT_GOING.courses.map((c, i) => (
                <div key={i} style={{
                  background: getGoingBg(c.going), border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: 22, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>{c.name}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: getGoingColour(c.going), marginBottom: 4 }}>{c.going}</div>
                  <div style={{ fontSize: 13, color: C.textMid, marginBottom: 12 }}>{c.detail}</div>
                  <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: getGoingStickColour(c.goingStick) }}>{c.goingStick.toFixed(1)}</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>GoingStick Reading</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle icon="🔭" right={`Updated ${GOING_OUTLOOK.updated}`}>Going Outlook</CardTitle>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMid, marginTop: 0, marginBottom: 16 }}>{GOING_OUTLOOK.summary}</p>
            <div style={{
              background: C.accentLt, borderLeft: `3px solid ${C.accent}`,
              borderRadius: '0 10px 10px 0', padding: 18, marginBottom: 18,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Festival Going Prediction</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.text, margin: 0, fontWeight: 500 }}>{GOING_OUTLOOK.prediction}</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {GOING_OUTLOOK.keyFactors.map((f, i) => (
                <li key={i} style={{
                  fontSize: 14, color: C.textMid, padding: '8px 0',
                  borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5,
                }}>
                  <span style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>▸</span><span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardTitle icon="🚧">Rail Movements</CardTitle>
            {RAIL_MOVEMENTS.map((r, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{r.date}</div>
                <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.6 }}>{r.detail}</div>
              </div>
            ))}
          </Card>
        </>)}

        {/* ══════════ DAY PREDICTIONS ══════════ */}
        {activeTab === 'predictions' && (<>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {DAY_PREDICTIONS.map(d => <Pill key={d.day} active={predDay === d.day} onClick={() => setPredDay(d.day)}>Day {d.day} — {d.name}</Pill>)}
          </div>
          {(() => {
            const pred = DAY_PREDICTIONS.find(d => d.day === predDay);
            if (!pred) return null;
            return (<>
              <Card>
                <CardTitle icon="🎯" right={`${pred.course} · ${pred.date}`}>Day {pred.day} — {pred.name}</CardTitle>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                  <div style={{ background: getGoingBg(pred.predictedGoing), border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, textAlign: 'center', flex: '1 1 200px', minWidth: 180 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Predicted Going</div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: getGoingColour(pred.predictedGoing) }}>{pred.predictedGoing}</div>
                    <div style={{ fontSize: 13, color: C.textMid, marginTop: 4 }}>{pred.predictedDetail}</div>
                  </div>
                  <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, textAlign: 'center', flex: '1 1 140px', minWidth: 130 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>GoingStick Range</div>
                    <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: C.accent, marginTop: 6 }}>{pred.goingStickRange}</div>
                  </div>
                  <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, textAlign: 'center', flex: '1 1 140px', minWidth: 130 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Confidence</div>
                    <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6, color: pred.confidence === 'High' ? C.green : pred.confidence === 'Medium' ? '#ca8a04' : C.orange }}>{pred.confidence}</div>
                  </div>
                </div>
                <div style={{ background: C.accentLt, borderLeft: `3px solid ${C.accent}`, borderRadius: '0 10px 10px 0', padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Ground Analysis</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: C.text, margin: 0 }}>{pred.analysis}</p>
                </div>
              </Card>
              <Card>
                <CardTitle icon="💡">Race-by-Race Going Impact</CardTitle>
                {pred.impactNotes.map((note, i) => {
                  const [raceName, ...rest] = note.split(':');
                  return (
                    <div key={i} style={{ padding: '16px 0', borderBottom: i < pred.impactNotes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>{raceName}</div>
                      <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7 }}>{rest.join(':')}</div>
                    </div>
                  );
                })}
              </Card>
            </>);
          })()}
        </>)}

        {/* ══════════ WEATHER ══════════ */}
        {activeTab === 'weather' && (<>
          <Card>
            <CardTitle icon="🌤️">7-Day Weather Forecast</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 10 }}>
              {WEATHER_FORECAST.map((w, i) => (
                <div key={i} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim, marginBottom: 8 }}>{w.day}</div>
                  <div style={{ fontSize: 30, marginBottom: 4 }}>{w.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{w.high}°</div>
                  <div style={{ fontSize: 12, color: C.textDim }}>{w.low}° low</div>
                  <div style={{ fontSize: 12, color: C.blue, marginTop: 6, fontWeight: 600 }}>💧 {w.rain}%</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>💨 {w.wind}mph</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle icon="🎪" right="⚠️ Long range — low confidence">Festival Week Forecast</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {FESTIVAL_FORECAST.map((f, i) => (
                <div key={i} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, textAlign: 'center', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, background: C.accentLt, color: C.accent, padding: '3px 8px', borderRadius: 100 }}>Day {i + 1}</span>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, marginBottom: 4 }}>{f.day}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 10 }}>{f.name}</div>
                  <div style={{ fontSize: 34, marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{f.high}° / {f.low}°</div>
                  <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>{f.summary}</div>
                  <div style={{ fontSize: 12, color: C.blue, marginTop: 6, fontWeight: 600 }}>💧 {f.rain}%</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle icon="💧">Rainfall vs Going</CardTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={GOING_HISTORY} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fill: C.textDim, fontSize: 12 }} />
                <YAxis yAxisId="rain" orientation="right" tick={{ fill: C.blue, fontSize: 12 }} />
                <YAxis yAxisId="going" domain={[1, 5]} tick={{ fill: C.textDim, fontSize: 11 }} tickFormatter={v => goingValueToLabel(v)} />
                <Tooltip content={<GoingTooltip />} />
                <Bar yAxisId="rain" dataKey="rainfall" fill={C.rainBar} radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                <Line yAxisId="going" type="monotone" dataKey="oldCourse" stroke={C.oldLine} strokeWidth={2} dot={false} name="Old Course" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>)}

        {/* ══════════ CHART ══════════ */}
        {activeTab === 'chart' && (
          <Card>
            <CardTitle icon="📈">Going Trend — All Courses</CardTitle>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={GOING_HISTORY} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fill: C.textDim, fontSize: 12 }} />
                <YAxis domain={[1, 5]} tick={{ fill: C.textDim, fontSize: 11 }} tickFormatter={v => goingValueToLabel(v)} width={60} />
                <Tooltip content={<GoingTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="line" />
                <ReferenceLine y={2} stroke={C.red} strokeDasharray="5 5" label={{ value: 'Soft', fill: C.red, fontSize: 11, position: 'left' }} />
                <ReferenceLine y={4} stroke={C.green} strokeDasharray="5 5" label={{ value: 'Good', fill: C.green, fontSize: 11, position: 'left' }} />
                <Line type="monotone" dataKey="oldCourse" stroke={C.oldLine} strokeWidth={3} dot={{ r: 4, fill: C.oldLine }} name="Old Course" />
                <Line type="monotone" dataKey="newCourse" stroke={C.newLine} strokeWidth={3} dot={{ r: 4, fill: C.newLine }} name="New Course" />
                <Line type="monotone" dataKey="crossCountry" stroke={C.ccLine} strokeWidth={3} dot={{ r: 4, fill: C.ccLine }} name="Cross Country" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: '14px 18px', background: C.accentLt, borderRadius: 10, fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>
              <strong style={{ color: C.accent }}>How to read:</strong> Lower values = softer ground. The red line marks 'Soft', green marks 'Good'. All three courses trending softer through February.
            </div>
          </Card>
        )}

        {/* ══════════ COURSE MAP ══════════ */}
        {activeTab === 'course' && (<>
          <Card>
            <CardTitle icon="🗺️">Cheltenham Racecourse — Course Map</CardTitle>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <img src="/track-map.png" alt="Cheltenham Racecourse Map" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: '0 0 8px' }}>
              The map shows both the Old Course (used Days 1 & 3) and New Course (Days 2 & 4), along with start positions for all distances. Red markers indicate start gates. The course runs <strong>left-handed</strong> with the famous uphill finish.
            </p>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
            {[TRACK_FEATURES.oldCourse, TRACK_FEATURES.newCourse].map((course, ci) => (
              <Card key={ci}>
                <CardTitle icon={ci === 0 ? '🟡' : '🟢'}>{course.name}</CardTitle>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginTop: 0, marginBottom: 16 }}>{course.description}</p>
                {course.keyFeatures.map((f, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{f.name}</div>
                    <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </Card>
            ))}
          </div>

          <Card style={{ background: C.accentLt, border: `1px solid ${C.accent}20` }}>
            <CardTitle icon="💧">Drainage Notes</CardTitle>
            <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{TRACK_FEATURES.drainageNotes}</p>
          </Card>
        </>)}

        {/* ══════════ GOING GUIDE ══════════ */}
        {activeTab === 'guide' && (<>
          <Card>
            <CardTitle icon="📖">Understanding the Going</CardTitle>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.8, marginTop: 0, marginBottom: 20 }}>
              The "going" describes ground conditions and is one of the most critical factors in horse racing. It affects race times, jumping accuracy, stamina requirements, and which horses are likely to perform best.
            </p>
            <GoingScaleBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textDim, marginBottom: 4, padding: '0 4px', fontWeight: 500 }}>
              <span>← Softer (more demanding)</span><span>Faster (less demanding) →</span>
            </div>
          </Card>
          {GOING_GUIDE.map((g, i) => (
            <Card key={i} style={{ borderLeft: `4px solid ${g.colour}`, borderRadius: '0 14px 14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: g.colour }}>{g.name}</div>
                <div style={{ fontFamily: mono, fontSize: 12, color: C.textDim, background: C.cardAlt, padding: '5px 12px', borderRadius: 100, border: `1px solid ${C.border}` }}>
                  GoingStick: {g.goingStick}
                </div>
              </div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, marginTop: 0, marginBottom: 14 }}>{g.description}</p>
              <div style={{ background: C.cardAlt, borderLeft: `3px solid ${g.colour}`, borderRadius: '0 10px 10px 0', padding: 16, marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: g.colour, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Impact on Racing</div>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{g.impact}</p>
              </div>
              <div style={{ fontSize: 12, color: C.textDim, fontStyle: 'italic' }}>Visual: {g.visualDesc}</div>
            </Card>
          ))}
        </>)}

        {/* ══════════ RACES ══════════ */}
        {activeTab === 'races' && (<>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {FESTIVAL_DAYS.map(d => <Pill key={d.day} active={raceDay === d.day} onClick={() => setRaceDay(d.day)}>Day {d.day} — {d.name}</Pill>)}
          </div>
          <Card>
            <CardTitle icon="🏆" right={`${FESTIVAL_DAYS[raceDay - 1].course} · ${FESTIVAL_DAYS[raceDay - 1].date}`}>
              {FESTIVAL_DAYS[raceDay - 1].name}
            </CardTitle>
            {KEY_RACES.find(r => r.day === raceDay)?.races.map((race, i) => {
              const gc = getGradeColour(race.grade);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap',
                }}>
                  <span style={{ fontFamily: mono, fontWeight: 600, color: C.accent, minWidth: 50, fontSize: 13 }}>{race.time}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14, minWidth: 180, color: C.text }}>{race.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: gc.bg, color: gc.color }}>{race.grade}</span>
                  <span style={{ fontSize: 12, color: C.textDim, minWidth: 90, textAlign: 'right' }}>{race.distance} · {race.surface}</span>
                </div>
              );
            })}
          </Card>
        </>)}

        {/* ───── FOOTER ───── */}
        <div style={{
          fontSize: 12, color: C.textDim, textAlign: 'center', marginTop: 40,
          padding: '16px 0', borderTop: `1px solid ${C.border}`,
        }}>
          Going data last updated: {new Date(CURRENT_GOING.asOf).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Data sourced from official Cheltenham going reports
        </div>
      </div>
    </div>
  );
}
