import { Language } from './translations';

export type VoiceSpeakerId = 'Anora' | 'Madina' | 'Rayhona' | 'Zarina';

export interface VoiceSpeakerInfo {
  id: VoiceSpeakerId;
  name: { uz: string; en: string; ru: string };
  gender: 'female';
  title: { uz: string; en: string; ru: string };
  avatar: string;
  pitch: number;
  rate: number;
  description: { uz: string; en: string; ru: string };
}

export const VOICE_SPEAKERS: VoiceSpeakerInfo[] = [
  {
    id: 'Anora',
    name: { uz: 'Anora (Anorbank uslubi)', en: 'Anora (Anorbank Style)', ru: 'Анора (Стиль Анорбанк)' },
    gender: 'female',
    title: { uz: 'Bosh Ovozli Maslahatchi', en: 'Lead Voice Consultant', ru: 'Главный голосовой консультант' },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pitch: 1.0, // Calibrated for warm, natural human pitch
    rate: 0.90,  // Natural human speaking cadence with clear pauses
    description: {
      uz: 'Anorbankning Anora ovozidek 100% tabiiy, mayin va ravon inson ovozi',
      en: '100% natural, clear and warm human female voice like Anora',
      ru: 'Максимально естественный, мягкий и четкий женский голос'
    }
  },
  {
    id: 'Madina',
    name: { uz: 'Madina Karimova', en: 'Madina Karimova', ru: 'Мадина Каримова' },
    gender: 'female',
    title: { uz: 'Senior Biznes Tahlilchi', en: 'Senior Business Analyst', ru: 'Старший бизнес-аналитик' },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    pitch: 1.02,
    rate: 0.91,
    description: {
      uz: 'Samimiy, juda ravon va tushunarli professional ayol ovozi',
      en: 'Warm, articulate and clear professional female voice',
      ru: 'Приятный, выразительный и естественный женский голос'
    }
  },
  {
    id: 'Rayhona',
    name: { uz: 'Rayhona Umarova', en: 'Rayhona Umarova', ru: 'Райхона Умарова' },
    gender: 'female',
    title: { uz: 'Mijozlar bilan aloqa boshqaruvchisi', en: 'Client Success Lead', ru: 'Руководитель клиентского сервиса' },
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    pitch: 1.05,
    rate: 0.92,
    description: {
      uz: 'Jonli, xushmuomala va do\'stona ayol ovozi',
      en: 'Dynamic, friendly and warm female voice',
      ru: 'Живой, приветливый и естественный женский голос'
    }
  },
  {
    id: 'Zarina',
    name: { uz: 'Zarina Rahimova', en: 'Zarina Rahimova', ru: 'Зарина Рахимова' },
    gender: 'female',
    title: { uz: 'Executive Strategist', en: 'Executive Strategist', ru: 'Стратегический консультант' },
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    pitch: 1.03,
    rate: 0.89,
    description: {
      uz: 'Aniq talaffuzli, tahliliy va ishonchli ayol ovozi',
      en: 'Crisp, articulate and authoritative female voice',
      ru: 'Четкий, грамотный и уверенный женский голос'
    }
  }
];

/**
 * Phonetic speech optimizer: Transforms abbreviations, percentages,
 * numbers, and technical jargon into completely natural, human-pronounced conversational sentences.
 */
