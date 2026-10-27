import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, ChevronRight } from 'lucide-react';

const PAGE_LABELS = {
  overview: 'Overview',
  applications: 'My Applications',
  documents: 'Document Validation',
  issuer: 'Issuer Verification',
  compliance: 'Compliance Checks',
  review: 'Official Review',
  audit: 'Audit Trail',
  'new-application': 'New Application',
  'application-detail': 'Application Details',
  'validation-report': 'Validation Report',
};

export default function TopBar({ currentPage, role, onRoleChange, onMenuToggle }) {
  const [roleOpen, setRoleOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <span className="text-gray-400 hidden sm:inline">SmartVerify</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:block shrink-0" />
        <span className="font-medium text-gray-800 truncate">
          {PAGE_LABELS[currentPage] || 'Overview'}
        </span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-1.5 w-56">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search applications..."
          className="bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none ml-2 w-full"
          readOnly
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Notifications">
        <Bell className="w-[18px] h-[18px]" />
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          3
        </span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 hidden sm:block" />

      {/* Role selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setRoleOpen(!roleOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${role === 'official' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-gray-700 hidden sm:inline">
            {role === 'official' ? 'Official' : 'Institution'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {roleOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
            <button
              onClick={() => { onRoleChange('institution'); setRoleOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${role === 'institution' ? 'text-[#1a237e] font-medium' : 'text-gray-700'}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Institution
            </button>
            <button
              onClick={() => { onRoleChange('official'); setRoleOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${role === 'official' ? 'text-[#1a237e] font-medium' : 'text-gray-700'}`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Official
            </button>
          </div>
        )}
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#1a237e] flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">DU</span>
        </div>
        <span className="text-sm font-medium text-gray-700 hidden lg:block">Demo User</span>
      </div>
    </header>
  );
}
