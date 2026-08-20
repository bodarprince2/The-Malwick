import { Metadata } from 'next';
import fs from 'fs/promises';
import path from 'path';

export const metadata: Metadata = {
  title: 'Inquiry Data | The Melwick',
  robots: {
    index: false,
    follow: false,
  }
};

// Next.js config to ensure this route is dynamically rendered (not cached)
export const dynamic = 'force-dynamic';

export default async function JsonDataPage() {
  let emails = [];
  let error = null;

  try {
    const filePath = path.join(process.cwd(), 'data', 'emails.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    emails = JSON.parse(fileData);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      // File doesn't exist yet, which is fine (0 signups)
      emails = [];
    } else {
      error = "Could not read data file. It may be corrupt or inaccessible.";
      console.error(e);
    }
  }

  // Reverse so newest is at the top
  const sortedEmails = [...emails].reverse();

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-8 md:p-16 text-[#1a3c34]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">Waitlist Inquiries</h1>
          <p className="text-[#4a5c54]">Total signups: {sortedEmails.length}</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded border border-red-200">
            {error}
          </div>
        ) : sortedEmails.length === 0 ? (
          <div className="bg-[#f6f3eb] p-12 text-center rounded border border-[#1a3c34]/10 text-[#4a5c54]">
            No emails have been submitted yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#1a3c34]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f6f3eb] border-b border-[#1a3c34]/10">
                    <th className="p-4 font-semibold text-xs tracking-widest uppercase text-[#4a5c54]">ID</th>
                    <th className="p-4 font-semibold text-xs tracking-widest uppercase text-[#4a5c54]">Email Address</th>
                    <th className="p-4 font-semibold text-xs tracking-widest uppercase text-[#4a5c54]">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a3c34]/5">
                  {sortedEmails.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-[#fdfbf7]/50 transition-colors">
                      <td className="p-4 text-xs font-mono text-[#8a948f] w-32 truncate">{entry.id.split('-')[0]}...</td>
                      <td className="p-4 font-medium text-[#1a3c34]">{entry.email}</td>
                      <td className="p-4 text-sm text-[#4a5c54]">
                        {new Date(entry.timestamp).toLocaleString(undefined, { 
                          dateStyle: 'medium', 
                          timeStyle: 'medium' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
