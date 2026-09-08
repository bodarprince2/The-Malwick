import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('activities');

    // Fetch activities sorted by latest first
    const activities = await collection
      .find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination info
    const total = await collection.countDocuments();
    const hasMore = skip + activities.length < total;

    return NextResponse.json({ 
      success: true, 
      data: activities,
      pagination: {
        total,
        page,
        limit,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
