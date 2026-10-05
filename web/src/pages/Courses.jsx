import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import RollingText from '../components/RollingText'
import CourseCard from '../components/CourseCard'
import EventHero from '../components/EventHero'
import { fetchEvents } from '../redux/slices/eventSlice'
import { useLanguage } from '../context/LanguageContext'

const Courses = () => {
  const dispatch = useDispatch()
  const { courses, loading, error } = useSelector((state) => state.courses)
  const { eventList, loading: eventsLoading } = useSelector((state) => state.events)
  const containerRef = useRef(null)
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('ALL COURSES')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All hours')
  const advancedRef = useRef(null)
  const [hasFetchedEvents, setHasFetchedEvents] = useState(false)

  // Dynamically extract unique categories from backend courses
  const categoryFilters = useMemo(() => {
    const set = new Set()
    if (courses && Array.isArray(courses)) {
      courses.forEach((c) => {
        const name =
          c.categoryId?.name ||
          c.category?.name ||
          (typeof c.category === 'string' && c.category.trim() ? c.category.trim() : '')
        if (name && typeof name === 'string' && name.trim()) {
          set.add(name.trim())
        }
      })
    }
    return ['ALL COURSES', ...Array.from(set)]
  }, [courses])

  const filteredCourses = useMemo(() => {
    return (courses || []).filter(item => {
      // 1. Category Filter
      const matchesCategory = (() => {
        if (activeFilter === 'ALL COURSES' || activeFilter === 'ALL') return true
        const courseCat = (
          item.categoryId?.name ||
          item.category?.name ||
          (typeof item.category === 'string' ? item.category : '') ||
          ''
        ).toUpperCase().trim()
        const filterCat = activeFilter.toUpperCase().trim()
        return courseCat === filterCat || courseCat.includes(filterCat) || filterCat.includes(courseCat)
      })()

      // 2. Difficulty Filter
      const matchesDifficulty = (() => {
        if (selectedDifficulty === 'All') return true
        const filterDiff = selectedDifficulty.toLowerCase()
        
        if (item.level && Array.isArray(item.level) && item.level.length > 0) {
          return item.level.some(l => (typeof l === 'string' ? l.toLowerCase() : '') === filterDiff)
        }
        
        const courseDiff = (item.difficulty || '').toLowerCase()
        if (filterDiff === 'intermediate' && courseDiff === 'medium') return true
        return courseDiff === filterDiff
      })()

      // 3. Duration Filter
      const matchesDuration = (() => {
        if (selectedDuration === 'All hours') return true
        
        const getCourseDurationInHours = (c) => {
          if (!c.duration) return 0
          const val = parseFloat(c.duration)
          if (isNaN(val)) return 0
          if (typeof c.duration === 'string' && c.duration.toLowerCase().includes('min')) {
            return val / 60
          }
          if (val > 100) {
            return val / 60
          }
          return val
        }

        const duration = getCourseDurationInHours(item)
        if (selectedDuration === '0-2 hours') return duration >= 0 && duration <= 2
        if (selectedDuration === '2-5 hours') return duration > 2 && duration <= 5
        if (selectedDuration === '5-10 hours') return duration > 5 && duration <= 10
        if (selectedDuration === '10-20 hours') return duration > 10 && duration <= 20
        if (selectedDuration === '20+ hours') return duration > 20
        return true
      })()

      return matchesCategory && matchesDifficulty && matchesDuration
    })
  }, [courses, activeFilter, selectedDifficulty, selectedDuration])

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchEvents({ status: 'active' })).finally(() => setHasFetchedEvents(true))
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // 1. Filter Row Entrance
      gsap.fromTo('.course-filter-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06 }
      )

      // 3. Grid Entrance (ScrollTrigger)
      gsap.from('.course-grid > *', {
        scrollTrigger: { trigger: '.course-grid', start: 'top 85%' },
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.1, duration: 1.2, ease: 'power3.out'
      })

      // 4. Events Entrance (ScrollTrigger)
      gsap.from('.events-section > *', {
        scrollTrigger: { trigger: '.events-section', start: 'top 85%' },
        y: 40, opacity: 0, filter: 'blur(10px)', stagger: 0.2, duration: 1.2, ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [dispatch])

  return (
    <div ref={containerRef} className="min-h-screen bg-dark pt-0 pb-24">

      {/* 1. Dynamic Hero Banner */}
      {eventList && eventList.length > 0 && <EventHero events={eventList} />}

      {/* 2. Page Content Wrapper */}
      <div className={`px-4 md:px-12 ${eventList && eventList.length > 0 ? 'pt-8 md:pt-12' : 'pt-28 md:pt-32'}`}>
        {/* Filter Row Header */}
        <div className="max-w-7xl mx-auto mb-10">
          {/* Desktop Header Grid */}
          <div className="hidden md:grid grid-cols-12 items-center gap-8 w-full pb-6 border-b border-slate-200/80">
            {/* Section 1: Dynamic Filters (Cols 1-8) */}
            <div className="col-span-8 flex flex-wrap items-center gap-3">
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`course-filter-reveal opacity-0 px-5 py-2.5 rounded-full font-montserrat text-[11px] font-bold tracking-[0.15em] border transition-all duration-300 uppercase ${
                    activeFilter.toUpperCase() === filter.toUpperCase()
                      ? 'bg-accent text-white border-accent shadow-sm shadow-[#017DC3]/25'
                      : 'text-slate-600 bg-white border-slate-200 hover:border-accent/50 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <RollingText text={filter} />
                </button>
              ))}
            </div>

            {/* Section 2: Info & More (Cols 9-12) */}
            <div className="col-span-4 flex items-center justify-end gap-6 course-filter-reveal opacity-0">
               <span className="font-montserrat text-[11px] text-slate-500 uppercase tracking-[0.15em] font-bold">
                 {filteredCourses.length} COURSE{filteredCourses.length === 1 ? '' : 'S'} AVAILABLE
               </span>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-white font-montserrat text-[11px] font-bold tracking-[0.15em] transition-all duration-300 group/filters ${showAdvanced ? 'text-accent border-accent bg-accent/5' : 'text-slate-600 hover:text-accent hover:border-accent/50'}`}
              >
                <svg width="16" height="12" viewBox="0 0 24 16" fill="none" className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180 scale-105 text-accent' : 'group-hover/filters:scale-105'}`}>
                  <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <RollingText text={showAdvanced ? "HIDE FILTERS" : "MORE FILTERS"} />
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Drawer */}
          <div
            ref={advancedRef}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdvanced ? 'max-h-[600px] opacity-100 mt-8 mb-8' : 'max-h-0 opacity-0'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              {/* 1. Difficulty Section */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                    <path d="M13 18L13 6M13 6L11 9M13 6L15 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 18L5 12M5 12L3 15M5 12L7 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 18L21 2M21 2L19 5M21 2L23 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="font-newsreader text-xl font-bold text-slate-900">Difficulty</h3>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-5 py-2 rounded-full font-montserrat text-[11px] font-bold tracking-[0.15em] border transition-all duration-300 uppercase ${selectedDifficulty === level
                        ? 'bg-accent text-white border-accent shadow-sm'
                        : 'text-slate-600 bg-slate-50 border-slate-200 hover:border-accent/50 hover:text-slate-900 hover:bg-white'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Duration Section */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="font-newsreader text-xl font-bold text-slate-900">Duration</h3>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {['All hours', '0-2 hours', '2-5 hours', '5-10 hours', '10-20 hours', '20+ hours'].map((range) => (
                    <div
                      key={range}
                      onClick={() => setSelectedDuration(range)}
                      className="flex items-center gap-3 cursor-pointer group/dur select-none"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedDuration === range ? 'border-accent bg-accent/10' : 'border-slate-300 group-hover/dur:border-accent'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-accent transition-transform duration-300 ${selectedDuration === range ? 'scale-100' : 'scale-0'
                          }`} />
                      </div>
                      <span className={`font-montserrat text-[11px] tracking-[0.05em] transition-colors ${selectedDuration === range ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover/dur:text-slate-900'
                        }`}>
                        {range}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-jetbrains text-[9px] text-slate-500 uppercase tracking-[0.15em] font-bold">
                {filteredCourses.length} COURSE{filteredCourses.length === 1 ? '' : 'S'} AVAILABLE
              </span>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white font-jetbrains text-[9px] font-bold tracking-[0.15em] transition-colors ${showAdvanced ? 'text-accent border-accent' : 'text-slate-600'}`}
              >
                <svg width="12" height="8" viewBox="0 0 24 16" fill="none" className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180 scale-110' : ''}`}>
                  <path d="M4 4H20M7 8H17M10 12H14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                {showAdvanced ? "CLOSE" : "FILTERS"}
              </button>
            </div>

            <div className="relative group">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 rounded-full font-montserrat text-[11px] font-bold tracking-[0.15em] shadow-sm"
              >
                <span>CATEGORY: {activeFilter}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} stroke="currentColor">
                  <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isFilterOpen && (
                <div className="absolute top-full left-0 w-full z-50 bg-white border border-slate-200 rounded-2xl shadow-xl mt-2 overflow-hidden max-h-60 overflow-y-auto">
                  {categoryFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => { setActiveFilter(filter); setIsFilterOpen(false); }}
                      className={`w-full px-6 py-3.5 text-left font-montserrat text-[11px] font-bold border-b border-slate-100 last:border-b-0 transition-colors ${activeFilter.toUpperCase() === filter.toUpperCase() ? 'text-accent bg-accent/5' : 'text-slate-600 hover:text-accent hover:bg-slate-50'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Dynamic Masonry Grid */}
        <div className="course-grid max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
          {loading ? (
            <div className="col-span-full text-center py-20 text-accent font-montserrat font-bold">LOADING COURSES...</div>
          ) : error ? (
            <div className="col-span-full text-center py-20 text-red-500 font-montserrat font-semibold">{t('failedToLoad')}</div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((item) => (
              <CourseCard
                key={item._id || item.id || item.slug}
                item={item}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 font-montserrat">{t('noCoursesAvailable')}</div>
          )}
        </div>

        {/* 4. Upcoming Events Section */}
        <div className="events-section max-w-7xl mx-auto pt-24 border-t border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="font-newsreader text-5xl md:text-6xl italic text-normal mb-4">Upcoming Events</h2>
              <p className="font-montserrat text-[11px] text-description uppercase tracking-[0.2em]">Curated experiences & intensive workshops.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-jetbrains text-description">
              <span className="text-accent">•</span> <span>{t('berlin')}</span>
              <span className="text-accent">•</span> <span>{t('remotelyAvailable')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {eventsLoading ? (
              <div className="col-span-full text-center py-20 text-accent font-montserrat font-bold">LOADING EVENTS...</div>
            ) : eventList && eventList.length > 0 ? (
              eventList.map((event) => (
                <CourseCard
                  key={event._id || event.id}
                  item={{
                    id: event._id || event.id,
                    title: event.title,
                    category: event.category || 'EVENT',
                    description: event.description,
                    thumbnail: event.thumbnail || event.image,
                    buttonText: event.buttonText || 'Register Now',
                    isNew: event.isNew
                  }}
                  variant="event"
                />
              ))
            ) : hasFetchedEvents ? (
              <div className="col-span-full text-center py-20 text-description font-montserrat uppercase tracking-widest">No upcoming events at the moment.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
