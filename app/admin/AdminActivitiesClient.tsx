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

  return (
    <div className="bg-white text-black min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-display">User Activity Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Time</th>
                <th scope="col" className="px-6 py-3">Event Type</th>
                <th scope="col" className="px-6 py-3">User Email</th>
                <th scope="col" className="px-6 py-3">Page</th>
                <th scope="col" className="px-6 py-3">Device / OS</th>
                <th scope="col" className="px-6 py-3">Session ID</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => {
                let formattedDate = activity.timestamp;
                try {
                  const date = new Date(activity.timestamp);
                  formattedDate = new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(date);
                } catch {
                  // Ignore date format error
                }
                
                return (
                  <tr 
                    key={`${activity._id}-${index}`} 
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{formattedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activity.eventType === 'view_shop' ? 'bg-blue-100 text-blue-800' :
                        activity.eventType === 'view_product' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {activity.email || <span className="text-gray-400 italic">Anonymous</span>}
                    </td>
                    <td className="px-6 py-4 truncate max-w-[200px]" title={activity.page}>
                      {activity.page}
                    </td>
                    <td className="px-6 py-4">
                      {activity.deviceType || 'Unknown'} / {activity.os || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono truncate max-w-[150px]" title={activity.sessionId}>
                      {activity.sessionId.substring(0, 8)}...
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Loading Indicator and Observer Target */}
        <div 
          ref={observerTarget} 
          className="w-full flex justify-center items-center py-8"
        >
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          {!hasMore && activities.length > 0 && !loading && (
            <p className="text-gray-500">No more activities to load.</p>
          )}
          {!loading && activities.length === 0 && (
            <p className="text-gray-500">No activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
