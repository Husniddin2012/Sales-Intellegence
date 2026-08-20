import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { api } from '../../services/api';
import { voiceEngine, VoiceSpeakerId } from '../../services/voiceEngine';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { AudioWaveform } from './AudioWaveform';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  voiceScript?: string;
  metric?: string;
  timestamp: string;
}

export const VoiceConsultantChat: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const getInitialMessage = () => {
    const cleanName = user?.fullName?.trim() || 'Husniddin Husanboyev';
    const firstName = cleanName.split(' ')[0];
    const uzSalutation = `${firstName} aka`;
    const ruSalutation = `${firstName}`;
    const enSalutation = `${firstName}`;

    if (language === 'ru') {
      return {
        id: 'msg-init',
        sender: 'ai' as const,
        text: `Здравствуйте, ${ruSalutation}! Я ваш персональный бизнес-консультант. Вы можете задать любой вопрос голосом или текстом о падении продаж на -18%, задержках менеджеров, рекламе в Instagram или 37 горячих лидах.`,
        voiceScript: `Здравствуйте, ${ruSalutation}! Я ваш бизнес-консультант. Задайте любой вопрос по продажам голосом или текстом.`,
        timestamp: '18:30'
      };
    }
    if (language === 'en') {
      return {
        id: 'msg-init',
        sender: 'ai' as const,
        text: `Hello ${enSalutation}! I am your AI Business Consultant. You can ask any question via voice or text regarding the -18% sales drop, sales rep delays, Instagram ads, or the 37 unanswered hot leads.`,
        voiceScript: `Hello ${enSalutation}! I am your AI Business Consultant. Ask me any question about your sales via voice or text.`,
        timestamp: '18:30'
      };
    }
    return {
      id: 'msg-init',
      sender: 'ai' as const,
      text: `Assalomu alaykum, ${uzSalutation}! Men sizning shaxsiy biznes maslahatchingizman. Sotuv tushishi, 37 ta javobsiz lead, xodimlar kechikishi yoki Instagram reklamalari bo'yicha istalgan savolingizni ovozda yoki matnda so'rashingiz mumkin.`,
      voiceScript: `Assalomu alaykum, ${uzSalutation}! Men sizning shaxsiy biznes maslahatchingizman. Biznesingiz bo'yicha istalgan savolingizni ovozda yoki matnda so'rashingiz mumkin.`,
      timestamp: '18:30'
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [selectedSpeaker] = useState<VoiceSpeakerId>('Anora');
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMsg = getInitialMessage();
    setMessages([initMsg]);
    voiceEngine.preload(initMsg.voiceScript || initMsg.text, selectedSpeaker, language);
  }, [language, user?.fullName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  const speakAiResponse = (text: string, msgId: string) => {
    setCurrentlySpeakingId(msgId);
    setIsSpeakingAnswer(true);
    voiceEngine.speak(
      text,
      selectedSpeaker,
      language,
      1.0,
      () => setIsSpeakingAnswer(true),
      () => {
        setIsSpeakingAnswer(false);
        setCurrentlySpeakingId(null);
      },
      () => {
        setIsSpeakingAnswer(false);
        setCurrentlySpeakingId(null);
      }
    );
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: 'Hozir'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsAiResponding(true);

    try {
      const res = await api.askAi({
        question: queryText.trim(),
        voiceSpeaker: selectedSpeaker,
        contextPage: language
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answerText,
        voiceScript: res.voiceScriptText,
        metric: res.relatedMetric || undefined,
        timestamp: 'Hozir'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsAiResponding(false);

      // Preload the natural AI audio in background for INSTANT 0ms playback on button click!
      voiceEngine.preload(res.voiceScriptText || res.answerText, selectedSpeaker, language);
    } catch (err) {
      console.error('AI ask error:', err);
      setIsAiResponding(false);
    }
  };

  const toggleMicListening = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const success = voiceEngine.startListening(
        language,
        (recognizedText, isFinal) => {
          setInputQuery(recognizedText);
          if (isFinal) {
            setIsListening(false);
            handleSendMessage(recognizedText);
          }
        },
        (error) => {
          console.warn('Speech recognition notice:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      if (!success) setIsListening(false);
    }
  };

  const quickPromptsByLang: Record<string, string[]> = {
    uz: [
      "Nega aynan bu oy sotuv -18% ga tushdi?",
      "37 ta hot leadni qanday qutqaramiz?",
      "Qaysi sotuvchilar ko'proq kechikmoqda?",
      "Instagram reklamasida qanday muammo bor?",
      "Smart Pro X mahsulotida nima uzilish bo'ldi?"
    ],
    ru: [
      "Почему продажи упали на 18%?",
      "Как спасти 37 горячих лидов?",
      "Кто из менеджеров задерживает ответы?",
      "Что не так с рекламой в Instagram?",
      "Как вернуть упущенную выручку?"
    ],
    en: [
      "Why did sales drop by 18%?",
      "How do we convert the 37 hot leads?",
      "Which sales reps are lagging behind?",
      "What is wrong with Instagram ads?",
      "How much revenue can we recover?"
    ]
  };

  const quickPrompts = quickPromptsByLang[language] || quickPromptsByLang['uz'];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 20,
      display: 'flex',
      flexDirection: 'column',
      height: 600,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden'
    }}>
      
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-card-header)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Sparkles style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
              {t('chat_title')}
            </h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {language === 'uz' && "Ovozli savol bering &rarr; Jonli inson ovozida javob oling"}
              {language === 'ru' && "Задайте вопрос голосом &rarr; Получите живой голосовой ответ"}
              {language === 'en' && "Ask via voice &rarr; Get spoken human-like answers"}
            </span>
          </div>
        </div>

        {/* Active AI Consultant Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--bg-body)',
          padding: '6px 12px',
          borderRadius: 10,
          border: '1px solid var(--border-color)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--accent-primary)'
        }}>
          <Sparkles style={{ width: 14, height: 14 }} />
          <span>
            {language === 'uz' && 'Biznes Maslahatchi'}
            {language === 'ru' && 'Бизнес-консультант'}
            {language === 'en' && 'Business Consultant'}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isSpeakingThis = currentlySpeakingId === msg.id && isSpeakingAnswer;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: 10,
                alignSelf: isAi ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}
            >
              {isAi && (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                  marginTop: 4,
                  boxShadow: '0 2px 8px var(--accent-glow)'
                }}>
                  <Sparkles style={{ width: 16, height: 16 }} />
                </div>
              )}

              <div style={{
                background: isAi ? 'var(--bg-body)' : 'var(--accent-primary)',
                color: isAi ? 'var(--text-primary)' : '#ffffff',
                border: isAi ? '1px solid var(--border-color)' : 'none',
                borderRadius: 16,
                padding: '12px 16px',
                fontSize: 13,
                lineHeight: 1.55,
                boxShadow: isAi ? 'none' : '0 4px 14px var(--accent-glow)'
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                {msg.metric && (
                  <div style={{
                    marginTop: 8,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#7dd3fc',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-block'
                  }}>
                    {msg.metric}
                  </div>
                )}

                {isAi && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    flexWrap: 'wrap',
                    gap: 8
                  }}>
                    <button
                      onClick={() => {
                        if (isSpeakingThis) {
                          voiceEngine.stop();
                          setIsSpeakingAnswer(false);
                          setCurrentlySpeakingId(null);
                        } else {
                          speakAiResponse(msg.voiceScript || msg.text, msg.id);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 14px',
                        borderRadius: 10,
                        border: isSpeakingThis ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid var(--border-color)',
                        background: isSpeakingThis ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                        color: isSpeakingThis ? 'var(--accent-primary)' : 'var(--text-primary)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSpeakingThis ? '0 0 12px var(--accent-glow)' : 'none'
                      }}
                    >
                      {isSpeakingThis ? (
                        <>
                          <Pause style={{ width: 14, height: 14 }} />
                          <span>{language === 'uz' ? "To'xtatish" : language === 'ru' ? "Остановить" : "Stop Voice"}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 style={{ width: 14, height: 14, color: 'var(--accent-primary)' }} />
                          <span>{language === 'uz' ? "🎙️ Ovozda eshitish" : language === 'ru' ? "🎙️ Слушать вслух" : "🎙️ Listen Audio"}</span>
                        </>
                      )}
                    </button>

                    {isSpeakingThis && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>Jonli ijro</span>
                        <AudioWaveform isPlaying={true} barCount={12} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isAiResponding && (
          <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-start' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <Sparkles style={{ width: 16, height: 16 }} />
            </div>
            <div style={{
              background: 'var(--bg-body)',
              border: '1px solid var(--border-color)',
              borderRadius: 16,
              padding: '12px 18px',
              fontSize: 13,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <Sparkles style={{ width: 14, height: 14, color: 'var(--accent-primary)', animation: 'spin 1.5s linear infinite' }} />
              <span>
                {language === 'uz' && 'AI tahlil qilmoqda va javob tayyorlamoqda...'}
                {language === 'ru' && 'AI анализирует данные и готовит ответ...'}
                {language === 'en' && 'AI is analyzing data and preparing answer...'}
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{
        padding: '8px 16px',
        background: 'var(--bg-card-header)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: 6,
        overflowX: 'auto'
      }}>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              background: 'var(--bg-body)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: 11,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.1s ease'
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar with Mic Recording */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-card-header)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        
        {/* Microphone Button */}
        <button
          onClick={toggleMicListening}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: isListening ? '#f43f5e' : 'var(--badge-primary-bg)',
            border: isListening ? '2px solid #fda4af' : '1px solid var(--border-active)',
            color: isListening ? '#ffffff' : 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
            boxShadow: isListening ? '0 0 16px rgba(244, 63, 94, 0.6)' : 'none',
            animation: isListening ? 'pulse 1s infinite' : 'none'
          }}
          title={isListening ? "Tinglashni to'xtatish" : "Ovozli savol berish"}
        >
          {isListening ? <MicOff style={{ width: 20, height: 20 }} /> : <Mic style={{ width: 20, height: 20 }} />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder={isListening ? t('mic_listening') : t('type_placeholder')}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputQuery);
          }}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            background: 'var(--bg-body)',
            border: isListening ? '1px solid #f43f5e' : '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: 13,
            outline: 'none'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage(inputQuery)}
          disabled={!inputQuery.trim()}
          className="btn btn-primary"
          style={{ padding: '12px 16px', borderRadius: 12 }}
        >
          <Send style={{ width: 16, height: 16 }} />
        </button>
      </div>

    </div>
  );
};
