import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BrandFeatures = () => {
  const containerRef = useRef(null)

  const features = [
    {
      tag: "Medical Research",
      scheme: "Dr. Padam Singh Scheme",
      title: "Biostatistics & Clinical Trial Methodology",
      desc: "Comprehensive research guidance in clinical protocol design, sample size estimation, survival analysis, and epidemiological modeling for healthcare and medical faculties.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      points: ["Clinical Trial Protocol Design", "Meta-Analysis & Systematic Review", "Medical Journal Publication Support"]
    },
    {
      tag: "Traditional Medicine",
      scheme: "Maharshi Charak Scheme",
      title: "Ayurveda & AYUSH Research Analytics",
      desc: "Promoting evidence-based research across Ayurveda, Homoeopathy (Dr. C.F.S. Hahnemann Scheme), Unani, and Yoga through empirical validation and statistical rigor.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      points: ["Empirical Validation of Traditional Medicine", "AYUSH Clinical Research Methods", "Standardized Data Management"]
    },
    {
      tag: "Capacity Building",
      scheme: "Institutional Cells",
      title: "Onsite Workshops & Joint Training Centers",
      desc: "Establishing Joint Training Centers and conducting structured STTPs, CMEs, and faculty development programs tailored to universities, hospitals, and research institutes.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      points: ["Customized Onsite Institutional Training", "CME & CNE Accredited Modules", "3-6 Month Research Internships"]
    },
    {
      tag: "Data Science & AI",
      scheme: "Sir M. Visvesvaraya Scheme",
      title: "AI, Machine Learning & Computational Analytics",
      desc: "Bridging statistical theory with computational data engineering, Python, R, predictive modeling, and machine learning algorithms for modern multidisciplinary challenges.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      points: ["Predictive & Algorithmic Modeling", "Statistical Computing in R & Python", "High-Dimensional Data Engineering"]
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(['.features-header', '.feature-card-main'], { autoAlpha: 0, y: 15 })

      gsap.to('.features-header', { 
        y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-header',
          start: 'top 92%'
        }
      })

      gsap.utils.toArray('.feature-card-main').forEach((card, i) => {
        gsap.to(card, {
          y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', delay: i * 0.05,
          scrollTrigger: {
            trigger: card,
            start: 'top 94%'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-slate-50 overflow-hidden z-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Segment */}
        <div className="features-header text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            Specialized R&D Schemes & Cells
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Multidisciplinary Research & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900">
              Capacity Building Frameworks
            </span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            IAS operates dedicated research schemes in collaboration with universities, medical colleges, and research institutions nationwide to foster an evidence-based culture.
          </p>
        </div>

        {/* 2x2 Grid Architecture with Strict Overflow Safety */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card-main group relative bg-white border border-slate-200/90 p-7 md:p-9 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-lg rounded-2xl min-w-0"
            >
              <div className="space-y-5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:bg-[#011753] group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col items-end text-right min-w-0">
                    <span className="font-jetbrains text-[9px] text-blue-700 font-bold uppercase tracking-wider truncate max-w-[150px]">
                      {feature.tag}
                    </span>
                    <span className="font-jetbrains text-[8px] text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                      {feature.scheme}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors duration-300 break-words">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words font-normal">
                    {feature.desc}
                  </p>
                </div>

                {/* Key Points */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {feature.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="truncate">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link 
                  to="/courses"
                  className="font-jetbrains text-xs font-bold text-[#011753] group-hover:text-blue-600 uppercase tracking-wider flex items-center gap-2"
                >
                  Explore Programs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
                <span className="text-[10px] text-slate-400 font-jetbrains">IAS R&D Cell</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BrandFeatures
