'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SiteShell from '../../components/site-shell';

export default function RequestQuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
    setStartedAt(Date.now());
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set('submissionPage', 'Request a Quote');
    formData.set('submittedAt', new Date().toISOString());
    if (typeof window !== 'undefined') {
      formData.set('pageUrl', window.location.href);
    }
    if (typeof navigator !== 'undefined') {
      formData.set('userAgent', navigator.userAgent);
    }

    setError('');
    setSubmitted(false);

    // Honeypot and time-trap to reduce bot spam.
    if ((formData.get('_honey') as string) || Date.now() - startedAt < 2000) {
      setError('Submission could not be completed. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/moderatebiz@yahoo.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);
      form.reset();
      setStartedAt(Date.now());
    } catch {
      setError('We could not send your request right now. Please try again shortly or email moderatebiz@yahoo.com.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div data-aos="fade-right">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Request a Quote</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Tell us about your project and we’ll respond with the right solution.</h1>
            <p className="mt-6 max-w-3xl text-lg text-slate-300">Share your requirements and our team will prepare a tailored proposal for your organization.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="rounded-3xl border border-slate-300 bg-white p-8 lg:p-12" data-aos="fade-up">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <input type="hidden" name="_subject" value="MBS Request a Quote Submission" />
              <input type="hidden" name="_template" value="table" />
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
              <input name="name" required className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Name" />
              <input name="companyName" required className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Company name" />
              <input type="email" name="email" required className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Email" />
              <input name="phoneNumber" required className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Phone number" />
              <input name="serviceRequired" required className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Service required" />
              <input name="budgetRange" required className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Budget range" />
              <textarea name="projectDescription" required className="md:col-span-2 min-h-[140px] rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Project description" />
              <div className="md:col-span-2 flex items-center gap-4">
                <button type="submit" disabled={loading} className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70">{loading ? 'Sending...' : 'Submit Request'}</button>
                {submitted && <p className="text-sm text-brand-500">Thank you for contacting Moderate Business Systems Ltd. Your submission has been received successfully. Our team will review it and get back to you as soon as possible.</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </form>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
