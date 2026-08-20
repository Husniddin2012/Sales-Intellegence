import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme, ThemeType, ThemeInfo } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = availableThemes.find(t => t.id === theme) || availableThemes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: isOpen ? '0 0 12px var(--accent-glow)' : 'none'
        }}
        title="Dizayn Mavzusini Tanlash (Atmosfera)"
      >
        <span style={{ fontSize: 14 }}>{currentTheme.icon}</span>
        <span style={{ fontWeight: 800 }}>
          {currentTheme.label[language] || currentTheme.label['uz']}
        </span>
        <ChevronDown style={{ width: 14, height: 14, color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Futuristic Theme Picker Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 320,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-active)',
            borderRadius: 18,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px var(--accent-glow)',
            padding: 12,
            zIndex: 200,
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px 12px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <Palette style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
              <span>{language === 'uz' ? 'Dizayn Dunyosi' : language === 'ru' ? 'Стиль Интерфейса' : 'Visual Universe'}</span>
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 6,
              background: 'var(--badge-primary-bg)',
              color: 'var(--accent-primary)'
            }}>
              6 ta Olam
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {availableThemes.map((t: ThemeInfo) => {
              const isSelected = t.id === theme;

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                    background: isSelected ? 'var(--badge-primary-bg)' : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 2px 10px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: t.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      flexShrink: 0
                    }}>
                      {t.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {t.label[language] || t.label['uz']}
                      </div>
                      <div style={{ fontSize: 11, color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)', marginTop: 2 }}>
                        {t.subtitle[language] || t.subtitle['uz']}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}>
                      <Check style={{ width: 13, height: 13, strokeWidth: 3 }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
