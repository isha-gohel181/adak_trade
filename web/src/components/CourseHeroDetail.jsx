import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import sanitizeDisplay from '../utils/textSanitize'
import { useLanguage } from '../context/LanguageContext'

const CourseHeroDetail = ({ course, section }) => {
  const heroRef = useRef(null)
  const { t } = useLanguage()

  const rawTitle = section?.title || course?.title || 'Course'
  const displayTitle = sanitizeDisplay(rawTitle)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial reveals
      gsap.fromTo('.reveal-text', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08 }
      )

      gsap.fromTo('.reveal-checkmark',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.08, delay: 0.4 }
      )

      gsap.fromTo('.reveal-form',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Strictly use database highlights only (no static fallback)
  const highlights = (course?.highlights || []).filter(h => h && String(h).trim() !== '')

  return (
    <section ref={heroRef} className="max-w-7xl mx-auto mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[60vh] px-4 md:px-6">
      
      {/* LEFT: DRAMATIC TYPOGRAPHY & VALUE */}
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-3">
          <span className="reveal-text inline-block font-jetbrains text-accent text-[10px] md:text-xs tracking-[0.25em] font-bold uppercase px-3.5 py-1 bg-blue-50 border border-blue-100 rounded-full shadow-xs">
            {course?.category?.name || 'COURSE'} {course?.level?.[0] ? `/ ${course.level[0]}` : ''}
          </span>
          <h1 className="reveal-text font-newsreader text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-light text-slate-900 max-w-3xl break-words">
            {displayTitle.split(' ').map((word, i, arr) => (
               <React.Fragment key={i}>
                  {i >= arr.length - 2 ? (
                     <span className="text-accent underline decoration-accent/30 underline-offset-8">{word} </span>
                  ) : (
                     word + ' '
                  )}
               </React.Fragment>
            ))}
          </h1>
        </div>

        {(course?.shortDescription || course?.description) && (
          <p className="reveal-text font-montserrat text-sm md:text-base text-slate-600 max-w-xl leading-relaxed">
            {course.shortDescription || course.description}
          </p>
        )}

        {/* Checkpoints (Render strictly if highlights exist in database) */}
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {highlights.map((check, i) => (
              <div key={i} className="flex items-center gap-2.5">
                 <div className="reveal-checkmark w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#017DC3" strokeWidth="3.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                 </div>
                 <span className="reveal-text font-montserrat text-xs text-slate-700 font-medium">
                    {sanitizeDisplay(check)}
                 </span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="reveal-text flex flex-wrap gap-4 pt-4">
           <button 
            onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative bg-accent hover:bg-accent-hover text-white px-8 md:px-10 py-4 rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
           >
              <span className="font-jetbrains text-xs font-bold tracking-[0.2em] uppercase">{t('seePricing')}</span>
           </button>
           <button 
            onClick={() => document.getElementById('curriculum-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 md:px-10 py-4 rounded-xl border border-slate-300 hover:border-accent hover:bg-blue-50/50 text-slate-800 transition-all duration-300 cursor-pointer"
           >
              <span className="font-jetbrains text-xs font-bold tracking-[0.2em] uppercase">VIEW CURRICULUM</span>
           </button>
        </div>
      </div>

      {/* RIGHT: FLOATING MATRIX FORM */}
      <div className="lg:col-span-5 relative">
         <div className="reveal-form relative z-10 bg-white border border-slate-200/90 rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/50">
            <div className="space-y-6">
               <div className="space-y-2">
                  <h3 className="font-newsreader italic text-3xl text-slate-900 leading-tight font-light">
                     Ready to <span className="text-accent underline decoration-accent/30 underline-offset-4">Transform?</span>
                  </h3>
                  {course?.enrolledStudentsCount > 0 && (
                    <p className="font-jetbrains text-[10px] text-slate-500 tracking-[0.2em] uppercase font-bold">
                      Join {course.enrolledStudentsCount}+ students today.
                    </p>
                  )}
               </div>

               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                     <input 
                      type="text" 
                      placeholder={t('fullName')} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-montserrat text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all placeholder:text-slate-400" 
                     />
                  </div>
                  <div>
                     <input 
                      type="email" 
                      placeholder={t('emailAddress')} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-montserrat text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all placeholder:text-slate-400" 
                     />
                  </div>
                  <div className="flex gap-3">
                     <div className="w-16">
                        <input 
                          type="text" 
                          disabled 
                          value="+91" 
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-3 font-jetbrains text-xs text-slate-600 font-bold text-center" 
                        />
                     </div>
                     <div className="flex-1">
                        <input 
                          type="tel" 
                          placeholder={t('phoneNumber')} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-montserrat text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all placeholder:text-slate-400" 
                        />
                     </div>
                  </div>
                  <div>
                     <textarea 
                      rows="2" 
                      placeholder="WHY DO YOU WANT TO JOIN?" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-montserrat text-xs text-slate-900 focus:outline-none focus:border-accent focus:bg-white transition-all placeholder:text-slate-400 resize-none" 
                     />
                  </div>

                  <button className="w-full group/btn relative bg-accent hover:bg-accent-hover text-white py-4 rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 hover:scale-[1.01] active:scale-98 cursor-pointer">
                     <span className="font-jetbrains text-xs font-bold tracking-[0.25em] uppercase">
                        REQUEST CALLBACK
                     </span>
                  </button>
               </form>
            </div>
         </div>
      </div>

    </section>
  )
}

export default CourseHeroDetail
