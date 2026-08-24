import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { parseUserAgent } from '@/app/lib/parseUserAgent';

const ACTIVITY_FILE = path.join(process.cwd(), 'data', 'activity.json');

// ── DSA: In-memory dedup using HashMap — O(1) lookup ──
const recentEvents = new Map<string, number>();
const DEDUP_WINDOW_MS = 2000;

// ── DSA: Write Buffer (amortized I/O) ──
// Instead of reading + parsing + appending + writing the entire JSON file
// on every request (O(n) per write), we buffer entries in memory and flush
// them in a single batch write. This gives amortized O(1) per tracking call.
let writeBuffer: Record<string, unknown>[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;
const FLUSH_INTERVAL_MS = 3000; // Flush every 3 seconds
const MAX_BUFFER_SIZE = 50;     // Or when buffer hits 50 entries

async function flushBuffer() {
  if (isFlushing || writeBuffer.length === 0) return;
  isFlushing = true;

  // Grab current buffer and reset
  const entries = writeBuffer;
  writeBuffer = [];

  try {
    const dataDir = path.dirname(ACTIVITY_FILE);
    try { await fs.access(dataDir); } catch { await fs.mkdir(dataDir, { recursive: true }); }

    let existing: Record<string, unknown>[] = [];
    try {
      const raw = await fs.readFile(ACTIVITY_FILE, 'utf-8');
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch { existing = []; }

    // Assign sequential numeric IDs based on the array length
    let nextId = existing.length > 0 && typeof existing[existing.length - 1].activityId === 'number' 
      ? (existing[existing.length - 1].activityId as number) + 1 
      : existing.length + 1;

    for (const entry of entries) {
      entry.activityId = nextId++;
    }

    // Push all buffered entries at once — single file write
    existing.push(...entries);
    await fs.writeFile(ACTIVITY_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (e) {
    console.error('Activity flush error:', e);
    // Put entries back so they aren't lost
    writeBuffer.unshift(...entries);
  } finally {
    isFlushing = false;
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushBuffer();
  }, FLUSH_INTERVAL_MS);
}

// Cleanup stale dedup entries every 30s
setInterval(() => {
  const cutoff = Date.now() - DEDUP_WINDOW_MS * 5;
  for (const [key, ts] of recentEvents) {
    if (ts < cutoff) recentEvents.delete(key);
  }
}, 30_000);

// Flush on process exit so no data is lost
if (typeof process !== 'undefined') {
  const exitFlush = () => { if (writeBuffer.length > 0) flushBuffer(); };
  process.on('beforeExit', exitFlush);
  process.on('SIGTERM', exitFlush);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, page, referrer, deviceId, sessionId, email, userAgent: clientUA } = body;

    // Validate required fields
    if (!eventType || !page || !deviceId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, page, deviceId, sessionId' },
        { status: 400 }
      );
    }

    // ── O(1) dedup check using HashMap ──
    if (eventType === 'page_view') {
      const dedupKey = `${sessionId}:${page}`;
      const lastSeen = recentEvents.get(dedupKey);
      const now = Date.now();
      if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
        return NextResponse.json({ success: true, deduplicated: true });
      }
      recentEvents.set(dedupKey, now);
    }

    // Extract IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded
      ? forwarded.split(',')[0].trim()
      : request.headers.get('x-real-ip') || 'unknown';

    // Parse user agent
    const uaString = request.headers.get('user-agent') || clientUA || '';
    const { browser, os, deviceType } = parseUserAgent(uaString);

    const activity = {
      activityId: 0, // Placeholder, will be assigned sequentially on flush
      timestamp: new Date().toISOString(),
      eventType,
      page,
      ipAddress,
      deviceId,
      sessionId,
      email: email || null,
      userAgent: uaString,
      browser,
      os,
      deviceType,
      referrer: referrer || null,
    };

    // ── Buffer instead of immediate write ──
    writeBuffer.push(activity);

    // Flush if buffer is full, otherwise schedule a delayed flush
    if (writeBuffer.length >= MAX_BUFFER_SIZE) {
      await flushBuffer();
    } else {
      scheduleFlush();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
