import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  GitPullRequest,
  CheckCircle,
  XCircle,
  EyeOff,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { ContentReport, ContentRevision } from '@/types';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ModerationDashboard: React.FC = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'REVISIONS' | 'PENDING'>('REPORTS');
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [loading, setLoading] = useState(true);

  const isStaff = role === 'MODERATOR' || role === 'ADMINISTRATOR';

  useEffect(() => {
    if (!isStaff) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedReports, fetchedRevisions] = await Promise.all([
          apiClient.getModerationReports(),
          apiClient.getModerationRevisions(),
        ]);
        setReports(fetchedReports);
        setRevisions(fetchedRevisions);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isStaff]);

  const handleResolveReport = async (reportId: string, action: 'SUPPRESS' | 'DISMISS') => {
    await apiClient.resolveContentReport(reportId, action);
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action === 'SUPPRESS' ? 'RESOLVED_SUPPRESSED' : 'RESOLVED_DISMISSED',
            }
          : r
      )
    );
  };

  const handleResolveRevision = async (revisionId: string, action: 'MERGE' | 'DISCARD') => {
    await apiClient.resolveContentRevision(revisionId, action);
    setRevisions((prev) =>
      prev.map((r) =>
        r.id === revisionId
          ? {
              ...r,
              status: action === 'MERGE' ? 'MERGED' : 'DISCARDED',
            }
          : r
      )
    );
  };

  if (!isStaff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="cp-card p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Moderator Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Content Moderation Queue & Triage workspace is restricted to accounts with <strong>Moderator</strong> or <strong>Administrator</strong> privileges.
          </p>
          <p className="text-xs text-slate-500">
            Use the <strong>Interactive RBAC Persona Switcher</strong> in the top-right navbar to switch to <em>Moderator</em>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Loading moderation queue..." className="py-20" />;
  }

  const pendingReportsCount = reports.filter((r) => r.status === 'PENDING_REVIEW').length;
  const pendingRevisionsCount = revisions.filter((r) => r.status === 'PENDING_REVISION').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Moderation Center</h1>
            <Badge variant="warning" size="sm">
              Staff Only
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-publication review, risk-aware report triage, and edit revision merging for DAU intelligence
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {pendingReportsCount} Reports Pending
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold flex items-center gap-1.5">
            <GitPullRequest className="w-4 h-4 text-blue-600" />
            {pendingRevisionsCount} Edit Revisions
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          {
            id: 'REPORTS',
            label: 'Community Content Reports',
            count: pendingReportsCount,
            icon: <AlertTriangle className="w-4 h-4" />,
          },
          {
            id: 'REVISIONS',
            label: 'Content Revisions (Approved Decision 3)',
            count: pendingRevisionsCount,
            icon: <GitPullRequest className="w-4 h-4" />,
          },
          {
            id: 'PENDING',
            label: 'Pre-Publication Queue',
            count: 1,
            icon: <Clock className="w-4 h-4" />,
          },
        ]}
      />

      {/* Tab 1: Risk-Aware Content Reports Queue (Issue 1) */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-900 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <strong>Risk-Aware Publication Visibility Policy (Issue 1 Enforced):</strong> Reports flagged as <span className="font-semibold text-rose-700">URGENT</span> (Privacy/PII leaks, Harassment, NDA violation, Copyright) trigger immediate public suppression and escalate to <code>UNDER_REVIEW</code>. Ordinary reports remain visible during triage unless safety thresholds are reached.
            </div>
          </div>

          {reports.length === 0 ? (
            <EmptyState title="No content reports" description="All reported content has been triaged." />
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const isUrgent = report.severity === 'URGENT';
                const isResolved = report.status !== 'PENDING_REVIEW';

                return (
                  <div
                    key={report.id}
                    className={`cp-card p-5 border transition-all ${
                      isUrgent && !isResolved ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={isUrgent ? 'danger' : 'warning'} size="md">
                          {report.severity} RISK
                        </Badge>
                        <span className="font-semibold text-xs text-slate-800">
                          {report.reason.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          Target: <strong className="text-slate-700">{report.targetTitle}</strong>
                        </span>
                      </div>

                      <div className="text-xs text-slate-400">
                        Reported by: <span className="font-mono text-slate-600 font-medium">{report.reporterPseudonym}</span> • {report.createdAt}
                      </div>
                    </div>

                    <div className="py-3 text-xs text-slate-700 leading-relaxed">
                      <strong className="block text-slate-800 mb-1">Report Details & Allegation:</strong>
                      {report.details || 'No additional details supplied by reporter.'}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        {report.status === 'PENDING_REVIEW' ? (
                          <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Status: Awaiting Moderator Triage
                          </span>
                        ) : report.status === 'RESOLVED_SUPPRESSED' ? (
                          <span className="text-xs text-rose-700 font-semibold flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5" />
                            Action Taken: Suppressed & Moved to UNDER_REVIEW
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Action Taken: Dismissed (Content restored to APPROVED)
                          </span>
                        )}
                      </div>

                      {report.status === 'PENDING_REVIEW' && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleResolveReport(report.id, 'DISMISS')}
                          >
                            Dismiss Report
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<EyeOff className="w-3.5 h-3.5" />}
                            onClick={() => handleResolveReport(report.id, 'SUPPRESS')}
                          >
                            Confirm & Suppress (UNDER_REVIEW)
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Content Revisions (Approved Decision 3 & Issue 5) */}
      {activeTab === 'REVISIONS' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Re-Moderation Loop on Edits (Approved Decision 3 Enforced):</strong> When an author modifies live content, the original approved record remains discoverable to students. Changes spawn an un-published <code>ContentRevision</code> draft in <code>PENDING_REVISION</code>. Merging updates the live record; discarding preserves the original unchanged.
            </div>
          </div>

          {revisions.length === 0 ? (
            <EmptyState title="No pending revisions" description="All author revisions have been processed." />
          ) : (
            <div className="space-y-4">
              {revisions.map((rev) => (
                <div key={rev.id} className="cp-card p-5 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rev.targetTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Author: <strong className="font-mono text-slate-800">{rev.author.stablePseudonym}</strong> • Submitted: {rev.submittedAt}
                      </p>
                    </div>

                    <Badge
                      variant={
                        rev.status === 'PENDING_REVISION'
                          ? 'warning'
                          : rev.status === 'MERGED'
                          ? 'success'
                          : 'danger'
                      }
                      size="md"
                    >
                      {rev.status}
                    </Badge>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                    <strong>Author Revision Summary:</strong> {rev.changeSummary}
                  </div>

                  {/* Side by side diff preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg">
                      <span className="font-bold text-rose-800 block mb-1">
                        Current Live Record (APPROVED):
                      </span>
                      <pre className="font-mono text-[11px] whitespace-pre-wrap text-slate-700 bg-white p-2 rounded border border-rose-100">
                        {JSON.stringify(rev.originalData, null, 2)}
                      </pre>
                    </div>

                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                      <span className="font-bold text-emerald-800 block mb-1">
                        Proposed Revision (PENDING_REVISION):
                      </span>
                      <pre className="font-mono text-[11px] whitespace-pre-wrap text-slate-700 bg-white p-2 rounded border border-emerald-100">
                        {JSON.stringify(rev.revisedData, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {rev.status === 'PENDING_REVISION' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        onClick={() => handleResolveRevision(rev.id, 'DISCARD')}
                      >
                        Discard Revision (Keep Live Record)
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CheckCircle className="w-3.5 h-3.5 text-white" />}
                        onClick={() => handleResolveRevision(rev.id, 'MERGE')}
                      >
                        Approve & Merge into Live
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Pre-Publication Queue */}
      {activeTab === 'PENDING' && (
        <div className="space-y-4">
          <div className="cp-card p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">
                Oracle 2024 Technical Round Summary
              </span>
              <Badge variant="warning" size="sm">
                PENDING REVIEW
              </Badge>
            </div>
            <p className="text-xs text-slate-600">
              Submitted by <span className="font-mono font-semibold">DatabaseNinja_04</span> for Oracle Campus Drive 2024. Waiting for NDA & accuracy verification before publication.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm">
                Request Edits
              </Button>
              <Button variant="primary" size="sm">
                Approve & Publish (APPROVED)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
