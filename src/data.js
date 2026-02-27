// ============================================================
//  CHELTENHAM FESTIVAL 2026 — DATA FILE
//  Update this file daily with the latest going & weather info.
//  Deploy will auto-update the live site via Vercel.
// ============================================================

// Festival dates
export const FESTIVAL_START = '2026-03-10T13:30:00Z';
export const FESTIVAL_END = '2026-03-13';

export const FESTIVAL_DAYS = [
  { day: 1, date: '2026-03-10', name: 'Champion Day', course: 'Old Course' },
  { day: 2, date: '2026-03-11', name: 'Ladies Day', course: 'New Course' },
  { day: 3, date: '2026-03-12', name: "St Patrick's Thursday", course: 'Old Course' },
  { day: 4, date: '2026-03-13', name: 'Gold Cup Day', course: 'New Course' },
];

// ============================================================
//  CURRENT GOING — Update these values each time Cheltenham
//  issues a new going report. 'asOf' is the report timestamp.
// ============================================================
export const CURRENT_GOING = {
  asOf: '2026-02-27T10:00:00Z',
  courses: [
    {
      name: 'Old Course',
      going: 'Soft',
      detail: 'Soft (Good to Soft in places)',
      goingStick: 5.8,
    },
    {
      name: 'New Course',
      going: 'Soft',
      detail: 'Soft',
      goingStick: 5.4,
    },
    {
      name: 'Cross Country',
      going: 'Soft',
      detail: 'Soft (Heavy in places)',
      goingStick: 4.9,
    },
  ],
};

// ============================================================
//  GOING HISTORY — Each entry is a going report snapshot.
//  The 'value' maps going descriptions to a numeric scale:
//    1=Heavy, 2=Soft, 3=Good to Soft, 4=Good,
//    5=Good to Firm, 6=Firm, 7=Hard
// ============================================================
export const GOING_HISTORY = [
  { date: 'Feb 10', oldCourse: 3.5, newCourse: 3.2, crossCountry: 2.8, rainfall: 4 },
  { date: 'Feb 13', oldCourse: 3.2, newCourse: 3.0, crossCountry: 2.5, rainfall: 12 },
  { date: 'Feb 17', oldCourse: 2.8, newCourse: 2.6, crossCountry: 2.2, rainfall: 18 },
  { date: 'Feb 20', oldCourse: 3.0, newCourse: 2.8, crossCountry: 2.5, rainfall: 6 },
  { date: 'Feb 24', oldCourse: 2.5, newCourse: 2.3, crossCountry: 2.0, rainfall: 22 },
  { date: 'Feb 27', oldCourse: 2.2, newCourse: 2.0, crossCountry: 1.6, rainfall: 8 },
];

