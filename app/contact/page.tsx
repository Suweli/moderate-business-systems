'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Clock3, Mail, MapPin, Phone, Send, MessageCircle, Linkedin, Instagram, Facebook, Building2 } from 'lucide-react';
import Link from 'next/link';
import SiteShell from '../../components/site-shell';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/contact-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Contact Us</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Let's collaborate on your next project
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                Connect with our team for project support, procurement needs, strategic consultations, or any inquiries about our services.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Business Hours */}
        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Phone */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 hover:border-brand-400/50 transition" data-aos="fade-up">
              <div className="flex items-center gap-3 text-brand-300 mb-4">
                <Phone className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Phone</h3>
              </div>
              <p className="text-slate-400 text-sm mb-2">Call us during business hours</p>
              <a href="tel:+2348143233472" className="text-white text-xl font-semibold hover:text-brand-300 transition">+234 814 323 3472</a>
            </div>

            {/* Email */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 hover:border-brand-400/50 transition" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-3 text-brand-300 mb-4">
                <Mail className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Email</h3>
              </div>
              <p className="text-slate-400 text-sm mb-2">We'll respond within 24 hours</p>
              <a href="mailto:moderatebiz@yahoo.com" className="text-white text-lg font-semibold hover:text-brand-300 transition break-all">moderatebiz@yahoo.com</a>
            </div>

            {/* Location */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 hover:border-brand-400/50 transition" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 text-brand-300 mb-4">
                <MapPin className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Address</h3>
              </div>
              <p className="text-slate-400 text-sm mb-2">Visit us in Lagos</p>
              <a href="https://www.google.com/maps/search/7+Tajudeen+Anjorin+Street,+Ikeja,+Lagos" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-brand-300 transition cursor-pointer">7 Tajudeen Anjorin Street, Onilekere, Cement, Ikeja, Lagos, Nigeria</a>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-3xl border border-slate-300 bg-white p-8 lg:p-12" data-aos="fade-up">
            <div className="flex items-center gap-3 text-brand-500 mb-6">
              <Clock3 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold text-slate-950">Business Hours</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-6">
                <p className="text-sm text-slate-600 mb-2">Weekdays</p>
                <p className="text-slate-950 font-semibold text-lg">Monday - Friday</p>
                <p className="text-brand-500 font-semibold">8:00 AM - 6:00 PM</p>
              </div>
              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-6">
                <p className="text-sm text-slate-600 mb-2">Weekends</p>
                <p className="text-slate-950 font-semibold text-lg">Saturday & Sunday</p>
                <p className="text-brand-500 font-semibold">Closed</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">For urgent inquiries, please contact via email or WhatsApp</p>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8" data-aos="fade-right">
              <h2 className="text-3xl font-semibold text-white flex items-center gap-2">
                <Send className="h-6 w-6 text-brand-300" />
                Send us a Message
              </h2>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30" 
                    placeholder="Full Name" 
                  />
                  <input 
                    type="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30" 
                    placeholder="Phone Number" 
                  />
                </div>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30" 
                  placeholder="Email Address" 
                />
                <input 
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30" 
                  placeholder="Subject" 
                />
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="min-h-[160px] w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 resize-none" 
                  placeholder="Tell us about your project or inquiry..." 
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/50 active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {submitted && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                    <p className="text-sm text-green-300 font-semibold">✓ Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}
              </form>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-slate-800">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300 mb-4">Connect With Us</p>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://wa.me/2348143233472" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-semibold text-white hover:from-green-700 hover:to-green-800 transition hover:shadow-lg hover:shadow-green-600/50 inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition hover:shadow-lg hover:shadow-blue-600/50 inline-flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                  <a href="https://instagram.com/moderatebiz" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 px-4 py-3 text-sm font-semibold text-white hover:from-pink-700 hover:to-pink-800 transition hover:shadow-lg hover:shadow-pink-600/50 inline-flex items-center gap-2">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-3xl border border-slate-800 overflow-hidden h-full min-h-[600px]" data-aos="fade-left">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7432195149806!2d3.3369005!3d6.6271046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b4d0b0b0b0b%3A0x0b0b0b0b0b0b0b0b!2s7%20Tajudeen%20Anjorin%20Street%2C%20Ikeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '600px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
