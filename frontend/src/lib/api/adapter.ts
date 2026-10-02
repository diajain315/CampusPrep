/**
 * Development Data Adapter for Campus Placement Intelligence Platform.
 * Provides typed, asynchronous data access using local development fixtures.
 * Persists interactive user mutations (Tasks, Bookmarks) to localStorage.
 * Cleanly decoupled so it can be swapped for a live Django REST Framework API.
 */
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
import {
  DEMO_COMPANIES,
  DEMO_DRIVES,
  DEMO_EXPERIENCES,
  DEMO_REVIEWS,
  DEMO_RESOURCES,
  DEMO_INITIAL_TASKS,
  DEMO_INITIAL_BOOKMARKS,
  DEMO_MODERATION_ITEMS,
} from '@/fixtures';

const TASKS_STORAGE_KEY = 'campusprep_demo_tasks';
const BOOKMARKS_STORAGE_KEY = 'campusprep_demo_bookmarks';
const EXPERIENCES_STORAGE_KEY = 'campusprep_demo_experiences';
const REVIEWS_STORAGE_KEY = 'campusprep_demo_reviews';
const RESOURCES_STORAGE_KEY = 'campusprep_demo_resources';
const REPORTS_STORAGE_KEY = 'campusprep_demo_reports';
const REVISIONS_STORAGE_KEY = 'campusprep_demo_revisions';

