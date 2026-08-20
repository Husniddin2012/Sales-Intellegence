import React from 'react';
import { RepeatPurchaseDto } from '../../types';
import { RepeatPurchaseDrillDown } from '../drilldown/RepeatPurchaseDrillDown';
import { Repeat } from 'lucide-react';

interface RetentionPageProps {
  retentionData: RepeatPurchaseDto | null;
  onExecuteAction: (actionKey: string) => void;
}

export const RetentionPage: React.FC<RetentionPageProps> = ({
  retentionData,
  onExecuteAction
}) => {
  if (!retentionData) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        Doimiy mijozlar ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Repeat style={{ width: 28, height: 28, color: '#10b981' }} />
          Doimiy Mijozlar & Qayta Xarid (Retention Rate)
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Repeat purchase ulushi 28% ga kamayishi, churn bo'lgan 48 ta mijoz va LTV ni oshirish
        </p>
      </div>

      <RepeatPurchaseDrillDown
        data={retentionData}
        onTriggerWinback={() => onExecuteAction('trigger_winback_campaign')}
      />
    </div>
  );
};
