import { useState } from 'react';
import { Shield, FileCheck, Award, ExternalLink, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, Info, X } from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDateTime } from '../utils/helpers';

const typeIcons = {
  accreditation: Award,
  noc: FileCheck,
  institutional: Shield,
};

export default function IssuerVerificationPage({ issuerRecords = [], onVerify }) {
  const [verifyingId, setVerifyingId] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);

  const handleVerify = (id) => {
    setVerifyingId(id);
    setTimeout(() => {
      if (onVerify) onVerify(id);
      setVerifyingId(null);
    }, 1500);
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
      case 'mismatch': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'expired': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'unavailable': return <Info className="w-5 h-5 text-gray-400" />;
      case 'manual_review': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-600">Issuer Verification</h1>
        <p className="text-gray-500 mt-1">Simulated external document verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {issuerRecords.map((record) => {
          const IconComp = typeIcons[record.type] || Shield;
          const isVerifying = verifyingId === record.id;

          return (
            <div key={record.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{record.documentReference}</h3>
                      <p className="text-xs text-gray-500">{record.issuingAuthority}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                    SIMULATED
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Method</span>
                    <span className="text-gray-900 font-medium text-right">{record.verificationMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status</span>
                    <div className="flex items-center gap-1.5">
                      {isVerifying ? (
                        <span className="flex items-center gap-1.5 text-blue-600 text-sm font-medium">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        <>
                          {statusIcon(record.status)}
                          <StatusBadge status={record.status} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Checked</span>
                    <span className="text-gray-700">{record.timestamp ? formatDateTime(record.timestamp) : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex gap-2">
                <button
                  className="flex-1 px-3 py-2 text-sm font-medium text-navy-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setDetailRecord(record)}
                >
                  Details
                </button>
                <button
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-navy-600 rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  onClick={() => handleVerify(record.id)}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Verify Now
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {issuerRecords.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No issuer records available. Run a validation to generate verification tasks.</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          All verification results are simulated. No connection to actual issuer systems is made.
        </p>
      </div>

      {detailRecord && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDetailRecord(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Verification Details</h3>
              <button onClick={() => setDetailRecord(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Document Reference</label>
                <p className="text-gray-900 font-medium mt-0.5">{detailRecord.documentReference}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Issuing Authority</label>
                <p className="text-gray-900 mt-0.5">{detailRecord.issuingAuthority}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Method</label>
                <p className="text-gray-900 mt-0.5">{detailRecord.verificationMethod}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                <div className="mt-1 flex items-center gap-2">
                  {statusIcon(detailRecord.status)}
                  <StatusBadge status={detailRecord.status} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</label>
                <p className="text-gray-900 mt-0.5">{detailRecord.timestamp ? formatDateTime(detailRecord.timestamp) : 'Not checked yet'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source Type</label>
                <p className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                    SIMULATED DATA SOURCE
                  </span>
                </p>
              </div>
              {detailRecord.details && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Details</label>
                  <p className="text-gray-700 text-sm mt-0.5">{detailRecord.details}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setDetailRecord(null)}
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
