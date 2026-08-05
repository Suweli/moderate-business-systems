'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Star, MessageSquare, Send } from 'lucide-react';
import SiteShell from '../../components/site-shell';
import { type ApprovedTestimonialsPage } from '../../lib/testimonials-public';

const DEFAULT_TESTIMONIAL_PAGE_SIZE = 6;

type Testimonial = ApprovedTestimonialsPage['items'][number];

interface FormData {
  name: string;
  company: string;
  position: string;
  industry: string;
  email: string;
  message: string;
  rating: number;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
        />
      ))}
    </div>
  );
};

export default function TestimonialsClientPage({ initialData }: { initialData: ApprovedTestimonialsPage }) {
  const [testimonialItems, setTestimonialItems] = useState<Testimonial[]>(initialData.items);
  const [page, setPage] = useState(initialData.page);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [stats, setStats] = useState(initialData.stats);
  const [submitted, setSubmitted] = useState(false);
  const [submissionWarning, setSubmissionWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    position: '',
    industry: '',
    email: '',
    message: '',
    rating: 5,
  });

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
    setStartedAt(Date.now());
  }, []);

  const loadTestimonials = async (targetPage: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    }
    setFetchError('');
    try {
      const response = await fetch(`/api/testimonials?page=${targetPage}&limit=${DEFAULT_TESTIMONIAL_PAGE_SIZE}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Could not load testimonials.');
      }
      const payload = (await response.json()) as ApprovedTestimonialsPage;
      const items = payload.items || [];
      setTestimonialItems((prev) => (append ? [...prev, ...items] : items));
      setHasMore(Boolean(payload.hasMore));
      setPage(targetPage);
      setStats(payload.stats || initialData.stats);
    } catch {
      setFetchError('We could not load testimonials right now. Showing available entries.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    setSubmissionWarning('');
    setLoading(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          rating,
          startedAt,
          honey: '',
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Submission failed.');
      }

      setSubmitted(true);
      if (payload.notificationWarning) {
        setSubmissionWarning(payload.notificationWarning);
      }
      setFormData({ name: '', company: '', position: '', industry: '', email: '', message: '', rating: 5 });
      setRating(5);
      setStartedAt(Date.now());

      setTimeout(() => setSubmitted(false), 6000);
      await loadTestimonials(1, false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit testimonial right now.');
    } finally {
      setLoading(false);
    }
  };

  const roundedAverage = Number(stats.averageRating.toFixed(1));
  const filledStars = Math.round(stats.averageRating);
  const ratingPercentage = Math.round((stats.averageRating / 5) * 100);
  const recommendationRate = stats.recommendationRate || 0;
  const ratingDistribution = stats.ratingDistribution || [
    { rating: 5, percent: 0, count: 0 },
    { rating: 4, percent: 0, count: 0 },
    { rating: 3, percent: 0, count: 0 },
    { rating: 2, percent: 0, count: 0 },
    { rating: 1, percent: 0, count: 0 },
  ];

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/Testimonials-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-brand-100 sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">Client Testimonials</p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                What Our Clients Say
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300 sm:mt-6 sm:text-lg">
                Discover how we've made a difference for businesses across Nigeria through reliable, professional engineering and technical solutions.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30" data-aos="fade-up">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Overall Customer Rating</p>
              <div className="mt-3 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < filledStars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                ))}
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-white">{roundedAverage} / 5.0</h2>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30" data-aos="fade-up" data-aos-delay={60}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Customer Recommendation Rate</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">{recommendationRate}%</h2>
              <p className="mt-2 text-sm text-slate-400">Customers Recommend MBS</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30" data-aos="fade-up" data-aos-delay={120}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Verified Customer Reviews</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">{stats.totalReviews.toLocaleString()}</h2>
              <p className="mt-2 text-sm text-slate-400">Verified Customer Reviews</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30" data-aos="fade-up" data-aos-delay={180}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Rating Distribution</p>
              <div className="mt-4 space-y-2">
                {ratingDistribution.map((row) => (
                  <div key={row.rating} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>{'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}</span>
                      <span>{row.percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-700"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">Overall Rating Index: {ratingPercentage}%</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonialItems.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400 md:col-span-2 lg:col-span-3" data-aos="fade-up">
                We're proud to serve our clients. Customer testimonials will appear here as they are received and approved.
              </div>
            ) : (
              testimonialItems.map((testimonial, index) => (
                <div key={testimonial.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 transition hover:border-brand-400/50" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>

                  <p className="mb-6 leading-relaxed text-slate-400">{testimonial.testimonial}</p>

                  <div className="border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-xl font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-slate-400">{testimonial.position}</p>
                        <p className="text-xs text-brand-300">{testimonial.company}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{testimonial.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {fetchError && <p className="mt-6 text-sm text-red-400">{fetchError}</p>}

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => void loadTestimonials(page + 1, true)}
                disabled={loadingMore}
                className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/50 disabled:opacity-60"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 lg:p-12 sm:p-8" data-aos="fade-up">
            <div className="mb-2 flex items-start gap-2 sm:gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-300 sm:h-6 sm:w-6" />
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Share Your Experience</h2>
            </div>
            <p className="mb-6 text-sm text-slate-400 sm:mb-8 sm:text-base">We'd love to hear from you! Share your feedback and help us continue improving our services.</p>

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:px-4 sm:py-3 sm:text-sm"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:px-4 sm:py-3 sm:text-sm"
                  placeholder="Company Name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:px-4 sm:py-3 sm:text-sm"
                  placeholder="Position/Title"
                />
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:px-4 sm:py-3 sm:text-sm"
                  placeholder="Industry"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:px-4 sm:py-3 sm:text-sm"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-white sm:mb-3 sm:text-sm">Rate Your Experience</label>
                <div className="flex gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition"
                    >
                      <Star className={`h-6 w-6 sm:h-8 sm:w-8 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="min-h-[120px] w-full resize-none rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 sm:min-h-[160px] sm:px-4 sm:py-3 sm:text-sm"
                placeholder="Share your feedback and experience with us..."
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition duration-200 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-sm"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Submitting...' : 'Submit Testimonial'}
              </button>

              {submitted && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 sm:p-4">
                  <p className="text-xs font-semibold text-green-300 sm:text-sm">✓ Thank you! Your testimonial has been submitted and is awaiting approval before publication.</p>
                </div>
              )}
              {submissionWarning && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 sm:p-4">
                  <p className="text-xs font-semibold text-amber-200 sm:text-sm">{submissionWarning}</p>
                </div>
              )}
              {submitError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 sm:p-4">
                  <p className="text-xs font-semibold text-red-300 sm:text-sm">{submitError}</p>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
