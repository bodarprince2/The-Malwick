import { Metadata } from 'next';
import fs from 'fs/promises';
import path from 'path';
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
    const emailsPath = path.join(process.cwd(), 'data', 'emails.json');
    const emailsData = await fs.readFile(emailsPath, 'utf-8');
    emails = JSON.parse(emailsData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      error = "Could not read emails data file.";
      console.error(e);
    }
  }

  try {
    const activityPath = path.join(process.cwd(), 'data', 'activity.json');
    const activityData = await fs.readFile(activityPath, 'utf-8');
    activities = JSON.parse(activityData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      if (!error) error = "Could not read activity data file.";
      console.error(e);
    }
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
