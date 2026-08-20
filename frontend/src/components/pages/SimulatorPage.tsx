import React from 'react';
import { WhatIfSimulator } from '../WhatIfSimulator';
import { Sliders } from 'lucide-react';

interface SimulatorPageProps {
  onApplyAllRecommendations: () => void;
  isApplyingAll: boolean;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  onApplyAllRecommendations,
  isApplyingAll
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sliders style={{ width: 28, height: 28, color: 'var(--accent-primary)' }} />
          What-If Simulyatori (Daromadni Tiklash Hisoblagichi)
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          5 ta AI tavsiyasini qo'llash orqali yo'qotilgan 22,500,000 so'm daromadni qaytarish ssenariylarini hisoblash
        </p>
      </div>

      <WhatIfSimulator
        onApplyAllRecommendations={onApplyAllRecommendations}
        isApplyingAll={isApplyingAll}
      />
    </div>
  );
};
