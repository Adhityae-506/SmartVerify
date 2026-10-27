import { CheckCircle, Loader, Circle, XCircle, ShieldCheck, Clock } from 'lucide-react';

const STAGE_DESCRIPTIONS = [
  'Ingesting uploaded documents and preparing buffers…',
  'Classifying document types using structural analysis…',
  'Extracting text fields and form data via simulated OCR…',
  'Checking document completeness against requirements…',
  'Running cross-document consistency checks…',
  'Screening for document anomalies and metadata issues…',
  'Verifying issuers against simulated external records…',
  'Evaluating compliance checklist items…',
  'Compiling validation report and scoring results…',
];

function StageIcon({ status }) {
  if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === 'processing') return <Loader className="w-5 h-5 text-navy-600 animate-spin" />;
  if (status === 'error') return <XCircle className="w-5 h-5 text-red-500" />;
  return <Circle className="w-5 h-5 text-gray-300" />;
}

export default function ValidationProgress({
  isRunning,
  stages,
  currentStageIndex,
  progress,
  onCancel,
  completed,
  onViewReport,
  completedAt,
}) {
  const totalStages = stages?.length || 9;
  const overallProgress = completed ? 100 : Math.round(((currentStageIndex + (progress / 100)) / totalStages) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {completed ? (
                <ShieldCheck className="w-6 h-6 text-green-500" />
              ) : (
                <Loader className="w-6 h-6 text-navy-600 animate-spin" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {completed ? 'Validation Complete' : 'Simulated Validation in Progress'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  This is a simulated validation workflow. No real AI processing is performed.
                </p>
              </div>
            </div>
            {isRunning && !completed && (
              <button
                onClick={onCancel}
                className="text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 border border-gray-300 rounded-md hover:border-red-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  completed ? 'bg-green-500' : 'bg-navy-600'
                }`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-1">
            {(stages || []).map((stage, idx) => {
              let status = 'pending';
              if (completed || idx < currentStageIndex) status = 'completed';
              else if (idx === currentStageIndex && isRunning) status = 'processing';

              const isActive = status === 'processing';

              return (
                <div
                  key={stage.key || idx}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-navy-50' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0 relative">
                    <StageIcon status={status} />
                    {idx < totalStages - 1 && (
                      <div
                        className={`absolute left-2.5 top-6 w-px h-4 ${
                          status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      status === 'completed' ? 'text-gray-700' :
                      isActive ? 'text-navy-700' : 'text-gray-400'
                    }`}>
                      {stage.name}
                    </p>
                    {(isActive || status === 'completed') && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {STAGE_DESCRIPTIONS[idx] || 'Processing…'}
                      </p>
                    )}
                    {isActive && (
                      <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-navy-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {status === 'completed' && (
                    <span className="text-xs text-green-600 font-medium shrink-0 mt-0.5">Done</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {completed && (
          <div className="p-5 border-t border-gray-100 bg-green-50/50">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                All Checks Completed
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Simulated validation finished successfully.
              </p>
              {completedAt && (
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mb-4">
                  <Clock className="w-3 h-3" />
                  {new Date(completedAt).toLocaleString()}
                </p>
              )}
              <button
                onClick={onViewReport}
                className="bg-navy-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-700 transition-colors shadow-sm"
              >
                View Validation Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
