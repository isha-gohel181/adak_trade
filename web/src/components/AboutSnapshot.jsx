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
      <section ref={containerRef} className="py-20 bg-white text-slate-900 relative overflow-hidden font-inter">
         
         {/* Decorative Dots Background (top right) */}
         <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               <circle cx="10" cy="10" r="2" fill="#047857"/>
               <circle cx="30" cy="10" r="2" fill="#047857"/>
               <circle cx="50" cy="10" r="2" fill="#047857"/>
               <circle cx="70" cy="10" r="2" fill="#047857"/>
               <circle cx="90" cy="10" r="2" fill="#047857"/>
               <circle cx="10" cy="30" r="2" fill="#047857"/>
               <circle cx="30" cy="30" r="2" fill="#047857"/>
               <circle cx="50" cy="30" r="2" fill="#047857"/>
               <circle cx="70" cy="30" r="2" fill="#047857"/>
               <circle cx="90" cy="30" r="2" fill="#047857"/>
               <circle cx="10" cy="50" r="2" fill="#047857"/>
               <circle cx="30" cy="50" r="2" fill="#047857"/>
               <circle cx="50" cy="50" r="2" fill="#047857"/>
               <circle cx="70" cy="50" r="2" fill="#047857"/>
               <circle cx="90" cy="50" r="2" fill="#047857"/>
            </svg>
         </div>

         <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Image Collage / Large Image */}
            <div ref={imageRef} className="relative w-full max-w-[500px] mx-auto lg:mx-0 flex items-center justify-center min-w-0">
               {/* Background colored block behind image */}
               <div className="absolute -left-6 -bottom-6 w-3/4 h-3/4 bg-slate-100 -z-10 rounded-lg"></div>
               
               {/* Main Image */}
               <img 
                  src="https://adaktradeeffort.com/assets/images/post-2.jpg" 
                  alt="ADAK TRADE Class" 
                  className="w-full h-auto object-cover rounded-md shadow-xl z-10 border-4 border-white"
               />
               
               {/* Floating secondary image (Optional, creates collage effect) */}
               <div className="absolute -right-8 -top-8 w-1/3 bg-white p-2 shadow-lg rounded-sm z-20 hidden sm:block">
                  <img src="https://adaktradeeffort.com/assets/images/post-3.jpg" alt="ADAK Trade Seminar" className="w-full h-auto object-cover" />
               </div>
            </div>

            {/* Right: Text Content & Features */}
            <div ref={textRef} className="flex flex-col items-start min-w-0">
               <div className="snapshot-text text-[#047857] text-xs font-bold uppercase tracking-widest mb-2">
                  Learn The Stock Market Anytime, Anywhere!
               </div>
               
               <h2 className="snapshot-text text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-[#1a202c] leading-tight mb-8">
                  Know About ADAK TRADE EFFORT
               </h2>
               
               <div className="snapshot-text space-y-8 mb-8 w-full">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-5">
                     <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f0f7fb] flex items-center justify-center border border-[#e0eff8]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                     </div>
                     <div>
                        <h3 className="text-xl font-semibold text-[#1a202c] mb-2">Trusted Mentorship</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                           Professional Trader Mentorship & structured courses bridging theoretical analysis and practical trading.
                        </p>
                     </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-5">
                     <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#fffcf5] flex items-center justify-center border border-[#ffecd1]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                     </div>
                     <div>
                        <h3 className="text-xl font-semibold text-[#1a202c] mb-2">Years of Excellence</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                           Empowering students to achieve financial success through advanced quantitative trading setups and risk management.
                        </p>
                     </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-5">
                     <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f4f7d4] flex items-center justify-center border border-[#e8eed1]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7D8D0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                     </div>
                     <div>
                        <h3 className="text-xl font-semibold text-[#1a202c] mb-2">Powerful Program</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                           Every market course module is thoughtfully designed and includes consultancy for retail and institutional traders.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="snapshot-text">
                  <Link 
                     to="/about-us" 
                     className="inline-flex items-center justify-center gap-2 bg-[#047857] text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:bg-[#047857] transition-all duration-300 shadow-md group"
                  >
                     Know About Us
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                     </svg>
                  </Link>
               </div>
            </div>

         </div>
      </section>
   );
};

export default AboutSnapshot;
