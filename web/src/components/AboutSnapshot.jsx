import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const AboutSnapshot = () => {
   const containerRef = useRef(null);
   const imageRef = useRef(null);
   const textRef = useRef(null);

   useEffect(() => {
      const ctx = gsap.context(() => {
         // Image entrance
         gsap.from(imageRef.current, {
            scrollTrigger: {
               trigger: containerRef.current,
               start: 'top 80%',
            },
            x: -35,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
         });

         // Text stagger
         gsap.from('.snapshot-text', {
            scrollTrigger: {
               trigger: containerRef.current,
               start: 'top 75%',
            },
            y: 25,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
         });
      }, containerRef);

      return () => ctx.revert();
   }, []);

   return (
      <section ref={containerRef} className="py-16 md:py-20 bg-white text-slate-900 relative overflow-hidden border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Plain Image without badges or wrapper cards */}
            <div ref={imageRef} className="lg:col-span-6 flex items-center justify-center min-w-0">
               <img 
                  src="/landing_book.png" 
                  alt="IAS Knowledge & Statistical Research" 
                  className="w-full max-w-md lg:max-w-lg h-auto max-h-[360px] md:max-h-[400px] object-contain drop-shadow-md"
               />
            </div>

            {/* Right: Text Content */}
            <div ref={textRef} className="lg:col-span-6 flex flex-col items-start min-w-0">
               <div className="snapshot-text inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF5FA] border border-[#017DC3]/20 text-[#017DC3] text-[11px] font-bold uppercase tracking-widest mb-3 font-jetbrains">
                  <span className="w-2 h-2 rounded-full bg-[#BFD419] animate-pulse shadow-[0_0_6px_#BFD419]" />
                  About IAS DCS
               </div>
               
               <h2 className="snapshot-text text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.35rem] font-extrabold text-slate-900 leading-[1.22] mb-4">
                  Advancing the Science & Application of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#017DC3] via-[#028DDb] to-[#005B8E]">Statistics.</span>
               </h2>
               
               <p className="snapshot-text text-sm sm:text-base text-slate-600 mb-5 leading-relaxed font-normal">
                  The Institute of Applied Statistics (IAS), a corporate division of DCS Pvt. Ltd., is a premier institution committed to advancing the science and application of statistics in research, policy, and practice. Established with the vision of bridging knowledge and practice, IAS plays a pivotal role in capacity building and multidisciplinary research.
               </p>

               <ul className="snapshot-text space-y-2.5 mb-6 w-full">
                  {[
                     "Human Resource Development & structured training in data science & analytics",
                     "Multidisciplinary research in public health, medicine, agriculture & AI",
                     "Consultancy for governments, organizations & NGOs in survey design & impact analysis"
                  ].map((item, index) => (
                     <li key={index} className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm font-normal">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F6F9D7] border border-[#BFD419]/40 text-[#7D8D0C] flex items-center justify-center mt-0.5">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                           </svg>
                        </div>
                        <span className="break-words">{item}</span>
                     </li>
                  ))}
               </ul>

               <div className="snapshot-text flex flex-wrap gap-3.5">
                  <Link 
                     to="/about-us" 
                     className="inline-flex items-center justify-center gap-2 bg-[#017DC3] text-white px-7 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#006AA7] transition-all duration-300 shadow-[0_4px_20px_rgba(1,125,195,0.35)] hover:scale-105 active:scale-95 group"
                  >
                     Discover Our Vision & Mission
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                     </svg>
                  </Link>
                  <Link 
                     to="/courses" 
                     className="inline-flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-800 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-all duration-300"
                  >
                     Explore Courses
                  </Link>
               </div>
            </div>

         </div>
      </section>
   );
};

export default AboutSnapshot;
