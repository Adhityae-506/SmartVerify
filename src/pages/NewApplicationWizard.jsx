import { useState, useRef } from 'react';
import {
  Check, ChevronLeft, ChevronRight, X, Upload, FileText,
  Image, AlertCircle, CheckCircle, XCircle, File
} from 'lucide-react';

const STEPS = [
  { key: 'institution', label: 'Institution Details' },
  { key: 'application', label: 'Application Details' },
  { key: 'documents', label: 'Supporting Documents' },
  { key: 'review', label: 'Review & Validate' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const CATEGORIES = ['Extension of Approval (EoA)', 'Change in Approved Intake'];

const DOC_CATEGORIES = [
  { key: 'affidavit', label: 'Affidavit / Undertaking' },
  { key: 'accreditation', label: 'Accreditation / Certification' },
  { key: 'noc', label: 'NOC / Permission' },
  { key: 'faculty', label: 'Faculty Records' },
  { key: 'infrastructure', label: 'Infrastructure Evidence' },
  { key: 'previous_approval', label: 'Previous Approval Document' },
];

function generateAppId() {
  const num = Math.floor(100 + Math.random() * 900);
  return `APP-2026-${num}`;
}

function generateInstId() {
  return `INST-${Math.floor(10000 + Math.random() * 90000)}`;
}

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function NewApplicationWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState({});
  const [appIdGenerated] = useState(generateAppId);
  const [instIdGenerated] = useState(generateInstId);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    institutionName: '',
    institutionId: instIdGenerated,
    state: '',
    category: '',
    applicationId: appIdGenerated,
    academicYear: '2026-2027',
    programme: '',
    approvedIntake: '',
    proposedIntake: '',
  });

  const [documents, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFieldInvalid = (field) => {
    return touched[field] && !formData[field];
  };

  const canProceed = () => {
    if (step === 0) {
      return formData.institutionName && formData.state && formData.category;
    }
    if (step === 1) {
      return formData.programme && formData.approvedIntake && formData.proposedIntake;
    }
    return true;
  };

  const goNext = () => {
    if (step === 0) {
      setTouched({ institutionName: true, state: true, category: true });
    } else if (step === 1) {
      setTouched(prev => ({ ...prev, programme: true, approvedIntake: true, proposedIntake: true }));
    }
    if (canProceed() && step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const addFiles = (fileList) => {
    const newFiles = [];
    Array.from(fileList).forEach(file => {
      if (!ACCEPTED_TYPES.includes(file.type)) return;
      if (file.size > MAX_SIZE) return;
      newFiles.push({
        id: `WDOC-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });
    if (newFiles.length > 0) {
      setDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = (validate) => {
    const app = {
      id: formData.applicationId,
      institutionName: formData.institutionName,
      institutionId: formData.institutionId,
      state: formData.state,
      category: formData.category,
      academicYear: formData.academicYear,
      programme: formData.programme,
      approvedIntake: parseInt(formData.approvedIntake) || 0,
      proposedIntake: parseInt(formData.proposedIntake) || 0,
      documents: documents.map(d => ({
        id: d.id || `DOC-${Math.random().toString(36).slice(2, 8)}`,
        name: d.file ? d.file.name : d.name || 'Unknown',
        category: d.category || 'Other Supporting Document',
        uploadedAt: d.uploadedAt || new Date().toISOString(),
        size: d.file ? d.file.size : 0,
        status: 'uploaded',
      })),
      submittedAt: new Date().toISOString(),
      runValidation: !!validate,
    };
    onComplete(app);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-gray-900">New Application</h1>
            <button
              onClick={onCancel}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
            This wizard demonstrates the application creation flow. All fields are illustrative and do not represent official AICTE requirements.
          </p>
        </div>

        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-center max-w-xl mx-auto">
            {STEPS.map((s, idx) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                      idx < step
                        ? 'bg-green-500 border-green-500 text-white'
                        : idx === step
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {idx < step ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${
                    idx <= step ? 'text-gray-700 font-medium' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                    idx < step ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 min-h-[340px]">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Institution Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => update('institutionName', e.target.value)}
                    placeholder="e.g. Meridian Institute of Technology"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                      isFieldInvalid('institutionName') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {isFieldInvalid('institutionName') && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution ID</label>
                  <input
                    type="text"
                    value={formData.institutionId}
                    onChange={(e) => update('institutionId', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Auto-generated for demo</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => update('state', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                      isFieldInvalid('state') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select state…</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {isFieldInvalid('state') && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => update('category', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                      isFieldInvalid('category') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {isFieldInvalid('category') && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                  <input
                    type="text"
                    value={formData.applicationId}
                    readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Auto-generated</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => update('academicYear', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600"
                  >
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programme <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.programme}
                    onChange={(e) => update('programme', e.target.value)}
                    placeholder="e.g. B.Tech Computer Science and Engineering"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                      isFieldInvalid('programme') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {isFieldInvalid('programme') && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved Intake <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.approvedIntake}
                    onChange={(e) => update('approvedIntake', e.target.value)}
                    placeholder="e.g. 60"
                    min="0"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                      isFieldInvalid('approvedIntake') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {isFieldInvalid('approvedIntake') && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Intake <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.proposedIntake}
                    onChange={(e) => update('proposedIntake', e.target.value)}
                    placeholder="e.g. 120"
                    min="0"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
                      isFieldInvalid('proposedIntake') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {isFieldInvalid('proposedIntake') && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Supporting Documents</h2>
              <p className="text-sm text-gray-500 mb-4">
                For this demo, documents can be added later from the Document Validation page.
              </p>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-navy-500 bg-navy-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop files or <span className="text-navy-600 underline">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPEG — Max 10 MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    addFiles(e.target.files);
                    e.target.value = '';
                  }
                }}
              />

              {documents.length > 0 && (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {documents.map(doc => (
                    <div key={doc.id} className="px-4 py-3 flex items-center gap-3">
                      {doc.type === 'application/pdf'
                        ? <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        : doc.type.startsWith('image/')
                        ? <Image className="w-4 h-4 text-blue-500 shrink-0" />
                        : <File className="w-4 h-4 text-gray-400 shrink-0" />
                      }
                      <span className="text-sm text-gray-700 truncate flex-1">{doc.name}</span>
                      <span className="text-xs text-gray-400">{formatFileSize(doc.size)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocuments(prev => prev.filter(d => d.id !== doc.id));
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Required Document Checklist</h3>
                <div className="space-y-2">
                  {DOC_CATEGORIES.map(cat => (
                    <div key={cat.key} className="flex items-center gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-gray-300 shrink-0" />
                      <span className="text-gray-600">{cat.label}</span>
                      <span className="text-xs text-gray-400 ml-auto">Not uploaded</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Institution Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Name</dt>
                      <dd className="text-gray-900 font-medium">{formData.institutionName || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">ID</dt>
                      <dd className="text-gray-900">{formData.institutionId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">State</dt>
                      <dd className="text-gray-900">{formData.state || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Category</dt>
                      <dd className="text-gray-900">{formData.category || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Application Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">App ID</dt>
                      <dd className="text-gray-900">{formData.applicationId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Academic Year</dt>
                      <dd className="text-gray-900">{formData.academicYear}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Programme</dt>
                      <dd className="text-gray-900">{formData.programme || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Approved Intake</dt>
                      <dd className="text-gray-900">{formData.approvedIntake || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Proposed Intake</dt>
                      <dd className="text-gray-900">{formData.proposedIntake || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Document Completeness</h3>
                <div className="flex items-center gap-2">
                  {documents.length > 0 ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{documents.length} document(s) attached</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-700">No documents uploaded — can be added later</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-lg">
          <button
            onClick={step === 0 ? onCancel : goBack}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? 'Cancel' : 'Previous'}
          </button>

          <div className="flex items-center gap-3">
            {step < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                className={`flex items-center gap-1 text-sm font-medium px-5 py-2 rounded-lg transition-colors ${
                  canProceed()
                    ? 'bg-navy-600 text-white hover:bg-navy-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSubmit(false)}
                  className="text-sm font-medium px-5 py-2 border border-navy-600 text-navy-600 rounded-lg hover:bg-navy-50 transition-colors"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  className="text-sm font-medium px-5 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
                >
                  Submit & Validate
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
