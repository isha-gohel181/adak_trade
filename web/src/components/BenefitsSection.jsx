import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'

gsap.registerPlugin(ScrollTrigger)

const BenefitsSection = ({ course, section }) => {
  const containerRef = useRef(null)
  const targetSection = section || course?.benefitsSection

  // If section visibility is disabled or no section exists, don't render
  if (!targetSection || targetSection.show === false) {
    return null
  }

  // Extract points list strictly from database
  const pointsList = (targetSection.points || []).filter(p => p && String(p).trim() !== '')

  // Process EditorJS content blocks if available
  const contentBlocks = targetSection.content?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ).filter(t => t && t.trim() !== '') || []

  const rawTitle = targetSection.title
  const hasContent = pointsList.length > 0 || contentBlocks.length > 0 || rawTitle

  // If no data exists in database, do not render this section
  if (!hasContent) {
    return null
  }

  const sectionTitle = sanitizeDisplay(rawTitle || "What You Will Achieve")

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.benefit-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.benefit-header', start: 'top 92%' }
        }
      )

      gsap.fromTo('.benefit-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: {
            trigger: '.benefit-grid',
            start: 'top 92%',
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6">
      
      {/* Top Section Divider Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16" />

      {/* Header & Rich Description Grid */}
      <div className="benefit-header grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16">
        
        {/* Left Sticky Title */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
          <span className="font-jetbrains text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase font-bold px-3.5 py-1 bg-[#ecfdf5] border border-[#d1fae5] rounded-md inline-block">
            CORE ADVANTAGES
          </span>
          <h2 className="font-newsreader italic text-[clamp(2.2rem,5vw,3.8rem)] text-slate-900 font-light tracking-tight leading-[1.1]">
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
          <div className="h-[2px] bg-accent/40 w-24 rounded-full" />
        </div>

        {/* Right Content / Editorial Narrative */}
        <div className="lg:col-span-7 space-y-4 lg:border-l border-slate-200 lg:pl-10 py-2">
          {contentBlocks.length > 0 ? (
            contentBlocks.map((blockText, i) => (
              <p 
                key={i} 
                className={`font-montserrat leading-[1.8] ${
                  i === 0 
                    ? 'text-base md:text-lg text-slate-800 font-medium' 
                    : 'text-sm md:text-base text-slate-600 font-normal'
                }`}
              >
                {blockText}
              </p>
            ))
          ) : (
            <p className="font-montserrat text-sm md:text-base text-slate-600 leading-[1.8]">
              {sanitizeDisplay(course?.shortDescription || "Gain comprehensive mastery backed by structured workflows, practical assignments, and personalized mentoring.")}
            </p>
          )}
        </div>
      </div>

      {/* Benefit Points 3-Column Card Grid (Rendered strictly from backend data) */}
      {pointsList.length > 0 && (
        <div className="benefit-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pointsList.map((feat, i) => (
            <div 
              key={i} 
              className="benefit-card bg-white border border-slate-200/90 hover:border-accent/40 p-7 rounded-2xl relative group hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 flex flex-col justify-between min-h-[150px]"
            >
              {/* Number watermark */}
              <div className="absolute top-3 right-4 opacity-70 group-hover:opacity-100 transition-opacity">
                <span className="font-jetbrains text-3xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Glowing Accent Indicator & Text */}
              <div className="flex items-start gap-4 z-10">
                <div className="w-2.5 h-2.5 bg-accent rounded-full mt-1.5 shrink-0 shadow-xs shadow-accent/50 group-hover:scale-125 transition-transform" />
                <span className="font-montserrat text-sm text-slate-800 font-medium leading-relaxed">
                  {sanitizeDisplay(typeof feat === 'string' ? feat : feat.title || '')}
                </span>
              </div>

              {/* Bottom accent indicator */}
              <div className="w-0 group-hover:w-16 h-[2px] bg-accent transition-all duration-300 mt-6 rounded-full" />
            </div>
          ))}
        </div>
      )}

    </section>
  )
}

export default BenefitsSection
