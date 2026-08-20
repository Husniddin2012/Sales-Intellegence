import React from 'react';
import { Clock, TrendingDown, Zap, CheckCircle2 } from 'lucide-react';
import { AgentResponseOverviewDto } from '../../types';

interface AgentResponseDrillDownProps {
  data: AgentResponseOverviewDto;
  onAlertLagging: () => void;
}

export const AgentResponseDrillDown: React.FC<AgentResponseDrillDownProps> = ({ data, onAlertLagging }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner with Direct Action */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
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
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <Clock style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                2 ta Sotuvchining Response Time'i Keskin Oshgan
              </h3>
              <span className="badge badge-warning">O'rtacha 42 daqiqa</span>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
              {data.aiInsight}
            </p>
          </div>
        </div>

        <button
          onClick={onAlertLagging}
          className="btn btn-primary"
          style={{ padding: '12px 20px', fontSize: 13 }}
        >
          <Zap style={{ width: 16, height: 16 }} />
          <span>SLA Ogohlantirish & Leadlarni Avto-Yo'naltirish</span>
        </button>
      </div>

      {/* Agents Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16
      }}>
        {data.agents.map((agent) => {
          const isCritical = agent.status === 'Critical';
          const isTop = agent.status === 'Top';

          return (
            <div
              key={agent.id}
              className="ui-card"
              style={{
                border: isCritical ? '1px solid rgba(244, 63, 94, 0.4)' : isTop ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isCritical ? 'rgba(244, 63, 94, 0.05)' : isTop ? 'rgba(16, 185, 129, 0.05)' : '#131b2e'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{agent.name}</h4>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{agent.role}</span>
                  </div>
                </div>

                <span className={isCritical ? 'badge badge-danger' : isTop ? 'badge badge-success' : 'badge badge-info'}>
                  {isCritical ? 'Kritik Kechikish' : isTop ? 'Top Sotuvchi' : 'Normal'}
                </span>
              </div>

              <div style={{
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                fontSize: 12,
                marginBottom: 10
              }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Javob vaqti:</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isCritical ? '#f43f5e' : '#34d399', fontFamily: 'var(--font-mono)' }}>
                    {agent.avgResponseTimeMinutes} daqiqa
                  </div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Konversiya:</span>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {agent.conversionRate}%
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
                {agent.diagnosis}
              </p>
            </div>
          );
        })}
      </div>

      {/* SLA Impact Buckets */}
      <div className="ui-card">
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <TrendingDown style={{ width: 16, height: 16, color: '#f43f5e' }} />
          Javob Berish Vaqtining Konversiyaga To'g'ridan-to'g'ri Ta'siri (SLA Degradatsiyasi)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {data.slaDistribution.map((sla, idx) => (
            <div
              key={idx}
              style={{
                padding: 14,
                borderRadius: 12,
                background: sla.isAcceptable ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                border: sla.isAcceptable ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)'
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>{sla.range}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: sla.isAcceptable ? '#34d399' : '#f43f5e', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {sla.conversionRate}%
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Leadlar soni: <strong style={{ color: '#ffffff' }}>{sla.leadCount} ta</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
