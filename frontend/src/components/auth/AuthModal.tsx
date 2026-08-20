import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  RefreshCw,
  Crown,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

type AuthMode = 'login' | 'register' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password';
type LoginRole = 'admin' | 'worker';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, register, forgotPassword, verifyOtp, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode === 'forgot' ? 'forgot_email' : initialMode);
  const [selectedRole, setSelectedRole] = useState<LoginRole>('admin');

  // Form Fields - clean and empty by default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Reset Specific
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Eye toggles (Ko'zchalar)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        onClose();
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
      setErrorMessage('Kiritilgan parollar bir-biriga mos kelmadi.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Parol kamida 6 ta belgidan iborat bo\'lishi shart.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({ fullName, email: email.trim(), password, companyName });
      if (res.success) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        onClose();
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
    setIsSubmitting(true);
    try {
      const res = await forgotPassword({ email: email.trim() });
      if (res.success) {
        setSuccessMessage(res.message || 'Tasdiqlash kodi emailingizga yuborildi!');
        setMode('forgot_otp');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Email tekshirishda xatolik yuz berdi.');
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
        setSuccessMessage(res.message);
        setMode('forgot_new_password');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kod noto\'g\'ri kiritildi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Yangi parollar mos kelmadi.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Parol kamida 6 ta belgidan iborat bo\'lishi shart.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword({ email: email.trim(), otpCode, newPassword });
      if (res.success) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        onClose();
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 490, background: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 20 }}
      >
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#090e1a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              <Lock style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                {mode === 'login' && 'Tizimga Kirish'}
                {mode === 'register' && "Ro'yxatdan O'tish (Ishchi)"}
                {mode === 'forgot_email' && 'Parolni Tiklash (1/3: Email)'}
                {mode === 'forgot_otp' && 'Parolni Tiklash (2/3: Kod Tasdiqlash)'}
                {mode === 'forgot_new_password' && 'Parolni Tiklash (3/3: Yangi Parol)'}
              </h3>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                Sales Intelligence xavfsiz boshqaruv tizimi
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            padding: 4,
            margin: '16px 24px 0',
            background: '#090d16',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => { setMode('login'); setErrorMessage(null); }}
              style={{
                padding: '9px 0',
                borderRadius: 8,
                border: 'none',
                background: mode === 'login' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Kirish
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(null); }}
              style={{
                padding: '9px 0',
                borderRadius: 8,
                border: 'none',
                background: mode === 'register' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Ro'yxatdan o'tish (Ishchi)
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <div style={{ padding: 24, overflowY: 'auto' }}>
          
          {/* Alerts */}
          {errorMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#fda4af',
              fontSize: 12,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              fontSize: 12,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN FORM (2 ROLES) */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Role Picker (2 Roles) */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Kirish Roli
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  background: '#090d16',
                  padding: 4,
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: selectedRole === 'admin' ? '1px solid #38bdf8' : '1px solid transparent',
                      background: selectedRole === 'admin' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                      color: selectedRole === 'admin' ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <Crown style={{ width: 14, height: 14, color: '#f59e0b' }} />
                    <span>Admin / Boshliq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('worker')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: selectedRole === 'worker' ? '1px solid #38bdf8' : '1px solid transparent',
                      background: selectedRole === 'worker' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                      color: selectedRole === 'worker' ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <Briefcase style={{ width: 14, height: 14, color: '#38bdf8' }} />
                    <span>Ishchi / Xodim</span>
                  </button>
                </div>
              </div>

              {/* Email / Login */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  {selectedRole === 'admin' ? 'Admin Logini yoki Email' : 'Email Manzili'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'admin' ? "admin" : "email manzilingiz"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
                    Parol
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_email'); setErrorMessage(null); setSuccessMessage(null); }}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 38px 10px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: 16, height: 16, color: '#38bdf8' }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0', marginTop: 6 }}
              >
                {isSubmitting ? 'Tekshirilmoqda...' : (selectedRole === 'admin' ? 'Boshliq sifatida kirish' : 'Ishchi sifatida kirish')}
              </button>

            </form>
          )}

          {/* 2. REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              <div style={{
                background: 'rgba(56, 189, 248, 0.10)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 10,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <Briefcase style={{ width: 16, height: 16, color: '#38bdf8', flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: '#e0f2fe' }}>
                  Ro'yxatdan o'tish faqat <strong>Ishchi / Xodim</strong> hisobi uchun ochilgan.
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                  Ism va Familiya *
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    placeholder="Ismingiz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                  Email Manzili *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    placeholder="email@kompaniya.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                  Kompaniya / Do'kon Nomi
                </label>
                <div style={{ position: 'relative' }}>
                  <Building style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Kompaniya nomi"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password & Confirm Password WITH EYE TOGGLE ICONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* Parol with eye */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Parol *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Kamida 6 belgi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 32px 10px 12px',
                        borderRadius: 10,
                        background: '#090d16',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontSize: 12,
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff style={{ width: 14, height: 14, color: '#38bdf8' }} /> : <Eye style={{ width: 14, height: 14 }} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with eye */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Tasdiqlash *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Qayta kiriting"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 32px 10px 12px',
                        borderRadius: 10,
                        background: '#090d16',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontSize: 12,
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff style={{ width: 14, height: 14, color: '#38bdf8' }} /> : <Eye style={{ width: 14, height: 14 }} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0', marginTop: 8 }}
              >
                {isSubmitting ? 'Yaratilmoqda...' : 'Ro\'yxatdan O\'tish'}
              </button>

            </form>
          )}

          {/* 3. FORGOT PASSWORD - STEP 1: EMAIL */}
          {mode === 'forgot_email' && (
            <form onSubmit={handleForgotEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                Ro'yxatdan o'tgan emailingizni kiriting. Xavfsizlik kodi pochtangizga yuboriladi.
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Email Manzili
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    placeholder="email manzilingiz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0' }}
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Emailga Kod Yuborish &rarr;'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}
              >
                &larr; Orqaga: Kirish sahifasi
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD - STEP 2: OTP CODE */}
          {mode === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                <strong style={{ color: '#38bdf8' }}>{email}</strong> pochtasiga yuborilgan 6 xonali tasdiqlash kodini kiriting:
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  6 Xonali Tasdiqlash Kodi
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
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
                      padding: '12px 14px 12px 38px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      fontSize: 20,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: 6,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length < 6}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0' }}
              >
                {isSubmitting ? 'Tekshirilmoqda...' : 'Kodni Tasdiqlash &rarr;'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('forgot_email'); setErrorMessage(null); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}
              >
                &larr; Emailni o'zgartirish
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD - STEP 3: NEW PASSWORD */}
          {mode === 'forgot_new_password' && (
            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* New Password with Eye */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Yangi Parol *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Kamida 6 belgi"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 38px 10px 14px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {showNewPassword ? <EyeOff style={{ width: 16, height: 16, color: '#38bdf8' }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password with Eye */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                  Yangi Parolni Tasdiqlash *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Qayta kiriting"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 38px 10px 14px',
                      borderRadius: 10,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {showConfirmNewPassword ? <EyeOff style={{ width: 16, height: 16, color: '#38bdf8' }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success"
                style={{ width: '100%', padding: '12px 0', marginTop: 6 }}
              >
                {isSubmitting ? 'Yangilanmoqda...' : 'Parolni Saqlash & Tizimga Kirish'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
