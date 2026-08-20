import React from 'react';
import { SalesSummaryDto, RootCauseDto } from '../../types';
import { SalesDropHero } from '../SalesDropHero';
import { RootCauseCards } from '../RootCauseCards';

interface DashboardOverviewPageProps {
  summary: SalesSummaryDto;
  rootCauses: RootCauseDto[];
  onOpenDrilldown: (causeKey: string) => void;
  onExecuteAction: (actionKey: string) => void;
  actionLoadingKey: string | null;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  summary,
  rootCauses,
  onOpenDrilldown,
  onExecuteAction,
  actionLoadingKey
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 1. Main -18% Drop Hero */}
      <section>
        <SalesDropHero
          summary={summary}
          onOpenDrilldown={onOpenDrilldown}
          onExecuteAction={onExecuteAction}
        />
      </section>

      {/* 2. 5 Root Cause Cards with Direct Action Buttons */}
      <section>
        <RootCauseCards
          causes={rootCauses}
          onSelectCause={onOpenDrilldown}
          onExecuteAction={onExecuteAction}
          actionLoadingKey={actionLoadingKey}
        />
      </section>
    </div>
  );
};
