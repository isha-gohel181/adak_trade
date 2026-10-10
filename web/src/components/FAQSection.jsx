import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useLanguage } from '../context/LanguageContext'
import sanitizeDisplay from '../utils/textSanitize'

gsap.registerPlugin(ScrollTrigger)

const FAQSection = ({ course }) => {
  const containerRef = useRef(null)
  const { t } = useLanguage()

  // Strictly extract FAQs from course data in database
  const rawFaqs = (course?.faqs || course?.faq || []).filter(
    f => f && (f.question || f.q) && (f.answer || f.a)
  )

  // If no FAQs exist in the database for this course, do not render this section
  if (rawFaqs.length === 0) {
    return null
  }

  // Format and categorize dynamic FAQs
  const categorizedFaqs = {}
  rawFaqs.forEach((faq, index) => {
    let cat = faq.category || 'Course'
    // Normalize common categories
    if (cat.toLowerCase() === 'course') cat = 'Course'
    else if (cat.toLowerCase() === 'purchase' || cat.toLowerCase() === 'subscription') cat = 'Subscription'
    else if (cat.toLowerCase() === 'technical') cat = 'Technical'
    else cat = cat.charAt(0).toUpperCase() + cat.slice(1)

    if (!categorizedFaqs[cat]) {
      categorizedFaqs[cat] = []
    }
    categorizedFaqs[cat].push({
      id: faq._id || `faq-${index}`,
      q: sanitizeDisplay(faq.question || faq.q),
      a: sanitizeDisplay(faq.answer || faq.a)
    })
  })

  const categories = Object.keys(categorizedFaqs)
  const [activeTab, setActiveTab] = useState(categories[0] || 'Course')
  const [hoveredId, setHoveredId] = useState(null)

  // Ensure activeTab is valid when categories change
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeTab)) {
      setActiveTab(categories[0])
    }
  }, [course])

  const activeFaqs = categorizedFaqs[activeTab] || rawFaqs.map((faq, index) => ({
    id: faq._id || `faq-${index}`,
    q: sanitizeDisplay(faq.question || faq.q),
    a: sanitizeDisplay(faq.answer || faq.a)
  }))

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-box',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [activeTab])

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 px-4 md:px-6 relative">

      {/* Top Divider Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-16" />

      {/* Header Area with Category Switcher */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[2px] bg-accent rounded-full" />
          <span className="font-jetbrains text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase font-bold">
            {t('faqTitle') || 'FREQUENTLY ASKED QUESTIONS'}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h2 className="font-newsreader italic text-3xl md:text-5xl text-slate-900 font-light tracking-tight leading-tight max-w-2xl">
            {t('faqSubtitle') || 'Everything you need to know about our courses, certification, and learning support.'}
          </h2>

          {/* Category Tabs (Rendered if multiple categories exist) */}
          {categories.length > 1 && (
            <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
              {categories.map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setHoveredId(null)
                  }}
                  className={`font-montserrat text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 pb-2 relative whitespace-nowrap cursor-pointer
                    ${activeTab === tab ? 'text-accent' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic FAQ Accordion List */}
      <div className="space-y-4">
        {activeFaqs.map((item, i) => {
          const isOpen = hoveredId === item.id
          return (
            <div
              key={item.id}
              className={`faq-box group border border-slate-200/90 bg-white hover:border-accent/40 transition-all duration-300 rounded-2xl shadow-xs overflow-hidden
                ${isOpen ? 'bg-[#ecfdf5]/20 border-[#a7f3d0] shadow-md' : ''}`}
            >
              <button
                onClick={() => setHoveredId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1 pr-4">
                  <span className="font-jetbrains text-xs text-accent font-bold">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <h4 className="font-newsreader italic text-lg md:text-xl text-slate-900 font-normal leading-snug group-hover:text-accent transition-colors">
                    {item.q}
                  </h4>
                </div>

                <div className={`shrink-0 w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300
                  ${isOpen ? 'rotate-[225deg] border-accent bg-accent text-white' : 'bg-slate-50 text-slate-600'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>

              {/* Answer Accordion Body */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-[500px] opacity-100 p-5 md:p-6 pt-0' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-montserrat text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}

export default FAQSection
