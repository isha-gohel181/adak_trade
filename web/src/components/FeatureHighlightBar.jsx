import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const FeatureHighlightBar = () => {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      title: "150+ Member Universities",
      desc: "Recognized training partner for medical colleges, AYUSH faculties, and premier research universities.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Classical University / Campus Building Icon */}
          <path d="M3 21h18" />
          <path d="M5 21V10l7-5 7 5v11" />
          <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
          <path d="M10 10h4" />
          <path d="M12 3v2" />
        </svg>
      ),
      bg: "bg-[#EBF5FA]",
      iconColor: "text-[#047857]"
    },
    {
      title: "Curated Study Materials",
      desc: "Standardized biostatistical modules, clinical trial protocols, sample size guides, and empirical datasets.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Swatches / Learning Materials Icon */}
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8" />
          <path d="M8 11h6" />
        </svg>
      ),
      bg: "bg-[#F6F9D7]",
      iconColor: "text-[#4d5705]"
    },
    {
      title: "Professional Certification",
      desc: "Hands-on workshops in Jamovi, SPSS, R-analytics, ICMR protocol drafting, and publication mentorship.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Stethoscope / Medical & Healthcare Analytics Icon */}
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      ),
      bg: "bg-[#EBF5FA]",
      iconColor: "text-[#047857]"
    }
  ]

  return (
    <section ref={containerRef} className="relative w-full bg-[#fafcff] pt-2 pb-14 md:pb-18 px-6 md:px-12 z-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Centered Top Heading */}
        <p className="text-center font-inter text-xs sm:text-sm font-semibold text-slate-600 tracking-wide mb-6 md:mb-7">
          Empowering researchers from more than 160+ member universities & institutions
        </p>

        {/* Neo-brutalist / Modern Highlight Strip Card */}
        <div
          ref={cardRef}
          className="bg-white border-2 border-slate-900 rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:px-10 lg:py-8 shadow-[6px_6px_0px_#0F172A] hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-4 sm:gap-5 group ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-6 lg:pl-8' : ''}`}
              >
                {/* Icon in Rounded Box */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-slate-900 ${feat.bg} ${feat.iconColor} flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2`}>
                  {feat.icon}
                </div>

                {/* Text Content */}
                <div className="flex flex-col min-w-0">
                  <h3 className="font-inter font-bold text-slate-900 text-base md:text-[17px] tracking-tight leading-snug mb-1.5 group-hover:text-[#047857] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="font-inter text-xs text-slate-600 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default FeatureHighlightBar
