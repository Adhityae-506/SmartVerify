import { Info, RefreshCw, BookOpen, ShieldCheck } from 'lucide-react';

export default function ComplianceChecksPage({ rules = [], onToggleRule, onRerunValidation }) {
  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Compliance Checks</h1>
          <p className="text-gray-500 mt-1">Illustrative validation rules for demonstration</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-navy-600 rounded-lg hover:bg-navy-700 transition-colors"
          onClick={onRerunValidation}
        >
          <RefreshCw className="w-4 h-4" />
          Rerun Validation
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {enabledCount} of {rules.length} rules enabled
          </p>
          <p className="text-xs text-gray-500">Toggle rules below and rerun validation to see the effect</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          These rules are illustrative examples for demonstration purposes. They do not represent official AICTE regulatory requirements.
        </p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-lg border shadow-sm transition-colors ${
              rule.enabled ? 'border-gray-200' : 'border-gray-100 opacity-70'
            }`}
          >
            <div className="p-4 sm:p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5 text-navy-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono font-semibold text-navy-600 bg-navy-50 px-2 py-0.5 rounded">
                    {rule.id}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    v{rule.version || '1.0'}
                  </span>
                  {rule.category && (
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {rule.category}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">{rule.description}</p>
                <p className="text-xs text-gray-400 mt-1">Illustrative demo rule</p>
              </div>

              <button
                className="shrink-0 mt-1"
                onClick={() => onToggleRule && onToggleRule(rule.id)}
                aria-label={`Toggle rule ${rule.id}`}
              >
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    rule.enabled ? 'bg-navy-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No compliance rules configured.</p>
        </div>
      )}
    </div>
  );
}
