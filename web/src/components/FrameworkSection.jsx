import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'

gsap.registerPlugin(ScrollTrigger)

const FrameworkSection = ({ course, section }) => {
  const containerRef = useRef(null)
  const introRef = useRef(null)
  const targetSection = section || course?.frameworkSection

  // If section visibility is disabled or no section exists, don't render
  if (!targetSection || targetSection.show === false) {
    return null
  }

  const mediaUrl = targetSection.media || ''

  // Extract data strictly from EditorJS blocks in database
  const processContent = (content) => {
    if (!content || !content.blocks) return { intro: [], phases: [] }
    
    const intro = []
    const phases = []
    let currentPhase = null
    let foundFirstHeader = false

    content.blocks.forEach(block => {
      if (block.type === 'header') {
        foundFirstHeader = true
        if (currentPhase) phases.push(currentPhase)
        currentPhase = { title: block.data.text, description: '' }
      } else if (block.type === 'paragraph') {
        if (!foundFirstHeader) {
          intro.push(block.data.text)
        } else if (currentPhase) {
          currentPhase.description += (currentPhase.description ? ' ' : '') + block.data.text
        }
      }
    })
    if (currentPhase) phases.push(currentPhase)
    return { intro, phases }
  }

  const { intro, phases } = processContent(targetSection.description || targetSection.content)
  const rawTitle = targetSection.title
  const hasContent = phases.length > 0 || intro.length > 0 || mediaUrl || rawTitle

  // If no data exists in database, do not render this section
  if (!hasContent) {
    return null
  }

  const sectionTitle = sanitizeDisplay(rawTitle || 'The Framework')
  const sectionSubtitle = sanitizeDisplay(targetSection.subtitle || "THE ARCHITECT'S ROADMAP")

  const stripHtml = (html) => {
    if (!html) return ''
    return String(html).replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00A0/g, ' ')
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.framework-intro-item', 
        { opacity: 0, y: 25 },
        { 
          opacity: 1, y: 0, 
          duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 92%'
          }
        }
      )

      if (phases.length > 0) {
        gsap.utils.toArray('.phase-node').forEach((node) => {
          gsap.fromTo(node,
            { opacity: 0, y: 25 },
            {
              opacity: 1, y: 0,
              duration: 0.6, ease: 'power3.out',
              scrollTrigger: {
                trigger: node,
                start: 'top 92%',
              }
            }
          )
        })

        gsap.fromTo('.roadmap-line-inner', 
          { height: '0%' },
          { 
            height: '100%', 
            ease: 'none',
            scrollTrigger: {
              trigger: '.phases-container',
              start: 'top 75%',
              end: 'bottom 90%',
              scrub: true
            }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [phases])

  // Helper to format YouTube embed URL
  const getEmbedUrl = (url) => {
    if (!url) return ''
    if (url.includes('youtube.com/embed/')) return url
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?modestbranding=1&rel=0`
    }
    return url
  }

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6">
      
      {/* Top Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16" />

      {/* INTRO HEADER CARD */}
      <div ref={introRef} className="max-w-4xl mx-auto mb-16 relative">
        <div className="relative p-8 md:p-12 border border-slate-200 bg-white rounded-2xl shadow-md space-y-6 text-center md:text-left">
          <div className="space-y-3">
            <span className="framework-intro-item inline-block font-jetbrains text-accent text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold border border-[#d1fae5] bg-[#ecfdf5] px-3.5 py-1 rounded-md shadow-xs">
              {sectionSubtitle}
            </span>
            <h2 className="framework-intro-item font-newsreader italic text-3xl md:text-5xl text-slate-900 font-light tracking-tight leading-[1.05]">
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
          </div>

          {intro.length > 0 && (
            <div className="space-y-3">
              {intro.map((text, i) => (
                <p key={i} className="framework-intro-item font-montserrat text-slate-600 leading-relaxed text-sm md:text-base">
                  {sanitizeDisplay(stripHtml(text))}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OPTIONAL EMBEDDED MEDIA / VIDEO */}
      {mediaUrl && (
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/50" style={{ paddingTop: '56.25%' }}>
            {mediaUrl.includes('youtube') || mediaUrl.includes('youtu.be') ? (
              <iframe
                src={getEmbedUrl(mediaUrl)}
                title={sectionTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={sectionTitle}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* PHASES ROADMAP (Rendered strictly if phases exist in backend) */}
      {phases.length > 0 && (
        <div className="phases-container relative max-w-4xl mx-auto pt-4 space-y-10 pl-6 md:pl-0">
          
          {/* Central Road Line */}
          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-200">
            <div className="roadmap-line-inner w-full bg-accent shadow-sm shadow-accent/40 origin-top" />
          </div>

          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div 
                key={index} 
                className={`phase-node relative flex flex-col md:flex-row items-center gap-6 md:gap-0 ${
                  index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content Card */}
                <div className="w-full md:w-[45%] group">
                  <div className="relative p-6 md:p-7 border border-slate-200/90 bg-white rounded-2xl shadow-xs hover:shadow-lg hover:border-accent/40 transition-all duration-300">
                    
                    {/* Side Accent Line */}
                    <div className={`absolute top-0 bottom-0 w-[3px] bg-accent rounded-full transition-all duration-300 ${
                      index % 2 !== 0 ? 'right-0' : 'left-0'
                    }`} />

                    {/* Header */}
                    <div className="space-y-2 mb-3">
                      <span className="font-jetbrains text-[10px] text-accent tracking-[0.25em] uppercase font-bold">
                        STAGE {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-newsreader italic text-xl md:text-2xl text-slate-900 font-normal tracking-tight">
                        {sanitizeDisplay(stripHtml(phase.title))}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-montserrat text-xs md:text-sm text-slate-600 leading-relaxed">
                      {sanitizeDisplay(stripHtml(phase.description))}
                    </p>
                  </div>
                </div>

                {/* Central Glowing Node Point */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-accent flex items-center justify-center z-20 shadow-md">
                  <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-xs" />
                </div>

                {/* Spacer for the other side on desktop */}
                <div className="hidden md:block md:w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  )
}

export default FrameworkSection
