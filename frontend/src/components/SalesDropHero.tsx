import React from 'react';
import { ArrowDownRight, Sparkles, Flame, Clock, ShoppingBag, Users, TrendingDown } from 'lucide-react';
import { SalesSummaryDto } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

interface SalesDropHeroProps {
  summary: SalesSummaryDto;
  onOpenDrilldown: (tabKey: string) => void;
  onExecuteAction: (actionKey: string) => void;
}

export const SalesDropHero: React.FC<SalesDropHeroProps> = ({
  summary,
  onOpenDrilldown
}) => {
  const { language } = useLanguage();

  const formatCurrency = (val: number) => {
    if (language === 'en') {
      return new Intl.NumberFormat('en-US').format(val) + ' UZS';
    }
    if (language === 'ru') {
      return new Intl.NumberFormat('ru-RU').format(val) + ' сум';
    }
    return new Intl.NumberFormat('uz-UZ').format(val) + ' so\'m';
  };

  const getAiSummary = () => {
    if (language === 'ru') {
      return "За последние 30 дней общие продажи снизились на 18.0% (Упущенная выручка: 22,500,000 сум). AI диагностика выявила 5 ключевых причин: поток лидов из Instagram упал на -31%, у 2 менеджеров время ответа превысило норматив в 8 раз (42 мин), конверсия чекаута по «Smart Pro X» упала с 14.2% до 4.2%, 37 горячих лидов ждут ответа более 24 часов, а повторные покупки снизились на 28%.";
    }
    if (language === 'en') {
      return "In the last 30 days, total sales declined by 18.0% (Lost revenue: 22,500,000 UZS). The AI diagnostic engine pinpointed 5 bottlenecks: Instagram inbound leads dropped -31%, 2 sales reps average 42 min response delay, Smart Pro X checkout conversion collapsed from 14.2% to 4.2%, 37 hot leads remained unanswered for >24h, and repeat purchases dropped by 28%.";
    }
    return summary.aiSummaryText;
  };

  const translateWaterfallCause = (cause: string) => {
    if (language === 'ru') {
      if (cause.includes("bazaviy") || cause.includes("Baseline")) return "Базовые продажи прошлого периода";
      if (cause.includes("Instagram")) return "Снижение лидов из Instagram";
      if (cause.includes("response") || cause.includes("Sotuvchilar")) return "Задержка ответов менеджеров";
      if (cause.includes("Mahsulot X") || cause.includes("Product X")) return "Падение конверсии Товара X";
      if (cause.includes("hot lead") || cause.includes("37")) return "37 горячих лидов без ответа";
      if (cause.includes("repeat") || cause.includes("Eski mijozlar")) return "Снижение повторных покупок";
      if (cause.includes("Joriy") || cause.includes("Current")) return "Итоговые продажи текущего периода";
    }
    if (language === 'en') {
      if (cause.includes("bazaviy") || cause.includes("Baseline")) return "Previous Period Baseline Sales";
      if (cause.includes("Instagram")) return "Instagram Lead Flow Drop";
      if (cause.includes("response") || cause.includes("Sotuvchilar")) return "Sales Rep Response Time Delay";
      if (cause.includes("Mahsulot X") || cause.includes("Product X")) return "Product X Conversion Drop";
      if (cause.includes("hot lead") || cause.includes("37")) return "37 Unanswered Hot Leads";
      if (cause.includes("repeat") || cause.includes("Eski mijozlar")) return "Repeat Purchase Drop";
      if (cause.includes("Joriy") || cause.includes("Current")) return "Current Period Final Sales";
    }
    return cause;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* 1. Main Executive Alert Banner */}
      <div className="danger-card">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28,
          alignItems: 'center'
        }}>
          
          {/* Left Column: Big -18% Stat */}
          <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge badge-danger">
                🔴 {language === 'uz' ? 'SOTUV PASAYISHI ANIQLANDI' : language === 'ru' ? 'ОБНАРУЖЕНО ПАДЕНИЕ ПРОДАЖ' : 'SALES DROP DETECTED'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, margin: '10px 0' }}>
              <span style={{
                fontSize: 52,
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-1px'
              }}>
                <ArrowDownRight style={{ width: 44, height: 44, color: '#f43f5e', marginRight: 4 }} />
                {summary.percentageChange}%
              </span>
              <span style={{ fontSize: 13, color: '#fda4af', fontWeight: 600 }}>
                ({language === 'uz' ? 'So\'nggi 30 kunda' : language === 'ru' ? 'За последние 30 дней' : 'Last 30 days'})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>{language === 'uz' ? 'Joriy haqiqiy sotuv:' : language === 'ru' ? 'Текущие продажи:' : 'Current Actual Sales:'}</span>
                <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(summary.currentPeriodSales)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: 13 }}>
                <span>{language === 'uz' ? 'O\'tgan davr (Baza):' : language === 'ru' ? 'Прошлый период (База):' : 'Previous Period (Base):'}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(summary.previousPeriodSales)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#f43f5e',
                fontWeight: 700,
                paddingTop: 8,
                borderTop: '1px solid rgba(244, 63, 94, 0.2)',
                fontSize: 14
              }}>
                <span>{language === 'uz' ? 'Yo\'qotilgan kutilgan daromad:' : language === 'ru' ? 'Упущенная выручка:' : 'Estimated Lost Revenue:'}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  -{formatCurrency(summary.lostRevenueEstimated)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & 4 Quick Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontWeight: 700, fontSize: 14 }}>
              <Sparkles style={{ width: 16, height: 16 }} />
              <span>{language === 'uz' ? 'AI Diagnostika Xulosasi:' : language === 'ru' ? 'Заключение AI Диагностики:' : 'AI Diagnostic Summary:'}</span>
            </div>

            <div style={{
              background: '#090d16',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 14,
              padding: 16,
              fontSize: 13,
              lineHeight: 1.6,
              color: '#e2e8f0'
            }}>
              {getAiSummary()}
            </div>

            {/* 4 Direct Interactive Jump Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 10
            }}>
              
              {/* Hot Leads Jump */}
              <button
                onClick={() => onOpenDrilldown('rc-unanswered-hot-leads')}
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  borderRadius: 12,
                  padding: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fda4af', fontSize: 11, fontWeight: 700 }}>
                  <span>{language === 'uz' ? 'Hot Leadlar' : language === 'ru' ? 'Гор. лиды' : 'Hot Leads'}</span>
                  <Flame style={{ width: 14, height: 14 }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '2px 0' }}>
                  37 {language === 'uz' ? 'ta' : language === 'ru' ? 'лидов' : 'leads'}
                </div>
                <div style={{ fontSize: 11, color: '#f43f5e', fontWeight: 600 }}>
                  {language === 'uz' ? 'Taqsimlash →' : language === 'ru' ? 'Распределить →' : 'Assign →'}
                </div>
              </button>

              {/* Response Delay Jump */}
              <button
                onClick={() => onOpenDrilldown('rc-agent-response-delay')}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: 12,
                  padding: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fcd34d', fontSize: 11, fontWeight: 700 }}>
                  <span>Response</span>
                  <Clock style={{ width: 14, height: 14 }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '2px 0' }}>
                  2 {language === 'uz' ? 'sotuvchi' : language === 'ru' ? 'менеджера' : 'agents'}
                </div>
                <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>
                  {language === 'uz' ? '42 min kechikish →' : language === 'ru' ? 'Задержка 42 мин →' : '42 min delay →'}
                </div>
              </button>

              {/* Instagram Jump */}
              <button
                onClick={() => onOpenDrilldown('rc-instagram-drop')}
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.35)',
                  borderRadius: 12,
                  padding: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f472b6', fontSize: 11, fontWeight: 700 }}>
                  <span>Instagram</span>
                  <Users style={{ width: 14, height: 14 }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '2px 0' }}>
                  -31%
                </div>
                <div style={{ fontSize: 11, color: '#ec4899', fontWeight: 600 }}>
                  {language === 'uz' ? 'Kreativlar →' : language === 'ru' ? 'Креативы →' : 'Creatives →'}
                </div>
              </button>

              {/* Product X Jump */}
              <button
                onClick={() => onOpenDrilldown('rc-product-x-conversion')}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: 12,
                  padding: 10,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#7dd3fc', fontSize: 11, fontWeight: 700 }}>
                  <span>{language === 'uz' ? 'Mahsulot X' : language === 'ru' ? 'Товар X' : 'Product X'}</span>
                  <ShoppingBag style={{ width: 14, height: 14 }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', margin: '2px 0' }}>
                  4.2%
                </div>
                <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>
                  {language === 'uz' ? 'Promo yoqish →' : language === 'ru' ? 'Вкл. промо →' : 'Promo →'}
                </div>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* 2. Charts Grid: Daily Trend & Waterfall Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20
      }}>
        
        {/* Daily Sales Trend Chart */}
        <div className="ui-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }}></span>
                {language === 'uz' ? '30 Kunlik Sotuv Dinamikasi' : language === 'ru' ? 'Динамика продаж за 30 дней' : '30-Day Sales Trend'}
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {language === 'uz' ? 'Joriy davr va o\'tgan davr taqqosiy grafigi' : language === 'ru' ? 'Сравнение текущего и прошлого периодов' : 'Comparison between current and baseline periods'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                <span style={{ width: 12, height: 2, background: '#64748b', display: 'inline-block', borderTop: '2px dashed #64748b' }}></span>
                <span>{language === 'uz' ? 'O\'tgan davr' : language === 'ru' ? 'Прошлый период' : 'Previous'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fda4af', fontWeight: 600 }}>
                <span style={{ width: 12, height: 3, background: '#f43f5e', borderRadius: 2, display: 'inline-block' }}></span>
                <span>{language === 'uz' ? 'Joriy davr' : language === 'ru' ? 'Текущий период' : 'Current'}</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#090d16',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 10,
                    fontSize: 12
                  }}
                  formatter={(val: any) => [formatCurrency(Number(val)), '']}
                />
                <Area
                  type="monotone"
                  dataKey="previousSales"
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  fill="transparent"
                  strokeWidth={2}
                  name={language === 'uz' ? 'O\'tgan davr' : language === 'ru' ? 'Прошлый' : 'Previous'}
                />
                <Area
                  type="monotone"
                  dataKey="currentSales"
                  stroke="#f43f5e"
                  fill="url(#currentSalesGrad)"
                  strokeWidth={3}
                  name={language === 'uz' ? 'Joriy davr' : language === 'ru' ? 'Текущий' : 'Current'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waterfall Breakdown Card */}
        <div className="ui-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>
                {language === 'uz' ? 'Yo\'qotishlar Sabablar Bo\'yicha' : language === 'ru' ? 'Структура потерь по причинам' : 'Waterfall Loss Breakdown'}
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {language === 'uz' ? 'Qaysi sabab qancha tushish keltirib chiqardi?' : language === 'ru' ? 'Какая причина сколько убытка принесла?' : 'Contribution of each bottleneck to the drop'}
              </p>
            </div>
            <span className="badge badge-info" style={{ fontSize: 10 }}>Waterfall</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {summary.waterfallBreakdown.map((item, idx) => {
              const isBase = idx === 0;
              const isFinal = idx === summary.waterfallBreakdown.length - 1;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: isBase || isFinal ? 'rgba(56, 189, 248, 0.08)' : 'rgba(244, 63, 94, 0.06)',
                    border: isBase || isFinal ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid rgba(244, 63, 94, 0.15)',
                    fontSize: 13
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: isBase || isFinal ? '#38bdf8' : '#f43f5e'
                    }}></span>
                    <div>
                      <div style={{ fontWeight: isBase || isFinal ? 700 : 500, color: '#ffffff' }}>
                        {translateWaterfallCause(item.cause)}
                      </div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.category}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: isBase || isFinal ? '#ffffff' : '#fda4af'
                    }}>
                      {formatCurrency(item.impactAmount)}
                    </div>
                    <span style={{ fontSize: 11, color: item.impactPercent < 0 ? '#f43f5e' : '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {item.impactPercent > 0 ? `+${item.impactPercent}%` : `${item.impactPercent}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
