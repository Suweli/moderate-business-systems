import { promises as fs } from 'node:fs';
import path from 'node:path';

export type StoredTestimonial = {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  testimonial: string;
  rating: number;
  date: string;
  avatar: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
};

type TestimonialStore = {
  nextId: number;
  testimonials: StoredTestimonial[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'testimonials.json');

const EMPTY_STORE: TestimonialStore = { nextId: 1, testimonials: [] };

function isServerlessProduction() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

function isFilesystemError(error: unknown) {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }

  const code = String((error as { code?: unknown }).code || '');
  return ['EROFS', 'EACCES', 'EPERM', 'ENOENT'].includes(code);
}

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    const initial: TestimonialStore = { nextId: 1, testimonials: [] };
    await fs.writeFile(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

export async function readStore(): Promise<TestimonialStore> {
  try {
    await ensureStoreFile();
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as TestimonialStore;
    if (!parsed.nextId || !Array.isArray(parsed.testimonials)) {
      return EMPTY_STORE;
    }
    return parsed;
  } catch (error) {
    if (isServerlessProduction() && isFilesystemError(error)) {
      console.warn('[testimonials-store] File storage unavailable in serverless production. Falling back to empty in-memory store. Configure DATABASE_URL for persistent testimonials.');
      return EMPTY_STORE;
    }

    throw error;
  }
}

export async function writeStore(store: TestimonialStore) {
  try {
    await ensureStoreFile();
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (error) {
    if (isServerlessProduction() && isFilesystemError(error)) {
      throw new Error('Persistent testimonial storage is unavailable in this deployment. Set DATABASE_URL to enable PostgreSQL-backed storage.');
    }

    throw error;
  }
}

export function initialsFromName(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
  return initials || 'MB';
}

export function formatMonthYear(dateISO: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(dateISO));
}

export async function readApprovedTestimonialsPage(pageInput: number, limitInput: number) {
  const page = Number.isFinite(pageInput) ? Math.max(1, Math.trunc(pageInput)) : 1;
  const limit = Number.isFinite(limitInput) ? Math.min(Math.max(1, Math.trunc(limitInput)), 24) : 6;

  const store = await readStore();
  const approved = store.testimonials
    .filter((item) => item.approved)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const start = (page - 1) * limit;
  const items = approved.slice(start, start + limit);
  const hasMore = start + limit < approved.length;
  const totalReviews = approved.length;
  const averageRating = totalReviews
    ? Number((approved.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1))
    : 0;

  return {
    items,
    page,
    limit,
    hasMore,
    stats: {
      averageRating,
      totalReviews,
    },
  };
}
