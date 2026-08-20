import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  SalesSummaryDto,
  RootCauseDto,
  InstagramAnalyticsDto,
  AgentResponseOverviewDto,
  ProductOverviewDto,
  HotLeadsOverviewDto,
  RepeatPurchaseDto
} from './types';
import { api } from './services/api';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Sidebar, PageId } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardOverviewPage } from './components/pages/DashboardOverviewPage';
import { AiVoiceBriefingPage } from './components/pages/AiVoiceBriefingPage';
import { HotLeadsPage } from './components/pages/HotLeadsPage';
import { AgentsPage } from './components/pages/AgentsPage';
import { MarketingPage } from './components/pages/MarketingPage';
import { ProductsPage } from './components/pages/ProductsPage';
import { RetentionPage } from './components/pages/RetentionPage';
import { SimulatorPage } from './components/pages/SimulatorPage';
import { AdminPanelPage } from './components/pages/AdminPanelPage';
import { UsersManagementPage } from './components/pages/UsersManagementPage';
import { DrillDownModal } from './components/DrillDownModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthPage } from './components/auth/AuthPage';
import { InteractiveThemeCanvas } from './components/theme/InteractiveThemeCanvas';
import { useAuth } from './context/AuthContext';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

function AppLayout() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [summary, setSummary] = useState<SalesSummaryDto | null>(null);
  const [rootCauses, setRootCauses] = useState<RootCauseDto[]>([]);
  const [instagramData, setInstagramData] = useState<InstagramAnalyticsDto | null>(null);
  const [agentData, setAgentData] = useState<AgentResponseOverviewDto | null>(null);
  const [productData, setProductData] = useState<ProductOverviewDto | null>(null);
  const [hotLeadsData, setHotLeadsData] = useState<HotLeadsOverviewDto | null>(null);
  const [retentionData, setRetentionData] = useState<RepeatPurchaseDto | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);
  const [isApplyingAll, setIsApplyingAll] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<string>('hot-leads');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sum, rc, ig, ag, pr, hl, ret] = await Promise.all([
        api.getOverview(),
        api.getRootCauses(),
        api.getInstagram(),
        api.getAgents(),
        api.getProductX(),
        api.getHotLeads(),
        api.getRetention()
      ]);

      setSummary(sum);
      setRootCauses(rc);
      setInstagramData(ig);
      setAgentData(ag);
      setProductData(pr);
      setHotLeadsData(hl);
      setRetentionData(ret);
    } catch (err) {
      console.error('Error fetching data from C# backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    // Auto-Sync background polling (Every 10 seconds) - zero UI blocking
    const interval = setInterval(() => {
      Promise.all([
        api.getOverview(),
        api.getRootCauses(),
        api.getInstagram(),
        api.getAgents(),
        api.getProductX(),
        api.getHotLeads(),
        api.getRetention()
      ]).then(([sum, rc, ig, ag, pr, hl, ret]) => {
        setSummary(sum);
        setRootCauses(rc);
        setInstagramData(ig);
        setAgentData(ag);
        setProductData(pr);
        setHotLeadsData(hl);
        setRetentionData(ret);
      }).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [loadAllData]);

  const handleOpenDrilldown = (tabKey: string) => {
    if (tabKey === 'rc-instagram-drop' || tabKey === 'instagram') {
      setCurrentPage('marketing');
      return;
    }
    if (tabKey === 'rc-agent-response-delay' || tabKey === 'agents') {
      setCurrentPage('agents');
      return;
    }
    if (tabKey === 'rc-product-x-conversion' || tabKey === 'product-x') {
      setCurrentPage('products');
      return;
    }
    if (tabKey === 'rc-unanswered-hot-leads' || tabKey === 'hot-leads') {
      setCurrentPage('hot-leads');
      return;
    }
    if (tabKey === 'rc-repeat-purchase-drop' || tabKey === 'retention') {
      setCurrentPage('retention');
      return;
    }

    setActiveModalTab(tabKey);
    setModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleExecuteAction = async (actionKey: string) => {
    setActionLoadingKey(actionKey);
    try {
      const res = await api.executeAction(actionKey);
      if (res.success) {
        showToast(res.message, 'success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        await loadAllData();
      }
    } catch (err) {
      console.error('Action error:', err);
      showToast('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.', 'info');
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleApplyAllRecommendations = async () => {
    setIsApplyingAll(true);
    try {
      const actions = [
        'reassign_hot_leads',
        'alert_lagging_agents',
        'discount_product_x',
        'refresh_instagram_creatives',
        'trigger_winback_campaign'
      ];

      for (const act of actions) {
        await api.executeAction(act);
      }

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });

      showToast('Barcha 5 ta AI tavsiyasi muvaffaqiyatli ishga tushirildi! Yo\'qotilgan daromad tiklanishi boshlandi.', 'success');
      await loadAllData();
    } catch (err) {
      console.error('Apply all error:', err);
    } finally {
      setIsApplyingAll(false);
    }
  };

  const handleResetData = async () => {
    try {
      await api.resetData();
      showToast('Barcha ma\'lumotlar boshlang\'ich holatga qaytarildi.', 'info');
      await loadAllData();
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const completedActionsCount = rootCauses.filter(rc => rc.actionCompleted).length;
  const unansweredLeadsCount = hotLeadsData?.totalUnansweredCount || 37;
  const laggingAgentsCount = agentData?.laggingAgentsCount || 2;

  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  return (
    <div className="app-layout">
      {/* Dynamic 60fps Interactive Universe Canvas (Mouse Tracker & Shockwaves) */}
      <InteractiveThemeCanvas />
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        unansweredLeadsCount={unansweredLeadsCount}
        laggingAgentsCount={laggingAgentsCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 2. Main Content Area */}
      <div className="main-content-area">
        
        {/* Top Navbar */}
        <Navbar
          onRefresh={loadAllData}
          onReset={handleResetData}
          isLoading={isLoading}
          completedActionsCount={completedActionsCount}
          onOpenAuth={handleOpenAuth}
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
        />

        {/* Page Body */}
        <main style={{ padding: '24px 32px', flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          
          {isLoading && !summary ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{
                width: 40,
                height: 40,
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ fontSize: 14 }}>C# .NET Backend va AI Ovozli modullar yuklanmoqda...</p>
            </div>
          ) : summary ? (
            <>
              {/* PAGE 1: Overview Dashboard */}
              {currentPage === 'overview' && (
                <DashboardOverviewPage
                  summary={summary}
                  rootCauses={rootCauses}
                  onOpenDrilldown={handleOpenDrilldown}
                  onExecuteAction={handleExecuteAction}
                  actionLoadingKey={actionLoadingKey}
                />
              )}

              {/* PAGE 2: AI Voice Briefing & Voice Assistant */}
              {currentPage === 'voice-briefing' && (
                <AiVoiceBriefingPage
                  onExecuteAction={handleExecuteAction}
                />
              )}

              {/* PAGE 3: Hot Leads */}
              {currentPage === 'hot-leads' && (
                <HotLeadsPage
                  hotLeadsData={hotLeadsData}
                  onExecuteAction={handleExecuteAction}
                  actionLoadingKey={actionLoadingKey}
                />
              )}

              {/* PAGE 4: Sales Agents */}
              {currentPage === 'agents' && (
                <AgentsPage
                  agentData={agentData}
                  onExecuteAction={handleExecuteAction}
                />
              )}

              {/* PAGE 5: Marketing & Instagram */}
              {currentPage === 'marketing' && (
                <MarketingPage
                  instagramData={instagramData}
                  onExecuteAction={handleExecuteAction}
                />
              )}

              {/* PAGE 6: Products & Funnel */}
              {currentPage === 'products' && (
                <ProductsPage
                  productData={productData}
                  onExecuteAction={handleExecuteAction}
                />
              )}

              {/* PAGE 7: Repeat Purchase (Retention) */}
              {currentPage === 'retention' && (
                <RetentionPage
                  retentionData={retentionData}
                  onExecuteAction={handleExecuteAction}
                />
              )}

              {/* PAGE 8: What-If Simulator */}
              {currentPage === 'simulator' && (
                <SimulatorPage
                  onApplyAllRecommendations={handleApplyAllRecommendations}
                  isApplyingAll={isApplyingAll}
                />
              )}

              {/* PAGE 9: Users & Team Management */}
              {currentPage === 'users' && (
                <UsersManagementPage
                  onOpenAuthRegister={() => handleOpenAuth('register')}
                />
              )}

              {/* PAGE 10: Enterprise Admin Panel */}
              {currentPage === 'admin' && (
                <AdminPanelPage />
              )}
            </>
          ) : (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <ShieldAlert style={{ width: 48, height: 48, color: 'var(--danger-color)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Backend bilan bog'lanishda uzilish</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 16px' }}>
                API manzili http://localhost:5156 ga ulanishni tekshiring.
              </p>
              <button onClick={loadAllData} className="btn btn-primary">
                Qayta urinish
              </button>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-color)',
          padding: '16px 32px',
          background: 'var(--bg-card-header)',
          fontSize: 12,
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span>
              Sales Intelligence &copy; 2026. Barcha huquqlar himoyalangan.
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              Backend: ASP.NET Core &bull; Voice Engine: Natural TTS &bull; PostgreSQL
            </span>
          </div>
        </footer>

      </div>

      {/* Drill-Down Fallback Modal */}
      <DrillDownModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activeTab={activeModalTab}
        setActiveTab={setActiveModalTab}
        instagramData={instagramData}
        agentData={agentData}
        productData={productData}
        hotLeadsData={hotLeadsData}
        retentionData={retentionData}
        onExecuteAction={handleExecuteAction}
        actionLoadingKey={actionLoadingKey}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 999,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-active)',
          borderRadius: 14,
          padding: '14px 18px',
          color: 'var(--text-primary)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 420
        }}>
          <CheckCircle2 style={{ width: 22, height: 22, color: 'var(--success-color)', flexShrink: 0 }} />
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
            {toastMessage.text}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
