import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { parseUserAgent } from '@/app/lib/parseUserAgent';

export async function POST(request: Request) {
  try {
    const { email, deviceId, sessionId } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Extract client IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : request.headers.get('x-real-ip') || 'unknown';

    const client = await clientPromise;
    const db = client.db();

    // Add new email with timestamp and IP address
    const newEntry = {
      email,
      ip,
      timestamp: new Date().toISOString()
    };
    
    // Write to MongoDB
    await db.collection('emails').insertOne(newEntry);

    // Also record an email_submitted activity event
    if (deviceId && sessionId) {
      const uaString = request.headers.get('user-agent') || '';
      const { browser, os, deviceType } = parseUserAgent(uaString);

      const activity = {
        timestamp: new Date().toISOString(),
        eventType: 'email_submitted',
        page: '/signup',
        ipAddress: ip,
        deviceId,
        sessionId,
        email,
        userAgent: uaString,
        browser,
        os,
        deviceType,
        referrer: null,
      };

      await db.collection('activities').insertOne(activity);
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
