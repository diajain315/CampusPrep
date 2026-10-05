import React from 'react';
import { Clock, Layers, CheckCircle, FileCode, Users, Briefcase } from 'lucide-react';
import { SelectionRound, RoundType, Difficulty } from '@/types';
import { Badge } from '@/components/ui/Badge';

export interface SelectionRoundTimelineProps {
  rounds: SelectionRound[];
}

export const SelectionRoundTimeline: React.FC<SelectionRoundTimelineProps> = ({ rounds }) => {
  // Sort strictly by contiguous round_number
  const sortedRounds = [...rounds].sort((a, b) => a.roundNumber - b.roundNumber);

  const roundTypeIcons: Record<RoundType, React.ReactNode> = {
    ONLINE_ASSESSMENT: <FileCode className="w-4 h-4 text-brand-600" />,
    CODING_TEST: <FileCode className="w-4 h-4 text-purple-600" />,
    GROUP_DISCUSSION: <Users className="w-4 h-4 text-amber-600" />,
    TECHNICAL_INTERVIEW: <Layers className="w-4 h-4 text-emerald-600" />,
    HR_INTERVIEW: <Briefcase className="w-4 h-4 text-slate-600" />,
    HYBRID: <CheckCircle className="w-4 h-4 text-indigo-600" />,
  };

  const difficultyVariants: Record<Difficulty, 'success' | 'warning' | 'danger'> = {
    EASY: 'success',
    MEDIUM: 'warning',
    HARD: 'danger',
  };

  if (sortedRounds.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
        Selection rounds are being configured by the placement intelligence team.
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {sortedRounds.map((round) => (
        <div key={round.id} className="relative group">
          {/* Round Indicator Node (Round 1..N) */}
          <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-brand-600 text-brand-700 flex items-center justify-center text-xs font-bold shadow-xs">
            {round.roundNumber}
          </div>

          <div className="cp-card p-4 sm:p-5 bg-white border border-slate-200/90 rounded-xl hover:border-brand-200 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-100">{roundTypeIcons[round.roundType]}</span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Round {round.roundNumber}: {round.roundName}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={difficultyVariants[round.difficulty]} size="sm">
                  {round.difficulty}
                </Badge>
                {round.durationMinutes && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {round.durationMinutes} mins
                  </span>
                )}
              </div>
            </div>

            {round.description && (
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{round.description}</p>
            )}

            {round.topicsAssessed && round.topicsAssessed.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Core Topics Evaluated:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {round.topicsAssessed.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
