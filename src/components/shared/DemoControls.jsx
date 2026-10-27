import React, { useState } from 'react';
import { FlaskConical, RotateCcw, Play } from 'lucide-react';
import Button from './Button';

const SCENARIOS = [
  { id: 'A', label: 'A. Clean Application', desc: 'All checks pass, no issues' },
  { id: 'B', label: 'B. Missing Document', desc: 'One required document missing' },
  { id: 'C', label: 'C. Expired Certificate', desc: 'Certificate expiry date in the past' },
  { id: 'D', label: 'D. Institutional Record Mismatch', desc: 'Intake mismatch (120 vs 90)' },
  { id: 'E', label: 'E. Potential Document Anomaly', desc: 'Metadata inconsistency detected' },
];

export default function DemoControls({ scenario, onScenarioChange, onResetData, onLoadDemo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {expanded && (
        <div className="mb-2 bg-white rounded-xl shadow-xl border border-gray-200 w-80 animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#1a237e]" />
              <span className="text-sm font-semibold text-gray-900">Demo Controls</span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              SYNTHETIC DATA
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Scenario</label>
              <select
                value={scenario}
                onChange={(e) => onScenarioChange(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                {SCENARIOS.find(s => s.id === scenario)?.desc}
              </p>
            </div>
            <Button variant="primary" size="md" icon={Play} onClick={onLoadDemo} className="w-full">
              Load Demo Scenario
            </Button>
            <Button variant="outline" size="sm" icon={RotateCcw} onClick={onResetData} className="w-full">
              Reset Demo Data
            </Button>
            <p className="text-[10px] text-center text-gray-400">
              DEMO PROTOTYPE · SYNTHETIC DATA
            </p>
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-colors text-sm font-medium ${
          expanded
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-[#1a237e] text-white hover:bg-[#161d6b]'
        }`}
      >
        <FlaskConical className="w-4 h-4" />
        {expanded ? 'Close' : 'Demo Controls'}
      </button>
    </div>
  );
}
