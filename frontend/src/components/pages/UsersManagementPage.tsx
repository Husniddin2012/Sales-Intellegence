import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Building, 
  Mail, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Award,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserDto } from '../../types';

interface UsersManagementPageProps {
  onOpenAuthRegister?: () => void;
}

export const UsersManagementPage: React.FC<UsersManagementPageProps> = ({ onOpenAuthRegister }) => {
  const { users, user: currentUser, refreshUsers } = useAuth();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUsers();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || (u.role && u.role.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users style={{ width: 28, height: 28, color: 'var(--accent-primary)' }} />
            {language === 'uz' && "Foydalanuvchilar & Jamoa Boshqaruvi"}
            {language === 'ru' && "Пользователи и Управление командой"}
            {language === 'en' && "Users & Team Management"}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {language === 'uz' && "Saytdan ro'yxatdan o'tgan barcha faol foydalanuvchilar va ularning kirish huquqlari"}
            {language === 'ru' && "Все зарегистрированные пользователи платформы и их уровни доступа"}
            {language === 'en' && "All registered accounts and team access permissions on the platform"}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw style={{ width: 15, height: 15, animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{language === 'uz' ? 'Yangilash' : language === 'ru' ? 'Обновить' : 'Refresh'}</span>
          </button>

          {onOpenAuthRegister && (
            <button
              onClick={onOpenAuthRegister}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: '0 4px 14px var(--accent-glow)'
              }}
            >
              <UserPlus style={{ width: 16, height: 16 }} />
              <span>{language === 'uz' ? "Yangi Foydalanuvchi Qo'shish" : language === 'ru' ? "Добавить пользователя" : "Register User"}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(56, 189, 248, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}>
            <Users style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {language === 'uz' ? 'Jami Foydalanuvchilar' : 'Total Users'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
              {users.length} ta
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <CheckCircle2 style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {language === 'uz' ? 'Faol Sessiyalar' : 'Active Accounts'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 2 }}>
              {users.length} Faol
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(245, 158, 11, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <ShieldCheck style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {language === 'uz' ? 'Boshqaruvchilar' : 'Executives'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b', marginTop: 2 }}>
              {users.filter(u => u.role?.toLowerCase().includes('boshqaruvchi') || u.role?.toLowerCase().includes('admin') || u.role?.toLowerCase().includes('rahbar')).length || 1} ta
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14,
        background: 'var(--bg-card)',
        padding: '14px 18px',
        borderRadius: 16,
        border: '1px solid var(--border-color)'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: '8px 14px',
          flex: '1 1 280px',
          maxWidth: 400
        }}>
          <Search style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={language === 'uz' ? "Ism, email yoki kompaniya bo'yicha qidirish..." : "Search by name, email, company..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Role Filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: language === 'uz' ? 'Barchasi' : 'All' },
            { id: 'boshqaruvchi', label: language === 'uz' ? 'Boshqaruvchilar' : 'Executives' },
            { id: 'sotuv', label: language === 'uz' ? 'Sotuv Jamoasi' : 'Sales Team' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: roleFilter === f.id ? 'var(--badge-primary-bg)' : 'transparent',
                color: roleFilter === f.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: roleFilter === f.id ? 800 : 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 16,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Foydalanuvchi</th>
              <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kompaniya</th>
              <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lavozim / Rol</th>
              <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Holati</th>
              <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Sessiya</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => {
              const isCurrent = currentUser?.id === u.id || currentUser?.email.toLowerCase() === u.email.toLowerCase();

              return (
                <tr
                  key={u.id || idx}
                  style={{
                    borderBottom: idx === filteredUsers.length - 1 ? 'none' : '1px solid var(--border-color)',
                    background: isCurrent ? 'rgba(56, 189, 248, 0.03)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Name & Email */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: 14
                      }}>
                        {u.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{u.fullName}</span>
                          {isCurrent && (
                            <span style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: 'var(--accent-primary)',
                              border: '1px solid rgba(56, 189, 248, 0.3)'
                            }}>
                              Siz (Joriy)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                          <Mail style={{ width: 12, height: 12 }} />
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <Building style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                      <span>{u.companyName || 'ITLive Global Inc.'}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      background: u.role?.toLowerCase().includes('boshqaruvchi') || u.role?.toLowerCase().includes('admin')
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(56, 189, 248, 0.12)',
                      color: u.role?.toLowerCase().includes('boshqaruvchi') || u.role?.toLowerCase().includes('admin')
                        ? '#f59e0b'
                        : 'var(--accent-primary)'
                    }}>
                      <ShieldCheck style={{ width: 13, height: 13 }} />
                      <span>{u.role || 'Boshqaruvchi'}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#10b981'
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
                      <span>Faol (Online)</span>
                    </span>
                  </td>

                  {/* Action / Session */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {isCurrent ? "Hozir tizimda faol" : "Ro'yxatdan o'tgan"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
