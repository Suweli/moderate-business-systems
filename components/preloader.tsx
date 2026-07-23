'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Stop at 90% until page fully loads
        return prev + Math.random() * 30;
      });
    }, 300);

    // Handle actual page load completion
    const handleLoad = () => {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600); // Smooth fade out after reaching 100%
      return () => clearTimeout(timer);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-700 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Logo with subtle glow animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/30 to-brand-400/30 blur-2xl animate-pulse" />
          <div className="relative flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32">
            <Image
              src="/logo.png"
              alt="MBS Logo"
              width={400}
              height={160}
              className="h-full w-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <p className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight animate-fade-in">
            MODERATE
          </p>
          <p className="text-slate-400 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wider animate-fade-in animation-delay-100">
            Business Systems Ltd
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 sm:w-64 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-brand-500/50"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Loading Percentage */}
        <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-3">
          {Math.round(progress)}%
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
