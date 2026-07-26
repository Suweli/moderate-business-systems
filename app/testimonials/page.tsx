import { DEFAULT_TESTIMONIAL_PAGE_SIZE, readApprovedTestimonialsPage } from '../../lib/testimonials-db';
import TestimonialsClientPage from './testimonials-client-page';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const initialData = await readApprovedTestimonialsPage(1, DEFAULT_TESTIMONIAL_PAGE_SIZE);

  return <TestimonialsClientPage initialData={initialData} />;
}
