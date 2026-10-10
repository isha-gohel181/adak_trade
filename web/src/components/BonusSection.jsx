import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

const BonusSection = ({ course }) => {
  const ref = useRef(null)

  // Use API bonuses if available strictly from database
  const apiBonuses = (course?.bonuses || []).filter(b => b && (b.title || b.price))

  useEffect(() => {
    if (apiBonuses.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.bonus-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.bonus-heading', start: 'top 87%' }
        }
      )

      gsap.fromTo('.bonus-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.bonus-card', start: 'top 85%' }
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [apiBonuses])

  // Hide the entire section if no bonuses exist in API/database
  if (apiBonuses.length === 0) return null

  return (
    <section ref={ref} className="max-w-7xl mx-auto mb-20 px-4 md:px-6">
      {/* Top accent */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16" />

      {/* Heading */}
      <div className="text-center space-y-4 mb-14">
        <span className="bonus-heading inline-block font-jetbrains text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase font-bold px-3.5 py-1 bg-[#ecfdf5] border border-[#d1fae5] rounded-md shadow-xs">
          EXCLUSIVE BONUSES
        </span>
        <h2 className="bonus-heading font-newsreader italic text-[clamp(2rem,5vw,3.8rem)] text-slate-900 font-light leading-tight">
          Unlock These For Free —{' '}
          <span className="text-accent underline decoration-accent/30 underline-offset-8">No Cost, Just Value!</span>
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiBonuses.map((b, i) => (
          <div
            key={i}
            className="bonus-card group relative border border-slate-200/90 bg-white p-6 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 overflow-hidden"
          >
            {/* Left: text */}
            <div className="relative z-10 space-y-2 flex-1">
              <p className="font-montserrat text-sm text-slate-800 font-medium leading-relaxed">
                {b.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-jetbrains text-xs text-accent font-bold tracking-wide">
                  Value: {b.price}
                </span>
              </div>
            </div>

            {/* Right: FREE badge */}
            <div className="relative z-10 shrink-0 flex flex-col items-center justify-center bg-accent text-white px-3 py-2 rounded-lg shadow-sm">
              <span className="font-jetbrains text-white font-bold text-[10px] tracking-wider uppercase">
                FREE
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BonusSection
