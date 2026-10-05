import { SearchInput } from '@/components/ui/SearchInput';

export interface CompanyFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedIndustry: string;
  onIndustryChange: (ind: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  industries: string[];
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedDifficulty,
  onDifficultyChange,
  sortBy,
  onSortChange,
  industries,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search companies by name, technology, or overview..."
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
          <div className="w-full sm:w-48">
            <select
              aria-label="Filter by Industry"
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="cp-select text-xs"
            >
              <option value="ALL">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-40">
            <select
              aria-label="Filter by Difficulty"
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="cp-select text-xs"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <select
              aria-label="Sort Companies"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="cp-select text-xs font-medium"
            >
              <option value="DRIVES_DESC">Most Drives at DAU</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="DIFFICULTY_DESC">Hardest First</option>
              <option value="RATING_DESC">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
