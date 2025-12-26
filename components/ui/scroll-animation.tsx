'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animationType?: 'slideUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  threshold?: number;
  delay?: number;
}

export function ScrollAnimation({
  children,
  className = '',
  animationType = 'slideUp',
  threshold = 0.1,
  delay = 0
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, delay]);

  const animationClass = animationType === 'slideUp'
    ? 'animate-on-scroll'
    : `animate-${animationType === 'fadeIn' ? 'fade-in' : animationType === 'slideLeft' ? 'slide-left' : animationType === 'slideRight' ? 'slide-right' : 'scale'}`;

  return (
    <div ref={ref} className={`${animationClass} ${className}`}>
      {children}
    </div>
  );
}
