export const STORAGE_KEYS = {
  APPLICATIONS: 'sv_applications',
  SCENARIO: 'sv_scenario',
  REVIEW_COMMENTS: 'sv_review_comments',
  RESOLVED_FINDINGS: 'sv_resolved_findings',
  AUDIT_EVENTS: 'sv_audit_events',
  ENABLED_RULES: 'sv_enabled_rules',
  CURRENT_ROLE: 'sv_current_role',
};

export function loadState(key, defaultValue) {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized);
  } catch {
    return defaultValue;
  }
}

export function saveState(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    // Storage full or unavailable — silently ignore for demo
  }
}

export function resetAllDemoData() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sv_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch {
    // Storage unavailable — silently ignore for demo
  }
}
