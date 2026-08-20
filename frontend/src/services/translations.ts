export type Language = 'uz' | 'en' | 'ru';

export interface TranslationDict {
  [key: string]: {
    uz: string;
    en: string;
    ru: string;
  };
}

export const TRANSLATIONS: TranslationDict = {
  // Brand & Nav
  brand_title: {
    uz: "Sales Intelligence",
    en: "Sales Intelligence",
    ru: "Sales Intelligence"
  },
  brand_subtitle: {
    uz: "AI Diagnostika — “Nega sotuv tushib ketdi?”",
    en: "AI Diagnostics — “Why did sales drop?”",
    ru: "AI Диагностика — «Почему упали продажи?»"
  },
  sales_drop_badge: {
    uz: "Sotuv: -18%",
    en: "Sales: -18%",
    ru: "Продажи: -18%"
  },
  ai_solutions_count: {
    uz: "AI Yechimlar",
    en: "AI Actions",
    ru: "AI Решения"
  },
  period_label: {
    uz: "So'nggi 30 kun",
    en: "Last 30 days",
    ru: "Последние 30 дней"
  },
  refresh_btn: {
    uz: "Yangilash",
    en: "Refresh",
    ru: "Обновить"
  },
  reset_btn: {
    uz: "Qaytarish",
    en: "Reset",
    ru: "Сбросить"
  },

  // Sidebar Menu
  menu_overview: {
    uz: "Boshqaruv Paneli",
    en: "Dashboard Overview",
    ru: "Панель управления"
  },
  menu_voice_briefing: {
    uz: "AI Ovozli Brifing",
    en: "AI Voice Briefing",
    ru: "AI Голосовой брифинг"
  },
  menu_hot_leads: {
    uz: "37 ta Hot Lead",
    en: "37 Hot Leads",
    ru: "37 Горячих лидов"
  },
  menu_agents: {
    uz: "Sotuvchilar & SLA",
    en: "Sales Reps & SLA",
    ru: "Менеджеры и SLA"
  },
  menu_marketing: {
    uz: "Instagram & Reklama",
    en: "Instagram Marketing",
    ru: "Instagram и Реклама"
  },
  menu_products: {
    uz: "Mahsulotlar & Funnel",
    en: "Products & Funnel",
    ru: "Товары и Воронка"
  },
  menu_retention: {
    uz: "Qayta Xarid (LTV)",
    en: "Retention & LTV",
    ru: "Повторные продажи"
  },
  menu_simulator: {
    uz: "What-If Simulyator",
    en: "What-If Simulator",
    ru: "What-If Симулятор"
  },
  menu_admin: {
    uz: "Admin Paneli",
    en: "Admin Suite",
    ru: "Панель админа"
  },

  // Hero Drop Overview
  hero_title: {
    uz: "Sotuv 18.0% ga Pasaygan",
    en: "Sales Dropped by 18.0%",
    ru: "Продажи упали на 18.0%"
  },
  hero_subtitle: {
    uz: "Yo'qotilgan daromad: 22,500,000 so'm. AI quyidagi 5 ta asosiy bo'g'indagi uzilishlarni aniqladi:",
    en: "Lost revenue: 22,500,000 UZS. AI identified drop causes across 5 critical levers:",
    ru: "Упущенная выручка: 22,500,000 сум. AI выявил 5 ключевых причин падения:"
  },
  apply_all_btn: {
    uz: "Barcha 5 ta AI Tavsiyasini Qo'llash",
    en: "Execute All 5 AI Recommendations",
    ru: "Применить все 5 AI рекомендаций"
  },

  // 5 Root Causes
  cause_1_title: {
    uz: "Instagram leadlari kamaygan (-31%)",
    en: "Instagram Leads Dropped (-31%)",
    ru: "Упал поток лидов из Instagram (-31%)"
  },
  cause_1_action: {
    uz: "Kreativlarni yangilash & Byudjetni optimallash",
    en: "Refresh Ad Creatives & Optimize Budget",
    ru: "Обновить креативы и оптимизировать бюджет"
  },
  cause_2_title: {
    uz: "2 ta sotuvchi response time oshgan (42 min)",
    en: "2 Sales Reps Response Delayed (42 min)",
    ru: "Задержка ответа у 2 менеджеров (42 мин)"
  },
  cause_2_action: {
    uz: "SLA ogohlantirish & Leadlarni avto-yo'naltirish",
    en: "Send SLA Alert & Auto-Route Leads",
    ru: "Предупреждение по SLA и авто-маршрутизация"
  },
  cause_3_title: {
    uz: "Mahsulot X bo'yicha conversion tushgan (4.2%)",
    en: "Product X Checkout Conversion Dropped (4.2%)",
    ru: "Конверсия Товара X упала до 4.2%"
  },
  cause_3_action: {
    uz: "-10% Promo-kod & Bepul yetkazishni yoqish",
    en: "Activate -10% Promo & Free Delivery",
    ru: "Активировать промокод -10% и бесплатную доставку"
  },
  cause_4_title: {
    uz: "37 ta hot lead javobsiz qolgan",
    en: "37 Hot Leads Left Unanswered",
    ru: "37 горячих лидов остались без ответа"
  },
  cause_4_action: {
    uz: "37 ta leadni darhol TOP sotuvchilarga taqsimlash",
    en: "Reassign 37 Leads to Top Closers",
    ru: "Распределить 37 лидов ТОП-менеджерам"
  },
  cause_5_title: {
    uz: "Eski mijozlarning repeat purchase kamaygan (-28%)",
    en: "Repeat Purchases Dropped by 28%",
    ru: "Повторные покупки снизились на 28%"
  },
  cause_5_action: {
    uz: "Win-Back SMS/Telegram aksiyasini boshlash",
    en: "Launch Win-Back SMS/Telegram Campaign",
    ru: "Запустить Win-Back кампанию в SMS/Telegram"
  },

  // Voice Player
  voice_briefing_title: {
    uz: "Executive Ovozli Brifing (Boshidan Oxirigacha)",
    en: "Executive Voice Briefing (End-to-End)",
    ru: "Голосовой брифинг для руководителя (От А до Я)"
  },
  voice_speaker_label: {
    uz: "Ovoz:",
    en: "Speaker:",
    ru: "Голос:"
  },
  play_voice_btn: {
    uz: "Eshittirish",
    en: "Play Briefing",
    ru: "Слушать"
  },
  stop_voice_btn: {
    uz: "To'xtatish",
    en: "Stop Audio",
    ru: "Остановить"
  },
  speed_label: {
    uz: "Tezlik:",
    en: "Speed:",
    ru: "Скорость:"
  },

  // Voice Chat
  chat_title: {
    uz: "AI Ovozli Biznes Maslahatchi",
    en: "AI Voice Business Consultant",
    ru: "AI Голосовой бизнес-консультант"
  },
  mic_listening: {
    uz: "Sizni tinglamoqdaman, gapiring...",
    en: "Listening to your voice, please speak...",
    ru: "Слушаю вас, говорите..."
  },
  type_placeholder: {
    uz: "Savolingizni yozing yoki mikrofonni bosing...",
    en: "Type your question or click the mic...",
    ru: "Напишите вопрос или нажмите микрофон..."
  },
  send_btn: {
    uz: "Yuborish",
    en: "Send",
    ru: "Отправить"
  }
};
