import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine,
} from 'recharts';
import {
  FESTIVAL_START, FESTIVAL_DAYS, CURRENT_GOING, GOING_HISTORY,
  GOING_SCALE, WEATHER_FORECAST, FESTIVAL_FORECAST, RAIL_MOVEMENTS,
  KEY_RACES, GOING_OUTLOOK,
} from './data';

/* ──────────────────────── COLOURS ──────────────────────── */
const C = {
  bg:       '#0c1a12',
  card:     '#132a1c',
  cardAlt:  '#1a3626',
  border:   '#2a5a3a',
  gold:     '#d4af37',
  goldDim:  '#b8962e',
  green:    '#3ecf6e',
  greenDim: '#2a8a4a',
  text:     '#e8ede9',
  textDim:  '#8fa898',
  red:      '#e05252',
  blue:     '#5298e0',
  oldLine:  '#d4af37',
  newLine:  '#3ecf6e',
  ccLine:   '#e09752',
  rainBar:  'rgba(82, 152, 224, 0.5)',
};

/* ──────────────────────── STYLES ──────────────────────── */
const styles = {
  app: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    background: C.bg,
    color: C.text,
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  },
  container: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 20px 60px',
  },
  /* Header */
  header: {
    background: `linear-gradient(135deg, ${C.card} 0%, ${C.bg} 100%)`,
    borderBottom: `1px solid ${C.border}`,
    padding: '28px 0 24px',
    marginBottom: 32,
  },
  headerInner: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: C.gold,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 14,
    color: C.textDim,
    margin: '4px 0 0',
    fontWeight: 400,
  },
  countdown: {
    textAlign: 'right',
  },
  countdownNum: {
    fontSize: 36,
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', monospace",
    color: C.gold,
    lineHeight: 1,
  },
  countdownLabel: {
    fontSize: 12,
    color: C.textDim,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  /* Cards */
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: C.gold,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  /* Going cards */
  goingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  goingCard: {
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
  },
  goingCourseName: {
    fontSize: 13,
    fontWeight: 600,
    color: C.textDim,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 8,
  },
  goingValue: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 4,
  },
  goingDetail: {
    fontSize: 13,
    color: C.textDim,
    marginBottom: 10,
  },
  goingStick: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    fontWeight: 500,
  },
  goingStickLabel: {
    fontSize: 11,
    color: C.textDim,
    marginTop: 2,
  },
  /* Weather */
  weatherGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 10,
  },
  weatherCard: {
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '14px 10px',
    textAlign: 'center',
  },
  weatherDay: {
    fontSize: 12,
    fontWeight: 600,
    color: C.textDim,
    marginBottom: 6,
  },
  weatherIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 16,
    fontWeight: 700,
    color: C.text,
  },
  weatherLow: {
    fontSize: 12,
    color: C.textDim,
  },
  weatherRain: {
    fontSize: 12,
    color: C.blue,
    marginTop: 4,
  },
  weatherWind: {
    fontSize: 11,
    color: C.textDim,
    marginTop: 2,
  },
  /* Festival forecast */
  festivalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
  },
  festivalCard: {
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: 16,
    textAlign: 'center',
    position: 'relative',
  },
  festivalDayBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 10,
    fontWeight: 600,
    background: C.border,
    color: C.textDim,
    padding: '2px 8px',
    borderRadius: 10,
  },
  /* Tabs */
  tabBar: {
    display: 'flex',
    gap: 4,
    marginBottom: 20,
    borderBottom: `1px solid ${C.border}`,
    paddingBottom: 0,
  },
  tab: {
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: C.textDim,
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s',
    marginBottom: -1,
  },
  tabActive: {
    color: C.gold,
    borderBottomColor: C.gold,
  },
  /* Outlook */
  outlookText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: C.text,
    marginBottom: 16,
  },
  outlookPrediction: {
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${C.gold}`,
    borderRadius: '0 8px 8px 0',
    padding: 16,
    marginBottom: 16,
  },
  outlookPredLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: C.gold,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 6,
  },
  factorList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  factor: {
    fontSize: 14,
    color: C.textDim,
    padding: '6px 0',
    borderBottom: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  factorDot: {
    color: C.gold,
    fontWeight: 700,
    flexShrink: 0,
  },
  /* Racecard */
  raceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: `1px solid ${C.border}`,
    fontSize: 14,
  },
  raceTime: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500,
    color: C.gold,
    minWidth: 48,
    fontSize: 13,
  },
  raceName: {
    flex: 1,
    fontWeight: 600,
  },
  raceGrade: {
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 4,
    color: C.bg,
  },
  raceInfo: {
    fontSize: 12,
    color: C.textDim,
    minWidth: 80,
    textAlign: 'right',
  },
  /* Rail */
  railEntry: {
    padding: '12px 0',
    borderBottom: `1px solid ${C.border}`,
  },
  railDate: {
    fontSize: 12,
    fontWeight: 600,
    color: C.gold,
    marginBottom: 4,
  },
  railDetail: {
    fontSize: 14,
    color: C.textDim,
    lineHeight: 1.5,
  },
  /* Timestamp */
  timestamp: {
    fontSize: 12,
    color: C.textDim,
    textAlign: 'center',
    marginTop: 40,
    padding: '16px 0',
    borderTop: `1px solid ${C.border}`,
  },
  /* Responsive helpers */
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: 20,
  },
  /* Going badge colours */
};

/* ──────────────────── HELPERS ──────────────────── */
function getGoingColour(going) {
  const g = going.toLowerCase();
  if (g.includes('heavy')) return C.red;
  if (g.includes('soft') && !g.includes('good')) return '#e09752';
  if (g.includes('good to soft') || (g.includes('good') && g.includes('soft'))) return '#e0d252';
  if (g.includes('good to firm') || (g.includes('good') && g.includes('firm'))) return C.green;
  if (g.includes('good')) return C.green;
  if (g.includes('firm')) return '#52e0a0';
  return C.text;
}

function getGoingStickColour(val) {
  if (val < 4) return C.red;
  if (val < 5.5) return '#e09752';
  if (val < 7) return '#e0d252';
  if (val < 8.5) return C.green;
  return '#52e0a0';
}

function getGradeColour(grade) {
  if (grade === 'G1') return C.gold;
  if (grade === 'G2') return '#c0c0c0';
  return '#cd7f32';
}

function getCountdown() {
  const now = new Date();
  const start = new Date(FESTIVAL_START);
  const diff = start - now;
  if (diff <= 0) return { days: 0, hours: 0, label: 'Festival is LIVE!' };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, label: 'until first race' };
}

function goingValueToLabel(val) {
  if (val <= 1.25) return 'Heavy';
  if (val <= 1.75) return 'Hvy/Sft';
  if (val <= 2.25) return 'Soft';
  if (val <= 2.75) return 'Sft/GS';
  if (val <= 3.25) return 'Gd/Sft';
  if (val <= 3.75) return 'GS/Gd';
  if (val <= 4.25) return 'Good';
  if (val <= 4.75) return 'Gd/GF';
  if (val <= 5.25) return 'Gd/Fm';
  if (val <= 5.75) return 'GF/Fm';
  if (val <= 6.25) return 'Firm';
  return 'Hard';
}

/* ──────────────────── TOOLTIP ──────────────────── */
function GoingTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 700, color: C.gold, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        p.dataKey !== 'rainfall' ? (
          <div key={i} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}: {goingValueToLabel(p.value)}
          </div>
        ) : (
          <div key={i} style={{ color: C.blue, marginBottom: 2 }}>
            Rainfall: {p.value}mm
          </div>
        )
      ))}
    </div>
  );
}

/* ──────────────── MAIN COMPONENT ──────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [raceDay, setRaceDay] = useState(1);
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.app}>
      {/* ───── HEADER ───── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.title}>🏇 Cheltenham Festival 2026</h1>
            <p style={styles.subtitle}>Going & Weather Tracker — Updated Daily</p>
          </div>
          <div style={styles.countdown}>
            {countdown.days > 0 ? (
              <>
                <div style={styles.countdownNum}>
                  {countdown.days}<span style={{ fontSize: 18, color: C.textDim }}>d</span>{' '}
                  {countdown.hours}<span style={{ fontSize: 18, color: C.textDim }}>h</span>
                </div>
                <div style={styles.countdownLabel}>{countdown.label}</div>
              </>
            ) : (
              <div style={{ ...styles.countdownNum, fontSize: 22, color: C.green }}>
                {countdown.label}
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={styles.container}>
        {/* ───── NAV TABS ───── */}
        <div style={styles.tabBar}>
          {[
            { id: 'overview', label: 'Going Report' },
            { id: 'weather', label: 'Weather' },
            { id: 'chart', label: 'Going Trend' },
            { id: 'races', label: 'Racecard' },
          ].map(t => (
            <button
              key={t.id}
              style={{
                ...styles.tab,
                ...(activeTab === t.id ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ OVERVIEW TAB ══════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* Current Going */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>📋</span> Current Going Report
                <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim, marginLeft: 'auto' }}>
                  {new Date(CURRENT_GOING.asOf).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div style={styles.goingGrid}>
                {CURRENT_GOING.courses.map((c, i) => (
                  <div key={i} style={styles.goingCard}>
                    <div style={styles.goingCourseName}>{c.name}</div>
                    <div style={{ ...styles.goingValue, color: getGoingColour(c.going) }}>
                      {c.going}
                    </div>
                    <div style={styles.goingDetail}>{c.detail}</div>
                    <div style={{ ...styles.goingStick, color: getGoingStickColour(c.goingStick) }}>
                      {c.goingStick.toFixed(1)}
                    </div>
                    <div style={styles.goingStickLabel}>GoingStick Reading</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outlook */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>🔭</span> Going Outlook
                <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim, marginLeft: 'auto' }}>
                  Updated {GOING_OUTLOOK.updated}
                </span>
              </div>
              <p style={styles.outlookText}>{GOING_OUTLOOK.summary}</p>
              <div style={styles.outlookPrediction}>
                <div style={styles.outlookPredLabel}>Festival Going Prediction</div>
                <p style={{ ...styles.outlookText, marginBottom: 0 }}>{GOING_OUTLOOK.prediction}</p>
              </div>
              <ul style={styles.factorList}>
                {GOING_OUTLOOK.keyFactors.map((f, i) => (
                  <li key={i} style={styles.factor}>
                    <span style={styles.factorDot}>▸</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rail Movements */}
            <div style={styles.card}>
              <div style={styles.cardTitle}><span>🚧</span> Rail Movements</div>
              {RAIL_MOVEMENTS.map((r, i) => (
                <div key={i} style={styles.railEntry}>
                  <div style={styles.railDate}>{r.date}</div>
                  <div style={styles.railDetail}>{r.detail}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══════════════ WEATHER TAB ══════════════ */}
        {activeTab === 'weather' && (
          <>
            {/* 7-day forecast */}
            <div style={styles.card}>
              <div style={styles.cardTitle}><span>🌤️</span> 7-Day Weather Forecast</div>
              <div style={styles.weatherGrid}>
                {WEATHER_FORECAST.map((w, i) => (
                  <div key={i} style={styles.weatherCard}>
                    <div style={styles.weatherDay}>{w.day}</div>
                    <div style={styles.weatherIcon}>{w.icon}</div>
                    <div style={styles.weatherTemp}>{w.high}°</div>
                    <div style={styles.weatherLow}>{w.low}° low</div>
                    <div style={styles.weatherRain}>💧 {w.rain}%</div>
                    <div style={styles.weatherWind}>💨 {w.wind}mph</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Festival week forecast */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>🎪</span> Festival Week Forecast
                <span style={{ fontSize: 11, fontWeight: 400, color: C.textDim, marginLeft: 'auto' }}>
                  ⚠️ Long range — low confidence
                </span>
              </div>
              <div style={styles.festivalGrid}>
                {FESTIVAL_FORECAST.map((f, i) => (
                  <div key={i} style={styles.festivalCard}>
                    <span style={styles.festivalDayBadge}>Day {i + 1}</span>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, marginBottom: 4 }}>
                      {f.day}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 8 }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{f.high}° / {f.low}°</div>
                    <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>{f.summary}</div>
                    <div style={{ fontSize: 12, color: C.blue, marginTop: 4 }}>💧 {f.rain}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rainfall impact */}
            <div style={styles.card}>
              <div style={styles.cardTitle}><span>💧</span> Rainfall vs Going</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={GOING_HISTORY} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="date" tick={{ fill: C.textDim, fontSize: 12 }} />
                  <YAxis
                    yAxisId="rain"
                    orientation="right"
                    tick={{ fill: C.blue, fontSize: 12 }}
                    label={{ value: 'mm', angle: 90, position: 'insideRight', fill: C.blue, fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="going"
                    domain={[1, 5]}
                    tick={{ fill: C.textDim, fontSize: 11 }}
                    tickFormatter={v => goingValueToLabel(v)}
                  />
                  <Tooltip content={<GoingTooltip />} />
                  <Bar yAxisId="rain" dataKey="rainfall" fill={C.rainBar} radius={[4, 4, 0, 0]} name="Rainfall" />
                  <Line yAxisId="going" type="monotone" dataKey="oldCourse" stroke={C.oldLine} strokeWidth={2} dot={false} name="Old Course" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ══════════════ CHART TAB ══════════════ */}
        {activeTab === 'chart' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}><span>📈</span> Going Trend — All Courses</div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={GOING_HISTORY} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fill: C.textDim, fontSize: 12 }} />
                <YAxis
                  domain={[1, 5]}
                  tick={{ fill: C.textDim, fontSize: 11 }}
                  tickFormatter={v => goingValueToLabel(v)}
                  width={60}
                />
                <Tooltip content={<GoingTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: C.textDim }}
                  iconType="line"
                />
                <ReferenceLine y={2} stroke={C.red} strokeDasharray="5 5" label={{ value: 'Soft', fill: C.red, fontSize: 11, position: 'left' }} />
                <ReferenceLine y={4} stroke={C.green} strokeDasharray="5 5" label={{ value: 'Good', fill: C.green, fontSize: 11, position: 'left' }} />
                <Line
                  type="monotone"
                  dataKey="oldCourse"
                  stroke={C.oldLine}
                  strokeWidth={3}
                  dot={{ r: 4, fill: C.oldLine }}
                  name="Old Course"
                />
                <Line
                  type="monotone"
                  dataKey="newCourse"
                  stroke={C.newLine}
                  strokeWidth={3}
                  dot={{ r: 4, fill: C.newLine }}
                  name="New Course"
                />
                <Line
                  type="monotone"
                  dataKey="crossCountry"
                  stroke={C.ccLine}
                  strokeWidth={3}
                  dot={{ r: 4, fill: C.ccLine }}
                  name="Cross Country"
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: '12px 16px', background: C.cardAlt, borderRadius: 8, fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
              <strong style={{ color: C.gold }}>How to read:</strong> Lower values = softer ground. The gold reference line marks 'Soft', the green marks 'Good'. 
              All three courses are trending softer through February.
            </div>
          </div>
        )}

        {/* ══════════════ RACES TAB ══════════════ */}
        {activeTab === 'races' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {FESTIVAL_DAYS.map(d => (
                <button
                  key={d.day}
                  onClick={() => setRaceDay(d.day)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: `1px solid ${raceDay === d.day ? C.gold : C.border}`,
                    background: raceDay === d.day ? C.cardAlt : 'transparent',
                    color: raceDay === d.day ? C.gold : C.textDim,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Day {d.day} — {d.name}
                </button>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>🏆</span> {FESTIVAL_DAYS[raceDay - 1].name}
                <span style={{ fontSize: 12, fontWeight: 400, color: C.textDim, marginLeft: 'auto' }}>
                  {FESTIVAL_DAYS[raceDay - 1].course} • {FESTIVAL_DAYS[raceDay - 1].date}
                </span>
              </div>
              {KEY_RACES.find(r => r.day === raceDay)?.races.map((race, i) => (
                <div key={i} style={styles.raceRow}>
                  <span style={styles.raceTime}>{race.time}</span>
                  <span style={styles.raceName}>{race.name}</span>
                  <span style={{
                    ...styles.raceGrade,
                    background: getGradeColour(race.grade),
                  }}>
                    {race.grade}
                  </span>
                  <span style={styles.raceInfo}>{race.distance} • {race.surface}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ───── FOOTER ───── */}
        <div style={styles.timestamp}>
          Going data last updated: {new Date(CURRENT_GOING.asOf).toLocaleDateString('en-GB', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })} • Data sourced from official Cheltenham going reports
        </div>
      </div>
    </div>
  );
}
