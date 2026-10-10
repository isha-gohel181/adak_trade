import React, { useState, useEffect, useRef } from 'react';

const mentorImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80"
];

const MentorSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (trackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const itemWidth = trackRef.current.children[0]?.clientWidth || 0;
        const gap = 24; // 1.5rem (gap-6)
        
        if (scrollLeft + 10 >= maxScroll) {
          trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          trackRef.current.scrollBy({ left: itemWidth + gap, behavior: 'smooth' });
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Sync dots on manual scroll
  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const itemWidth = trackRef.current.children[0]?.clientWidth || 0;
    const gap = 24;
    if (itemWidth > 0) {
      const index = Math.round(scrollLeft / (itemWidth + gap));
      setActiveIndex(index);
    }
  };

  // Handle dot click
  const scrollToDot = (index) => {
    if (!trackRef.current) return;
    const itemWidth = trackRef.current.children[0]?.clientWidth || 0;
    const gap = 24;
    trackRef.current.scrollTo({ left: index * (itemWidth + gap), behavior: 'smooth' });
    setActiveIndex(index);
  };

  return (
    <section className="relative w-full py-10 md:py-12 bg-[#047857] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-full pointer-events-none opacity-10">
        <svg viewBox="0 0 200 600" fill="currentColor" className="text-white h-full w-full object-cover">
          <path d="M0,0 C80,50 150,200 120,400 C100,550 50,600 0,600 Z" />
        </svg>
      </div>
      
      <div className="absolute left-[10%] bottom-[30%] pointer-events-none opacity-20 flex gap-2 flex-wrap w-24">
         <div className="w-3 h-3 rounded-full border-[1.5px] border-white"></div>
         <div className="w-5 h-5 rounded-full border-[1.5px] border-white mt-1"></div>
         <div className="w-4 h-4 rounded-full border-[1.5px] border-white mt-2"></div>
         <div className="w-6 h-6 rounded-full border-[1.5px] border-white mt-4 ml-2"></div>
      </div>
      
      <div className="absolute right-12 top-20 pointer-events-none opacity-30">
        <svg width="40" height="40" viewBox="0 0 60 60" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="30" y1="10" x2="30" y2="50" />
          <line x1="10" y1="30" x2="50" y2="30" />
          <line x1="16" y1="16" x2="44" y2="44" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-white text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1.5 opacity-90">
            GUIDED BY THE BEST
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[36px] font-bold text-white tracking-tight">
            Meet Our Expert Mentors
          </h2>
        </div>

        {/* Carousel Track */}
        <div 
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mentorImages.map((img, idx) => (
            <div 
              key={idx} 
              className="snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[280px] lg:w-[calc(25%-18px)]"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md group hover:-translate-y-1.5 transition-transform duration-300">
                <img
                  src={img}
                  alt={`Expert Mentor ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Slider Dots */}
        <div className="flex items-center justify-center gap-3 mt-4 md:mt-6">
          {mentorImages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToDot(i)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === i 
                  ? 'w-2.5 h-2.5 bg-transparent ring-2 ring-white ring-offset-2 ring-offset-[#047857]' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
