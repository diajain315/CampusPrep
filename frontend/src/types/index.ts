/**
 * Ubiquitous Language Domain Types for Campus Placement Intelligence Platform.
 * Aligned with PROJECT_CONTEXT.md and UBIQUITOUS_LANGUAGE.md.
 */

export type UserRole =
  | 'PUBLIC_VISITOR'
  | 'REGISTERED_USER'
  | 'VERIFIED_CONTRIBUTOR'
  | 'ALUMNI_CONTRIBUTOR'
  | 'MODERATOR'
  | 'ADMINISTRATOR';

export type PublicationStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'REMOVED';

export type RevisionStatus =
  | 'PENDING_REVISION'
  | 'MERGED'
  | 'DISCARDED';

export type RoundType =
  | 'ONLINE_ASSESSMENT'
  | 'CODING_TEST'
  | 'GROUP_DISCUSSION'
  | 'TECHNICAL_INTERVIEW'
  | 'HR_INTERVIEW'
  | 'HYBRID';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type CandidateOutcome = 'OFFERED' | 'REJECTED' | 'WITHDREW';

export type EmploymentStatus = 'CURRENT_EMPLOYEE' | 'FORMER_EMPLOYEE';

export type ReportSeverity = 'URGENT' | 'ORDINARY';

export type ReportReason =
  | 'PRIVACY_VIOLATION'
  | 'HARASSMENT'
  | 'LEGAL_OR_NDA_VIOLATION'
  | 'COPYRIGHT_INFRINGEMENT'
  | 'INACCURATE_INFORMATION'
  | 'FORMATTING_OR_QUALITY'
  | 'OUTDATED_CONTENT'
  | 'OTHER';

export interface PublicAuthor {
  stablePseudonym: string;
  affiliationLabel: 'Institution-verified email' | 'DAU Alumni (declared)';
}

export interface University {
  id: string;
  name: string;
  slug: string;
  emailDomain: string; // 'dau.ac.in'
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string;
  headquarters?: string;
  websiteUrl?: string;
  careersUrl?: string;
  logoUrl?: string;
  overview: string;
  totalHistoricalDrives: number;
  averageInterviewDifficulty: Difficulty;
  alumniOverallRating?: number; // 1 to 5
}

export interface JobRole {
  id: string;
  campusDriveId: string;
  title: string;
  roleType: 'FULL_TIME' | 'INTERNSHIP' | 'PPO';
  baseSalary?: number;
  totalCtc?: number;
  currency: string;
}

export interface SelectionRound {
  id: string;
  campusDriveId: string;
  roundNumber: number; // 1-based contiguous sequence
  roundName: string;
  roundType: RoundType;
  difficulty: Difficulty;
  durationMinutes?: number;
  topicsAssessed: string[];
  description?: string;
}

export interface CampusDrive {
  id: string;
  universityId: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  recruitmentYear: number; // e.g. 2024, 2025
  eligibilitySummary: string;
  status: PublicationStatus;
  jobRoles: JobRole[];
  selectionRounds: SelectionRound[];
  driveDate?: string;
}

export interface RoundInterviewDetail {
  id: string;
  selectionRoundId: string;
  roundNumber: number;
  roundName: string;
  questionsAsked: string;
  candidateApproach?: string;
  topicsCovered: string[];
}

export interface InterviewExperience {
  id: string;
  campusDriveId: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  recruitmentYear: number; // Displayed instead of submission timestamp to protect author privacy
  author: PublicAuthor;
  candidateOutcome: CandidateOutcome;
  overallExperience: string;
  preparationTips?: string;
  status: PublicationStatus;
  roundDetails: RoundInterviewDetail[];
  upvotesCount?: number;
}

export type JobRoleFamily =
  | 'SOFTWARE_ENGINEER'
  | 'DATA_ENGINEER'
  | 'QA_ENGINEER'
  | 'PRODUCT'
  | 'DESIGN'
  | 'DEVOPS_SRE'
  | 'OTHER';

export type TenureBand =
  | 'LESS_THAN_ONE_YEAR'
  | 'ONE_TO_TWO_YEARS'
  | 'THREE_TO_FIVE_YEARS'
  | 'MORE_THAN_FIVE_YEARS';

export interface CompanyReview {
  id: string;
  companyId: string;
  companyName: string;
  author: PublicAuthor;
  ratingOverall: number; // 1 to 5
  ratingWlb: number;
  ratingCulture: number;
  ratingGrowth: number;
  employmentStatus: EmploymentStatus;
  jobRoleFamily: JobRoleFamily;
  tenureBand: TenureBand;
  pros: string;
  cons: string;
  advice?: string;
  status: PublicationStatus;
  recruitmentYear: number;
}

export interface PreparationResource {
  id: string;
  title: string;
  url: string;
  topic: string; // e.g. 'Data Structures & Algorithms', 'System Design', 'Operating Systems', 'DBMS'
  description: string;
  companyId?: string;
  companyName?: string;
  author: PublicAuthor;
  status: PublicationStatus;
  tags: string[];
}

export interface PreparationTask {
  id: string;
  userId: string;
  title: string;
  targetDate?: string;
  isCompleted: boolean;
  campusDriveId?: string;
  companyName?: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  contentType: 'COMPANY' | 'DRIVE' | 'RESOURCE';
  objectId: string;
  title: string;
  subtitle: string;
  link: string;
  createdAt: string;
}

export interface ContentRevision {
  id: string;
  targetContentType: 'INTERVIEW_EXPERIENCE' | 'COMPANY_REVIEW';
  targetObjectId: string;
  targetTitle: string;
  author: PublicAuthor;
  originalData: Record<string, unknown>;
  revisedData: Record<string, unknown>;
  status: RevisionStatus;
  submittedAt: string;
  changeSummary: string;
}

export interface ContentReport {
  id: string;
  reporterPseudonym: string;
  targetContentType: 'INTERVIEW_EXPERIENCE' | 'COMPANY_REVIEW' | 'RESOURCE';
  targetObjectId: string;
  targetTitle: string;
  reason: ReportReason;
  severity: ReportSeverity;
  details?: string;
  status: 'PENDING_REVIEW' | 'RESOLVED_SUPPRESSED' | 'RESOLVED_DISMISSED';
  createdAt: string;
}

export interface AlumniQualificationDeclaration {
  id: string;
  userId: string;
  graduationYear: number;
  degreeProgram: string;
  employerName: string;
  jobTitle: string;
  employmentStartDate: string;
  employmentEndDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  stablePseudonym: string;
  is_verified_contributor: boolean;
  isAlumniQualified: boolean;
  institutionalEmail?: string;
}
