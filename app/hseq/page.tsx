'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShieldCheck, Trees, TrendingUp, ClipboardCheck } from 'lucide-react';
import SiteShell from '../../components/site-shell';

const pillars = [
  { title: 'Health and Safety Commitment', desc: 'We maintain strong safety culture, training and operational controls.', icon: ShieldCheck },
  { title: 'Environmental Responsibility', desc: 'We pursue sustainable practices and responsible resource stewardship.', icon: Trees },
  { title: 'Quality Management', desc: 'Our quality systems support compliance, consistency and continuous improvement.', icon: ClipboardCheck },
  { title: 'Continuous Improvement', desc: 'We monitor performance and evolve through feedback, learning and innovation.', icon: TrendingUp },
];

export default function HSEQPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/HSEQ-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">HSEQ</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Health, Safety, Environment and Quality at the core of our operations.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                We uphold responsible delivery standards that protect people, assets and the environment while maintaining excellence in every engagement.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-up" data-aos-delay={index * 80}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold text-white">{pillar.title}</h2>
                  <p className="mt-4 text-sm text-slate-400">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
