//
// BadgeManager.js
// PUBLIC_INTERFACE
// Gamified badge logic for tracking, awarding, and persisting badges per user.
//

// Awardable badges (expandable)
const BADGES = [
  {
    key: "passwordPro",
    displayName: "Password Pro",
    description: "Score 100% on password security quiz items.",
    emoji: "🔐",
    criteria: (quizScore, contractUploaded) => quizScore === 100,
  },
  {
    key: "contractCoder",
    displayName: "Contract Coder",
    description: "Successfully upload and analyze a legal contract.",
    emoji: "📄",
    criteria: (quizScore, contractUploaded) => !!contractUploaded,
  },
];

// Helper to get badge object by key
function getBadgeByKey(key) {
  return BADGES.find(b => b.key === key);
}

// PUBLIC_INTERFACE
function getAllBadges() {
  return BADGES;
}

// PUBLIC_INTERFACE
function listEarnedBadges(user) {
  if (!user) return [];
  let badges = [];
  try {
    let raw = window.localStorage.getItem(`cyberlegalBadges.${user.username || "guest"}`);
    if (raw) badges = JSON.parse(raw);
  } catch {}
  return Array.isArray(badges) ? badges : [];
}

// PUBLIC_INTERFACE
function addBadgeForUser(user, badgeKey) {
  if (!user) return false;
  const already = listEarnedBadges(user);
  if (!already.includes(badgeKey)) {
    const updated = already.concat(badgeKey);
    window.localStorage.setItem(`cyberlegalBadges.${user.username || "guest"}`, JSON.stringify(updated));
    return true;
  }
  return false;
}

// PUBLIC_INTERFACE
function maybeAwardBadges(user, { quizScore, contractUploaded }) {
  if (!user) return [];
  let changes = [];
  BADGES.forEach(badge => {
    if (badge.criteria(quizScore, contractUploaded)) {
      if (addBadgeForUser(user, badge.key)) {
        changes.push(badge.key);
      }
    }
  });
  return changes;
}

export {
  getAllBadges,
  listEarnedBadges,
  addBadgeForUser,
  maybeAwardBadges,
  getBadgeByKey
};
