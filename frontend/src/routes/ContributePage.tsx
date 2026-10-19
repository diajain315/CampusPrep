import React, { useState } from 'react';
import { FileText, Star, BookOpen, PlusCircle, Building2 } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContributeExperienceForm } from '@/features/contributions/ContributeExperienceForm';
import { ContributeReviewForm } from '@/features/contributions/ContributeReviewForm';
import { ContributeResourceForm } from '@/features/contributions/ContributeResourceForm';
import { ProposeCompanyModal } from '@/features/contributions/ProposeCompanyModal';

export const ContributePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EXPERIENCE' | 'REVIEW' | 'RESOURCE'>('EXPERIENCE');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Contribute Intelligence' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PlusCircle className="w-7 h-7 text-brand-600" />
            Contribute Placement Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empower your juniors and peers with structured, verified recruitment insights.
          </p>
        </div>

        <button
          onClick={() => setIsProposeModalOpen(true)}
          className="text-xs text-brand-600 hover:text-brand-800 font-semibold underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Propose New Company</span>
        </button>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          {
            id: 'EXPERIENCE',
            label: 'Interview Experience (Candidates)',
            icon: <FileText className="w-4 h-4" />,
          },
          {
            id: 'REVIEW',
            label: 'Company Review (Alumni Contributor Only)',
            icon: <Star className="w-4 h-4" />,
          },
          {
            id: 'RESOURCE',
            label: 'Preparation Resource',
            icon: <BookOpen className="w-4 h-4" />,
          },
        ]}
      />

      <div className="cp-card p-6 sm:p-8 border border-slate-200 bg-white">
        {activeTab === 'EXPERIENCE' && <ContributeExperienceForm />}
        {activeTab === 'REVIEW' && <ContributeReviewForm />}
        {activeTab === 'RESOURCE' && <ContributeResourceForm />}
      </div>

      {/* Propose Company Modal */}
      <ProposeCompanyModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
      />
    </div>
  );
};
