import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Clock,
  ShoppingBag,
  Repeat,
  Sliders,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingDown,
  Volume2,
  Users
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { useLanguage } from '../context/LanguageContext';

export type PageId =
  | 'overview'
  | 'voice-briefing'
  | 'hot-leads'
  | 'agents'
  | 'marketing'
  | 'products'
  | 'retention'
  | 'simulator'
  | 'users'
  | 'admin';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  unansweredLeadsCount: number;
  laggingAgentsCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  badge?: string;
  count?: number;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  unansweredLeadsCount,
  laggingAgentsCount,
  collapsed,
  onToggleCollapse
}) => {
  const { t, language } = useLanguage();

  const menuItems: MenuItem[] = [
    { id: 'overview' as PageId, label: t('menu_overview'), icon: LayoutDashboard, badge: '-18%' },
    { id: 'voice-briefing' as PageId, label: t('menu_voice_briefing'), icon: Volume2, badge: '🎙️ Audio', highlight: true },
    { id: 'hot-leads' as PageId, label: t('menu_hot_leads'), icon: Flame, count: unansweredLeadsCount, badgeColor: '#f43f5e' },
    { id: 'agents' as PageId, label: t('menu_agents'), icon: Clock, count: laggingAgentsCount, badgeColor: '#f59e0b' },
    { id: 'marketing' as PageId, label: t('menu_marketing'), icon: InstagramIcon, badge: '-31%' },
    { id: 'products' as PageId, label: t('menu_products'), icon: ShoppingBag, badge: '4.2%' },
    { id: 'retention' as PageId, label: t('menu_retention'), icon: Repeat, badge: '-28%' },
    { id: 'simulator' as PageId, label: t('menu_simulator'), icon: Sliders },
    { id: 'users' as PageId, label: language === 'uz' ? 'Foydalanuvchilar' : language === 'ru' ? 'Пользователи' : 'Users & Team', icon: Users },
    { id: 'admin' as PageId, label: t('menu_admin'), icon: Settings },
  ];

  return (
    <aside
      style={{
        width: collapsed ? 76 : 260,
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
        overflowY: 'auto'
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: collapsed ? '16px 10px' : '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--accent-glow)'
            }}>
              <Sparkles style={{ width: 18, height: 18, color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
                Sales Intel
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {language === 'uz' && 'Boshqaruv v2.0'}
                {language === 'ru' && 'Аналитика v2.0'}
                {language === 'en' && 'Executive v2.0'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: 6,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={collapsed ? "Menyuni kengaytirish" : "Menyuni kichraytirish"}
        >
          {collapsed ? <ChevronRight style={{ width: 16, height: 16 }} /> : <ChevronLeft style={{ width: 16, height: 16 }} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, padding: '0 10px 4px' }}>
            {language === 'uz' && 'Asosiy Sahifalar'}
            {language === 'ru' && 'Разделы системы'}
            {language === 'en' && 'Navigation'}
          </div>
        )}

        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                padding: collapsed ? '12px 0' : '10px 14px',
                borderRadius: 12,
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                background: isActive ? 'var(--badge-primary-bg)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
              }}
              title={collapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon style={{ width: 18, height: 18, color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && (
                <>
                  {item.count !== undefined && item.count > 0 && (
                    <span style={{
                      padding: '2px 7px',
                      borderRadius: 10,
                      background: item.badgeColor || '#f43f5e',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 900
                    }}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: 6,
                      background: item.highlight ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: item.highlight ? '#7dd3fc' : 'var(--text-muted)',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      {!collapsed && (
        <div style={{
          padding: 14,
          margin: 10,
          background: 'var(--bg-card)',
          borderRadius: 12,
          border: '1px solid var(--border-color)',
          fontSize: 11
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontWeight: 700, marginBottom: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span>
              {language === 'uz' && 'AI Tizim Faol'}
              {language === 'ru' && 'AI Система активна'}
              {language === 'en' && 'AI Engine Active'}
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            UZB &bull; RUS &bull; ENG
          </div>
        </div>
      )}
    </aside>
  );
};
