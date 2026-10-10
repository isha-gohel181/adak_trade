import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const missionPillars = [
  {
    num: "01",
    title: "Human Resource Development",
    desc: "Creating a pool of trained statisticians and research professionals equipped with the skills to tackle contemporary challenges in data science, analytics, and evidence-based decision-making.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    badge: "Capacity Building"
  },
  {
    num: "02",
    title: "Capacity Building & Training",
    desc: "Offering structured short- and medium-term training programs for both statistical and non-statistical professionals in research methodology, data management, monitoring & evaluation, and advanced analytics.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    badge: "Specialized Courses"
  },
  {
    num: "03",
    title: "Customized Training Solutions",
    desc: "Developing need-based training modules in collaboration with universities, research organizations, and industry leaders to ensure relevance and applicability in diverse fields.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    badge: "Institutional Tie-ups"
  },
  {
    num: "04",
    title: "Research & Knowledge Dissemination",
    desc: "Promoting multidisciplinary research by integrating statistics with domains such as public health, medicine, social sciences, agriculture, AI & machine learning, and economics.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    badge: "Multidisciplinary"
  },
  {
    num: "05",
    title: "National & International Engagement",
    desc: "Organizing training programs, workshops, and conferences at the international, national, state, and institutional levels to foster academic exchange and professional growth.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    badge: "Global Summits"
  },
  {
    num: "06",
    title: "Consultancy & Advisory Services",
    desc: "Providing expert consultation to governments, private organizations, and NGOs in survey design, data collection, monitoring & evaluation, and impact analysis.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    badge: "Policy & Impact"
  }
];

const MissionPillars = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mission-header', 
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          }
        }
      );

      gsap.fromTo('.mission-card', 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
          }
        }
      );
    }, containerRef);

    // Refresh ScrollTrigger after DOM renders
    const timer = setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch (e) {
        // ignore
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mission-header text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#EBF5FA] border border-[#047857]/20 text-[#047857] text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            <span className="w-2 h-2 rounded-full bg-[#BFD419] animate-pulse shadow-[0_0_6px_#BFD419]" />
            Core Mandate
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#047857] via-[#028DDb] to-[#005B8E]">Mission</span>
          </h2>
          
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            The mission of ADAK TRADE EFFORT is to nurture, empower, and advance financial and trading expertise for addressing the dynamic challenges of modern capital markets and investment landscapes. We achieve this by:
          </p>
        </div>

        {/* 6 Strategic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {missionPillars.map((pillar, i) => (
            <div 
              key={i} 
              className="mission-card bg-white border-[1.5px] border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-7 flex flex-col justify-between shadow-[4px_4px_0px_0px_#1E293B] hover:bg-[#EFF7CE] hover:shadow-[6px_6px_0px_0px_#1E293B] hover:-translate-y-1 hover:-translate-x-0.5 transition-all duration-300 min-w-0 group cursor-pointer"
            >
              <div className="min-w-0 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white border-[1.5px] border-slate-800 text-[#047857] flex items-center justify-center flex-shrink-0 group-hover:bg-slate-900 group-hover:text-[#BFD419] transition-colors duration-300 shadow-[1.5px_1.5px_0px_0px_#1E293B]">
                    {pillar.icon}
                  </div>
                  <span className="font-jetbrains text-sm font-bold text-slate-800 group-hover:text-[#047857] transition-colors">
                    {pillar.num}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-lg bg-white border border-slate-700 text-slate-900 text-[10px] font-bold uppercase tracking-wider font-jetbrains shadow-[1px_1px_0px_0px_#1E293B]">
                  {pillar.badge}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#047857] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MissionPillars;
