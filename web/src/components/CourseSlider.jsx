import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import sanitizeDisplay from '../utils/textSanitize'
import { useLanguage } from '../context/LanguageContext'

// High-quality starter fallback courses when database is empty
const STARTER_COURSES = [
  {
    _id: 'sample-1',
    id: 'sample-1',
    title: 'The Digital Curator & Content Architecture',
    shortDescription: 'Master modern curation, digital taxonomy, and creative content strategy.',
    category: { name: 'Curation' },
    price: 4999,
    salePrice: 2999,
    thumbnail: '/courses/curator.png',
    level: ['Intermediate'],
    isNew: true,
  },
  {
    _id: 'sample-2',
    id: 'sample-2',
    title: 'Network Strategy & Digital Systems',
    shortDescription: 'Scale and optimize network architecture with robust modern strategic frameworks.',
    category: { name: 'Strategy' },
    price: 5999,
    salePrice: 3499,
    thumbnail: '/courses/architecture.png',
    level: ['All Levels'],
  },
  {
    _id: 'sample-3',
    id: 'sample-3',
    title: 'Architectural System Design & Engineering',
    shortDescription: 'End-to-end design patterns and scalable structural engineering principles.',
    category: { name: 'Design' },
    price: 6999,
    salePrice: 3999,
    thumbnail: '/courses/workshop.png',
    level: ['Advanced'],
  },
  {
    _id: 'sample-4',
    id: 'sample-4',
    title: 'Motion Mastery & Cinematic Animation',
    shortDescription: 'Bring brands to life with cutting-edge 2D/3D motion graphics and narrative design.',
    category: { name: 'Animation' },
    price: 4499,
    salePrice: 2499,
    thumbnail: '/courses/motion.png',
    level: ['Beginner'],
    isNew: true,
  },
  {
    _id: 'sample-5',
    id: 'sample-5',
    title: 'Brand Identity & Visual Typography',
    shortDescription: 'Craft memorable brand identities through refined typography and editorial aesthetics.',
    category: { name: 'Branding' },
    price: 3999,
    salePrice: 1999,
    thumbnail: '/courses/typography.png',
    level: ['Intermediate'],
  },
  {
    _id: 'sample-6',
    id: 'sample-6',
    title: 'Visual Narrative & Creative Direction',
    shortDescription: 'Build cohesive visual stories and luxury commercial aesthetics.',
    category: { name: 'Design' },
    price: 5499,
    salePrice: 3199,
    thumbnail: '/courses/narrative.png',
    level: ['All Levels'],
  },
]

// Helper to reliably resolve backend and local image URLs
const resolveImageUrl = (course) => {
  const imgPath = course?.thumbnail || course?.horizontalCarouselImage || course?.verticalCarouselImage || course?.image
  if (!imgPath || typeof imgPath !== 'string') return '/courses/curator.png'
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
  if (imgPath.startsWith('/courses/') || imgPath.startsWith('/images/')) return imgPath

  const rawBase = import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
  const cleanBase = rawBase.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
  return `${cleanBase}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`
}

