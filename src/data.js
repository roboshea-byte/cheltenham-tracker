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

// ============================================================
//  DAY-BY-DAY GOING PREDICTIONS
//  Your expert assessment of what the going is likely to be
//  on each day. Update as forecasts firm up.
// ============================================================
export const DAY_PREDICTIONS = [
  {
    day: 1,
    date: '2026-03-10',
    name: 'Champion Day',
    course: 'Old Course',
    predictedGoing: 'Soft',
    predictedDetail: 'Soft (Good to Soft in places)',
    confidence: 'Medium',
    goingStickRange: '5.2–5.8',
    analysis: 'The Old Course has held up better than the New Course through February, with slightly better drainage on the higher ground. However, with further rain expected this week, the ground is likely to ride Soft. The inside rail from the top of the hill has taken the most punishment. Horses drawn wide may find marginally better ground.',
    impactNotes: [
      'Champion Hurdle: Soft ground will favour stamina-laden types. Those with a high cruising speed on better ground may struggle.',
      'Arkle: Ground should be fine for the principals — most leading contenders have proven form on soft.',
      'Supreme: Traditionally run at a strong gallop. Soft ground will make it a true test of stamina over 2 miles.',
      'Ultima: The 3m1f trip on soft ground will be a real slog — need genuine stayers.',
    ],
  },
  {
    day: 2,
    date: '2026-03-11',
    name: 'Ladies Day',
    course: 'New Course',
    predictedGoing: 'Soft',
    predictedDetail: 'Soft (Heavy in places)',
    confidence: 'Medium',
    goingStickRange: '4.8–5.4',
    analysis: 'The New Course has been riding heavier than the Old throughout February. The low-lying areas around the bottom bend tend to cut up, and with Day 1 traffic on the shared sections, expect conditions to deteriorate. The ground around the final flight/fence is likely to be testing.',
    impactNotes: [
      'Champion Chase: Soft/Heavy is a significant factor at 2 miles. Pace horses may not sustain their speed. Look for strong-travelling chasers with a proven mud profile.',
      'Brown Advisory: At 3m on heavy ground, this becomes an extreme stamina test. Expect a slow pace and late battle.',
      'Cross Country: Already Heavy in places — this will be very testing. Experienced course specialists at a premium.',
      'Coral Cup: Handicap on testing ground often produces big-priced winners. Go low in the weights.',
    ],
  },
  {
    day: 3,
    date: '2026-03-12',
    name: "St Patrick's Thursday",
    course: 'Old Course',
    predictedGoing: 'Soft',
    predictedDetail: 'Soft (Heavy in places)',
    confidence: 'Low',
    goingStickRange: '4.6–5.2',
    analysis: 'By Day 3, the cumulative effect of two days\' racing plus any midweek rain will have taken its toll. The Old Course will have been used on Day 1 and sections will have cut up. Expect the going to be at least Soft, possibly Heavy in the most worn areas. The clerk of the course may doll off the worst sections.',
    impactNotes: [
      'Stayers\' Hurdle: At 3 miles on heavy ground, stamina is everything. Only genuine stayers need apply.',
      'Ryanair: The intermediate trip at 2m5f on soft/heavy ground means this is no longer a speed test — look for those who stay further.',
      'Pertemps: Qualifier form on better ground is largely irrelevant. Focus on proven soft/heavy ground performers.',
      'Plate Chase: Expect plenty of non-runners if the ground deteriorates to Heavy.',
    ],
  },
  {
    day: 4,
    date: '2026-03-13',
    name: 'Gold Cup Day',
    course: 'New Course',
    predictedGoing: 'Heavy',
    predictedDetail: 'Heavy (Soft in places)',
    confidence: 'Low',
    goingStickRange: '4.0–4.8',
    analysis: 'The worst-case scenario for the Gold Cup. The New Course will have been used on Day 2 and, with the extended forecast showing further rain midweek, conditions could be genuinely Heavy by Friday. The final hill is likely to be the defining factor — tired horses on heavy ground over 3m2½f will need to be exceptional athletes and genuine stayers.',
    impactNotes: [
      'Gold Cup: Heavy ground transforms the race entirely. The last half-mile up the hill on heavy ground is one of the ultimate tests in racing. Previous winners in these conditions have typically been thorough stayers rather than speed merchants.',
      'Triumph Hurdle: Juveniles on heavy ground is a lottery. Form from France on deep ground is particularly relevant.',
      'County Hurdle: Big-field handicap on heavy ground — chaos. Course form and proven stamina essential.',
      'Albert Bartlett: 3 miles for novice hurdlers on heavy ground. Only the toughest survive.',
    ],
  },
];

