import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'

gsap.registerPlugin(ScrollTrigger)

const SolutionSection = ({ course, section }) => {
  const containerRef = useRef(null)
  const targetSection = section || course?.solutionSection

  // If section visibility is disabled or no section exists, don't render
  if (!targetSection || targetSection.show === false) {
    return null
  }

  // Extract points strictly from backend
  const problems = (targetSection.outcomePoints || []).filter(p => p && String(p).trim() !== '')
  const outcomes = (targetSection.points || []).filter(p => p && String(p).trim() !== '')

  // Process EditorJS description blocks
  const mainDescBlocks = targetSection.content?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ).filter(t => t && t.trim() !== '') || []

  const outcomeDescBlocks = targetSection.outcomeDescription?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ).filter(t => t && t.trim() !== '') || []

  const solutionDescBlocks = targetSection.solutionDescription?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ).filter(t => t && t.trim() !== '') || []

  const rawTitle = targetSection.title
  const outcomeHeading = sanitizeDisplay(targetSection.outcomeTitle || "")
  const solutionHeading = sanitizeDisplay(targetSection.solutionTitle || "")

  const hasContent = problems.length > 0 || outcomes.length > 0 || mainDescBlocks.length > 0 || rawTitle || outcomeHeading || solutionHeading

  // If no data exists in database, do not render this section
  if (!hasContent) {
    return null
  }

  const sectionTitle = sanitizeDisplay(rawTitle || "The Solution")

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sol-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.sol-header', start: 'top 92%' }
        }
      )

      if (problems.length > 0) {
        gsap.fromTo('.sol-problem-card',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: '.sol-problem-grid', start: 'top 92%' }
          }
        )
      }

      if (outcomes.length > 0) {
        gsap.fromTo('.sol-outcome-card',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: '.sol-outcome-grid', start: 'top 92%' }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [problems, outcomes])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6">
      
      {/* Top Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16" />

      {/* Main Header & Narrative */}
      <div className="sol-header text-center space-y-5 max-w-4xl mx-auto mb-16">
        <span className="inline-block font-jetbrains text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase font-bold border border-[#d1fae5] bg-[#ecfdf5] px-3.5 py-1 rounded-md shadow-xs">
          PROBLEM $\rightarrow$ SOLUTION TRANSFORMATION
        </span>
        <h2 className="font-newsreader italic text-[clamp(2.2rem,5vw,4.2rem)] text-slate-900 font-light tracking-tight leading-[1.05]">
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

        {mainDescBlocks.length > 0 && (
          <div className="space-y-3 font-montserrat text-sm md:text-base text-slate-600 leading-relaxed">
            {mainDescBlocks.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>
        )}
      </div>

      {/* PHASE 1: PROBLEMS WE SOLVE (Rendered only if data exists) */}
      {(problems.length > 0 || outcomeHeading || outcomeDescBlocks.length > 0) && (
        <div className="mb-16 space-y-6">
          <div className="text-center space-y-2">
            <span className="font-jetbrains text-[10px] text-rose-700 tracking-[0.25em] uppercase font-bold px-3 py-1 bg-rose-50 border border-rose-200 rounded-md inline-block">
              PHASE 01: ELIMINATE THE FRICTION
            </span>
            {outcomeHeading && (
              <h3 className="font-newsreader italic text-2xl md:text-3xl text-slate-800 font-normal">
                {outcomeHeading}
              </h3>
            )}
            {outcomeDescBlocks.length > 0 && (
              <p className="font-montserrat text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {outcomeDescBlocks.join(' ')}
              </p>
            )}
          </div>

          {problems.length > 0 && (
            <div className="sol-problem-grid grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {problems.map((p, i) => (
                <div 
                  key={i} 
                  className="sol-problem-card flex items-center gap-4 px-6 py-5 bg-white border border-rose-100/80 border-l-4 border-l-rose-400 rounded-xl shadow-xs hover:border-rose-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600 shadow-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="font-montserrat text-xs md:text-sm text-slate-700 font-normal leading-relaxed">
                    {sanitizeDisplay(p)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: BY PROGRAM'S END / OUTCOMES (Rendered only if data exists) */}
      {(outcomes.length > 0 || solutionHeading || solutionDescBlocks.length > 0) && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-jetbrains text-[10px] text-white tracking-[0.25em] uppercase font-bold px-3.5 py-1 bg-accent rounded-md inline-block shadow-xs">
              PHASE 02: THE TANGIBLE OUTCOMES
            </span>
            {solutionHeading && (
              <h3 className="font-newsreader italic text-2xl md:text-3xl text-accent font-medium">
                {solutionHeading}
              </h3>
            )}
            {solutionDescBlocks.length > 0 && (
              <p className="font-montserrat text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {solutionDescBlocks.join(' ')}
              </p>
            )}
          </div>

          {outcomes.length > 0 && (
            <div className="sol-outcome-grid grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {outcomes.map((o, i) => (
                <div 
                  key={i} 
                  className="sol-outcome-card flex items-center gap-4 px-6 py-5 bg-white border border-[#d1fae5] border-l-4 border-l-accent rounded-xl shadow-xs hover:shadow-md hover:bg-[#ecfdf5]/20 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-white shadow-sm shadow-accent/30">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="font-montserrat text-xs md:text-sm text-slate-900 font-medium leading-relaxed">
                    {sanitizeDisplay(o)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  )
}

export default SolutionSection
