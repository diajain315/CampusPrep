import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CandidateOutcome, RoundInterviewDetail } from '@/types';
import { DEMO_COMPANIES, DEMO_DRIVES } from '@/fixtures';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export const ContributeExperienceForm: React.FC = () => {
  const navigate = useNavigate();
  const { role, currentUser } = useAuth();

  const [selectedCompanyId, setSelectedCompanyId] = useState(DEMO_COMPANIES[0].id);
  const [selectedDriveId, setSelectedDriveId] = useState(DEMO_DRIVES[0].id);
  const [outcome, setOutcome] = useState<CandidateOutcome>('OFFERED');
  const [overallSummary, setOverallSummary] = useState('');
  const [prepTips, setPrepTips] = useState('');

  // Structured round details (questions asked per round)
  const [roundDetails, setRoundDetails] = useState<
    Omit<RoundInterviewDetail, 'id'>[]
  >([
    {
      selectionRoundId: 'round-1',
      roundNumber: 1,
      roundName: 'Online Assessment',
      questionsAsked: '',
      candidateApproach: '',
      topicsCovered: ['Data Structures'],
    },
    {
      selectionRoundId: 'round-2',
      roundNumber: 2,
      roundName: 'Technical Interview 1',
      questionsAsked: '',
      candidateApproach: '',
      topicsCovered: ['Algorithms'],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isVerified =
    role === 'VERIFIED_CONTRIBUTOR' ||
    role === 'ALUMNI_CONTRIBUTOR' ||
    role === 'MODERATOR' ||
    role === 'ADMINISTRATOR';

  const handleAddRound = () => {
    const nextRoundNumber = roundDetails.length + 1;
    setRoundDetails([
      ...roundDetails,
      {
        selectionRoundId: `round-${Date.now()}`,
        roundNumber: nextRoundNumber,
        roundName: `Technical Interview ${nextRoundNumber - 1}`,
        questionsAsked: '',
        candidateApproach: '',
        topicsCovered: [],
      },
    ]);
  };

  const handleRemoveRound = (index: number) => {
    if (roundDetails.length <= 1) return;
    const updated = roundDetails
      .filter((_, idx) => idx !== index)
      .map((r, i) => ({ ...r, roundNumber: i + 1 })); // Re-sequence to 1..N
    setRoundDetails(updated);
  };

  const handleUpdateRound = (
    index: number,
    field: keyof Omit<RoundInterviewDetail, 'id'>,
    value: unknown
  ) => {
    const updated = [...roundDetails];
    updated[index] = { ...updated[index], [field]: value };
    setRoundDetails(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      setErrorMsg('Rule 1 Violation: You must possess a verified @dau.ac.in institutional account to submit interview intelligence.');
      return;
    }

    if (!overallSummary.trim()) {
      setErrorMsg('Please provide an overall summary of the interview experience.');
      return;
    }

    const company = DEMO_COMPANIES.find((c) => c.id === selectedCompanyId)!;
    const drive = DEMO_DRIVES.find((d) => d.id === selectedDriveId) || DEMO_DRIVES[0];

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await apiClient.submitInterviewExperience({
        campusDriveId: drive.id,
        companyId: company.id,
        companyName: company.name,
        companySlug: company.slug,
        recruitmentYear: drive.recruitmentYear,
        author: {
          stablePseudonym: currentUser?.stablePseudonym || 'FalconCoder_87',
          affiliationLabel: 'Institution-verified email',
        },
        candidateOutcome: outcome,
        overallExperience: overallSummary.trim(),
        preparationTips: prepTips.trim() || undefined,
        roundDetails: roundDetails.map((r, i) => ({
          ...r,
          id: `detail-${Date.now()}-${i}`,
        })),
      });
      setSubmitted(true);
    } catch {
      setErrorMsg('Failed to submit experience. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="cp-card p-8 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Institutional Verification Required</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with <strong>Rule 1 (Institutional Verification Barrier)</strong>, unverified users cannot submit interview experiences. Please switch your persona to <em>Verified Contributor</em> in the top-right navbar or verify your @dau.ac.in email.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="cp-card p-10 text-center max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Submitted for Moderation</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your interview experience has been queued in <strong>Pre-publication Moderation</strong> (Status: <code>PENDING</code>). Once verified against NDA and quality guidelines by a student placement moderator, it will be indexed publicly.
        </p>
        <div className="flex justify-center gap-3 pt-3">
          <Button variant="secondary" onClick={() => setSubmitted(false)}>
            Submit Another
          </Button>
          <Button variant="primary" onClick={() => navigate('/experiences')}>
            Browse Experiences
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Privacy Notice Card */}
      <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-900 leading-relaxed">
          <strong className="font-semibold block">Public Identity Protection:</strong>
          This log will be signed with your Stable Pseudonym <code className="font-mono font-bold">{currentUser?.stablePseudonym}</code> and badge <span className="bg-white/80 px-1.5 py-0.5 rounded text-emerald-800 font-medium">Institution-verified email</span>. Your real name, student ID, and specific submission timestamp are completely excluded.
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Target Company & Outcome Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Company Name
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="cp-select text-xs font-medium"
            required
          >
            {DEMO_COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Campus Drive Cycle
          </label>
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="cp-select text-xs font-medium"
            required
          >
            <option value="drive-1">DAU 2025 Placement Cycle</option>
            <option value="drive-2">DAU 2024 Placement Cycle</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Candidate Outcome
          </label>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as CandidateOutcome)}
            className="cp-select text-xs font-medium"
            required
          >
            <option value="OFFERED">Offer Received</option>
            <option value="REJECTED">Did Not Receive Offer</option>
            <option value="WITHDREW">Candidate Withdrew</option>
          </select>
        </div>
      </div>

      {/* Overall Experience */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Overall Interview Summary & Key Takeaways
        </label>
        <textarea
          rows={3}
          value={overallSummary}
          onChange={(e) => setOverallSummary(e.target.value)}
          placeholder="Summarize the overall tone, interview atmosphere, and key recommendations..."
          required
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      {/* Preparation Tips */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Specific Preparation Advice (Optional)
        </label>
        <textarea
          rows={2}
          value={prepTips}
          onChange={(e) => setPrepTips(e.target.value)}
          placeholder="Which resources, LeetCode sheets, or textbooks helped you prepare best?"
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      {/* Selection Rounds Breakdown */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-600" />
            Detailed Selection Round Questions ({roundDetails.length} Rounds)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRound}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Round
          </Button>
        </div>

        <div className="space-y-4">
          {roundDetails.map((round, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Round {round.roundNumber} Configuration
                </span>
                {roundDetails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRound(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Round Name / Stage
                  </label>
                  <input
                    type="text"
                    value={round.roundName}
                    onChange={(e) => handleUpdateRound(idx, 'roundName', e.target.value)}
                    placeholder="e.g. Technical Interview 1"
                    className="cp-input text-xs bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Core Topics Covered (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={round.topicsCovered.join(', ')}
                    onChange={(e) =>
                      handleUpdateRound(
                        idx,
                        'topicsCovered',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    placeholder="e.g. Dynamic Programming, Trees, Operating Systems"
                    className="cp-input text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Questions Asked / Coding Problems Encountered
                </label>
                <textarea
                  rows={2}
                  value={round.questionsAsked}
                  onChange={(e) => handleUpdateRound(idx, 'questionsAsked', e.target.value)}
                  placeholder="Describe the exact algorithmic questions, system design problems, or behavioral questions asked..."
                  required
                  className="cp-input text-xs bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Your Approach & Solution (Optional)
                </label>
                <textarea
                  rows={2}
                  value={round.candidateApproach || ''}
                  onChange={(e) => handleUpdateRound(idx, 'candidateApproach', e.target.value)}
                  placeholder="How did you structure your answer? What time/space complexity did you achieve?"
                  className="cp-input text-xs bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="secondary" onClick={() => navigate('/experiences')}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Submit Experience for Review
        </Button>
      </div>
    </form>
  );
};
