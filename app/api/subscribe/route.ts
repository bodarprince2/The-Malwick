import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

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
    } catch (e) {
      // File probably doesn't exist yet, or is empty/corrupt
      emails = [];
    }

    // Add new email with timestamp
    const newEntry = {
      id: crypto.randomUUID(),
      email,
      timestamp: new Date().toISOString()
    };
    
    emails.push(newEntry);

    // Write back to file securely
    await fs.writeFile(filePath, JSON.stringify(emails, null, 2), 'utf-8');

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
