import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { parseUserAgent } from '@/app/lib/parseUserAgent';

// In-memory dedup using HashMap - O(1) lookup
// Note: This only deduplicates within the same serverless function instance, 
// which is acceptable for a best-effort approach in serverless environments.
const recentEvents = new Map<string, number>();
const DEDUP_WINDOW_MS = 2000;

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

    // O(1) dedup check using HashMap
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

    // Increment activity ID counter in KV
    const activityId = await kv.incr('activity_id_counter');

    const activity = {
      activityId,
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

    // Push the activity to KV list
    await kv.rpush('activity_list', activity);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
