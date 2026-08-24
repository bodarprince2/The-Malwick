"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Paths that should NOT be tracked (admin pages)
const EXCLUDED_PATHS = ["/json-data"];

// ── Cached IDs (avoid repeated localStorage/sessionStorage reads) ──

let _deviceId: string | null = null;
let _sessionId: string | null = null;

function getDeviceId(): string {
  if (_deviceId) return _deviceId;
  if (typeof window === "undefined") return "";
  const KEY = "mlw_device_id";
  _deviceId = localStorage.getItem(KEY);
  if (!_deviceId) {
    _deviceId = crypto.randomUUID();
    localStorage.setItem(KEY, _deviceId);
  }
  return _deviceId;
}

function getSessionId(): string {
  if (_sessionId) return _sessionId;
  if (typeof window === "undefined") return "";
  const KEY = "mlw_session_id";
  _sessionId = sessionStorage.getItem(KEY);
  if (!_sessionId) {
    _sessionId = crypto.randomUUID();
    sessionStorage.setItem(KEY, _sessionId);
  }
  return _sessionId;
}

/**
 * Send tracking event — fire-and-forget via sendBeacon (zero overhead).
 * Pre-stringify & pre-create blob for minimal main-thread work.
 */
function sendTrackEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/track", blob)) return;
  }

  // Fallback — keepalive fetch won't block navigation
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

// Use requestIdleCallback if available, else setTimeout(fn, 0)
const scheduleIdle =
  typeof window !== "undefined" && "requestIdleCallback" in window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (window as any).requestIdleCallback
    : (fn: () => void) => setTimeout(fn, 0);

/**
 * ActivityTracker — zero-render-cost invisible tracker.
 * Uses requestIdleCallback to defer tracking until the browser is idle,
 * so page paint is never delayed.
 */
export default function ActivityTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<{ path: string; time: number } | null>(null);

  useEffect(() => {
    // Skip excluded paths
    if (EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) return;

    // Dedup: skip if same path was tracked < 2 seconds ago
    const now = Date.now();
    if (
      lastTrackedRef.current &&
      lastTrackedRef.current.path === pathname &&
      now - lastTrackedRef.current.time < 2000
    ) {
      return;
    }

    lastTrackedRef.current = { path: pathname, time: now };

    // Defer to idle callback — never blocks paint/interaction
    scheduleIdle(() => {
      sendTrackEvent({
        eventType: "page_view",
        page: pathname,
        referrer: document.referrer || null,
        deviceId: getDeviceId(),
        sessionId: getSessionId(),
        userAgent: navigator.userAgent,
      });
    });
  }, [pathname]);

  return null;
}

/**
 * Helper to get tracking IDs from client-side code.
 * Used by EmailSignup to associate the email with the visitor.
 */
export function getTrackingIds(): { deviceId: string; sessionId: string } {
  return {
    deviceId: getDeviceId(),
    sessionId: getSessionId(),
  };
}
