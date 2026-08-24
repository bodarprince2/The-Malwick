"use client";

import { useState, useMemo, memo, useCallback } from "react";

/* ─────────────────── Types ─────────────────── */

interface EmailEntry {
  id: number | string;
  email: string;
  ip: string;
  timestamp: string;
}

interface ActivityEntry {
  activityId: number | string;
  timestamp: string;
  eventType: string;
  page: string;
  ipAddress: string;
  deviceId: string;
  sessionId: string;
  email: string | null;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  referrer: string | null;
}

interface AdminDashboardProps {
  emails: EmailEntry[];
  activities: ActivityEntry[];
}

type Tab = "waitlist" | "activity";
type SortOrder = "newest" | "oldest";

interface Filters {
  search: string;
  dateFrom: string;
  dateTo: string;
  eventType: string;
  ip: string;
  deviceId: string;
  email: string;
  page: string;
  browser: string;
  os: string;
  deviceType: string;
}

const EMPTY_FILTERS: Filters = {
  search: "",
  dateFrom: "",
  dateTo: "",
  eventType: "",
  ip: "",
  deviceId: "",
  email: "",
  page: "",
  browser: "",
  os: "",
  deviceType: "",
};

const PAGE_SIZE = 50;

/* ─────────────────── Helpers ─────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function shortId(id: string) {
  return id.split("-")[0] + "…";
}

function eventLabel(eventType: string) {
  switch (eventType) {
    case "page_view":
      return "Page View";
    case "email_submitted":
      return "Email Submitted";
    default:
      return eventType;
  }
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/* ─────────────────── Detail Panel ─────────────────── */

type DetailType = "email" | "ip" | "device";

interface DetailTarget {
  type: DetailType;
  value: string;
}

