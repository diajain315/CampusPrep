import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Flag,
  Share2,
  ThumbsUp,
  Building2,
} from 'lucide-react';
import { InterviewExperience, CandidateOutcome } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ExperienceDetailsModal } from './ExperienceDetailsModal';
import { ReportContentModal } from './ReportContentModal';

export interface ExperienceCardProps {
  experience: InterviewExperience;
  showCompanyLink?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  showCompanyLink = true,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [upvotes, setUpvotes] = useState(experience.upvotesCount || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const outcomeVariants: Record<
    CandidateOutcome,
    { variant: 'success' | 'danger' | 'warning'; icon: React.ReactNode; label: string }
  > = {
    OFFERED: {
      variant: 'success',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
      label: 'Offer Extended',
    },
    REJECTED: {
      variant: 'danger',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-700" />,
      label: 'Did Not Receive Offer',
    },
    WITHDREW: {
      variant: 'warning',
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-700" />,
      label: 'Candidate Withdrew',
    },
  };

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const outcomeInfo = outcomeVariants[experience.candidateOutcome];

  return (
    <>
      <div className="cp-card p-5 sm:p-6 transition-all duration-200 hover:border-slate-300">
        {/* Header: Author Public Display Identity & Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
              {experience.author.stablePseudonym.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                  {experience.author.stablePseudonym}
                </span>
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-700" />}>
                  {experience.author.affiliationLabel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                <span>Recruitment Cycle: <strong>{experience.recruitmentYear}</strong></span>
                <span>•</span>
                <span>DAU Campus Drive</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {showCompanyLink && (
              <Link
                to={`/companies/${experience.companySlug}`}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{experience.companyName}</span>
              </Link>
            )}
            <Badge variant={outcomeInfo.variant} size="md" icon={outcomeInfo.icon}>
              {outcomeInfo.label}
            </Badge>
          </div>
        </div>

        {/* Overall Experience summary */}
        <div className="mt-4 space-y-2">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {experience.overallExperience}
          </p>

          {experience.preparationTips && (
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 text-xs text-slate-700 mt-3">
              <strong className="text-slate-900 font-semibold block mb-1">
                Preparation Strategy & Key Advice:
              </strong>
              {experience.preparationTips}
            </div>
          )}
        </div>

        {/* Selection Rounds Accordion / Preview */}
        {experience.roundDetails && experience.roundDetails.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                {experience.roundDetails.length} Selection Rounds Logged:
              </span>
              <button
                onClick={() => setDetailsOpen(true)}
                className="text-brand-600 hover:text-brand-800 font-semibold underline"
              >
                View Detailed Questions
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {experience.roundDetails.slice(0, 2).map((round) => (
                <div
                  key={round.id}
                  onClick={() => setDetailsOpen(true)}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs hover:border-brand-300 cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-slate-800 block truncate">
                    Round {round.roundNumber}: {round.roundName}
                  </span>
                  <p className="text-slate-500 line-clamp-1 mt-0.5 text-[11px]">
                    {round.questionsAsked}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions: Upvote, Report */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                hasUpvoted ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-brand-600 text-brand-600' : ''}`} />
              <span>Helpful ({upvotes})</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Experience link copied to clipboard!');
              }}
              className="flex items-center gap-1 hover:text-slate-800 p-1"
              title="Copy share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors p-1"
            title="Report NDA, Privacy, or Accuracy issues"
          >
            <Flag className="w-3 h-3" />
            <span className="text-[11px]">Report</span>
          </button>
        </div>
      </div>

      {/* Full Interview Experience Details Modal */}
      <ExperienceDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        experience={experience}
      />

      {/* Report Modal */}
      <ReportContentModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetContentType="INTERVIEW_EXPERIENCE"
        targetObjectId={experience.id}
        targetTitle={`${experience.companyName} Experience by ${experience.author.stablePseudonym}`}
      />
    </>
  );
};
