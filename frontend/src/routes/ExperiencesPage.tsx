import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle } from 'lucide-react';
import { InterviewExperience } from '@/types';
import { apiClient } from '@/lib/api/client';
import { DEMO_COMPANIES } from '@/fixtures';
import { ExperienceCard } from '@/features/experiences/ExperienceCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanySlug, setSelectedCompanySlug] = useState('ALL');
  const [selectedOutcome, setSelectedOutcome] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getInterviewExperiences({
          companySlug: selectedCompanySlug !== 'ALL' ? selectedCompanySlug : undefined,
          candidateOutcome: selectedOutcome !== 'ALL' ? selectedOutcome : undefined,
          recruitmentYear: selectedYear !== 'ALL' ? Number(selectedYear) : undefined,
          searchQuery: searchQuery || undefined,
        });
        setExperiences(data);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [searchQuery, selectedCompanySlug, selectedOutcome, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Interview Experiences' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-600" />
            Interview Experiences Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            First-hand accounts from DAU students and alumni across Online Assessments and Technical Rounds.
          </p>
        </div>

        <Link to="/contribute">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Share Your Experience
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by questions asked, algorithm (e.g. Trie, Dijkstra), or topic..."
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
            <div className="w-full sm:w-44">
              <select
                aria-label="Filter by Company"
                value={selectedCompanySlug}
                onChange={(e) => setSelectedCompanySlug(e.target.value)}
                className="cp-select text-xs font-medium"
              >
                <option value="ALL">All Companies</option>
                {DEMO_COMPANIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-40">
              <select
                aria-label="Filter by Candidate Outcome"
                value={selectedOutcome}
                onChange={(e) => setSelectedOutcome(e.target.value)}
                className="cp-select text-xs font-medium"
              >
                <option value="ALL">All Outcomes</option>
                <option value="OFFERED">Offer Extended</option>
                <option value="REJECTED">Did Not Receive Offer</option>
                <option value="WITHDREW">Candidate Withdrew</option>
              </select>
            </div>

            <div className="w-full sm:w-36">
              <select
                aria-label="Filter by Recruitment Cycle Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="cp-select text-xs font-medium"
              >
                <option value="ALL">All Cycles</option>
                <option value="2025">2025 Cycle</option>
                <option value="2024">2024 Cycle</option>
                <option value="2023">2023 Cycle</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong>{experiences.length}</strong> verified experiences
        </span>
        {(searchQuery || selectedCompanySlug !== 'ALL' || selectedOutcome !== 'ALL' || selectedYear !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCompanySlug('ALL');
              setSelectedOutcome('ALL');
              setSelectedYear('ALL');
            }}
            className="text-brand-600 hover:text-brand-800 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Experiences List */}
      {loading ? (
        <LoadingSpinner label="Fetching interview logs..." className="py-20" />
      ) : experiences.length === 0 ? (
        <EmptyState
          title="No interview experiences match your filters"
          description="Try broadening your search query or contribute the first experience for this company."
          action={
            <Link to="/contribute">
              <Button variant="primary" size="sm">
                Submit Experience
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
};
