import { dbQuery } from './db';
import { initialsFromName, readStore, writeStore } from './testimonials-store';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export type DbTestimonial = {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  industry: string;
  email: string;
  testimonial: string;
  rating: number;
  status: TestimonialStatus;
  dateSubmitted: string;
  dateApproved: string | null;
  lastUpdated: string;
};

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

export const DEFAULT_TESTIMONIAL_PAGE_SIZE = 6;
export const MAX_TESTIMONIAL_PAGE_SIZE = 24;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}

function clampPage(pageInput: number) {
  return Number.isFinite(pageInput) ? Math.max(1, Math.trunc(pageInput)) : 1;
}

function clampLimit(limitInput: number) {
  return Number.isFinite(limitInput)
    ? Math.min(Math.max(1, Math.trunc(limitInput)), MAX_TESTIMONIAL_PAGE_SIZE)
    : DEFAULT_TESTIMONIAL_PAGE_SIZE;
}

function toMonthYear(dateISO: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(dateISO));
}

function toPublicTestimonial(row: DbTestimonial): PublicTestimonial {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    position: row.jobTitle,
    email: row.email,
    testimonial: row.testimonial,
    rating: row.rating,
    date: toMonthYear(row.dateSubmitted),
    avatar: initialsFromName(row.name),
    approved: row.status === 'approved',
    createdAt: row.dateSubmitted,
    updatedAt: row.lastUpdated,
    industry: row.industry,
  };
}

