import React from 'react'
import sanitizeDisplay from '../utils/textSanitize'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

// Helper to resolve course thumbnail or image
const resolveImageUrl = (item) => {
  const imgPath = item?.image || item?.thumbnail || item?.coverImage || item?.horizontalCarouselImage || item?.verticalCarouselImage
  if (!imgPath || typeof imgPath !== 'string') return '/courses/curator.png'
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    if (imgPath.includes('ias-dcs-lms.onrender.com')) {
      const filename = imgPath.split('/').pop()
      return `/courses/${filename}`
    }
    return imgPath
  }
  if (imgPath.startsWith('/courses/') || imgPath.startsWith('/images/')) return imgPath

  const rawBase = import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
  const cleanBase = rawBase.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
  return `${cleanBase}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`
}

// Helper to safely extract numeric price values from any backend representation
const parseNumericPrice = (val) => {
  if (val === undefined || val === null || val === '') return null
  if (typeof val === 'number') return isNaN(val) ? null : val
  if (typeof val === 'object' && val.$numberDecimal !== undefined) {
    const num = parseFloat(val.$numberDecimal)
    return isNaN(num) ? null : num
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.]/g, '')
    if (!cleaned) return null
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : num
  }
  return null
}

const CourseCard = ({ item, className = '', variant = 'course' }) => {
  const { t } = useLanguage()

  const categoryName =
    item?.categoryId?.name ||
    item?.category?.name ||
    (typeof item?.category === 'string' && item?.category.trim() ? item.category.trim() : '') ||
    item?.tag ||
    'COURSE'

  const salePriceNum = parseNumericPrice(item?.salePrice)
  const priceNum = parseNumericPrice(item?.price)

  let priceDisplay = 'Free'
  let originalPriceDisplay = null

  if (salePriceNum !== null && salePriceNum > 0) {
    priceDisplay = `₹${salePriceNum.toLocaleString()}`
    if (priceNum !== null && priceNum > salePriceNum) {
      originalPriceDisplay = `₹${priceNum.toLocaleString()}`
    }
  } else if (priceNum !== null && priceNum > 0) {
    priceDisplay = `₹${priceNum.toLocaleString()}`
  } else if (typeof item?.price === 'string' && item.price.toLowerCase().includes('free')) {
    priceDisplay = 'Free'
  }

  const courseId = item?._id || item?.id || item?.slug

  const CardContent = (
    <div className={`catalog-card bg-white border border-slate-200/80 hover:border-[#017DC3]/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col h-full group relative overflow-hidden ${className}`}>
      {/* Image Wrapper */}
      <div className="relative overflow-hidden mb-5 aspect-[16/10] bg-slate-100 rounded-xl shrink-0 border border-slate-100">
        <img 
          src={resolveImageUrl(item)} 
          alt={sanitizeDisplay(item?.title || 'Course')}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/courses/curator.png'
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-60" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-slate-900 font-jetbrains text-[9px] font-black tracking-wider uppercase shadow-sm">
            {categoryName}
          </span>
          {item?.isNew && (
            <span className="bg-[#BFD419] text-slate-900 px-2.5 py-0.5 font-jetbrains text-[9px] font-black tracking-wider rounded-md shadow-sm">
              {t('newBadge') || 'NEW'}
            </span>
          )}
        </div>
      </div>

      {/* Content Metadata */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-newsreader text-xl sm:text-2xl text-slate-900 group-hover:text-[#017DC3] transition-colors duration-300 font-bold tracking-tight leading-snug line-clamp-2 mb-2">
          {sanitizeDisplay(item?.title || '')}
        </h3>
        
        <p className="font-montserrat text-xs text-slate-600 leading-relaxed mb-4 flex-grow line-clamp-2 font-medium">
          {item?.shortDescription || item?.description || ''}
        </p>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          {variant === 'course' ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="font-montserrat text-sm sm:text-base text-slate-900 tracking-wider font-extrabold">
                  {priceDisplay}
                </span>
                {originalPriceDisplay && (
                  <span className="font-montserrat text-xs text-slate-400 line-through font-semibold">
                    {originalPriceDisplay}
                  </span>
                )}
              </div>
              <div className="w-9 h-9 flex items-center justify-center border border-[#017DC3]/30 bg-[#EBF5FA] group-hover:bg-[#017DC3] group-hover:border-[#017DC3] rounded-full transition-all duration-300 shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 stroke-[#017DC3] group-hover:stroke-white">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </>
          ) : (
            <button className="w-full py-3.5 bg-[#017DC3] text-white hover:bg-[#006AA7] rounded-full font-jetbrains text-xs font-bold tracking-[0.25em] uppercase hover:scale-[1.02] shadow-[0_4px_15px_rgba(1,125,195,0.35)] transition-all duration-300">
              {item?.buttonText || t('registerNow') || 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (variant === 'course' && courseId) {
    return (
      <Link to={`/course-detail/${courseId}`} className="block h-full">
        {CardContent}
      </Link>
    )
  }

  return CardContent
}

export default CourseCard
