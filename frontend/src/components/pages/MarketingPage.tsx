import React from 'react';
import { InstagramAnalyticsDto } from '../../types';
import { InstagramDrillDown } from '../drilldown/InstagramDrillDown';
import { InstagramIcon } from '../icons/InstagramIcon';

interface MarketingPageProps {
  instagramData: InstagramAnalyticsDto | null;
  onExecuteAction: (actionKey: string) => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({
  instagramData,
  onExecuteAction
}) => {
  if (!instagramData) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        Marketing ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <InstagramIcon style={{ width: 28, height: 28, color: '#ec4899' }} />
          Instagram Marketing & Meta Ads Diagnostikasi
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Leadlar oqimi pasayishi (-31%), qimmatlashgan CPL va charchagan kreativlar tahlili
        </p>
      </div>

      <InstagramDrillDown
        data={instagramData}
        onRefreshCreatives={() => onExecuteAction('refresh_instagram_creatives')}
      />
    </div>
  );
};