export async function ensureTestimonialsSchema() {
  if (!hasDatabaseUrl()) {
    return;
  }

  await dbQuery(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      job_title TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL DEFAULT '',
      industry TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      testimonial TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      date_submitted TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      date_approved TIMESTAMPTZ,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await dbQuery(`CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);`);
  await dbQuery(`CREATE INDEX IF NOT EXISTS idx_testimonials_submitted ON testimonials(date_submitted DESC);`);
  await dbQuery(`CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email);`);
}

export async function migrateFromJsonIfNeeded() {
  if (!hasDatabaseUrl()) {
    return;
  }

  await ensureTestimonialsSchema();
  const countRes = await dbQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM testimonials');
  const count = Number(countRes.rows[0]?.count || '0');
  if (count > 0) return;

  // Soft migration from legacy JSON file if present.
  const { readStore } = await import('./testimonials-store');
  const legacy = await readStore().catch(() => ({ testimonials: [] as any[] }));

  for (const item of legacy.testimonials || []) {
    const status: TestimonialStatus = item.approved ? 'approved' : 'pending';
    const submitted = item.createdAt || new Date().toISOString();
    await dbQuery(
      `INSERT INTO testimonials
      (name, job_title, company, industry, email, testimonial, rating, status, date_submitted, date_approved, last_updated)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        String(item.name || ''),
        String(item.position || ''),
        String(item.company || ''),
        String(item.industry || ''),
        String(item.email || ''),
        String(item.testimonial || ''),
        Number(item.rating || 5),
        status,
        submitted,
        status === 'approved' ? submitted : null,
        item.updatedAt || submitted,
      ],
    );
  }
}

async function computeStats(): Promise<DashboardStats> {
  if (!hasDatabaseUrl()) {
    const store = await readStore();
    const ratings = (store.testimonials || [])
      .filter((item: any) => item.approved)
      .map((item: any) => Number(item.rating || 0))
      .filter((value: number) => value >= 1 && value <= 5);

    const totalReviews = ratings.length;
    const averageRating = totalReviews
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / totalReviews).toFixed(1))
      : 0;
    const recommended = ratings.filter((rating) => rating >= 4).length;
    const recommendationRate = totalReviews ? Math.round((recommended / totalReviews) * 100) : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = ratings.filter((value) => value === rating).length;
      const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
      return { rating, percent, count };
    });

    return { averageRating, totalReviews, recommendationRate, ratingDistribution };
  }

  const rows = await dbQuery<{ rating: number }>(
    `SELECT rating FROM testimonials WHERE status = 'approved'`
  );

  const ratings = rows.rows.map((row) => Number(row.rating));
  const totalReviews = ratings.length;
  const averageRating = totalReviews
    ? Number((ratings.reduce((sum, value) => sum + value, 0) / totalReviews).toFixed(1))
    : 0;

  const recommended = ratings.filter((rating) => rating >= 4).length;
  const recommendationRate = totalReviews ? Math.round((recommended / totalReviews) * 100) : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = ratings.filter((value) => value === rating).length;
    const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { rating, percent, count };
  });

  return {
    averageRating,
    totalReviews,
    recommendationRate,
    ratingDistribution,
  };
}

export async function readApprovedTestimonialsPage(pageInput: number, limitInput: number): Promise<ApprovedTestimonialsPage> {
  const page = clampPage(pageInput);
  const limit = clampLimit(limitInput);
  const offset = (page - 1) * limit;

  if (!hasDatabaseUrl()) {
    const store = await readStore();
    const approved = (store.testimonials || [])
      .filter((item: any) => item.approved)
      .sort((a: any, b: any) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));

    const pageItems = approved.slice(offset, offset + limit);
    const hasMore = offset + limit < approved.length;

    const items = pageItems.map((item: any) => ({
      id: Number(item.id),
      name: String(item.name || ''),
      company: String(item.company || ''),
      position: String(item.position || ''),
      email: String(item.email || ''),
      testimonial: String(item.testimonial || ''),
      rating: Number(item.rating || 5),
      date: String(item.date || toMonthYear(item.createdAt || new Date().toISOString())),
      avatar: String(item.avatar || initialsFromName(String(item.name || ''))),
      approved: true,
      createdAt: String(item.createdAt || ''),
      updatedAt: String(item.updatedAt || ''),
      industry: String(item.industry || ''),
    }));

    return {
      items,
      page,
      limit,
      hasMore,
      stats: await computeStats(),
    };
  }

  await migrateFromJsonIfNeeded();

  const rows = await dbQuery<{
    id: number;
    name: string;
    job_title: string;
    company: string;
    industry: string;
    email: string;
    testimonial: string;
    rating: number;
    status: TestimonialStatus;
    date_submitted: string;
    date_approved: string | null;
    last_updated: string;
  }>(
    `SELECT id, name, job_title, company, industry, email, testimonial, rating, status, date_submitted, date_approved, last_updated
     FROM testimonials
     WHERE status = 'approved'
     ORDER BY date_approved DESC NULLS LAST, date_submitted DESC
     LIMIT $1 OFFSET $2`,
    [limit + 1, offset],
  );

  const hasMore = rows.rows.length > limit;
  const pageRows = hasMore ? rows.rows.slice(0, limit) : rows.rows;

  const items = pageRows.map((row) =>
    toPublicTestimonial({
      id: row.id,
      name: row.name,
      jobTitle: row.job_title,
      company: row.company,
      industry: row.industry,
      email: row.email,
      testimonial: row.testimonial,
      rating: row.rating,
      status: row.status,
      dateSubmitted: row.date_submitted,
      dateApproved: row.date_approved,
      lastUpdated: row.last_updated,
    }),
  );

  return {
    items,
    page,
    limit,
    hasMore,
    stats: await computeStats(),
  };
}

export type CreateTestimonialInput = {
  name: string;
  jobTitle: string;
  company: string;
  industry: string;
  email: string;
  testimonial: string;
  rating: number;
};

export async function findRecentDuplicate(email: string, testimonial: string) {
  if (!hasDatabaseUrl()) {
    const store = await readStore();
    const now = Date.now();
    const duplicate = (store.testimonials || []).find((item: any) => {
      const sameEmail = String(item.email || '').toLowerCase() === email.toLowerCase();
      const sameMessage = String(item.testimonial || '').toLowerCase() === testimonial.toLowerCase();
      const createdAt = Date.parse(String(item.createdAt || ''));
      const within30d = Number.isFinite(createdAt) && Math.abs(now - createdAt) < 1000 * 60 * 60 * 24 * 30;
      return sameEmail && sameMessage && within30d;
    });
    return duplicate ? Number(duplicate.id) : null;
  }

  await migrateFromJsonIfNeeded();
  const rows = await dbQuery<{ id: number }>(
    `SELECT id
     FROM testimonials
     WHERE lower(email) = lower($1)
       AND lower(testimonial) = lower($2)
       AND date_submitted > NOW() - INTERVAL '30 days'
     LIMIT 1`,
    [email, testimonial],
  );
  return rows.rows[0]?.id || null;
}

export async function createPendingTestimonial(input: CreateTestimonialInput) {
  if (!hasDatabaseUrl()) {
    const store: any = await readStore();
    const now = new Date().toISOString();
    const id = Number(store.nextId || 1);

    const record: any = {
      id,
      name: input.name,
      position: input.jobTitle,
      company: input.company,
      industry: input.industry,
      email: input.email,
      testimonial: input.testimonial,
      rating: input.rating,
      date: toMonthYear(now),
      avatar: initialsFromName(input.name),
      approved: false,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      dateApproved: null,
    };

    store.nextId = id + 1;
    store.testimonials = [...(store.testimonials || []), record];
    await writeStore(store);

    return {
      id,
      name: input.name,
      jobTitle: input.jobTitle,
      company: input.company,
      industry: input.industry,
      email: input.email,
      testimonial: input.testimonial,
      rating: input.rating,
      status: 'pending' as TestimonialStatus,
      dateSubmitted: now,
      dateApproved: null,
      lastUpdated: now,
    };
  }

  await migrateFromJsonIfNeeded();

  const result = await dbQuery<{
    id: number;
    name: string;
    job_title: string;
    company: string;
    industry: string;
    email: string;
    testimonial: string;
    rating: number;
    status: TestimonialStatus;
    date_submitted: string;
    date_approved: string | null;
    last_updated: string;
  }>(
    `INSERT INTO testimonials
      (name, job_title, company, industry, email, testimonial, rating, status, date_submitted, last_updated)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',NOW(),NOW())
     RETURNING id, name, job_title, company, industry, email, testimonial, rating, status, date_submitted, date_approved, last_updated`,
    [input.name, input.jobTitle, input.company, input.industry, input.email, input.testimonial, input.rating],
  );

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    jobTitle: row.job_title,
    company: row.company,
    industry: row.industry,
    email: row.email,
    testimonial: row.testimonial,
    rating: row.rating,
    status: row.status,
    dateSubmitted: row.date_submitted,
    dateApproved: row.date_approved,
    lastUpdated: row.last_updated,
  } as DbTestimonial;
}

export async function listTestimonialsByStatus(status: TestimonialStatus | 'all') {
  if (!hasDatabaseUrl()) {
    const store: any = await readStore();
    const all = (store.testimonials || []).map((item: any) => {
      const derivedStatus =
        item.status === 'approved' || item.status === 'pending' || item.status === 'rejected'
          ? item.status
          : item.approved
            ? 'approved'
            : 'pending';

      return {
        id: Number(item.id),
        name: String(item.name || ''),
        jobTitle: String(item.position || ''),
        company: String(item.company || ''),
        industry: String(item.industry || ''),
        email: String(item.email || ''),
        testimonial: String(item.testimonial || ''),
        rating: Number(item.rating || 5),
        status: derivedStatus as TestimonialStatus,
        dateSubmitted: String(item.createdAt || new Date().toISOString()),
        dateApproved: item.dateApproved ? String(item.dateApproved) : item.approved ? String(item.updatedAt || item.createdAt || '') : null,
        lastUpdated: String(item.updatedAt || item.createdAt || new Date().toISOString()),
      };
    });

    return (status === 'all' ? all : all.filter((item: DbTestimonial) => item.status === status)).sort(
      (a: DbTestimonial, b: DbTestimonial) => Date.parse(b.dateSubmitted) - Date.parse(a.dateSubmitted),
    ) as DbTestimonial[];
  }

  await migrateFromJsonIfNeeded();

  const query =
    status === 'all'
      ? `SELECT id, name, job_title, company, industry, email, testimonial, rating, status, date_submitted, date_approved, last_updated
         FROM testimonials
         ORDER BY date_submitted DESC`
      : `SELECT id, name, job_title, company, industry, email, testimonial, rating, status, date_submitted, date_approved, last_updated
         FROM testimonials
         WHERE status = $1
         ORDER BY date_submitted DESC`;

  const result = status === 'all'
    ? await dbQuery<any>(query)
    : await dbQuery<any>(query, [status]);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    jobTitle: row.job_title,
    company: row.company,
    industry: row.industry,
    email: row.email,
    testimonial: row.testimonial,
    rating: row.rating,
    status: row.status,
    dateSubmitted: row.date_submitted,
    dateApproved: row.date_approved,
    lastUpdated: row.last_updated,
  })) as DbTestimonial[];
}

export async function updateTestimonialById(
  id: number,
  input: Partial<Pick<DbTestimonial, 'name' | 'jobTitle' | 'company' | 'industry' | 'email' | 'testimonial' | 'rating' | 'status'>>,
) {
  if (!hasDatabaseUrl()) {
    const store: any = await readStore();
    const index = (store.testimonials || []).findIndex((item: any) => Number(item.id) === id);
    if (index === -1) return null;

    const existing = store.testimonials[index] || {};
    const now = new Date().toISOString();

    const nextStatus = input.status ?? (existing.status || (existing.approved ? 'approved' : 'pending'));

    const updated: any = {
      ...existing,
      name: input.name ?? existing.name,
      position: input.jobTitle ?? existing.position,
      company: input.company ?? existing.company,
      industry: input.industry ?? existing.industry,
      email: input.email ?? existing.email,
      testimonial: input.testimonial ?? existing.testimonial,
      rating: input.rating ?? existing.rating,
      status: nextStatus,
      approved: nextStatus === 'approved',
      dateApproved: nextStatus === 'approved' ? (existing.dateApproved || now) : null,
      updatedAt: now,
      lastUpdated: now,
    };

    store.testimonials[index] = updated;
    await writeStore(store);

    return {
      id: Number(updated.id),
      name: String(updated.name || ''),
      jobTitle: String(updated.position || ''),
      company: String(updated.company || ''),
      industry: String(updated.industry || ''),
      email: String(updated.email || ''),
      testimonial: String(updated.testimonial || ''),
      rating: Number(updated.rating || 5),
      status: updated.status as TestimonialStatus,
      dateSubmitted: String(updated.createdAt || now),
      dateApproved: updated.dateApproved ? String(updated.dateApproved) : null,
      lastUpdated: String(updated.updatedAt || now),
    } as DbTestimonial;
  }

  await migrateFromJsonIfNeeded();

  const fields: string[] = [];
  const params: unknown[] = [];

  const pushField = (sql: string, value: unknown) => {
    params.push(value);
    fields.push(`${sql} = $${params.length}`);
  };

  if (typeof input.name === 'string') pushField('name', input.name);
  if (typeof input.jobTitle === 'string') pushField('job_title', input.jobTitle);
  if (typeof input.company === 'string') pushField('company', input.company);
  if (typeof input.industry === 'string') pushField('industry', input.industry);
  if (typeof input.email === 'string') pushField('email', input.email);
  if (typeof input.testimonial === 'string') pushField('testimonial', input.testimonial);
  if (typeof input.rating === 'number') pushField('rating', input.rating);
  if (typeof input.status === 'string') {
    pushField('status', input.status);
    if (input.status === 'approved') {
      fields.push('date_approved = NOW()');
    }
  }

  fields.push('last_updated = NOW()');

  if (!fields.length) {
    return null;
  }

  params.push(id);

  const result = await dbQuery<any>(
    `UPDATE testimonials
     SET ${fields.join(', ')}
     WHERE id = $${params.length}
     RETURNING id, name, job_title, company, industry, email, testimonial, rating, status, date_submitted, date_approved, last_updated`,
    params,
  );

  if (!result.rows[0]) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    jobTitle: row.job_title,
    company: row.company,
    industry: row.industry,
    email: row.email,
    testimonial: row.testimonial,
    rating: row.rating,
    status: row.status,
    dateSubmitted: row.date_submitted,
    dateApproved: row.date_approved,
    lastUpdated: row.last_updated,
  } as DbTestimonial;
}

export async function deleteTestimonialById(id: number) {
  if (!hasDatabaseUrl()) {
    const store: any = await readStore();
    const before = (store.testimonials || []).length;
    store.testimonials = (store.testimonials || []).filter((item: any) => Number(item.id) !== id);
    await writeStore(store);
    return store.testimonials.length < before;
  }

  await migrateFromJsonIfNeeded();
  const result = await dbQuery('DELETE FROM testimonials WHERE id = $1', [id]);
  return (result.rowCount || 0) > 0;
}
