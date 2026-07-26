export type PublicTestimonial = {
  id: number;
  name: string;
  company: string;
  position: string;
  email?: string;
  testimonial: string;
  rating: number;
  date: string;
  avatar: string;
  approved?: boolean;
  createdAt?: string;
  updatedAt?: string;
  industry?: string;
};

export type DashboardStats = {
  averageRating: number;
  totalReviews: number;
  recommendationRate: number;
  ratingDistribution: Array<{ rating: number; percent: number; count: number }>;
};

export type ApprovedTestimonialsPage = {
  items: PublicTestimonial[];
  page: number;
  limit: number;
  hasMore: boolean;
  stats: DashboardStats;
};
