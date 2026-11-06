import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Shield, Radio, KeyRound } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenSongRequest: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenSongRequest,
  onScrollToSection
}) => {
  const { settings, isPlaying, isAdminAuthenticated } = useRadio();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090712]/90 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Logo */}
        <div 
          onClick={() => onScrollToSection('player')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
              {settings.stationName}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="uppercase tracking-widest">{isPlaying ? 'En Vivo' : 'Radio'}</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-purple-200/80">
          <button
            onClick={() => onScrollToSection('player')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            En Vivo
          </button>
          <button
            onClick={() => onScrollToSection('schedule')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Programación
          </button>
          <button
            onClick={() => onScrollToSection('chat')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Chat de Oyentes
          </button>
          <button
            onClick={onOpenSongRequest}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Pedir Canción
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Admin Access) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              isAdminAuthenticated
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#181132] hover:bg-[#231849] text-purple-200 border border-purple-500/40 hover:border-purple-400 hover:text-white'
            }`}
          >
            {isAdminAuthenticated ? <Shield size={14} /> : <KeyRound size={14} />}
            <span>{isAdminAuthenticated ? 'Admin Activo' : 'Acceso Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
