import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { PRESET_STREAMS } from '../utils/initialData';
import { AudioVisualizer } from './AudioVisualizer';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Radio,
  Sliders,
  Moon,
  Share2,
  Check,
  Disc3,
  Waves,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const TurntablePlayer: React.FC = () => {
  const {
    settings,
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
    listenerCount
  } = useRadio();

  const [copied, setCopied] = useState(false);
  const [showEqModal, setShowEqModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showChannels, setShowChannels] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-[#0d0a1a]/95 border border-purple-500/30 rounded-3xl p-6 lg:p-8 shadow-[0_0_50px_rgba(147,51,234,0.15)] backdrop-blur-xl">
      {/* Decorative neon corner accents */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-purple-600/20 blur-3xl pointer-events-none rounded-full" />

      {/* Top Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-purple-400 animate-ping opacity-75' : 'bg-slate-500'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-purple-500' : 'bg-slate-600'}`} />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">
              {isPlaying ? 'Transmitiendo en Vivo' : 'Radio en Pausa'}
            </span>
            <span className="text-[11px] text-purple-400/70 font-mono">
              {settings.bitrate} · Estéreo HD
            </span>
          </div>
        </div>

        {/* Live listeners and channel switch */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-purple-950/60 border border-purple-500/30 rounded-full flex items-center gap-2 text-xs text-purple-200">
            <Radio size={13} className="text-purple-400 animate-pulse" />
            <span className="font-mono font-medium">{listenerCount.toLocaleString()}</span>
            <span className="text-purple-400/80 hidden sm:inline">oyentes conectados</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowChannels(!showChannels)}
              className="px-3 py-1 bg-[#1a1435] hover:bg-[#231b46] border border-purple-500/40 rounded-full text-xs font-medium text-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Disc3 size={13} className="text-purple-400" />
              <span className="max-w-[120px] truncate">{activeStreamName}</span>
            </button>

            {/* Channels Dropdown */}
            {showChannels && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#140e2b] border border-purple-500/40 rounded-2xl shadow-2xl p-2 z-30">
                <div className="px-3 py-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider border-b border-purple-500/20">
                  Canales de Transmisión
                </div>
                {PRESET_STREAMS.map((st) => (
                  <button
                    key={st.url}
                    onClick={() => {
                      switchStream(st.url, st.name);
                      setShowChannels(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-purple-900/40 transition-colors flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="font-medium text-purple-100">{st.name}</span>
                    <span className="text-[10px] text-purple-400/70 font-mono">{st.genre} · {st.quality}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Turntable & Broadcast Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
        {/* Left / Center: Interactive Turntable */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-3 bg-gradient-to-br from-[#161226] via-[#0d091a] to-[#1a1230] border-2 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.25)] flex items-center justify-center">
            {/* Ambient turntable outer glowing ring */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
                isPlaying ? 'shadow-[0_0_50px_rgba(168,85,247,0.45)] border border-purple-400/60' : ''
              }`}
            />

            {/* Tonearm assembly */}
            <div
              className="absolute top-2 right-2 w-28 h-40 pointer-events-none z-20 origin-top-right transition-transform duration-700 ease-out"
              style={{
                transform: isPlaying ? 'rotate(18deg)' : 'rotate(-14deg)'
              }}
            >
              {/* Tonearm base pivot */}
              <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-purple-400 shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
              </div>
              {/* Tonearm metal rod */}
              <div className="absolute top-6 right-3 w-1.5 h-28 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 rounded-full shadow-md" />
              {/* Cartridge headshell & stylus needle */}
              <div className="absolute top-32 right-1.5 w-4 h-6 bg-purple-600 rounded-sm shadow-md border border-purple-300 flex items-end justify-center pb-0.5">
                <div className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_4px_#67e8f9]" />
              </div>
            </div>

            {/* Vinyl record platter */}
            <div
              className={`relative w-full h-full rounded-full bg-zinc-950 p-2 flex items-center justify-center shadow-2xl transition-transform ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
              }`}
              style={{
                backgroundImage: `
                  radial-gradient(circle, #0b0914 32%, transparent 33%),
                  repeating-radial-gradient(circle, #181528, #181528 2px, #0e0b1c 3px, #0e0b1c 5px)
                `
              }}
            >
              {/* Vinyl grooves shine reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />

              {/* Center Vinyl Label with User's Uploaded Logo */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.7)] bg-black flex items-center justify-center group">
                <img
                  src={settings.logoUrl}
                  alt={settings.stationName}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG if logo path is unreachable
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Center vinyl spindle hole */}
                <div className="absolute w-5 h-5 rounded-full bg-zinc-900 border-2 border-purple-400/80 shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Broadcast Details & Audio Spectrum */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          {/* Station Title & Program */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                Al Aire Ahora
              </span>
              <span className="text-xs text-purple-300/80 font-mono">
                Con {settings.currentDj}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {settings.currentShow}
            </h1>
            <p className="text-sm text-purple-300/70 mt-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-400" />
              <span>{settings.slogan}</span>
            </p>
          </div>

          {/* Marquee Ticker */}
          <div className="bg-[#150f28] border border-purple-500/20 rounded-xl px-4 py-2 overflow-hidden flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider bg-purple-900/60 px-2 py-0.5 rounded shrink-0">
              Noticias
            </span>
            <div className="overflow-hidden whitespace-nowrap w-full">
              <div className="animate-marquee text-xs text-purple-200">
                {settings.marqueeAnnouncement}
              </div>
            </div>
          </div>

          {/* Integrated Frequency Spectrum */}
          <AudioVisualizer frequencyData={frequencyData} isPlaying={isPlaying} />

          {/* Audio Error Banner if any */}
          {audioError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 flex items-center justify-between">
              <span>{audioError}</span>
              <button
                onClick={togglePlay}
                className="px-2 py-1 bg-red-800/60 hover:bg-red-700 rounded text-[11px] font-semibold cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Integrated Controls Bar */}
      <div className="pt-6 border-t border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Play/Pause + Volume Slider Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={audioState === 'loading'}
            aria-label={isPlaying ? 'Pausar transmisión' : 'Reproducir transmisión'}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isPlaying
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.7)] scale-100 hover:scale-105'
                : 'bg-white hover:bg-purple-100 text-purple-950 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105'
            }`}
          >
            {audioState === 'loading' ? (
              <RefreshCw size={24} className="animate-spin text-purple-300" />
            ) : isPlaying ? (
              <Pause size={26} className="fill-current" />
            ) : (
              <Play size={26} className="fill-current ml-1" />
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5 bg-[#17112c] px-4 py-2.5 rounded-2xl border border-purple-500/25">
            <button
              onClick={toggleMute}
              className="text-purple-300 hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} className="text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 sm:w-32 h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              aria-label="Control de volumen"
            />

            <span className="text-xs font-mono font-medium text-purple-200 w-8 text-right">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Secondary Player Tools (EQ, Sleep Timer, Share) */}
        <div className="flex items-center gap-2">
          {/* Equalizer Button */}
          <div className="relative">
            <button
              onClick={() => setShowEqModal(!showEqModal)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                eqPreset !== 'flat'
                  ? 'bg-purple-900/60 border-purple-400 text-purple-200'
                  : 'bg-[#150f28] hover:bg-[#1d1637] border-purple-500/25 text-purple-300'
              }`}
              title="Ecualizador de audio"
            >
              <Sliders size={14} />
              <span className="hidden sm:inline">EQ:</span>
              <span className="capitalize">{eqPreset}</span>
            </button>

            {/* EQ Popover */}
            {showEqModal && (
              <div className="absolute right-0 bottom-full mb-2 w-44 bg-[#160f2e] border border-purple-500/40 rounded-2xl shadow-2xl p-2 z-30">
                <div className="px-3 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Presets de Audio
                </div>
                {[
                  { id: 'flat', label: 'Estándar (Flat)' },
                  { id: 'bass', label: 'Bass Boost 808' },
                  { id: 'club', label: 'Club / Dancefloor' },
                  { id: 'vocal', label: 'Voz & Acústico' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setEqPreset(item.id);
                      setShowEqModal(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      eqPreset === item.id
                        ? 'bg-purple-600 text-white font-medium'
                        : 'text-purple-200 hover:bg-purple-900/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Timer */}
          <div className="relative">
            <button
              onClick={() => setShowSleepModal(!showSleepModal)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                sleepTimerMinutes
                  ? 'bg-indigo-900/60 border-indigo-400 text-indigo-200'
                  : 'bg-[#150f28] hover:bg-[#1d1637] border-purple-500/25 text-purple-300'
              }`}
              title="Temporizador de apagado"
            >
              <Moon size={14} />
              {sleepTimerRemaining ? (
                <span className="font-mono">{formatTimer(sleepTimerRemaining)}</span>
              ) : (
                <span className="hidden sm:inline">Timer</span>
              )}
            </button>

            {/* Sleep Timer Popover */}
            {showSleepModal && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#160f2e] border border-purple-500/40 rounded-2xl shadow-2xl p-2 z-30">
                <div className="px-3 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Apagado Automático
                </div>
                {[
                  { val: null, label: 'Desactivado' },
                  { val: 15, label: 'En 15 minutos' },
                  { val: 30, label: 'En 30 minutos' },
                  { val: 60, label: 'En 1 hora' }
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSleepTimerMinutes(opt.val);
                      setShowSleepModal(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      sleepTimerMinutes === opt.val
                        ? 'bg-purple-600 text-white font-medium'
                        : 'text-purple-200 hover:bg-purple-900/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-3 py-2 bg-[#150f28] hover:bg-[#1d1637] border border-purple-500/25 rounded-xl text-xs font-medium text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Compartir estación"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
