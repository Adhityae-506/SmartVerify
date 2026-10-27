import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, FileText, Image, X, Eye, CheckCircle, XCircle,
  AlertCircle, ChevronDown, File, Shield
} from 'lucide-react';

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_SIZE = 10 * 1024 * 1024;

const DOCUMENT_CATEGORIES = [
  { key: 'affidavit', label: 'Affidavit / Undertaking' },
  { key: 'accreditation', label: 'Accreditation / Certification' },
  { key: 'noc', label: 'NOC / Permission' },
  { key: 'faculty', label: 'Faculty Records' },
  { key: 'infrastructure', label: 'Infrastructure Evidence' },
  { key: 'previous_approval', label: 'Previous Approval Document' },
  { key: 'other', label: 'Other Supporting Document' },
];

let docCounter = 0;
function generateDocId() {
  docCounter += 1;
  return `DOC-${String(docCounter).padStart(4, '0')}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(type) {
  if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
  if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
}

export default function DocumentValidationPage({ applications, onNavigate, onStartValidation }) {
  const [selectedAppId, setSelectedAppId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      uploadedFiles.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
  }, []);

  const selectedApp = applications?.find(a => a.id === selectedAppId);

  const addFiles = useCallback((fileList) => {
    const newErrors = [];
    const newFiles = [];

    Array.from(fileList).forEach(file => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        newErrors.push(`"${file.name}" — unsupported file type. Only PDF, PNG, and JPEG are accepted.`);
        return;
      }
      if (file.size > MAX_SIZE) {
        newErrors.push(`"${file.name}" — file exceeds 10 MB limit.`);
        return;
      }
      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : null;
      newFiles.push({
        id: generateDocId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        category: null,
        previewUrl,
        uploadedAt: new Date().toISOString(),
      });
    });

    setErrors(newErrors);
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      return prev.filter(f => f.id !== fileId);
    });
  };

  const updateCategory = (fileId, category) => {
    setUploadedFiles(prev =>
      prev.map(f => f.id === fileId ? { ...f, category } : f)
    );
  };

  const openPreview = (file) => {
    if (file.previewUrl) {
      setPreviewFile(file);
    } else if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file.file);
      setPreviewFile({ ...file, previewUrl: url, _tempUrl: true });
    }
  };

  const closePreview = () => {
    if (previewFile?._tempUrl && previewFile.previewUrl) {
      URL.revokeObjectURL(previewFile.previewUrl);
    }
    setPreviewFile(null);
  };

  const getCategoryStatus = (catKey) => {
    return uploadedFiles.some(f => f.category === catKey);
  };

  const handleValidate = () => {
    if (selectedApp && onStartValidation) {
      onStartValidation(selectedApp.id, uploadedFiles);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Validation</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and validate application documents</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Application</label>
        <div className="relative">
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full md:w-96 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent"
          >
            <option value="">— Choose an application —</option>
            {(applications || []).map(app => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.institutionName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {!selectedAppId && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Select an application above to begin document validation</p>
          <p className="text-gray-400 text-sm mt-2">You can upload documents, assign categories, and run a simulated validation workflow</p>
        </div>
      )}

      {selectedAppId && selectedApp && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Documents are stored locally in your browser session only. No files are uploaded to any server.</span>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-sm text-red-700 flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {err}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-navy-600" />
                    Upload Documents
                  </h2>
                </div>
                <div className="p-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? 'border-navy-500 bg-navy-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-navy-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium text-gray-700">
                      Drag and drop files here, or <span className="text-navy-600 underline">click to browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPEG — Max 10 MB per file</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">
                      Uploaded Documents ({uploadedFiles.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                        <div className="shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} · {new Date(file.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="shrink-0 w-48">
                          <select
                            value={file.category || ''}
                            onChange={(e) => updateCategory(file.id, e.target.value || null)}
                            className="w-full text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-navy-600"
                          >
                            <option value="">Assign category…</option>
                            {DOCUMENT_CATEGORIES.map(cat => (
                              <option key={cat.key} value={cat.key}>{cat.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="shrink-0 flex items-center gap-1">
                          {file.category && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {(file.previewUrl || file.type === 'application/pdf') && (
                            <button
                              onClick={() => openPreview(file)}
                              className="p-1.5 text-gray-400 hover:text-navy-600 hover:bg-gray-100 rounded"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-navy-600" />
                    Document Checklist
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {DOCUMENT_CATEGORIES.filter(c => c.key !== 'other').map(cat => {
                    const uploaded = getCategoryStatus(cat.key);
                    return (
                      <div key={cat.key} className="flex items-center gap-3">
                        {uploaded ? (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">{cat.label}</p>
                          <p className={`text-xs ${uploaded ? 'text-green-600' : 'text-red-500'}`}>
                            {uploaded ? 'Uploaded' : 'Missing'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                    This checklist is illustrative. Categories do not represent official AICTE requirements.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Application Summary</h3>
                <div className="text-xs space-y-1 text-gray-600">
                  <p><span className="font-medium">ID:</span> {selectedApp.id}</p>
                  <p><span className="font-medium">Institution:</span> {selectedApp.institutionName}</p>
                  <p><span className="font-medium">Category:</span> {selectedApp.category}</p>
                  <p><span className="font-medium">Status:</span> {selectedApp.status}</p>
                </div>
              </div>

              <button
                onClick={handleValidate}
                className="w-full bg-navy-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-navy-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-5 h-5" />
                Validate Application
              </button>
            </div>
          </div>
        </>
      )}

      {previewFile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closePreview}>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 truncate">{previewFile.name}</h3>
              <button onClick={closePreview} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
              {previewFile.type.startsWith('image/') ? (
                <img
                  src={previewFile.previewUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-[65vh] object-contain rounded"
                />
              ) : previewFile.type === 'application/pdf' ? (
                <iframe
                  src={previewFile.previewUrl}
                  title={previewFile.name}
                  className="w-full h-[65vh] rounded"
                />
              ) : (
                <p className="text-gray-500">Preview not available for this file type.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
