import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parseUserAgent } from '@/app/lib/parseUserAgent';
import { withFileLock, readJsonArray } from '@/app/lib/fileLock';

const ACTIVITY_FILE = path.join(process.cwd(), 'data', 'activity.json');

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

    // Prepare data file path (store in the project root /data directory)
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'emails.json');

    // Create directory if it doesn't exist
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Read existing emails
    let emails = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      emails = JSON.parse(fileData);
    } catch {
      // File probably doesn't exist yet, or is empty/corrupt
      emails = [];
    }

    // Generate a sequential numeric ID
    const newId = emails.length > 0 ? emails[emails.length - 1].id + 1 : 1;

    // Add new email with timestamp and IP address
    const newEntry = {
      id: newId,
      email,
      ip,
      timestamp: new Date().toISOString()
    };
    
    emails.push(newEntry);

    // Write back to file securely
    await fs.writeFile(filePath, JSON.stringify(emails, null, 2), 'utf-8');

    // Also record an email_submitted activity event
    if (deviceId && sessionId) {
      const uaString = request.headers.get('user-agent') || '';
      const { browser, os, deviceType } = parseUserAgent(uaString);

      const activity = {
        activityId: 0,
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

      await withFileLock('activity', async () => {
        const data = await readJsonArray(ACTIVITY_FILE);
        const nextId = data.length > 0 && typeof data[data.length - 1].activityId === 'number'
          ? data[data.length - 1].activityId + 1
          : data.length + 1;
        activity.activityId = nextId;
        data.push(activity);
        await fs.writeFile(ACTIVITY_FILE, JSON.stringify(data, null, 2), 'utf-8');
      });
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
