import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { RadioSettings, ShowScheduleItem, ChatMessage, SongRequest } from '../types/radio';
import { INITIAL_SETTINGS, INITIAL_SCHEDULE, INITIAL_CHAT, INITIAL_REQUESTS, PRESET_STREAMS } from '../utils/initialData';

interface RadioContextType {
  settings: RadioSettings;
  updateSettings: (newSettings: Partial<RadioSettings>) => void;
  resetToDefaults: () => void;
  // Audio
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (val: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  eqPreset: string;
  setEqPreset: (preset: string) => void;
  audioState: 'playing' | 'paused' | 'loading' | 'error';
  audioError: string | null;
  frequencyData: number[]; // 0-255 values for 24-32 bars
  switchStream: (url: string, name?: string) => void;
  activeStreamName: string;
  sleepTimerMinutes: number | null;
  setSleepTimerMinutes: (min: number | null) => void;
  sleepTimerRemaining: number | null;
  listenerCount: number;
  isRecording: boolean;
  recordedSnippetUrl: string | null;
  recordSnippet: () => void;
  // Schedule
  schedule: ShowScheduleItem[];
  addScheduleItem: (item: Omit<ShowScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, item: Partial<ShowScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, customName?: string, customAvatar?: string, isRequest?: boolean) => void;
  reactToMessage: (msgId: string, emoji: string) => void;
  deleteChatMessage: (msgId: string) => void;
  clearChat: () => void;
  userProfile: { name: string; avatar: string };
  updateUserProfile: (profile: { name: string; avatar: string }) => void;
  // Requests
  songRequests: SongRequest[];
  submitSongRequest: (req: { userName: string; songTitle: string; artist: string; dedication?: string }) => void;
  updateRequestStatus: (id: string, status: SongRequest['status']) => void;
  deleteSongRequest: (id: string) => void;
  // Admin
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
}

const RadioContext = createContext<RadioContextType | null>(null);

const STORAGE_KEYS = {
  SETTINGS: 'im_radio_settings_v1',
  SCHEDULE: 'im_radio_schedule_v1',
  CHAT: 'im_radio_chat_v1',
  REQUESTS: 'im_radio_requests_v1',
  USER_PROFILE: 'im_radio_user_v1'
};

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings state
  const [settings, setSettings] = useState<RadioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  const [activeStreamName, setActiveStreamName] = useState("Transmisión Principal");

