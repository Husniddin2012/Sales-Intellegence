import React from 'react';
import {
  Clock,
  ShoppingBag,
  Flame,
  Repeat,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { RootCauseDto } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RootCauseCardsProps {
  causes: RootCauseDto[];
  onSelectCause: (id: string) => void;
  onExecuteAction: (actionKey: string) => void;
  actionLoadingKey: string | null;
}

export const RootCauseCards: React.FC<RootCauseCardsProps> = ({
  causes,
  onSelectCause,
  onExecuteAction,
  actionLoadingKey
}) => {
  const { language } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return <InstagramIcon className="w-5 h-5 text-pink-400" />;
      case 'ClockAlert':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-emerald-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cyan-400" />;
    }
  };

  const formatCurrency = (val: number) => {
    if (language === 'en') {
      return new Intl.NumberFormat('en-US').format(val) + ' UZS';
    }
    if (language === 'ru') {
      return new Intl.NumberFormat('ru-RU').format(val) + ' сум';
    }
    return new Intl.NumberFormat('uz-UZ').format(val) + ' so\'m';
  };

  const translateCause = (rc: RootCauseDto) => {
    if (language === 'ru') {
      if (rc.id.includes('instagram')) {
        return {
          title: "Снижение потока лидов из Instagram на 31%",
          category: "Маркетинг",
          desc: "Рекламные креативы выгорели. Стоимость лида (CPL) выросла в 2.1 раза с $1.72 до $3.68.",
          action: "Обновить креативы и оптимизировать бюджет",
          metricBefore: "348 лидов/мес ($1.72 CPL)",
          metricAfter: "240 лидов/мес ($3.68 CPL)"
        };
      }
      if (rc.id.includes('agent')) {
        return {
          title: "Задержка ответа у 2 менеджеров (42 мин)",
          category: "Команда продаж",
          desc: "У 2 сотрудников среднее время ответа составляет 42 минуты при норме в 5 минут. Конверсия упала до 3.8%.",
          action: "Отправить SLA предупреждение и настроить авто-маршрутизацию",
          metricBefore: "5 мин среднее время ответа",
          metricAfter: "42 мин задержка (в 8 раз дольше)"
        };
      }
      if (rc.id.includes('product')) {
        return {
          title: "Конверсия Товара X упала с 14.2% до 4.2%",
          category: "Продуктовая воронка",
          desc: "По товару Smart Pro X на этапе чекаута уходят 70.4% клиентов из-за барьеров доставки.",
          action: "Активировать промокод -10% и бесплатную доставку",
          metricBefore: "14.2% конверсия",
          metricAfter: "4.2% конверсия (-70.4% обвал)"
        };
      }
      if (rc.id.includes('hot-leads')) {
        return {
          title: "37 горячих лидов остались без ответа",
          category: "Упущенные сделки",
          desc: "37 клиентов, запросивших реквизиты или договор, ждут ответа более 24 часов в инбоксе.",
          action: "В 1 клик распределить 37 лидов ТОП менеджерам",
          metricBefore: "0 пропущенных лидов",
          metricAfter: "37 горячих лидов без ответа"
        };
      }
      if (rc.id.includes('repeat')) {
        return {
          title: "Повторные покупки снизились на 28%",
          category: "Удержание клиентов",
          desc: "Доля повторных покупок постоянных клиентов упала с 22.8% до 16.4%. 48 клиентов ушли в отток.",
          action: "Запустить Win-Back SMS/Telegram кампанию",
          metricBefore: "22.8% повторных покупок",
          metricAfter: "16.4% повторных покупок (-28.1%)"
        };
      }
    }

    if (language === 'en') {
      if (rc.id.includes('instagram')) {
        return {
          title: "Instagram Inbound Leads Dropped by 31%",
          category: "Marketing & Ads",
          desc: "Ad creatives fatigued. Cost per lead (CPL) doubled from $1.72 to $3.68.",
          action: "Refresh Ad Creatives & Optimize Budget",
          metricBefore: "348 leads/mo ($1.72 CPL)",
          metricAfter: "240 leads/mo ($3.68 CPL)"
        };
      }
      if (rc.id.includes('agent')) {
        return {
          title: "Response Delay on 2 Sales Reps (42 min)",
          category: "Sales SLA",
          desc: "2 sales reps average 42 minutes response time vs 5-minute standard. Conversion collapsed to 3.8%.",
          action: "Send SLA Alert & Auto-Route Leads",
          metricBefore: "5 min benchmark response",
          metricAfter: "42 min delay (8x longer)"
        };
      }
      if (rc.id.includes('product')) {
        return {
          title: "Product X Checkout Conversion Dropped to 4.2%",
          category: "Product Funnel",
          desc: "70.4% checkout abandonment on Smart Pro X due to delivery costs.",
          action: "Activate -10% Promo & Free Delivery",
          metricBefore: "14.2% conversion",
          metricAfter: "4.2% conversion (-70.4% drop)"
        };
      }
      if (rc.id.includes('hot-leads')) {
        return {
          title: "37 Hot Leads Left Unanswered",
          category: "Lost Opportunities",
          desc: "37 high-intent leads waiting in the CRM inbox for over 24 hours.",
          action: "Reassign 37 leads to Top Closers in 1-Click",
          metricBefore: "0 neglected leads",
          metricAfter: "37 hot leads waiting"
        };
      }
      if (rc.id.includes('repeat')) {
        return {
          title: "Repeat Purchases Dropped by 28%",
          category: "Customer Retention",
          desc: "Repeat purchase rate declined from 22.8% to 16.4%. 48 loyal customers churned.",
          action: "Launch Win-Back SMS/Telegram Campaign",
          metricBefore: "22.8% repeat purchases",
          metricAfter: "16.4% repeat purchases (-28.1%)"
        };
      }
    }

    return {
      title: rc.title,
      category: rc.category,
      desc: rc.shortDescription,
      action: rc.actionTitle,
      metricBefore: rc.keyMetricBefore,
      metricAfter: rc.keyMetricAfter
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 8,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <Zap style={{ width: 16, height: 16 }} />
            </span>
            {language === 'uz' && "Sotuv Tushishining 5 ta Asosiy Sababi (AI Diagnostika)"}
            {language === 'ru' && "5 Корневых Причин Падения Продаж (AI Диагностика)"}
            {language === 'en' && "5 Root Causes of the Sales Drop (AI Diagnostics)"}
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>
            {language === 'uz' && "Har bir muammo bo'yicha aniq yo'qotish va 1 bosishda bajariladigan chora-tadbirlar"}
            {language === 'ru' && "Точная сумма потерь по каждой проблеме и мгновенные решения в 1 клик"}
            {language === 'en' && "Quantified revenue loss per bottleneck with 1-click corrective actions"}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-danger">
            {language === 'uz' && "Kritik: 3 ta"}
            {language === 'ru' && "Критических: 3"}
            {language === 'en' && "Critical: 3"}
          </span>
          <span className="badge badge-warning">
            {language === 'uz' && "O'rtacha: 2 ta"}
            {language === 'ru' && "Средних: 2"}
            {language === 'en' && "Medium: 2"}
          </span>
        </div>
      </div>

      {/* 5 Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 16
      }}>
        {causes.map((cause, index) => {
          const isCritical = cause.severity === 'Critical';
          const isCompleted = cause.actionCompleted;
          const isLoading = actionLoadingKey === cause.actionKey;
          const translated = translateCause(cause);

          return (
            <div
              key={cause.id}
              className="ui-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: isCompleted ? 'rgba(16, 185, 129, 0.4)' : isCritical ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : isCritical ? 'rgba(244, 63, 94, 0.03)' : 'var(--bg-card)'
              }}
            >
              <div>
                
                {/* Card Top: Icon, Index, Category, Severity */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {getIcon(cause.icon)}
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        #{index + 1} &bull; {translated.category}
                      </span>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginTop: 2 }}>
                        {translated.title}
                      </h3>
                    </div>
                  </div>

                  <span className={isCompleted ? 'badge badge-success' : isCritical ? 'badge badge-danger' : 'badge badge-warning'}>
                    {isCompleted ? (
                      <>
                        <CheckCircle2 style={{ width: 12, height: 12 }} />
                        <span>{language === 'uz' ? 'Bajarildi' : language === 'ru' ? 'Выполнено' : 'Resolved'}</span>
                      </>
                    ) : (
                      cause.severity
                    )}
                  </span>
                </div>

                {/* Short Description */}
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 14 }}>
                  {translated.desc}
                </p>

                {/* Key Metrics Before vs After */}
                <div style={{
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  fontSize: 12,
                  marginBottom: 14
                }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>{language === 'uz' ? 'Oldingi ko\'rsatkich:' : language === 'ru' ? 'Прежний показатель:' : 'Baseline metric:'}</div>
                    <div style={{ color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{translated.metricBefore}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>{language === 'uz' ? 'Hozirgi holat:' : language === 'ru' ? 'Текущее состояние:' : 'Current state:'}</div>
                    <div style={{ color: '#f43f5e', fontWeight: 700, marginTop: 2 }}>{translated.metricAfter}</div>
                  </div>
                </div>

                {/* Loss Amount & Impact */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  marginBottom: 14,
                  fontSize: 12
                }}>
                  <span style={{ color: '#fda4af' }}>{language === 'uz' ? 'Yo\'qotilgan daromad:' : language === 'ru' ? 'Сумма потерь:' : 'Lost revenue:'}</span>
                  <span style={{ fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    -{formatCurrency(cause.lostRevenue)} ({cause.impactPercentage}%)
                  </span>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {isCompleted ? (
                  <div className="btn btn-done" style={{ flex: 1, padding: '9px 12px', fontSize: 12 }}>
                    <CheckCircle2 style={{ width: 14, height: 14 }} />
                    <span>{language === 'uz' ? 'Chora qo\'llandi' : language === 'ru' ? 'Мера принята' : 'Action Applied'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onExecuteAction(cause.actionKey)}
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: 12 }}
                  >
                    {isLoading ? (
                      <span>{language === 'uz' ? 'Bajarilmoqda...' : language === 'ru' ? 'Применение...' : 'Applying...'}</span>
                    ) : (
                      <>
                        <Zap style={{ width: 14, height: 14 }} />
                        <span>{translated.action}</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => onSelectCause(cause.id)}
                  className="btn btn-outline"
                  style={{ padding: '9px 12px', fontSize: 12 }}
                  title={language === 'uz' ? "Batafsil tahlil" : language === 'ru' ? "Подробный анализ" : "Drilldown details"}
                >
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
