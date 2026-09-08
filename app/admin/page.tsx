import { Metadata } from 'next';
import Link from 'next/link';
import AdminActivitiesClient from './AdminActivitiesClient';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | The Melwick',
  description: 'Admin dashboard to track user activity.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentTab = resolvedSearchParams.tab || 'activity';

  return (
    <main className="min-h-screen bg-[#f8f6f2] flex flex-col">
      {/* Designer Refined Admin Header */}
      <header className="w-full px-6 py-4 md:px-12 flex items-center justify-between bg-[#f8f6f2]/90 backdrop-blur-xl z-50 sticky top-0 border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
        <div className="flex items-center gap-4 z-10">
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <img
              src="/logo.png"
              alt="The Melwick Logo"
              className="h-[36px] md:h-[44px] w-auto object-contain drop-shadow-sm"
            />
          </Link>
          <div className="h-6 w-[1px] bg-black/10 hidden md:block"></div>
          <span className="hidden md:block text-black/50 font-display text-sm tracking-[0.2em] uppercase font-medium mt-1">
            Workspace
          </span>
        </div>
        
        {/* Admin Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/admin?tab=activity" className="relative px-4 py-2.5 group">
            <span className={`${currentTab === 'activity' ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/60 group-hover:text-[#1a1a1a]'} font-medium text-sm tracking-wide transition-colors z-10 relative`}>
              Show Activity
            </span>
            {currentTab === 'activity' && (
              <div className="absolute inset-x-4 bottom-1 h-[2px] bg-black rounded-full shadow-sm"></div>
            )}
            <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link href="/admin?tab=notify" className="relative px-4 py-2.5 group">
            <span className={`${currentTab === 'notify' ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/60 group-hover:text-[#1a1a1a]'} font-medium text-sm tracking-wide transition-colors z-10 relative`}>
              View Notify Email
            </span>
            {currentTab === 'notify' && (
              <div className="absolute inset-x-4 bottom-1 h-[2px] bg-black rounded-full shadow-sm"></div>
            )}
            <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <Link href="/admin?tab=orders" className="relative px-4 py-2.5 group flex items-center gap-2">
            <span className={`${currentTab === 'orders' ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/60 group-hover:text-[#1a1a1a]'} font-medium text-sm tracking-wide transition-colors z-10 relative`}>
              Orders
            </span>
            {currentTab === 'orders' && (
              <div className="absolute inset-x-4 bottom-1 h-[2px] bg-black rounded-full shadow-sm"></div>
            )}
            <span className="relative z-10 flex h-[18px] items-center px-2 rounded-full bg-black/5 border border-black/10 text-[9px] font-bold text-black/60 uppercase tracking-widest shadow-sm group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
              Soon
            </span>
            <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </nav>

        {/* Profile/Actions */}
        <div className="flex items-center gap-5 z-10">
          <button className="relative p-2 text-black/40 hover:text-black transition-colors rounded-full hover:bg-black/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#b8976a] ring-2 ring-[#f8f6f2]"></span>
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="flex-col text-right hidden lg:flex">
              <span className="text-sm font-semibold text-black leading-none mb-1">Admin</span>
              <span className="text-[10px] font-medium text-black/50 tracking-widest uppercase leading-none">System</span>
            </div>
            <div className="relative">
              <div className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center text-black font-semibold text-sm bg-white shadow-sm group-hover:shadow-md group-hover:border-black/30 transition-all duration-300">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        {currentTab === 'activity' && <AdminActivitiesClient />}
        {currentTab === 'orders' && <AdminOrdersClient />}
        {currentTab === 'notify' && (
          <div className="flex items-center justify-center min-h-[50vh] text-[#5a5a5a]">
            Notify Email view coming soon.
          </div>
        )}
      </div>
    </main>
  );
}
