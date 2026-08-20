import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../services/translations';

export const UzbekistanFlag: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={Math.round(size * 0.68)} viewBox="0 0 640 480" style={{ borderRadius: 3, flexShrink: 0, overflow: 'hidden', boxShadow: '0 0 2px rgba(0,0,0,0.6)' }}>
    <rect width="640" height="160" fill="#0099b5"/>
    <rect y="160" width="640" height="160" fill="#ffffff"/>
    <rect y="320" width="640" height="160" fill="#1eb53a"/>
    <rect y="150" width="640" height="10" fill="#ce1126"/>
    <rect y="320" width="640" height="10" fill="#ce1126"/>
    <circle cx="70" cy="80" r="45" fill="#ffffff"/>
    <circle cx="85" cy="80" r="40" fill="#0099b5"/>
    <g fill="#ffffff">
      <circle cx="140" cy="50" r="6"/>
      <circle cx="165" cy="50" r="6"/>
      <circle cx="190" cy="50" r="6"/>
      <circle cx="140" cy="80" r="6"/>
      <circle cx="165" cy="80" r="6"/>
      <circle cx="190" cy="80" r="6"/>
      <circle cx="215" cy="80" r="6"/>
      <circle cx="140" cy="110" r="6"/>
      <circle cx="165" cy="110" r="6"/>
      <circle cx="190" cy="110" r="6"/>
      <circle cx="215" cy="110" r="6"/>
      <circle cx="240" cy="110" r="6"/>
    </g>
  </svg>
);

export const RussiaFlag: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={Math.round(size * 0.68)} viewBox="0 0 640 480" style={{ borderRadius: 3, flexShrink: 0, overflow: 'hidden', boxShadow: '0 0 2px rgba(0,0,0,0.6)' }}>
    <rect width="640" height="160" fill="#ffffff"/>
    <rect y="160" width="640" height="160" fill="#0039a6"/>
    <rect y="320" width="640" height="160" fill="#d52b1e"/>
  </svg>
);

export const EnglishFlag: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={Math.round(size * 0.68)} viewBox="0 0 640 480" style={{ borderRadius: 3, flexShrink: 0, overflow: 'hidden', boxShadow: '0 0 2px rgba(0,0,0,0.6)' }}>
    <clipPath id="uk-clip">
      <path d="M0,0 v480 h640 v-480 z"/>
    </clipPath>
    <clipPath id="uk-cross">
      <path d="M320,240 L640,480 H0 z M320,240 L640,0 H0 z M320,240 L0,480 V0 z M320,240 L640,480 V0 z"/>
    </clipPath>
    <g clipPath="url(#uk-clip)">
      <path d="M0,0 v480 h640 v-480 z" fill="#012169"/>
      <path d="M0,0 L640,480 M640,0 L0,480" stroke="#fff" strokeWidth="60"/>
      <path d="M0,0 L640,480 M640,0 L0,480" clipPath="url(#uk-cross)" stroke="#c8102e" strokeWidth="40"/>
      <path d="M320,0 v480 M0,240 h640" stroke="#fff" strokeWidth="100"/>
      <path d="M320,0 v480 M0,240 h640" stroke="#c8102e" strokeWidth="60"/>
    </g>
  </svg>
);

export const renderFlag = (langId: Language, size = 20) => {
  if (langId === 'uz') return <UzbekistanFlag size={size} />;
  if (langId === 'ru') return <RussiaFlag size={size} />;
  return <EnglishFlag size={size} />;
};

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.id === language) || languages[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        title="Tilni tanlash / Change Language"
      >
        {renderFlag(currentLang.id, 20)}
        <span>{currentLang.id.toUpperCase()}</span>
        <ChevronDown style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 170,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-active)',
            borderRadius: 14,
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
            padding: 6,
            zIndex: 150
          }}
        >
          <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Tilni Tanlash
          </div>

          {languages.map((l) => {
            const isSelected = l.id === language;
            return (
              <button
                key={l.id}
                onClick={() => {
                  setLanguage(l.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: 'none',
                  background: isSelected ? 'var(--badge-primary-bg)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: isSelected ? 800 : 500,
                  transition: 'all 0.1s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {renderFlag(l.id, 18)}
                  <span>{l.label}</span>
                </div>
                {isSelected && <Check style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