export const GOING_SCALE = [
  { value: 1, label: 'Heavy' },
  { value: 2, label: 'Soft' },
  { value: 3, label: 'Gd/Sft' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Gd/Fm' },
  { value: 6, label: 'Firm' },
  { value: 7, label: 'Hard' },
];

// ============================================================
//  WEATHER FORECAST — 7-day outlook from today.
//  Update from Met Office / BBC Weather for Cheltenham.
// ============================================================
export const WEATHER_FORECAST = [
  { day: 'Thu 27', icon: '🌧️', high: 8, low: 3, rain: 85, wind: 18, summary: 'Rain' },
  { day: 'Fri 28', icon: '🌦️', high: 9, low: 4, rain: 60, wind: 14, summary: 'Showers' },
  { day: 'Sat 1',  icon: '☁️', high: 10, low: 5, rain: 30, wind: 12, summary: 'Cloudy' },
  { day: 'Sun 2',  icon: '🌤️', high: 11, low: 5, rain: 15, wind: 10, summary: 'Bright spells' },
  { day: 'Mon 3',  icon: '🌧️', high: 9, low: 4, rain: 70, wind: 20, summary: 'Rain' },
  { day: 'Tue 4',  icon: '🌧️', high: 8, low: 3, rain: 80, wind: 22, summary: 'Heavy rain' },
  { day: 'Wed 5',  icon: '🌦️', high: 9, low: 4, rain: 55, wind: 16, summary: 'Showers' },
];

// ============================================================
//  FESTIVAL WEEK FORECAST — Longer range, less certain.
//  Update as we get closer and forecasts firm up.
// ============================================================
export const FESTIVAL_FORECAST = [
  { day: 'Tue 10', name: 'Champion Day', icon: '🌦️', high: 10, low: 4, rain: 50, confidence: 'Low', summary: 'Unsettled' },
  { day: 'Wed 11', name: 'Ladies Day', icon: '☁️', high: 11, low: 5, rain: 35, confidence: 'Low', summary: 'Mostly dry' },
  { day: 'Thu 12', name: "St Patrick's", icon: '🌧️', high: 9, low: 4, rain: 65, confidence: 'Low', summary: 'Rain likely' },
  { day: 'Fri 13', name: 'Gold Cup', icon: '🌦️', high: 10, low: 5, rain: 45, confidence: 'Low', summary: 'Mixed' },
];

// ============================================================
//  RAIL MOVEMENTS — Track rail position changes.
// ============================================================
export const RAIL_MOVEMENTS = [
  {
    date: '2026-02-25',
    detail: 'Rails in standard position on both courses. No dolling off.',
  },
  {
    date: '2026-02-20',
    detail: 'Temporary rail on Old Course bypass — protecting ground on inside from bend after 3rd last.',
  },
];

// ============================================================
//  KEY RACES — Featured races each day.
// ============================================================
export const KEY_RACES = [
  {
    day: 1,
    races: [
      { time: '13:30', name: 'Supreme Novices\' Hurdle', grade: 'G1', distance: '2m ½f', surface: 'Hurdle' },
      { time: '14:10', name: 'Arkle Challenge Trophy', grade: 'G1', distance: '2m', surface: 'Chase' },
      { time: '14:50', name: 'Ultima Handicap Chase', grade: 'G3', distance: '3m 1f', surface: 'Chase' },
      { time: '15:30', name: 'Champion Hurdle', grade: 'G1', distance: '2m ½f', surface: 'Hurdle' },
      { time: '16:10', name: 'Mares\' Hurdle', grade: 'G1', distance: '2m 4f', surface: 'Hurdle' },
      { time: '16:50', name: 'Boodles Juvenile Hurdle', grade: 'G1', distance: '2m ½f', surface: 'Hurdle' },
      { time: '17:30', name: 'National Hunt Chase', grade: 'G2', distance: '3m 6f', surface: 'Chase' },
    ],
  },
  {
    day: 2,
    races: [
      { time: '13:30', name: 'Ballymore Novices\' Hurdle', grade: 'G1', distance: '2m 5f', surface: 'Hurdle' },
      { time: '14:10', name: 'Brown Advisory Novices\' Chase', grade: 'G1', distance: '3m ½f', surface: 'Chase' },
      { time: '14:50', name: 'Coral Cup Handicap Hurdle', grade: 'G3', distance: '2m 5f', surface: 'Hurdle' },
      { time: '15:30', name: 'Champion Chase', grade: 'G1', distance: '2m', surface: 'Chase' },
      { time: '16:10', name: 'Cross Country Chase', grade: 'G3', distance: '3m 6f', surface: 'Cross Country' },
      { time: '16:50', name: 'Grand Annual Chase', grade: 'G3', distance: '2m ½f', surface: 'Chase' },
      { time: '17:30', name: 'Champion Bumper', grade: 'G1', distance: '2m ½f', surface: 'Flat' },
    ],
  },
  {
    day: 3,
    races: [
      { time: '13:30', name: 'Turners Novices\' Chase', grade: 'G1', distance: '2m 4f', surface: 'Chase' },
      { time: '14:10', name: 'Pertemps Final', grade: 'G3', distance: '3m', surface: 'Hurdle' },
      { time: '14:50', name: 'Ryanair Chase', grade: 'G1', distance: '2m 5f', surface: 'Chase' },
      { time: '15:30', name: 'Stayers\' Hurdle', grade: 'G1', distance: '3m', surface: 'Hurdle' },
      { time: '16:10', name: 'Plate Handicap Chase', grade: 'G3', distance: '2m 5f', surface: 'Chase' },
      { time: '16:50', name: 'Mares\' Novices\' Hurdle', grade: 'G2', distance: '2m ½f', surface: 'Hurdle' },
      { time: '17:30', name: 'Kim Muir Challenge Cup', grade: 'G3', distance: '3m 2f', surface: 'Chase' },
    ],
  },
  {
    day: 4,
    races: [
      { time: '13:30', name: 'Triumph Hurdle', grade: 'G1', distance: '2m 1f', surface: 'Hurdle' },
      { time: '14:10', name: 'County Hurdle', grade: 'G3', distance: '2m 1f', surface: 'Hurdle' },
      { time: '14:50', name: 'Albert Bartlett Novices\' Hurdle', grade: 'G1', distance: '3m', surface: 'Hurdle' },
      { time: '15:30', name: 'Cheltenham Gold Cup', grade: 'G1', distance: '3m 2½f', surface: 'Chase' },
      { time: '16:10', name: "Martin Pipe Conditional Jockeys'", grade: 'G3', distance: '2m 4½f', surface: 'Hurdle' },
      { time: '16:50', name: 'Mares\' Chase', grade: 'G2', distance: '2m 4f', surface: 'Chase' },
      { time: '17:30', name: 'Festival Hunters\' Chase', grade: 'G3', distance: '3m 2f', surface: 'Chase' },
    ],
  },
];

// ============================================================
//  GOING OUTLOOK — Your editorial assessment.
//  This is where your expertise adds value.
// ============================================================
export const GOING_OUTLOOK = {
  updated: '2026-02-27',
  summary: 'Significant rain through February has left the ground on the soft side of Good to Soft across all courses. The Cross Country course is riding Heavy in places. More rain is forecast this week which could push conditions towards Soft/Heavy by festival week.',
  prediction: 'Current trajectory suggests Soft (possibly Heavy in places) for Day 1. A drier spell early next week could stabilise things, but the forecast remains unsettled. Ground-dependent horses wanting Good or quicker are unlikely to get their conditions.',
  keyFactors: [
    'February rainfall 40% above average for Prestbury Park',
    'GoingStick readings trending down — 5.8 on Old Course (was 6.4 two weeks ago)',
    'Cross Country course draining poorly after sustained rain',
    'Met Office extended outlook shows Atlantic low-pressure systems dominating',
  ],
};
