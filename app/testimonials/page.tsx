import { DEFAULT_TESTIMONIAL_PAGE_SIZE, readApprovedTestimonialsPage } from '../../lib/testimonials-db';
import TestimonialsClientPage from './testimonials-client-page';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const initialData = await readApprovedTestimonialsPage(1, DEFAULT_TESTIMONIAL_PAGE_SIZE).catch(() => ({
    items: [],
    page: 1,
    limit: DEFAULT_TESTIMONIAL_PAGE_SIZE,
    hasMore: false,
    stats: {
      averageRating: 0,
      totalReviews: 0,
      recommendationRate: 0,
      ratingDistribution: [
        { rating: 5, percent: 0, count: 0 },
        { rating: 4, percent: 0, count: 0 },
        { rating: 3, percent: 0, count: 0 },
        { rating: 2, percent: 0, count: 0 },
        { rating: 1, percent: 0, count: 0 },
      ],
    },
  }));

  return <TestimonialsClientPage initialData={initialData} />;
}
