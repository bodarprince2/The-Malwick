import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all pre-orders, sorted by newest first
    const preOrders = await db
      .collection('pre_orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, preOrders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pre-orders:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
