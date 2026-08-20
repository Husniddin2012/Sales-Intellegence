import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ExecutiveBriefingResponseDto } from '../../types';
import { AudioBriefingPlayer } from '../voice/AudioBriefingPlayer';
import { VoiceConsultantChat } from '../voice/VoiceConsultantChat';
import { Volume2, Sparkles, MessageSquare, Headphones } from 'lucide-react';

interface AiVoiceBriefingPageProps {
  onExecuteAction?: (actionKey: string) => void;
}

const DEFAULT_BRIEFING: ExecutiveBriefingResponseDto = {
  summaryTitle: "Sales Intelligence — Boshqaruvchi uchun To'liq Ovozli Brifing",
  totalEstimatedMinutes: 4,
  totalLostRevenue: 22500000,
  steps: [
    {
      stepNumber: 1,
      id: 'step-intro',
      title: 'Umumiy Tahlil: Sotuvning -18% Pasayishi',
      narrationText: "Biznesingiz bo'yicha so'nggi 30 kunlik ko'rsatkichlarni chuqur tahlil qilib chiqdim. O'tgan oyga qaraganda sotuvimiz 18 foizga, ya'ni 22 yarim million so'mga kamaygan. Tizimimiz barcha jarayonlarni tekshirib, buning asosiy 5 ta sababini aniqladi. Keling, har birini birgalikda ko'rib chiqamiz.",
      displayText: "So'nggi 30 kunda umumiy sotuv 18.0% ga pasaygan (Yo'qotilgan daromad: 22,500,000 so'm). Asosiy 5 ta bo'g'indagi uzilishlar aniqlandi.",
      keyStat: '-18% Sotuv Tushishi',
      category: 'Executive Summary',
      impactAmount: -22500000,
      recommendedAction: "5 ta AI tavsiyasini bosqichma-bosqich qo'llash"
    },
    {
      stepNumber: 2,
      id: 'step-instagram',
      title: '1-Sabab: Instagram Leadlari Oqimi -31% ga Tushgan',
      narrationText: "Birinchi sabab — Instagram reklamamiz. E'lonlarimiz eskirgani sababli yangi mijozlar oqimi 31 foizga kamayib ketgan. Oqibatda bitta mijozni jalb qilish narxi 2 baravarga qimmatlashdi.",
      displayText: "Instagram leadlari 31% ga kamaygan, bitta lead narxi (CPL) $1.72 dan $3.68 ga oshgan.",
      keyStat: '-31% Lead Oqimi',
      category: 'Marketing & Acquisition',
      impactAmount: -8000000,
      recommendedAction: 'Kreativlarni yangilash & Byudjetni optimallash'
    },
    {
      stepNumber: 3,
      id: 'step-agents',
      title: "2-Sabab: 2 ta Sotuvchining Javob Vaqti 42 Daqiqaga Cho'zilgan",
      narrationText: "Ikkinchi masala — sotuvchilarimizning mijozga javob berish tezligi. Ayniqsa Sardor va Madina o'rtacha 42 daqiqada javob beryapti.",
      displayText: "2 ta xodimda o'rtacha javob berish vaqti 42 daqiqaga cho'zilgan (norma: 5 min).",
      keyStat: '42 min Kechikish',
      category: 'Sales Team SLA',
      impactAmount: -6000000,
      recommendedAction: "SLA ogohlantirish & Leadlarni avto-yo'naltirish"
    },
    {
      stepNumber: 4,
      id: 'step-product-x',
      title: '3-Sabab: Mahsulot X Konversiyasi 14.2% dan 4.2% ga Qulagan',
      narrationText: "Uchinchi muammo — bizning asosiy mahsulotimiz Smart Pro X bilan bog'liq. Checkout sahifasida yetkazib berish xarajatlari sababli 70 foiz odam xariddan voz kechyapti.",
      displayText: "Smart Pro X bo'yicha checkout uzilishi 70.4% ga yetgan. Konversiya 14.2% dan 4.2% ga tushgan.",
      keyStat: '14.2% -> 4.2%',
      category: 'Conversion Funnel',
      impactAmount: -4375000,
      recommendedAction: '-10% Promo-kod & Bepul yetkazish aksiyasi'
    },
    {
      stepNumber: 5,
      id: 'step-hot-leads',
      title: '4-Sabab: 37 ta Issiq (Hot) Lead Mutlaqo Javobsiz Qolgan',
      narrationText: "To'rtinchi juda muhim masala — hozirning o'zida to'lov va shartnoma so'ragan 37 ta tayyor mijozimiz 24 soatdan beri javobsiz kutib yotibdi.",
      displayText: "37 ta xaridga tayyor mijoz 24+ soatdan beri javobsiz qolgan. Yo'qotilayotgan summa: 2,625,000 so'm.",
      keyStat: '37 ta Javobsiz Lead',
      category: 'Lost Opportunities',
      impactAmount: -2625000,
      recommendedAction: '1 bosishda TOP sotuvchilarga taqsimlash'
    },
    {
      stepNumber: 6,
      id: 'step-retention',
      title: '5-Sabab: Eski Mijozlarning Qayta Xaridi 28% ga Kamaygan',
      narrationText: "Beshinchi sabab — doimiy xaridorlarimizning qayta xarid qilishi 28 foizga tushib ketgan. Passiv mijozlarga sovg'a vaucherlari yuboramiz.",
      displayText: "Repeat purchase 22.8% dan 16.4% ga tushgan. 48 ta doimiy mijoz passivlashgan.",
      keyStat: '-28% Qayta Xarid',
      category: 'Customer Retention',
      impactAmount: -1500000,
      recommendedAction: 'Win-Back SMS/Telegram kampaniyasi'
    },
    {
      stepNumber: 7,
      id: 'step-conclusion',
      title: 'Xulosa va Qayta Tiklash Rejasi',
      narrationText: "Xulosa qilib aytganda, agar ushbu 5 ta tavsiyani birgalikda qo'llasak, keyingi 30 kunda yo'qotilgan 22 yarim million so'mning 19 million 300 ming so'mini to'liq qaytarib olamiz.",
      displayText: "Barcha 5 ta amalni birdaniga qo'llash orqali jami daromad 102.5 mln so'mdan 121.8 mln so'mga yetkaziladi (+18.8% tiklanish).",
      keyStat: "+19.3 mln so'm Tiklanish",
      category: 'Action Plan',
      impactAmount: 19300000,
      recommendedAction: "Barcha 5 ta tavsiyani 1 bosishda qo'llash"
    }
  ],
  conclusion: "Barcha 5 ta tavsiya bir vaqtda bajarilganda sotuv darhol o'sish dinamikasiga qaytadi."
};

