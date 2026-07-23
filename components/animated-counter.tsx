'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ReactNode;
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '', 
  label,
  icon 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div 
      ref={ref} 
      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center hover:border-brand-400/50 hover:bg-slate-900/70 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/20"
    >
      {icon && <div className="mb-2 flex justify-center text-3xl text-brand-400">{icon}</div>}
      <div className="text-3xl sm:text-4xl font-bold text-brand-300">
        {prefix}
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  );
}
