import React from 'react';
import { HotLeadsOverviewDto } from '../../types';
import { HotLeadsDrillDown } from '../drilldown/HotLeadsDrillDown';
import { Flame, ShieldAlert } from 'lucide-react';

interface HotLeadsPageProps {
  hotLeadsData: HotLeadsOverviewDto | null;
  onExecuteAction: (actionKey: string) => void;
  actionLoadingKey: string | null;
}

export const HotLeadsPage: React.FC<HotLeadsPageProps> = ({
  hotLeadsData,
  onExecuteAction,
  actionLoadingKey
}) => {
  if (!hotLeadsData) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        Leadlar ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Flame style={{ width: 28, height: 28, color: '#f43f5e' }} />
            37 ta Hot Lead (Javobsiz Qolgan Mijozlar)
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            24+ soatdan beri inboxda kutayotgan issiq leadlar tahlili va CRM bo'yicha avtomatik taqsimlash
          </p>
        </div>
      </div>

      <HotLeadsDrillDown
        leads={hotLeadsData.leads}
        onReassignAll={() => onExecuteAction('reassign_hot_leads')}
        isReassigning={actionLoadingKey === 'reassign_hot_leads'}
      />
    </div>
  );
};