export const AiVoiceBriefingPage: React.FC<AiVoiceBriefingPageProps> = ({ onExecuteAction }) => {
  const [briefing, setBriefing] = useState<ExecutiveBriefingResponseDto>(DEFAULT_BRIEFING);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'briefing' | 'consultant'>('briefing');

  useEffect(() => {
    const loadBriefing = async () => {
      try {
        const data = await api.getBriefing();
        if (data && data.steps && data.steps.length > 0) {
          setBriefing(data);
        }
      } catch (err) {
        console.warn('Briefing load fallback:', err);
      }
    };
    loadBriefing();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Volume2 style={{ width: 28, height: 28, color: 'var(--accent-primary)' }} />
            AI Ovozli Brifing & Biznes Maslahatchi
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Tabiiy va ravon inson ovozida tahliliy hisobot hamda interaktiv ovozli savol-javob
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', padding: 4, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('briefing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'briefing' ? 'var(--badge-primary-bg)' : 'transparent',
              color: activeTab === 'briefing' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'briefing' ? 800 : 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Headphones style={{ width: 16, height: 16 }} />
            <span>To'liq Ovozli Brifing</span>
          </button>

          <button
            onClick={() => setActiveTab('consultant')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'consultant' ? 'var(--badge-primary-bg)' : 'transparent',
              color: activeTab === 'consultant' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'consultant' ? 800 : 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare style={{ width: 16, height: 16 }} />
            <span>Ovozli Savol-Javob (Chat)</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: 14 }}>AI Ovozli hisobot va audio ssenariy yuklanmoqda...</p>
        </div>
      ) : (
        <>
          {activeTab === 'briefing' && (
            <AudioBriefingPlayer briefing={briefing} onExecuteAction={onExecuteAction} />
          )}

          {activeTab === 'consultant' && (
            <VoiceConsultantChat />
          )}
        </>
      )}

    </div>
  );
};
