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
         gsap.set(imageRef.current, { scale: 0.9, opacity: 0, rotation: -5 })

         tl.to(imageRef.current, { scale: 1, opacity: 1, rotation: 0, duration: 1.8 })
           .to('.reveal-up', { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.12 }, '-=1.5')
      }, containerRef)

      return () => ctx.revert()
   }, [isLoaded])

   return (
      <section ref={containerRef} className="relative min-h-[85vh] lg:min-h-[88vh] bg-[#FFFBF5] flex items-center justify-center overflow-hidden opacity-0 pointer-events-none transition-opacity duration-300 pt-32 md:pt-36 pb-12 md:pb-16 font-inter">

         {/* Subtle Background Elements inspired by Invesmate */}
         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Sparkle/Stars SVG */}
            <svg className="absolute top-1/4 left-[10%] w-6 h-6 text-[#047857] opacity-30" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" />
            </svg>
            <svg className="absolute top-[15%] right-[40%] w-5 h-5 text-[#f6ad55] opacity-50" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 0l1.5 6 6 1.5-6 1.5-1.5 6-1.5-6-6-1.5 6-1.5z" />
            </svg>
            <svg className="absolute bottom-[20%] left-[45%] w-3 h-3 text-[#f6ad55] opacity-40" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 0l1.5 6 6 1.5-6 1.5-1.5 6-1.5-6-6-1.5 6-1.5z" />
            </svg>

            {/* Decorative dotted blob */}
            <div className="absolute right-[5%] top-[30%] w-16 h-16 opacity-20">
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#e28743" d="M42.7,-74C56.6,-66.5,70,-56.3,77.6,-43.1C85.2,-29.9,87.1,-13.7,85.1,1.8C83.1,17.3,77.3,32.1,68,44C58.7,55.9,46,64.8,32.1,72C18.2,79.2,3.1,84.7,-11.7,83.9C-26.5,83.1,-41,75.9,-53.4,66.1C-65.8,56.3,-76.1,43.9,-81.6,29.4C-87.1,14.9,-87.8,-1.7,-82.7,-16.1C-77.6,-30.5,-66.7,-42.7,-53.8,-51.2C-40.9,-59.7,-26,-64.5,-11.5,-67C3,-69.5,17.9,-69.7,28.8,-71.5Z" transform="translate(100 100)" />
               </svg>
               <div className="absolute inset-0 bg-[#FFFBF5] rounded-full mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#e28743 20%, transparent 20%)', backgroundSize: '10px 10px' }}></div>
            </div>
         </div>

         {/* Main Container */}
         <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">

            {/* Left Side: Typography & Core Messaging */}
            <div ref={contentRef} className="lg:col-span-6 flex flex-col items-start space-y-5 pt-2 md:pt-0 min-w-0">
               
               <h1 className="reveal-up text-4xl sm:text-5xl md:text-[3.5rem] text-[#1a202c] font-bold leading-[1.1] tracking-tight">
                  Your Path to <br />
                  <span className="text-[#047857]">Financial Freedom</span><br />
                  Starts Here
               </h1>

               <p className="reveal-up text-lg text-slate-600 max-w-lg leading-relaxed font-normal mt-4">
                  ADAK TRADE EFFORT has everything you need to succeed. Start learning today and take control of your financial future.
               </p>

               {/* Action Buttons */}
               <div className="reveal-up pt-6 flex gap-4 w-full flex-col sm:flex-row flex-wrap items-stretch sm:items-center">
                  <Link 
                     to="/courses"
                     className="bg-[#047857] hover:bg-[#005a90] text-white font-semibold px-8 py-3.5 rounded-md text-base transition-all flex items-center justify-center gap-2 group shadow-lg"
                  >
                     <span>Start Your Journey</span>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform stroke-white">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" />
                     </svg>
                  </Link>
                  <a
                     href="tel:+917908927127"
                     className="bg-transparent hover:bg-slate-100 text-[#1a202c] border-2 border-[#1a202c] font-semibold px-8 py-3.5 rounded-md text-base transition-all flex items-center justify-center gap-2 group"
                  >
                     <i className="fas fa-phone-alt mr-1"></i>
                     <span>Call: +91 7908927127</span>
                  </a>
               </div>
            </div>

            {/* Right Side: Circular Masked Image (Invesmate Style) */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center mt-8 lg:mt-0 min-w-0">
               <div ref={imageRef} className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                  {/* Outer Stroke Circle (Yellow/Orange) */}
                  <div className="absolute inset-0 border-[3px] border-[#f6ad55] rounded-full scale-[1.05] border-dashed animate-[spin_60s_linear_infinite]" style={{ borderDasharray: "20, 10" }}></div>
                  <div className="absolute inset-0 border-4 border-[#047857] border-t-transparent border-r-transparent rounded-full scale-[1.08] opacity-50 rotate-45"></div>

                  {/* Play Button Floating Element (Decorative) */}
                  <div className="absolute right-0 bottom-[15%] w-14 h-14 bg-[#f6ad55] rounded-full flex items-center justify-center shadow-xl z-20 cursor-pointer hover:scale-110 transition-transform">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                     </svg>
                  </div>

                  {/* Circular Image Wrapper */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-[8px] border-white z-10 bg-slate-100">
                     <img
                        src="https://adaktradeeffort.com/assets/images/post-1.jpg"
                        alt="ADAK Trade Effort Class"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
                     />
                  </div>
               </div>
            </div>

         </div>

         <ConsultationModal 
            isOpen={isConsultationOpen} 
            onClose={() => setIsConsultationOpen(false)} 
         />

      </section>
   )
}

export default Hero
