/**
 * Cheltenham Going Data API — Vercel Serverless Function
 * 
 * Attempts to scrape going reports from multiple sources:
 *   1. Jockey Club / TurfTrax widget (primary)
 *   2. Racing Post going page (fallback)
 *   3. AtTheRaces / Sky Sports Racing (secondary fallback)
 * 
 * Returns JSON with going descriptions, GoingStick readings, 
 * and metadata. Cached for 30 minutes via Vercel Edge Cache.
 * 
 * Data typically available from ~March 4th (6 days before festival).
 */

const CHELTENHAM_GOING_URL = 'https://www.thejockeyclub.co.uk/cheltenham/owners-and-trainers/the-going/';
const RACING_POST_GOING_URL = 'https://www.racingpost.com/racecards/38/cheltenham/';
const TURFTRAX_SEARCH = 'https://www.turftrax.com/';

// GoingStick scale (official BHA):
// 1.0–2.9 = Heavy | 3.0–4.9 = Soft | 5.0–6.9 = Good to Soft
// 7.0–8.9 = Good | 9.0–10.9 = Good to Firm | 11.0–12.9 = Firm | 13.0–15.0 = Hard

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  // Cache for 30 mins on Vercel Edge, allow stale for 1 hour
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  try {
    let data = null;

    // ──── SOURCE 1: Jockey Club page ────
    // The going widget is loaded dynamically by TurfTrax JS, but the page
    // sometimes contains the going text in a <script> tag or noscript fallback.
    // We look for patterns in the raw HTML.
    try {
      data = await scrapeJockeyClub();
      if (data && data.courses && data.courses.length > 0) {
        data.source = 'jockeyclub';
        return res.status(200).json({ success: true, data, fetchedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.log('Jockey Club scrape failed:', e.message);
    }

    // ──── SOURCE 2: Racing Post racecards ────
    // Racing Post publishes going info on racecard pages when cards are available.
    try {
      data = await scrapeRacingPost();
      if (data && data.courses && data.courses.length > 0) {
        data.source = 'racingpost';
        return res.status(200).json({ success: true, data, fetchedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.log('Racing Post scrape failed:', e.message);
    }

    // ──── SOURCE 3: TurfTrax website ────
    // TurfTrax sometimes publishes maps/readings directly on their site.
    try {
      data = await scrapeTurfTrax();
      if (data && data.courses && data.courses.length > 0) {
        data.source = 'turftrax';
        return res.status(200).json({ success: true, data, fetchedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.log('TurfTrax scrape failed:', e.message);
    }

    // ──── No data available yet ────
    return res.status(200).json({
      success: false,
      data: null,
      message: 'Going data not yet available. Reports typically published 6 days before racing (~March 4th for the Festival).',
      fetchedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Going API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch going data',
      fetchedAt: new Date().toISOString(),
    });
  }
}

/**
 * Scrape the Jockey Club Cheltenham going page.
 * The TurfTrax widget injects going text via JS, but the page source
 * sometimes contains going data in embedded elements or meta tags.
 * We also look for common patterns in the HTML.
 */
async function scrapeJockeyClub() {
  const resp = await fetch(CHELTENHAM_GOING_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CheltenhamTracker/1.0)',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  });
  
  if (!resp.ok) return null;
  const html = await resp.text();

  // Look for going data patterns in the HTML
  // TurfTrax widget typically renders text like:
  //   "Going: Soft (Good to Soft in places)"
  //   "GoingStick: Old Course: 5.8, New Course: 5.4"
  // These may appear in script tags, data attributes, or rendered text.

  const result = { courses: [], asOf: null, rawText: '' };

  // Pattern 1: Look for "Going:" followed by description
  const goingPatterns = [
    /(?:Going|Official Going)[:\s]*([^<\n]+(?:Old|New|Cross)[^<\n]+)/gi,
    /Old\s*(?:Course)?[:\s]*([A-Za-z\s,()]+?)(?:\.|New|Cross|GoingStick|$)/gi,
    /GoingStick[:\s]*(?:Old[:\s]*([\d.]+))?[,\s]*(?:New[:\s]*([\d.]+))?[,\s]*(?:Cross[:\s]*([\d.]+))?/gi,
  ];

  // Pattern 2: Look for structured going data in script blocks
  const scriptMatch = html.match(/<script[^>]*>[^<]*(?:going|goingstick)[^<]*<\/script>/gi);
  if (scriptMatch) {
    for (const script of scriptMatch) {
      result.rawText += script + '\n';
    }
  }

  // Pattern 3: Look for going text in the main content
  const contentMatch = html.match(/(?:going|ground)[^<]{0,500}(?:soft|good|firm|heavy|yielding)[^<]{0,200}/gi);
  if (contentMatch) {
    result.rawText += contentMatch.join('\n');
  }

  // Try to parse GoingStick readings
  const stickMatch = html.match(/(?:Old|O\/C)[:\s]*([\d.]+)[,\s]*(?:New|N\/C)[:\s]*([\d.]+)[,\s]*(?:Cross|C\/C|XC)[:\s]*([\d.]+)/i);
  if (stickMatch) {
    const oldStick = parseFloat(stickMatch[1]);
    const newStick = parseFloat(stickMatch[2]);
    const ccStick = parseFloat(stickMatch[3]);

    result.courses = [
      { name: 'Old Course', goingStick: oldStick, going: stickToGoing(oldStick), detail: '' },
      { name: 'New Course', goingStick: newStick, going: stickToGoing(newStick), detail: '' },
      { name: 'Cross Country', goingStick: ccStick, going: stickToGoing(ccStick), detail: '' },
    ];
    result.asOf = new Date().toISOString();
  }

  // Try to extract going descriptions
  const goingDescMatch = html.match(/(?:Old\s*(?:Course)?)[:\s]*((?:Heavy|Soft|Good|Firm|Yielding)[\w\s,()]*?)(?:\.|;|New|<)/i);
  if (goingDescMatch && result.courses.length > 0) {
    result.courses[0].going = goingDescMatch[1].trim();
  }
  const newDescMatch = html.match(/(?:New\s*(?:Course)?)[:\s]*((?:Heavy|Soft|Good|Firm|Yielding)[\w\s,()]*?)(?:\.|;|Cross|<)/i);
  if (newDescMatch && result.courses.length > 0) {
    result.courses[1].going = newDescMatch[1].trim();
  }

  return result;
}

/**
 * Scrape Racing Post racecard pages for Cheltenham going info.
 * Racing Post course ID for Cheltenham is 38.
 */
async function scrapeRacingPost() {
  const resp = await fetch(RACING_POST_GOING_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CheltenhamTracker/1.0)',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!resp.ok) return null;
  const html = await resp.text();

  const result = { courses: [], asOf: null, rawText: '' };

  // Racing Post typically shows going in a header or info bar
  // Patterns like: "Going: Soft (Heavy in places)"
  const rpGoingMatch = html.match(/(?:Going|going)[:\s]*((?:Heavy|Soft|Good|Firm|Yielding)[\w\s,()]*)/i);
  if (rpGoingMatch) {
    const goingText = rpGoingMatch[1].trim();
    result.courses.push({ name: 'Official Going', going: goingText, goingStick: null, detail: goingText });
    result.asOf = new Date().toISOString();
    result.rawText = goingText;
  }

  // Look for GoingStick in RP data
  const rpStickMatch = html.match(/GoingStick[:\s]*([\d.]+)/i);
  if (rpStickMatch && result.courses.length > 0) {
    result.courses[0].goingStick = parseFloat(rpStickMatch[1]);
  }

  return result;
}

/**
 * Scrape TurfTrax website for Cheltenham going data.
 */
async function scrapeTurfTrax() {
  const resp = await fetch(TURFTRAX_SEARCH, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CheltenhamTracker/1.0)',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!resp.ok) return null;
  const html = await resp.text();

  const result = { courses: [], asOf: null, rawText: '' };

  // TurfTrax may list latest going on their homepage or in a Cheltenham section
  const cheltenhamMatch = html.match(/Cheltenham[^<]{0,500}(?:Old|New|Cross)[^<]{0,300}/gi);
  if (cheltenhamMatch) {
    result.rawText = cheltenhamMatch.join('\n');
    
    const stickMatch = result.rawText.match(/Old[:\s]*([\d.]+)[,\s]*New[:\s]*([\d.]+)/i);
    if (stickMatch) {
      result.courses = [
        { name: 'Old Course', goingStick: parseFloat(stickMatch[1]), going: stickToGoing(parseFloat(stickMatch[1])), detail: '' },
        { name: 'New Course', goingStick: parseFloat(stickMatch[2]), going: stickToGoing(parseFloat(stickMatch[2])), detail: '' },
      ];
      result.asOf = new Date().toISOString();
    }
  }

  return result;
}

/**
 * Convert a GoingStick reading to a going description.
 * Official BHA scale.
 */
function stickToGoing(val) {
  if (val < 3.0) return 'Heavy';
  if (val < 5.0) return 'Soft';
  if (val < 7.0) return 'Good to Soft';
  if (val < 9.0) return 'Good';
  if (val < 11.0) return 'Good to Firm';
  if (val < 13.0) return 'Firm';
  return 'Hard';
}
