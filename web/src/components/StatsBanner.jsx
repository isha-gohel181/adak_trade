import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatsBanner = () => {
  const stats = [
    {
      id: 1,
      number: '10,000+',
      label: 'ACTIVE TRADERS',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 2,
      number: '50+',
      label: 'MARKET STRATEGIES',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      id: 3,
      number: '95%',
      label: 'SUCCESS RATE',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      )
    },
    {
      id: 4,
      number: '15+',
      label: 'EXPERT MENTORS',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full px-6 md:px-12 py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto bg-[#047857] rounded-xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4 hover:bg-white/5 transition-colors duration-300">
              <div className="text-white/90">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-extrabold font-inter tracking-tight">
                  {stat.number}
                </h3>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider font-jetbrains text-white/80">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;
