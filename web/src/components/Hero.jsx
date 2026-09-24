import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext'
import ConsultationModal from './consultation/ConsultationModal'

const Hero = ({ isLoaded }) => {
   const [isConsultationOpen, setIsConsultationOpen] = useState(false)
   const containerRef = useRef(null)
   const contentRef = useRef(null)
   const imageRef = useRef(null)
   const glassCard1 = useRef(null)
   const glassCard2 = useRef(null)
   const { t } = useLanguage()

   useEffect(() => {
      if (!isLoaded) return;

      const ctx = gsap.context(() => {
         const tl = gsap.timeline({
            defaults: { ease: 'expo.out', duration: 1.5 }
         })

         gsap.to(containerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.1 })
         gsap.set('.reveal-up', { y: 40, opacity: 0 })
         gsap.set(imageRef.current, { scale: 1.05, opacity: 0 })
         gsap.set([glassCard1.current, glassCard2.current], { scale: 0.95, opacity: 0, y: 20 })

         tl.to(imageRef.current, { scale: 1, opacity: 0.9, duration: 2.0 })
            .to('.reveal-up', { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.12 }, '-=1.8')
            .to(glassCard1.current, { scale: 1, opacity: 1, y: 0, duration: 1.0 }, '-=1.4')
            .to(glassCard2.current, { scale: 1, opacity: 1, y: 0, duration: 1.0 }, '-=1.2')

         // Continuous float animation for cards
         gsap.to(glassCard1.current, { y: '-=10', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
         gsap.to(glassCard2.current, { y: '+=8', duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }, containerRef)

      return () => ctx.revert()
   }, [isLoaded])

   return (
      <section ref={containerRef} className="relative min-h-[90vh] md:min-h-[95vh] bg-slate-50 flex items-center justify-center overflow-hidden opacity-0 pointer-events-none transition-opacity duration-300 pt-36 md:pt-44 pb-16">

         {/* Subtle Light Mesh Background */}
         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-100/70 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-100/60 rounded-full blur-[130px]" />
            <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-blue-50 rounded-full blur-[90px]" />
         </div>

         {/* Main Container */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">

            {/* Left Side: Typography & Core Messaging */}
            <div ref={contentRef} className="flex flex-col items-start space-y-6 pt-4 md:pt-0 min-w-0">
               <div className="reveal-up flex items-center gap-2.5 border border-blue-200 bg-blue-50/90 px-4 py-2 rounded-full shadow-xs">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="font-jetbrains text-[10px] md:text-xs text-blue-900 uppercase tracking-wider font-bold">
                     A Corporate Division of DCS Pvt. Ltd. • Recognized by DPIIT
                  </span>
               </div>

               <div className="flex flex-col w-full min-w-0">
                  <h1 className="reveal-up font-inter text-[clamp(2.2rem,5vw,4.2rem)] text-slate-900 font-black leading-[1.1] tracking-tight">
                     Advancing Statistical Science in <br className="hidden lg:block" />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900">
                        Research, Policy & Practice
                     </span>
                  </h1>
               </div>

               <p className="reveal-up font-inter text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                  The Institute of Applied Statistics (IAS) is a premier institution bridging knowledge and practice in biostatistics, clinical research, AI/ML, and evidence-based decision systems across healthcare, agriculture, and governance.
               </p>

               <div className="reveal-up pt-2 flex gap-3.5 w-full flex-col sm:flex-row flex-wrap">
                  <Link 
                     to="/courses"
                     className="bg-[#011753] text-white font-bold px-7 py-4 rounded-full font-inter text-xs uppercase tracking-wider hover:bg-blue-900 transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                     <span>Explore Programs</span>
                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform stroke-white">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" />
                     </svg>
                  </Link>
                  <button
                     type="button"
                     onClick={() => setIsConsultationOpen(true)}
                     className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-4 rounded-full font-inter text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                     </svg>
                     <span>Book Consultation</span>
                  </button>
                  <Link 
                     to="/about-us"
                     className="px-6 py-4 rounded-full font-inter text-xs font-bold uppercase tracking-wider border border-slate-300 text-slate-800 hover:bg-slate-100 transition-all flex items-center justify-center"
                  >
                     About IAS
                  </Link>
               </div>
            </div>

            {/* Right Side: Image & Metric Cards */}
            <div className="relative h-[55vh] lg:h-[75vh] w-full flex items-center justify-center mt-8 lg:mt-0 min-w-0">
               {/* Subject Image */}
               <img
                  ref={imageRef}
                  src="/bannner.png"
                  alt="IAS DCS"
                  className="absolute bottom-0 h-[90%] md:h-[100%] w-auto max-w-none object-contain drop-shadow-lg"
                  style={{
                     maskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)',
                     WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 98%)'
                  }}
               />

               {/* Metric 1 */}
               <div
                  ref={glassCard1}
                  className="absolute top-[15%] left-0 md:-left-8 lg:-left-12 bg-white/95 backdrop-blur-xl border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 max-w-[210px]"
               >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200 text-blue-700 flex-shrink-0">
                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                     </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="font-inter text-xl sm:text-2xl font-black text-[#011753] leading-none">50K+</span>
                     <span className="font-inter text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1 truncate">Researchers Trained</span>
                  </div>
               </div>

               {/* Metric 2 */}
               <div
                  ref={glassCard2}
                  className="absolute bottom-[20%] right-0 md:-right-6 lg:-right-10 bg-white/95 backdrop-blur-xl border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 max-w-[210px]"
               >
                  <div className="flex flex-col items-end text-right min-w-0">
                     <span className="font-inter text-xl sm:text-2xl font-black text-[#011753] leading-none">6+ Schemes</span>
                     <span className="font-inter text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1 truncate">R&D Governing Cells</span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-200 text-indigo-700 flex-shrink-0">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                     </svg>
                  </div>
               </div>
            </div>

         </div>

         {/* Consultation Booking Modal */}
         <ConsultationModal 
            isOpen={isConsultationOpen} 
            onClose={() => setIsConsultationOpen(false)} 
         />

      </section>
   )
}

export default Hero
