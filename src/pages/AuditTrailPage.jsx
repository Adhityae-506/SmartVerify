import { useState } from 'react';
import { Search, Info, FileText, Clock, Filter } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

const eventTypeConfig = {
  application_created: { label: 'Application Created', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  document_added: { label: 'Document Added', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  validation_started: { label: 'Validation Started', color: 'bg-blue-400', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  validation_completed: { label: 'Validation Completed', color: 'bg-teal-500', textColor: 'text-teal-700', bgColor: 'bg-teal-50' },
  finding_identified: { label: 'Finding Identified', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  issuer_verification: { label: 'Issuer Verification', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
  reviewer_comment: { label: 'Reviewer Comment', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  finding_resolved: { label: 'Finding Resolved', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  clarification_requested: { label: 'Clarification Requested', color: 'bg-amber-400', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
  escalated: { label: 'Escalated', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
};

export default function AuditTrailPage({ events = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const eventTypes = ['all', ...Object.keys(eventTypeConfig)];

  const filteredEvents = events.filter((e) => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (e.description || '').toLowerCase().includes(term) ||
        (e.applicationId || '').toLowerCase().includes(term) ||
        (e.actor || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-600">Audit Trail</h1>
        <p className="text-gray-500 mt-1">Local demo event history</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white appearance-none"
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All Event Types' : (eventTypeConfig[t]?.label || t)}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-500">{sortedEvents.length} event(s)</span>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No audit events recorded yet.</p>
          <p className="text-gray-400 text-sm mt-1">Events will appear here as you interact with the demo.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-4">
            {sortedEvents.map((event, idx) => {
              const config = eventTypeConfig[event.type] || { label: event.type, color: 'bg-gray-400', textColor: 'text-gray-700', bgColor: 'bg-gray-50' };

              return (
                <div key={event.id || idx} className="relative flex items-start gap-4 pl-0">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                    <FileText className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${config.textColor} ${config.bgColor}`}>
                          {config.label}
                        </span>
                        {event.applicationId && (
                          <span className="text-xs font-mono text-navy-600 font-medium">
                            {event.applicationId}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mt-2">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      <span className="font-medium">{event.actor || 'System'}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          This audit trail contains local demo data only. It is not a tamper-proof production audit system.
        </p>
      </div>
    </div>
  );
}
