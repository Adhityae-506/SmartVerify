export function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' ' + d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function generateId(prefix = 'ID') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

export function getStatusColor(status) {
  const colors = {
    validated: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    passed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-slate-50 text-slate-600 border-slate-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    action_required: 'bg-amber-50 text-amber-700 border-amber-200',
    missing: 'bg-red-50 text-red-700 border-red-200',
    review_required: 'bg-amber-50 text-amber-700 border-amber-200',
    mismatch_detected: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-red-50 text-red-700 border-red-200',
    verification_pending: 'bg-blue-50 text-blue-700 border-blue-200',
    source_unavailable: 'bg-slate-50 text-slate-600 border-slate-200',
    manual_review_required: 'bg-amber-50 text-amber-700 border-amber-200',
    uploaded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    required: 'bg-slate-50 text-slate-600 border-slate-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return colors[status] || 'bg-slate-50 text-slate-600 border-slate-200';
}

export function getStatusLabel(status) {
  const labels = {
    validated: 'Validated',
    passed: 'Passed',
    verified: 'Verified',
    pending: 'Pending',
    in_progress: 'In Progress',
    action_required: 'Action Required',
    missing: 'Missing',
    review_required: 'Review Required',
    mismatch_detected: 'Mismatch Detected',
    expired: 'Expired',
    verification_pending: 'Verification Pending',
    source_unavailable: 'Source Unavailable',
    manual_review_required: 'Manual Review Required',
    uploaded: 'Uploaded',
    required: 'Required',
    resolved: 'Resolved',
    reviewed: 'Reviewed',
    clean: 'No Issues',
    missing_document: 'Missing Document',
    expired_certificate: 'Expired Certificate',
    intake_mismatch: 'Intake Mismatch',
    document_anomaly: 'Document Anomaly',
  };
  return labels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getSeverityColor(severity) {
  const colors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    info: 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return colors[severity] || 'bg-slate-50 text-slate-600 border-slate-200';
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
