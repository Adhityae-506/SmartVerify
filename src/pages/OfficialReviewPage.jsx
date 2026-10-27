import { useState, useMemo, Fragment } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, MessageSquare, CheckCircle2, Send, Flag, Search, X, Info, ShieldAlert, Eye } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDateTime } from '../utils/helpers';
import { generateFindings } from '../data/demoFindings';

function getPriority(findingsForApp) {
  if (!findingsForApp || findingsForApp.length === 0) return 'low';
  const hasCritical = findingsForApp.some((f) => f.severity === 'critical' || f.severity === 'high');
  const hasMedium = findingsForApp.some((f) => f.severity === 'medium');
  if (hasCritical) return 'high';
  if (hasMedium) return 'medium';
  return 'low';
}

const priorityStyles = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

const severityIcons = {
  critical: <AlertTriangle className="w-4 h-4 text-red-500" />,
  high: <AlertTriangle className="w-4 h-4 text-red-500" />,
  medium: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  low: <Info className="w-4 h-4 text-blue-500" />,
  info: <Info className="w-4 h-4 text-gray-400" />,
};

export default function OfficialReviewPage({
  applications = [],
  findings: _findings,
  reviewComments = {},
  resolvedFindings = {},
  onAddComment,
  onResolveFinding,
  onRequestClarification,
  onEscalate,
  rules = [],
  scenario = 'clean',
}) {
  const [expandedApp, setExpandedApp] = useState(null);
  const [commentModal, setCommentModal] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [resolveModal, setResolveModal] = useState(null);
  const [resolveReason, setResolveReason] = useState('');
  const [evidenceModal, setEvidenceModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const validatedApps = applications.filter((a) => a.validationStatus && a.validationStatus !== 'pending' && a.validationStatus !== 'not_started');

  const allFindings = useMemo(() => {
    const enabledRules = rules.filter(r => r.enabled);
    const result = [];
    validatedApps.forEach(app => {
      const appScenario = app.scenario || scenario;
      const findings = generateFindings(appScenario, app.id, app.documents, enabledRules);
      findings.forEach(f => result.push({ ...f, applicationId: app.id }));
    });
    return result;
  }, [validatedApps, rules, scenario]);

  const findings = allFindings;

  const filteredApps = validatedApps.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.id.toLowerCase().includes(term) ||
      a.institutionName.toLowerCase().includes(term)
    );
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    const findingsA = findings.filter((f) => f.applicationId === a.id);
    const findingsB = findings.filter((f) => f.applicationId === b.id);
    const pOrder = { high: 0, medium: 1, low: 2 };
    return (pOrder[getPriority(findingsA)] || 2) - (pOrder[getPriority(findingsB)] || 2);
  });

  const handleAddComment = () => {
    if (!commentText.trim() || !commentModal) return;
    onAddComment && onAddComment(commentModal.applicationId, commentModal.findingId, commentText.trim());
    setCommentText('');
    setCommentModal(null);
  };

  const handleResolve = () => {
    if (!resolveReason.trim() || !resolveModal) return;
    onResolveFinding && onResolveFinding(resolveModal.applicationId, resolveModal.findingId, resolveReason.trim());
    setResolveReason('');
    setResolveModal(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-600">Official Review Dashboard</h1>
        <p className="text-gray-500 mt-1">Review and act on validation findings</p>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800 font-medium">
          AI-generated findings are advisory. Review actions in this prototype do not represent official AICTE decisions.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          />
        </div>
        <span className="text-sm text-gray-500">{sortedApps.length} application(s) in queue</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-600 text-white">
                <th className="text-left px-4 py-3 font-medium">Application ID</th>
                <th className="text-left px-4 py-3 font-medium">Institution</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Findings</th>
                <th className="text-center px-4 py-3 font-medium">Pending</th>
                <th className="text-center px-4 py-3 font-medium">Priority</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="text-center px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedApps.map((app) => {
                const appFindings = findings.filter((f) => f.applicationId === app.id);
                const priority = getPriority(appFindings);
                const pendingCount = appFindings.filter(
                  (f) => f.status !== 'passed' && !resolvedFindings[`${app.id}_${f.id}`]
                ).length;
                const isExpanded = expandedApp === app.id;

                return (
                  <Fragment key={app.id}>
                    <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-navy-50' : ''}`}>
                      <td className="px-4 py-3 font-mono text-navy-600 font-medium">{app.id}</td>
                      <td className="px-4 py-3 text-gray-900">{app.institutionName}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.validationStatus} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-medium text-xs">
                          {appFindings.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                          pendingCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {pendingCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[priority]}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {app.lastUpdated ? formatDateTime(app.lastUpdated) : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
                          onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                        >
                          Review
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="bg-gray-50 px-4 py-4">
                          <div className="space-y-4">
                            {appFindings.length === 0 && (
                              <p className="text-gray-500 text-sm text-center py-4">No findings for this application.</p>
                            )}
                            {appFindings.map((finding) => {
                              const isResolved = resolvedFindings[`${app.id}_${finding.id}`];
                              const commentsKey = `${app.id}_${finding.id}`;
                              const findingComments = reviewComments[commentsKey] || [];

                              return (
                                <div
                                  key={finding.id}
                                  className={`bg-white rounded-lg border p-4 ${
                                    isResolved ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-start gap-3">
                                      {severityIcons[finding.severity] || severityIcons.info}
                                      <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-medium text-gray-900 text-sm">{finding.title || finding.category}</span>
                                          <StatusBadge status={isResolved ? 'resolved' : finding.status} />
                                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase ${
                                            finding.severity === 'critical' || finding.severity === 'high'
                                              ? 'bg-red-100 text-red-600'
                                              : finding.severity === 'medium'
                                              ? 'bg-amber-100 text-amber-600'
                                              : 'bg-blue-100 text-blue-600'
                                          }`}>
                                            {finding.severity}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{finding.explanation}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {isResolved && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                      <p className="text-xs font-medium text-green-700">Resolved</p>
                                      <p className="text-xs text-green-600 mt-0.5">{resolvedFindings[`${app.id}_${finding.id}`]}</p>
                                    </div>
                                  )}

                                  {findingComments.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                      {findingComments.map((c, ci) => (
                                        <div key={ci} className="flex items-start gap-2 pl-7">
                                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                                          <div>
                                            <p className="text-xs text-gray-900">{c.text}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                              {c.actor} &middot; {formatDateTime(c.timestamp)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
                                    <button
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                      onClick={() => setEvidenceModal(finding)}
                                    >
                                      <Eye className="w-3 h-3" />
                                      Inspect Evidence
                                    </button>
                                    <button
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                      onClick={() => setCommentModal({ applicationId: app.id, findingId: finding.id })}
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                      Add Comment
                                    </button>
                                    {!isResolved && (
                                      <>
                                        <button
                                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                          onClick={() => setResolveModal({ applicationId: app.id, findingId: finding.id })}
                                        >
                                          <CheckCircle2 className="w-3 h-3" />
                                          Resolve
                                        </button>
                                        <button
                                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                                          onClick={() => onRequestClarification && onRequestClarification(app.id, finding.id)}
                                        >
                                          <Send className="w-3 h-3" />
                                          Request Clarification
                                        </button>
                                        <button
                                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                          onClick={() => onEscalate && onEscalate(app.id, finding.id)}
                                        >
                                          <Flag className="w-3 h-3" />
                                          Escalate
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {sortedApps.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No applications in the review queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {commentModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setCommentModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Review Comment</h3>
              <button onClick={() => setCommentModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Enter your review comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setCommentModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-navy-600 rounded-lg hover:bg-navy-700 disabled:opacity-50"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {resolveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setResolveModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Resolve Finding</h3>
              <button onClick={() => setResolveModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-3">Provide a reason for resolving this finding. A reason is required.</p>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Reason for resolution..."
                value={resolveReason}
                onChange={(e) => setResolveReason(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setResolveModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                onClick={handleResolve}
                disabled={!resolveReason.trim()}
              >
                Resolve Finding
              </button>
            </div>
          </div>
        </div>
      )}

      {evidenceModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEvidenceModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Evidence Details</h3>
              <button onClick={() => setEvidenceModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Finding</label>
                <p className="text-gray-900 font-medium mt-0.5">{evidenceModal.title || evidenceModal.category}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Explanation</label>
                <p className="text-gray-700 text-sm mt-0.5">{evidenceModal.explanation}</p>
              </div>
              {evidenceModal.expectedValue && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Value</label>
                  <p className="text-gray-900 text-sm mt-0.5 font-mono bg-green-50 px-3 py-1.5 rounded">{evidenceModal.expectedValue}</p>
                </div>
              )}
              {evidenceModal.observedValue && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Observed Value</label>
                  <p className="text-gray-900 text-sm mt-0.5 font-mono bg-red-50 px-3 py-1.5 rounded">{evidenceModal.observedValue}</p>
                </div>
              )}
              {evidenceModal.sourceDocument && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source Document</label>
                  <p className="text-gray-900 text-sm mt-0.5">{evidenceModal.sourceDocument}{evidenceModal.pageNumber ? ` (Page ${evidenceModal.pageNumber})` : ''}</p>
                </div>
              )}
              {evidenceModal.rule && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Applied</label>
                  <p className="text-gray-700 text-sm mt-0.5">{evidenceModal.rule}</p>
                </div>
              )}
              {evidenceModal.recommendedAction && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Action</label>
                  <p className="text-gray-700 text-sm mt-0.5">{evidenceModal.recommendedAction}</p>
                </div>
              )}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-700">
                  This evidence is synthetic and generated from the selected demo scenario. It does not reflect analysis of any uploaded file.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setEvidenceModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
