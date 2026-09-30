import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, googleLoginUser, clearAuthError, requestPasswordReset } from '../redux/slices/authSlice'
import { useGoogleLogin } from '@react-oauth/google'
import { useLanguage } from '../context/LanguageContext'

import './Login.css'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  // Clear error when inputs change
  useEffect(() => {
    if (error) dispatch(clearAuthError())
  }, [email, password])

  useEffect(() => {
    if (!forgotOpen) {
      setForgotError('')
      setForgotMessage('')
      return
    }

    setForgotEmail(email.trim())
  }, [forgotOpen, email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    const resultAction = await dispatch(loginUser({ email: email.trim(), password }))
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/dashboard', { replace: true })
    }
  }

  const openForgotModal = () => {
    setForgotEmail(email.trim())
    setForgotError('')
    setForgotMessage('')
    setForgotOpen(true)
  }

  const closeForgotModal = () => {
    if (forgotLoading) return
    setForgotOpen(false)
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()

    const targetEmail = forgotEmail.trim()
    if (!targetEmail || !targetEmail.includes('@')) {
      setForgotError('Enter a valid email address.')
      return
    }

    setForgotLoading(true)
    setForgotError('')
    setForgotMessage('')

    try {
      const response = await dispatch(requestPasswordReset({ email: targetEmail })).unwrap()
      setForgotMessage(response?.message || 'Reset instructions have been sent to your email.')
    } catch (err) {
      setForgotError(err || 'Unable to send reset link.')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resultAction = await dispatch(googleLoginUser({
          googleAccessToken: tokenResponse.access_token,
          deviceId: 'browser',
          platform: 'web'
        }));
        if (googleLoginUser.fulfilled.match(resultAction)) {
          navigate('/dashboard', { replace: true })
        }
      } catch (err) {
        console.error('Google Login Error:', err);
      }
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <div className="login-container">
      {/* Left Section: Login Form */}
      <div className="login-left">
        <div className="flex items-center justify-between w-full mb-8">
          <Link to="/" className="login-logo flex items-center gap-2.5">
            <img src="/logo/iasdcs-logo.png" alt="IAS DCS Logo" className="h-10 w-auto object-contain rounded-lg" />
          </Link>
        </div>

        <div className="login-form-wrap">
          <h1 className="login-title">{t('welcomeBackTitle')}</h1>
          <p className="login-subtitle">{t('loginSubtitle')}</p>

          <button type="button" className="google-btn" onClick={() => handleGoogleLogin()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.87 14.13c-.22-.67-.35-1.38-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.53 1 10.21 1 12s.43 3.47 1.18 4.97l3.69-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.84c.86-2.59 3.28-4.51 6.13-4.51z" fill="#EA4335" />
            </svg>
            {t('continueWithGoogle')}
          </button>

          <div className="divider">
            <span>{t('orEmail')}</span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="login-email">{t('emailAddress')}</label>
              </div>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="scholar@edrilla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="login-password">{t('password')}</label>
                <button type="button" className="forgot-link" onClick={openForgotModal}>{t('forgotPassword')}</button>
              </div>
              <div className="password-field-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`signin-btn ${loading ? 'signin-btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="signin-spinner" />
                  AUTHENTICATING...
                </>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

          <div className="signup-text">
            {t('donthaveAccount')} <Link to="/signup" className="signup-link">{t('signUpNow')}</Link>
          </div>
        </div>

        <div className="login-footer">
          © 2024 EDRILLA V2.0. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Section: Visual Showcase with Landing Page Illustration */}
      <div className="login-right relative flex flex-col justify-between p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-slate-50 via-[#EBF5FA]/60 to-[#F6F9D7]/30">
        {/* Ambient decorative glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] bg-[#017DC3]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[320px] h-[320px] bg-[#BFD419]/12 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#017DC3]/25 text-[#017DC3] text-[10px] font-extrabold uppercase tracking-widest font-jetbrains shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#017DC3] animate-pulse"></span>
            <span>RESEARCH & SCHOLAR PORTAL</span>
          </div>
          <span className="text-[10px] font-jetbrains text-slate-500 font-bold uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full border border-slate-200">
            IAS DCS V2.0
          </span>
        </div>

        {/* Center Illustration Showcase */}
        <div className="relative z-10 w-full my-auto flex flex-col items-center justify-center py-6">
          <div className="relative w-full max-w-md flex items-center justify-center group">
            {/* Soft backdrop glow card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#017DC3]/10 via-white/50 to-[#BFD419]/10 rounded-3xl blur-md" />
            
            {/* Landing page Hero Banner illustration */}
            <img 
              src="/hero_banner.png" 
              alt="IAS DCS Statistical Science & Research" 
              className="relative z-10 w-auto h-auto max-h-[320px] lg:max-h-[360px] max-w-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Floating Metric Badge 1 (Bottom-left) */}
            <div className="absolute -bottom-2 -left-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-xl flex items-center gap-3 transition-transform duration-500 hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-[#EBF5FA] text-[#017DC3] flex items-center justify-center font-black font-jetbrains text-xs">
                12K+
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">Active Scholars</span>
                <span className="text-[10px] text-slate-500 font-medium">Applied Statistics</span>
              </div>
            </div>

            {/* Floating Metric Badge 2 (Top-right) */}
            <div className="absolute -top-2 -right-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2.5 transition-transform duration-500 hover:translate-y-1">
              <div className="w-6 h-6 rounded-full bg-[#F6F9D7] text-[#6B770A] border border-[#BFD419]/50 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">98.2%</span>
                <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Completion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial / Brand Note */}
        <div className="relative z-10 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 lg:p-5 shadow-xs">
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
            "Advancing scientific research through empirical statistical methods, clinical trials, and certified academic mentorship."
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
            <span className="text-[#017DC3] font-bold">Institute of Applied Statistics</span>
            <span className="font-jetbrains text-[10px] text-slate-400">RESEARCH HUB</span>
          </div>
        </div>
      </div>

      {forgotOpen && (
        <div className="forgot-modal-backdrop" onClick={closeForgotModal}>
          <div className="forgot-modal" onClick={(event) => event.stopPropagation()}>
            <div className="forgot-modal__header">
              <div>
                <p className="forgot-modal__eyebrow">{t('forgotPassword')}</p>
                <h2 className="forgot-modal__title">{t('requestResetLink')}</h2>
              </div>
              <button type="button" className="forgot-modal__close" onClick={closeForgotModal} aria-label="Close forgot password dialog">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <p className="forgot-modal__copy">
              {t('requestResetLinkDesc')}
            </p>

            {forgotError && <div className="forgot-modal__status forgot-modal__status--error">{forgotError}</div>}
            {forgotMessage && <div className="forgot-modal__status forgot-modal__status--success">{forgotMessage}</div>}

            <form className="forgot-modal__form" onSubmit={handleForgotSubmit}>
              <label className="forgot-modal__label" htmlFor="forgot-email">{t('emailAddress')}</label>
              <input
                id="forgot-email"
                type="email"
                className="forgot-modal__input"
                placeholder="scholar@edrilla.com"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                autoComplete="email"
                required
              />

              <div className="forgot-modal__actions">
                <button type="button" className="forgot-modal__secondary" onClick={closeForgotModal} disabled={forgotLoading}>
                  {t('cancelBtn')}
                </button>
                <button type="submit" className="forgot-modal__primary" disabled={forgotLoading}>
                  {forgotLoading ? t('sendingBtn') : t('sendResetLinkBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login

