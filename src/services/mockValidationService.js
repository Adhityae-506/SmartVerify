import { generateFindings } from '../data/demoFindings.js';

export const VALIDATION_STAGES = [
  'Document Ingestion',
  'Document Classification',
  'OCR & Field Extraction',
  'Completeness Validation',
  'Cross-Document Consistency',
  'Document Anomaly Screening',
  'Issuer Verification',
  'Compliance Checklist Evaluation',
  'Report Generation',
];

const STAGE_MESSAGES = [
  'Reading uploaded documents into processing pipeline…',
  'Classifying documents by category and type…',
  'Extracting text fields and structured data…',
  'Checking all required documents are present…',
  'Comparing fields across related documents…',
  'Screening for metadata anomalies and duplicates…',
  'Verifying issuer records against simulated registry…',
  'Evaluating application against enabled compliance rules…',
  'Compiling findings into validation report…',
];

const STAGE_DELAYS = [500, 600, 700, 500, 650, 550, 800, 600, 400];

export function runValidation(application, scenario, enabledRules, onProgress) {
  return new Promise((resolve) => {
    let currentStage = 0;

    function processStage() {
      if (currentStage >= VALIDATION_STAGES.length) {
        const findings = generateFindings(
          scenario,
          application.id,
          application.documents,
          enabledRules
        );

        const passed = findings.filter(f => f.status === 'passed').length;
        const flagged = findings.filter(f => f.status !== 'passed').length;
        const pending = findings.filter(
          f => f.status === 'verification_pending'
        ).length;

        resolve({
          findings,
          summary: {
            passed,
            findings: flagged,
            pending,
            documentsReviewed: (application.documents || []).filter(
              d => d.status === 'uploaded'
            ).length,
          },
          completedAt: new Date().toISOString(),
        });
        return;
      }

      onProgress({
        stageIndex: currentStage,
        stageName: VALIDATION_STAGES[currentStage],
        status: 'processing',
        progress: Math.round(((currentStage) / VALIDATION_STAGES.length) * 100),
        message: STAGE_MESSAGES[currentStage],
      });

      setTimeout(() => {
        onProgress({
          stageIndex: currentStage,
          stageName: VALIDATION_STAGES[currentStage],
          status: 'completed',
          progress: Math.round(((currentStage + 1) / VALIDATION_STAGES.length) * 100),
          message: `${VALIDATION_STAGES[currentStage]} complete.`,
        });

        currentStage++;
        setTimeout(processStage, 150);
      }, STAGE_DELAYS[currentStage]);
    }

    processStage();
  });
}
