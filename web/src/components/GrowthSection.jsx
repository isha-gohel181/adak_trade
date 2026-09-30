import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GrowthSection = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.growth-content', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      })

      gsap.from('.growth-image', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
        x: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const awards = [
    {
      title: "Late Padmashree Prof. R.H. Singh Travel Grant",
      desc: "Financial assistance and travel sponsorship for young researchers presenting statistical papers at national & global conferences."
    },
    {
      title: "Late Shri Ram Krishna Pandey Memorial Award",
      desc: "Recognizing outstanding annual contributions in empirical research, capacity building, and innovative statistical methodology."
    },
    {
      title: "Aseema National AYUSH Award",
      desc: "Prestigious honors conferred upon researchers demonstrating high-impact evidence-based innovations in AYUSH & traditional medicine."
    }
  ]

  return (
    <section ref={containerRef} className="w-full bg-slate-50 py-16 md:py-20 px-6 md:px-12 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Awards & Grants Info (7 cols) */}
        <div className="growth-content lg:col-span-7 space-y-5 min-w-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF5FA] border border-[#017DC3]/20 text-[#017DC3] text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            <span className="w-2 h-2 rounded-full bg-[#BFD419] animate-pulse shadow-[0_0_6px_#BFD419]" />
            Awards, Grants & Institutional MoUs
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-[2.2rem] font-extrabold text-slate-900 leading-[1.22]">
            Fostering Academic Excellence & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#017DC3] via-[#028DDb] to-[#005B8E]">
              Research Travel Grants.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            IAS actively supports students, scholars, and faculty members through structured research travel grants, memorial excellence awards, and institutional MoUs to establish Joint Training Centers nationwide.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {awards.map((award, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1.5 min-w-0 hover:border-[#017DC3]/40 hover:shadow-sm transition-all">
                <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                  {award.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 font-normal">
                  {award.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap gap-3.5">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#017DC3] text-white px-7 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#006AA7] transition-all duration-300 shadow-[0_4px_20px_rgba(1,125,195,0.35)] hover:scale-105 active:scale-95 group"
            >
              Sign MoU / Partner
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
            <Link
              to="/about-us"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-100 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Side: Clean Top-Down Desk Illustration (landing_iamge.png) */}
        <div className="growth-image lg:col-span-5 flex items-center justify-center min-w-0">
          <img 
            src="/landing_iamge.png" 
            alt="IAS Research & Analytics Workstation" 
            className="w-full max-w-md lg:max-w-full h-auto max-h-[360px] md:max-h-[400px] object-contain drop-shadow-md"
          />
        </div>

      </div>
    </section>
  )
}

export default GrowthSection
