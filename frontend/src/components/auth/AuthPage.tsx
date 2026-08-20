import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw,
  Crown,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { InteractiveThemeCanvas } from '../theme/InteractiveThemeCanvas';
import confetti from 'canvas-confetti';

type AuthPageTab = 'login' | 'register' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password';
type LoginRole = 'admin' | 'worker';

export const AuthPage: React.FC = () => {
  const { login, register, forgotPassword, verifyOtp, resetPassword } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<AuthPageTab>('login');
  const [selectedRole, setSelectedRole] = useState<LoginRole>('admin');

  // Form Fields - EMPTY by default, no auto-filling!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Reset Specific
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Visibility Toggles (Ko'zchalar)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch role without modifying inputs
  const handleRoleChange = (role: LoginRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Iltimos, login va parolni kiriting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ email: email.trim(), password });
      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kirishda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Kiritilgan parollar bir-biriga mos kelmadi. Iltimos qaytadan tekshiring.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Parol kamida 6 ta belgidan iborat bo\'lishi shart.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Ro'yxatdan o'tish faqat ishchi sifatida amalga oshiriladi
      const res = await register({ fullName, email: email.trim(), password, companyName });
      if (res.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const res = await forgotPassword({ email: email.trim() });
      if (res.success) {
        setSuccessMessage(res.message || '6 xonali tasdiqlash kodi emailingizga yuborildi!');
        setActiveTab('forgot_otp');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Tasdiqlash kodini yuborishda xatolik.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await verifyOtp({ email: email.trim(), otpCode });
      if (res.success) {
        setSuccessMessage('Emailingiz muvaffaqiyatli tasdiqlandi! Yangi parolingizni o\'rnating.');
        setActiveTab('forgot_new_password');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kiritilgan kod xato yoki muddati o\'tgan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Yangi kiritilgan parollar bir-biriga mos kelmadi.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Yangi parol kamida 6 ta belgidan iborat bo\'lishi shart.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword({ email: email.trim(), otpCode, newPassword });
      if (res.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Parolni yangilashda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at 50% 20%, #0a192f 0%, #030712 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <InteractiveThemeCanvas />
      
      {/* Top Navbar */}
      <header style={{
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(3, 7, 18, 0.6)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--accent-glow)'
          }}>
            <Sparkles style={{ width: 20, height: 20, color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.3px', color: '#ffffff' }}>
              Sales Intelligence
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {language === 'uz' ? 'AI Boshqaruv & Xavfsiz Tizim' : 'AI Executive Analytics Platform'}
            </div>
          </div>
        </div>

        {/* Language & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 490,
          background: 'rgba(15, 23, 42, 0.90)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.1)'
        }}>

          {/* Navigation Tabs (Kirish / Ro'yxatdan O'tish) */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 4,
            borderRadius: 14,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: 24
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); setSuccessMessage(null); }}
              style={{
                flex: 1,
                padding: '11px 0',
                borderRadius: 10,
                border: 'none',
                background: activeTab === 'login' ? 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)' : 'transparent',
                color: activeTab === 'login' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: activeTab === 'login' ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'login' ? '0 4px 12px var(--accent-glow)' : 'none'
              }}
            >
              {language === 'uz' ? 'Tizimga Kirish' : language === 'ru' ? 'Вход в систему' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); setSuccessMessage(null); }}
              style={{
                flex: 1,
                padding: '11px 0',
                borderRadius: 10,
                border: 'none',
                background: activeTab === 'register' ? 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)' : 'transparent',
                color: activeTab === 'register' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: activeTab === 'register' ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'register' ? '0 4px 12px var(--accent-glow)' : 'none'
              }}
            >
              {language === 'uz' ? "Ro'yxatdan O'tish (Ishchi)" : language === 'ru' ? 'Регистрация (Сотрудник)' : 'Register (Worker)'}
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: 12,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              lineHeight: 1.4
            }}>
              <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: 12,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              lineHeight: 1.4
            }}>
              <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN (2 ROLES: ADMIN / BOSHLIQ & ISHCHI) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Role Selection (Kirishda 2 ta rol - Faqat rol tanlanadi, input to'ldirilmaydi) */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>
                  Kirish Roli (Lavozimni tanlang)
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: 6,
                  borderRadius: 14,
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {/* Role 1: Admin / Boshliq */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: selectedRole === 'admin' ? '1px solid #38bdf8' : '1px solid transparent',
                      background: selectedRole === 'admin' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                      color: selectedRole === 'admin' ? '#38bdf8' : 'var(--text-muted)',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Crown style={{ width: 16, height: 16, color: '#f59e0b' }} />
                    <span>Admin / Boshliq</span>
                  </button>

                  {/* Role 2: Ishchi */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('worker')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: selectedRole === 'worker' ? '1px solid #38bdf8' : '1px solid transparent',
                      background: selectedRole === 'worker' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                      color: selectedRole === 'worker' ? '#38bdf8' : 'var(--text-muted)',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Briefcase style={{ width: 16, height: 16, color: '#38bdf8' }} />
                    <span>Ishchi / Xodim</span>
                  </button>
                </div>
              </div>

              {/* Email / Login Input */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  {selectedRole === 'admin' ? 'Admin Logini yoki Email' : 'Email Manzil'}
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '12px 14px'
                }}>
                  <Mail style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'admin' ? "admin" : "email manzilingiz"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Parol
                  </label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('forgot_email'); setErrorMessage(null); setSuccessMessage(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '12px 14px'
                }}>
                  <Lock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      width: '100%'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    title={showPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? <EyeOff style={{ width: 18, height: 18, color: '#38bdf8' }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: 6,
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px var(--accent-glow)'
                }}
              >
                {isSubmitting ? (
                  <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>{selectedRole === 'admin' ? "Boshliq sifatida kirish" : "Ishchi sifatida kirish"}</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER (ONLY 1 ROLE: ISHCHI / SOTUV XODIMI) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Role Notice (Only Ishchi) */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.10)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <Briefcase style={{ width: 18, height: 18, color: '#38bdf8', flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: '#e0f2fe' }}>
                  Ro'yxatdan o'tish faqat <strong>Ishchi / Sotuv xodimi</strong> hisobi uchun ochilgan.
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: 'var(--text-secondary)' }}>
                  Ism va Familiyangiz *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '10px 14px'
                }}>
                  <User style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Ismingiz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: 'var(--text-secondary)' }}>
                  Email Manzil *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '10px 14px'
                }}>
                  <Mail style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="email@kompaniya.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: 'var(--text-secondary)' }}>
                  Kompaniya yoki Filial Nomi
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '10px 14px'
                }}>
                  <Building style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Kompaniya nomi"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
                  />
                </div>
              </div>

              {/* Password & Confirm Password WITH EYE TOGGLE ICONS (KO'ZCHA) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* Parol with eye */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: 'var(--text-secondary)' }}>
                    Parol *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: '10px 12px'
                  }}>
                    <Lock style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Kamida 6 belgi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 12, width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                      title={showPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                    >
                      {showPassword ? <EyeOff style={{ width: 15, height: 15, color: '#38bdf8' }} /> : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with eye */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5, color: 'var(--text-secondary)' }}>
                    Tasdiqlash *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: '10px 12px'
                  }}>
                    <Lock style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Qayta kiriting"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 12, width: '100%' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                      title={showConfirmPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                    >
                      {showConfirmPassword ? <EyeOff style={{ width: 15, height: 15, color: '#38bdf8' }} /> : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: 8,
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px var(--accent-glow)'
                }}
              >
                {isSubmitting ? (
                  <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>Ishchi sifatida Ro'yxatdan O'tish</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD - STEP 1 (EMAIL SENDER) */}
          {activeTab === 'forgot_email' && (
            <form onSubmit={handleForgotEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <KeyRound style={{ width: 20, height: 20, color: 'var(--accent-primary)' }} />
                  Parolni Qayta Tiklash
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                  Akkauntingizga bog'langan emailni kiriting. Tizim xavfsizlik kodi (6 xonali OTP)ni emailingizga yuboradi.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Email Manzil
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '12px 14px'
                }}>
                  <Mail style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="email manzilingiz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px var(--accent-glow)'
                }}
              >
                {isSubmitting ? (
                  <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>Emailga Kod Yuborish</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}
              >
                &larr; Orqaga (Kirishga qaytish)
              </button>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD - STEP 2 (OTP CODE INPUT) */}
          {activeTab === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck style={{ width: 20, height: 20, color: '#10b981' }} />
                  Emailga Yuborilgan Kodni Kiriting
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                  <strong style={{ color: '#38bdf8' }}>{email}</strong> manziliga 6 xonali tasdiqlash kodi yuborildi. Iltimos pochtangizni tekshirib, kodni kiriting.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  6 Xonali Tasdiqlash Kodi
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    fontSize: 24,
                    fontWeight: 900,
                    letterSpacing: 8,
                    textAlign: 'center',
                    color: '#38bdf8',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length < 6}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: isSubmitting || otpCode.length < 6 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px var(--accent-glow)'
                }}
              >
                {isSubmitting ? (
                  <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>Kodni Tasdiqlash</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('forgot_email'); setErrorMessage(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}
              >
                &larr; Emailni o'zgartirish yoki qayta yuborish
              </button>
            </form>
          )}

          {/* TAB 5: FORGOT PASSWORD - STEP 3 (NEW PASSWORD & CONFIRM WITH EYE ICONS) */}
          {activeTab === 'forgot_new_password' && (
            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock style={{ width: 20, height: 20, color: '#10b981' }} />
                  Yangi Parol O'rnatish
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Yangi xavfsiz parolingizni kiriting (kamida 6 ta belgi).
                </p>
              </div>

              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Yangi Parol *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '12px 14px'
                }}>
                  <Lock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Yangi parol (kamida 6 belgi)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    title={showNewPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                  >
                    {showNewPassword ? <EyeOff style={{ width: 18, height: 18, color: '#38bdf8' }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Yangi Parolni Tasdiqlash *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '12px 14px'
                }}>
                  <Lock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Yangi parolni qayta kiriting"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    title={showConfirmNewPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                  >
                    {showConfirmNewPassword ? <EyeOff style={{ width: 18, height: 18, color: '#38bdf8' }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || newPassword.length < 6}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: isSubmitting || newPassword.length < 6 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isSubmitting ? (
                  <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>Parolni Saqlash & Tizimga Kirish</span>
                    <CheckCircle2 style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};
