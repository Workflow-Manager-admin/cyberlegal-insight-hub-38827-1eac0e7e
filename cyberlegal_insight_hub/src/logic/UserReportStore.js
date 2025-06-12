//
// UserReportStore.js
// PUBLIC_INTERFACE
// Manages saving, listing, and retrieving risk reports per user—persistent in localStorage for logged-in users, in-memory for guest sessions.
//
// All report data is stored under a per-user key in localStorage: 'cyberlegalUserReports_USERNAME'
// Guest users get an in-memory report list (lost on refresh).
//

// Simple in-memory fallback per session for "guest" mode
const guestStore = {
  reports: [],
};

// PUBLIC_INTERFACE
/**
 * Saves a completed risk report for the user.
 * @param {Object} user - {username: String, isGuest: Boolean}
 * @param {Object} report - Object representing completed report (options: date, data, any metadata)
 * @returns {void}
 */
export function saveReport(user, report) {
  if (!user) return;
  const stamp = {
    ...report,
    id: Date.now() + "-" + Math.floor(Math.random() * 100000), // unique
    date: new Date().toISOString(),
  };
  if (user.isGuest) {
    guestStore.reports.unshift(stamp);
    // Keep max 10 for guest sanity
    if (guestStore.reports.length > 10) guestStore.reports.length = 10;
  } else {
    const key = `cyberlegalUserReports_${user.username}`;
    let all = [];
    try {
      all = JSON.parse(window.localStorage.getItem(key)) || [];
    } catch {}
    all.unshift(stamp);
    // Store max 30 per user
    if (all.length > 30) all.length = 30;
    window.localStorage.setItem(key, JSON.stringify(all));
  }
}

/**
 * Gets the list of completed reports for the user (sorted most recent first).
 * @param {Object} user - {username: String, isGuest: Boolean}
 * @returns {Array} Array of report summaries (date, id, etc.)
 */
export function getReports(user) {
  if (!user) return [];
  if (user.isGuest) {
    return guestStore.reports.slice();
  } else {
    const key = `cyberlegalUserReports_${user.username}`;
    try {
      return JSON.parse(window.localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }
}

/**
 * Retrieves a single report by ID for the user.
 * @param {Object} user - {username: String, isGuest: Boolean}
 * @param {string} reportId - ID of the report to fetch.
 * @returns {Object|null} The report object, or null if not found.
 */
export function getReportById(user, reportId) {
  if (!user || !reportId) return null;
  const reports = getReports(user);
  return reports.find(r => String(r.id) === String(reportId)) || null;
}

// PUBLIC_INTERFACE
/**
 * Deletes a report by ID for the user.
 * @param {Object} user
 * @param {string} reportId
 */
export function deleteReport(user, reportId) {
  if (!user || !reportId) return;
  if (user.isGuest) {
    guestStore.reports = guestStore.reports.filter(r => String(r.id) !== String(reportId));
  } else {
    const key = `cyberlegalUserReports_${user.username}`;
    let all = [];
    try {
      all = JSON.parse(window.localStorage.getItem(key)) || [];
    } catch {}
    all = all.filter(r => String(r.id) !== String(reportId));
    window.localStorage.setItem(key, JSON.stringify(all));
  }
}
