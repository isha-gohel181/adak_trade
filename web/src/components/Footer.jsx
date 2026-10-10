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
    { name: 'Capital Markets & Trading Courses', path: '/courses' },
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
      className="relative w-full bg-[#F3F9D2] text-slate-900 pt-16 md:pt-20 pb-10 px-6 md:px-12 lg:px-20 overflow-hidden flex flex-col justify-between border-t border-[#BFD419]/40"
    >
      {/* Top Accent Divider */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#BFD419] to-transparent" />

      {/* Main Footer Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10 pb-14">

        {/* Column 1: Brand & Connect */}
        <div className="footer-reveal lg:col-span-4 flex flex-col items-start text-left">
          <Link to="/" className="flex items-center gap-3.5 group mb-4">
            <img
              src="/adka_trade_logo.png"
              alt="ADAK TRADE Logo"
              className="h-11 md:h-12 w-auto object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-300 bg-white p-1 border border-slate-200"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-inter">ADAK TRADE</span>
              <span className="text-[10px] md:text-[11px] font-bold text-[#047857] tracking-[0.18em] uppercase">Trade Effort Academy</span>
            </div>
          </Link>

          <p className="text-sm text-slate-700 leading-relaxed max-w-sm mb-4 font-normal">
            Empowering traders, investors, and institutions to master Capital Markets, Technical Trading, and Financial Analytics with practical fluency and expert mentorship.
          </p>

          <div className="flex flex-col gap-2.5 mb-6">
            <a href="tel:+917908927127" className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#047857] transition-colors font-medium">
              <div className="w-8 h-8 rounded-full bg-[#EBF5FA] flex items-center justify-center text-[#047857]">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                 </svg>
              </div>
              +91 7908927127
            </a>
            <a href="mailto:info@adaktradeeffort.com" className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#047857] transition-colors font-medium">
              <div className="w-8 h-8 rounded-full bg-[#EBF5FA] flex items-center justify-center text-[#047857]">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                 </svg>
              </div>
              info@adaktradeeffort.com
            </a>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#BFD419]/50 shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-[#BFD419] shadow-[0_0_6px_#BFD419] animate-pulse" />
            <span className="text-[10px] text-slate-800 font-jetbrains uppercase tracking-wider font-bold">DPIIT Recognized • ISO Certified</span>
          </div>

          <div className="w-full">
            <p className="text-[11px] font-bold tracking-[0.2em] text-slate-600 uppercase font-jetbrains mb-3">
              CONNECT WITH US
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-[#047857] hover:border-[#047857]/60 hover:bg-[#EBF5FA] transition-all duration-300 shadow-xs hover:scale-110 active:scale-95"
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
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900 mb-4 font-jetbrains">
            EXPLORE
          </h3>
          <ul className="space-y-2.5">
            {exploreLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-700 hover:text-[#047857] transition-colors duration-200 block capitalize font-medium"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: SERVICES */}
        <div className="footer-reveal lg:col-span-3 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900 mb-4 font-jetbrains">
            SERVICES
          </h3>
          <ul className="space-y-2.5">
            {serviceLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-700 hover:text-[#047857] transition-colors duration-200 block font-medium"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: SUPPORT & COMPANY */}
        <div className="footer-reveal lg:col-span-3 flex flex-col items-start text-left">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900 mb-4 font-jetbrains">
            SUPPORT & COMPANY
          </h3>
          <ul className="space-y-2.5">
            {supportLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-700 hover:text-[#047857] transition-colors duration-200 block font-medium"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Legal Links Bar */}
      <div className="footer-reveal max-w-7xl mx-auto w-full pt-8 border-t border-[#BFD419]/40 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-600">

        {/* Copyright & Slogan */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <p className="font-jetbrains font-bold text-slate-700">
            © 2026 ADAK TRADE EFFORT. All rights reserved.
          </p>
          <span className="hidden md:inline text-slate-400">•</span>
          <p className="font-jetbrains text-slate-600 italic">
            Where Ambition Meets Execution
          </p>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-4 font-jetbrains text-xs">
          <Link to="/privacy-policy" className="text-slate-700 hover:text-[#047857] transition-colors font-medium">
            Privacy Policy
          </Link>
          <span className="text-slate-400">•</span>
          <Link to="/terms-conditions" className="text-slate-700 hover:text-[#047857] transition-colors font-medium">
            Terms & Conditions
          </Link>
          <span className="text-slate-400">•</span>
          <Link to="/refund-policy" className="text-slate-700 hover:text-[#047857] transition-colors font-medium">
            Refund Policy
          </Link>
        </div>

      </div>
    </footer>
  )
}

export default Footer
