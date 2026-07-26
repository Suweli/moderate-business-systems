'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import SiteShell from '../../../components/site-shell';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

type AdminTestimonial = {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  industry: string;
  email: string;
  testimonial: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
  dateApproved: string | null;
  lastUpdated: string;
};

type DashboardStats = {
  averageRating: number;
  totalReviews: number;
  recommendationRate: number;
  ratingDistribution: Array<{ rating: number; percent: number; count: number }>;
};

const emptyStats: DashboardStats = {
  averageRating: 0,
  totalReviews: 0,
  recommendationRate: 0,
  ratingDistribution: [5, 4, 3, 2, 1].map((rating) => ({ rating, percent: 0, count: 0 })),
};

export default function AdminTestimonialsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionWarning, setSessionWarning] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);

  const filtered = useMemo(() => {
    return status === 'all' ? items : items.filter((item) => item.status === status);
  }, [items, status]);

  const loadAll = async () => {
    setError('');

    const [itemsRes, statsRes] = await Promise.all([
      fetch(`/api/admin/testimonials?status=all`, { cache: 'no-store' }),
      fetch('/api/admin/dashboard-stats', { cache: 'no-store' }),
    ]);

    if (itemsRes.status === 401 || statsRes.status === 401) {
      setAuthenticated(false);
      setAuthLoading(false);
      return;
    }

    if (!itemsRes.ok || !statsRes.ok) {
      throw new Error('Failed to load admin dashboard data.');
    }

    const itemsPayload = await itemsRes.json();
    const statsPayload = await statsRes.json();

    setItems(itemsPayload.items || []);
    setStats(statsPayload || emptyStats);
    setAuthenticated(true);
    setAuthLoading(false);
  };

  const refreshSession = async () => {
    const response = await fetch('/api/admin/auth/session', { cache: 'no-store' });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        setAuthenticated(false);
      }
      setSessionWarning('');
      return;
    }

    const payload = await response.json();
    if (!payload.authenticated) {
      setAuthenticated(false);
      setSessionWarning('');
      return;
    }

    const secondsRemaining = Number(payload.secondsRemaining || 0);
    const warningThreshold = Number(payload.warningThresholdSeconds || 900);
    if (secondsRemaining > 0 && secondsRemaining <= warningThreshold) {
      const mins = Math.max(1, Math.ceil(secondsRemaining / 60));
      setSessionWarning(`Your admin session will expire in about ${mins} minute${mins === 1 ? '' : 's'}.`);
    } else {
      setSessionWarning('');
    }
  };

  useEffect(() => {
    loadAll().catch((e) => {
      setError(e instanceof Error ? e.message : 'Unable to load admin dashboard.');
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    void refreshSession();
    const timer = setInterval(() => {
      void refreshSession();
    }, 60_000);

    return () => clearInterval(timer);
  }, [authenticated]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const payload = await res.json();

    if (!res.ok) {
      const retryText = payload.retryAfterSeconds
        ? ` Try again in ${payload.retryAfterSeconds} second${payload.retryAfterSeconds === 1 ? '' : 's'}.`
        : '';
      setError((payload.message || 'Authentication failed.') + retryText);
      return;
    }

    setPassword('');
    await loadAll();
    await refreshSession();
  };

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const updateItem = async (id: number, patch: Partial<AdminTestimonial>) => {
    const res = await fetch('/api/admin/testimonials', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.message || 'Could not update testimonial.');
    await loadAll();
  };

  const deleteItem = async (id: number) => {
    const res = await fetch('/api/admin/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.message || 'Could not delete testimonial.');
    await loadAll();
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    await updateItem(editing.id, {
      name: editing.name,
      company: editing.company,
      jobTitle: editing.jobTitle,
      industry: editing.industry,
      email: editing.email,
      testimonial: editing.testimonial,
      rating: editing.rating,
      status: editing.status,
    });

    setEditing(null);
  };

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100 min-h-screen">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Testimonials Admin Dashboard</h1>
            {authenticated && (
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Logout
              </button>
            )}
          </div>

          {!authenticated && !authLoading && (
            <form onSubmit={login} className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
              <p className="text-sm text-slate-400">Administrator access required.</p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3"
                placeholder="Username"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3"
                placeholder="Password"
              />
              <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600">
                Sign in
              </button>
              {error && <p className="text-sm text-red-300">{error}</p>}
            </form>
          )}

          {authenticated && (
            <>
              {sessionWarning && (
                <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {sessionWarning}
                </div>
              )}

              <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Overall Customer Rating</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.averageRating.toFixed(1)} / 5.0</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Customer Recommendation Rate</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.recommendationRate}%</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Verified Customer Reviews</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.totalReviews.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Rating Distribution</p>
                  <div className="mt-3 space-y-2">
                    {stats.ratingDistribution.map((row) => (
                      <div key={row.rating}>
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>{'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}</span>
                          <span>{row.percent}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${row.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${status === value ? 'bg-brand-500 text-white' : 'border border-slate-700 text-slate-200 hover:bg-slate-800'}`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {filtered.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-400">{item.jobTitle} • {item.company} • {item.industry || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                      <div className="inline-flex gap-2">
                        <button className="rounded-md bg-emerald-600 p-2" onClick={() => void updateItem(item.id, { status: 'approved' })} title="Approve">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="rounded-md bg-amber-600 p-2" onClick={() => setEditing(item)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded-md bg-rose-600 p-2" onClick={() => void updateItem(item.id, { status: 'rejected' })} title="Reject">
                          <X className="h-4 w-4" />
                        </button>
                        <button className="rounded-md bg-slate-700 p-2" onClick={() => void deleteItem(item.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-slate-300">{item.testimonial}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-300">{item.status}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {editing && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
            <form onSubmit={saveEdit} className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Edit Testimonial</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2" />
                <input value={editing.jobTitle} onChange={(e) => setEditing({ ...editing, jobTitle: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2" />
                <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2" />
                <input value={editing.industry} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2" />
                <input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 sm:col-span-2" />
              </div>
              <textarea value={editing.testimonial} onChange={(e) => setEditing({ ...editing, testimonial: e.target.value })} className="w-full min-h-[120px] rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value || 5) })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2" />
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminTestimonial['status'] })} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-700 px-4 py-2">Cancel</button>
                <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600">Save</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </SiteShell>
  );
}
