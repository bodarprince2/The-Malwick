import { Metadata } from 'next';
import { kv } from '@vercel/kv';
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
    emails = await kv.lrange('emails_list', 0, -1) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error = "Could not read emails data from database. Ensure KV_REST_API_URL and KV_REST_API_TOKEN are set.";
    console.error(e);
  }

  try {
    activities = await kv.lrange('activity_list', 0, -1) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!error) error = "Could not read activity data from database.";
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
