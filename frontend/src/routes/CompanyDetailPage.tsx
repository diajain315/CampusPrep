import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Calendar,
  Star,
  Bookmark,
  BookmarkCheck,
  Layers,
  FileText,
  BookOpen,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { Company, CampusDrive, InterviewExperience, CompanyReview, PreparationResource } from '@/types';
import { apiClient } from '@/lib/api/client';
import { DEMO_RESOURCES } from '@/fixtures';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SelectionRoundTimeline } from '@/features/companies/SelectionRoundTimeline';
import { ExperienceCard } from '@/features/experiences/ExperienceCard';
import { ResourceCard } from '@/features/resources/ResourceCard';

export const CompanyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { role } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [drives, setDrives] = useState<CampusDrive[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [resources, setResources] = useState<PreparationResource[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [activeTab, setActiveTab] = useState<'DRIVES' | 'EXPERIENCES' | 'REVIEWS' | 'RESOURCES'>('DRIVES');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const comp = await apiClient.getCompanyBySlug(slug);
        setCompany(comp);

        if (comp) {
          const [fetchedDrives, fetchedExp, fetchedReviews, fetchedRes, bookmarked] = await Promise.all([
            apiClient.getDrivesByCompany(slug),
            apiClient.getInterviewExperiences({ companySlug: slug }),
            apiClient.getCompanyReviews(comp.id),
            apiClient.getResources(undefined, comp.name),
            apiClient.isBookmarked('COMPANY', comp.id),
          ]);

          setDrives(fetchedDrives);
          if (fetchedDrives.length > 0) {
            setSelectedYear(fetchedDrives[0].recruitmentYear);
          }
          setExperiences(fetchedExp);
          setReviews(fetchedReviews);
          setResources(fetchedRes);
          setIsBookmarked(bookmarked);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleBookmarkToggle = async () => {
    if (!company) return;
    if (role === 'PUBLIC_VISITOR') {
      alert('Please switch to a Registered User or Verified Contributor role to save bookmarks to your workspace.');
      return;
    }
    setIsBookmarkLoading(true);
    try {
      const res = await apiClient.toggleBookmark({
        contentType: 'COMPANY',
        objectId: company.id,
        title: company.name,
        subtitle: company.industry,
        link: `/companies/${company.slug}`,
      });
      setIsBookmarked(res.bookmarked);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading company recruitment intelligence..." className="py-24" />;
  }

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Company not found"
          description="We could not find intelligence records for the requested company slug."
          action={
            <Link to="/companies">
              <Button variant="primary">Return to Directory</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const selectedDrive = drives.find((d) => d.recruitmentYear === selectedYear) || drives[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Companies Directory', path: '/companies' },
          { label: company.name },
        ]}
      />

      {/* Company Profile Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700 font-extrabold text-2xl sm:text-3xl shrink-0 shadow-xs">
              {company.name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {company.name}
                </h1>
                <Badge
                  variant={
                    company.averageInterviewDifficulty === 'HARD'
                      ? 'danger'
                      : company.averageInterviewDifficulty === 'MEDIUM'
                      ? 'warning'
                      : 'success'
                  }
                  size="md"
                >
                  {company.averageInterviewDifficulty} Difficulty
                </Badge>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600">{company.industry}</p>

              {company.headquarters && (
                <p className="text-xs text-slate-400">Headquarters: {company.headquarters}</p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <Button
              variant={isBookmarked ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleBookmarkToggle}
              isLoading={isBookmarkLoading}
              leftIcon={
                isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )
              }
            >
              {isBookmarked ? 'Bookmarked' : 'Save to Workspace'}
            </Button>

            {company.careersUrl && (
              <a
                href={company.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-btn cp-btn-primary text-xs gap-1.5"
              >
                <span>Careers Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Corporate Overview */}
        <p className="text-xs sm:text-sm text-slate-700 mt-6 leading-relaxed max-w-4xl border-t border-slate-100 pt-4">
          {company.overview}
        </p>

        {/* Aggregate Placement Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total DAU Campus Drives</span>
            <strong className="text-base text-slate-900 font-bold">{company.totalHistoricalDrives} Cycles</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Average Difficulty</span>
            <strong className="text-base text-slate-900 font-bold">{company.averageInterviewDifficulty}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Alumni Culture Rating</span>
            <strong className="text-base text-amber-600 font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {company.alumniOverallRating ?? '4.2'} / 5.0
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Community Experiences</span>
            <strong className="text-base text-slate-900 font-bold">{experiences.length} Logs</strong>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          {
            id: 'DRIVES',
            label: 'Campus Drives & Selection Process',
            count: drives.length,
            icon: <Layers className="w-4 h-4" />,
          },
          {
            id: 'EXPERIENCES',
            label: 'Interview Experiences',
            count: experiences.length,
            icon: <FileText className="w-4 h-4" />,
          },
          {
            id: 'REVIEWS',
            label: 'Alumni Company Reviews',
            count: reviews.length,
            icon: <Star className="w-4 h-4" />,
          },
          {
            id: 'RESOURCES',
            label: 'Preparation Resources',
            count: resources.length,
            icon: <BookOpen className="w-4 h-4" />,
          },
        ]}
      />

      {/* TAB 1: Campus Drives & Selection Process */}
      {activeTab === 'DRIVES' && (
        <div className="space-y-6">
          {/* Year Selector */}
          {drives.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Recruitment Cycle:</span>
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                {drives.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedYear(d.recruitmentYear)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      selectedYear === d.recruitmentYear
                        ? 'bg-white text-brand-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    DAU {d.recruitmentYear}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDrive ? (
            <div className="space-y-6">
              {/* Drive Details Bar */}
              <div className="cp-card p-5 bg-white border border-slate-200 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <h3 className="font-bold text-base text-slate-900">
                      DAU {selectedDrive.recruitmentYear} Recruitment Cycle Intel
                    </h3>
                  </div>
                  {selectedDrive.driveDate && (
                    <span className="text-xs text-slate-500 font-medium">
                      Conducted: {selectedDrive.driveDate}
                    </span>
                  )}
                </div>

                {/* Eligibility Summary */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Eligibility Criteria & Academic Prerequisites
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                    {selectedDrive.eligibilitySummary}
                  </p>
                </div>

                {/* Job Roles & Compensation Information */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Offered Job Roles & Compensation Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDrive.jobRoles.map((role) => (
                      <div
                        key={role.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-sm text-slate-900 font-bold">{role.title}</strong>
                          <Badge variant="brand" size="sm">
                            {role.roleType.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-2 pt-1">
                          {role.totalCtc && (
                            <span className="text-xs text-slate-700">
                              Total CTC: <strong className="text-sm font-bold text-emerald-700">₹{(role.totalCtc / 100000).toFixed(1)} LPA</strong>
                            </span>
                          )}
                          {role.baseSalary && (
                            <span className="text-[11px] text-slate-500">
                              (Base: ₹{(role.baseSalary / 100000).toFixed(1)} LPA)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ordered Selection Rounds Timeline (Rule 2) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-600" />
                    Ordered Selection Process Timeline ({selectedDrive.selectionRounds.length} Rounds)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Sequence Continuity: 1..{selectedDrive.selectionRounds.length}
                  </span>
                </div>

                <SelectionRoundTimeline rounds={selectedDrive.selectionRounds} />
              </div>
            </div>
          ) : (
            <EmptyState
              title="No drive information"
              description="Historical selection records for this year are currently being digitized."
            />
          )}
        </div>
      )}

      {/* TAB 2: Interview Experiences */}
      {activeTab === 'EXPERIENCES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Candidate Interview Logs for {company.name} ({experiences.length})
            </h3>
            <Link to="/contribute">
              <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Share Your Experience
              </Button>
            </Link>
          </div>

          {experiences.length === 0 ? (
            <EmptyState
              title="No interview experiences yet"
              description="Be the first DAU student or alumnus to document this company's interview rounds!"
              action={
                <Link to="/contribute">
                  <Button variant="primary" size="sm">
                    Submit Interview Experience
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} showCompanyLink={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Alumni Company Reviews */}
      {activeTab === 'REVIEWS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Alumni Workplace Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted by verified DAU alumni with declared corporate employment.
              </p>
            </div>
            <Link to="/contribute">
              <Button variant="secondary" size="sm">
                Submit Company Review
              </Button>
            </Link>
          </div>

          {reviews.length === 0 ? (
            <EmptyState
              title="No company reviews logged yet"
              description="Are you a DAU alumnus working at this company? Share honest workplace insights with active students."
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="cp-card p-6 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {rev.author.stablePseudonym}
                      </span>
                      <Badge variant="brand" size="sm" icon={<ShieldCheck className="w-3 h-3 text-purple-700" />}>
                        {rev.author.affiliationLabel}
                      </Badge>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {rev.jobRoleFamily.replace('_', ' ')} • {rev.tenureBand.replace(/_/g, ' ')} ({rev.employmentStatus.replace('_', ' ')})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{rev.ratingOverall} / 5.0</span>
                    </div>
                  </div>

                  {/* Sub-dimension ratings */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-center">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Work-Life Balance</span>
                      <strong className="text-slate-800">{rev.ratingWlb} / 5</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Engineering Culture</span>
                      <strong className="text-slate-800">{rev.ratingCulture} / 5</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Career Growth</span>
                      <strong className="text-slate-800">{rev.ratingGrowth} / 5</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <strong className="text-emerald-700 font-semibold block mb-0.5">Pros:</strong>
                      <p className="text-slate-700 leading-relaxed">{rev.pros}</p>
                    </div>

                    <div>
                      <strong className="text-rose-700 font-semibold block mb-0.5">Cons:</strong>
                      <p className="text-slate-700 leading-relaxed">{rev.cons}</p>
                    </div>

                    {rev.advice && (
                      <div className="pt-2">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Advice to Students:
                        </strong>
                        <p className="text-slate-700 leading-relaxed">{rev.advice}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Preparation Resources */}
      {activeTab === 'RESOURCES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Targeted Preparation Guides for {company.name}
            </h3>
            <Link to="/resources">
              <Button variant="outline" size="sm">
                View All Guides
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length > 0
              ? resources.map((res) => <ResourceCard key={res.id} resource={res} />)
              : DEMO_RESOURCES.slice(0, 2).map((res) => (
                  <ResourceCard key={res.id} resource={res} />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};
