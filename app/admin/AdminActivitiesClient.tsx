'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

type Activity = {
  _id: string;
  timestamp: string;
  eventType: string;
  page: string;
  email: string | null;
  userAgent: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  referrer: string | null;
  deviceId: string;
  sessionId: string;
};

export default function AdminActivitiesClient() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef(null);

  const fetchActivities = useCallback(async (pageToFetch: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/activities?page=${pageToFetch}&limit=30`);
      if (!res.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const data = await res.json();
      
      if (data.success) {
        if (pageToFetch === 1) {
          setActivities(data.data);
        } else {
          setActivities((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.hasMore);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch activities');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchActivities(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, fetchActivities]);

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return timestamp;
    }
  };

  const getEventBadgeClasses = (eventType: string) => {
    switch (eventType) {
      case 'view_shop':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'view_product':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-[#f8f6f2] text-[#5a5a5a] border-[#1a1a1a]/10';
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-[#1a1a1a]">User Activity</h1>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8a8a8a]">
            {activities.length} entries loaded
          </span>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-4 text-sm">
            {error}
          </div>
        )}

        {/* ── Desktop: Full table (hidden on mobile) ── */}
        <div className="hidden md:block overflow-x-auto bg-white border border-[#1a1a1a]/10 shadow-sm rounded-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-widest text-[#8a8a8a] bg-[#f8f6f2]/50 border-b border-[#1a1a1a]/10">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Time</th>
                <th scope="col" className="px-6 py-4 font-medium">Event Type</th>
                <th scope="col" className="px-6 py-4 font-medium">User Email</th>
                <th scope="col" className="px-6 py-4 font-medium">Page</th>
                <th scope="col" className="px-6 py-4 font-medium">Device / OS</th>
                <th scope="col" className="px-6 py-4 font-medium">Session ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {activities.map((activity, index) => (
                <tr 
                  key={`${activity._id}-${index}`} 
                  className="hover:bg-[#f8f6f2]/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-[#5a5a5a]">{formatDate(activity.timestamp)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-sm text-xs font-semibold border ${getEventBadgeClasses(activity.eventType)}`}>
                      {activity.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                    {activity.email || <span className="text-[#8a8a8a] italic font-normal">Anonymous</span>}
                  </td>
                  <td className="px-6 py-4 truncate max-w-[200px] text-[#5a5a5a]" title={activity.page}>
                    {activity.page}
                  </td>
                  <td className="px-6 py-4 text-[#5a5a5a]">
                    {activity.deviceType || 'Unknown'} / {activity.os || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#8a8a8a] truncate max-w-[150px]" title={activity.sessionId}>
                    {activity.sessionId.substring(0, 8)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile: Card layout (hidden on desktop) ── */}
        <div className="md:hidden space-y-3">
          {activities.map((activity, index) => (
            <div
              key={`card-${activity._id}-${index}`}
              className="bg-white border border-[#1a1a1a]/10 rounded-sm p-4 shadow-sm"
            >
              {/* Top row: event badge + time */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getEventBadgeClasses(activity.eventType)}`}>
                  {activity.eventType}
                </span>
                <span className="text-[11px] text-[#8a8a8a] whitespace-nowrap">
                  {formatDate(activity.timestamp)}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[#8a8a8a] text-xs uppercase tracking-wider shrink-0">Email</span>
                  <span className="text-[#1a1a1a] font-medium text-right truncate">
                    {activity.email || <span className="text-[#8a8a8a] italic font-normal">Anonymous</span>}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#8a8a8a] text-xs uppercase tracking-wider shrink-0">Page</span>
                  <span className="text-[#5a5a5a] text-right truncate max-w-[200px]" title={activity.page}>
                    {activity.page}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#8a8a8a] text-xs uppercase tracking-wider shrink-0">Device</span>
                  <span className="text-[#5a5a5a] text-right">
                    {activity.deviceType || 'Unknown'} / {activity.os || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#8a8a8a] text-xs uppercase tracking-wider shrink-0">Session</span>
                  <span className="text-[#8a8a8a] font-mono text-xs text-right">
                    {activity.sessionId.substring(0, 12)}...
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading Indicator and Observer Target */}
        <div 
          ref={observerTarget} 
          className="w-full flex justify-center items-center py-8"
        >
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#1a1a1a] animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#1a1a1a] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#1a1a1a] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          {!hasMore && activities.length > 0 && !loading && (
            <p className="text-[#8a8a8a] text-sm">No more activities to load.</p>
          )}
          {!loading && activities.length === 0 && (
            <p className="text-[#8a8a8a] text-sm">No activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
