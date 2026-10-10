import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RollingText from './RollingText'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Navbar = ({ isLoaded }) => {
  const { token } = useSelector((state) => state.auth)
  const { theme } = useTheme()
  const { t } = useLanguage()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const shutter1Ref = useRef(null)
  const shutter2Ref = useRef(null)
  const shutter3Ref = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)

  const navLinks = [
    { key: 'home', name: t('home'), path: '/' },
    { key: 'ourCourses', name: t('ourCourses'), path: '/courses' },
    { key: 'forum', name: t('forum'), path: '/forum' },
    { key: 'aboutUs', name: t('aboutUs'), path: '/about-us' },
    { key: 'gig', name: t('gig'), path: '/gig' },
    { key: 'news', name: t('news'), path: '/news' },
  ]

  const socialLinks = [
    { name: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l6 3z', url: '#' },
    { name: 'Instagram', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01', url: '#', isInsta: true },
    { name: 'X', icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154H7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.644z', url: '#' },
    { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', url: '#' }
  ]

  const navContainerRef = useRef(null)
  const innerNavRef = useRef(null)
  const logoRef = useRef(null)
  const linksWrapRef = useRef(null)
  const buttonsWrapRef = useRef(null)
  const pillRef = useRef(null)

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const internalTl = gsap.timeline()

      // Initial Entrance
      internalTl.fromTo(navContainerRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          autoAlpha: 1,
          pointerEvents: "auto",
          duration: 0.4,
          ease: 'power3.out'
        }
      )

      internalTl.fromTo(logoRef.current, { x: -4, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, '-=0.2')
      internalTl.fromTo('.nav-link-item',
        { y: 3, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, duration: 0.35, ease: 'power3.out' },
        '-=0.2'
      )
      internalTl.fromTo(buttonsWrapRef.current, { x: 4, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, '-=0.2')
    })

    return () => ctx.revert()
  }, [isLoaded])

  const updatePillToActive = () => {
    if (!linksWrapRef.current || !pillRef.current) return
    const activeEl = linksWrapRef.current.querySelector('.active')
    if (activeEl) {
      gsap.to(pillRef.current, {
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        duration: 0.35,
        ease: 'power3.out',
        autoAlpha: 1
      })
    } else {
      gsap.to(pillRef.current, { autoAlpha: 0, duration: 0.3 })
    }
  }

  useEffect(() => {
    const timer = setTimeout(updatePillToActive, 50)
    return () => clearTimeout(timer)
  }, [location.pathname, t])

  // Floating Pill Highlight Logic
  const handleHover = (e) => {
    const { offsetLeft, offsetWidth } = e.currentTarget
    gsap.to(pillRef.current, {
      left: offsetLeft,
      width: offsetWidth,
      duration: 0.35,
      ease: 'power3.out',
      autoAlpha: 1
    })
  }

  const handleLeave = () => {
    updatePillToActive()
  }

  const tl = useRef(null)

  useEffect(() => {
    const contentWrap = document.getElementById('content-wrapper')
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true, defaults: { duration: 1.1, ease: 'expo.inOut' } })

      // 1. Perspective Shift for Content
      tl.current.to(contentWrap, {
        scale: 0.85,
        rotateY: -10,
        x: '-15%',
        borderRadius: '2rem',
        pointerEvents: 'none',
      }, 0)

      // 2. Hide Site Navbar entirely
      tl.current.to(navContainerRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.8 }, 0)

      // 3. Cascading Shutters
      tl.current.to(menuRef.current, { autoAlpha: 1, duration: 0 }, 0)
      tl.current.fromTo([shutter1Ref.current, shutter2Ref.current, shutter3Ref.current],
        { x: '100%' },
        { x: '0%', stagger: 0.1 },
        0
      )

      // 4. Menu Header Reveal
      tl.current.fromTo('.menu-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6)

      // 5. Staggered Menu Content
      tl.current.fromTo('.menu-item',
        { y: 40, opacity: 0, rotateX: -20, scale: 0.95, filter: 'blur(15px)' },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, filter: 'blur(0px)', stagger: 0.1, duration: 1.2, ease: 'power3.out' },
        0.5
      )

      // 4. Background Shapes Reveal
      tl.current.fromTo('.bg-shape',
        { scale: 0.3, opacity: 0, rotate: -45 },
        { scale: 1, opacity: 0.12, rotate: 0, stagger: 0.15, duration: 1.5 },
        0.5
      )

      // 5. Staggered Menu Content (Materializing from void)
      tl.current.fromTo('.menu-item',
        { y: 40, opacity: 0, rotateX: -20, scale: 0.95, filter: 'blur(15px)' },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, filter: 'blur(0px)', stagger: 0.12, duration: 1.2, ease: 'power3.out' },
        0.6
      )

      // Perpetual Float (independent of timeline)
      gsap.to('.bg-shape-float', {
        y: '30px',
        x: '15px',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.8, from: 'random' }
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isOpen) {
      tl.current.play()
    } else {
      tl.current.reverse()
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Full Width Top Navbar */}
      <nav
        ref={navContainerRef}
        className="fixed top-0 left-0 right-0 w-full z-[120] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs opacity-0 pointer-events-none"
      >
        <div
          ref={innerNavRef}
          className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between py-3.5 w-full"
        >

          <Link to="/" ref={logoRef} className="flex items-center hover:opacity-80 transition-opacity gap-2.5 text-slate-900">
            <img src="/adka_trade_logo.png" alt="ADAK TRADE Logo" className="h-10 md:h-11 w-auto object-contain rounded-lg" />
          </Link>

          <div
            ref={linksWrapRef}
            onMouseLeave={handleLeave}
            className="hidden xl:flex items-center gap-1.5 relative px-1 py-1"
          >
            {/* Active Highlight Indicator */}
            <div
              ref={pillRef}
              className="absolute top-1/2 -translate-y-1/2 h-8 bg-[#EBF5FA] border border-[#047857]/30 rounded-lg pointer-events-none transition-all duration-300 z-0 opacity-0"
            />

            {navLinks.map((link) => (
              <NavLink
                key={link.key}
                to={link.path}
                onMouseEnter={handleHover}
                className={({ isActive }) =>
                  `nav-link-item group px-4 py-2 rounded-lg font-inter text-[11px] font-bold uppercase transition-all duration-300 tracking-[0.15em] relative z-10 ${isActive ? 'text-[#047857] font-black' : 'text-slate-700 hover:text-[#047857]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div ref={buttonsWrapRef} className="flex items-center gap-3">

            {/* Phone Button */}
            <a
              href="tel:+917908927127"
              className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#047857]/30 items-center justify-center text-[#047857] hover:bg-[#047857] hover:text-white transition-colors duration-300 shadow-sm group"
              title="Call Us"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            <Link
              to={token ? "/dashboard" : "/login"}
              className="relative group bg-[#047857] hover:bg-[#064e3b] text-white font-bold px-6 py-2.5 rounded-none font-inter text-[11px] uppercase tracking-[0.15em] overflow-hidden transition-all duration-300 hover:scale-[1.05] active:scale-95 shadow-[0_4px_15px_rgba(4,120,87,0.35)] flex items-center justify-center gap-2"
            >
              <span className="relative z-10">{token ? t('dashboard') : t('signIn')}</span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
            </Link>

            <button
              onClick={toggleMenu}
              className="xl:hidden w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-[5px] relative z-[130] group hover:bg-[#EBF5FA] hover:border-[#047857]/40 transition-colors"
            >
              <span ref={line1Ref} className="w-4 h-[2px] bg-slate-800 transition-colors group-hover:bg-[#047857]" />
              <span ref={line2Ref} className="w-5 h-[2px] bg-slate-800 transition-colors group-hover:bg-[#047857]" />
              <span ref={line3Ref} className="w-4 h-[2px] bg-slate-800 transition-colors group-hover:bg-[#047857]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Multilayered Cascading Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[110] h-[100dvh] overflow-hidden opacity-0 invisible"
      >
        <div ref={shutter1Ref} className="absolute inset-0 bg-slate-50 translate-x-full" />
        <div ref={shutter2Ref} className="absolute inset-0 bg-[#EBF5FA]/80 translate-x-full border-r border-[#047857]/30 backdrop-blur-xl" />
        <div ref={shutter3Ref} className="absolute inset-0 bg-white translate-x-full overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] [background-size:200px_200px]" />

          {/* Internal Menu Header */}
          <header className="menu-header absolute top-0 left-0 w-full px-8 md:px-12 py-8 md:py-10 flex items-center justify-between z-50">
            <Link to="/" onClick={toggleMenu} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/adka_trade_logo.png" alt="ADAK TRADE Logo" className="h-10 md:h-12 w-auto object-contain rounded-lg" />
            </Link>

            <button
              onClick={toggleMenu}
              className="group w-12 h-12 md:w-14 md:h-14 flex items-center justify-center relative hover:scale-110 active:scale-90 transition-transform"
            >
              <div className="absolute inset-0 bg-slate-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-expo" />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative transition-transform duration-700 group-hover:rotate-180">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-normal" />
              </svg>
            </button>
          </header>

          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-10 md:gap-16 px-8 text-center pt-28 md:pt-40 pb-12 overflow-y-auto">
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.key}
                  to={link.path}
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    `menu-item font-newsreader text-3xl sm:text-4xl md:text-8xl font-extralight transition-all duration-300 block ${isActive ? 'text-accent italic' : 'text-slate-800 opacity-60 hover:opacity-100 hover:tracking-wider'
                    }`
                  }
                >
                  <RollingText text={link.name} className="md:h-24 h-8 sm:h-10" />
                </NavLink>
              ))}
            </div>

            <div className="menu-item flex flex-col items-center gap-12 pt-4">

              <div className="flex flex-col gap-8 items-center w-full px-4">
                <div className="flex gap-6 items-center justify-center">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="group relative p-2"
                      aria-label={social.name}
                      onClick={toggleMenu}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-500 hover:text-accent transition-all duration-300 hover:scale-110"
                      >
                        {social.isInsta ? (
                          <>
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d={social.icon} />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </>
                        ) : (
                          <path d={social.icon} />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
                <div className="flex flex-col gap-2 items-center text-center w-full">
                  <p className="font-jetbrains text-[9px] tracking-[0.3em] sm:tracking-[0.6em] text-slate-500 uppercase italic whitespace-normal">Where Ambition Meets Execution</p>
                  <p className="font-jetbrains text-[8px] tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 uppercase whitespace-normal">© 2026 ADAK TRADE EFFORT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
