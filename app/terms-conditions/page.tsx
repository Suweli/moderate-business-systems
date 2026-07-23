'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FileText } from 'lucide-react';
import SiteShell from '../../components/site-shell';

export default function TermsAndConditionsPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div data-aos="fade-right" className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-brand-300" />
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Terms & Conditions</h1>
          </div>
          <p className="text-slate-400 text-lg mb-8">Last Updated: January 2026</p>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
          <div className="space-y-8" data-aos="fade-up">
            {/* Agreement */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-400 mb-4">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              <p className="text-slate-400">Moderate Business Systems Ltd reserves the right to update and change the Terms and Conditions from time to time without notice.</p>
            </div>

            {/* Use License */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
              <p className="text-slate-400 mb-4">Permission is granted to temporarily download one copy of the materials (information or software) on Moderate Business Systems Ltd's website for personal, non-commercial transitory viewing only.</p>
              <p className="text-slate-400">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="text-slate-400 space-y-2 mt-4">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>• Transfer the materials to another person or "mirror" the materials on any other server</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Disclaimer</h2>
              <p className="text-slate-400 mb-4">The materials on Moderate Business Systems Ltd's website are provided on an 'as is' basis. Moderate Business Systems Ltd makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              <p className="text-slate-400">Further, Moderate Business Systems Ltd does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
            </div>

            {/* Limitations of Liability */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Limitations of Liability</h2>
              <p className="text-slate-400">In no event shall Moderate Business Systems Ltd or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Moderate Business Systems Ltd's website, even if Moderate Business Systems Ltd or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </div>

            {/* Accuracy of Materials */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Accuracy of Materials</h2>
              <p className="text-slate-400">The materials appearing on Moderate Business Systems Ltd's website could include technical, typographical, or photographic errors. Moderate Business Systems Ltd does not warrant that any of the materials on its website are accurate, complete, or current. Moderate Business Systems Ltd may make changes to the materials contained on its website at any time without notice.</p>
            </div>

            {/* Links */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Links</h2>
              <p className="text-slate-400">Moderate Business Systems Ltd has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Moderate Business Systems Ltd of the site. Use of any such linked website is at the user's own risk.</p>
            </div>

            {/* Modifications */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Modifications</h2>
              <p className="text-slate-400">Moderate Business Systems Ltd may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
            </div>

            {/* Contact Information */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p className="text-slate-400 mb-4">If you have any questions about these Terms and Conditions, please contact us at:</p>
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
