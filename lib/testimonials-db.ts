import { dbQuery, getPool } from './db';

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
  verified: boolean;
  recommendationInvalid: boolean | null;
  dateSubmitted: string;
  dateApproved: string | null;
  lastUpdated: string;
};

export type PublicTestimonial = {
  id: number;
  name: string;
  company: string;
  position: string;
  testimonial: string;
  rating: number;
  verified: boolean;
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
  verifiedReviews: number;
  recommendationRate: number | null;
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

function initialsFromName(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return initials || 'MB';
}

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

function toPublicTestimonial(row: Pick<DbTestimonial, 'id' | 'name' | 'company' | 'jobTitle' | 'testimonial' | 'rating' | 'status' | 'verified' | 'dateSubmitted' | 'lastUpdated' | 'industry'>): PublicTestimonial {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    position: row.jobTitle,
    testimonial: row.testimonial,
    rating: row.rating,
    verified: row.verified,
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
    throw new Error('DATABASE_URL is not configured.');
  }

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1::bigint)', [741928406155]);
    await client.query(`
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
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        recommendation_invalid BOOLEAN,
        date_submitted TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        date_approved TIMESTAMPTZ,
        last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE');
    await client.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN');
    await client.query('ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS recommendation_invalid BOOLEAN');
    await client.query('CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_testimonials_submitted ON testimonials(date_submitted DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email)');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

async function computeStats(): Promise<DashboardStats> {
  const rows = await dbQuery<{ rating: number; verified: boolean }>(
    `SELECT rating, verified FROM testimonials WHERE status = 'approved'`,
  );
  const recommendationRows = await dbQuery<{ yes_count: string; response_count: string }>(
    `SELECT
       COUNT(*) FILTER (WHERE would_recommend IS TRUE) AS yes_count,
       COUNT(*) FILTER (WHERE would_recommend IN (TRUE, FALSE)) AS response_count
    FROM testimonials
    WHERE recommendation_invalid IS NOT TRUE`,
  );
  const ratings = rows.rows.map((row) => Number(row.rating)).filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);
  const totalReviews = ratings.length;
  const averageRating = totalReviews
    ? Number((ratings.reduce((sum, value) => sum + value, 0) / totalReviews).toFixed(1))
    : 0;
  const verifiedReviews = rows.rows.filter((row) => row.verified).length;
  const yesCount = Number(recommendationRows.rows[0]?.yes_count ?? 0);
  const responseCount = Number(recommendationRows.rows[0]?.response_count ?? 0);
  const recommendationRate = responseCount > 0 ? Math.round((yesCount / responseCount) * 100) : null;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = ratings.filter((value) => value === rating).length;
    const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { rating, percent, count };
  });

  return {
    averageRating,
    totalReviews,
    verifiedReviews,
    recommendationRate,
    ratingDistribution,
  };
}

export async function readApprovedTestimonialsPage(pageInput: number, limitInput: number): Promise<ApprovedTestimonialsPage> {
  const page = clampPage(pageInput);
  const limit = clampLimit(limitInput);
  const offset = (page - 1) * limit;

  await ensureTestimonialsSchema();

  const rows = await dbQuery<{
    id: number;
    name: string;
    job_title: string;
    company: string;
    industry: string;
    testimonial: string;
    rating: number;
    status: TestimonialStatus;
    verified: boolean;
    date_submitted: string;
    date_approved: string | null;
    last_updated: string;
  }>(
    `SELECT id, name, job_title, company, industry, testimonial, rating, status, verified, date_submitted, date_approved, last_updated
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
      testimonial: row.testimonial,
      rating: row.rating,
      status: row.status,
      verified: row.verified,
      dateSubmitted: row.date_submitted,
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
  wouldRecommend: boolean;
};

export async function findRecentDuplicate(email: string, testimonial: string) {
  await ensureTestimonialsSchema();
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
  await ensureTestimonialsSchema();

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
    verified: boolean;
    recommendation_invalid: boolean | null;
    date_submitted: string;
    date_approved: string | null;
    last_updated: string;
  }>(
    `INSERT INTO testimonials
      (name, job_title, company, industry, email, testimonial, rating, would_recommend, recommendation_invalid, status, date_submitted, last_updated)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,FALSE,'pending',NOW(),NOW())
    RETURNING id, name, job_title, company, industry, email, testimonial, rating, status, verified, recommendation_invalid, date_submitted, date_approved, last_updated`,
    [input.name, input.jobTitle, input.company, input.industry, input.email, input.testimonial, input.rating, input.wouldRecommend],
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
    verified: row.verified,
    recommendationInvalid: row.recommendation_invalid,
    dateSubmitted: row.date_submitted,
    dateApproved: row.date_approved,
    lastUpdated: row.last_updated,
  } as DbTestimonial;
}

export async function listTestimonialsByStatus(status: TestimonialStatus | 'all') {
  await ensureTestimonialsSchema();

  const query =
    status === 'all'
      ? `SELECT id, name, job_title, company, industry, email, testimonial, rating, status, verified, recommendation_invalid, date_submitted, date_approved, last_updated
         FROM testimonials
         ORDER BY date_submitted DESC`
      : `SELECT id, name, job_title, company, industry, email, testimonial, rating, status, verified, recommendation_invalid, date_submitted, date_approved, last_updated
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
    verified: row.verified,
    recommendationInvalid: row.recommendation_invalid,
    dateSubmitted: row.date_submitted,
    dateApproved: row.date_approved,
    lastUpdated: row.last_updated,
  })) as DbTestimonial[];
}

export async function updateTestimonialById(
  id: number,
  input: Partial<Pick<DbTestimonial, 'name' | 'jobTitle' | 'company' | 'industry' | 'email' | 'testimonial' | 'rating' | 'status' | 'verified' | 'recommendationInvalid'>>,
) {
  await ensureTestimonialsSchema();

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
    } else {
      fields.push('date_approved = NULL');
    }
  }
  if (typeof input.verified === 'boolean') pushField('verified', input.verified);
  if (typeof input.recommendationInvalid === 'boolean') pushField('recommendation_invalid', input.recommendationInvalid);

  fields.push('last_updated = NOW()');

  if (!fields.length) {
    return null;
  }

  params.push(id);

  const result = await dbQuery<any>(
    `UPDATE testimonials
     SET ${fields.join(', ')}
     WHERE id = $${params.length}
    RETURNING id, name, job_title, company, industry, email, testimonial, rating, status, verified, recommendation_invalid, date_submitted, date_approved, last_updated`,
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
    verified: row.verified,
    recommendationInvalid: row.recommendation_invalid,
    dateSubmitted: row.date_submitted,
    dateApproved: row.date_approved,
    lastUpdated: row.last_updated,
  } as DbTestimonial;
}

export async function deleteTestimonialById(id: number) {
  await ensureTestimonialsSchema();
  const result = await dbQuery('DELETE FROM testimonials WHERE id = $1', [id]);
  return (result.rowCount || 0) > 0;
}
