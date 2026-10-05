import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { Company, Difficulty } from '@/types';
import { apiClient } from '@/lib/api/client';
import { CompanyCard } from '@/features/companies/CompanyCard';
import { CompanyFilters } from '@/features/companies/CompanyFilters';
import { ProposeCompanyModal } from '@/features/contributions/ProposeCompanyModal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const CompaniesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [sortBy, setSortBy] = useState('DRIVES_DESC');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getCompanies();
        setCompanies(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Sync search input to URL query params
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q) {
      setSearchParams({ search: q });
    } else {
      setSearchParams({});
    }
  };

  // Distinct industries
  const industries: string[] = Array.from(new Set(companies.map((c) => c.industry))).sort();

  // Filter and sort logic
  const filteredCompanies = companies
    .filter((comp) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = comp.name.toLowerCase().includes(q);
        const matchesInd = comp.industry.toLowerCase().includes(q);
        const matchesOverview = comp.overview.toLowerCase().includes(q);
        if (!matchesName && !matchesInd && !matchesOverview) return false;
      }
      if (selectedIndustry !== 'ALL' && comp.industry !== selectedIndustry) {
        return false;
      }
      if (selectedDifficulty !== 'ALL' && comp.averageInterviewDifficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'DRIVES_DESC') return b.totalHistoricalDrives - a.totalHistoricalDrives;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'RATING_DESC') return (b.alumniOverallRating || 0) - (a.alumniOverallRating || 0);
      if (sortBy === 'DIFFICULTY_DESC') {
        const diffRank: Record<Difficulty, number> = { HARD: 3, MEDIUM: 2, EASY: 1 };
        return diffRank[b.averageInterviewDifficulty] - diffRank[a.averageInterviewDifficulty];
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Companies Directory' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-brand-600" />
            Recruiting Companies Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical campus drive partners at Dhirubhai Ambani University (DAU).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsProposeModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Propose New Company
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <CompanyFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        sortBy={sortBy}
        onSortChange={setSortBy}
        industries={industries}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong>{filteredCompanies.length}</strong> companies matching filters
        </span>
        {(searchQuery || selectedIndustry !== 'ALL' || selectedDifficulty !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('ALL');
              setSelectedDifficulty('ALL');
              setSearchParams({});
            }}
            className="text-brand-600 hover:text-brand-800 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Company Grid */}
      {loading ? (
        <LoadingSpinner label="Fetching company records..." className="py-20" />
      ) : filteredCompanies.length === 0 ? (
        <EmptyState
          title="No companies found"
          description="We couldn't find any companies matching your search filters. Try adjusting your query or propose a new company."
          action={
            <Button variant="secondary" size="sm" onClick={() => setIsProposeModalOpen(true)}>
              Propose This Company
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {/* Propose Company Modal */}
      <ProposeCompanyModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
      />
    </div>
  );
};
