'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight, BrainCircuit, Building2, ClipboardCheck, Cpu, HardHat } from 'lucide-react';
import Link from 'next/link';
import SiteShell from '../../components/site-shell';

const expertise = [
  { title: 'Engineering Solutions', desc: 'End-to-end project support for electrical, mechanical and civil requirements.', icon: HardHat },
  { title: 'Procurement Management', desc: 'Strategic sourcing, vendor coordination and contract-ready procurement processes.', icon: ClipboardCheck },
  { title: 'Industrial Support Services', desc: 'Operational continuity and field support for high-value industrial environments.', icon: Building2 },
  { title: 'Facility Management', desc: 'Maintenance programs and estate support that protect asset performance.', icon: BrainCircuit },
  { title: 'Technology Solutions', desc: 'Systems deployment, IT support and digital modernization initiatives.', icon: Cpu },
  { title: 'Business Consulting', desc: 'Practical advisory services for process improvement and organizational growth.', icon: ClipboardCheck },
];

export default function ExpertisePage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/expertise-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Areas of Expertise</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Modern expertise for complex enterprise requirements.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                Our team brings multidisciplinary capability to operational, technical and strategic challenges.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {expertise.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-hover rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-up" data-aos-delay={index * 70}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-4 text-sm text-slate-400">{item.desc}</p>
                  <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">Discover more <ArrowRight className="h-4 w-4" /></Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
