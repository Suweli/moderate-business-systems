'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Star, MessageSquare, Send } from 'lucide-react';
import SiteShell from '../../components/site-shell';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  position: string;
  testimonial: string;
  rating: number;
  date: string;
  avatar: string;
}

interface FormData {
  name: string;
  company: string;
  position: string;
  email: string;
  message: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Chukwudi Okonkwo',
    company: 'Oil & Gas Solutions Nigeria',
    position: 'Operations Manager',
    testimonial: 'Moderate Business Systems delivered exceptional engineering support that streamlined our operations. Their professionalism and attention to detail are outstanding.',
    rating: 5,
    date: 'December 2025',
    avatar: '🏢'
  },
  {
    id: 2,
    name: 'Aisha Mohammed',
    company: 'Manufacturing Excellence Ltd',
    position: 'Procurement Director',
    testimonial: 'The procurement services provided by MBS were cost-effective and delivered on time. They understand our industry needs and provide tailored solutions.',
    rating: 5,
    date: 'November 2025',
    avatar: '👩‍💼'
  },
  {
    id: 3,
    name: 'Emeka Eze',
    company: 'Construction & Infrastructure Co',
    position: 'Project Lead',
    testimonial: 'Working with MBS on our facility management project was a game-changer. Their technical expertise and commitment to safety standards exceeded expectations.',
    rating: 5,
    date: 'October 2025',
    avatar: '👨‍💼'
  },
  {
    id: 4,
    name: 'Victoria Adeyemi',
    company: 'Energy Systems Inc',
    position: 'Safety Officer',
    testimonial: 'MBS demonstrates exceptional HSEQ compliance and safety protocols. Their team is knowledgeable, responsive, and truly invested in project success.',
    rating: 5,
    date: 'September 2025',
    avatar: '👩‍🔧'
  },
  {
    id: 5,
    name: 'Ibrahim Hassan',
    company: 'Industrial Maintenance Services',
    position: 'Technical Manager',
    testimonial: 'Their industrial solutions have significantly improved our maintenance efficiency. Highly recommend MBS for any technical support needs.',
    rating: 5,
    date: 'August 2025',
    avatar: '👨‍🔨'
  },
  {
    id: 6,
    name: 'Ngozi Nwosu',
    company: 'Technology & Innovation Ltd',
    position: 'IT Director',
    testimonial: 'MBS provided seamless technology support integration. Their team is professional, reliable, and brings innovative solutions to the table.',
    rating: 5,
    date: 'July 2025',
    avatar: '👩‍💻'
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
        />
      ))}
    </div>
  );
};

export default function TestimonialsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    position: '',
    email: '',
    message: '',
    rating: 5
  });

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', company: '', position: '', email: '', message: '', rating: 5 });
      setRating(5);
      
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <SiteShell>
      <main className="bg-slate-950 text-slate-100">
        {/* Header */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[url('/Testimonials-hero.jpg')] bg-cover bg-center" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 lg:px-8">
            <div data-aos="fade-right">
              <p className="mb-3 sm:mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-brand-100">Client Testimonials</p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                What Our Clients Say
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-slate-300">
                Discover how we've made a difference for businesses across Nigeria through reliable, professional engineering and technical solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 hover:border-brand-400/50 transition" data-aos="fade-up" data-aos-delay={index * 100}>
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-400 mb-6 leading-relaxed">{testimonial.testimonial}</p>

                {/* Client Info */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-xl font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.position}</p>
                      <p className="text-xs text-brand-300">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Submission Form */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 sm:pb-24 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 lg:p-12" data-aos="fade-up">
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-brand-300 flex-shrink-0 mt-0.5" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Share Your Experience</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8">We'd love to hear from you! Share your feedback and help us continue improving our services.</p>

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Name and Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Company Name"
                />
              </div>

              {/* Position and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Position/Title"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Email Address"
                />
              </div>

              {/* Rating Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Rate Your Experience</label>
                <div className="flex gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition"
                    >
                      <Star
                        className={`h-6 w-6 sm:h-8 sm:w-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full min-h-[120px] sm:min-h-[160px] rounded-lg border border-slate-700 bg-slate-950/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30 resize-none"
                placeholder="Share your feedback and experience with us..."
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/50 active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Submitting...' : 'Submit Testimonial'}
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-green-300 font-semibold">✓ Thank you! Your testimonial has been submitted successfully.</p>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
