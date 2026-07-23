'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUp, Menu, X, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import FloatingWhatsApp from './floating-whatsapp';
import AIAssistant from './ai-assistant';
import Preloader from './preloader';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/expertise', label: 'Areas of Expertise' },
  { href: '/hseq', label: 'HSEQ' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/careers', label: 'Careers' },
  { href: '/request-quote', label: 'Request Quote' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Preloader />
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/95 shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-300">
        {/* Main Header Container */}
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo and Company Name Branding Unit */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3 flex-shrink-0 group transition-all duration-300 hover:opacity-90">
              {/* Logo */}
              <div className="flex items-center h-12 sm:h-14 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="MBS Logo" 
                  width={400} 
                  height={160} 
                  className="h-full w-auto drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" 
                  priority 
                />
              </div>
              
              {/* Company Name - Professional Two-Line Branding */}
              <div className="hidden sm:flex flex-col justify-center h-12 sm:h-14 flex-shrink-0">
                <div className="flex flex-col gap-0.5">
                  <p className="text-white text-base sm:text-xl lg:text-2xl font-bold uppercase tracking-tight leading-none whitespace-nowrap">MODERATE</p>
                  <p className="text-slate-300 text-[0.65rem] sm:text-[0.7rem] lg:text-xs font-bold uppercase tracking-wider leading-none whitespace-nowrap">BUSINESS SYSTEMS LTD</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Single Row */}
            <nav className="hidden md:flex items-center gap-0 flex-1 ml-4 lg:ml-8">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 lg:px-3 py-2 text-xs lg:text-xs font-medium transition-all duration-300 relative whitespace-nowrap
                      ${active 
                        ? 'text-brand-300' 
                        : 'text-slate-400 hover:text-white'
                      }
                      after:content-[''] after:absolute after:bottom-0 after:left-2 lg:after:left-3 after:right-2 lg:after:right-3 after:h-0.5 
                      ${active ? 'after:bg-gradient-to-r after:from-brand-400 after:to-brand-300 after:scale-x-100' : 'after:bg-brand-400 after:scale-x-0 hover:after:scale-x-100'} 
                      after:transition-transform after:duration-300 after:origin-center
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center justify-center p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-brand-400 transition-all duration-300 flex-shrink-0" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-slate-800 bg-slate-900/98 md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col px-4 sm:px-6 py-4 gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      active 
                        ? 'bg-brand-500/20 text-brand-300 border-l-2 border-brand-400' 
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {children}

      <AIAssistant />
      <FloatingWhatsApp />

      <footer className="border-t border-slate-800 bg-slate-950/90">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_0.7fr] lg:px-8">
          <div>
            <Image src="/logo.png" alt="MBS Logo" width={400} height={160} className="h-12 sm:h-16 w-auto drop-shadow-lg" />
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-400">Moderate Business Systems Ltd delivers engineering, procurement, industrial support, facility management and technology solutions with a premium client experience.</p>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Quick Links</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-400">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group inline-flex items-center transition hover:text-brand-300 hover:translate-x-1">
                    <span className="inline-block w-0 h-0.5 bg-brand-400 transition-all group-hover:w-2 mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Contact</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2 hover:text-white transition">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-400 flex-shrink-0" />
                <a href="tel:+2348143233472" className="hover:text-brand-300 break-all">+234 814 323 3472</a>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:moderatebiz@yahoo.com" className="hover:text-brand-300 break-all">moderatebiz@yahoo.com</a>
              </li>
              <li className="flex items-start gap-2 hover:text-white transition">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <a href="https://www.google.com/maps/search/7+Tajudeen+Anjorin+Street,+Ikeja,+Lagos" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-brand-300 transition cursor-pointer">7 Tajudeen Anjorin Street, Ikeja, Lagos</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Legal</h3>
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/privacy-policy" className="group inline-flex items-center transition hover:text-brand-300 hover:translate-x-1">
                  <span className="inline-block w-0 h-0.5 bg-brand-400 transition-all group-hover:w-2 mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="group inline-flex items-center transition hover:text-brand-300 hover:translate-x-1">
                  <span className="inline-block w-0 h-0.5 bg-brand-400 transition-all group-hover:w-2 mr-2"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">Newsletter</h3>
            <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3">
              <input className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-400 outline-none transition focus:border-brand-400 focus:bg-slate-900 focus:ring-2 focus:ring-brand-500/30" placeholder="Enter email" />
              <button className="rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/50 active:scale-95 duration-200">
                Subscribe
              </button>
            </div>

            {/* Compact Google Map */}
            <div className="hidden lg:block rounded-lg border border-slate-800 overflow-hidden mt-6">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7432195149806!2d3.3369005!3d6.6271046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b4d0b0b0b0b%3A0x0b0b0b0b0b0b0b0b!2s7%20Tajudeen%20Anjorin%20Street%2C%20Ikeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="140"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 px-4 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-500">
          <p>&copy; 2026 Moderate Business Systems Ltd. All rights reserved.</p>
        </div>
      </footer>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-24 sm:right-28 z-30 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 p-3 text-white shadow-lg shadow-brand-500/50 hover:from-brand-600 hover:to-brand-700 hover:shadow-xl hover:shadow-brand-500/70 transition-all duration-300 hover:scale-110 active:scale-95">
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
