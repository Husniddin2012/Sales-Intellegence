import React from 'react';
import { X, Clock, ShoppingBag, Flame, Repeat, Sparkles } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import {
  InstagramAnalyticsDto,
  AgentResponseOverviewDto,
  ProductOverviewDto,
  HotLeadsOverviewDto,
  RepeatPurchaseDto
} from '../types';
import { InstagramDrillDown } from './drilldown/InstagramDrillDown';
import { AgentResponseDrillDown } from './drilldown/AgentResponseDrillDown';
import { ProductXDrillDown } from './drilldown/ProductXDrillDown';
import { HotLeadsDrillDown } from './drilldown/HotLeadsDrillDown';
import { RepeatPurchaseDrillDown } from './drilldown/RepeatPurchaseDrillDown';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  instagramData: InstagramAnalyticsDto | null;
  agentData: AgentResponseOverviewDto | null;
  productData: ProductOverviewDto | null;
  hotLeadsData: HotLeadsOverviewDto | null;
  retentionData: RepeatPurchaseDto | null;
  onExecuteAction: (actionKey: string) => void;
  actionLoadingKey: string | null;
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  instagramData,
  agentData,
  productData,
  hotLeadsData,
  retentionData,
  onExecuteAction,
  actionLoadingKey
}) => {
  if (!isOpen) return null;

  const tabs = [
    { id: 'hot-leads', label: '🔥 37 ta Hot Lead', icon: Flame, color: '#f43f5e', count: hotLeadsData?.totalUnansweredCount },
    { id: 'instagram', label: '📱 Instagram Leadlar', icon: InstagramIcon, color: '#ec4899' },
    { id: 'agents', label: '⏱️ Sotuvchilar Response', icon: Clock, color: '#f59e0b', badge: '2 sotuvchi' },
    { id: 'product-x', label: '🛍️ Mahsulot X Funnel', icon: ShoppingBag, color: '#38bdf8' },
    { id: 'retention', label: '🔄 Repeat Purchase', icon: Repeat, color: '#10b981' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                Batafsil Root-Cause Tahlili va Amallar
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>
                Har bir muammo bo'yicha to'liq jadval, grafiklar va tezkor boshqaruv
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: 10,
              padding: 8,
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`modal-tab-btn ${isActive ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: 10,
                    background: '#f43f5e',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 800
                  }}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: 10,
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#fcd34d',
                    fontSize: 10,
                    border: '1px solid rgba(245, 158, 11, 0.4)'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'hot-leads' && hotLeadsData && (
            <HotLeadsDrillDown
              leads={hotLeadsData.leads}
              onReassignAll={() => onExecuteAction('reassign_hot_leads')}
              isReassigning={actionLoadingKey === 'reassign_hot_leads'}
            />
          )}

          {activeTab === 'instagram' && instagramData && (
            <InstagramDrillDown
              data={instagramData}
              onRefreshCreatives={() => onExecuteAction('refresh_instagram_creatives')}
            />
          )}

          {activeTab === 'agents' && agentData && (
            <AgentResponseDrillDown
              data={agentData}
              onAlertLagging={() => onExecuteAction('alert_lagging_agents')}
            />
          )}

          {activeTab === 'product-x' && productData && (
            <ProductXDrillDown
              data={productData}
              onApplyDiscount={() => onExecuteAction('discount_product_x')}
            />
          )}

          {activeTab === 'retention' && retentionData && (
            <RepeatPurchaseDrillDown
              data={retentionData}
              onTriggerWinback={() => onExecuteAction('trigger_winback_campaign')}
            />
          )}
        </div>

      </div>
    </div>
  );
};
