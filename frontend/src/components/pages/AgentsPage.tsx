import React from 'react';
import { AgentResponseOverviewDto } from '../../types';
import { AgentResponseDrillDown } from '../drilldown/AgentResponseDrillDown';
import { Clock } from 'lucide-react';

interface AgentsPageProps {
  agentData: AgentResponseOverviewDto | null;
  onExecuteAction: (actionKey: string) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({
  agentData,
  onExecuteAction
}) => {
  if (!agentData) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        Sotuvchilar ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock style={{ width: 28, height: 28, color: '#f59e0b' }} />
          Sotuvchilarning Javob Berish Vaqti & SLA Tahlili
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Kechikayotgan 2 ta sotuvchi va javob vaqtining konversiyaga to'g'ridan-to'g'ri ta'siri
        </p>
      </div>

      <AgentResponseDrillDown
        data={agentData}
        onAlertLagging={() => onExecuteAction('alert_lagging_agents')}
      />
    </div>
  );
};
