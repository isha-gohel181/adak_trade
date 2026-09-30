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

         tl.to(imageRef.current, { scale: 1, opacity: 1, duration: 1.8 })
            .to('.reveal-up', { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.12 }, '-=1.5')
      }, containerRef)

      return () => ctx.revert()
   }, [isLoaded])

   return (
      <section ref={containerRef} className="relative min-h-[85vh] lg:min-h-[88vh] bg-[#fafcff] flex items-center justify-center overflow-hidden opacity-0 pointer-events-none transition-opacity duration-300 pt-32 md:pt-36 pb-12 md:pb-16">

         {/* Hero Background Image Layer */}
         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
               className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
               style={{ backgroundImage: "url('/hero_bg.png')" }}
            />
            {/* Subtle soft tint gradients for depth */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#017DC3]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#BFD419]/5 rounded-full blur-[130px]" />
         </div>

         {/* Main Container */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full">

            {/* Left Side: Typography & Core Messaging (Balanced 6 cols) */}
            <div ref={contentRef} className="lg:col-span-6 flex flex-col items-start space-y-5 pt-2 md:pt-0 min-w-0">
               <div className="flex flex-col w-full min-w-0">
                  <h1 className="reveal-up font-inter text-3xl sm:text-4xl md:text-[2.6rem] lg:text-[2.75rem] text-slate-900 font-extrabold leading-[1.18] tracking-tight">
                     Advancing Research Through <br className="hidden sm:block" />
                     <span className="text-[#017DC3]">
                        Applied Statistics & Analytics
                     </span>
                  </h1>
               </div>

               <p className="reveal-up font-inter text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
                  Providing specialized training, clinical research methodology, and statistical consultancy for scholars, medical faculties, and academic institutions nationwide.
               </p>

               {/* Action Buttons */}
               <div className="reveal-up pt-2 flex gap-3.5 w-full flex-col sm:flex-row flex-wrap items-stretch sm:items-center">
                  <Link 
                     to="/courses"
                     className="bg-[#017DC3] hover:bg-[#006AA7] text-white font-bold px-7 py-3.5 rounded-full font-inter text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(1,125,195,0.35)] flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
                  >
                     <span>Explore Programs</span>
                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform stroke-white">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" />
                     </svg>
                  </Link>
                  <button
                     type="button"
                     onClick={() => setIsConsultationOpen(true)}
                     className="bg-[#BFD419] hover:bg-[#A8BC14] text-slate-900 font-bold px-7 py-3.5 rounded-full font-inter text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(191,212,25,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                     </svg>
                     <span>Book Consultation</span>
                  </button>
               </div>
            </div>

            {/* Right Side: Clean Transparent Banner Illustration (Balanced 6 cols) */}
            <div className="lg:col-span-6 relative h-[48vh] sm:h-[56vh] lg:h-[68vh] w-full flex items-center justify-center mt-4 lg:mt-0 min-w-0">
               <img
                  ref={imageRef}
                  src="/hero_banner.png"
                  alt="IAS DCS - Statistical Science & Research"
                  className="w-auto h-full max-h-[96%] max-w-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700 ease-out"
               />
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
