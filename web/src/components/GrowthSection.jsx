import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GrowthSection = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.grants-card', {
        scrollTrigger: {
          trigger: '.grants-card',
          start: 'top 92%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
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
    <section ref={containerRef} className="w-full bg-slate-50 py-16 md:py-24 px-4 md:px-12 lg:px-20 overflow-x-hidden border-t border-slate-200">
      
      <div className="grants-card max-w-7xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 md:p-14 shadow-md flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Side: Awards & Grants Info */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            Awards, Grants & Institutional MoUs
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Fostering Academic Excellence & <br className="hidden sm:block" />
            <span className="text-blue-700">Research Travel Grants</span>
          </h2>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            IAS actively supports students, scholars, and faculty members through structured research travel grants, memorial excellence awards, and institutional MoUs to establish Joint Training Centers nationwide.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {awards.map((award, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                  {award.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                  {award.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Partnership Action Box */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-4 flex-shrink-0">
          <div className="p-6 rounded-2xl bg-[#011753] text-white text-center lg:text-left space-y-4 max-w-sm shadow-xl">
            <h3 className="font-bold text-lg text-white font-inter">Institutional MoU & Collaboration</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              Partner your university, medical college, or hospital with IAS to establish an accredited Joint Training Center and R&D cell.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-full bg-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-blue-400 transition-all text-center shadow-md"
              >
                Sign MoU / Partner
              </Link>
              <Link
                to="/about-us"
                className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

      </div>

    </section>
  )
}

export default GrowthSection
