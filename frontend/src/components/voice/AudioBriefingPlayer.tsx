import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Square
} from 'lucide-react';
import { BriefingStepDto, ExecutiveBriefingResponseDto } from '../../types';
import { voiceEngine, VoiceSpeakerId } from '../../services/voiceEngine';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { AudioWaveform } from './AudioWaveform';

interface AudioBriefingPlayerProps {
  briefing: ExecutiveBriefingResponseDto;
  onExecuteAction?: (actionKey: string) => void;
}

// 100% Ultra-Natural, Dynamic Conversational Scripts Personalized for any logged in user
export function getPersonalizedBriefing(language: string, fullName: string) {
  const cleanName = fullName?.trim() || 'Husniddin Husanboyev';
  const firstName = cleanName.split(' ')[0];
  const uzSalutation = `${firstName} aka`;
  const ruSalutation = `уважаемый ${firstName}`;
  const enSalutation = `Mr. ${firstName}`;

  const map: Record<string, { [key: number]: { title: string; narration: string; stat: string; action: string } }> = {
    uz: {
      0: {
        title: "Umumiy Tahlil: Sotuvning -18% Pasayishi",
        narration: `Assalomu alaykum, ${uzSalutation}! Biznesingiz bo'yicha so'nggi 30 kunlik ko'rsatkichlarni chuqur tahlil qilib chiqdim. O'tgan oyga qaraganda sotuvimiz 18 foizga, ya'ni 22 yarim million so'mga kamaygan. Tizimimiz barcha jarayonlarni tekshirib, buning asosiy 5 ta sababini aniqladi. Keling, har birini birgalikda ko'rib chiqamiz.`,
        stat: "-18% Sotuv Tushishi",
        action: "5 ta AI tavsiyasini bosqichma-bosqich qo'llash"
      },
      1: {
        title: "1-Sabab: Instagram Leadlari Oqimi -31% ga Tushgan",
        narration: "Birinchi sabab — Instagram reklamamiz. E'lonlarimiz eskirgani sababli yangi mijozlar oqimi 31 foizga kamayib ketgan. Oqibatda bitta mijozni jalb qilish narxi 2 baravarga qimmatlashdi. Biz hoziroq reklama roliklarini yangilab, byudjetni eng yaxshi natija berayotgan e'lonlarga yo'naltirishimiz kerak.",
        stat: "-31% Lead Oqimi",
        action: "Kreativlarni yangilash & Byudjetni optimallash"
      },
      2: {
        title: "2-Sabab: 2 ta Sotuvchining Javob Vaqti 42 Daqiqaga Cho'zilgan",
        narration: "Ikkinchi masala — sotuvchilarimizning mijozga javob berish tezligi. Ayniqsa Sardor va Madina o'rtacha 42 daqiqada javob beryapti. Vaholanki, me'yordagi vaqt 5 daqiqa bo'lishi lozim. Mijoz uzoq kutsa, boshqa raqobatchilardan sotib oladi. Bu xodimlarga ogohlantirish yuborish va kelayotgan mijozlarni bo'sh turgan sotuvchilarga avtomatik yo'naltirish zarur.",
        stat: "42 min Kechikish",
        action: "SLA ogohlantirish & Leadlarni avto-yo'naltirish"
      },
      3: {
        title: "3-Sabab: Mahsulot X Konversiyasi 14.2% dan 4.2% ga Qulagan",
        narration: "Uchinchi muammo — bizning asosiy mahsulotimiz Smart Pro Iks bilan bog'liq. Odamlar mahsulotni savatga qo'shyapti, lekin to'lov sahifasida yetkazib berish xarajatlari sababli 70 foiz odam xariddan voz kechyapti. Agar bu mahsulotga 10 foizlik promo-kod va bepul yetkazishni yoqsak, sotuvlar yana tezda tiklanadi.",
        stat: "14.2% -> 4.2%",
        action: "-10% Promo-kod & Bepul yetkazish aksiyasi"
      },
      4: {
        title: "4-Sabab: 37 ta Issiq (Hot) Lead Mutlaqo Javobsiz Qolgan",
        narration: "To'rtinchi juda muhim masala — hozirning o'zida to'lov va shartnoma so'ragan 37 ta tayyor mijozimiz 24 soatdan beri xabarlar qutisida javobsiz kutib yotibdi. Bu buyurtmalarning umumiy qiymati 2 million 600 ming so'm. Ularni darhol Otabek va Javohir kabi tajribali sotuvchilarga taqsimlasak, deyarli barchasini bugunoq yopamiz.",
        stat: "37 ta Javobsiz Lead",
        action: "1 bosishda TOP sotuvchilarga taqsimlash"
      },
      5: {
        title: "5-Sabab: Eski Mijozlarning Qayta Xaridi 28% ga Kamaygan",
        narration: "Beshinchi sabab — doimiy xaridorlarimizning qayta xarid qilishi 28 foizga tushib ketgan. Xariddan so'ng eslatma va chegirmalar yuborilmagani sababli 48 ta doimiy mijozimiz passiv bo'lib qolgan. Ularga maxsus chegirma va sovg'a vaucherlarini yuborsak, takroriy xaridlar yana jonlanadi.",
        stat: "-28% Qayta Xarid",
        action: "Win-Back SMS/Telegram kampaniyasi"
      },
      6: {
        title: "Xulosa va Qayta Tiklash Rejasi",
        narration: `Xulosa qilib aytganda, ${uzSalutation}, agar ushbu 5 ta tavsiyani birgalikda qo'llasak, keyingi 30 kunda yo'qotilgan 22 yarim million so'mning 19 million 300 ming so'mini to'liq qaytarib olamiz. Harakatni hoziroq boshlashni tavsiya qilaman!`,
        stat: "+19.3 mln so'm Tiklanish",
        action: "Barcha 5 ta tavsiyani 1 bosishda qo'llash"
      }
    },
    ru: {
      0: {
        title: "Общий анализ: Падение продаж на 18%",
        narration: `Здравствуйте, ${ruSalutation}! Я внимательно проанализировала все данные за последние 30 дней. Продажи снизились на 18 процентов, что составило 22 с половиной миллиона сум недополученной прибыли. Наша система определила 5 ключевых причин. Давайте разберем их подробно.`,
        stat: "-18% Продажи",
        action: "Пошагово применить все 5 AI рекомендаций"
      },
      1: {
        title: "Причина 1: Падение лидов из Instagram на 31%",
        narration: "Первая причина — реклама в Instagram. Из-за выгорания рекламных материалов входящий поток заявок сократился на 31 процент, а стоимость привлечения одного клиента выросла в два раза. Необходимо обновить креативы и перераспределить бюджет.",
        stat: "-31% Поток лидов",
        action: "Обновить креативы и оптимизировать бюджет"
      },
      2: {
        title: "Причина 2: Задержка ответа у 2 менеджеров (42 мин)",
        narration: "Вторая проблема — задержки ответов у менеджеров. Сардор и Мадина отвечают в среднем за 42 минуты при норме в 5 минут. При долгом ожидании клиенты уходят к конкурентам. Требуется отправить предупреждение и включить авто-маршрутизацию.",
        stat: "42 мин задержка",
        action: "SLA предупреждение и авто-маршрутизация"
      },
      3: {
        title: "Причина 3: Падение конверсии Товара X до 4.2%",
        narration: "Третья проблема связана с флагманским товаром Смарт Про Икс. Покупатели добавляют товар в корзину, но на этапе оплаты 70 процентов клиентов уходят. Скидка 10 процентов и бесплатная доставка вернут конверсию на прежний уровень.",
        stat: "14.2% -> 4.2%",
        action: "Промокод -10% и бесплатная доставка"
      },
      4: {
        title: "Причина 4: 37 горячих лидов без ответа",
        narration: "Четвертый срочный вопрос — 37 готовых к покупке клиентов уже более суток ждут ответа в инбоксе на сумму 2 миллиона 600 тысяч сум. Если перераспределить их опытным менеджерам Отабеку и Жавохиру, мы закроем большинство сделок уже сегодня.",
        stat: "37 горячих лидов",
        action: "В 1 клик распределить ТОП менеджерам"
      },
      5: {
        title: "Причина 5: Повторные покупки снизились на 28%",
        narration: "Пятая причина — повторные покупки упали на 28 процентов. 48 постоянных клиентов стали неактивными. Запуск акции возврата клиентов со специальными бонусами быстро восстановит их активность.",
        stat: "-28% Повторные покупки",
        action: "Запустить Win-Back SMS/Telegram кампанию"
      },
      6: {
        title: "Итоги и план восстановления выручки",
        narration: `Подводя итог, применив все 5 решений, мы сможем вернуть более 19 миллионов сум упущенной выручки в течение месяца. Рекомендую запустить выполнение прямо сейчас!`,
        stat: "+19.3 млн сум возврат",
        action: "Применить все 5 рекомендаций"
      }
    },
    en: {
      0: {
        title: "Executive Summary: -18% Revenue Drop",
        narration: `Hello ${enSalutation}! I have carefully examined our business performance over the last 30 days. Sales are down 18 percent, representing 22.5 million UZS in lost revenue. Our engine identified 5 root causes. Let us look through them step by step.`,
        stat: "-18% Revenue Drop",
        action: "Apply all 5 AI corrective actions"
      },
      1: {
        title: "Reason 1: Instagram Leads Dropped by 31%",
        narration: "First, our Instagram ad fatigue caused inbound leads to drop by 31 percent, doubling the cost per lead. We should refresh the ad creatives and redirect budget to the highest-performing campaigns immediately.",
        stat: "-31% Inbound Leads",
        action: "Refresh creatives & optimize budget"
      },
      2: {
        title: "Reason 2: Response Delay on 2 Sales Reps (42 min)",
        narration: "Second, sales response delays. Sardor and Madina average 42 minutes response time compared to our 5-minute standard. When customers wait this long, most buy elsewhere. We need an SLA alert and auto-routing to active agents.",
        stat: "42 min Delay",
        action: "Send SLA alert & auto-route leads"
      },
      3: {
        title: "Reason 3: Product X Funnel Conversion at 4.2%",
        narration: "Third, our flagship item Smart Pro X has high cart adds, but 70 percent drop off at checkout. Enabling a 10 percent promo code and free delivery will immediately recover conversions.",
        stat: "14.2% -> 4.2%",
        action: "Activate 10% promo & free delivery"
      },
      4: {
        title: "Reason 4: 37 Hot Leads Left Unanswered",
        narration: "Fourth, 37 ready-to-buy leads worth 2.6 million UZS have been waiting unanswered for over 24 hours. Reassigning them to top closers Otabek and Javohir will secure most of these deals today.",
        stat: "37 Unanswered Leads",
        action: "Reassign 37 leads to Top Closers"
      },
      5: {
        title: "Reason 5: Repeat Purchase Rate Dropped by 28%",
        narration: "Fifth, repeat customer sales dropped by 28 percent. 48 loyal accounts have become inactive. Sending them exclusive reward vouchers will quickly reactivate their buying cycle.",
        stat: "-28% Retention",
        action: "Launch Win-Back SMS/Telegram campaign"
      },
      6: {
        title: "Conclusion & Revenue Recovery Roadmap",
        narration: `In summary, executing all 5 actions in unison will recover 19.3 million UZS of lost revenue within the next 30 days. I recommend starting right away!`,
        stat: "+19.3M UZS Recovery",
        action: "Execute all 5 recommendations in 1 click"
      }
    }
  };

  return map[language] || map['uz'];
}

