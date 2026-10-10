import React, { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Mrinal Santra',
    text: 'He is a very good teacher with excellent capability of teaching, making subject more interesting. Elucidate the price action so nicely with examples. Moreover he is very particular & i am enjoying the class very much.',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    text: 'The best trading community I have ever joined. The mentors are always available to help and the live sessions are extremely insightful. Highly recommended for beginners and experts alike.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Priya Das',
    text: 'Adak Trade transformed my trading journey. Their clear strategies and constant support gave me the confidence to trade independently. A must-join for anyone serious about the stock market.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  }
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute right-10 top-16 pointer-events-none opacity-[0.15]">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10C65 10 75 20 80 35C85 50 85 65 75 75C65 85 50 85 35 75C20 65 15 50 15 35C15 20 35 10 50 10Z" stroke="#047857" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M50 20C60 20 68 28 72 38C76 48 76 58 68 66C60 74 48 74 38 66C28 58 24 48 24 38C24 28 38 20 50 20Z" stroke="#047857" strokeWidth="2" />
          <path d="M50 30C55 30 60 35 63 42C66 49 66 55 60 60C55 65 48 65 42 60C36 55 33 49 33 42C33 35 42 30 50 30Z" stroke="#047857" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Large Image */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            {/* The circular image */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-10 transition-all duration-500 bg-slate-100">
              <img 
                key={activeIndex} // Force re-render for quick fade effect or let browser handle it. Actually better to use opacity transition.
                src={activeTestimonial.image} 
                alt={activeTestimonial.name} 
                className="w-full h-full object-cover transition-opacity duration-500 animate-[fadeIn_0.5s_ease-in-out]" 
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <h4 className="text-[#047857] font-bold tracking-widest text-xs sm:text-sm uppercase mb-3">
              REAL SUCCESS. REAL REVIEWS
            </h4>
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-slate-900 leading-tight mb-8">
              Students' Experiences with <br className="hidden md:block" /> ADAK TRADE
            </h2>
            
            <div className="relative">
              <span className="absolute -top-3 -left-4 text-4xl text-slate-300 font-serif leading-none opacity-60">"</span>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 font-medium z-10 relative">
                {activeTestimonial.text}
              </p>
            </div>
            
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-10">
              {activeTestimonial.name}
            </h3>

            {/* Pagination Thumbnails */}
            <div className="flex items-center gap-4">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative rounded-full transition-all duration-300 overflow-hidden ${
                    activeIndex === idx 
                      ? 'w-14 h-14 ring-2 ring-[#047857] ring-offset-2 opacity-100' 
                      : 'w-12 h-12 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={t.thumb} alt={t.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
