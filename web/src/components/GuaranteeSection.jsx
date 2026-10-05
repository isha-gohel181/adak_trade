import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const GuaranteeSection = () => {
  const containerRef = useRef(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.g-reveal', 
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      )

      gsap.to('.g-seal', {
        rotate: 360,
        duration: 30,
        repeat: -1,
        ease: 'none'
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6 relative">
      
      {/* 1. Main Protocol Card */}
      <div className="relative border border-slate-200/90 bg-white rounded-3xl overflow-hidden p-8 md:p-16 shadow-xl shadow-slate-200/50 group">
        
        {/* Animated Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 g-reveal">
                 <div className="h-[2px] w-8 bg-accent" />
                 <span className="font-jetbrains text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase font-bold">
                   VERIFIED SECURITY PROTOCOL
                 </span>
              </div>
              <h2 className="g-reveal font-newsreader italic text-[clamp(2.4rem,6vw,4.2rem)] text-slate-900 leading-[1.05] font-light tracking-tight">
                The 30-Day <br /> <span className="text-accent underline decoration-accent/30 underline-offset-8">Integrity</span> Protocol.
              </h2>
            </div>
            
            <p className="g-reveal font-montserrat text-sm md:text-base text-slate-600 leading-relaxed">
              We stand 100% behind our educational architecture and curriculum. If you execute the blueprint, complete the exercises, and don't experience undeniable acceleration in your mastery within 30 days, we eliminate all friction with our prompt integrity guarantee.
            </p>

            <div className="g-reveal pt-6 border-t border-slate-100 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                     <p className="font-jetbrains text-[10px] text-accent font-bold tracking-[0.2em] uppercase">Resolution Path</p>
                     <p className="font-montserrat text-xs text-slate-600 leading-relaxed">
                        Direct support line with rapid verification and personalized audit assistance.
                     </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                     <p className="font-jetbrains text-[10px] text-accent font-bold tracking-[0.2em] uppercase">Response Speed</p>
                     <p className="font-montserrat text-xs text-slate-600 leading-relaxed">
                        Dedicated mentor support resolution within <span className="text-slate-900 font-semibold">24-48 Hours</span>.
                     </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:flex items-center justify-center h-full">
             <div className="h-64 w-[1px] bg-slate-200" />
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center">
             <div className="relative group/seal">
                <div className="g-seal w-56 h-56 md:w-64 md:h-64 border-2 border-dashed border-accent/40 rounded-full flex items-center justify-center relative bg-blue-50/50 shadow-inner">
                   <div className="text-center space-y-1 relative z-10">
                      <span className="font-newsreader italic text-6xl md:text-7xl text-accent font-light">100%</span>
                      <p className="font-jetbrains text-[10px] tracking-[0.3em] text-slate-700 uppercase font-bold">Guarantee</p>
                   </div>
                </div>
             </div>
             
             <div className="mt-8 text-center space-y-2">
                <div className="flex gap-2 justify-center">
                   {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-accent/60 rounded-full" />)}
                </div>
                <p className="font-jetbrains text-[9px] tracking-[0.4em] uppercase text-slate-400 font-bold">IAS DCS QUALITY SHIELD</p>
             </div>
          </div>

        </div>
      </div>

    </section>
  )
}

export default GuaranteeSection
