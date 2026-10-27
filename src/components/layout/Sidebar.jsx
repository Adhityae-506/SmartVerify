import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  ShieldCheck,
  ClipboardCheck,
  UserCheck,
  History,
  Shield,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'documents', label: 'Document Validation', icon: FileCheck },
  { id: 'issuer', label: 'Issuer Verification', icon: ShieldCheck },
  { id: 'compliance', label: 'Compliance Checks', icon: ClipboardCheck },
  { id: 'review', label: 'Official Review', icon: UserCheck, officialOnly: true },
  { id: 'audit', label: 'Audit Trail', icon: History },
];

export default function Sidebar({ currentPage, onNavigate, role, collapsed, onToggleCollapse }) {
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.officialOnly || role === 'official'
  );

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-[250px] bg-[#1a237e] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate">
              AICTE SmartVerify
            </h1>
            <p className="text-[10px] text-blue-200 font-medium">
              AI-Powered Validation
            </p>
          </div>
          <button
            onClick={onToggleCollapse}
            className="lg:hidden ml-auto p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {visibleItems.map((item) => {
              const active = currentPage === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      if (window.innerWidth < 1024) onToggleCollapse();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm
                      transition-colors duration-150
                      ${
                        active
                          ? 'bg-white/15 text-white font-medium border-l-[3px] border-amber-400 pl-[9px]'
                          : 'text-blue-100 hover:bg-white/10 hover:text-white border-l-[3px] border-transparent pl-[9px]'
                      }
                    `}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center justify-center">
            <span className="text-[9px] font-semibold tracking-wider text-blue-200/60 uppercase">
              Demo Prototype
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
