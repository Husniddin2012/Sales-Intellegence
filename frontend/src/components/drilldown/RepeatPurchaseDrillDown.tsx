import React from 'react';
import { Repeat, Gift } from 'lucide-react';
import { RepeatPurchaseDto } from '../../types';

interface RepeatPurchaseDrillDownProps {
  data: RepeatPurchaseDto;
  onTriggerWinback: () => void;
}

export const RepeatPurchaseDrillDown: React.FC<RepeatPurchaseDrillDownProps> = ({ data, onTriggerWinback }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner with Direct Action */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <Repeat style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                Eski Mijozlar Qayta Xaridi 28% ga Kamaygan
              </h3>
              <span className="badge badge-danger">48 ta Mijoz Churn Bo'lgan</span>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
              {data.aiDiagnosis}
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerWinback}
          className="btn btn-primary"
          style={{ padding: '12px 20px', fontSize: 13 }}
        >
          <Gift style={{ width: 16, height: 16 }} />
          <span>Win-Back SMS/Telegram Kampaniyasini Boshlash</span>
        </button>
      </div>

      {/* Cohorts & Churn Reasons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20
      }}>
        
        {/* Retention Rates */}
        <div className="ui-card">
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>
            Oylik Qayta Xarid (Retention Rate) Dinamikasi
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.cohortHistory.map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '10px 14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: '#ffffff' }}>{c.month}</span>
                  <span style={{ color: idx === data.cohortHistory.length - 1 ? '#f43f5e' : '#34d399', fontFamily: 'var(--font-mono)' }}>
                    {c.retentionRate}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Mijozlar soni: {c.customerCount} nafar</div>
              </div>
            ))}
          </div>
        </div>

        {/* Churn Reasons */}
        <div className="ui-card">
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>
            Mijozlarning Qaytmaslik Sabablari & AI Yechimi
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.churnReasons.map((cr, idx) => (
              <div
                key={idx}
                style={{
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '10px 14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: '#ffffff' }}>{cr.reason}</span>
                  <span style={{ color: '#fda4af', fontFamily: 'var(--font-mono)' }}>{cr.percentage}%</span>
                </div>
                <div style={{ fontSize: 12, color: '#38bdf8' }}>
                  Yechim: {cr.recommendedSolution}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
