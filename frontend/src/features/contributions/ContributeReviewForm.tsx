import React, { useState } from 'react';
import { Star, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEMO_COMPANIES } from '@/fixtures';
import { EmploymentStatus, JobRoleFamily, TenureBand } from '@/types';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export const ContributeReviewForm: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState(DEMO_COMPANIES[0].id);
  const [ratingOverall, setRatingOverall] = useState(4);
  const [ratingWlb, setRatingWlb] = useState(4);
  const [ratingCulture, setRatingCulture] = useState(4);
  const [ratingGrowth, setRatingGrowth] = useState(4);
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>('CURRENT_EMPLOYEE');
  const [jobRoleFamily, setJobRoleFamily] = useState<JobRoleFamily>('SOFTWARE_ENGINEER');
  const [tenureBand, setTenureBand] = useState<TenureBand>('ONE_TO_TWO_YEARS');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [advice, setAdvice] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isAlumniQualified =
    role === 'ALUMNI_CONTRIBUTOR' || role === 'MODERATOR' || role === 'ADMINISTRATOR';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAlumniQualified) {
      setErrorMsg(
        'Company Reviews are restricted to verified Alumni Contributors with declared employment context.'
      );
      return;
    }

    if (!pros.trim() || !cons.trim()) {
      setErrorMsg('Please provide both pros and cons regarding the engineering workplace.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const company = DEMO_COMPANIES.find((c) => c.id === selectedCompanyId)!;

    try {
      await apiClient.submitCompanyReview({
        companyId: company.id,
        companyName: company.name,
        author: {
          stablePseudonym: currentUser?.stablePseudonym || 'AlumEngineer_92',
          affiliationLabel: 'DAU Alumni (declared)',
        },
        ratingOverall,
        ratingWlb,
        ratingCulture,
        ratingGrowth,
        employmentStatus,
        jobRoleFamily,
        tenureBand,
        pros: pros.trim(),
        cons: cons.trim(),
        advice: advice.trim() || undefined,
        recruitmentYear: new Date().getFullYear(),
      });
      setSubmitted(true);
    } catch {
      setErrorMsg('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAlumniQualified) {
    return (
      <div className="cp-card p-8 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Alumni Qualification Required</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with the <strong>Alumni Company Review Policy</strong>, workplace assessments require an approved <em>Alumni Qualification Declaration</em> confirming graduation and professional employment experience. Please switch your persona to <strong>Alumni Contributor</strong> in the navbar to test this form.
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
        <h3 className="text-xl font-bold text-slate-900">Company Review Submitted</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your alumni workplace review has entered the pre-publication queue (Status: <code>PENDING</code>). Once cleared by moderators, it will be published with your Stable Pseudonym and <em>DAU Alumni (declared)</em> badge.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-900 leading-relaxed">
          <strong className="font-semibold block">Alumni Grounded Review:</strong>
          Submitted under declared employment context with Stable Pseudonym <code className="font-mono font-bold">{currentUser?.stablePseudonym}</code>.
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Status</label>
          <select
            value={employmentStatus}
            onChange={(e) => setEmploymentStatus(e.target.value as EmploymentStatus)}
            className="cp-select text-xs font-medium"
            required
          >
            <option value="CURRENT_EMPLOYEE">Current Employee</option>
            <option value="FORMER_EMPLOYEE">Former Employee</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role Family</label>
          <select
            value={jobRoleFamily}
            onChange={(e) => setJobRoleFamily(e.target.value as JobRoleFamily)}
            className="cp-input text-xs"
          >
            <option value="SOFTWARE_ENGINEER">Software Engineer</option>
            <option value="DATA_ENGINEER">Data Engineer</option>
            <option value="QA_ENGINEER">QA Engineer</option>
            <option value="PRODUCT">Product</option>
            <option value="DESIGN">Design</option>
            <option value="DEVOPS_SRE">DevOps / SRE</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tenure Band</label>
          <select
            value={tenureBand}
            onChange={(e) => setTenureBand(e.target.value as TenureBand)}
            className="cp-input text-xs"
          >
            <option value="LESS_THAN_ONE_YEAR">&lt; 1 year</option>
            <option value="ONE_TO_TWO_YEARS">1-2 years</option>
            <option value="THREE_TO_FIVE_YEARS">3-5 years</option>
            <option value="MORE_THAN_FIVE_YEARS">5+ years</option>
          </select>
        </div>
      </div>

      {/* Ratings Sliders / Selectors */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Workplace Evaluation Ratings (1 to 5 Stars)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingOverall(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= ratingOverall ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work-Life Balance</label>
            <select
              value={ratingWlb}
              onChange={(e) => setRatingWlb(Number(e.target.value))}
              className="cp-select text-xs bg-white"
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Demanding</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Engineering Culture</label>
            <select
              value={ratingCulture}
              onChange={(e) => setRatingCulture(Number(e.target.value))}
              className="cp-select text-xs bg-white"
            >
              <option value={5}>5 - High Autonomy & Rigor</option>
              <option value={4}>4 - Collaborative</option>
              <option value={3}>3 - Moderate</option>
              <option value={2}>2 - Bureaucratic</option>
              <option value={1}>1 - Chaotic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Career Growth</label>
            <select
              value={ratingGrowth}
              onChange={(e) => setRatingGrowth(Number(e.target.value))}
              className="cp-select text-xs bg-white"
            >
              <option value={5}>5 - Fast-track promotions</option>
              <option value={4}>4 - Solid learning curve</option>
              <option value={3}>3 - Moderate growth</option>
              <option value={2}>2 - Slow progression</option>
              <option value={1}>1 - Stagnant</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Engineering & Workplace Pros
        </label>
        <textarea
          rows={3}
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          placeholder="Highlight positive aspects (e.g. system architecture scale, mentorship, compensation)..."
          required
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Workplace Cons & Challenges
        </label>
        <textarea
          rows={3}
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          placeholder="Constructive feedback regarding pressure, release cycles, or tooling..."
          required
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Advice to DAU Students Preparing for this Company (Optional)
        </label>
        <textarea
          rows={2}
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          placeholder="Which technical foundations are most valued on the job?"
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="submit" variant="primary" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Submit Company Review
        </Button>
      </div>
    </form>
  );
};
