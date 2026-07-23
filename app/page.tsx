'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ArrowRight, Building2, BriefcaseBusiness, Cpu, Factory, HardHat, ShieldCheck, Wrench, TrendingUp, Award, Users, Zap, Search } from 'lucide-react';
import Link from 'next/link';
import SiteShell from '../components/site-shell';
import AnimatedCounter from '../components/animated-counter';

const stats = [
  { value: '28+', label: 'Years of Experience' },
  { value: '1,200+', label: 'Projects Delivered' },
  { value: '40+', label: 'Industries Served' },
  { value: '98%', label: 'Client Satisfaction' },
];

const services = [
  { title: 'Engineering Services', icon: HardHat, description: 'Electrical, mechanical, civil and technical support delivered with precision and compliance.' },
  { title: 'Procurement Solutions', icon: BriefcaseBusiness, description: 'End-to-end sourcing, vendor management and strategic procurement for mission-critical operations.' },
  { title: 'Facility Maintenance', icon: Wrench, description: 'Reliable facility operations, preventive support and lifecycle maintenance programs.' },
  { title: 'Technology Solutions', icon: Cpu, description: 'IT infrastructure, digital systems and business technology support for modern enterprises.' },
];

const industries = [
  { name: 'Manufacturing', description: 'Enhancing manufacturing performance through engineering excellence, strategic sourcing, and reliable industrial support services.' },
  { name: 'Banking', description: 'Supporting financial institutions with secure facilities, technology infrastructure, and efficient operational solutions.' },
  { name: 'Government', description: 'Partnering with public sector organizations to deliver compliant engineering, procurement, and infrastructure support services.' },
  { name: 'Oil & Gas', description: 'Providing dependable engineering, maintenance, and procurement solutions for complex and safety-critical energy operations.' },
  { name: 'Telecommunications', description: 'Empowering telecommunications providers with reliable technology infrastructure, engineering support, and operational excellence.' },
  { name: 'Healthcare', description: 'Delivering integrated engineering, facility management, and technology solutions that support quality healthcare environments.' },
];
const reasons = [
  'Reliability',
  'Quality Assurance',
  'Technical Expertise',
  'Customer Satisfaction',
  'Professional Workforce',
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const searchRoutes: { [key: string]: string } = {
    // Founder & Leadership
    'founder': '/about#founder-profile',
    'sadiq': '/about#founder-profile',
    'muftau': '/about#founder-profile',
    'late sadiq': '/about#founder-profile',
    'chairman': '/about#chairman-profile',
    'olalekan': '/about#chairman-profile',
    'olagunju': '/about#chairman-profile',
    'ceo': '/about#chairman-profile',
    'chief executive': '/about#chairman-profile',
    'leadership': '/about',
    'team': '/about',
    'about': '/about',
    'company': '/about',
    'history': '/about',
    'timeline': '/about',
    'our story': '/about',
    'mission': '/about',
    'vision': '/about',
    'core values': '/about',
    'values': '/about',
    'principles': '/about',
    
    // Services
    'services': '/services',
    'engineering': '/services',
    'electrical': '/services',
    'mechanical': '/services',
    'civil': '/services',
    'construction': '/services',
    'procurement': '/services',
    'sourcing': '/services',
    'vendor': '/services',
    'supply': '/services',
    'equipment': '/services',
    'technology': '/services',
    'it': '/services',
    'software': '/services',
    'infrastructure': '/services',
    'digital': '/services',
    'facility': '/services',
    'maintenance': '/services',
    'building': '/services',
    'hvac': '/services',
    
    // Contact & Support
    'contact': '/contact',
    'phone': '/contact',
    'email': '/contact',
    'address': '/contact',
    'location': '/contact',
    'support': '/contact',
    'help': '/contact',
    'reach us': '/contact',
    'get in touch': '/contact',
    
    // Career & Growth
    'careers': '/careers',
    'jobs': '/careers',
    'employment': '/careers',
    'work': '/careers',
    'join': '/careers',
    'apply': '/careers',
    'opportunities': '/careers',
    
    // Other Pages
    'testimonials': '/testimonials',
    'reviews': '/testimonials',
    'feedback': '/testimonials',
    'clients': '/testimonials',
    'expertise': '/expertise',
    'skills': '/expertise',
    'capabilities': '/expertise',
    'quote': '/request-quote',
    'request': '/request-quote',
    'estimate': '/request-quote',
    'pricing': '/request-quote',
    'proposal': '/request-quote',
    'hseq': '/hseq',
    'safety': '/hseq',
    'health': '/hseq',
    'environment': '/hseq',
    'quality': '/hseq',
    'privacy': '/privacy-policy',
    'privacy policy': '/privacy-policy',
    'terms': '/terms-conditions',
    'terms and conditions': '/terms-conditions',
    'conditions': '/terms-conditions',
    'industries': '/industries',
    'sectors': '/industries',
    'manufacturing': '/industries',
    'banking': '/industries',
    'oil and gas': '/industries',
    'telecommunications': '/industries',
    'healthcare': '/industries',
    'government': '/industries',
  };

  const findRoute = (query: string): string | null => {
    const cleanQuery = query.toLowerCase().trim();
    
    // Exact match first
    if (searchRoutes[cleanQuery]) {
      return searchRoutes[cleanQuery];
    }
    
    // Partial word match - check if query matches any key or key contains query
    for (const [key, route] of Object.entries(searchRoutes)) {
      if (key.includes(cleanQuery) || cleanQuery.includes(key)) {
        return route;
      }
    }
    
    // Word by word matching - if any word matches
    const words = cleanQuery.split(' ');
    for (const word of words) {
      if (word.length > 2 && searchRoutes[word]) {
        return searchRoutes[word];
      }
    }
    
    return null;
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const route = findRoute(searchQuery);
      
      if (route) {
        router.push(route);
        setTimeout(() => {
          if (route.includes('#')) {
            const elementId = route.split('#')[1];
            const element = document.getElementById(elementId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 100);
      }
      setSearchQuery('');
    }
  };

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Engineering • Procurement • Industrial Solutions</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Premium solutions for complex industrial and business operations.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                Moderate Business Systems Ltd delivers dependable engineering, procurement, facility management and technology support to multinational corporations, government institutions and large organizations.
              </p>
              <div className="mt-6 sm:mt-8 max-w-xl">
                <div className="flex items-center rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 sm:px-5 py-2.5 sm:py-3 transition hover:bg-white/15">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search services, solutions, or expertise..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="ml-3 flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <Link href="/request-quote" className="rounded-full bg-brand-500 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-brand-600">Request a Quote</Link>
                <Link href="/contact" className="rounded-full border border-white/25 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-white/10">Contact Us</Link>
              </div>
            </div>
            <div data-aos="fade-left" className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 shadow-soft backdrop-blur">
              <div className="flex items-center gap-2 sm:gap-3 text-brand-300">
                <Factory className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]">Corporate Capability</span>
              </div>
              <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold text-white">Trusted by organizations that value execution, compliance and long-term reliability.</h2>
              <ul className="mt-5 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
                <li>• Integrated engineering and procurement support</li>
                <li>• Facility maintenance and operational resilience</li>
                <li>• Strategic technology and business support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" data-aos="fade-up">
        <div className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">About MBS</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A legacy of engineering excellence, modern delivery and trusted partnership.</h2>
            <p className="mt-5 text-lg text-slate-300">Founded in 1998, Moderate Business Systems Ltd has evolved into a full-spectrum enterprise support partner with deep capabilities across engineering, procurement, facilities, technology and business services.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatedCounter end={28} suffix="+" label="Years of Experience" icon={<TrendingUp />} />
            <AnimatedCounter end={1200} suffix="+" label="Projects Delivered" icon={<Award />} />
            <AnimatedCounter end={40} suffix="+" label="Industries Served" icon={<Building2 />} />
            <AnimatedCounter end={98} suffix="%" label="Client Satisfaction" icon={<Zap />} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Core Services</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Integrated services for every stage of operations.</h2>
          </div>
          <Link href="/services" className="hidden text-sm font-semibold text-brand-300 md:block">View all services →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            let serviceLink = '/services';
            if (service.title === 'Engineering Services') serviceLink = '/services#engineering-services';
            else if (service.title === 'Procurement Solutions') serviceLink = '/services#procurement-solutions';
            else if (service.title === 'Technology Solutions') serviceLink = '/services#technology-solutions';
            else if (service.title === 'Facility Maintenance') serviceLink = '/services#facility-maintenance';
            
            const handleCardClick = () => {
              router.push(serviceLink);
            };
            
            const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push(serviceLink);
              }
            };
            
            return (
              <div
                key={service.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={handleCardClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                className="service-card rounded-3xl border border-slate-800 bg-slate-900/70 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 service-card-icon">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="service-card-title mt-6 text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{service.description}</p>
                <span className="service-card-link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
                  Learn more <ArrowRight className="service-card-arrow h-4 w-4" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8 lg:p-12" data-aos="fade-up">
          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Industries Served</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Serving mission-critical sectors with proven capability.</h2>
            </div>
            <Link href="/industries" className="text-sm font-semibold text-brand-300">Explore industries →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((industry) => (
              <div key={industry.name} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6">
                <div className="flex items-center gap-3 text-brand-300">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold text-white">{industry.name}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-right">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Why Choose Us</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Performance, accountability and long-term value.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4">
                  <ShieldCheck className="h-5 w-5 text-brand-300" />
                  <span className="text-sm font-medium text-slate-200">{reason}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Featured Expertise</p>
            <div className="mt-6 space-y-4">
              {['Engineering solutions', 'Procurement management', 'Industrial support', 'Facility management', 'Technology implementation'].map((item) => (
                <div key={item} className="flex items-center rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4">
                  <span className="text-sm font-medium text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 lg:p-12" data-aos="fade-up">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Client Trust</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Trusted by enterprises, institutions and public sector leaders.</h2>
            </div>
            <Link href="/contact" className="text-sm font-semibold text-brand-300">Start a conversation →</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {['Global operations support', 'Regulatory compliance readiness', 'Executive-level reporting'].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-300">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 lg:p-12" data-aos="fade-up">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Latest Updates</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">News and progress from the MBS network.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: 'Modernized facility operations', body: 'New maintenance programs strengthen uptime and resilience across client environments.' },
              { title: 'Expanded procurement capability', body: 'Strategic sourcing partnerships strengthen supply chain responsiveness across regions.' },
              { title: 'Digital delivery initiatives', body: 'Technology-led workflow upgrades accelerate project visibility and service excellence.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl border border-brand-500/20 bg-brand-500/10 p-8 text-center lg:p-12" data-aos="zoom-in">
          <h2 className="text-3xl font-semibold text-white">Ready to elevate your operations?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Partner with Moderate Business Systems Ltd for engineering, procurement, facilities and technology support that meets the demands of modern enterprise.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/request-quote" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600">Request a Quote</Link>
            <Link href="/contact" className="rounded-full border border-brand-400/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
    </SiteShell>
  );
}
