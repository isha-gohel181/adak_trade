import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const schemesData = [
  {
    id: 'mcard',
    image: '/scheme/mcard_scheme.png',
    title: 'MAHARSHI CHARAK AYURVEDA R&D SCHEME',
    shortName: 'Maharshi Charak Scheme',
    category: 'Ayurveda & AYUSH Research',
    desc: 'Promoting empirical validation, clinical trials, and statistical methodologies in Ayurvedic and traditional medicine systems.',
    points: [
      'Clinical Trial Protocol Design & Standardization',
      'AYUSH Research Data Management & Analytics',
      'Empirical Evidence Generation for Herbal Formulations',
      'Publication & Scientific Documentation Mentorship'
    ]
  },
  {
    id: 'psrd',
    image: '/scheme/psrd_scheme.png',
    title: 'DR. PADAM SINGH RESEARCH & DEVELOPMENT SCHEME',
    shortName: 'Dr. Padam Singh Scheme',
    category: 'Biostatistics & Health Sciences',
    desc: 'Pioneering biostatistics, clinical trial methodologies, sample size estimation, and epidemiological research for medical sciences.',
    points: [
      'Sample Size Estimation & Statistical Power Analysis',
      'Observational, Cohort & Case-Control Study Design',
      'Survival Analysis & Multivariable Regression Modeling',
      'ICMR / GCP Guidelines & Protocol Drafting'
    ]
  },
  {
    id: 'dcfshhrd',
    image: '/scheme/dcfshhrd_scheme.png',
    title: 'DR. C.F.S. HAHNEMANN HOMOEOPATHY R&D SCHEME',
    shortName: 'Dr. C.F.S. Hahnemann Scheme',
    category: 'Homoeopathic Research Analytics',
    desc: 'Fostering rigorous clinical research, statistical modeling, and evidence-based efficacy studies in Homoeopathy.',
    points: [
      'Homoeopathic Clinical Research Methodologies',
      'Quantitative & Qualitative Outcome Measurement',
      'Systematic Reviews & Meta-Analyses in Homoeopathy',
      'Standardized Pharmacovigilance Data Tracking'
    ]
  },
  {
    id: 'fnnrd',
    image: '/scheme/fnnrd_scheme.png',
    title: 'FLORENCE NIGHTINGALE NURSING R&D SCHEME',
    shortName: 'Florence Nightingale Scheme',
    category: 'Nursing & Patient Care Analytics',
    desc: 'Advancing research methodologies, clinical audits, evidence-based nursing practice, and healthcare quality analytics.',
    points: [
      'Evidence-Based Nursing Research Protocols',
      'Patient Safety & Clinical Quality Improvement Audits',
      'Nursing Dissertation & Publication Support',
      'CNE Accredited Analytical Workshops'
    ]
  },
  {
    id: 'dradrd',
    image: '/scheme/dradrd_scheme.png',
    title: 'DR. RAFIUDDIN AHMED DENTAL R&D SCHEME',
    shortName: 'Dr. Rafiuddin Ahmed Scheme',
    category: 'Dental & Oral Health Sciences',
    desc: 'Empowering dental researchers with statistical protocol design, epidemiological oral health surveys, and clinical studies.',
    points: [
      'Dental Epidemiological Surveys & Field Studies',
      'In-Vitro & In-Vivo Dental Trial Methodologies',
      'MDS Thesis & Dissertation Data Analysis',
      'Diagnostic Accuracy & Reliability Assessment'
    ]
  },
  {
    id: 'smverd',
    image: '/scheme/smverd_scheme.png',
    title: 'SIR M. VISVESVARAYA ENGINEERING R&D SCHEME',
    shortName: 'Sir M. Visvesvaraya Scheme',
    category: 'Engineering, Data Science & AI',
    desc: 'Bridging statistical theory with computational data engineering, machine learning algorithms, and predictive analytics.',
    points: [
      'Machine Learning & Predictive Statistical Modeling',
      'Statistical Computing & Data Wrangling in R & Python',
      'High-Dimensional Industrial Data Analytics',
      'Interdisciplinary Engineering Research Guidance'
    ]
  }
]

const BrandFeatures = () => {
  const containerRef = useRef(null)
  const [selectedScheme, setSelectedScheme] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(['.schemes-header', '.scheme-card-item'], { autoAlpha: 0, y: 20 })

      gsap.to('.schemes-header', { 
        y: 0, 
        autoAlpha: 1, 
        duration: 0.6, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.schemes-header',
          start: 'top 90%'
        }
      })

      gsap.utils.toArray('.scheme-card-item').forEach((card, i) => {
        gsap.to(card, {
          y: 0, 
          autoAlpha: 1, 
          duration: 0.5, 
          ease: 'power3.out', 
          delay: i * 0.06,
          scrollTrigger: {
            trigger: card,
            start: 'top 93%'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-slate-50 overflow-hidden z-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Segment */}
        <div className="schemes-header text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF5FA] border border-[#017DC3]/20 text-[#017DC3] text-[11px] font-bold uppercase tracking-widest font-jetbrains">
            <span className="w-2 h-2 rounded-full bg-[#BFD419] animate-pulse shadow-[0_0_6px_#BFD419]" />
            Specialized R&D Schemes & Cells
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Our Research & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#017DC3] via-[#028DDb] to-[#005B8E]">
              Development Schemes
            </span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            IAS operates dedicated specialized research schemes in collaboration with universities, medical colleges, and research institutions nationwide to foster an empirical, evidence-based culture.
          </p>
        </div>

        {/* 6 Schemes Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-6">
          {schemesData.map((scheme) => (
            <div 
              key={scheme.id}
              className="scheme-card-item group relative bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-between transition-all duration-300 hover:border-[#017DC3]/40 hover:shadow-xl hover:-translate-y-1.5 shadow-sm"
            >
              {/* Top Medallion Seal Image */}
              <div className="w-full flex items-center justify-center pt-2 pb-4">
                <img 
                  src={scheme.image} 
                  alt={scheme.title}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title Content */}
              <div className="w-full flex flex-col items-center text-center space-y-2 flex-grow justify-center py-2">
                <h3 className="font-inter font-bold text-xs sm:text-[13px] text-slate-800 leading-snug group-hover:text-[#017DC3] transition-colors line-clamp-3">
                  {scheme.title}
                </h3>
              </div>

              {/* Read More Action Button */}
              <div className="w-full pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedScheme(scheme)}
                  className="w-full max-w-[140px] py-2 px-4 rounded-full bg-[#017DC3] hover:bg-[#006AA7] text-white font-bold text-[11px] uppercase tracking-wider shadow-sm hover:shadow-[0_4px_15px_rgba(1,125,195,0.35)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedScheme(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedScheme(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Body */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              <img 
                src={selectedScheme.image} 
                alt={selectedScheme.title} 
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-lg flex-shrink-0"
              />
              <div className="space-y-3 min-w-0 text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EBF5FA] text-[#017DC3] border border-[#017DC3]/20 text-[10px] font-bold uppercase tracking-wider font-jetbrains">
                  {selectedScheme.category}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedScheme.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedScheme.desc}
                </p>
              </div>
            </div>

            {/* Focus Research Areas */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-jetbrains">
                Key Initiatives & Focus Areas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedScheme.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <div className="w-2 h-2 rounded-full bg-[#BFD419] shadow-[0_0_4px_#BFD419] mt-1 flex-shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/courses"
                onClick={() => setSelectedScheme(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#017DC3] text-white hover:bg-[#006AA7] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Explore Associated Courses</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  )
}

export default BrandFeatures