const CourseSlider = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { courses: apiCourses, loading } = useSelector((state) => state.courses)

  const [activeCategory, setActiveCategory] = useState('ALL')
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const trackRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  // Use dynamic API courses if available, otherwise fallback gracefully
  const allCourses = useMemo(() => {
    if (apiCourses && Array.isArray(apiCourses) && apiCourses.length > 0) {
      return apiCourses
    }
    return STARTER_COURSES
  }, [apiCourses])

  // Extract unique category names dynamically
  const categories = useMemo(() => {
    const set = new Set()
    allCourses.forEach((c) => {
      const name =
        c.categoryId?.name ||
        c.category?.name ||
        (typeof c.category === 'string' ? c.category : c.tag)
      if (name && typeof name === 'string' && name.trim()) {
        set.add(name.trim())
      }
    })
    return ['ALL', ...Array.from(set)]
  }, [allCourses])

  // Filter courses by selected category tab
  const displayedCourses = useMemo(() => {
    if (activeCategory === 'ALL') return allCourses
    return allCourses.filter((c) => {
      const name =
        c.categoryId?.name ||
        c.category?.name ||
        (typeof c.category === 'string' ? c.category : c.tag) ||
        ''
      return name.toUpperCase() === activeCategory.toUpperCase()
    })
  }, [allCourses, activeCategory])

  const handleScroll = () => {
    if (!trackRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 15)
  }

  const scrollByAmount = (direction) => {
    if (!trackRef.current) return
    const { clientWidth } = trackRef.current
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF5FA] border border-[#017DC3]/20 text-[#017DC3] text-xs font-bold tracking-wider uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[#BFD419] animate-pulse" />
              Empower Your Career
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Featured <span className="text-[#017DC3]">Courses</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-2 font-normal">
              Industry-aligned comprehensive programs curated by domain experts to elevate your practical skillset.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold tracking-wider uppercase hover:border-[#017DC3] hover:text-[#017DC3] shadow-sm hover:shadow transition-all"
            >
              <span>{t('ourCourses') || 'View All Courses'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Slider Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollByAmount('left')}
                disabled={!showLeftArrow}
                aria-label="Previous courses"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  showLeftArrow
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-[#017DC3] hover:text-white hover:border-[#017DC3] shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => scrollByAmount('right')}
                disabled={!showRightArrow}
                aria-label="Next courses"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  showRightArrow
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-[#017DC3] hover:text-white hover:border-[#017DC3] shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory.toUpperCase() === cat.toUpperCase()
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#017DC3] text-white shadow-md shadow-[#017DC3]/25 scale-105'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All Courses' : cat}
                </button>
              )
            })}
          </div>
        )}

        {/* Scrollable Course Cards Track */}
        <div className="relative group">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedCourses.map((course, idx) => {
              const courseId = course._id || course.id || course.slug || idx
              const categoryName =
                course.categoryId?.name ||
                course.category?.name ||
                (typeof course.category === 'string' ? course.category : course.tag) ||
                'Course'
              const priceDisplay =
                course.salePrice !== undefined && course.salePrice !== null
                  ? `₹${Number(course.salePrice).toLocaleString()}`
                  : course.price !== undefined && course.price !== null
                  ? `₹${Number(course.price).toLocaleString()}`
                  : 'Free'
              const originalPrice =
                course.salePrice && course.price && Number(course.price) > Number(course.salePrice)
                  ? `₹${Number(course.price).toLocaleString()}`
                  : null

              return (
                <div
                  key={courseId}
                  className="snap-start flex-shrink-0 w-[300px] sm:w-[350px] md:w-[380px] cursor-pointer group/card flex flex-col"
                  onClick={() => navigate(`/course-detail/${course._id || course.id || course.slug}`)}
                >
                  <div className="h-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col shadow-sm hover:shadow-xl hover:border-[#017DC3]/40 transition-all duration-300 hover:-translate-y-1.5">
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-4 shrink-0 border border-slate-100">
                      <img
                        src={resolveImageUrl(course)}
                        alt={sanitizeDisplay(course.title)}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/courses/curator.png'
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                          {categoryName}
                        </span>
                        {course.isNew && (
                          <span className="px-2.5 py-1 rounded-md bg-[#BFD419] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover/card:text-[#017DC3] transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
                        {sanitizeDisplay(course.title)}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
                        {course.shortDescription || course.description || 'Comprehensive curriculum designed to master real-world skills.'}
                      </p>

                      {/* Card Footer: Price & CTA */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-black text-slate-900">{priceDisplay}</span>
                          {originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-semibold">{originalPrice}</span>
                          )}
                        </div>

                        <div className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#017DC3] flex items-center justify-center group-hover/card:bg-[#017DC3] group-hover/card:text-white transition-all shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseSlider
