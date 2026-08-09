export type UserRole = 'user' | 'judge' | 'admin';

export type CompetitionStatus = 'active' | 'upcoming' | 'judging' | 'results_published' | 'closed';

export type SubmissionStatus = 
  | 'submitted' 
  | 'under_ai_review' 
  | 'shortlisted' 
  | 'judge_review' 
  | 'winner' 
  | 'not_selected';

export type WinnerRank = '1st_place' | '2nd_place' | '3rd_place' | 'honorable_mention';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  verified: boolean;
  competitionCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  location?: string;
  specialty?: string[];
  portfolioUrl?: string;
  instagram?: string;
  joinedDate: string;
  stats: {
    competitionsEntered: number;
    submissionsCount: number;
    shortlistsCount: number;
    winsCount: number;
  };
  cameraGear?: {
    body?: string;
    favoriteLens?: string;
  };
}

export interface Judge {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  bio: string;
  expertise: string[];
  assignedCompetitionIds: string[];
  reviewsCompleted: number;
  totalAssignedReviews: number;
  status: 'active' | 'busy' | 'inactive';
  rating?: number;
  joinedDate: string;
}

export interface ScoreCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage, e.g. 25 for 25%
  maxScore: number; // e.g. 25
}

export interface Prize {
  rank: WinnerRank;
  title: string;
  cashAmount?: number;
  perks: string[];
}

export interface CompetitionGuidelines {
  maxFileSizeMB: number;
  allowedFormats: string[];
  minResolution: string;
  maxSubmissionsPerUser: number;
  rules: string[];
  eligibility: string[];
}

export interface CompetitionTimeline {
  registrationOpen: string;
  submissionDeadline: string;
  aiEvaluationComplete: string;
  judgingDeadline: string;
  resultsAnnouncement: string;
}

export interface Competition {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantLogo: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  bannerImage?: string;
  status: CompetitionStatus;
  prizePool: string;
  totalPrizeValue: number;
  prizes: Prize[];
  timeline: CompetitionTimeline;
  guidelines: CompetitionGuidelines;
  criteria: ScoreCriterion[];
  submissionCount: number;
  judgeIds: string[];
  featured?: boolean;
  sponsor?: string;
}

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  location?: string;
  captureDate?: string;
}

export interface AiEvaluation {
  overallScore: number; // 0-100
  isShortlisted: boolean;
  rank: number;
  status: 'pending' | 'completed';
  breakdown: {
    composition: number;
    technicalQuality: number;
    sharpness: number;
    colorHarmony: number;
    creativityEstimate: number;
  };
  tags: string[];
  analyzedAt: string;
}

export interface JudgeCriterionScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
}

export interface JudgeReview {
  judgeId: string;
  judgeName: string;
  judgeAvatar: string;
  judgeTitle?: string;
  reviewedAt: string;
  criterionScores: JudgeCriterionScore[];
  totalScore: number;
  comments: string;
  feedbackCategory?: string;
}

export interface Submission {
  id: string;
  competitionId: string;
  competitionTitle: string;
  tenantName: string;
  userId: string;
  photographerName: string;
  photographerAvatar: string;
  photographerLocation?: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  submittedAt: string;
  status: SubmissionStatus;
  exif: ExifData;
  aiEvaluation: AiEvaluation;
  judgeReviews: JudgeReview[];
  finalJudgeScore?: number;
  finalRank?: number;
  winnerRank?: WinnerRank;
  likesCount: number;
  viewsCount: number;
}

export interface Photo {
  id: string;
  title: string;
  photographerName: string;
  photographerAvatar: string;
  competitionTitle: string;
  competitionId: string;
  imageUrl: string;
  category: string;
  likes: number;
  views: number;
  award?: string;
  exif: ExifData;
  description: string;
}

export interface WinnerRecord {
  id: string;
  submissionId: string;
  competitionId: string;
  competitionTitle: string;
  competitionCategory: string;
  rank: WinnerRank;
  rankTitle: string;
  photoTitle: string;
  photoUrl: string;
  photographerName: string;
  photographerAvatar: string;
  photographerLocation: string;
  finalScore: number;
  aiScore: number;
  prizeAmount: string;
  year: number;
  quote?: string;
  exif: ExifData;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'submission' | 'ai_review' | 'judging' | 'award' | 'deadline' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface FilterOptions {
  category?: string;
  status?: CompetitionStatus | 'all';
  search?: string;
  sortBy?: 'newest' | 'prize' | 'deadline' | 'submissions';
}
