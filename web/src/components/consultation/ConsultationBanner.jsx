import React, { useState } from 'react';
import ConsultationModal from './ConsultationModal';

const ConsultationBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="consultation" className="relative w-full py-12 md:py-16 bg-white overflow-hidden border-y border-slate-100">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50/80 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-50/80 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Banner Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#011753] to-blue-950 p-8 md:p-12 lg:p-14 text-white shadow-2xl overflow-hidden border border-slate-800">
          
          {/* Subtle Ambient Shapes Inside Card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Area (Columns 1 to 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-jetbrains font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>DARC Support Helpline</span>
              </div>

              {/* Title & Subtitles matching user requirement */}
              <div className="space-y-2">
                <h2 className="font-inter text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Book a Consultation <br className="hidden sm:inline" />
                  <span className="text-blue-300 font-extrabold text-2xl sm:text-3xl lg:text-4xl block mt-1">
                    (DARC Support Helpline)
                  </span>
                </h2>
                <p className="font-inter text-lg sm:text-xl font-medium text-emerald-300 pt-1">
                  Talk to experts and plan your career path.
                </p>
              </div>

              {/* Description */}
              <p className="font-inter text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Connect 1-on-1 with senior statisticians and academic mentors for tailored guidance on study design, sample size determination, data analysis workflows, and research publications.
              </p>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-inter text-xs text-slate-200 font-medium">15-Min Free Session</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-inter text-xs text-slate-200 font-medium">Study Design Advice</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-inter text-xs text-slate-200 font-medium">1-on-1 Mentorship</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-inter font-bold text-sm px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-emerald-400/20 flex items-center justify-center gap-3 group"
                >
                  <span>Book Free Consultation</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            </div>

            {/* Right Card Visual / Highlight Box (Columns 8 to 12) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-6 shadow-2xl space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-inter font-bold text-white text-xs">Live Slot Booking</h4>
                      <p className="font-inter text-[10px] text-slate-300">Fast & Confidential</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                {/* Sample Slot Previews */}
                <div className="space-y-2 font-inter text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-medium">10:00 AM - 10:15 AM</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                      FREE
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-medium">07:00 PM - 07:15 PM</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                      FREE
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-white text-[#011753] hover:bg-slate-100 font-inter text-xs font-bold text-center transition-colors shadow-sm block"
                >
                  View All Dates & Slots →
                </button>

              </div>
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