export function optimizePhoneticsForSpeech(text: string, lang: Language): string {
  if (!text) return '';

  let clean = text;

  // Strip markdown artifacts, brackets, and code-like symbols
  clean = clean.replace(/[*_#`~[\]]/g, ' ');
  clean = clean.replace(/\(\s*([^)]+)\s*\)/g, ', $1, ');
  clean = clean.replace(/&rarr;/g, 'ga');
  clean = clean.replace(/->/g, 'dan');

  if (lang === 'uz') {
    // Percentages & numbers
    clean = clean.replace(/-18(\.0)?%/g, 'o\'n sakkiz foizga');
    clean = clean.replace(/-31%/g, 'o\'ttiz bir foizga');
    clean = clean.replace(/-28(\.1)?%/g, 'yigirma sakkiz foizga');
    clean = clean.replace(/14\.2%/g, 'o\'n to\'rt butun o\'ndan ikki foiz');
    clean = clean.replace(/4\.2%/g, 'to\'rt butun o\'ndan ikki foiz');
    clean = clean.replace(/70(\.4)?%/g, 'yetmish foiz');
    clean = clean.replace(/18(\.0)?%/g, 'o\'n sakkiz foiz');
    clean = clean.replace(/(\d+)%/g, '$1 foiz');

    // Amounts & Currencies
    clean = clean.replace(/22[.,]500[.,]000\s*so['`]?m/gi, 'yigirma ikki yarim million so\'m');
    clean = clean.replace(/19[.,]300[.,]000\s*so['`]?m/gi, 'o\'n to\'qqiz million uch yuz ming so\'m');
    clean = clean.replace(/2[.,]625[.,]000\s*so['`]?m/gi, 'ikki million olti yuz yigirma besh ming so\'m');
    clean = clean.replace(/2[.,]600[.,]000\s*so['`]?m/gi, 'ikki million olti yuz ming so\'m');
    clean = clean.replace(/6[.,]000[.,]000\s*so['`]?m/gi, 'olti million so\'m');
    clean = clean.replace(/8[.,]000[.,]000\s*so['`]?m/gi, 'sakkiz million so\'m');
    clean = clean.replace(/125[.,]000[.,]000\s*so['`]?m/gi, 'bir yuz yigirma besh million so\'m');
    clean = clean.replace(/102[.,]500[.,]000\s*so['`]?m/gi, 'bir yuz ikki yarim million so\'m');
    clean = clean.replace(/121[.,]800[.,]000\s*so['`]?m/gi, 'bir yuz yigirma bir million sakkiz yuz ming so\'m');
    clean = clean.replace(/19\.3\s*mln(\s*so['`]?m)?/gi, 'o\'n to\'qqiz million uch yuz ming so\'m');
    clean = clean.replace(/22\.5\s*mln(\s*so['`]?m)?/gi, 'yigirma ikki yarim million so\'m');
    clean = clean.replace(/102\.5\s*mln/gi, 'bir yuz ikki yarim million');
    clean = clean.replace(/121\.8\s*mln/gi, 'bir yuz yigirma bir yarim million');

    // Counts, metrics & steps
    clean = clean.replace(/37\s*ta\s*(hot\s*)?lead/gi, 'o\'ttiz yetti ta tayyor mijoz arizasi');
    clean = clean.replace(/37\s*ta/gi, 'o\'ttiz yetti ta');
    clean = clean.replace(/48\s*ta/gi, 'qirq sakkiz ta');
    clean = clean.replace(/5\s*ta/gi, 'beshta');
    clean = clean.replace(/2\s*ta/gi, 'ikkita');
    clean = clean.replace(/1\s*ta/gi, 'bitta');
    clean = clean.replace(/1\s*bosishda/gi, 'bitta tugmani bosish orqali');
    clean = clean.replace(/42\s*min(ut|uqa)?/gi, 'qirq ikki daqiqa');
    clean = clean.replace(/5\s*min(ut|uqa)?/gi, 'besh daqiqa');
    clean = clean.replace(/24\s*soat/gi, 'yigirma to\'rt soat');
    clean = clean.replace(/30\s*kun/gi, 'o\'ttiz kun');

    // Step numbers
    clean = clean.replace(/1-Sabab:?/gi, 'Birinchi sabab,');
    clean = clean.replace(/2-Sabab:?/gi, 'Ikkinchi sabab,');
    clean = clean.replace(/3-Sabab:?/gi, 'Uchinchi sabab,');
    clean = clean.replace(/4-Sabab:?/gi, 'To\'rtinchi sabab,');
    clean = clean.replace(/5-Sabab:?/gi, 'Beshinchi sabab,');

    // Abbreviations & Technical Terms
    clean = clean.replace(/\bSLA\b/g, 'javob berish tezligi normativi');
    clean = clean.replace(/\bCPL\b/g, 'bitta mijozni jalb qilish narxi');
    clean = clean.replace(/\bCTR\b/g, 'reklamani bosish ko\'rsatkichi');
    clean = clean.replace(/\bSmart Pro X\b/gi, 'Smart Pro Iks');
    clean = clean.replace(/\bWin-Back\b/gi, 'Mijozlarni qaytarish');
    clean = clean.replace(/\bHot lead(lar)?\b/gi, 'Issiq mijozlar');
    clean = clean.replace(/\bLead(lar)?\b/gi, 'Mijoz murojaatlari');
    clean = clean.replace(/\bTOP\b/g, 'eng tajribali');
    clean = clean.replace(/\bInstagram\b/gi, 'Instagram');
    clean = clean.replace(/\bTelegram\b/gi, 'Telegram');
    clean = clean.replace(/\bSMS\b/gi, 'Esemes');
    clean = clean.replace(/\bAI\b/g, 'sun\'iy intellekt');
    clean = clean.replace(/\bcheckout\b/gi, 'to\'lov qilish jarayoni');
    clean = clean.replace(/\bfunnel\b/gi, 'sotuv voronkasi');

    // Conversational Greetings & Human Warmth
    clean = clean.replace(/Assalomu alaykum/gi, 'Assalomu alaykum,');
    clean = clean.replace(/Husniddin aka/gi, 'Husniddin aka,');

    // Natural human pauses for breath and intonation
    clean = clean.replace(/,\s*,+/g, ',');
    clean = clean.replace(/,\s*/g, ', ');
    clean = clean.replace(/\.\s+/g, '. ');
    clean = clean.replace(/:\s+/g, ': ');
    clean = clean.replace(/\s+/g, ' ').trim();

    return clean;
  }

  if (lang === 'ru') {
    clean = clean.replace(/-18(\.0)?%/g, 'минус восемнадцать процентов');
    clean = clean.replace(/-31%/g, 'минус тридцать один процент');
    clean = clean.replace(/-28%/g, 'минус двадцать восемь процентов');
    clean = clean.replace(/22[.,]500[.,]000\s*сум/gi, 'двадцать два миллиона пятьсот тысяч сум');
    clean = clean.replace(/19[.,]300[.,]000\s*сум/gi, 'девятнадцать миллионов триста тысяч сум');
    clean = clean.replace(/2[.,]600[.,]000\s*сум/gi, 'два миллиона шестьсот тысяч сум');
    clean = clean.replace(/37\s*горячих\s*лидов/gi, 'тридцать семь горячих лидов');
    clean = clean.replace(/42\s*мин/gi, 'сорок две минуты');
    clean = clean.replace(/\bSmart Pro X\b/gi, 'Смарт Про Икс');
    clean = clean.replace(/\bSLA\b/g, 'норматив времени ответа');
    clean = clean.replace(/\bAI\b/g, 'Искусственный интеллект');
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean;
  }

  return clean.replace(/\s+/g, ' ').trim();
}

class VoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private recognition: any = null;
  private isExplicitlyStopped: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private abortController: AbortController | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.cachedVoices = this.synth.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (!this.cachedVoices.length) {
      this.cachedVoices = this.synth.getVoices();
    }
    return this.cachedVoices;
  }

  public getBestFemaleVoice(lang: Language): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices.length) return null;

    const lower = (str: string) => (str || '').toLowerCase();

    const isFemale = (v: SpeechSynthesisVoice) => {
      const n = lower(v.name);
      if (n.includes('male') || n.includes('david') || n.includes('george') || n.includes('guy') || 
          n.includes('dmitry') || n.includes('pavel') || n.includes('stefan') || n.includes('mark')) {
        return false;
      }
      return true;
    };

    if (lang === 'uz') {
      const uzVoice = voices.find(v => 
        (lower(v.lang).startsWith('uz') || lower(v.name).includes('uzbek') || lower(v.name).includes('madina') || lower(v.name).includes('dilara')) && isFemale(v)
      );
      if (uzVoice) return uzVoice;

      const turkicVoice = voices.find(v => 
        (lower(v.lang).startsWith('tr') || lower(v.name).includes('emel') || lower(v.name).includes('yasemin') || lower(v.name).includes('turkish')) && isFemale(v)
      );
      if (turkicVoice) return turkicVoice;

      const onlineFemaleVoice = voices.find(v => 
        (lower(v.name).includes('natural') || lower(v.name).includes('online') || lower(v.name).includes('google') || lower(v.name).includes('zira') || lower(v.name).includes('jenny') || lower(v.name).includes('aria')) && isFemale(v)
      );
      if (onlineFemaleVoice) return onlineFemaleVoice;
    }

    if (lang === 'ru') {
      const ruVoice = voices.find(v =>
        lower(v.lang).startsWith('ru') &&
        (lower(v.name).includes('natural') || lower(v.name).includes('online') || lower(v.name).includes('svetlana') || lower(v.name).includes('dariya') || lower(v.name).includes('google')) &&
        isFemale(v)
      ) || voices.find(v => lower(v.lang).startsWith('ru') && isFemale(v));
      if (ruVoice) return ruVoice;
    }

    if (lang === 'en') {
      const enVoice = voices.find(v =>
        lower(v.lang).startsWith('en') &&
        (lower(v.name).includes('natural') || lower(v.name).includes('online') || lower(v.name).includes('jenny') || lower(v.name).includes('aria') || lower(v.name).includes('samantha')) &&
        isFemale(v)
      ) || voices.find(v => lower(v.lang).startsWith('en') && isFemale(v));
      if (enVoice) return enVoice;
    }

    return voices.find(v => isFemale(v)) || voices[0] || null;
  }

  private audioCache = new Map<string, Blob>();
  private audioUrlCache = new Map<string, string>();

  private getCacheKey(text: string, lang: Language, speakerId: VoiceSpeakerId): string {
    return `${lang}_${speakerId}_${text.trim()}`;
  }

  /**
   * Preloads audio in background so clicking play speaks INSTANTLY (0ms latency).
   */
  public async preload(rawText: string, speakerId: VoiceSpeakerId = 'Anora', lang: Language = 'uz'): Promise<void> {
    if (!rawText || !rawText.trim()) return;
    const key = this.getCacheKey(rawText, lang, speakerId);
    if (this.audioUrlCache.has(key)) return;

    try {
      const spokenText = optimizePhoneticsForSpeech(rawText, lang);
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: spokenText,
          speakerId,
          lang
        })
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        if (audioBlob && audioBlob.size > 0) {
          this.audioCache.set(key, audioBlob);
          const url = URL.createObjectURL(audioBlob);
          this.audioUrlCache.set(key, url);
        }
      }
    } catch {
      // background preload catch
    }
  }

  /**
   * Speaks using studio-quality Neural TTS (human voice) with instant memory cache
   * and seamless fallback to browser Web Speech API.
   */
  public async speak(
    rawText: string,
    speakerId: VoiceSpeakerId = 'Anora',
    lang: Language = 'uz',
    speedMultiplier: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    this.stop();
    this.isExplicitlyStopped = false;

    // 0. Check Instant Audio Cache First (0ms delay!)
    const cacheKey = this.getCacheKey(rawText, lang, speakerId);
    if (this.audioUrlCache.has(cacheKey)) {
      const cachedUrl = this.audioUrlCache.get(cacheKey)!;
      this.currentAudioUrl = cachedUrl;
      const audio = new Audio(cachedUrl);
      this.currentAudio = audio;
      audio.playbackRate = speedMultiplier;

      audio.onplay = () => {
        if (this.isExplicitlyStopped) {
          this.cleanupAudio();
          return;
        }
        onStart?.();
      };

      audio.onended = () => {
        this.cleanupAudio();
        if (!this.isExplicitlyStopped) {
          onEnd?.();
        }
      };

      audio.onerror = () => {
        this.cleanupAudio();
        if (!this.isExplicitlyStopped) {
          this.speakWithBrowserSynth(rawText, speakerId, lang, speedMultiplier, onStart, onEnd, onError);
        }
      };

      if (!this.isExplicitlyStopped) {
        try {
          await audio.play();
          return;
        } catch {
          // if audio.play was blocked, continue
        }
      }
    }

    // 1. Try Ultra-Realistic Studio Neural TTS API
    try {
      this.abortController = new AbortController();
      const spokenText = optimizePhoneticsForSpeech(rawText, lang);
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: spokenText,
          speakerId,
          lang
        }),
        signal: this.abortController.signal
      });

      if (this.isExplicitlyStopped) return;

      if (res.ok) {
        const audioBlob = await res.blob();
        if (this.isExplicitlyStopped) return;

        if (audioBlob && audioBlob.size > 0) {
          const audioUrl = URL.createObjectURL(audioBlob);
          this.audioCache.set(cacheKey, audioBlob);
          this.audioUrlCache.set(cacheKey, audioUrl);

          if (this.isExplicitlyStopped) {
            return;
          }

          this.currentAudioUrl = audioUrl;
          const audio = new Audio(audioUrl);
          this.currentAudio = audio;
          audio.playbackRate = speedMultiplier;

          audio.onplay = () => {
            if (this.isExplicitlyStopped) {
              this.cleanupAudio();
              return;
            }
            onStart?.();
          };

          audio.onended = () => {
            this.cleanupAudio();
            if (!this.isExplicitlyStopped) {
              onEnd?.();
            }
          };

          audio.onerror = () => {
            this.cleanupAudio();
            if (!this.isExplicitlyStopped) {
              this.speakWithBrowserSynth(rawText, speakerId, lang, speedMultiplier, onStart, onEnd, onError);
            }
          };

          if (this.isExplicitlyStopped) {
            this.cleanupAudio();
            return;
          }

          await audio.play();
          return;
        }
      }
    } catch (err: any) {
      if (this.isExplicitlyStopped) return;
      console.warn('Neural TTS service notice, switching to fallback synth:', err?.message || err);
    }

    if (this.isExplicitlyStopped) return;

    // 2. Fallback to Optimized Browser Speech Synthesis
    this.speakWithBrowserSynth(rawText, speakerId, lang, speedMultiplier, onStart, onEnd, onError);
  }

  private speakWithBrowserSynth(
    rawText: string,
    speakerId: VoiceSpeakerId,
    lang: Language,
    speedMultiplier: number,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth || this.isExplicitlyStopped) {
      onEnd?.();
      return;
    }

    const spokenText = optimizePhoneticsForSpeech(rawText, lang);
    const speaker = VOICE_SPEAKERS.find(s => s.id === speakerId) || VOICE_SPEAKERS[0];
    const utterance = new SpeechSynthesisUtterance(spokenText);

    utterance.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ';

    const femaleVoice = this.getBestFemaleVoice(lang);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.pitch = speaker.pitch;
    utterance.rate = speaker.rate * speedMultiplier;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (this.isExplicitlyStopped) {
        this.synth?.cancel();
        return;
      }
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (!this.isExplicitlyStopped) {
        onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (!this.isExplicitlyStopped) {
        onError?.(e);
        onEnd?.();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private cleanupAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio.onplay = null;
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio = null;
    }
    if (this.currentAudioUrl) {
      try {
        URL.revokeObjectURL(this.currentAudioUrl);
      } catch {}
      this.currentAudioUrl = null;
    }
  }

  public stop() {
    this.isExplicitlyStopped = true;

    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch {}
      this.abortController = null;
    }

    this.cleanupAudio();

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
      this.currentUtterance = null;
    }
  }

  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    } else if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
    } else if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    const isAudioPlaying = !!this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended;
    const isSynthSpeaking = !!this.synth && this.synth.speaking && !this.synth.paused;
    return !this.isExplicitlyStopped && (isAudioPlaying || isSynthSpeaking);
  }

  // Voice Input (Speech-to-Text)
  public startListening(
    lang: Language = 'uz',
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Brauzeringiz ovozli mikrofonni qo\'llab-quvvatlamaydi (Google Chrome tavsiya etiladi).');
      return false;
    }

    try {
      this.recognition.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error || 'Ovozni tanishda xatolik');
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      onError(err.message || 'Mikrofonni ishga tushirib bo\'lmadi');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }
}

export const voiceEngine = new VoiceEngine();
