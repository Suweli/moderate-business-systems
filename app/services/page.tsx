'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight, Building2, Cpu, HardHat, Wrench } from 'lucide-react';
import Link from 'next/link';
import SiteShell from '../../components/site-shell';

const serviceGroups = [
  {
    title: 'Engineering Services',
    items: [
      { name: 'Electrical Engineering', desc: 'Power systems, distribution and technical design solutions.' },
      { name: 'Mechanical Engineering', desc: 'Industrial equipment and system support for reliable operations.' },
      { name: 'Civil Engineering', desc: 'Infrastructure planning and dependable site engineering support.' },
      { name: 'Facility Maintenance', desc: 'Preventive and corrective maintenance programs for critical assets.' },
    ],
  },
  {
    title: 'Procurement Services',
    items: [
      { name: 'Industrial equipment sourcing', desc: 'Access to reliable supply chains and value-led sourcing strategies.' },
      { name: 'Office supplies', desc: 'Procurement support for essential workplace and administrative needs.' },
      { name: 'Computer hardware', desc: 'IT asset procurement built around security, quality and lifecycle value.' },
      { name: 'Specialized procurement', desc: 'Dedicated sourcing for complex, niche and high-specification requirements.' },
    ],
  },
  {
    title: 'Technology Solutions',
    items: [
      { name: 'IT equipment supply', desc: 'Modern infrastructure and dependable technology deployment.' },
      { name: 'Digital solutions', desc: 'Workflow automation and business optimization support.' },
      { name: 'Business technology support', desc: 'Responsive assistance to keep operations moving smoothly.' },
    ],
  },
  {
    title: 'Facility Management',
    items: [
      { name: 'Building maintenance', desc: 'Safe, reliable and proactive building upkeep.' },
      { name: 'Equipment maintenance', desc: 'Asset care for sustained performance and lower downtime.' },
      { name: 'Operational support', desc: 'Day-to-day management support for seamless business continuity.' },
    ],
  },
];

export default function ServicesPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
    
    // Handle scroll to anchor on page load
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/services-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Services</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Comprehensive solutions tailored to demanding operational environments.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                From engineering support to procurement and facilities, MBS delivers integrated services that enhance reliability, optimize spend and strengthen business performance.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-8">
            {serviceGroups.map((group, index) => {
              const anchorId = group.title === 'Engineering Services' ? 'engineering-services' : group.title === 'Procurement Services' ? 'procurement-solutions' : group.title === 'Technology Solutions' ? 'technology-solutions' : 'facility-maintenance';
              return (
              <div key={group.title} id={anchorId} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 lg:p-10 scroll-mt-24" data-aos="fade-up" data-aos-delay={index * 80}>
                <div className="flex items-center gap-3 text-brand-300">
                  {index === 0 ? <HardHat className="h-6 w-6" /> : index === 1 ? <Building2 className="h-6 w-6" /> : index === 2 ? <Cpu className="h-6 w-6" /> : <Wrench className="h-6 w-6" />}
                  <h2 className="text-2xl font-semibold text-white">{group.title}</h2>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="mt-3 text-sm text-slate-400">{item.desc}</p>
                      <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">Learn more <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  ))}
                </div>
              </div>
            );
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
