'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SiteShell from '../../components/site-shell';

const industries = [
  { name: 'Manufacturing', desc: 'Operational resilience and process support for high-output industrial environments.', solutions: ['Production support', 'Maintenance planning', 'Supply chain coordination'] },
  { name: 'Banking and Finance', desc: 'Secure, compliant and dependable support for critical back-office and facility operations.', solutions: ['Facility reliability', 'Procurement governance', 'Technology enablement'] },
  { name: 'Government Institutions', desc: 'Trusted delivery aligned with public sector standards and accountability.', solutions: ['Compliance support', 'Asset and facility management', 'Operational consulting'] },
  { name: 'Oil and Gas', desc: 'Robust service delivery designed for remote, demanding and high-risk operating environments.', solutions: ['Industrial maintenance', 'Procurement execution', 'Technical support'] },
  { name: 'Telecommunications', desc: 'Support for interconnected operations, uptime and modern infrastructure readiness.', solutions: ['Infrastructure support', 'Equipment sourcing', 'Facility management'] },
  { name: 'Healthcare', desc: 'Reliable support that safeguards continuity, safety and service delivery.', solutions: ['Facility upkeep', 'Procurement responsiveness', 'Technical support'] },
  { name: 'Education', desc: 'Practical support for educational estates and campus operations.', solutions: ['Maintenance programs', 'Technology procurement', 'Operational assistance'] },
];

export default function IndustriesPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/Industries-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Industries</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Serving diverse sectors with tailored, high-performing support.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                MBS is equipped to support organizations operating in regulated, technical and high-compliance environments.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((industry, index) => (
              <div key={industry.name} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-up" data-aos-delay={index * 60}>
                <h2 className="text-2xl font-semibold text-white">{industry.name}</h2>
                <p className="mt-4 text-sm text-slate-400">{industry.desc}</p>
                <div className="mt-6">
                  <div className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Solutions</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {industry.solutions.map((item) => (
                      <li key={item} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
