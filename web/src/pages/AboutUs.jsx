import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo('.hero-animate', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );

      // Section scroll animations
      gsap.utils.toArray('.scroll-section').forEach(section => {
        gsap.fromTo(section,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
      desc: "Offering structured short- and medium-term training programs for both statistical and non-statistical professionals in research methodology, data management, monitoring & evaluation, and advanced analytics. Delivering specialized workshops, certificate courses, and professional development programs tailored to the needs of researchers, academicians, and professionals.",
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
      desc: "Promoting multidisciplinary research by integrating statistics with domains such as public health, medicine, social sciences, agriculture, AI & machine learning, and economics. Publishing, collaborating, and sharing insights to advance global scientific knowledge.",
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
      desc: "Providing expert consultation to governments, private organizations, and NGOs in survey design, data collection, monitoring & evaluation, program assessment, and impact analysis. Supporting evidence-based policymaking and strategic planning through robust statistical approaches.",
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

  const sectors = [
    {
      title: "Healthcare & Medicine",
      desc: "Biostatistics, clinical trial protocols, epidemiology, and biomedical analytics.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    },
    {
      title: "AI & Machine Learning",
      desc: "Applied predictive analytics, algorithmic modeling, and high-dimensional data processing.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    },
    {
      title: "Social Sciences & Policy",
      desc: "Socio-economic impact assessment, population studies, and governance evaluation.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z" />
        </svg>
      )
    },
    {
      title: "Agriculture & Environment",
      desc: "Yield modeling, ecological statistical forecasting, and environmental impact assessments.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      title: "Business & Technology",
      desc: "Corporate decision intelligence, risk analytics, and empirical market modeling.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      title: "Government & Advisory",
      desc: "Monitoring & Evaluation (M&E), nationwide surveys, and institutional policy research.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24" />
        </svg>
      )
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden pt-36 md:pt-44 pb-20">
      
      {/* Background Subtle Gradient Accents */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-100/60 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-amber-50/70 blur-[140px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-100px] w-[500px] h-[500px] bg-slate-200/50 blur-[140px] rounded-full" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative px-6 py-8 md:py-16 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Eyebrow Badge */}
        <div className="hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>A Corporate Division of DCS Pvt. Ltd.</span>
        </div>
        
        <h1 className="hero-animate text-[clamp(2.2rem,5vw,4.5rem)] font-black text-slate-900 leading-[1.12] tracking-tight mb-6 max-w-5xl">
          Institute of Applied Statistics <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900">
            Advancing Statistical Science in Policy & Practice
          </span>
        </h1>
        
        <p className="hero-animate text-base md:text-xl text-slate-600 max-w-4xl leading-relaxed font-normal mb-12">
          The Institute of Applied Statistics (IAS), a corporate division of DCS Pvt. Ltd., is a premier institution committed to advancing the science and application of statistics in research, policy, and practice. Established with the vision of bridging knowledge and practice, IAS plays a pivotal role in human resource development, capacity building, and multidisciplinary research.
        </p>

        {/* 4 Stat / Highlight Cards with strict sizing to prevent any overflow */}
        <div className="hero-animate grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl">
          {[
            { value: "6+", label: "Strategic Pillars" },
            { value: "50K+", label: "Trained Researchers" },
            { value: "Multi-Domain", label: "Medicine, AI, Policy" },
            { value: "Global", label: "Excellence & Impact" }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md hover:border-blue-400 transition-all duration-300 min-w-0"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#011753] mb-1 font-inter truncate w-full">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider font-jetbrains truncate w-full">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. INSTITUTIONAL OVERVIEW & FOUNDATION */}
      <section className="scroll-section px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden">
          
          {/* Left Column: Comprehensive Story */}
          <div className="lg:col-span-7 flex flex-col min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-widest mb-5 w-fit font-jetbrains">
              Institutional Foundation
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              Bridging the gap between <span className="text-blue-700">theoretical knowledge</span> and <span className="text-indigo-600">evidence-based practice</span>.
            </h2>

            <div className="space-y-4 text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              <p>
                We specialize in offering comprehensive training programs, consultancy services, and collaborative research opportunities that empower academicians, professionals, and organizations to make informed, data-driven decisions.
              </p>
              <p>
                Our focus lies not only in developing technical expertise in statistical methods but also in fostering an evidence-based culture across sectors such as healthcare, social sciences, agriculture, environment, business, and technology.
              </p>
              <p>
                By bringing together experts from academia, industry, and government institutions and organizations, IAS serves as a hub for innovation and knowledge exchange, enabling professionals to strengthen their research and analytical skills while contributing to national and global development goals.
              </p>
            </div>
          </div>

          {/* Right Column: Key Value Badges Card */}
          <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 flex flex-col justify-between">
              
              <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-200">
                <img 
                  src="/logo/iasdcs-logo.png" 
                  alt="IAS Logo" 
                  className="h-14 w-auto object-contain rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 font-inter truncate">Institute of Applied Statistics</h3>
                  <p className="text-[11px] font-semibold text-blue-700 tracking-wider uppercase truncate">Corporate Division of DCS Pvt. Ltd.</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Empowering Researchers & Academics</h4>
                    <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Rigorous modules in research design, sampling, and inferential analytics.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Evidence-Based Governance & Policy</h4>
                    <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Strategic consultation for public sector, NGOs, and enterprise leaders.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Hub for Multidisciplinary Innovation</h4>
                    <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Fostering collaboration between statisticians, clinicians, and engineers.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. OUR VISION SECTION */}
      <section className="scroll-section px-6 py-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-white border-2 border-blue-100 p-8 md:p-12 shadow-md overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-[0.2em] font-jetbrains">Strategic Direction</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Our Vision</h2>
            </div>
          </div>

          <div className="bg-blue-50/80 border-l-4 border-blue-700 p-6 md:p-8 rounded-r-2xl">
            <blockquote className="text-base sm:text-lg md:text-xl text-slate-800 font-medium leading-relaxed italic">
              "To establish the Institute of Applied Statistics (IAS) as a globally recognized center of excellence in statistical education, training, and research—driving innovation, enhancing evidence-based practices, and contributing to the development of a robust and sustainable statistical system that supports scientific inquiry and informed policy-making worldwide."
            </blockquote>
          </div>

        </div>
      </section>

      {/* 4. OUR MISSION & 6 STRATEGIC PILLARS */}
      <section className="scroll-section px-6 py-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-widest mb-3 font-jetbrains">
            Core Mandate
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Mission</h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            The mission of IAS is to nurture, empower, and advance statistical expertise for addressing the growing challenges of the modern research and professional landscape. We achieve this by:
          </p>
        </div>

        {/* 6 Mission Pillars Grid with strict overflow safeguards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missionPillars.map((pillar, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-7 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all duration-300 shadow-xs min-w-0"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0">
                    {pillar.icon}
                  </div>
                  <span className="font-jetbrains text-xs font-bold text-slate-400">
                    {pillar.num}
                  </span>
                </div>

                <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                  {pillar.badge}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MULTIDISCIPLINARY DOMAINS */}
      <section className="scroll-section px-6 py-12 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-md">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Multidisciplinary Reach</h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Fostering an evidence-based culture by embedding advanced statistical methodologies across vital sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {sectors.map((sec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 hover:border-blue-300 transition-colors min-w-0">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700 flex-shrink-0 shadow-xs">
                  {sec.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{sec.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">{sec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION / ENGAGE WITH IAS */}
      <section className="scroll-section px-6 py-8 max-w-7xl mx-auto text-center">
        <div className="rounded-3xl bg-[#011753] text-white p-8 md:p-14 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 max-w-2xl leading-tight">
            Partner with IAS for Training, Research & Consultancy
          </h2>
          
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed font-normal">
            Whether you are an individual researcher aiming to master modern data analytics or an institution looking for survey design & policy consultation, IAS is your trusted partner.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link 
              to="/courses" 
              className="px-6 py-3.5 rounded-full bg-white text-[#011753] font-bold uppercase tracking-wider text-xs hover:bg-slate-100 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              Explore Training Programs
            </Link>
            <Link 
              to="/contact" 
              className="px-6 py-3.5 rounded-full bg-blue-600 border border-blue-500 text-white font-bold uppercase tracking-wider text-xs hover:bg-blue-500 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              Institutional Consultation
            </Link>
            <Link 
              to="/forum" 
              className="px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold uppercase tracking-wider text-xs hover:bg-white/20 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              Join Academic Forum
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;
