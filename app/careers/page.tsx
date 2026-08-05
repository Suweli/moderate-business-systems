'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight, BriefcaseBusiness, GraduationCap, HeartHandshake, Users } from 'lucide-react';
import SiteShell from '../../components/site-shell';

export default function CareersPage() {
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

    setError('');

    // Honeypot and time-trap to reduce bot spam.
    const formData = new FormData(form);
    if ((formData.get('_honey') as string) || Date.now() - startedAt < 2000) {
      setError('Submission could not be completed. Please try again.');
      return;
    }

    setLoading(true);

    formData.set('submissionPage', 'Careers Application');
    formData.set('submittedAt', new Date().toISOString());
    if (typeof window !== 'undefined') {
      formData.set('pageUrl', window.location.href);
    }
    if (typeof navigator !== 'undefined') {
      formData.set('userAgent', navigator.userAgent);
    }

    const metadataFields = [
      { name: 'submissionPage', value: 'Careers Application' },
      { name: 'submittedAt', value: new Date().toISOString() },
      { name: 'pageUrl', value: typeof window !== 'undefined' ? window.location.href : '' },
      { name: 'userAgent', value: typeof navigator !== 'undefined' ? navigator.userAgent : '' },
    ];

    for (const field of metadataFields) {
      let hidden = form.querySelector<HTMLInputElement>(`input[name="${field.name}"]`);
      if (!hidden) {
        hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = field.name;
        form.appendChild(hidden);
      }
      hidden.value = field.value;
    }

    form.action = 'https://formsubmit.co/moderatebiz@yahoo.com';
    form.method = 'POST';
    form.enctype = 'multipart/form-data';
    form.submit();
  };

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/Careers-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Careers</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Build your career with a modern and growing enterprise.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                Join a team that values professionalism, development and meaningful project impact.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Why work with MBS', body: 'An engaging workplace with strong values and modern leadership.', icon: Users },
              { title: 'Company culture', body: 'Collaboration, integrity and accountability shape our culture.', icon: HeartHandshake },
              { title: 'Employee development', body: 'Growth pathways, learning support and cross-functional exposure.', icon: GraduationCap },
              { title: 'Available opportunities', body: 'Roles spanning operations, engineering, procurement and technology.', icon: BriefcaseBusiness },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-up" data-aos-delay={index * 70}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm text-slate-400">{item.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-right">
              <h2 className="text-3xl font-semibold text-white">Open Positions</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                {['Project Engineer', 'Procurement Specialist', 'Facilities Manager', 'IT Support Engineer'].map((role) => (
                  <div key={role} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4">
                    <span>{role}</span>
                    <ArrowRight className="h-4 w-4 text-brand-300" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-left">
              <h2 className="text-3xl font-semibold text-white">Application Form</h2>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="_subject" value="MBS Careers Application Submission" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
                <input name="name" required className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" placeholder="Name" />
                <input type="email" name="email" required className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" placeholder="Email" />
                <input name="phone" required className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" placeholder="Phone" />
                <input name="positionAppliedFor" required className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none" placeholder="Position applied for" />
                <input type="file" name="attachment" required accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.png,.jpg,.jpeg" className="w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300" />
                <button type="submit" disabled={loading} className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70">{loading ? 'Sending...' : 'Submit Application'}</button>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
