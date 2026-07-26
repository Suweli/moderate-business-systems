import { readStore, writeStore } from './testimonials-store';

export type ModerationAction = 'approve' | 'reject';

type ModerationResult = {
  ok: boolean;
  status: number;
  message: string;
};

export async function moderateTestimonialById(
  id: number,
  action: ModerationAction,
): Promise<ModerationResult> {
  const store = await readStore();
  const index = store.testimonials.findIndex((item) => item.id === id);

  if (index === -1) {
    return { ok: false, status: 404, message: 'Testimonial not found.' };
  }

  if (action === 'reject') {
    store.testimonials.splice(index, 1);
    await writeStore(store);
    return { ok: true, status: 200, message: 'Testimonial rejected and removed.' };
  }

  store.testimonials[index] = {
    ...store.testimonials[index],
    approved: true,
    updatedAt: new Date().toISOString(),
  };

  await writeStore(store);
  return { ok: true, status: 200, message: 'Testimonial approved and published.' };
}