  // 2. Schedule state
  const [schedule, setSchedule] = useState<ShowScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SCHEDULE;
  });

  // 3. Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CHAT;
  });

  // 4. Requests state
  const [songRequests, setSongRequests] = useState<SongRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REQUESTS;
  });

  // 5. User profile
  const [userProfile, setUserProfile] = useState<{ name: string; avatar: string }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { name: `Oyente_${Math.floor(100 + Math.random() * 900)}`, avatar: '🎧' };
  });

  // 6. Admin auth state (session based)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // 7. Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [eqPreset, setEqPreset] = useState('flat');
  const [audioState, setAudioState] = useState<'playing' | 'paused' | 'loading' | 'error'>('paused');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [listenerCount, setListenerCount] = useState(1340);

  // Frequency data for visualizer (32 bars)
  const [frequencyData, setFrequencyData] = useState<number[]>(() => Array(32).fill(10));

  // Sleep timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSnippetUrl, setRecordedSnippetUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Audio HTML Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const prevVolumeRef = useRef(0.85);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    } catch {
      // ignore
    }
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch {
      // ignore
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(songRequests));
    } catch {
      // ignore
    }
  }, [songRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  // Dynamic listener count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next < 850 ? 890 : next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Sleep timer interval
  useEffect(() => {
    if (!sleepTimerMinutes) {
      setSleepTimerRemaining(null);
      return;
    }
    setSleepTimerRemaining(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Timer finished: Pause audio
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            setAudioState('paused');
          }
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes]);

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audio.volume = volume;
    audioRef.current = audio;

    const handlePlay = () => {
      setAudioState('playing');
      setIsPlaying(true);
      setAudioError(null);
    };

    const handlePause = () => {
      setAudioState('paused');
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setAudioState('loading');
    };

    const handleError = () => {
      console.warn("Audio element error on stream:", audio.src);
      // Try fallback if primary fails
      if (audio.src === settings.streamUrl && settings.fallbackStreamUrl) {
        setAudioError("Conectando con señal de respaldo...");
        audio.src = settings.fallbackStreamUrl;
        audio.play().catch(() => {
          setAudioState('error');
          setAudioError("No se pudo conectar al servidor de streaming. Revisa tu conexión.");
        });
      } else {
        setAudioState('error');
        setAudioError("Error al cargar la transmisión en vivo. Intenta nuevamente.");
      }
    };

    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [settings.streamUrl, settings.fallbackStreamUrl]);

  // Equalizer & Frequency Animation Loop
  useEffect(() => {
    let phase = 0;
    const updateFrequencyVisualizer = () => {
      if (isPlaying) {
        phase += 0.12;
        // Generate energetic organic rhythm bars matching music BPM (approx 128 bpm)
        const bars: number[] = [];
        const bassMultiplier = eqPreset === 'bass' ? 1.4 : eqPreset === 'club' ? 1.3 : 1.0;
        const trebleMultiplier = eqPreset === 'vocal' ? 1.3 : 1.0;

        for (let i = 0; i < 32; i++) {
          const normIdx = i / 32;
          const wave1 = Math.sin(phase * 1.5 + normIdx * 6) * 45;
          const wave2 = Math.cos(phase * 2.2 + normIdx * 10) * 35;
          const wave3 = Math.sin(phase * 0.8 + normIdx * 3) * 60;
          const noise = (Math.random() - 0.5) * 20;

          let val = 70 + wave1 + wave2 + wave3 + noise;
          // Shape low frequencies (bass) on the left
          if (i < 8) {
            val *= bassMultiplier * 1.15;
          } else if (i > 22) {
            val *= trebleMultiplier;
          }

          // Bound 15 to 255
          val = Math.max(18, Math.min(255, val * (volume || 0.6)));
          bars.push(Math.round(val));
        }
        setFrequencyData(bars);
      } else {
        // Flat resting visualizer
        setFrequencyData((prev) =>
          prev.map((val) => Math.max(8, val * 0.9))
        );
      }
      animationFrameRef.current = requestAnimationFrame(updateFrequencyVisualizer);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrequencyVisualizer);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, volume, eqPreset]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setAudioState('loading');
      setAudioError(null);
      // Ensure source is set
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        audioRef.current.src = settings.streamUrl;
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioState('playing');
        })
        .catch((err) => {
          console.warn("Play error, attempting with cache-busting timestamp:", err);
          const cacheBuster = settings.streamUrl.includes('?')
            ? `${settings.streamUrl}&t=${Date.now()}`
            : `${settings.streamUrl}?t=${Date.now()}`;
          if (audioRef.current) {
            audioRef.current.src = cacheBuster;
            audioRef.current.play().catch(() => {
              setAudioState('error');
              setAudioError("Haz clic en reproducir nuevamente para iniciar el audio en vivo.");
            });
          }
        });
    }
  }, [isPlaying, settings.streamUrl]);

  // Volume slider
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      const restore = prevVolumeRef.current || 0.7;
      setVolumeState(restore);
      if (audioRef.current) audioRef.current.volume = restore;
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
      setVolumeState(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  }, [isMuted, volume]);

  // Switch Stream channel
  const switchStream = useCallback((url: string, name?: string) => {
    if (name) setActiveStreamName(name);
    setAudioState('loading');
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioState('playing');
      }).catch((err) => {
        console.warn("Failed to switch stream:", err);
        setAudioState('error');
        setAudioError("No se pudo reproducir este canal. Probando canal principal.");
      });
    }
  }, []);

  // Record 10s audio snippet
  const recordSnippet = useCallback(() => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordedSnippetUrl(null);

    // If Web Audio media stream can capture, or synthesize demo snippet
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const actx = new AudioCtx();
      const dest = actx.createMediaStreamDestination();
      
      // Create a nice radio snippet memo
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(dest);
      osc.start();

      const recorder = new MediaRecorder(dest.stream);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedSnippetUrl(url);
        setIsRecording(false);
        osc.stop();
        actx.close();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 7000);
    } catch {
      setIsRecording(false);
    }
  }, [isRecording]);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<RadioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(INITIAL_SETTINGS);
    setSchedule(INITIAL_SCHEDULE);
  }, []);

  // Schedule operations
  const addScheduleItem = useCallback((item: Omit<ShowScheduleItem, 'id'>) => {
    const newItem: ShowScheduleItem = {
      ...item,
      id: `show-${Date.now()}`
    };
    setSchedule((prev) => [...prev, newItem]);
  }, []);

  const updateScheduleItem = useCallback((id: string, updated: Partial<ShowScheduleItem>) => {
    setSchedule((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  }, []);

  const deleteScheduleItem = useCallback((id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Chat operations
  const sendChatMessage = useCallback((text: string, customName?: string, customAvatar?: string, isRequest = false) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userName: customName || userProfile.name,
      userAvatar: customAvatar || userProfile.avatar,
      text: text.trim(),
      timestamp: timeStr,
      isStaff: isAdminAuthenticated,
      isAdmin: isAdminAuthenticated,
      isSongRequest: isRequest,
      reactions: {}
    };

    setChatMessages((prev) => [...prev, newMsg]);
  }, [userProfile, isAdminAuthenticated]);

  const reactToMessage = useCallback((msgId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const currentReactions = { ...(msg.reactions || {}) };
        currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
        return { ...msg, reactions: currentReactions };
      })
    );
  }, []);

  const deleteChatMessage = useCallback((msgId: string) => {
    setChatMessages((prev) => prev.filter((msg) => msg.id !== msgId));
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Song Requests
  const submitSongRequest = useCallback((req: { userName: string; songTitle: string; artist: string; dedication?: string }) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newReq: SongRequest = {
      id: `req-${Date.now()}`,
      userName: req.userName,
      songTitle: req.songTitle,
      artist: req.artist,
      dedication: req.dedication,
      timestamp: timeStr,
      status: 'pendiente'
    };
    setSongRequests((prev) => [newReq, ...prev]);

    // Also notify in live chat
    sendChatMessage(
      `🎵 Pedido de canción: "${req.songTitle}" - ${req.artist}${req.dedication ? ` (${req.dedication})` : ''}`,
      req.userName,
      '🎶',
      true
    );
  }, [sendChatMessage]);

  const updateRequestStatus = useCallback((id: string, status: SongRequest['status']) => {
    setSongRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  }, []);

  const deleteSongRequest = useCallback((id: string) => {
    setSongRequests((prev) => prev.filter((req) => req.id !== id));
  }, []);

  // Admin authentication
  const adminLogin = useCallback((password: string): boolean => {
    if (password === settings.adminPasswordHash) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  }, [settings.adminPasswordHash]);

  const adminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
  }, []);

  const changeAdminPassword = useCallback((oldPass: string, newPass: string): boolean => {
    if (oldPass === settings.adminPasswordHash && newPass.trim().length >= 4) {
      updateSettings({ adminPasswordHash: newPass.trim() });
      return true;
    }
    return false;
  }, [settings.adminPasswordHash, updateSettings]);

  return (
    <RadioContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefaults,
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        eqPreset,
        setEqPreset,
        audioState,
        audioError,
        frequencyData,
        switchStream,
        activeStreamName,
        sleepTimerMinutes,
        setSleepTimerMinutes,
        sleepTimerRemaining,
        listenerCount,
        isRecording,
        recordedSnippetUrl,
        recordSnippet,
        schedule,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        chatMessages,
        sendChatMessage,
        reactToMessage,
        deleteChatMessage,
        clearChat,
        userProfile,
        updateUserProfile: setUserProfile,
        songRequests,
        submitSongRequest,
        updateRequestStatus,
        deleteSongRequest,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        changeAdminPassword
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
