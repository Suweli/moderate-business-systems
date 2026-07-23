'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip briefly on page load to hint about the button
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="animate-fade-in-up mb-2 rounded-lg bg-slate-900 px-3 py-2 text-xs sm:text-sm text-white shadow-lg border border-slate-800">
          Chat with us!
          <div className="absolute -bottom-1 right-4 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
      
      {/* Animated background circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-500 opacity-0 animate-ping" />
      
      {/* Main button */}
      <Link
        href="https://wa.me/2348143233472"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-500/50 transition duration-300 hover:shadow-xl hover:shadow-green-500/70 hover:scale-110 active:scale-95"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      </Link>

      {/* Hide button for accessibility */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-xs text-slate-400 hover:text-slate-200 transition opacity-0 group-hover:opacity-100"
        title="Hide WhatsApp button"
      >
        ✕
      </button>
    </div>
  );
}