// Helper to simulate network latency for authentic UI loading states
const delay = (ms = 80): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to persist ${key} to localStorage:`, err);
  }
}

export class DevelopmentDataAdapter {
  // --- Companies ---
  async getCompanies(query?: string, industry?: string): Promise<Company[]> {
    await delay();
    let result = [...DEMO_COMPANIES];
    if (query) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.overview.toLowerCase().includes(q)
      );
    }
    if (industry && industry !== 'ALL') {
      result = result.filter((c) => c.industry.toLowerCase().includes(industry.toLowerCase()));
    }
    return result;
  }

  async getCompanyBySlug(slug: string): Promise<Company | null> {
    await delay();
    return DEMO_COMPANIES.find((c) => c.slug === slug) || null;
  }

  // --- Campus Drives ---
  async getDrivesByCompany(companySlug: string): Promise<CampusDrive[]> {
    await delay();
    return DEMO_DRIVES.filter((d) => d.companySlug === companySlug);
  }

  async getAllDrives(): Promise<CampusDrive[]> {
    await delay();
    return [...DEMO_DRIVES];
  }

  // --- Interview Experiences ---
  async getInterviewExperiences(filters?: {
    companySlug?: string;
    recruitmentYear?: number;
    candidateOutcome?: string;
    searchQuery?: string;
  }): Promise<InterviewExperience[]> {
    await delay();
    const stored = getStoredItem<InterviewExperience[]>(EXPERIENCES_STORAGE_KEY, DEMO_EXPERIENCES);
    let result = stored.filter((exp) => exp.status === 'APPROVED' || exp.status === 'REPORTED');

    if (filters?.companySlug) {
      result = result.filter((exp) => exp.companySlug === filters.companySlug);
    }
    if (filters?.recruitmentYear) {
      result = result.filter((exp) => exp.recruitmentYear === filters.recruitmentYear);
    }
    if (filters?.candidateOutcome && filters.candidateOutcome !== 'ALL') {
      result = result.filter((exp) => exp.candidateOutcome === filters.candidateOutcome);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.companyName.toLowerCase().includes(q) ||
          exp.overallExperience.toLowerCase().includes(q) ||
          exp.roundDetails.some(
            (r) =>
              r.questionsAsked.toLowerCase().includes(q) ||
              r.topicsCovered.some((t) => t.toLowerCase().includes(q))
          )
      );
    }
    return result;
  }

  async submitInterviewExperience(payload: Omit<InterviewExperience, 'id' | 'status' | 'upvotesCount'>): Promise<InterviewExperience> {
    await delay(150);
    const newExperience: InterviewExperience = {
      ...payload,
      id: `exp-${Date.now()}`,
      status: 'PENDING', // Submissions enter pre-publication moderation queue
      upvotesCount: 0,
    };
    const stored = getStoredItem<InterviewExperience[]>(EXPERIENCES_STORAGE_KEY, DEMO_EXPERIENCES);
    setStoredItem(EXPERIENCES_STORAGE_KEY, [newExperience, ...stored]);
    return newExperience;
  }

  // --- Company Reviews ---
  async getCompanyReviews(companyId?: string): Promise<CompanyReview[]> {
    await delay();
    const stored = getStoredItem<CompanyReview[]>(REVIEWS_STORAGE_KEY, DEMO_REVIEWS);
    let result = stored.filter((r) => r.status === 'APPROVED');
    if (companyId) {
      result = result.filter((r) => r.companyId === companyId);
    }
    return result;
  }

  async submitCompanyReview(payload: Omit<CompanyReview, 'id' | 'status'>): Promise<CompanyReview> {
    await delay(150);
    const newReview: CompanyReview = {
      ...payload,
      id: `rev-${Date.now()}`,
      status: 'PENDING',
    };
    const stored = getStoredItem<CompanyReview[]>(REVIEWS_STORAGE_KEY, DEMO_REVIEWS);
    setStoredItem(REVIEWS_STORAGE_KEY, [newReview, ...stored]);
    return newReview;
  }

  // --- Preparation Resources ---
  async getResources(topic?: string, search?: string): Promise<PreparationResource[]> {
    await delay();
    const stored = getStoredItem<PreparationResource[]>(RESOURCES_STORAGE_KEY, DEMO_RESOURCES);
    let result = stored.filter((r) => r.status === 'APPROVED');
    if (topic && topic !== 'ALL') {
      result = result.filter((r) => r.topic.toLowerCase() === topic.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  async submitPreparationResource(payload: Omit<PreparationResource, 'id' | 'status'>): Promise<PreparationResource> {
    await delay(150);
    const newRes: PreparationResource = {
      ...payload,
      id: `res-${Date.now()}`,
      status: 'APPROVED', // Resources use post-publication moderation
    };
    const stored = getStoredItem<PreparationResource[]>(RESOURCES_STORAGE_KEY, DEMO_RESOURCES);
    setStoredItem(RESOURCES_STORAGE_KEY, [newRes, ...stored]);
    return newRes;
  }

  // --- Personal Workspace: Tasks ---
  async getWorkspaceTasks(): Promise<PreparationTask[]> {
    await delay();
    return getStoredItem<PreparationTask[]>(TASKS_STORAGE_KEY, DEMO_INITIAL_TASKS);
  }

  async toggleTaskCompletion(taskId: string): Promise<PreparationTask | null> {
    await delay(50);
    const tasks = getStoredItem<PreparationTask[]>(TASKS_STORAGE_KEY, DEMO_INITIAL_TASKS);
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    setStoredItem(TASKS_STORAGE_KEY, updated);
    return updated.find((t) => t.id === taskId) || null;
  }

  async createPreparationTask(task: { title: string; targetDate?: string; companyName?: string }): Promise<PreparationTask> {
    await delay(80);
    const newTask: PreparationTask = {
      id: `task-${Date.now()}`,
      userId: 'user-demo',
      title: task.title,
      targetDate: task.targetDate,
      companyName: task.companyName,
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const tasks = getStoredItem<PreparationTask[]>(TASKS_STORAGE_KEY, DEMO_INITIAL_TASKS);
    setStoredItem(TASKS_STORAGE_KEY, [newTask, ...tasks]);
    return newTask;
  }

  async deletePreparationTask(taskId: string): Promise<boolean> {
    await delay(50);
    const tasks = getStoredItem<PreparationTask[]>(TASKS_STORAGE_KEY, DEMO_INITIAL_TASKS);
    const filtered = tasks.filter((t) => t.id !== taskId);
    setStoredItem(TASKS_STORAGE_KEY, filtered);
    return true;
  }

  // --- Personal Workspace: Bookmarks ---
  async getBookmarks(): Promise<Bookmark[]> {
    await delay();
    return getStoredItem<Bookmark[]>(BOOKMARKS_STORAGE_KEY, DEMO_INITIAL_BOOKMARKS);
  }

  async toggleBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'userId'>): Promise<{ bookmarked: boolean }> {
    await delay(60);
    const bookmarks = getStoredItem<Bookmark[]>(BOOKMARKS_STORAGE_KEY, DEMO_INITIAL_BOOKMARKS);
    const existingIndex = bookmarks.findIndex(
      (b) => b.contentType === bookmark.contentType && b.objectId === bookmark.objectId
    );

    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
      setStoredItem(BOOKMARKS_STORAGE_KEY, bookmarks);
      return { bookmarked: false };
    } else {
      const newBookmark: Bookmark = {
        ...bookmark,
        id: `bm-${Date.now()}`,
        userId: 'user-demo',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setStoredItem(BOOKMARKS_STORAGE_KEY, [newBookmark, ...bookmarks]);
      return { bookmarked: true };
    }
  }

  async isBookmarked(contentType: Bookmark['contentType'], objectId: string): Promise<boolean> {
    const bookmarks = getStoredItem<Bookmark[]>(BOOKMARKS_STORAGE_KEY, DEMO_INITIAL_BOOKMARKS);
    return bookmarks.some((b) => b.contentType === contentType && b.objectId === objectId);
  }

  // --- Moderation Operations ---
  async getModerationRevisions(): Promise<ContentRevision[]> {
    await delay();
    return getStoredItem<ContentRevision[]>(REVISIONS_STORAGE_KEY, DEMO_MODERATION_ITEMS.revisions);
  }

  async getModerationReports(): Promise<ContentReport[]> {
    await delay();
    return getStoredItem<ContentReport[]>(REPORTS_STORAGE_KEY, DEMO_MODERATION_ITEMS.reports);
  }

  async submitContentReport(report: Omit<ContentReport, 'id' | 'status' | 'createdAt'>): Promise<ContentReport> {
    await delay(100);
    const newReport: ContentReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const reports = getStoredItem<ContentReport[]>(REPORTS_STORAGE_KEY, DEMO_MODERATION_ITEMS.reports);
    setStoredItem(REPORTS_STORAGE_KEY, [newReport, ...reports]);
    return newReport;
  }

  async resolveContentReport(reportId: string, action: 'SUPPRESS' | 'DISMISS'): Promise<boolean> {
    await delay(100);
    const reports = getStoredItem<ContentReport[]>(REPORTS_STORAGE_KEY, DEMO_MODERATION_ITEMS.reports);
    const updated = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status: (action === 'SUPPRESS' ? 'RESOLVED_SUPPRESSED' : 'RESOLVED_DISMISSED') as ContentReport['status'],
          }
        : r
    );
    setStoredItem(REPORTS_STORAGE_KEY, updated);
    return true;
  }

  async resolveContentRevision(revisionId: string, action: 'MERGE' | 'DISCARD'): Promise<boolean> {
    await delay(100);
    const revisions = getStoredItem<ContentRevision[]>(REVISIONS_STORAGE_KEY, DEMO_MODERATION_ITEMS.revisions);
    const updated = revisions.map((r) =>
      r.id === revisionId
        ? {
            ...r,
            status: (action === 'MERGE' ? 'MERGED' : 'DISCARDED') as ContentRevision['status'],
          }
        : r
    );
    setStoredItem(REVISIONS_STORAGE_KEY, updated);
    return true;
  }
}

export const developmentAdapter = new DevelopmentDataAdapter();
