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
      <section ref={containerRef} className="py-20 md:py-28 bg-white text-slate-900 relative overflow-hidden border-y border-slate-200">
         {/* Decorative background accents */}
         <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-blue-50/70 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
         <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-slate-100 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />
         
         <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left: Visual Representation */}
            <div ref={imageRef} className="w-full lg:w-1/2 relative min-w-0">
               <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-[4/3]">
                  <img 
                     src="/hero_section.png" 
                     alt="Institute of Applied Statistics" 
                     className="w-full h-full object-cover"
                     onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                     }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/20 to-transparent" />
                  
                  {/* Bottom internal caption */}
                  <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center gap-3">
                     <img src="/logo/iasdcs-logo.png" alt="IAS Logo" className="h-9 w-auto rounded-lg bg-slate-50 p-1 border border-slate-200 flex-shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate font-inter">Institute of Applied Statistics</p>
                        <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider font-jetbrains truncate">Corporate Division of DCS Pvt. Ltd.</p>
                     </div>
                  </div>
               </div>
               
               {/* Floating stat card */}
               <div className="absolute -bottom-5 -right-5 md:bottom-6 md:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200 max-w-[200px]">
                  <div className="w-9 h-9 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center mb-2 text-blue-700">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                     </svg>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-[#011753] leading-none">6 Pillars</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider font-jetbrains">Excellence in Statistics</p>
               </div>
            </div>

            {/* Right: Text Content */}
            <div ref={textRef} className="w-full lg:w-1/2 min-w-0">
               <div className="snapshot-text inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-widest mb-5 font-jetbrains">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  About IAS DCS
               </div>
               
               <h2 className="snapshot-text text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] mb-6">
                  Advancing the Science & Application of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">Statistics.</span>
               </h2>
               
               <p className="snapshot-text text-sm sm:text-base md:text-lg text-slate-600 mb-6 leading-relaxed font-normal">
                  The Institute of Applied Statistics (IAS), a corporate division of DCS Pvt. Ltd., is a premier institution committed to advancing the science and application of statistics in research, policy, and practice. Established with the vision of bridging knowledge and practice, IAS plays a pivotal role in capacity building and multidisciplinary research.
               </p>

               <ul className="snapshot-text space-y-3 mb-8">
                  {[
                     "Human Resource Development & structured training in data science & analytics",
                     "Multidisciplinary research in public health, medicine, agriculture & AI",
                     "Consultancy for governments, organizations & NGOs in survey design & impact analysis"
                  ].map((item, index) => (
                     <li key={index} className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm font-normal">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mt-0.5">
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
                     className="inline-flex items-center justify-center gap-2 bg-[#011753] text-white px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-blue-900 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group"
                  >
                     Discover Our Vision & Mission
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                     </svg>
                  </Link>
                  <Link 
                     to="/courses" 
                     className="inline-flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-800 px-6 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-all duration-300"
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
