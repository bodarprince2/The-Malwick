import { Metadata } from 'next';
import clientPromise from '@/app/lib/mongodb';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | The Melwick',
  robots: {
    index: false,
    follow: false,
  }
};

// Next.js config to ensure this route is dynamically rendered (not cached)
export const dynamic = 'force-dynamic';

export default async function JsonDataPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let emails: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let activities: any[] = [];
  let error: string | null = null;

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch and natively sort by timestamp (newest first)
    const rawEmails = await db.collection('emails').find().sort({ timestamp: -1 }).toArray();
    emails = rawEmails.map(doc => ({ ...doc, _id: doc._id.toString() }));

  } catch (e: any) {
    error = "Could not read emails data from MongoDB. Ensure MONGO_URI is set.";
    console.error(e);
  }

  try {
    if (!error) {
      const client = await clientPromise;
      const db = client.db();
      const rawActivities = await db.collection('activities').find().sort({ timestamp: -1 }).toArray();
      activities = rawActivities.map(doc => ({ ...doc, _id: doc._id.toString() }));
    }
  } catch (e: any) {
    if (!error) error = "Could not read activity data from MongoDB.";
    console.error(e);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] p-8 md:p-16 text-[#1a3c34]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded border border-red-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard emails={emails} activities={activities} />;
}
