import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ReportReason, ReportSeverity } from '@/types';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetContentType: 'INTERVIEW_EXPERIENCE' | 'COMPANY_REVIEW' | 'RESOURCE';
  targetObjectId: string;
  targetTitle: string;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  targetContentType,
  targetObjectId,
  targetTitle,
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState<ReportReason>('INACCURATE_INFORMATION');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Risk categorization as defined in Issue 1
  const urgentReasons: ReportReason[] = [
    'PRIVACY_VIOLATION',
    'HARASSMENT',
    'LEGAL_OR_NDA_VIOLATION',
    'COPYRIGHT_INFRINGEMENT',
  ];

  const isUrgent = urgentReasons.includes(reason);
  const severity: ReportSeverity = isUrgent ? 'URGENT' : 'ORDINARY';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.submitContentReport({
        reporterPseudonym: currentUser?.stablePseudonym || 'CommunityReporter',
        targetContentType,
        targetObjectId,
        targetTitle,
        reason,
        severity,
        details,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit report', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDetails('');
    setReason('INACCURATE_INFORMATION');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report Content to Moderation Team"
      description={`Reporting: ${targetTitle}`}
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Report Submitted</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            {isUrgent ? (
              <span className="text-rose-700 font-medium">
                Your report has been flagged as <strong>URGENT ({reason})</strong>. Public visibility has been immediately suppressed while a moderator investigates.
              </span>
            ) : (
              <span>
                Thank you for helping keep DAU placement intelligence accurate. Your report has been dispatched to the moderation queue for triage.
              </span>
            )}
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="report-reason" className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Reason for Report
            </label>
            <select
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="cp-select text-xs font-medium"
              required
            >
              <optgroup label="Urgent / Safety & Legal Flags (Immediate Suppression)">
                <option value="PRIVACY_VIOLATION">Privacy / PII Violation (Doxxing, real name exposed)</option>
                <option value="LEGAL_OR_NDA_VIOLATION">Confidentiality / NDA Breach (Proprietary questions)</option>
                <option value="HARASSMENT">Harassment / Abusive Content</option>
                <option value="COPYRIGHT_INFRINGEMENT">Copyright / Intellectual Property Infringement</option>
              </optgroup>
              <optgroup label="Standard Quality & Community Flags">
                <option value="INACCURATE_INFORMATION">Inaccurate / Fabricated Information</option>
                <option value="OUTDATED_CONTENT">Outdated / Broken Links or Info</option>
                <option value="FORMATTING_OR_QUALITY">Poor Formatting / Low Quality Content</option>
                <option value="OTHER">Other Issue</option>
              </optgroup>
            </select>
          </div>

          {/* Risk Notification Banner */}
          {isUrgent ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Risk-Aware Urgent Escalation:</strong>
                Submitting a {reason} report immediately suppresses public visibility to protect contributor privacy and safety while undergoing moderator review.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-xs text-slate-600">
              <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                Standard reports remain visible in community search during triage unless multiple distinct community reports trigger the safety review threshold.
              </div>
            </div>
          )}

          <div>
            <label htmlFor="report-details" className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Specific Details (Optional)
            </label>
            <textarea
              id="report-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide specific context to assist the moderators in evaluating this report..."
              className="cp-input text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isUrgent ? 'danger' : 'primary'}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
