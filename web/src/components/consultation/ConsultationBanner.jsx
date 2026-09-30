import React, { useState } from 'react';
import ConsultationModal from './ConsultationModal';

const ConsultationBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="consultation" className="relative w-full py-16 md:py-20 bg-[#EBF5FA] overflow-hidden border-t border-[#017DC3]/20">
      {/* Background Subtle Ambient Highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#017DC3]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#BFD419]/15 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Area (Columns 1 to 7) */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#017DC3]/25 text-[#017DC3] text-[11px] font-jetbrains font-bold uppercase tracking-widest shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#BFD419] animate-pulse shadow-[0_0_6px_#BFD419]" />
              <span>DARC Support Helpline</span>
            </div>

            {/* Title & Subtitles */}
            <div className="space-y-2">
              <h2 className="font-inter text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Book a Consultation <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#017DC3] via-[#028DDb] to-[#005B8E]">
                  (DARC Support Helpline)
                </span>
              </h2>
              <p className="font-inter text-base sm:text-lg font-bold text-slate-700">
                Talk to statistical experts and plan your research workflow.
              </p>
            </div>

            {/* Description */}
            <p className="font-inter text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
              Connect 1-on-1 with senior statisticians and academic mentors for tailored guidance on study design, sample size determination, data analysis workflows, and research publications.
            </p>

            {/* Feature Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#017DC3]/20 shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-[#EBF5FA] text-[#017DC3] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-inter text-xs text-slate-800 font-bold">15-Min Free Session</span>
              </div>
              
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#017DC3]/20 shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-[#EBF5FA] text-[#017DC3] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-inter text-xs text-slate-800 font-bold">Study Design Advice</span>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#017DC3]/20 shadow-xs col-span-2 sm:col-span-1">
                <div className="w-6 h-6 rounded-lg bg-[#EBF5FA] text-[#017DC3] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-inter text-xs text-slate-800 font-bold">1-on-1 Mentorship</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-[#017DC3] hover:bg-[#006AA7] text-white font-inter font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_4px_20px_rgba(1,125,195,0.35)] flex items-center justify-center gap-2.5 group hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Book Free Consultation</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

          {/* Right Card Visual / Highlight Box (Columns 8 to 12) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center min-w-0">
            <div className="w-full max-w-sm rounded-3xl bg-white border border-[#017DC3]/25 p-6 md:p-7 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FA] border border-[#017DC3]/30 flex items-center justify-center text-[#017DC3]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-inter font-bold text-slate-900 text-xs">Live Slot Booking</h4>
                    <p className="font-inter text-[10px] text-slate-500 font-medium">Fast & Confidential</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#BFD419]/20 border border-[#BFD419]/40 text-[#7D8D0C] text-[10px] font-bold font-jetbrains">
                  Active
                </span>
              </div>

              {/* Sample Slot Previews */}
              <div className="space-y-2 font-inter text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#BFD419] shadow-[0_0_6px_#BFD419]" />
                    <span className="text-slate-800 font-semibold">10:00 AM - 10:15 AM</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#BFD419]/30 text-[#7D8D0C] text-[10px] font-bold font-jetbrains">
                    FREE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#BFD419] shadow-[0_0_6px_#BFD419]" />
                    <span className="text-slate-800 font-semibold">07:00 PM - 07:15 PM</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#BFD419]/30 text-[#7D8D0C] text-[10px] font-bold font-jetbrains">
                    FREE
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#017DC3] hover:bg-[#006AA7] text-white font-inter text-xs font-bold text-center transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
              >
                View All Dates & Slots →
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* Consultation Booking Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default ConsultationBanner;
