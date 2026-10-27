import { useState } from 'react';
import {
  ArrowLeft, Play, FileText, CheckCircle, AlertTriangle, XCircle,
  Clock, Eye, X, ShieldCheck, Info, AlertOctagon, Download,
  File, Upload, Search
} from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDate } from '../utils/helpers';

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  high: { icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  info: { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
};

function EvidencePanel({ finding, onClose }) {
  if (!finding) return null;
  const sev = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.info;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-xl overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold text-gray-900">Inspect Evidence</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Synthetic data banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Synthetic Evidence — Demo Data. This evidence is generated from predefined mock records, not from uploaded documents.
            </p>
          </div>

          {/* Finding header */}
          <div className={`rounded-lg border ${sev.border} ${sev.bg} p-4`}>
            <div className="flex items-start gap-3">
              <sev.icon className={`w-5 h-5 mt-0.5 ${sev.color}`} />
              <div>
                <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{finding.explanation}</p>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            <DetailRow label="Finding ID" value={finding.id} />
            <DetailRow label="Category" value={finding.category} />
            <DetailRow label="Severity" value={<span className={`font-medium capitalize ${sev.color}`}>{finding.severity}</span>} />
            <DetailRow label="Status" value={<StatusBadge status={finding.status} />} />
            {finding.sourceDocument && <DetailRow label="Source Document" value={finding.sourceDocument} />}
            {finding.pageNumber && <DetailRow label="Page Number" value={finding.pageNumber} />}
          </div>

          {/* Expected vs Observed */}
          {(finding.expectedValue || finding.observedValue) && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Comparison</span>
              </div>
              <div className="divide-y divide-gray-100">
                {finding.expectedValue && (
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Expected / Reference</span>
                    <span className="text-sm font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{finding.expectedValue}</span>
                  </div>
                )}
                {finding.observedValue && (
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Observed / Mock</span>
                    <span className="text-sm font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded">{finding.observedValue}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mock evidence snippet */}
          {finding.evidenceSnippet && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Evidence Snippet</h5>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600 font-mono whitespace-pre-wrap">
                {finding.evidenceSnippet}
              </div>
            </div>
          )}

          {/* Rule applied */}
          {finding.ruleApplied && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Rule Applied</h5>
              <div className="bg-navy-50 rounded-lg border border-navy-200 p-4 text-sm text-navy-700">
                {finding.ruleApplied}
              </div>
            </div>
          )}

          {/* Suggested next step */}
          {finding.suggestedAction && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Suggested Next Step</h5>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-sm text-blue-700">
                {finding.suggestedAction}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

function InfoSection({ application }) {
  if (!application) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Institution Details</h3>
        <div className="space-y-2">
          <DetailRow label="Institution Name" value={application.institutionName} />
          <DetailRow label="Institution ID" value={application.institutionId} />
          <DetailRow label="State" value={application.state} />
          <DetailRow label="Category" value={application.category} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Application Details</h3>
        <div className="space-y-2">
          <DetailRow label="Application ID" value={application.id} />
          <DetailRow label="Academic Year" value={application.academicYear} />
          <DetailRow label="Programme" value={application.programme} />
          <DetailRow label="Approved Intake" value={application.approvedIntake} />
          <DetailRow label="Proposed Intake" value={application.proposedIntake} />
          <DetailRow label="Submitted" value={formatDate(application.submissionDate)} />
        </div>
      </div>
    </div>
  );
}

function DocumentsSection({ documents = [] }) {
  const statusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-4 h-4 text-teal-500" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {documents.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No documents associated with this application.</p>
      ) : (
        documents.map((doc, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              {statusIcon(doc.status)}
              <div>
                <p className="text-sm font-medium text-gray-800">{doc.name || doc.category}</p>
                <p className="text-xs text-gray-400">{doc.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                doc.status === 'uploaded'
                  ? 'bg-teal-50 text-teal-700'
                  : doc.status === 'missing'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {doc.status === 'uploaded' ? 'Uploaded' : doc.status === 'missing' ? 'Missing' : 'Required'}
              </span>
              {doc.fileName && (
                <span className="text-xs text-gray-400 max-w-[150px] truncate">{doc.fileName}</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ValidationSummary({ findings = [], onInspect }) {
  const passed = findings.filter(f => f.status === 'passed').length;
  const flagged = findings.filter(f => f.status !== 'passed').length;
  const pending = findings.filter(f => f.status === 'verification_pending' || f.status === 'source_unavailable').length;

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniCard label="Checks Passed" value={passed} icon={CheckCircle} color="text-teal-600" bg="bg-teal-50" />
        <MiniCard label="Findings" value={flagged} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" />
        <MiniCard label="Pending" value={pending} icon={Clock} color="text-blue-600" bg="bg-blue-50" />
        <MiniCard label="Docs Reviewed" value={findings.length} icon={FileText} color="text-gray-600" bg="bg-gray-50" />
      </div>

      {/* Findings List */}
      <div className="space-y-2">
        {findings.map(finding => {
          const sev = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.info;
          const SevIcon = sev.icon;
          return (
            <div key={finding.id} className={`rounded-lg border ${sev.border} p-4 flex items-start justify-between gap-3`}>
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <SevIcon className={`w-5 h-5 mt-0.5 shrink-0 ${sev.color}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-gray-900">{finding.title}</span>
                    <StatusBadge status={finding.status} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{finding.explanation}</p>
                  {finding.sourceDocument && (
                    <p className="text-xs text-gray-400 mt-1">Source: {finding.sourceDocument}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onInspect(finding)}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-navy-600 bg-navy-50 rounded-md hover:bg-navy-100 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Inspect
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

const TABS = [
  { key: 'info', label: 'Application Info', icon: Info },
  { key: 'documents', label: 'Documents', icon: File },
  { key: 'validation', label: 'Validation Summary', icon: ShieldCheck },
];

function downloadDemoReport(application, findings) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SmartVerify Demo Report - ${application.id}</title>
<style>body{font-family:Inter,system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1f2937}
h1{color:#1a237e;font-size:22px}h2{color:#374151;font-size:16px;margin-top:24px;border-bottom:1px solid #e5e7eb;padding-bottom:8px}
.badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600}
.passed{background:#d1fae5;color:#065f46}.failed{background:#fef3c7;color:#92400e}.missing{background:#fee2e2;color:#991b1b}
table{width:100%;border-collapse:collapse;font-size:13px;margin-top:12px}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #e5e7eb}
th{background:#f9fafb;font-weight:600}.disclaimer{margin-top:32px;padding:12px;background:#f3f4f6;border-radius:8px;font-size:11px;color:#6b7280}
</style></head><body>
<h1>AICTE SmartVerify — Validation Report</h1>
<p style="color:#6b7280;font-size:13px">DEMO PROTOTYPE · SYNTHETIC DATA · Generated ${new Date().toLocaleString()}</p>
<h2>Application Details</h2>
<table><tr><td><strong>Application ID</strong></td><td>${application.id}</td></tr>
<tr><td><strong>Institution</strong></td><td>${application.institutionName}</td></tr>
<tr><td><strong>Category</strong></td><td>${application.category}</td></tr>
<tr><td><strong>Programme</strong></td><td>${application.programme}</td></tr>
<tr><td><strong>Academic Year</strong></td><td>${application.academicYear}</td></tr></table>
<h2>Validation Findings</h2>
<table><thead><tr><th>Finding</th><th>Status</th><th>Severity</th><th>Details</th></tr></thead><tbody>
${(findings || []).map(f => `<tr><td>${f.title}</td><td><span class="badge ${f.status === 'passed' ? 'passed' : f.severity === 'high' ? 'missing' : 'failed'}">${f.status.replace(/_/g, ' ')}</span></td><td>${f.severity}</td><td>${f.explanation}</td></tr>`).join('')}
</tbody></table>
<div class="disclaimer"><strong>Disclaimer:</strong> This is a demonstration report generated by the AICTE SmartVerify prototype. All validation results are based on predefined demo scenarios and mock records. No real AI processing, document analysis, or official verification was performed. This report does not represent an official AICTE assessment.</div>
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SmartVerify_Demo_Report_${application.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ApplicationDetailPage({ application, findings = [], onValidate, onBack, onNavigate, scenario }) {
  const [activeTab, setActiveTab] = useState('info');
  const [evidenceFinding, setEvidenceFinding] = useState(null);

  if (!application) {
    return (
      <div className="text-center py-20">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600">Application not found</h3>
        <button onClick={onBack} className="mt-4 text-navy-600 hover:text-navy-700 font-medium text-sm">
          ← Back to Applications
        </button>
      </div>
    );
  }

  const isValidated = application.validationStatus !== 'pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="mt-1 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{application.id}</h1>
              <StatusBadge status={application.validationStatus} />
            </div>
            <p className="text-sm text-gray-500">{application.institutionName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {application.validationStatus === 'pending' && (
            <button
              onClick={() => onValidate(application.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4" />
              Validate Application
            </button>
          )}
          {isValidated && (
            <button
              onClick={() => onValidate(application.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
            >
              <Play className="w-4 h-4" />
              Re-run Validation
            </button>
          )}
          {isValidated && findings.length > 0 && (
            <button
              onClick={() => downloadDemoReport(application, findings)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Demo Report
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1">
          {TABS.map(tab => {
            if (tab.key === 'validation' && !isValidated) return null;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-navy-600 text-navy-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {activeTab === 'info' && <InfoSection application={application} />}
        {activeTab === 'documents' && <DocumentsSection documents={application.documents} />}
        {activeTab === 'validation' && isValidated && (
          <ValidationSummary findings={findings} onInspect={setEvidenceFinding} />
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        Validation findings are generated from the selected demo scenario ({scenario || 'default'}). They do not represent analysis of uploaded documents.
      </p>

      {/* Evidence slide-over */}
      {evidenceFinding && (
        <EvidencePanel finding={evidenceFinding} onClose={() => setEvidenceFinding(null)} />
      )}
    </div>
  );
}
