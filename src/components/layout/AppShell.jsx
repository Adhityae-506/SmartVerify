import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ currentPage, onNavigate, role, onRoleChange, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="h-screen flex bg-[#f5f7fa]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        role={role}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentPage={currentPage}
          role={role}
          onRoleChange={onRoleChange}
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