function DetailPanel({
  target,
  indexByEmail,
  indexByIp,
  indexByDevice,
  onClose,
  onNavigate,
}: {
  target: DetailTarget;
  indexByEmail: Map<string, ActivityEntry[]>;
  indexByIp: Map<string, ActivityEntry[]>;
  indexByDevice: Map<string, ActivityEntry[]>;
  onClose: () => void;
  onNavigate: (t: DetailTarget) => void;
}) {
  // ── DSA: O(1) HashMap lookup instead of O(n) filter ──
  const related = useMemo(() => {
    switch (target.type) {
      case "email":
        return indexByEmail.get(target.value) || [];
      case "ip":
        return indexByIp.get(target.value) || [];
      case "device":
        return indexByDevice.get(target.value) || [];
    }
  }, [target, indexByEmail, indexByIp, indexByDevice]);

  const sorted = useMemo(
    () => [...related].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [related]
  );

  const ips = unique(related.map((a) => a.ipAddress));
  const devices = unique(related.map((a) => a.deviceId));
  const emails = unique(related.map((a) => a.email).filter(Boolean) as string[]);
  const pages = unique(related.map((a) => a.page));
  const sessions = unique(related.map((a) => a.sessionId));

  const firstSeen = sorted.length > 0 ? sorted[0].timestamp : null;
  const lastSeen = sorted.length > 0 ? sorted[sorted.length - 1].timestamp : null;

  const labelMap: Record<DetailType, string> = {
    email: "Email",
    ip: "IP Address",
    device: "Device ID",
  };

  return (
    <div className="bg-white border border-[#1a3c34]/10 rounded-lg shadow-lg p-6 mb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#4a5c54] mb-1">
            {labelMap[target.type]} Detail
          </p>
          <p className="font-mono text-lg font-semibold text-[#1a3c34] break-all">
            {target.value}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#8a948f] hover:text-[#1a3c34] transition-colors p-1"
          aria-label="Close detail panel"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#f6f3eb] rounded p-3">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1">Total Activities</p>
          <p className="text-xl font-semibold text-[#1a3c34]">{related.length}</p>
        </div>
        <div className="bg-[#f6f3eb] rounded p-3">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1">Sessions</p>
          <p className="text-xl font-semibold text-[#1a3c34]">{sessions.length}</p>
        </div>
        <div className="bg-[#f6f3eb] rounded p-3">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1">First Seen</p>
          <p className="text-sm font-medium text-[#1a3c34]">{firstSeen ? formatDate(firstSeen) : "—"}</p>
        </div>
        <div className="bg-[#f6f3eb] rounded p-3">
          <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1">Last Seen</p>
          <p className="text-sm font-medium text-[#1a3c34]">{lastSeen ? formatDate(lastSeen) : "—"}</p>
        </div>
      </div>

      {/* Related Entities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {target.type !== "email" && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-2">Associated Emails</p>
            {emails.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {emails.map((e) => (
                  <button key={e} onClick={() => onNavigate({ type: "email", value: e })}
                    className="text-xs bg-[#1a3c34] text-[#fdfbf7] px-2 py-1 rounded hover:bg-[#2c544a] transition-colors font-mono">
                    {e}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8a948f]">No email associated</p>
            )}
          </div>
        )}
        {target.type !== "ip" && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-2">IP Addresses</p>
            <div className="flex flex-wrap gap-1">
              {ips.map((ip) => (
                <button key={ip} onClick={() => onNavigate({ type: "ip", value: ip })}
                  className="text-xs bg-[#f6f3eb] text-[#1a3c34] px-2 py-1 rounded hover:bg-[#e8dcc4] transition-colors font-mono border border-[#1a3c34]/10">
                  {ip}
                </button>
              ))}
            </div>
          </div>
        )}
        {target.type !== "device" && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-2">Devices</p>
            <div className="flex flex-wrap gap-1">
              {devices.map((d) => (
                <button key={d} onClick={() => onNavigate({ type: "device", value: d })}
                  className="text-xs bg-[#f6f3eb] text-[#1a3c34] px-2 py-1 rounded hover:bg-[#e8dcc4] transition-colors font-mono border border-[#1a3c34]/10">
                  {shortId(d)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pages Visited */}
      <div className="mb-6">
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-2">Pages Visited</p>
        <div className="flex flex-wrap gap-1">
          {pages.map((p) => (
            <span key={p} className="text-xs bg-[#f6f3eb] text-[#4a5c54] px-2 py-1 rounded font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <p className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-3">Activity Timeline</p>
        <div className="max-h-80 overflow-y-auto border border-[#1a3c34]/5 rounded">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 bg-[#f6f3eb]">
              <tr>
                <th className="p-2 text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f]">Time</th>
                <th className="p-2 text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f]">Event</th>
                <th className="p-2 text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f]">Page</th>
                <th className="p-2 text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f] hidden md:table-cell">Browser/OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3c34]/5">
              {sorted.map((a) => (
                <tr key={a.activityId} className="hover:bg-[#fdfbf7]/50">
                  <td className="p-2 font-mono text-xs text-[#4a5c54] whitespace-nowrap">{formatTime(a.timestamp)}</td>
                  <td className="p-2">
                    <span className={`inline-block text-[0.65rem] font-semibold px-2 py-0.5 rounded ${
                      a.eventType === "email_submitted"
                        ? "bg-[#1a3c34] text-[#fdfbf7]"
                        : "bg-[#e8dcc4] text-[#1a3c34]"
                    }`}>{eventLabel(a.eventType)}</span>
                  </td>
                  <td className="p-2 font-mono text-xs text-[#1a3c34]">{a.page}</td>
                  <td className="p-2 text-xs text-[#8a948f] hidden md:table-cell">{a.browser} · {a.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Main Dashboard ─────────────────── */

export default function AdminDashboard({ emails, activities }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("waitlist");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<DetailTarget | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Memoized unique values for filter dropdowns
  const filterOptions = useMemo(() => ({
    browsers: unique(activities.map((a) => a.browser)).filter(Boolean).sort(),
    oses: unique(activities.map((a) => a.os)).filter(Boolean).sort(),
    eventTypes: unique(activities.map((a) => a.eventType)).sort(),
    pages: unique(activities.map((a) => a.page)).sort(),
  }), [activities]);

  // ── DSA: Build HashMap indexes for O(1) detail lookups ──
  // Building these once is O(n), but each detail lookup becomes O(1)
  // instead of O(n). Net win when users click multiple details.
  const { indexByEmail, indexByIp, indexByDevice } = useMemo(() => {
    const byEmail = new Map<string, ActivityEntry[]>();
    const byIp = new Map<string, ActivityEntry[]>();
    const byDevice = new Map<string, ActivityEntry[]>();

    for (const a of activities) {
      // Index by IP
      const ipList = byIp.get(a.ipAddress);
      if (ipList) ipList.push(a); else byIp.set(a.ipAddress, [a]);

      // Index by device
      const devList = byDevice.get(a.deviceId);
      if (devList) devList.push(a); else byDevice.set(a.deviceId, [a]);

      // Index by email (only if present)
      if (a.email) {
        const emList = byEmail.get(a.email);
        if (emList) emList.push(a); else byEmail.set(a.email, [a]);
      }
    }

    return { indexByEmail: byEmail, indexByIp: byIp, indexByDevice: byDevice };
  }, [activities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          (a.email?.toLowerCase() || "").includes(q) ||
          a.ipAddress.toLowerCase().includes(q) ||
          a.deviceId.toLowerCase().includes(q) ||
          a.page.toLowerCase().includes(q) ||
          a.browser.toLowerCase().includes(q) ||
          a.os.toLowerCase().includes(q) ||
          a.eventType.toLowerCase().includes(q) ||
          a.sessionId.toLowerCase().includes(q)
      );
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      result = result.filter((a) => new Date(a.timestamp).getTime() >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo + "T23:59:59").getTime();
      result = result.filter((a) => new Date(a.timestamp).getTime() <= to);
    }
    if (filters.eventType) {
      result = result.filter((a) => a.eventType === filters.eventType);
    }
    if (filters.ip) {
      const q = filters.ip.toLowerCase();
      result = result.filter((a) => a.ipAddress.toLowerCase().includes(q));
    }
    if (filters.deviceId) {
      const q = filters.deviceId.toLowerCase();
      result = result.filter((a) => a.deviceId.toLowerCase().includes(q));
    }
    if (filters.email) {
      const q = filters.email.toLowerCase();
      result = result.filter((a) => (a.email?.toLowerCase() || "").includes(q));
    }
    if (filters.page) {
      const q = filters.page.toLowerCase();
      result = result.filter((a) => a.page.toLowerCase().includes(q));
    }
    if (filters.browser) {
      result = result.filter((a) => a.browser === filters.browser);
    }
    if (filters.os) {
      result = result.filter((a) => a.os === filters.os);
    }
    if (filters.deviceType) {
      result = result.filter((a) => a.deviceType === filters.deviceType);
    }

    // Sort — use cached getTime() to avoid repeated Date parsing
    result.sort((a, b) => {
      const ta = new Date(a.timestamp).getTime();
      const tb = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });

    return result;
  }, [activities, filters, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const updateFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  }, []);

  const openDetail = useCallback((target: DetailTarget) => {
    setDetail(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Sorted emails (newest first)
  const sortedEmails = useMemo(() => [...emails].reverse(), [emails]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 lg:p-16 text-[#1a3c34]">
      <div className="max-w-[90rem] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-2">Admin Dashboard</h1>
          <p className="text-[#4a5c54] text-sm">Manage waitlist inquiries and track visitor activity</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-[#f6f3eb] rounded-lg p-1 w-fit">
          <button
            onClick={() => { setTab("waitlist"); setDetail(null); }}
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-md transition-all ${
              tab === "waitlist"
                ? "bg-[#1a3c34] text-[#fdfbf7] shadow-sm"
                : "text-[#4a5c54] hover:text-[#1a3c34]"
            }`}
          >
            Waitlist
            <span className={`ml-2 text-[0.6rem] px-1.5 py-0.5 rounded-full ${
              tab === "waitlist" ? "bg-[#fdfbf7]/20" : "bg-[#1a3c34]/10"
            }`}>{emails.length}</span>
          </button>
          <button
            onClick={() => { setTab("activity"); setDetail(null); }}
            className={`px-5 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-md transition-all ${
              tab === "activity"
                ? "bg-[#1a3c34] text-[#fdfbf7] shadow-sm"
                : "text-[#4a5c54] hover:text-[#1a3c34]"
            }`}
          >
            Activity
            <span className={`ml-2 text-[0.6rem] px-1.5 py-0.5 rounded-full ${
              tab === "activity" ? "bg-[#fdfbf7]/20" : "bg-[#1a3c34]/10"
            }`}>{activities.length}</span>
          </button>
        </div>

        {/* ─── Waitlist Tab ─── */}
        {tab === "waitlist" && (
          <div>
            <div className="mb-6">
              <p className="text-[#4a5c54] text-sm">Total signups: {sortedEmails.length}</p>
            </div>
            {sortedEmails.length === 0 ? (
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
                        <th className="p-4 font-semibold text-xs tracking-widest uppercase text-[#4a5c54]">IP Address</th>
                        <th className="p-4 font-semibold text-xs tracking-widest uppercase text-[#4a5c54]">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a3c34]/5">
                      {sortedEmails.map((entry) => (
                        <tr key={entry.id} className="hover:bg-[#fdfbf7]/50 transition-colors">
                          <td className="p-4 text-xs font-mono text-[#8a948f] w-32 truncate">{typeof entry.id === 'string' ? entry.id.split("-")[0] + "…" : entry.id}</td>
                          <td className="p-4 font-medium text-[#1a3c34]">{entry.email}</td>
                          <td className="p-4 text-sm font-mono text-[#4a5c54]">{entry.ip || "—"}</td>
                          <td className="p-4 text-sm text-[#4a5c54]">{formatDate(entry.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Activity Tab ─── */}
        {tab === "activity" && (
          <div>
            {/* Detail Panel */}
            {detail && (
              <DetailPanel
                target={detail}
                indexByEmail={indexByEmail}
                indexByIp={indexByIp}
                indexByDevice={indexByDevice}
                onClose={() => setDetail(null)}
                onNavigate={openDetail}
              />
            )}

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a948f]" viewBox="0 0 20 20" fill="none">
                  <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search activities…"
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1a3c34]/15 rounded-md text-sm outline-none focus:border-[#1a3c34] transition-colors"
                />
              </div>

              {/* Sort */}
              <button
                onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1a3c34]/15 rounded-md text-xs font-semibold tracking-wider uppercase text-[#4a5c54] hover:border-[#1a3c34] transition-colors whitespace-nowrap"
              >
                <svg className={`w-3.5 h-3.5 transition-transform ${sortOrder === "oldest" ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {sortOrder === "newest" ? "Newest" : "Oldest"}
              </button>

              {/* Toggle Filters */}
              <button
                onClick={() => setShowFilters((s) => !s)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-md text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                  showFilters || hasActiveFilters
                    ? "bg-[#1a3c34] text-[#fdfbf7] border-[#1a3c34]"
                    : "bg-white text-[#4a5c54] border-[#1a3c34]/15 hover:border-[#1a3c34]"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4a977]" />
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors whitespace-nowrap"
                >
                  Clear All
                </button>
              )}

              <p className="text-xs text-[#8a948f] whitespace-nowrap ml-auto">
                {filteredActivities.length} of {activities.length} activities
              </p>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white border border-[#1a3c34]/10 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-fade-in">
                <FilterInput label="IP Address" value={filters.ip} onChange={(v) => updateFilter("ip", v)} placeholder="e.g. 192.168.1.1" />
                <FilterInput label="Device ID" value={filters.deviceId} onChange={(v) => updateFilter("deviceId", v)} placeholder="e.g. abc123" />
                <FilterInput label="Email" value={filters.email} onChange={(v) => updateFilter("email", v)} placeholder="e.g. user@example.com" />
                <FilterInput label="Page" value={filters.page} onChange={(v) => updateFilter("page", v)} placeholder="e.g. /about" />
                <FilterSelect label="Event Type" value={filters.eventType} onChange={(v) => updateFilter("eventType", v)}
                  options={[{ value: "", label: "All Events" }, ...filterOptions.eventTypes.map((t) => ({ value: t, label: eventLabel(t) }))]} />
                <FilterSelect label="Browser" value={filters.browser} onChange={(v) => updateFilter("browser", v)}
                  options={[{ value: "", label: "All Browsers" }, ...filterOptions.browsers.map((b) => ({ value: b, label: b }))]} />
                <FilterSelect label="OS" value={filters.os} onChange={(v) => updateFilter("os", v)}
                  options={[{ value: "", label: "All OS" }, ...filterOptions.oses.map((o) => ({ value: o, label: o }))]} />
                <FilterSelect label="Device Type" value={filters.deviceType} onChange={(v) => updateFilter("deviceType", v)}
                  options={[{ value: "", label: "All Types" }, { value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }, { value: "tablet", label: "Tablet" }]} />
                <div>
                  <label className="text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1 block">Date From</label>
                  <input type="date" value={filters.dateFrom} onChange={(e) => updateFilter("dateFrom", e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#1a3c34]/15 rounded text-sm outline-none focus:border-[#1a3c34] transition-colors" />
                </div>
                <div>
                  <label className="text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1 block">Date To</label>
                  <input type="date" value={filters.dateTo} onChange={(e) => updateFilter("dateTo", e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#1a3c34]/15 rounded text-sm outline-none focus:border-[#1a3c34] transition-colors" />
                </div>
              </div>
            )}

            {/* Activity Table */}
            {filteredActivities.length === 0 ? (
              <div className="bg-[#f6f3eb] p-12 text-center rounded border border-[#1a3c34]/10 text-[#4a5c54]">
                {hasActiveFilters ? "No activities match your filters." : "No activity has been tracked yet."}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-[#1a3c34]/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-[#f6f3eb] border-b border-[#1a3c34]/10">
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Time</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Event</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Page</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Email</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">IP Address</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Device</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Browser / OS</th>
                        <th className="p-3 font-semibold text-[0.6rem] tracking-widest uppercase text-[#4a5c54]">Session</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a3c34]/5">
                      {paginatedActivities.map((a) => (
                        <tr key={a.activityId} className="hover:bg-[#fdfbf7]/50 transition-colors text-sm">
                          <td className="p-3 font-mono text-xs text-[#4a5c54] whitespace-nowrap">{formatDate(a.timestamp)}</td>
                          <td className="p-3">
                            <span className={`inline-block text-[0.6rem] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                              a.eventType === "email_submitted"
                                ? "bg-[#1a3c34] text-[#fdfbf7]"
                                : "bg-[#e8dcc4] text-[#1a3c34]"
                            }`}>{eventLabel(a.eventType)}</span>
                          </td>
                          <td className="p-3 font-mono text-xs text-[#1a3c34]">{a.page}</td>
                          <td className="p-3">
                            {a.email ? (
                              <button onClick={() => openDetail({ type: "email", value: a.email! })}
                                className="text-xs font-medium text-[#1a3c34] underline decoration-[#c4a977] underline-offset-2 hover:text-[#c4a977] transition-colors">
                                {a.email}
                              </button>
                            ) : (
                              <span className="text-xs text-[#8a948f]">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <button onClick={() => openDetail({ type: "ip", value: a.ipAddress })}
                              className="text-xs font-mono text-[#4a5c54] hover:text-[#1a3c34] transition-colors underline decoration-dotted underline-offset-2">
                              {a.ipAddress}
                            </button>
                          </td>
                          <td className="p-3">
                            <button onClick={() => openDetail({ type: "device", value: a.deviceId })}
                              className="text-xs font-mono text-[#4a5c54] hover:text-[#1a3c34] transition-colors underline decoration-dotted underline-offset-2">
                              {shortId(a.deviceId)}
                            </button>
                          </td>
                          <td className="p-3 text-xs text-[#8a948f] whitespace-nowrap">
                            <span>{a.browser}</span>
                            <span className="mx-1 text-[#1a3c34]/20">·</span>
                            <span>{a.os}</span>
                            <span className="mx-1 text-[#1a3c34]/20">·</span>
                            <span className="capitalize">{a.deviceType}</span>
                          </td>
                          <td className="p-3 font-mono text-[0.6rem] text-[#8a948f]">{shortId(a.sessionId)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a3c34]/10 bg-[#f6f3eb]/50">
                    <p className="text-xs text-[#8a948f]">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase bg-white border border-[#1a3c34]/15 rounded hover:border-[#1a3c34] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase bg-white border border-[#1a3c34]/15 rounded hover:border-[#1a3c34] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Filter Sub-Components ─────────────────── */

const FilterInput = memo(function FilterInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#1a3c34]/15 rounded text-sm outline-none focus:border-[#1a3c34] transition-colors"
      />
    </div>
  );
});

const FilterSelect = memo(function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-[0.6rem] font-semibold tracking-widest uppercase text-[#8a948f] mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#fdfbf7] border border-[#1a3c34]/15 rounded text-sm outline-none focus:border-[#1a3c34] transition-colors appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
});