// ============================================================
//  GOING GUIDE — Explains each going type for subscribers.
//  Educational content that adds value.
// ============================================================
export const GOING_GUIDE = [
  {
    name: 'Heavy',
    goingStick: '1.0 – 2.9',
    colour: '#e05252',
    description: 'Very testing conditions with waterlogged turf. The ground is sodden and deep, requiring enormous stamina and strength. Races take significantly longer, and the emphasis shifts entirely to stamina over speed.',
    impact: 'Favours strong, powerful gallopers who handle deep ground. Front-runners can dominate if they get a soft lead. Speed horses and those who race prominently on better ground often fail to see out their trips. Non-runner rates are highest on heavy ground.',
    visualDesc: 'Waterlogged, standing water in patches, deep hoofprints',
  },
  {
    name: 'Soft',
    goingStick: '3.0 – 4.9',
    colour: '#e09752',
    description: 'Rain-affected ground that is noticeably yielding underfoot. The turf gives way significantly and horses sink into the surface. A demanding surface that tests stamina, though not as extreme as Heavy.',
    impact: 'Suits horses with stamina in their pedigree and proven form on testing ground. Pace is reduced and horses need to be effective through the ground rather than skimming over the surface. Big-actioned gallopers often handle it well.',
    visualDesc: 'Yielding surface, visible hoof impressions, damp but no standing water',
  },
  {
    name: 'Good to Soft',
    goingStick: '5.0 – 6.9',
    colour: '#e0d252',
    description: 'The most common going at Cheltenham in March. Ground has some give but retains a decent surface. The ideal middle ground that allows most horses to perform close to their best while still requiring a degree of stamina.',
    impact: 'The most "fair" going — few horses are inconvenienced by it. Horses with a preference for either better or softer ground can generally cope. The classic Cheltenham Festival surface.',
    visualDesc: 'Good cover of grass, slight give underfoot, springy turf',
  },
  {
    name: 'Good',
    goingStick: '7.0 – 8.9',
    colour: '#3ecf6e',
    description: 'Ideal racing surface with minimal give. The turf is firm enough to allow horses to stride out efficiently but with just enough cushion to protect joints. Fast but fair.',
    impact: 'Suits speed horses and those with a quick turn of foot. Tactical races are more common as the surface allows horses to quicken. Time figures are faster and form from fast ground is more reliable.',
    visualDesc: 'Even, well-maintained turf, minimal give, firm footing',
  },
  {
    name: 'Good to Firm',
    goingStick: '9.0 – 10.9',
    colour: '#52e0a0',
    description: 'Fast ground that is unusual for Cheltenham in March. Quick surface with very little give, more commonly seen in summer. The ground is dry and the turf bounces back quickly.',
    impact: 'Favours genuine speed horses. Some trainers will withdraw horses who need a cut in the ground. Jump racing on fast ground raises welfare concerns, and the number of fallers can increase. Rare at the Festival.',
    visualDesc: 'Dry, firm surface, virtually no give, dust possible in dry spells',
  },
  {
    name: 'Firm / Hard',
    goingStick: '11.0 – 15.0',
    colour: '#52c0e0',
    description: 'Extremely fast ground that is essentially drought-affected. Almost never seen at Cheltenham in March. The surface is unyielding and provides no cushion.',
    impact: 'Racing on firm/hard ground is generally avoided in National Hunt as it increases injury risk. Meetings would likely be subject to inspection and possible abandonment if the ground reached this level.',
    visualDesc: 'Bone-dry, cracked earth, no give whatsoever',
  },
];

// ============================================================
//  TRACK MAP DATA — Cheltenham course features.
//  Used to render the SVG track map with key landmarks.
// ============================================================
export const TRACK_FEATURES = {
  oldCourse: {
    name: 'Old Course',
    length: '1 mile 4 furlongs (round course)',
    description: 'The original Cheltenham track, slightly sharper than the New Course. Features a stiff uphill finish of about 250 yards. The Old Course is used on Days 1 and 3 of the Festival.',
    keyFeatures: [
      { name: 'The Hill', desc: 'The famous uphill finish — 250 yards of rising ground that has broken many a horse. The gradient is approximately 1 in 35.' },
      { name: 'Top of the Hill', desc: 'The highest point of the course before the final descent to the back straight. Ground here drains better than the bottom of the course.' },
      { name: 'Bottom Bend', desc: 'Sharp left-hand turn at the lowest point. Ground tends to be heaviest here as water runs downhill and collects.' },
      { name: 'Final Flight/Fence', desc: 'Positioned at the bottom of the hill. Tired horses on soft ground often make mistakes here.' },
    ],
  },
  newCourse: {
    name: 'New Course',
    length: '1 mile 5 furlongs (round course)',
    description: 'Wider and slightly more galloping than the Old Course. Used on Days 2 and 4 (including Gold Cup day). The longer home straight can suit hold-up horses.',
    keyFeatures: [
      { name: 'The Hill', desc: 'Same punishing finish as the Old Course — the final climb is the defining feature of Cheltenham regardless of which track is used.' },
      { name: 'Extended Home Straight', desc: 'Longer than the Old Course run-in, giving horses more time to be produced for their challenge.' },
      { name: 'Bottom of Course', desc: 'The lowest-lying section. Drainage has historically been an issue here, and it\'s where the ground rides heaviest.' },
      { name: 'Cross Country Course', desc: 'A separate course used for the Cross Country Chase on Day 2. Includes banks, ditches and varied terrain. Always rides heavier than the main tracks.' },
    ],
  },
  drainageNotes: 'Cheltenham\'s drainage was upgraded in 2019 but the course still rides soft in prolonged wet spells. The hill section drains best. The flat sections at the bottom of the course retain moisture longest.',
};
