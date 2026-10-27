export const checkCategories = [
  'Document Completeness',
  'Expiry Validation',
  'Institution Details Consistency',
  'Programme / Intake Consistency',
  'Duplicate Detection',
  'Anomaly Screening',
  'Issuer Verification',
  'Compliance Checklist',
];

function basePassedFindings(applicationId) {
  return [
    {
      id: `${applicationId}-FND-001`,
      category: 'Document Completeness',
      severity: 'info',
      status: 'passed',
      title: 'Document completeness check passed',
      explanation: 'All required document categories have at least one uploaded file.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: null,
      pageNumber: null,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-001',
      evidence: {
        synthetic: true,
        snippet: 'All 7 required document categories satisfied.',
        rule: 'RULE-001: Required document is present',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-002`,
      category: 'Expiry Validation',
      severity: 'info',
      status: 'passed',
      title: 'Certificate expiry check passed',
      explanation: 'All certificates have valid expiry dates relative to the demo reference date.',
      expectedValue: 'Expiry after 2026-10-27',
      observedValue: 'All certificates valid',
      sourceDocument: 'NBA_Accreditation_Certificate.pdf',
      pageNumber: 1,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-002',
      evidence: {
        synthetic: true,
        snippet: 'Mock extracted expiry date: 2028-03-31. Status: Valid.',
        rule: 'RULE-002: Certificate validity date is acceptable',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-003`,
      category: 'Institution Details Consistency',
      severity: 'info',
      status: 'passed',
      title: 'Institution identifier consistency check passed',
      explanation: 'The institution identifier in the application matches the synthetic reference record.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: null,
      pageNumber: null,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-003',
      evidence: {
        synthetic: true,
        snippet: 'Institution ID cross-referenced against synthetic registry. Match confirmed.',
        rule: 'RULE-003: Institution identifier matches the reference record',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-004`,
      category: 'Programme / Intake Consistency',
      severity: 'info',
      status: 'passed',
      title: 'Programme intake consistency check passed',
      explanation: 'Proposed intake matches the approved intake in the synthetic reference record.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: null,
      pageNumber: null,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-004',
      evidence: {
        synthetic: true,
        snippet: 'Approved intake and proposed intake are consistent.',
        rule: 'RULE-004: Programme intake matches the synthetic approval record',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-005`,
      category: 'Duplicate Detection',
      severity: 'info',
      status: 'passed',
      title: 'Duplicate detection check passed',
      explanation: 'No duplicate documents detected in the current upload set.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: null,
      pageNumber: null,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-005',
      evidence: {
        synthetic: true,
        snippet: 'File hash comparison found no exact duplicates.',
        rule: 'RULE-005: Required evidence has been supplied',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-006`,
      category: 'Anomaly Screening',
      severity: 'info',
      status: 'passed',
      title: 'Document anomaly screening passed',
      explanation: 'No metadata inconsistencies or anomalies detected in uploaded documents.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: null,
      pageNumber: null,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-006',
      evidence: {
        synthetic: true,
        snippet: 'Metadata consistency checks passed for all uploaded files.',
        rule: 'RULE-006: Faculty qualification records are complete',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-007`,
      category: 'Issuer Verification',
      severity: 'info',
      status: 'passed',
      title: 'Issuer verification check passed',
      explanation: 'Issuing authorities for key certificates have been verified against the simulated registry.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: 'NBA_Accreditation_Certificate.pdf',
      pageNumber: 1,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-007',
      evidence: {
        synthetic: true,
        snippet: 'Simulated registry lookup confirmed issuing authority.',
        rule: 'RULE-007: Infrastructure evidence meets minimum requirements',
        suggestedStep: 'Proceed to next validation stage.',
      },
    },
    {
      id: `${applicationId}-FND-008`,
      category: 'Compliance Checklist',
      severity: 'info',
      status: 'passed',
      title: 'Compliance checklist evaluation passed',
      explanation: 'All enabled compliance rules have been satisfied based on demo data.',
      expectedValue: null,
      observedValue: null,
      sourceDocument: null,
      pageNumber: null,
      recommendedAction: 'No action required.',
      ruleId: 'RULE-008',
      evidence: {
        synthetic: true,
        snippet: 'All 8 enabled illustrative demo rules evaluated. 8/8 passed.',
        rule: 'RULE-008: NOC/Permission documents are current',
        suggestedStep: 'Application ready for official review.',
      },
    },
  ];
}

export function generateFindings(scenario, applicationId, documents, enabledRules) {
  const findings = basePassedFindings(applicationId);
  const enabledRuleIds = new Set((enabledRules || []).filter(r => r.enabled).map(r => r.id));

  if (scenario === 'clean') {
    return findings.filter(f => !f.ruleId || enabledRuleIds.has(f.ruleId));
  }

  if (scenario === 'missing_document') {
    if (enabledRuleIds.has('RULE-001')) {
      findings[0] = {
        id: `${applicationId}-FND-001`,
        category: 'Document Completeness',
        severity: 'high',
        status: 'missing',
        title: 'Required document missing: Affidavit / Undertaking',
        explanation:
          'The application is missing a required Affidavit / Undertaking document. This category is mandatory for all Extension of Approval applications.',
        expectedValue: 'Affidavit / Undertaking document uploaded',
        observedValue: 'No document found in this category',
        sourceDocument: null,
        pageNumber: null,
        recommendedAction:
          'Upload a signed Affidavit / Undertaking document and re-run validation.',
        ruleId: 'RULE-001',
        evidence: {
          synthetic: true,
          snippet:
            'Document category "Affidavit / Undertaking" has 0 uploaded files. Minimum required: 1.',
          rule: 'RULE-001: Required document is present',
          suggestedStep:
            'Navigate to Documents tab, upload the missing affidavit, then re-validate.',
        },
      };
    }
    return findings.filter(f => !f.ruleId || enabledRuleIds.has(f.ruleId));
  }

  if (scenario === 'expired_certificate') {
    if (enabledRuleIds.has('RULE-002')) {
      findings[1] = {
        id: `${applicationId}-FND-002`,
        category: 'Expiry Validation',
        severity: 'high',
        status: 'expired',
        title: 'Accreditation certificate has expired',
        explanation:
          'The NBA Accreditation Certificate has a mock extracted expiry date of 2025-06-30, which is before the demo reference date of 2026-10-27.',
        expectedValue: 'Expiry date after 2026-10-27',
        observedValue: '2025-06-30 (expired)',
        sourceDocument: 'NBA_Certificate_Expired.pdf',
        pageNumber: 2,
        recommendedAction:
          'Obtain a renewed accreditation certificate and upload the updated document.',
        ruleId: 'RULE-002',
        evidence: {
          synthetic: true,
          snippet:
            'Mock OCR field extraction — Validity: "Valid until 30 June 2025". Current demo reference date: 27 October 2026. Certificate status: EXPIRED.',
          rule: 'RULE-002: Certificate validity date is acceptable',
          suggestedStep:
            'Contact the National Board of Accreditation for renewal, then replace the expired document.',
        },
      };
    }
    return findings.filter(f => !f.ruleId || enabledRuleIds.has(f.ruleId));
  }

  if (scenario === 'intake_mismatch') {
    if (enabledRuleIds.has('RULE-004')) {
      findings[3] = {
        id: `${applicationId}-FND-004`,
        category: 'Programme / Intake Consistency',
        severity: 'high',
        status: 'mismatch_detected',
        title: 'Proposed intake does not match approved intake',
        explanation:
          'The application declares a proposed intake of 120, but the synthetic reference record shows an approved intake of 90 for Diploma in Mechanical Engineering at this institution.',
        expectedValue: '90 (approved intake per synthetic record)',
        observedValue: '120 (proposed intake in application)',
        sourceDocument: 'Previous_Intake_Approval.pdf',
        pageNumber: 1,
        recommendedAction:
          'Verify the proposed intake figure. If a change in intake is intended, ensure the application category is "Change in Approved Intake" with appropriate justification.',
        ruleId: 'RULE-004',
        evidence: {
          synthetic: true,
          snippet:
            'Synthetic reference record — Approved Intake: 90. Application form — Proposed Intake: 120. Delta: +30 (33% increase).',
          rule: 'RULE-004: Programme intake matches the synthetic approval record',
          suggestedStep:
            'Review the intake justification letter and confirm the intended intake figure with the institution.',
        },
      };
    }
    return findings.filter(f => !f.ruleId || enabledRuleIds.has(f.ruleId));
  }

  if (scenario === 'document_anomaly') {
    if (enabledRuleIds.has('RULE-006')) {
      findings[5] = {
        id: `${applicationId}-FND-006`,
        category: 'Anomaly Screening',
        severity: 'medium',
        status: 'manual_review_required',
        title: 'Potential document metadata inconsistency detected',
        explanation:
          'Two uploaded documents share identical file sizes (317,440 bytes) and similar naming patterns, suggesting a possible duplicate upload or copy-paste error in supporting documents.',
        expectedValue: 'Unique documents per category',
        observedValue: 'Two files with identical size: Previous_EoA_BPC.pdf and Duplicate_Upload_BPC.pdf',
        sourceDocument: 'Duplicate_Upload_BPC.pdf',
        pageNumber: null,
        recommendedAction:
          'Manually verify that the flagged documents are distinct and contain the intended content.',
        ruleId: 'RULE-006',
        evidence: {
          synthetic: true,
          snippet:
            'File comparison — Previous_EoA_BPC.pdf: 317,440 bytes. Duplicate_Upload_BPC.pdf: 317,440 bytes. Identical file size detected. Metadata creation timestamps differ by < 5 minutes.',
          rule: 'RULE-006: Faculty qualification records are complete',
          suggestedStep:
            'Open both documents and confirm they contain different content. Replace if duplicate.',
        },
      };
    }
    return findings.filter(f => !f.ruleId || enabledRuleIds.has(f.ruleId));
  }

  return findings.filter(f => !f.ruleId || enabledRuleIds.has(f.ruleId));
}
