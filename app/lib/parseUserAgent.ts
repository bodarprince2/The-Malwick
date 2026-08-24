/**
 * Lightweight User-Agent parser — no external dependencies.
 * 
 * DSA Optimization: Pre-compiled regex patterns stored in module scope.
 * Compiled once at import time → O(1) cost per parse instead of
 * re-compiling regex on every request.
 * 
 * LRU-style cache: stores last N parsed results to avoid re-parsing
 * the same UA string (most visitors have the same UA for all requests).
 */

export interface ParsedUserAgent {
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

// ── Pre-compiled regex patterns (compiled once at module load) ──

const RE_EDGE = /Edg(?:e|A|iOS)?\/(\d+(?:\.\d+)?)/;
const RE_OPERA = /(?:OPR|Opera)\/(\d+(?:\.\d+)?)/;
const RE_SAMSUNG = /SamsungBrowser\/(\d+(?:\.\d+)?)/;
const RE_UC = /UCBrowser\/(\d+(?:\.\d+)?)/;
const RE_FIREFOX = /Firefox\/(\d+(?:\.\d+)?)/;
const RE_CHROME = /Chrome\/(\d+(?:\.\d+)?)/;
const RE_SAFARI = /Version\/(\d+(?:\.\d+)?).*Safari/;
const RE_IE = /(?:MSIE |rv:)(\d+(?:\.\d+)?)/;

const RE_IOS = /(?:iPhone|iPad|iPod).*?OS (\d+[_\.]\d+)/;
const RE_MAC = /Mac OS X (\d+[_\.]\d+(?:[_\.]\d+)?)/;
const RE_ANDROID = /Android (\d+(?:\.\d+)?)/;

const RE_TABLET = /iPad|tablet|playbook|silk/i;
const RE_ANDROID_TABLET = /Android/i;
const RE_NOT_MOBILE = /Mobile/i;
const RE_MOBILE = /Mobile|iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini|Opera Mobi/i;

// ── LRU Cache: Map preserves insertion order, cap at 100 entries ──
const cache = new Map<string, ParsedUserAgent>();
const CACHE_MAX = 100;

const UNKNOWN_RESULT: ParsedUserAgent = { browser: 'Unknown', os: 'Unknown', deviceType: 'desktop' };

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  if (!ua) return UNKNOWN_RESULT;

  // Cache hit — O(1)
  const cached = cache.get(ua);
  if (cached) return cached;

  const result: ParsedUserAgent = {
    browser: parseBrowser(ua),
    os: parseOS(ua),
    deviceType: parseDeviceType(ua),
  };

  // Evict oldest if at capacity
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(ua, result);

  return result;
}

function parseBrowser(ua: string): string {
  let m: RegExpMatchArray | null;

  if ((m = ua.match(RE_EDGE))) return `Edge ${m[1]}`;
  if ((m = ua.match(RE_OPERA))) return `Opera ${m[1]}`;
  if ((m = ua.match(RE_SAMSUNG))) return `Samsung Internet ${m[1]}`;
  if ((m = ua.match(RE_UC))) return `UC Browser ${m[1]}`;
  if ((m = ua.match(RE_FIREFOX))) return `Firefox ${m[1]}`;
  if ((m = ua.match(RE_CHROME)) && !ua.includes('Edg') && !ua.includes('OPR')) return `Chrome ${m[1]}`;
  if ((m = ua.match(RE_SAFARI))) return `Safari ${m[1]}`;
  if ((m = ua.match(RE_IE))) return `IE ${m[1]}`;

  return 'Unknown';
}

function parseOS(ua: string): string {
  let m: RegExpMatchArray | null;

  if ((m = ua.match(RE_IOS))) return `iOS ${m[1].replace(/_/g, '.')}`;
  if ((m = ua.match(RE_MAC))) return `macOS ${m[1].replace(/_/g, '.')}`;
  if ((m = ua.match(RE_ANDROID))) return `Android ${m[1]}`;

  if (ua.includes('Windows NT 10.0')) return 'Windows 10+';
  if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (ua.includes('Windows NT 6.2')) return 'Windows 8';
  if (ua.includes('Windows NT 6.1')) return 'Windows 7';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('CrOS')) return 'Chrome OS';
  if (ua.includes('Linux')) return 'Linux';

  return 'Unknown';
}

function parseDeviceType(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (RE_TABLET.test(ua)) return 'tablet';
  if (RE_ANDROID_TABLET.test(ua) && !RE_NOT_MOBILE.test(ua)) return 'tablet';
  if (RE_MOBILE.test(ua)) return 'mobile';
  return 'desktop';
}
