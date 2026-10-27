import React from 'react';

const statusConfig = {
  passed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Passed' },
  validated: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Validated' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Completed' },
  pending: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Pending' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'In Progress' },
  action_required: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Action Required' },
  missing: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Missing' },
  review_required: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Review Required' },
  mismatch_detected: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Mismatch Detected' },
  expired: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Expired' },
  verification_pending: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Verification Pending' },
  source_unavailable: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: 'Source Unavailable' },
  manual_review_required: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Manual Review Required' },
  resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Resolved' },
  draft: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: 'Draft' },
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Submitted' },
  verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Verified' },
  no_issues: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'No Issues' },
};

export default function StatusBadge({ status, size = 'md', label }) {
  const config = statusConfig[status] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: status };
  const displayLabel = label || config.label;

  return (
    <span
      className={`
        inline-flex items-center font-medium border rounded-full whitespace-nowrap
        ${config.bg} ${config.text} ${config.border}
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'}
      `}
    >
      {displayLabel}
    </span>
  );
}
