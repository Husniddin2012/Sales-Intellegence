import React, { useState } from 'react';
import { Sparkles, RefreshCw, RotateCcw, ShieldCheck, CheckCircle2, User, Users, LogOut, KeyRound, ChevronDown, Building, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PageId } from './Sidebar';

interface NavbarProps {
  onRefresh: () => void;
  onReset: () => void;
  isLoading: boolean;
  completedActionsCount: number;
  onOpenAuth: (mode?: 'login' | 'register' | 'forgot') => void;
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefresh,
  onReset,
  isLoading,
  completedActionsCount,
  onOpenAuth,
  currentPage,
  onSelectPage
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header style={{
      background: 'var(--bg-card-header)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      backdropFilter: 'blur(12px)',
      padding: '12px 24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14
      }}>
        
        {/* Left Sub-title / Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-info" style={{ fontSize: 11 }}>
            {t('brand_title')}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            📉 {t('sales_drop_badge')}
          </span>
        </div>

        {/* Right Controls, Language & Theme Switcher & Auth Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          
          <div className="badge badge-success" style={{ padding: '6px 12px', fontSize: 12 }}>
            <CheckCircle2 style={{ width: 14, height: 14 }} />
            <span>{t('ai_solutions_count')}: <strong style={{ color: '#ffffff' }}>{completedActionsCount}/5</strong></span>
          </div>

          {/* Language Switcher (UZB, ENG, RUS) */}
          <LanguageSwitcher />

          {/* Theme Switcher Button */}
          <ThemeSwitcher />

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: 12 }}
            title={t('refresh_btn')}
          >
            <RefreshCw style={{ width: 14, height: 14, animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            <span>{t('refresh_btn')}</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            className="btn btn-outline"
            style={{
              padding: '7px 12px',
              fontSize: 12,
              color: '#fda4af',
              borderColor: 'rgba(244, 63, 94, 0.3)',
              background: 'rgba(244, 63, 94, 0.08)'
            }}
            title={t('reset_btn')}
          >
            <RotateCcw style={{ width: 14, height: 14 }} />
            <span>{t('reset_btn')}</span>
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 12,
                  background: 'var(--badge-primary-bg)',
                  border: '1px solid var(--border-active)',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{user.fullName}</div>
                  <div style={{ fontSize: 10, color: 'var(--accent-primary)' }}>{user.role.split('/')[0]}</div>
                </div>
                <ChevronDown style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 240,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-active)',
                    borderRadius: 14,
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
                    padding: 8,
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{user.fullName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{user.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent-primary)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building style={{ width: 12, height: 12 }} />
                      <span>{user.companyName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setUserMenuOpen(false); onSelectPage('users'); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Users style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
                    <span>Foydalanuvchilar & Jamoa</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onSelectPage('admin'); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Settings style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
                    <span>{t('menu_admin')}</span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onOpenAuth('forgot'); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <KeyRound style={{ width: 14, height: 14, color: '#f59e0b' }} />
                    <span>
                      {language === 'uz' && 'Parolni almashtirish'}
                      {language === 'ru' && 'Сменить пароль'}
                      {language === 'en' && 'Reset Password'}
                    </span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); onOpenAuth('login'); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <User style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
                    <span>
                      {language === 'uz' && 'Akkauntni almashtirish'}
                      {language === 'ru' && 'Сменить аккаунт'}
                      {language === 'en' && 'Switch Account'}
                    </span>
                  </button>

                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger-color)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: 4,
                      borderTop: '1px solid var(--border-color)'
                    }}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                    <span>
                      {language === 'uz' && 'Chiqish (Logout)'}
                      {language === 'ru' && 'Выйти'}
                      {language === 'en' && 'Sign Out'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: 12 }}
            >
              <User style={{ width: 14, height: 14 }} />
              <span>
                {language === 'uz' && 'Kirish'}
                {language === 'ru' && 'Войти'}
                {language === 'en' && 'Sign In'}
              </span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
