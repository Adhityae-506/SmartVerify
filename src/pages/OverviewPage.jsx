import { useState, useMemo } from 'react';
import { FileText, CheckCircle, AlertTriangle, ShieldCheck, Plus, Eye, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDate } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  validated: '#0d9488',
  pending: '#3b82f6',
  action_required: '#ef4444',
  review_required: '#f59e0b',
  in_progress: '#8b5cf6',
};

function SummaryCard({ icon: Icon, label, value, colorClass, bgClass }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function OverviewPage({ applications = [], onNavigate, onNewApplication, onViewApplication }) {
  const stats = useMemo(() => {
    const total = applications.length;
    const validated = applications.filter(a => a.validationStatus === 'validated' || a.validationStatus === 'action_required' || a.validationStatus === 'review_required').length;
    const findings = applications.reduce((sum, a) => sum + (a.findingsCount || 0), 0);
    const issuerPending = applications.filter(a => a.validationStatus === 'review_required' || a.validationStatus === 'action_required').length || 1;
    return { total, validated, findings, issuerPending };
  }, [applications]);

  const chartData = useMemo(() => {
    const counts = {};
    applications.forEach(a => {
      counts[a.validationStatus] = (counts[a.validationStatus] || 0) + 1;
    });
    const labels = {
      validated: 'Validated',
      pending: 'Pending',
      action_required: 'Action Required',
      review_required: 'Review Required',
      in_progress: 'In Progress',
    };
    return Object.entries(counts).map(([key, val]) => ({
      name: labels[key] || key,
      value: val,
      color: COLORS[key] || '#94a3b8',
    }));
  }, [applications]);

  const recentApps = applications.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Application validation dashboard</p>
        </div>
        <button
          onClick={onNewApplication}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 text-white rounded-lg font-medium hover:bg-navy-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={FileText}
          label="Total Applications"
          value={stats.total}
          colorClass="text-navy-600"
          bgClass="bg-navy-50"
        />
        <SummaryCard
          icon={CheckCircle}
          label="Validation Completed"
          value={stats.validated}
          colorClass="text-teal-600"
          bgClass="bg-teal-50"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Findings Requiring Attention"
          value={stats.findings}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
        <SummaryCard
          icon={ShieldCheck}
          label="Issuer Verifications Pending"
          value={stats.issuerPending}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />
      </div>

      {/* Main Content: Table + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications Table */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <button
              onClick={() => onNavigate('applications')}
              className="text-sm text-navy-600 font-medium hover:text-navy-700 inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {recentApps.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No applications yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600">Application ID</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Institution</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Submitted</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Findings</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApps.map((app, idx) => (
                    <tr
                      key={app.id}
                      className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="px-4 py-3 font-medium text-navy-600">{app.id}</td>
                      <td className="px-4 py-3 text-gray-700">{app.institutionName}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-navy-50 text-navy-600">
                          {app.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(app.submissionDate)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.validationStatus} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {app.findingsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {app.findingsCount}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onViewApplication(app.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-navy-600 bg-navy-50 rounded-md hover:bg-navy-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconSize={10}
                  iconType="circle"
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-gray-400 text-sm">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center pt-2">
        Dashboard data reflects demo scenario selections. All institutions and records are fictional.
      </p>
    </div>
  );
}
