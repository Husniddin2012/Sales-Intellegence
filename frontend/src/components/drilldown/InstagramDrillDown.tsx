import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../icons/InstagramIcon';
import { InstagramAnalyticsDto } from '../../types';

interface InstagramDrillDownProps {
  data: InstagramAnalyticsDto;
  onRefreshCreatives: () => void;
}

export const InstagramDrillDown: React.FC<InstagramDrillDownProps> = ({ data, onRefreshCreatives }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner with Direct Action */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.35)',
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
            background: 'rgba(236, 72, 153, 0.2)',
            color: '#ec4899',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(236, 72, 153, 0.3)'
          }}>
            <InstagramIcon style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                Instagram Leadlar Oqimi -31% ga Tushgan
              </h3>
              <span className="badge badge-danger">CPL x2.1 Qimmatlashgan</span>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
              {data.aiAnalysis}
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshCreatives}
          className="btn btn-primary"
          style={{ padding: '12px 20px', fontSize: 13 }}
        >
          <Sparkles style={{ width: 16, height: 16 }} />
          <span>Kreativlarni Yangilash & Byudjetni Optimallash</span>
        </button>
      </div>

      {/* KPI 4 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14
      }}>
        <div className="ui-card">
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Kiruvchi Leadlar</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            {data.leadsThisMonth} <span style={{ fontSize: 13, color: '#f43f5e', fontWeight: 600 }}>({data.dropPercentage}%)</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Oldingi davr: {data.leadsLastMonth} ta</div>
        </div>

        <div className="ui-card">
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Lead Narxi (CPL)</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#f43f5e', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            ${data.costPerLeadCurrent.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Oldingi davr: ${data.costPerLeadPrevious.toFixed(2)}</div>
        </div>

        <div className="ui-card">
          <div style={{ fontSize: 12, color: '#94a3b8' }}>CTR (Bosilish foizi)</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fcd34d', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            {data.ctrCurrent}%
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Oldingi davr: {data.ctrPrevious}%</div>
        </div>

        <div className="ui-card">
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Jami Reklama Xarajati</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
            ${data.adSpendThisMonth}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Oldingi davr: ${data.adSpendLastMonth}</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="ui-card">
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Layers style={{ width: 16, height: 16, color: '#ec4899' }} />
          Meta Reklama Kampaniyalari Diagnostikasi
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Kampaniya</th>
                <th style={{ padding: '10px 14px' }}>Holat</th>
                <th style={{ padding: '10px 14px' }}>Xarajat</th>
                <th style={{ padding: '10px 14px' }}>Leadlar</th>
                <th style={{ padding: '10px 14px' }}>CPL</th>
                <th style={{ padding: '10px 14px' }}>CTR</th>
                <th style={{ padding: '10px 14px' }}>AI Diagnostika</th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map((camp, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>{camp.name}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={camp.status === 'Active / Good' ? 'badge badge-success' : 'badge badge-danger'}>
                      {camp.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>${camp.spend}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{camp.leads}</td>
                  <td style={{ padding: '12px 14px', color: '#fda4af', fontFamily: 'var(--font-mono)' }}>${camp.cpl}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{camp.ctr}%</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: 12 }}>{camp.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
