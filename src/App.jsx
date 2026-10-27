import { useState, useEffect, useCallback } from 'react'
import AppShell from './components/layout/AppShell'
import DemoControls from './components/shared/DemoControls'
import OverviewPage from './pages/OverviewPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import DocumentValidationPage from './pages/DocumentValidationPage'
import NewApplicationWizard from './pages/NewApplicationWizard'
import IssuerVerificationPage from './pages/IssuerVerificationPage'
import ComplianceChecksPage from './pages/ComplianceChecksPage'
import OfficialReviewPage from './pages/OfficialReviewPage'
import AuditTrailPage from './pages/AuditTrailPage'
import ValidationProgress from './components/validation/ValidationProgress'
import { defaultApplications, documentCategories } from './data/demoApplications'
import { defaultRules } from './data/demoRules'
import { generateFindings } from './data/demoFindings'
import { issuerRecords as defaultIssuerRecords } from './data/demoInstitutions'
import { loadState, saveState, resetAllDemoData, STORAGE_KEYS } from './services/localStorageService'
import { runValidation, VALIDATION_STAGES } from './services/mockValidationService'
import { generateId } from './utils/helpers'

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview')
  const [role, setRole] = useState(() => loadState(STORAGE_KEYS.CURRENT_ROLE, 'institution'))
  const [scenario, setScenario] = useState(() => loadState(STORAGE_KEYS.SCENARIO, 'clean'))
  const [applications, setApplications] = useState(() => loadState(STORAGE_KEYS.APPLICATIONS, defaultApplications))
  const [rules, setRules] = useState(() => loadState(STORAGE_KEYS.ENABLED_RULES, defaultRules))
  const [auditEvents, setAuditEvents] = useState(() => loadState(STORAGE_KEYS.AUDIT_EVENTS, []))
  const [reviewComments, setReviewComments] = useState(() => loadState(STORAGE_KEYS.REVIEW_COMMENTS, {}))
  const [resolvedFindings, setResolvedFindings] = useState(() => loadState(STORAGE_KEYS.RESOLVED_FINDINGS, {}))
  const [issuerRecords, setIssuerRecords] = useState(defaultIssuerRecords)

  const [selectedAppId, setSelectedAppId] = useState(null)
  const [currentFindings, setCurrentFindings] = useState(null)
  const [showWizard, setShowWizard] = useState(false)
  const [validationState, setValidationState] = useState(null)

  useEffect(() => { saveState(STORAGE_KEYS.APPLICATIONS, applications) }, [applications])
  useEffect(() => { saveState(STORAGE_KEYS.SCENARIO, scenario) }, [scenario])
  useEffect(() => { saveState(STORAGE_KEYS.ENABLED_RULES, rules) }, [rules])
  useEffect(() => { saveState(STORAGE_KEYS.AUDIT_EVENTS, auditEvents) }, [auditEvents])
  useEffect(() => { saveState(STORAGE_KEYS.REVIEW_COMMENTS, reviewComments) }, [reviewComments])
  useEffect(() => { saveState(STORAGE_KEYS.RESOLVED_FINDINGS, resolvedFindings) }, [resolvedFindings])
  useEffect(() => { saveState(STORAGE_KEYS.CURRENT_ROLE, role) }, [role])

  const addAuditEvent = useCallback((type, description, applicationId = null, actor = null) => {
    const event = {
      id: generateId('EVT'),
      type,
      description,
      applicationId,
      actor: actor || (role === 'official' ? 'Official Reviewer' : 'Institution User'),
      timestamp: new Date().toISOString(),
    }
    setAuditEvents(prev => [event, ...prev])
  }, [role])

  const selectedApp = applications.find(a => a.id === selectedAppId) || null

  const handleNavigate = useCallback((page, appId) => {
    setCurrentPage(page)
    if (appId) setSelectedAppId(appId)
  }, [])

  const handleViewApplication = useCallback((appId) => {
    setSelectedAppId(appId)
    const app = applications.find(a => a.id === appId)
    if (app && (app.validationStatus === 'validated' || app.validationStatus === 'action_required' || app.validationStatus === 'review_required')) {
      const enabledRules = rules.filter(r => r.enabled)
      const findings = generateFindings(app.scenario || scenario, appId, app.documents, enabledRules)
      setCurrentFindings(findings)
    } else {
      setCurrentFindings(null)
    }
    setCurrentPage('application_detail')
  }, [applications, rules, scenario])

  const handleValidateApplication = useCallback((appId) => {
    const app = applications.find(a => a.id === appId)
    if (!app) return
    const appScenario = app.scenario || scenario
    const enabledRules = rules.filter(r => r.enabled)

    setValidationState({ isRunning: true, stages: VALIDATION_STAGES, currentStageIndex: -1, progress: 0, completed: false })
    setCurrentPage('validation_progress')
    addAuditEvent('validation_started', `Validation started for ${appId}`, appId)

    runValidation(app, appScenario, enabledRules, (progressData) => {
      setValidationState(prev => ({
        ...prev,
        currentStageIndex: progressData.stageIndex,
        progress: progressData.progress,
        currentMessage: progressData.message,
      }))
    }).then((result) => {
      setCurrentFindings(result.findings)
      const hasIssues = result.findings.some(f => f.status !== 'passed')
      const status = !hasIssues ? 'validated' : result.findings.some(f => f.severity === 'high') ? 'action_required' : 'review_required'

      setApplications(prev => prev.map(a =>
        a.id === appId ? { ...a, validationStatus: status, findingsCount: result.summary.findings, validatedAt: result.completedAt } : a
      ))

      setValidationState(prev => ({ ...prev, isRunning: false, completed: true, progress: 100 }))
      addAuditEvent('validation_completed', `Validation completed for ${appId} — ${result.summary.findings} finding(s)`, appId, 'System')

      result.findings.filter(f => f.status !== 'passed').forEach(f => {
        addAuditEvent('finding_identified', `${f.title}: ${f.explanation}`, appId, 'System')
      })
    })
  }, [applications, scenario, rules, addAuditEvent])

  const handleCancelValidation = useCallback(() => {
    setValidationState(null)
    setCurrentPage('application_detail')
  }, [])

  const handleViewReport = useCallback(() => {
    setCurrentPage('application_detail')
  }, [])

  const handleNewApplication = useCallback(() => {
    setShowWizard(true)
  }, [])

  const handleWizardComplete = useCallback((appData) => {
    const newApp = {
      ...appData,
      id: appData.id || generateId('APP-2026-'),
      validationStatus: 'pending',
      findingsCount: 0,
      submissionDate: new Date().toISOString(),
      scenario: scenario,
      documents: appData.documents || [],
    }
    setApplications(prev => [newApp, ...prev])
    addAuditEvent('application_created', `Application ${newApp.id} created for ${newApp.institutionName}`, newApp.id)
    setShowWizard(false)
    setSelectedAppId(newApp.id)
    setCurrentPage('application_detail')
  }, [scenario, addAuditEvent])

  const handleScenarioChange = useCallback((newScenario) => {
    setScenario(newScenario)
  }, [])

  const handleLoadDemo = useCallback(() => {
    const demoApp = defaultApplications.find(a => a.scenario === scenario) || defaultApplications[0]
    setSelectedAppId(demoApp.id)
    const enabledRules = rules.filter(r => r.enabled)
    const findings = generateFindings(demoApp.scenario, demoApp.id, demoApp.documents, enabledRules)
    setCurrentFindings(findings)
    setCurrentPage('application_detail')
    addAuditEvent('application_created', `Demo scenario loaded: ${demoApp.institutionName}`, demoApp.id, 'System')
  }, [scenario, rules, addAuditEvent])

  const handleResetData = useCallback(() => {
    resetAllDemoData()
    setApplications(defaultApplications)
    setRules(defaultRules)
    setAuditEvents([])
    setReviewComments({})
    setResolvedFindings({})
    setScenario('clean')
    setRole('institution')
    setSelectedAppId(null)
    setCurrentFindings(null)
    setValidationState(null)
    setCurrentPage('overview')
  }, [])

  const handleToggleRule = useCallback((ruleId) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
  }, [])

  const handleRerunValidation = useCallback(() => {
    if (selectedAppId) handleValidateApplication(selectedAppId)
  }, [selectedAppId, handleValidateApplication])

  const handleAddComment = useCallback((applicationId, findingId, comment) => {
    const key = `${applicationId}_${findingId}`
    const entry = {
      id: generateId('CMT'),
      findingId,
      text: comment,
      actor: 'Official Reviewer',
      timestamp: new Date().toISOString(),
    }
    setReviewComments(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), entry],
    }))
    addAuditEvent('reviewer_comment', `Comment added on finding ${findingId}`, applicationId)
  }, [addAuditEvent])

  const handleResolveFinding = useCallback((applicationId, findingId, reason) => {
    const key = `${applicationId}_${findingId}`
    setResolvedFindings(prev => ({
      ...prev,
      [key]: reason,
    }))
    addAuditEvent('finding_resolved', `Finding ${findingId} resolved: ${reason}`, applicationId)
  }, [addAuditEvent])

  const handleRequestClarification = useCallback((applicationId, findingId) => {
    addAuditEvent('reviewer_comment', `Clarification requested for finding ${findingId}`, applicationId)
  }, [addAuditEvent])

  const handleEscalate = useCallback((applicationId, findingId) => {
    addAuditEvent('reviewer_comment', `Finding ${findingId} escalated for further verification`, applicationId)
  }, [addAuditEvent])

  const handleVerifyIssuer = useCallback((recordId) => {
    addAuditEvent('issuer_verification', `Issuer verification triggered for record ${recordId}`, selectedAppId, 'System')
    return new Promise(resolve => {
      setTimeout(() => {
        setIssuerRecords(prev => prev.map(r =>
          r.id === recordId ? { ...r, verificationStatus: r.verificationStatus === 'verification_pending' ? 'verified' : r.verificationStatus, timestamp: new Date().toISOString() } : r
        ))
        resolve()
      }, 1500)
    })
  }, [selectedAppId, addAuditEvent])

  const renderPage = () => {
    if (showWizard) {
      return <NewApplicationWizard onComplete={handleWizardComplete} onCancel={() => setShowWizard(false)} />
    }

    if (currentPage === 'validation_progress' && validationState) {
      return (
        <ValidationProgress
          isRunning={validationState.isRunning}
          stages={validationState.stages}
          currentStageIndex={validationState.currentStageIndex}
          progress={validationState.progress}
          currentMessage={validationState.currentMessage}
          onCancel={handleCancelValidation}
          completed={validationState.completed}
          onViewReport={handleViewReport}
        />
      )
    }

    switch (currentPage) {
      case 'overview':
        return <OverviewPage applications={applications} onNavigate={handleNavigate} onNewApplication={handleNewApplication} onViewApplication={handleViewApplication} />
      case 'applications':
        return <ApplicationsPage applications={applications} onViewApplication={handleViewApplication} onNewApplication={handleNewApplication} />
      case 'application_detail':
        return (
          <ApplicationDetailPage
            application={selectedApp}
            findings={currentFindings}
            onValidate={() => handleValidateApplication(selectedAppId)}
            onBack={() => setCurrentPage('applications')}
            onNavigate={handleNavigate}
            scenario={scenario}
            resolvedFindings={resolvedFindings}
            reviewComments={reviewComments}
          />
        )
      case 'documents':
        return <DocumentValidationPage applications={applications} onNavigate={handleNavigate} onStartValidation={(appId) => handleValidateApplication(appId)} />
      case 'issuer':
        return <IssuerVerificationPage issuerRecords={issuerRecords} onVerify={handleVerifyIssuer} />
      case 'compliance':
        return <ComplianceChecksPage rules={rules} onToggleRule={handleToggleRule} onRerunValidation={handleRerunValidation} />
      case 'review':
        return (
          <OfficialReviewPage
            applications={applications}
            findings={currentFindings}
            reviewComments={reviewComments}
            resolvedFindings={resolvedFindings}
            onAddComment={handleAddComment}
            onResolveFinding={handleResolveFinding}
            onRequestClarification={handleRequestClarification}
            onEscalate={handleEscalate}
            onViewApplication={handleViewApplication}
            rules={rules}
            scenario={scenario}
          />
        )
      case 'audit':
        return <AuditTrailPage events={auditEvents} />
      default:
        return <OverviewPage applications={applications} onNavigate={handleNavigate} onNewApplication={handleNewApplication} onViewApplication={handleViewApplication} />
    }
  }

  return (
    <>
      <AppShell currentPage={currentPage} onNavigate={handleNavigate} role={role} onRoleChange={setRole}>
        {renderPage()}
      </AppShell>
      <DemoControls
        scenario={scenario}
        onScenarioChange={handleScenarioChange}
        onResetData={handleResetData}
        onLoadDemo={handleLoadDemo}
      />
    </>
  )
}
