import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'
import LogoMarquee from './LogoMarquee'

gsap.registerPlugin(ScrollTrigger)

const ComparisonSection = ({ course, section }) => {
  const containerRef = useRef(null)
  const targetSection = section || course?.comparisonSection

  // If section visibility is disabled or no section exists, don't render
  if (!targetSection || targetSection.show === false) {
    return null
  }

  // Build comparison pairs strictly from backend data
  const leftPoints = (targetSection.leftPoints || []).filter(p => p && String(p).trim() !== '')
  const rightPoints = (targetSection.rightPoints || []).filter(p => p && String(p).trim() !== '')
  
  const maxLen = Math.max(leftPoints.length, rightPoints.length)
  const comparisonItems = []
  for (let i = 0; i < maxLen; i++) {
    comparisonItems.push({
      traditional: leftPoints[i] || '',
      our: rightPoints[i] || ''
    })
  }

  // Process EditorJS description if present
  const descriptionBlocks = targetSection.description?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ).filter(t => t && t.trim() !== '') || []

  const rawTitle = targetSection.title
  const hasContent = comparisonItems.length > 0 || descriptionBlocks.length > 0 || rawTitle

  // If no data exists in database, do not render this section
  if (!hasContent) {
    return null
  }

  const sectionTitle = sanitizeDisplay(rawTitle || "Program Comparison & Value Matrix")
  const leftColTitle = sanitizeDisplay(targetSection.leftTitle || "Traditional Program")
  const rightColTitle = sanitizeDisplay(targetSection.rightTitle || "Our Program")

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.comp-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.comp-header', start: 'top 92%' }
        }
      )

      gsap.utils.toArray('.comp-row').forEach((row) => {
        gsap.fromTo(row,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 95%' }
          }
        )
      })

      gsap.fromTo('.comp-cta',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.comp-cta', start: 'top 94%' }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6">
      
      {/* Top divider label */}
      <div className="flex items-center gap-6 mb-16 opacity-80">
        <div className="flex-1 h-[1px] bg-slate-200" />
        <span className="font-jetbrains text-[10px] md:text-xs tracking-[0.35em] uppercase text-accent font-bold px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-xs">
          COMPARISON MATRIX
        </span>
        <div className="flex-1 h-[1px] bg-slate-200" />
      </div>

      {/* SECTION TITLE & DESCRIPTION */}
      <div className="comp-header text-center space-y-5 max-w-4xl mx-auto mb-16">
        <h2 className="font-newsreader italic text-[clamp(2.2rem,5vw,3.8rem)] text-slate-900 font-light leading-tight">
          {sectionTitle.split(' ').map((word, i, arr) => (
            <React.Fragment key={i}>
              {i >= arr.length - 2 ? (
                <span className="text-accent underline decoration-accent/30 underline-offset-8">{word} </span>
              ) : (
                word + ' '
              )}
            </React.Fragment>
          ))}
        </h2>

        {descriptionBlocks.length > 0 && (
          <div className="space-y-3 font-montserrat text-sm md:text-base text-slate-600 leading-relaxed">
            {descriptionBlocks.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {/* COMPARISON COLUMN HEADERS (Render only if points exist or custom titles exist) */}
      {comparisonItems.length > 0 && (
        <>
          <div className="comp-header grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-center">
            {/* Traditional Header Card */}
            <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-sm shadow-rose-100/50 space-y-3">
              <span className="inline-block font-jetbrains text-[10px] text-rose-700 tracking-[0.25em] uppercase font-bold px-3 py-1 bg-rose-50 border border-rose-200 rounded-full">
                STATUS: OUTDATED & RIGID
              </span>
              <h3 className="font-newsreader italic text-2xl md:text-3xl text-slate-800 font-normal">
                {leftColTitle}
              </h3>
            </div>

            {/* Our Program Header Card */}
            <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-sm shadow-blue-100 space-y-3">
              <span className="inline-block font-jetbrains text-[10px] text-white tracking-[0.25em] uppercase font-bold px-3.5 py-1 bg-accent rounded-full shadow-xs">
                STATUS: OPTIMAL & PRACTICAL
              </span>
              <h3 className="font-newsreader italic text-2xl md:text-3xl text-accent font-medium">
                {rightColTitle}
              </h3>
            </div>
          </div>

          {/* COMPARISON ROWS */}
          <div className="space-y-4 mb-20">
            {comparisonItems.map((item, i) => (
              <div key={i} className="comp-row grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                
                {/* Traditional Point */}
                <div className="flex items-center gap-4 px-6 py-5 bg-white border border-rose-100/80 border-l-4 border-l-rose-400 rounded-xl shadow-xs hover:border-rose-200 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600 shadow-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="font-montserrat text-xs md:text-sm text-slate-700 font-normal leading-relaxed">
                    {sanitizeDisplay(item.traditional)}
                  </p>
                </div>

                {/* Our Program Point */}
                <div className="flex items-center gap-4 px-6 py-5 bg-white border border-blue-100 border-l-4 border-l-accent rounded-xl shadow-xs hover:shadow-md hover:bg-blue-50/20 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-white shadow-sm shadow-accent/30">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="font-montserrat text-xs md:text-sm text-slate-900 font-medium leading-relaxed">
                    {sanitizeDisplay(item.our)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Brand Partners Marquee */}
      <div className="mb-20">
        <LogoMarquee />
      </div>

      {/* BOTTOM CTA */}
      <div className="comp-cta text-center space-y-6">
        <h4 className="font-newsreader italic text-2xl md:text-3xl text-slate-800 font-light tracking-tight">
          Accelerate your trajectory with proven, battle-tested learning systems.
        </h4>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative bg-accent hover:bg-accent-hover text-white px-10 md:px-14 py-4 rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span className="font-jetbrains text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
              ENROLL & GET IMMEDIATE ACCESS
            </span>
          </button>
        </div>
      </div>

    </section>
  )
}

export default ComparisonSection
