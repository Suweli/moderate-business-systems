'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Building2, Landmark, Users, Check } from 'lucide-react';
import Image from 'next/image';
import SiteShell from '../../components/site-shell';

const timeline = [
  { year: '1998', title: 'Founded', description: 'Moderate Business Systems Ltd was established by Late Sadiq Olawale Muftau.' },
  { year: '2017', title: 'Operational Growth', description: 'Olalekan Oladapo Olagunju joined company operations and strengthened delivery capabilities.' },
  { year: '2020', title: 'Leadership Transition', description: 'The company navigated a leadership transition following the passing of the founder.' },
  { year: '2026', title: 'Modernization', description: 'Corporate restructuring and expansion under Chairman Olalekan Olagunju.' },
];

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/about-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div data-aos="fade-right">
                <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">About MBS</p>
                <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                  A company built on legacy, leadership and modern execution.
                </h1>
                <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                  Moderate Business Systems Ltd was incorporated in 1998 and has grown into a dependable provider of engineering support, procurement services, industrial solutions, technology support and business services.
                </p>
              </div>
              <div data-aos="fade-left" className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 shadow-soft backdrop-blur">
                <div className="flex items-center gap-2 sm:gap-3 text-brand-300">
                  <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]">Our Story</span>
                </div>
                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300">From its foundations in 1998 to its present-day corporate modernization, the company continues to build enduring value for clients across public and private sectors.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 lg:p-12" data-aos="fade-up">
            <h2 className="text-3xl font-semibold text-white">Company Timeline</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {timeline.map((item) => (
                <div key={item.year} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                  <div className="text-2xl font-semibold text-brand-300">{item.year}</div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Our Mission */}
            <div className="rounded-3xl border border-slate-300 bg-white p-8" data-aos="fade-right">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">Our Mission</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Delivering Excellence Through Partnership</h2>
              <p className="mt-5 text-slate-700">To deliver safe, innovative, cost-effective, and high-quality engineering, procurement, and technical services while building long-term partnerships through professionalism, reliability, and customer satisfaction.</p>
            </div>

            {/* Our Vision */}
            <div className="rounded-3xl border border-slate-300 bg-white p-8" data-aos="fade-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">Our Vision</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Leading Innovation & Excellence</h2>
              <p className="mt-5 text-slate-700">To be the leading provider of engineering, procurement, construction, and industrial technical solutions in Nigeria, recognized for excellence, innovation, integrity, and sustainable project delivery.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" id="founder-profile">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 overflow-hidden" data-aos="fade-right">
              <div className="rounded-full border border-slate-800 overflow-hidden mb-6 h-48 w-48 sm:h-56 sm:w-56 mx-auto flex-shrink-0">
                <Image 
                  src="/founder.jpg" 
                  alt="Late Sadiq Olawale Muftau" 
                  width={400} 
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Founder Profile</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Late Sadiq Olawale Muftau</h2>
              <p className="mt-5 text-slate-400">The founder's vision, discipline and enterprise mindset laid the foundation of the organization. His legacy remains central to the company's values of integrity, reliability and service excellence.</p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">Founder story: Built the company on trust, professionalism and operational discipline.</div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">Vision: Create a business that consistently delivers value to clients and communities.</div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">Leadership legacy: A benchmark for dedication, humility and long-term thinking.</div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 overflow-hidden" data-aos="fade-left" id="chairman-profile">
              <div className="rounded-full border border-slate-800 overflow-hidden mb-6 h-48 w-48 sm:h-56 sm:w-56 mx-auto flex-shrink-0">
                <Image 
                  src="/chairman.jpg" 
                  alt="Olalekan Oladapo Olagunju" 
                  width={400} 
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Chairman Profile</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Olalekan Oladapo Olagunju</h2>
              <p className="mt-2 text-slate-300 font-semibold">Chairman & Chief Executive Officer</p>
              <p className="mt-5 text-slate-400 leading-relaxed">As Chairman and Chief Executive Officer, Olalekan Oladapo Olagunju is leading the next phase of Moderate Business Systems Ltd's growth by driving innovation, operational excellence, and strategic expansion. Under his leadership, the company continues to modernize its operations while strengthening its position as a trusted provider of engineering, procurement, facility management, industrial support, and technology solutions.</p>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white mb-2">Strategic Leadership</p>
                  <p>Driving sustainable growth through innovation, customer-focused solutions, and operational excellence.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white mb-2">Digital Transformation</p>
                  <p>Integrating modern technologies and efficient business processes to improve service delivery and enhance customer experience.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white mb-2">Growth & Expansion</p>
                  <p>Expanding the company's capabilities, strengthening strategic partnerships, and broadening its service portfolio while maintaining the highest standards of quality, integrity, and accountability.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 lg:p-12" data-aos="fade-up">
            <div className="flex items-center gap-3 text-brand-300">
              <Users className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-[0.3em]">Leadership Values</span>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {['Integrity', 'Excellence', 'Innovation'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6 text-center">
                  <div className="text-xl font-semibold text-white">{item}</div>
                  <p className="mt-3 text-sm text-slate-400">Core principles that steer the company's culture and client partnerships.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-3xl border border-slate-300 bg-white p-8 lg:p-12" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">Our Technical Team</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Excellence Through Expertise</h2>
            <p className="mt-6 text-lg text-slate-700">Behind every successful project is a team of highly skilled professionals committed to delivering engineering excellence. Our multidisciplinary technical team combines expertise in engineering, procurement, construction, industrial maintenance, facility management, equipment supply, project coordination and HSEQ compliance.</p>
            <p className="mt-4 text-lg text-slate-700">Working collaboratively, they ensure every solution is delivered safely, efficiently, on schedule and to the highest industry standards.</p>
            <p className="mt-4 text-lg text-slate-700">Driven by continuous learning and innovation, our team remains dedicated to helping clients improve operational performance while delivering dependable, cost-effective and sustainable engineering solutions.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 lg:p-12" data-aos="fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Core Values</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Principles that Guide Us</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                'Safety First',
                'Integrity',
                'Quality Excellence',
                'Customer Satisfaction',
                'Innovation',
                'Teamwork',
                'Accountability'
              ].map((value) => (
                <div key={value} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6 flex items-center gap-3 hover:bg-slate-950/80 hover:border-brand-400/50 transition">
                  <Check className="h-5 w-5 text-brand-300 flex-shrink-0" />
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
