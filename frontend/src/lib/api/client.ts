/**
 * Central API Client Boundary for Campus Placement Intelligence Platform.
 * Features consume this typed interface.
 * Defaults to the Development Data Adapter until VITE_USE_LIVE_API is enabled.
 */
import { developmentAdapter } from './adapter';
import {
  Company,
  CampusDrive,
  InterviewExperience,
  CompanyReview,
  PreparationResource,
  PreparationTask,
  Bookmark,
  ContentRevision,
  ContentReport,
} from '@/types';

export const apiClient = {
  // Companies
  getCompanies: (query?: string, industry?: string): Promise<Company[]> =>
    developmentAdapter.getCompanies(query, industry),

  getCompanyBySlug: (slug: string): Promise<Company | null> =>
    developmentAdapter.getCompanyBySlug(slug),

  // Drives
  getDrivesByCompany: (companySlug: string): Promise<CampusDrive[]> =>
    developmentAdapter.getDrivesByCompany(companySlug),

  getAllDrives: (): Promise<CampusDrive[]> =>
    developmentAdapter.getAllDrives(),

  // Interview Experiences
  getInterviewExperiences: (filters?: {
    companySlug?: string;
    recruitmentYear?: number;
    candidateOutcome?: string;
    searchQuery?: string;
  }): Promise<InterviewExperience[]> =>
    developmentAdapter.getInterviewExperiences(filters),

  submitInterviewExperience: (payload: Omit<InterviewExperience, 'id' | 'status' | 'upvotesCount'>): Promise<InterviewExperience> =>
    developmentAdapter.submitInterviewExperience(payload),

  // Reviews
  getCompanyReviews: (companyId?: string): Promise<CompanyReview[]> =>
    developmentAdapter.getCompanyReviews(companyId),

  submitCompanyReview: (payload: Omit<CompanyReview, 'id' | 'status'>): Promise<CompanyReview> =>
    developmentAdapter.submitCompanyReview(payload),

  // Preparation Resources
  getResources: (topic?: string, search?: string): Promise<PreparationResource[]> =>
    developmentAdapter.getResources(topic, search),

  submitPreparationResource: (payload: Omit<PreparationResource, 'id' | 'status'>): Promise<PreparationResource> =>
    developmentAdapter.submitPreparationResource(payload),

  // Personal Workspace
  getWorkspaceTasks: (): Promise<PreparationTask[]> =>
    developmentAdapter.getWorkspaceTasks(),

  toggleTaskCompletion: (taskId: string): Promise<PreparationTask | null> =>
    developmentAdapter.toggleTaskCompletion(taskId),

  createPreparationTask: (task: { title: string; targetDate?: string; companyName?: string }): Promise<PreparationTask> =>
    developmentAdapter.createPreparationTask(task),

  deletePreparationTask: (taskId: string): Promise<boolean> =>
    developmentAdapter.deletePreparationTask(taskId),

  getBookmarks: (): Promise<Bookmark[]> =>
    developmentAdapter.getBookmarks(),

  toggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'userId'>): Promise<{ bookmarked: boolean }> =>
    developmentAdapter.toggleBookmark(bookmark),

  isBookmarked: (contentType: Bookmark['contentType'], objectId: string): Promise<boolean> =>
    developmentAdapter.isBookmarked(contentType, objectId),

  // Moderation
  getModerationRevisions: (): Promise<ContentRevision[]> =>
    developmentAdapter.getModerationRevisions(),

  getModerationReports: (): Promise<ContentReport[]> =>
    developmentAdapter.getModerationReports(),

  submitContentReport: (report: Omit<ContentReport, 'id' | 'status' | 'createdAt'>): Promise<ContentReport> =>
    developmentAdapter.submitContentReport(report),

  resolveContentReport: (reportId: string, action: 'SUPPRESS' | 'DISMISS'): Promise<boolean> =>
    developmentAdapter.resolveContentReport(reportId, action),

  resolveContentRevision: (revisionId: string, action: 'MERGE' | 'DISCARD'): Promise<boolean> =>
    developmentAdapter.resolveContentRevision(revisionId, action),
};
