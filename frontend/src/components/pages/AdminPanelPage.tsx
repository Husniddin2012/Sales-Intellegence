import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Shield,
  Sliders,
  Bell,
  Database,
  UserPlus,
  Check,
  Sparkles,
  Save,
  AlertCircle,
  FileText,
  Activity,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SystemSettings {
  targetResponseMinutes: number;
  criticalDelayMinutes: number;
  autoReassignEnabled: boolean;
  notificationChannel: string;
  monthlyAdBudgetCap: number;
  defaultAssigneeRole: string;
}

interface AuditLog {
  id: string;
  actionName: string;
  performedBy: string;
  targetEntity: string;
  details: string;
  timestamp: string;
}

export const AdminPanelPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'users' | 'audit' | 'database'>('settings');

  // Settings State
  const [settings, setSettings] = useState<SystemSettings>({
    targetResponseMinutes: 5,
    criticalDelayMinutes: 30,
    autoReassignEnabled: true,
    notificationChannel: 'Telegram & Webhook',
    monthlyAdBudgetCap: 5000,
    defaultAssigneeRole: 'Top Closer'
  });

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Users State
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', fullName: 'Husniddin Husanboyev', email: 'admin@salesintel.uz', role: 'Boshqaruvchi / Biznes Egasi', company: 'ITLive Global Inc.', status: 'Active' },
    { id: 'usr-2', fullName: 'Madina Karimova', email: 'madina@salesintel.uz', role: 'Sotuv Bo\'limi Rahbari', company: 'ITLive Global Inc.', status: 'Active' },
    { id: 'usr-3', fullName: 'Otabek Rustamov', email: 'otabek@salesintel.uz', role: 'Top Closer (Sotuvchi)', company: 'ITLive Global Inc.', status: 'Active' },
    { id: 'usr-4', fullName: 'Javohir Yo\'ldoshev', email: 'javohir@salesintel.uz', role: 'Top Closer (Sotuvchi)', company: 'ITLive Global Inc.', status: 'Active' },
    { id: 'usr-5', fullName: 'Sardor Aliyev', email: 'sardor@salesintel.uz', role: 'Kichik Sotuvchi', company: 'ITLive Global Inc.', status: 'Warning' }
  ]);

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Top Closer (Sotuvchi)');
  const [newUserPassword, setNewUserPassword] = useState('pass1234');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log-1', actionName: '37 ta Hot Lead Taqsimlandi', performedBy: 'Husniddin Husanboyev', targetEntity: '37 ta Mijoz', details: 'Otabek va Javohirga 20 va 17 tadan taqsimlandi', timestamp: 'Bugun, 18:20' },
    { id: 'log-2', actionName: 'SLA Ogohlantirish Jo\'natildi', performedBy: 'Husniddin Husanboyev', targetEntity: 'Sardor & Madina', details: 'Telegram bot orqali 42 min kechikish bo\'yicha eslatma', timestamp: 'Bugun, 18:15' },
    { id: 'log-3', actionName: 'Mahsulot X Promo Yoqildi', performedBy: 'Husniddin Husanboyev', targetEntity: 'Smart Pro X', details: '-10% Promo-kod & Bepul yetkazish kiritildi', timestamp: 'Bugun, 18:05' },
    { id: 'log-4', actionName: 'PostgreSQL Bazasi Ulandi', performedBy: 'System', targetEntity: 'Sales_Intelligence', details: 'Port 5432 orqali jadvallar sinxronizatsiya qilindi', timestamp: 'Bugun, 18:00' }
  ]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      setSettingsSavedMessage(true);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setSettingsSavedMessage(false), 4000);
    }, 400);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: newUserName,
      email: newUserEmail,
      role: newUserRole,
      company: 'ITLive Global Inc.',
      status: 'Active'
    };

    setUsersList(prev => [newUser, ...prev]);
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionName: 'Yangi Foydalanuvchi Qo\'shildi',
        performedBy: 'Husniddin Husanboyev',
        targetEntity: newUserEmail,
        details: `Ism: ${newUserName}, Rol: ${newUserRole}`,
        timestamp: 'Hozir'
      },
      ...prev
    ]);

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Settings style={{ width: 28, height: 28, color: 'var(--accent-primary)' }} />
            Tizim Admin Paneli
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Foydalanuvchilar, CRM qoidalari, SLA limitlari, audit loglari va PostgreSQL sozlamalari
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: 13 }}
        >
          <UserPlus style={{ width: 16, height: 16 }} />
          <span>Yangi Xodim / Admin Qo'shish</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: 8,
        overflowX: 'auto'
      }}>
        {[
          { id: 'settings', label: 'CRM & SLA Qoidalari', icon: Sliders },
          { id: 'users', label: `Foydalanuvchilar (${usersList.length})`, icon: Users },
          { id: 'audit', label: `Audit & Harakatlar Tarixi (${auditLogs.length})`, icon: FileText },
          { id: 'database', label: 'PostgreSQL & Tizim Holati', icon: Database },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? 'var(--badge-primary-bg)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon style={{ width: 16, height: 16, color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. CRM & SLA SETTINGS */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {settingsSavedMessage && (
            <div style={{
              padding: '12px 18px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <Check style={{ width: 18, height: 18 }} />
              <span>Barcha CRM va SLA sozlamalari muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20
          }}>
            
            {/* SLA Rules Card */}
            <div className="ui-card">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield style={{ width: 18, height: 18, color: '#f59e0b' }} />
                SLA & Javob Berish Vaqti Cheklovlari
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Standart SLA Javob Berish Vaqti (Daqiqa)
                  </label>
                  <input
                    type="number"
                    value={settings.targetResponseMinutes}
                    onChange={(e) => setSettings({ ...settings, targetResponseMinutes: parseInt(e.target.value) || 5 })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-body)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mijoz yozgandan so'ng xodim ushbu vaqt ichida javob berishi shart.</span>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Kritik Kechikish Chegarasi (Daqiqa)
                  </label>
                  <input
                    type="number"
                    value={settings.criticalDelayMinutes}
                    onChange={(e) => setSettings({ ...settings, criticalDelayMinutes: parseInt(e.target.value) || 30 })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-body)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ushbu vaqtdan oshganda boshqaruvchiga favqulodda ogohlantirish yuboriladi.</span>
                </div>
              </div>
            </div>

            {/* Automation & Routing Card */}
            <div className="ui-card">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
                Avtomatlashtirish & Taqsimlash Qoidalari
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Hot Leadlarni Avto-Taqsimlash
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Kechikkan leadlarni avtomatik TOP sotuvchilarga yo'naltirish
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoReassignEnabled}
                    onChange={(e) => setSettings({ ...settings, autoReassignEnabled: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Xabarnomalar Kanali
                  </label>
                  <select
                    value={settings.notificationChannel}
                    onChange={(e) => setSettings({ ...settings, notificationChannel: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-body)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Telegram & Webhook">Telegram Bot & Webhook</option>
                    <option value="Email & SMS">Email & SMS</option>
                    <option value="Faqat Dashboard">Faqat Dashboard Push</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Oylik Reklama Byudjeti Limiti ($)
                  </label>
                  <input
                    type="number"
                    value={settings.monthlyAdBudgetCap}
                    onChange={(e) => setSettings({ ...settings, monthlyAdBudgetCap: parseInt(e.target.value) || 5000 })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-body)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSavingSettings}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: 14 }}
            >
              <Save style={{ width: 16, height: 16 }} />
              <span>{isSavingSettings ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}</span>
            </button>
          </div>

        </form>
      )}

      {/* 2. USERS & ROLES */}
      {activeSubTab === 'users' && (
        <div className="ui-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
              Tizim Foydalanuvchilari & Xodimlar
            </h3>
            <span className="badge badge-info">{usersList.length} nafar faol</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Foydalanuvchi</th>
                  <th style={{ padding: '12px 14px' }}>Email</th>
                  <th style={{ padding: '12px 14px' }}>Rol</th>
                  <th style={{ padding: '12px 14px' }}>Kompaniya</th>
                  <th style={{ padding: '12px 14px' }}>Holat</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {user.fullName}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-info" style={{ fontSize: 11 }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {user.company}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={user.status === 'Active' ? 'badge badge-success' : 'badge badge-warning'}>
                        {user.status === 'Active' ? 'Faol' : 'Ogohlantirilgan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="ui-card">
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
            AI & Boshqaruv Audit Loglari
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'var(--bg-body)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {log.actionName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {log.details} &bull; <span style={{ color: 'var(--accent-primary)' }}>{log.targetEntity}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{log.performedBy}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DATABASE & SYSTEM STATUS */}
      {activeSubTab === 'database' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          
          <div className="ui-card">
            <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database style={{ width: 18, height: 18, color: '#10b981' }} />
              PostgreSQL Ulanishi
            </h4>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>Baza nomi: <strong style={{ color: '#ffffff' }}>Sales_Intelligence</strong></div>
              <div>Server: <strong style={{ color: '#ffffff' }}>localhost:5432</strong></div>
              <div>Foydalanuvchi: <strong style={{ color: '#ffffff' }}>postgres</strong></div>
              <div>Holat: <span className="badge badge-success">Ulangan & Faol</span></div>
            </div>
          </div>

          <div className="ui-card">
            <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
              C# .NET Web API
            </h4>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>API Port: <strong style={{ color: '#ffffff' }}>http://localhost:5156</strong></div>
              <div>Framework: <strong style={{ color: '#ffffff' }}>ASP.NET Core (.NET 10)</strong></div>
              <div>Swagger UI: <a href="http://localhost:5156/swagger" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>/swagger</a></div>
              <div>Arxitektura: <span className="badge badge-info">DDD + Clean Architecture</span></div>
            </div>
          </div>

        </div>
      )}

      {/* Add User Modal Dialog */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 460, padding: 24 }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
              Yangi Xodim / Admin Qo'shish
            </h3>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  To'liq Ism
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ali Valiyev"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-body)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Email Manzili
                </label>
                <input
                  type="email"
                  required
                  placeholder="ali@salesintel.uz"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-body)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Tizimdagi Rol
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-body)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Top Closer (Sotuvchi)">Top Closer (Sotuvchi)</option>
                  <option value="Sotuv Bo'limi Rahbari">Sotuv Bo'limi Rahbari</option>
                  <option value="Marketing Mutaxassisi">Marketing Mutaxassisi</option>
                  <option value="Admin / Boshqaruvchi">Admin / Boshqaruvchi</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Boshlang'ich Parol
                </label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-body)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn btn-outline"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Saqlash & Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
