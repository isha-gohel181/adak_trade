import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const footerRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        y: 24,
        opacity: 0,
        filter: 'blur(6px)',
        stagger: 0.08,
        duration: 0.9,
        ease: 'power3.out'
      })
    }, footerRef)

    requestAnimationFrame(() => {
      try { ScrollTrigger.refresh() } catch (e) { }
    })

    return () => ctx.revert()
  }, [])

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      url: 'https://facebook.com'
    },
    {
      name: 'X',
      icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154H7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.644z',
      url: 'https://x.com'
    },
    {
      name: 'Instagram',
      icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01',
      url: 'https://instagram.com',
      isInsta: true
    },
    {
      name: 'YouTube',
      icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l6 3z',
      url: 'https://youtube.com'
    }
  ]

  const exploreLinks = [
    { name: t('home') || 'Home', path: '/' },
    { name: t('ourCourses') || 'Courses', path: '/courses' },
    { name: 'Counseling & Mentorship', path: '/contact' },
    { name: t('forum') || 'Forum', path: '/forum' },
    { name: t('gig') || 'Gigs', path: '/gig' },
    { name: t('news') || 'News', path: '/news' },
  ]

  const serviceLinks = [
    { name: 'Applied Statistics Training', path: '/courses' },
    { name: 'Personality & Level Test', path: '/personality-test' },
    { name: '1-on-1 Expert Mentorship', path: '/contact' },
    { name: 'Peer Learning Community', path: '/forum' },
    { name: 'Opportunity & Research Board', path: '/gig' },
  ]

  const supportLinks = [
    { name: t('about Us') || 'About Us', path: '/about-us' },
    { name: t('contact') || 'Contact', path: '/contact' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: t('privacyPolicy') || 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Refund Policy', path: '/refund-policy' },
  ]

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#050814] text-white pt-16 md:pt-20 pb-10 px-6 md:px-12 lg:px-20 overflow-hidden flex flex-col justify-between border-t border-slate-800/80"
    >
      {/* Top Subtle Blue/Amber Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75" />

      {/* Main Footer Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10 pb-14">

        {/* Column 1: Brand & Connect */}
        <div className="footer-reveal lg:col-span-4 flex flex-col items-start text-left">
          <Link to="/" className="flex items-center gap-3.5 group mb-4">
            <img
              src="/logo/iasdcs-logo.png"
              alt="IAS DCS Logo"
              className="h-12 md:h-14 w-auto object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 bg-white/5 p-1 border border-white/10"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white font-inter">IAS DCS</span>
              <span className="text-[10px] md:text-[11px] font-bold text-blue-400 tracking-[0.18em] uppercase">Institute of Applied Statistics</span>
            </div>
          </Link>

          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6 font-normal">
            Empowering learners to master Applied Statistics, Data Science, and Research Analytics with practical fluency, engaging interactive modules, and personalized mentorship.
          </p>

          <div className="w-full">
            <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase font-jetbrains mb-3">
              CONNECT WITH US
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 shadow-sm hover:scale-110 active:scale-95"
                  aria-label={social.name}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social.isInsta ? (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </>
                    ) : (
                      <path d={social.icon} fill={social.name === 'X' ? 'currentColor' : 'none'} stroke={social.name === 'X' ? 'none' : 'currentColor'} />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: EXPLORE */}
        <div className="footer-reveal lg:col-span-2 lg:ml-auto flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-200 mb-4 font-jetbrains">
            EXPLORE
          </h3>
          <ul className="space-y-2.5">
            {exploreLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block capitalize"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: SERVICES */}
        <div className="footer-reveal lg:col-span-3 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-200 mb-4 font-jetbrains">
            SERVICES
          </h3>
          <ul className="space-y-2.5">
            {serviceLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: SUPPORT & COMPANY */}
        <div className="footer-reveal lg:col-span-3 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-200 mb-4 font-jetbrains">
            SUPPORT & COMPANY
          </h3>
          <ul className="space-y-2.5">
            {supportLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Legal Links Bar */}
      <div className="footer-reveal max-w-7xl mx-auto w-full pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-400">

        {/* Copyright & Slogan */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <p className="font-jetbrains font-medium text-slate-400">
            © 2026 IAS DCS (Institute of Applied Statistics). All rights reserved.
          </p>
          <span className="hidden md:inline text-slate-600">•</span>
          <p className="font-jetbrains text-slate-500 italic">
            Where Ambition Meets Execution
          </p>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-4 font-jetbrains text-xs">
          <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/terms-conditions" className="hover:text-blue-400 transition-colors">
            Terms & Conditions
          </Link>
          <span className="text-slate-700">•</span>
          <Link to="/refund-policy" className="hover:text-blue-400 transition-colors">
            Refund Policy
          </Link>
        </div>

      </div>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>
    </footer>
  )
}

export default Footer
