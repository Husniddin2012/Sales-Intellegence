import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, Zap, TrendingUp, RefreshCcw } from 'lucide-react';
import { SimulationRequestDto, SimulationResultDto } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface WhatIfSimulatorProps {
  onApplyAllRecommendations: () => void;
  isApplyingAll: boolean;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  onApplyAllRecommendations,
  isApplyingAll
}) => {
  const { language } = useLanguage();

  const [params, setParams] = useState<SimulationRequestDto>({
    reassignHotLeads: true,
    responseTimeImprovementMinutes: 25,
    instagramBudgetIncreasePercent: 20,
    productXDiscountPercent: 10,
    triggerWinbackCampaign: true
  });

  const [result, setResult] = useState<SimulationResultDto | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const runSim = async () => {
      setIsCalculating(true);
      try {
        const res = await api.runSimulation(params);
        if (!isCancelled) setResult(res);
      } catch (err) {
        console.error('Simulation error:', err);
      } finally {
        if (!isCancelled) setIsCalculating(false);
      }
    };

    const timeout = setTimeout(runSim, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [params]);

  const formatCurrency = (val: number) => {
    if (language === 'en') {
      return new Intl.NumberFormat('en-US').format(Math.round(val)) + ' UZS';
    }
    if (language === 'ru') {
      return new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' сум';
    }
    return new Intl.NumberFormat('uz-UZ').format(Math.round(val)) + ' so\'m';
  };

  const translateLever = (lever: string) => {
    if (language === 'ru') {
      if (lever.includes("Hot Lead") || lever.includes("37")) return "37 горячих лидов ТОП менеджерам";
      if (lever.includes("Response")) return "Ускорение ответов на 25 мин";
      if (lever.includes("Instagram")) return "Оптимизация Instagram бюджета (+20%)";
      if (lever.includes("Product X") || lever.includes("Mahsulot")) return "Скидка -10% и бесплатная доставка на Товар X";
      if (lever.includes("Winback") || lever.includes("qayta")) return "Win-Back кампания для постоянных клиентов";
    }
    if (language === 'en') {
      if (lever.includes("Hot Lead") || lever.includes("37")) return "37 Hot Leads to Top Closers";
      if (lever.includes("Response")) return "Response Time Cut by 25 min";
      if (lever.includes("Instagram")) return "Instagram Ads Optimization (+20%)";
      if (lever.includes("Product X") || lever.includes("Mahsulot")) return "-10% Promo & Free Delivery on Product X";
      if (lever.includes("Winback") || lever.includes("qayta")) return "Win-Back Retention Campaign";
    }
    return lever;
  };

  return (
    <div className="ui-card" style={{ border: '1px solid rgba(56, 189, 248, 0.35)', background: '#101726' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <Sliders style={{ width: 16, height: 16 }} />
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>
              {language === 'uz' && "“What-If” Daromadni Qayta Tiklash Simulyatori"}
              {language === 'ru' && "Симулятор восстановления выручки «What-If»"}
              {language === 'en' && "“What-If” Revenue Recovery Simulator"}
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            {language === 'uz' && "Har bir richagni o'zgartirib ko'ring — AI oylik kutiladigan tiklanish daromadini hisoblab beradi"}
            {language === 'ru' && "Настройте параметры — AI моментально смоделирует прогноз возврата выручки"}
            {language === 'en' && "Tune the levers — AI models real-time projected revenue recovery"}
          </p>
        </div>

        <button
          onClick={onApplyAllRecommendations}
          disabled={isApplyingAll}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: 14 }}
        >
          {isApplyingAll ? (
            <span>{language === 'uz' ? 'Qo\'llanilmoqda...' : language === 'ru' ? 'Применение...' : 'Executing...'}</span>
          ) : (
            <>
              <Zap style={{ width: 16, height: 16 }} />
              <span>{language === 'uz' ? 'Barcha 5 ta Tavsiyani Qo\'llash' : language === 'ru' ? 'Применить все 5 мер' : 'Execute All 5 Actions'}</span>
            </>
          )}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 28
      }}>
        
        {/* Left Column: Interactive Levers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          
          {/* Lever 1: Hot Leads */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                {language === 'uz' && "37 ta Hot Leadni TOP sotuvchilarga berish"}
                {language === 'ru' && "Передать 37 горячих лидов ТОП менеджерам"}
                {language === 'en' && "Reassign 37 Hot Leads to Top Closers"}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {language === 'uz' && "+2.08 mln so'm tiklanish salohiyati"}
                {language === 'ru' && "+2.08 млн сум потенциал возврата"}
                {language === 'en' && "+2.08M UZS recovery potential"}
              </div>
            </div>
            <input
              type="checkbox"
              checked={params.reassignHotLeads}
              onChange={(e) => setParams({ ...params, reassignHotLeads: e.target.checked })}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

          {/* Lever 2: Response Time */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                {language === 'uz' && "Sotuvchilar javob vaqtini qisqartirish:"}
                {language === 'ru' && "Сокращение задержки ответа:"}
                {language === 'en' && "Response time improvement:"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                -{params.responseTimeImprovementMinutes} {language === 'uz' ? 'daqiqa' : language === 'ru' ? 'мин' : 'min'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={params.responseTimeImprovementMinutes}
              onChange={(e) => setParams({ ...params, responseTimeImprovementMinutes: Number(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

          {/* Lever 3: Instagram Budget */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                {language === 'uz' && "Instagram samarali reklama byudjeti:"}
                {language === 'ru' && "Бюджет на эффективные креативы:"}
                {language === 'en' && "Instagram top ads budget:"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                +{params.instagramBudgetIncreasePercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={params.instagramBudgetIncreasePercent}
              onChange={(e) => setParams({ ...params, instagramBudgetIncreasePercent: Number(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

          {/* Lever 4: Product X Discount */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: 14
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                {language === 'uz' && "Mahsulot X promo-kod chegirmasi:"}
                {language === 'ru' && "Скидка на Товар X по промокоду:"}
                {language === 'en' && "Product X promo discount:"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                -{params.productXDiscountPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="5"
              value={params.productXDiscountPercent}
              onChange={(e) => setParams({ ...params, productXDiscountPercent: Number(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

          {/* Lever 5: Winback Campaign */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                {language === 'uz' && "Eski mijozlarga Win-Back aksiyasini yoqish"}
                {language === 'ru' && "Запустить Win-Back для старых клиентов"}
                {language === 'en' && "Launch Win-Back Retention Campaign"}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {language === 'uz' && "+3.15 mln so'm takroriy xarid"}
                {language === 'ru' && "+3.15 млн сум повторные продажи"}
                {language === 'en' && "+3.15M UZS repeat purchases"}
              </div>
            </div>
            <input
              type="checkbox"
              checked={params.triggerWinbackCampaign}
              onChange={(e) => setParams({ ...params, triggerWinbackCampaign: e.target.checked })}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

        </div>

        {/* Right Column: Projected Real-time Results */}
        <div style={{
          background: '#090d16',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span className="badge badge-info" style={{ fontSize: 11 }}>
                {language === 'uz' ? 'AI PROGNOZ NATIJASI' : language === 'ru' ? 'РЕЗУЛЬТАТ AI МОДЕЛИРОВАНИЯ' : 'AI PROJECTED OUTCOME'}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {language === 'uz' ? 'Kutilayotgan tiklanish' : language === 'ru' ? 'Ожидаемый возврат' : 'Expected Recovery'}
              </span>
            </div>

            {/* Big Projected Recovery Figure */}
            <div style={{ margin: '14px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                {language === 'uz' ? 'Tiklanadigan Qo\'shimcha Daromad:' : language === 'ru' ? 'Возвращаемая дополнительная выручка:' : 'Projected Recovered Revenue:'}
              </div>
              <div style={{
                fontSize: 42,
                fontWeight: 900,
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '-1px'
              }}>
                +{result ? formatCurrency(result.projectedRecoveredRevenue) : '...'}
              </div>
              <div style={{ fontSize: 12, color: '#34d399', fontWeight: 600, marginTop: 4 }}>
                {result ? (
                  `${language === 'uz' ? 'Sotuv o\'sishi:' : language === 'ru' ? 'Итоговая динамика:' : 'New Sales Trend:'} ${result.projectedNewPercentageChange > 0 ? '+' : ''}${result.projectedNewPercentageChange.toFixed(1)}%`
                ) : '...'}
              </div>
            </div>

            {/* Breakdown List */}
            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
                {result.impactBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12,
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <span style={{ color: '#cbd5e1' }}>{translateLever(item.lever)}</span>
                    <span style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      +{formatCurrency(item.recoveredAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            padding: 12,
            borderRadius: 10,
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: 12,
            color: '#e2e8f0',
            lineHeight: 1.5
          }}>
            {language === 'uz' && "Ushbu 5 ta amalni ishga tushirsangiz, biznesingiz yo'qotilgan 22.5 mln so'm defitsitdan to'liq chiqib, jami 121.8 mln so'm oylik sotuvga erishadi."}
            {language === 'ru' && "При активации всех 5 мер бизнес полностью компенсирует дефицит в 22.5 млн сум и выйдет на месячную выручку в 121.8 млн сум."}
            {language === 'en' && "Activating all 5 levers will offset the 22.5M UZS deficit, lifting total monthly sales to 121.8M UZS."}
          </div>
        </div>

      </div>

    </div>
  );
};
