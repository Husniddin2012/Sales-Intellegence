import React from 'react';
import { ShoppingBag, Tag } from 'lucide-react';
import { ProductOverviewDto } from '../../types';

interface ProductXDrillDownProps {
  data: ProductOverviewDto;
  onApplyDiscount: () => void;
}

export const ProductXDrillDown: React.FC<ProductXDrillDownProps> = ({ data, onApplyDiscount }) => {
  const problemProduct = data.products.find(p => p.id === data.highlightedProblemProductId) || data.products[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('uz-UZ').format(val) + ' so\'m';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner with Direct Action */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
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
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <ShoppingBag style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff' }}>
                Mahsulot X: {problemProduct.name}
              </h3>
              <span className="badge badge-danger">Konversiya 14.2% &rarr; 4.2%</span>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 3 }}>
              {data.aiAnalysis}
            </p>
          </div>
        </div>

        <button
          onClick={onApplyDiscount}
          className="btn btn-primary"
          style={{ padding: '12px 20px', fontSize: 13 }}
        >
          <Tag style={{ width: 16, height: 16 }} />
          <span>-10% Promo-kod & Bepul Yetkazishni Faollashtirish</span>
        </button>
      </div>

      {/* Funnel Steps */}
      <div className="ui-card">
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>
          Xarid Voronkasi (Conversion Funnel) Tahlili
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14
        }}>
          {data.problemProductFunnel.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: idx === 2 ? 'rgba(244, 63, 94, 0.12)' : '#090d16',
                border: idx === 2 ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: 16
              }}
            >
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{step.stage}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {step.count.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: idx === 2 ? '#fda4af' : '#38bdf8', fontWeight: 700, paddingTop: 6, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                Konversiya: {step.conversionFromPrevious}% {idx === 2 && '(-70% uzilish)'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="ui-card">
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>
          Barcha Asosiy Mahsulotlar Konversiya Holati
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Mahsulot</th>
                <th style={{ padding: '10px 14px' }}>Kategoriya</th>
                <th style={{ padding: '10px 14px' }}>Narxi</th>
                <th style={{ padding: '10px 14px' }}>Joriy Konversiya</th>
                <th style={{ padding: '10px 14px' }}>Yo'qotish</th>
                <th style={{ padding: '10px 14px' }}>Holat</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>{prod.name}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{prod.category}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{formatCurrency(prod.price)}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: prod.isAlerted ? '#f43f5e' : '#34d399', fontFamily: 'var(--font-mono)' }}>
                    {prod.currentConversionRate}% (oldin: {prod.previousConversionRate}%)
                  </td>
                  <td style={{ padding: '12px 14px', color: '#fda4af', fontFamily: 'var(--font-mono)' }}>-{formatCurrency(prod.lostRevenue)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={prod.isAlerted ? 'badge badge-danger' : 'badge badge-success'}>
                      {prod.isAlerted ? 'Kritik Tushish' : 'Barqaror'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
