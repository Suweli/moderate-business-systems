'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Shield } from 'lucide-react';
import SiteShell from '../../components/site-shell';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div data-aos="fade-right" className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-brand-300" />
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Privacy Policy</h1>
          </div>
          <p className="text-slate-400 text-lg mb-8">Last Updated: January 2026</p>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
          <div className="space-y-8" data-aos="fade-up">
            {/* Introduction */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-slate-400 mb-4">Moderate Business Systems Ltd ("Company", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
              <p className="text-slate-400">Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our site.</p>
            </div>

            {/* Information Collection */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-300 mb-2">Personal Information</h3>
                  <p className="text-slate-400">We may collect personal information such as your name, email address, phone number, company name, and any other information you voluntarily provide through our contact forms or service requests.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-300 mb-2">Automatically Collected Information</h3>
                  <p className="text-slate-400">When you visit our website, we may automatically collect certain information including your IP address, browser type, pages visited, and time spent on the site.</p>
                </div>
              </div>
            </div>

            {/* Use of Information */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="text-slate-400 space-y-2">
                <li>• To process your inquiries and requests</li>
                <li>• To send you updates and communications about our services</li>
                <li>• To improve our website and services</li>
                <li>• To comply with legal obligations</li>
                <li>• To protect the rights and safety of our company and users</li>
              </ul>
            </div>

            {/* Data Protection */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Protection & Security</h2>
              <p className="text-slate-400 mb-4">We implement appropriate technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              <p className="text-slate-400">However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
            </div>

            {/* Third-Party Links */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Links</h2>
              <p className="text-slate-400">Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>
            </div>

            {/* Contact Information */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
              <p className="text-slate-400 mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="text-slate-300 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:moderatebiz@yahoo.com" className="text-brand-300 hover:text-brand-400">moderatebiz@yahoo.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+2348143233472" className="text-brand-300 hover:text-brand-400">+234 814 323 3472</a></p>
                <p><strong>Address:</strong> <a href="https://www.google.com/maps/search/7+Tajudeen+Anjorin+Street,+Ikeja,+Lagos" target="_blank" rel="noopener noreferrer" className="hover:text-brand-300 transition cursor-pointer">7 Tajudeen Anjorin Street, Onilekere, Cement, Ikeja, Lagos, Nigeria</a></p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
