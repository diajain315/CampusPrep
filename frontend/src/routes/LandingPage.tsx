import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  FileText,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { DEMO_COMPANIES, DEMO_EXPERIENCES, DEMO_RESOURCES } from '@/fixtures';
import { CompanyCard } from '@/features/companies/CompanyCard';
import { ExperienceCard } from '@/features/experiences/ExperienceCard';
import { ResourceCard } from '@/features/resources/ResourceCard';
import { ProposeCompanyModal } from '@/features/contributions/ProposeCompanyModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/companies?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/companies');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-navy-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Centralized Placement Intelligence for <span className="text-brand-400">DAU Campus Drives</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate duplicate research and institutional memory decay. Explore historical recruitment cycles, ordered selection processes, exact interview questions, and alumni workplace ratings.
          </p>

          {/* Quick Search Entry */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/15 shadow-2xl">
              <div className="flex-1">
                <SearchInput
                  value={heroSearch}
                  onChange={setHeroSearch}
                  placeholder="Search by company (e.g. Sprinklr, Morgan Stanley, Oracle)..."
                  className="w-full text-slate-900"
                />
              </div>
              <Button type="submit" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Intel
              </Button>
            </div>
          </form>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="font-medium text-slate-300">Popular DAU Recruiters:</span>
            {DEMO_COMPANIES.slice(0, 4).map((comp) => (
              <Link
                key={comp.id}
                to={`/companies/${comp.slug}`}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-colors"
              >
                {comp.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Academic Platform Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-brand-600 font-bold text-xl sm:text-2xl">
              <Building2 className="w-5 h-5" />
              <span>45+</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Recruiting Companies</p>
            <p className="text-[11px] text-slate-500">Historical DAU placement partners</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xl sm:text-2xl">
              <Layers className="w-5 h-5" />
              <span>100% Contiguous</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Selection Processes</p>
            <p className="text-[11px] text-slate-500">Contiguous 1..N Selection Round sequences</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xl sm:text-2xl">
              <ShieldCheck className="w-5 h-5" />
              <span>Zero PII Leaks</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Stable Pseudonyms</p>
            <p className="text-[11px] text-slate-500">Protected author identity</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xl sm:text-2xl">
              <Award className="w-5 h-5" />
              <span>IT643 Baseline</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Rigorous Testing</p>
            <p className="text-[11px] text-slate-500">Software Design & Testing</p>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-600" />
              DAU Recruiting Companies
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore step-by-step selection timelines and compensation packages from recent campus recruitment cycles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProposeModalOpen(true)}
              className="text-xs text-slate-600 hover:text-slate-900 underline font-medium"
            >
              Propose New Company
            </button>
            <Link to="/companies">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Companies
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_COMPANIES.slice(0, 3).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      {/* Recent Interview Experiences Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              Structured Interview Experiences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified logs from candidate interview rounds, detailing coding problems asked and solution approaches.
            </p>
          </div>
          <Link to="/experiences">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Browse All Experiences
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DEMO_EXPERIENCES.slice(0, 2).map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </section>

      {/* Preparation Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              Curated Preparation Resources
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Alumni-validated DSA sheets, system design guides, and core subject interview handbooks.
            </p>
          </div>
          <Link to="/resources">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore Resources
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_RESOURCES.slice(0, 3).map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </section>

      {/* Product Boundary Notice Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-slate-100/90 rounded-2xl border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-xs uppercase font-bold text-brand-800 tracking-wider">
                Product Boundary & Academic Scope
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Placement Intelligence & Peer Preparation — NOT an ATS
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CampusPrep preserves institutional placement memory to help DAU students prepare efficiently during short 48–72 hour drive announcement windows. It does not handle student job applications, interview scheduling, or resume submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/workspace">
              <Button variant="primary" size="md">
                Open Personal Workspace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Propose Company Modal */}
      <ProposeCompanyModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
      />
    </div>
  );
};
