import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import sanitizeDisplay from '../utils/textSanitize'

gsap.registerPlugin(ScrollTrigger)

const OverviewSection = ({ course, section }) => {
  const containerRef = useRef(null)
  const targetSection = section || course?.overviewSection

  // If section visibility is disabled or no section exists, don't render
  if (!targetSection || targetSection.show === false) {
    return null
  }

  // Process EditorJS description blocks
  const descriptionBlocks = targetSection.description?.blocks?.map(block => 
    sanitizeDisplay(block.data?.text || '').replace(/&nbsp;/g, ' ')
  ).filter(t => t && t.trim() !== '') || []

  const rawTitle = targetSection.title
  const displaySubtitle = sanitizeDisplay(targetSection.subtitle || '')
  const rawImage = targetSection.images?.[0] || targetSection.image || ''

  const hasContent = rawTitle || displaySubtitle || descriptionBlocks.length > 0 || rawImage

  // If no data exists in database, do not render this section
  if (!hasContent) {
    return null
  }

  const displayTitle = sanitizeDisplay(rawTitle || (course?.title ? `What is ${course.title}?` : 'Program Overview'))

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.overview-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.overview-heading', start: 'top 90%' }
        }
      )
      gsap.fromTo('.overview-text',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.overview-text', start: 'top 88%' }
        }
      )
      if (rawImage) {
        gsap.fromTo('.overview-image-wrap',
          { opacity: 0, scale: 0.97, y: 30 },
          {
            opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.overview-image-wrap', start: 'top 88%' }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [rawImage])

  // Resolve image URL
  const getImageSrc = (img) => {
    if (!img) return ''
    if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:')) return img
    const rawBase = import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE || 'https://ias-dcs-lms.onrender.com'
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
    let cleanPath = img
    if (cleanPath.includes('\\uploads\\') || cleanPath.includes('/uploads/')) {
      const parts = cleanPath.split(/[\\/]uploads[\\/]/)
      cleanPath = '/uploads/' + parts[parts.length - 1]
    }
    return `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`
  }

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6">
      
      {/* Top accent divider line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16" />

      <div className="text-center space-y-6 mb-14">
        {/* Category / Subtitle pill */}
        {displaySubtitle && (
          <div className="overview-heading inline-block">
            <span className="font-jetbrains text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase font-bold border border-blue-100 bg-blue-50 px-4 py-1.5 rounded-full shadow-xs">
              {displaySubtitle}
            </span>
          </div>
        )}

        {/* Section Heading */}
        <h2 className="overview-heading font-newsreader italic text-[clamp(2.2rem,5vw,4.2rem)] text-slate-900 font-light leading-[1.05] tracking-tight max-w-4xl mx-auto">
          {displayTitle.split(' ').map((word, i, arr) => (
            <React.Fragment key={i}>
              {i >= arr.length - 2 ? (
                <span className="text-accent underline decoration-accent/30 underline-offset-8">{word} </span>
              ) : (
                word + ' '
              )}
            </React.Fragment>
          ))}
        </h2>

        {/* Description Body */}
        {descriptionBlocks.length > 0 && (
          <div className="overview-text space-y-4 max-w-3xl mx-auto text-left md:text-center">
            {descriptionBlocks.map((text, bi) => (
              <p key={bi} className="font-montserrat text-sm md:text-base text-slate-600 leading-relaxed">
                {text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Featured Media / Cover Card (Render only if image exists in database) */}
      {rawImage && (
        <div className="overview-image-wrap relative group overflow-hidden max-w-3xl mx-auto rounded-2xl bg-white border border-slate-200/90 p-2 shadow-xl shadow-slate-200/50">
          <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
            {/* Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-xs" />
              <span className="font-jetbrains text-[9px] text-white tracking-[0.25em] uppercase font-bold">COURSE SPOTLIGHT</span>
            </div>

            <img
              src={getImageSrc(rawImage)}
              alt={displayTitle}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      )}

    </section>
  )
}

export default OverviewSection