export const AudioBriefingPlayer: React.FC<AudioBriefingPlayerProps> = ({
  briefing,
  onExecuteAction
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpeaker] = useState<VoiceSpeakerId>('Anora');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const steps = briefing.steps;
  const langBriefing = getPersonalizedBriefing(language, user?.fullName || 'Husniddin Husanboyev');
  const currentLangStep = langBriefing[currentStepIndex] || langBriefing[0];

  useEffect(() => {
    // Preload all briefing step audios in background for INSTANT 0ms playback on click!
    Object.values(langBriefing).forEach((step, idx) => {
      setTimeout(() => {
        voiceEngine.preload(step.narration, selectedSpeaker, language);
      }, idx * 200);
    });

    return () => {
      voiceEngine.stop();
    };
  }, [language, user?.fullName]);

  const playStep = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);

    const stepContent = langBriefing[index];
    const narrationText = stepContent ? stepContent.narration : steps[index].narrationText;

    setIsPlaying(true);
    voiceEngine.speak(
      narrationText,
      selectedSpeaker,
      language,
      playbackSpeed,
      () => setIsPlaying(true),
      () => {
        setIsPlaying(false);
      },
      () => setIsPlaying(false)
    );
  };

  const handleStopImmediately = () => {
    voiceEngine.stop();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handleStopImmediately();
    } else {
      playStep(currentStepIndex);
    }
  };

  const handlePrev = () => {
    handleStopImmediately();
    const nextIdx = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(nextIdx);
  };

  const handleNext = () => {
    handleStopImmediately();
    const nextIdx = Math.min(steps.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextIdx);
  };

  const handleRestart = () => {
    handleStopImmediately();
    setCurrentStepIndex(0);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      handleStopImmediately();
      const stepContent = langBriefing[currentStepIndex];
      const narrationText = stepContent ? stepContent.narration : steps[currentStepIndex].narrationText;
      voiceEngine.speak(
        narrationText,
        selectedSpeaker,
        language,
        speed,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-header) 100%)',
      border: '1px solid var(--border-active)',
      borderRadius: 20,
      padding: 24,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>
      
      {/* Top Bar: Title & Voice Persona Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px var(--accent-glow)'
          }}>
            <Volume2 style={{ width: 22, height: 22, color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)' }}>
                {t('voice_briefing_title')}
              </h2>
              <span className="badge badge-info" style={{ fontSize: 11 }}>
                ~4 min
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {language === 'uz' && "Biznes egasi uchun -18% sotuv tushishining 5 ta ildiz sababi va jonli AI yechimi"}
              {language === 'ru' && "Анализ падения продаж на -18% и 5 ключевых решений для руководителя"}
              {language === 'en' && "Executive deep-dive into the -18% sales drop and 5 AI corrective actions"}
            </p>
          </div>
        </div>

        {/* Single Unified Ultra-Natural Voice Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-body)',
          padding: '7px 14px',
          borderRadius: 12,
          border: '1px solid var(--border-color)',
          fontSize: 12,
          color: 'var(--text-secondary)'
        }}>
          <Sparkles style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {language === 'uz' && 'Ovoz: Jonli AI Biznes Maslahatchi'}
            {language === 'ru' && 'Голос: Живой AI Бизнес-консультант'}
            {language === 'en' && 'Voice: Live AI Business Consultant'}
          </span>
        </div>
      </div>

      {/* Step Pills Navigation */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {steps.map((step, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isCompleted = idx < currentStepIndex;
          const stepTitle = (langBriefing[idx]?.title || step.title).split(':')[0];

          return (
            <button
              key={step.id || idx}
              onClick={() => {
                handleStopImmediately();
                setCurrentStepIndex(idx);
              }}
              style={{
                flex: 1,
                minWidth: 120,
                padding: '8px 10px',
                borderRadius: 10,
                border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: isCurrent ? 'var(--badge-primary-bg)' : isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-body)',
                color: isCurrent ? 'var(--text-primary)' : isCompleted ? '#34d399' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: isCurrent ? 800 : 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <div style={{ fontSize: 10, opacity: 0.8 }}>#{idx + 1} {isCurrent && isPlaying ? '🔊' : ''}</div>
              <div>{stepTitle}</div>
            </button>
          );
        })}
      </div>

      {/* Main Narration Card */}
      <div style={{
        background: 'var(--bg-body)',
        border: '1px solid var(--border-color)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px var(--accent-glow)'
            }}>
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                {language === 'uz' && 'AI Biznes Maslahatchi'}
                {language === 'ru' && 'AI Бизнес-консультант'}
                {language === 'en' && 'AI Business Consultant'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--accent-primary)' }}>
                {language === 'uz' && 'Jonli, tabiiy ovozda real-vaqt tahlili'}
                {language === 'ru' && 'Анализ в реальном времени живым голосом'}
                {language === 'en' && 'Real-time intelligence via natural voice'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge badge-danger" style={{ fontSize: 12, padding: '4px 10px' }}>
              {currentLangStep.stat}
            </span>
            <AudioWaveform isPlaying={isPlaying} barCount={20} color="var(--accent-primary)" />
          </div>
        </div>

        {/* Highlighted Narration Text */}
        <div style={{
          fontSize: 15,
          lineHeight: 1.65,
          color: isPlaying ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: isPlaying ? 'rgba(56, 189, 248, 0.06)' : 'transparent',
          padding: 14,
          borderRadius: 12,
          border: isPlaying ? '1px solid var(--border-active)' : '1px solid transparent',
          transition: 'all 0.2s ease',
          fontStyle: 'normal'
        }}>
          "{currentLangStep.narration}"
        </div>

        {/* Display Summary & Recommended Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 10,
          borderTop: '1px solid var(--border-color)',
          fontSize: 12
        }}>
          <div style={{ color: 'var(--text-muted)' }}>
            {language === 'uz' && 'Tavsiya:'}
            {language === 'ru' && 'Рекомендация:'}
            {language === 'en' && 'Action:'} <strong style={{ color: 'var(--text-primary)' }}>{currentLangStep.action}</strong>
          </div>

          {currentLangStep.action && onExecuteAction && (
            <button
              onClick={() => {
                if (currentStepIndex === 1) onExecuteAction('refresh_instagram_creatives');
                else if (currentStepIndex === 2) onExecuteAction('alert_lagging_agents');
                else if (currentStepIndex === 3) onExecuteAction('discount_product_x');
                else if (currentStepIndex === 4) onExecuteAction('reassign_hot_leads');
                else if (currentStepIndex === 5) onExecuteAction('trigger_winback_campaign');
              }}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: 12 }}
            >
              <Zap style={{ width: 14, height: 14 }} />
              <span>
                {language === 'uz' && 'Amalni Qo\'llash'}
                {language === 'ru' && 'Применить'}
                {language === 'en' && 'Execute'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Audio Player Controls & Progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        paddingTop: 8
      }}>
        
        {/* Playback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleRestart}
            className="btn btn-outline"
            style={{ padding: '8px 12px' }}
            title="Boshidan / Restart"
          >
            <RotateCcw style={{ width: 14, height: 14 }} />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn btn-outline"
            style={{ padding: '8px 12px' }}
            title="Oldingi / Previous"
          >
            <SkipBack style={{ width: 14, height: 14 }} />
          </button>

          <button
            onClick={togglePlayPause}
            className={isPlaying ? "btn btn-danger" : "btn btn-primary"}
            style={{ padding: '10px 22px', fontSize: 14, minWidth: 130 }}
          >
            {isPlaying ? (
              <>
                <Square style={{ width: 15, height: 15 }} />
                <span>{t('stop_voice_btn')}</span>
              </>
            ) : (
              <>
                <Play style={{ width: 16, height: 16 }} />
                <span>{t('play_voice_btn')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="btn btn-outline"
            style={{ padding: '8px 12px' }}
            title="Keyingi / Next"
          >
            <SkipForward style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Progress Text */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {language === 'uz' && 'Bosqich:'}
          {language === 'ru' && 'Шаг:'}
          {language === 'en' && 'Step:'} <strong style={{ color: 'var(--text-primary)' }}>{currentStepIndex + 1} / {steps.length}</strong> ({progressPercent}%)
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('speed_label')}</span>
          {[0.9, 1.0, 1.2].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: playbackSpeed === speed ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: playbackSpeed === speed ? 'var(--badge-primary-bg)' : 'transparent',
                color: playbackSpeed === speed ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {speed}x
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
