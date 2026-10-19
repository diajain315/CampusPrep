import React from 'react';
import { ShieldCheck, Calendar, Layers, Code, CheckCircle, HelpCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { InterviewExperience } from '@/types';

export interface ExperienceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: InterviewExperience;
}

export const ExperienceDetailsModal: React.FC<ExperienceDetailsModalProps> = ({
  isOpen,
  onClose,
  experience,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${experience.companyName} — Interview Experience`}
      description={`Recruitment Cycle: ${experience.recruitmentYear} • Author: ${experience.author.stablePseudonym}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Author & Outcome Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-800">
              {experience.author.stablePseudonym}
            </span>
            <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-700" />}>
              {experience.author.affiliationLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Recruitment Cycle: {experience.recruitmentYear}
            </span>
            <Badge
              variant={
                experience.candidateOutcome === 'OFFERED'
                  ? 'success'
                  : experience.candidateOutcome === 'REJECTED'
                  ? 'danger'
                  : 'warning'
              }
              size="sm"
            >
              Outcome: {experience.candidateOutcome}
            </Badge>
          </div>
        </div>

        {/* Overall Experience & Preparation Tips */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Overall Candidate Summary & Strategy
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
            {experience.overallExperience}
          </p>
          {experience.preparationTips && (
            <div className="p-3 bg-brand-50/60 rounded-lg border border-brand-100 text-xs text-brand-950">
              <strong className="block font-semibold mb-1">Key Takeaways & Advice to Juniors:</strong>
              {experience.preparationTips}
            </div>
          )}
        </div>

        {/* Round by Round Questions and Approach */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-600" />
            Selection Round Breakdown ({experience.roundDetails.length} Rounds)
          </h4>

          <div className="space-y-4">
            {experience.roundDetails.map((detail) => (
              <div
                key={detail.id}
                className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">
                    Round {detail.roundNumber}: {detail.roundName}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <Code className="w-3.5 h-3.5 text-brand-600" />
                    Exact Questions & Problems Asked:
                  </span>
                  <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 font-mono whitespace-pre-wrap leading-relaxed">
                    {detail.questionsAsked}
                  </p>
                </div>

                {detail.candidateApproach && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Candidate Approach & Solution Strategy:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {detail.candidateApproach}
                    </p>
                  </div>
                )}

                {detail.topicsCovered && detail.topicsCovered.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {detail.topicsCovered.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 font-medium border border-slate-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Academic Privacy Standard:</strong> Specific submission timestamps are masked to Recruitment Cycle year ({experience.recruitmentYear}) to protect contributor identity from small-cohort re-identification.
          </span>
        </div>
      </div>
    </Modal>
  );
};
