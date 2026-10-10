import React, { useState } from 'react';
import ConsultationModal from './ConsultationModal';

const ConsultationBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="consultation" className="relative w-full py-16 md:py-24 bg-[#047857] overflow-hidden font-inter text-white">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      {/* Top right swirl decoration */}
      <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
         <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 C 20 10 10 40 10 50 C 10 80 40 90 50 90 C 80 90 90 60 90 50 C 90 20 60 10 50 10 Z" stroke="white" strokeWidth="2" strokeDasharray="5,5"/>
            <path d="M50 20 C 30 20 20 40 20 50 C 20 70 40 80 50 80 C 70 80 80 60 80 50 C 80 30 60 20 50 20 Z" stroke="white" strokeWidth="2" />
         </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Area */}
          <div className="space-y-6 min-w-0">
            
            <div className="uppercase tracking-widest text-sm font-bold text-white mb-2">
              Accelerate Your Trading Career
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#f6ad55] leading-tight">
                The Ultimate Power Strategy
              </h2>
              <div className="inline-block bg-white text-[#047857] px-4 py-2 font-bold text-xl rounded shadow-sm">
                ADAK TRADE EFFORT
              </div>
            </div>

            <div className="pt-4 space-y-2 uppercase font-bold text-sm tracking-wide">
              <p>PRACTICAL PROGRAM + MENTORSHIP</p>
              <p>JOIN EXCLUSIVE FREE DEMO CLASS</p>
            </div>
            
          </div>

          {/* Right Lead Capture Form Area */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
              Join Exclusive <br/> ADAK TRADE Masterclass
            </h3>
            
            <div className="bg-transparent space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Name*" className="w-full px-4 py-3 bg-[#fdfbf7] text-slate-800 rounded outline-none focus:ring-2 focus:ring-[#f6ad55]" />
                  <input type="email" placeholder="Email*" className="w-full px-4 py-3 bg-[#fdfbf7] text-slate-800 rounded outline-none focus:ring-2 focus:ring-[#f6ad55]" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone*" className="w-full px-4 py-3 bg-[#fdfbf7] text-slate-800 rounded outline-none focus:ring-2 focus:ring-[#f6ad55]" />
                  <select className="w-full px-4 py-3 bg-[#fdfbf7] text-slate-800 rounded outline-none focus:ring-2 focus:ring-[#f6ad55]">
                     <option value="">Select Language</option>
                     <option value="english">English</option>
                     <option value="hindi">Hindi</option>
                     <option value="bengali">Bengali</option>
                  </select>
               </div>
               
               <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-4 bg-white hover:bg-slate-100 text-[#047857] font-bold text-lg px-8 py-3.5 rounded transition-all flex items-center justify-center gap-2 group cursor-pointer"
               >
                  <span>Register Now</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                     <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
               </button>
            </div>

          </div>

        </div>
      </div>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default ConsultationBanner;
