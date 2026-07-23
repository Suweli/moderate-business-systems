'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SiteShell from '../../components/site-shell';

export default function RequestQuotePage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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
              <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Name" />
              <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Company name" />
              <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Email" />
              <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Phone number" />
              <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Service required" />
              <input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Budget range" />
              <textarea className="md:col-span-2 min-h-[140px] rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder-slate-500" placeholder="Project description" />
              <div className="md:col-span-2 flex items-center gap-4">
                <button type="submit" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white">Submit Request</button>
                {submitted && <p className="text-sm text-brand-500">Request received. We will contact you shortly.</p>}
              </div>
            </form>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
