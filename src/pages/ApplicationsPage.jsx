import { useState, useMemo } from 'react';
import { Plus, Search, FileText, AlertTriangle, Eye, Play, Filter } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDate } from '../utils/helpers';

export default function ApplicationsPage({ applications = [], onViewApplication, onNewApplication }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(applications.map(a => a.category));
    return Array.from(cats);
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch =
        !searchQuery ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.validationStatus === statusFilter;
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [applications, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-500 mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={onNewApplication}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 text-white rounded-lg font-medium hover:bg-navy-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or institution..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="validated">Validated</option>
              <option value="action_required">Action Required</option>
              <option value="review_required">Review Required</option>
            </select>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No applications found</h3>
          <p className="text-sm text-gray-400 mb-4">
            {applications.length === 0
              ? 'Create your first application to get started.'
              : 'Try adjusting your search or filters.'}
          </p>
          {applications.length === 0 && (
            <button
              onClick={onNewApplication}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-600 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-navy-600">{app.id}</span>
                    <StatusBadge status={app.validationStatus} />
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {app.category}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">{app.institutionName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span>Academic Year: {app.academicYear}</span>
                    <span>Programme: {app.programme}</span>
                    <span>Submitted: {formatDate(app.submissionDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {app.findingsCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      {app.findingsCount} finding{app.findingsCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={() => onViewApplication(app.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {app.validationStatus === 'pending' && (
                    <button
                      onClick={() => onViewApplication(app.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Validate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
