import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 
  | 'cyber_quantum' 
  | 'matrix_gold' 
  | 'tokyo_synth' 
  | 'supernova_fire' 
  | 'black_stealth' 
  | 'dubai_luxury';

export interface ThemeInfo {
  id: ThemeType;
  label: { uz: string; ru: string; en: string };
  subtitle: { uz: string; ru: string; en: string };
  icon: string;
  primaryColor: string;
  gradient: string;
  badge: string;
  glowColor: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  availableThemes: ThemeInfo[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const availableThemes: ThemeInfo[] = [
  {
    id: 'cyber_quantum',
    label: { uz: 'Quantum Kiber 2099', ru: 'Квантовый Небула 2099', en: 'Quantum Nebula 2099' },
    subtitle: { uz: 'Kosmik galaktika, lazer moviy & neon to\'lqin', ru: 'Космическая галактика, лазерный циан и неон', en: 'Deep Cosmic Aurora & Electric Cyan Laser' },
    icon: '🌌',
    primaryColor: '#00f0ff',
    gradient: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 50%, #3b82f6 100%)',
    badge: 'Koinot 2099',
    glowColor: 'rgba(0, 240, 255, 0.45)'
  },
  {
    id: 'matrix_gold',
    label: { uz: 'Matrix Zumrad & Oltin', ru: 'Матрица Золото и Нефрит', en: 'Matrix Gold & Jade' },
    subtitle: { uz: 'Kibernetik zumrad matrisa & 24K imperator oltini', ru: 'Кибернетическая матрица и 24K императорское золото', en: 'Cyber Matrix Grid & 24K Sovereign Gold' },
    icon: '💎',
    primaryColor: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #f59e0b 100%)',
    badge: 'Matrix FinTech',
    glowColor: 'rgba(16, 185, 129, 0.5)'
  },
  {
    id: 'tokyo_synth',
    label: { uz: 'Neo-Tokio Synthwave 3000', ru: 'Нео-Токио Синтвейв 3000', en: 'Neo-Tokyo Synthwave' },
    subtitle: { uz: 'Golografik lazer pushti & ultrabinafsha quyosh', ru: 'Голографический розовый неон и ультрафиолет', en: 'Holographic Neon Magenta & Ultraviolet Horizon' },
    icon: '🔮',
    primaryColor: '#f43f5e',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)',
    badge: 'Hologram Tokyo',
    glowColor: 'rgba(236, 72, 153, 0.5)'
  },
  {
    id: 'supernova_fire',
    label: { uz: 'Supernova Plazma & Lava', ru: 'Плазма Суперновы & Лава', en: 'Supernova Plasma' },
    subtitle: { uz: 'Quyosh chaqnashi, olovli plazma & yaqut energiya', ru: 'Вспышка сверхновой, пылающая плазма и рубин', en: 'Solar Coronal Flare & Molten Ruby Plasma' },
    icon: '🔥',
    primaryColor: '#ff4b4b',
    gradient: 'linear-gradient(135deg, #ff4b4b 0%, #ea580c 50%, #facc15 100%)',
    badge: 'Supernova Fusion',
    glowColor: 'rgba(255, 75, 75, 0.5)'
  },
  {
    id: 'black_stealth',
    label: { uz: 'Qora Titan Zero (Stealth)', ru: 'Черный Титан Zero (Стелс)', en: 'Titanium Stealth Zero' },
    subtitle: { uz: 'Mutlaq qora materiya, titan qirralar & olmos yaltiroq', ru: 'Абсолютная черная материя и бриллиантовое сияние', en: 'Pure Carbon Void & Diamond Ice Refraction' },
    icon: '⚡',
    primaryColor: '#ffffff',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 50%, #1e293b 100%)',
    badge: 'Stealth Billionaire',
    glowColor: 'rgba(255, 255, 255, 0.4)'
  },
  {
    id: 'dubai_luxury',
    label: { uz: 'Dubay Qirollik Oltini & Oniks', ru: 'Королевское Золото & Оникс', en: 'Dubai Royal Onyx & Gold' },
    subtitle: { uz: 'Qora marmar oniks & 24K toza oltin jilosi', ru: 'Черный мрамор оникс и сияние 24K золота', en: 'Liquid Gold Inlays & Midnight Onyx Marble' },
    icon: '👑',
    primaryColor: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #b45309 100%)',
    badge: '24K Royal Gold',
    glowColor: 'rgba(251, 191, 36, 0.5)'
  }
];

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('sales_intel_theme') as ThemeType;
    const isValid = availableThemes.some(t => t.id === saved);
    return isValid ? saved : 'cyber_quantum';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sales_intel_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
