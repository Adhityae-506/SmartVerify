import { issuerRecords } from '../data/demoInstitutions.js';

const STATUS_MESSAGES = {
  verified: 'Issuer identity confirmed via simulated registry lookup. Document reference matches records.',
  mismatch_detected: 'Issuer details do not match the simulated registry. Manual verification recommended.',
  expired: 'Issuer record found but the associated credential has expired in the simulated registry.',
  verification_pending: 'Verification request submitted to simulated registry. Awaiting response.',
  source_unavailable: 'The simulated registry source is currently unavailable. Retry later.',
  manual_review_required: 'Automated verification inconclusive. Manual review by an official is required.',
};

export function verifyIssuer(recordId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = issuerRecords.find(r => r.id === recordId);

      if (!record) {
        resolve({
          recordId,
          status: 'source_unavailable',
          timestamp: new Date().toISOString(),
          details: 'No matching issuer record found in demo data.',
          sourceType: 'SIMULATED',
        });
        return;
      }

      resolve({
        recordId,
        status: record.verificationStatus,
        timestamp: new Date().toISOString(),
        details: STATUS_MESSAGES[record.verificationStatus] || 'Verification completed.',
        sourceType: 'SIMULATED',
      });
    }, 1500);
  });
}
