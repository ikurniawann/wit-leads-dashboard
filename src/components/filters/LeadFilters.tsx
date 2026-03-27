'use client';

import { useState } from 'react';
import { X, Filter, Save, Calendar, User, Tag, Building2 } from 'lucide-react';

interface LeadFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AppliedFilters) => void;
  onReset: () => void;
  currentFilters?: AppliedFilters;
}

export interface AppliedFilters {
  stages: string[];
  pics: string[];
  industries: string[];
  dateFrom?: string;
  dateTo?: string;
  min_value?: number;
  max_value?: number;
}

const stageOptions = [
  { value: 'NEW', label: 'New Lead', color: 'blue' },
  { value: 'APPROVED', label: 'Approved', color: 'green' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'yellow' },
  { value: 'DONE', label: 'Won', color: 'purple' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
];

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Education', label: 'Education' },
  { value: 'Government', label: 'Government' },
  { value: 'Other', label: 'Other' },
];

export default function LeadFilters({
  isOpen,
  onClose,
  onApply,
  onReset,
  currentFilters,
}: LeadFiltersProps) {
  const [stages, setStages] = useState<string[]>(currentFilters?.stages || []);
  const [pics, setPics] = useState<string[]>(currentFilters?.pics || []);
  const [industries, setIndustries] = useState<string[]>(currentFilters?.industries || []);
  const [dateFrom, setDateFrom] = useState<string>(currentFilters?.dateFrom || '');
  const [dateTo, setDateTo] = useState<string>(currentFilters?.dateTo || '');
  const [minValue, setMinValue] = useState<string>(currentFilters?.min_value?.toString() || '');
  const [maxValue, setMaxValue] = useState<string>(currentFilters?.max_value?.toString() || '');

  const toggleStage = (stage: string) => {
    setStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const toggleIndustry = (industry: string) => {
    setIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const handleApply = () => {
    const filters: AppliedFilters = {
      stages,
      pics,
      industries,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      min_value: minValue ? Number(minValue) : undefined,
      max_value: maxValue ? Number(maxValue) : undefined,
    };
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setStages([]);
    setPics([]);
    setIndustries([]);
    setDateFrom('');
    setDateTo('');
    setMinValue('');
    setMaxValue('');
    onReset();
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (stages.length > 0) count += stages.length;
    if (pics.length > 0) count += pics.length;
    if (industries.length > 0) count += industries.length;
    if (dateFrom || dateTo) count += 1;
    if (minValue || maxValue) count += 1;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-wit-darker border border-wit-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-wit-border">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-wit-red/10 rounded-xl">
              <Filter className="w-6 h-6 text-wit-red" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-wit-text">Advanced Filters</h2>
              <p className="text-sm text-wit-muted">
                {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stage Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-4 h-4 text-wit-muted" />
              <h3 className="text-sm font-semibold text-wit-text">Stage</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stageOptions.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => toggleStage(stage.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    stages.includes(stage.value)
                      ? `bg-${stage.color}-500/10 text-${stage.color}-500 border-${stage.color}-500/30`
                      : 'bg-wit-card text-wit-muted hover:text-wit-text border-wit-border'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="w-4 h-4 text-wit-muted" />
              <h3 className="text-sm font-semibold text-wit-text">Industry</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {industryOptions.map((industry) => (
                <button
                  key={industry.value}
                  onClick={() => toggleIndustry(industry.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    industries.includes(industry.value)
                      ? 'bg-wit-red/10 text-wit-red border-wit-red/30'
                      : 'bg-wit-card text-wit-muted hover:text-wit-text border-wit-border'
                  }`}
                >
                  {industry.label}
                </button>
              ))}
            </div>
          </div>

          {/* PIC Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-4 h-4 text-wit-muted" />
              <h3 className="text-sm font-semibold text-wit-text">PIC (Person in Charge)</h3>
            </div>
            <select
              multiple
              value={pics}
              onChange={(e) => setPics(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
              style={{ minHeight: '120px' }}
            >
              <option value="admin">Admin</option>
              <option value="sales1">Sales Team 1</option>
              <option value="sales2">Sales Team 2</option>
              <option value="manager">Manager</option>
              {/* Add more PICs as needed */}
            </select>
            <p className="text-xs text-wit-muted mt-2">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Date Range Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-wit-muted" />
              <h3 className="text-sm font-semibold text-wit-text">Date Range</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-wit-muted mb-2">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-wit-muted mb-2">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
                  min={dateFrom || undefined}
                />
              </div>
            </div>
          </div>

          {/* Value Range Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-wit-muted" />
              <h3 className="text-sm font-semibold text-wit-text">Value Range (Rp)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-wit-muted mb-2">Min Value</label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-wit-muted mb-2">Max Value</label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="No limit"
                  className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-wit-border bg-wit-card/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 text-sm font-medium text-wit-muted hover:text-wit-text transition-all"
            >
              Reset All Filters
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-wit-muted hover:text-wit-text transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-3 btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
