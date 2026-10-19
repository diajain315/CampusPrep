import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';

export interface ResourceFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  topics: string[];
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedTopic,
  onTopicChange,
  topics,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search resources by topic, title, or keywords..."
          />
        </div>
        <div className="w-full sm:w-60">
          <select
            aria-label="Filter by Topic"
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="cp-select text-xs font-medium"
          >
            <option value="ALL">All Subject Topics</option>
            {topics.map((top) => (
              <option key={top} value={top}>
                {top}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
