import React, { useState } from 'react';
import { soundEffects } from '../utils/soundEffects';
import { Volume2, Sparkles, Disc, Radio, Users, Zap } from 'lucide-react';

export const DJSoundboard: React.FC = () => {
  const [activePad, setActivePad] = useState<string | null>(null);

  const triggerEffect = (name: string, fn: () => void) => {
    setActivePad(name);
    try {
      fn();
    } catch (e) {
      console.warn("Soundboard trigger error:", e);
    }
    setTimeout(() => setActivePad(null), 300);
  };

  const pads = [
    {
      id: 'airhorn',
      name: 'Air Horn',
      label: 'BOCINA DJ',
      icon: Volume2,
      color: 'from-purple-600 to-indigo-600',
      action: () => soundEffects.playAirHorn()
    },
    {
      id: 'scratch',
      name: 'Vinyl Scratch',
      label: 'SCRATCH',
      icon: Disc,
      color: 'from-violet-600 to-pink-600',
      action: () => soundEffects.playScratch()
    },
    {
      id: 'laser',
      name: 'Laser Zap',
      label: 'LÁSER DROP',
      icon: Zap,
      color: 'from-cyan-600 to-purple-600',
      action: () => soundEffects.playLaser()
    },
    {
      id: 'bass',
      name: '808 Bass Drop',
      label: 'SUB IMPACT',
      icon: Sparkles,
      color: 'from-fuchsia-600 to-purple-800',
      action: () => soundEffects.playBassDrop()
    },
    {
      id: 'radio_id',
      name: 'Radio Chime',
      label: 'I´M RADIO ID',
      icon: Radio,
      color: 'from-purple-700 to-violet-900',
      action: () => soundEffects.playRadioID()
    },
    {
      id: 'crowd',
      name: 'Crowd Cheer',
      label: 'APLAUSOS',
      icon: Users,
      color: 'from-pink-600 to-rose-700',
      action: () => soundEffects.playCrowdCheer()
    }
  ];

  return (
    <div className="bg-[#120e22]/90 border border-purple-500/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <h3 className="text-sm font-semibold tracking-wide text-purple-200 uppercase">
            Efectos de Cabina & Jingles
          </h3>
        </div>
        <span className="text-[11px] font-mono text-purple-300/60">Audio FX en Vivo</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {pads.map((pad) => {
          const Icon = pad.icon;
          const isActive = activePad === pad.id;

          return (
            <button
              key={pad.id}
              onClick={() => triggerEffect(pad.id, pad.action)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'scale-95 bg-purple-500 text-white border-white shadow-[0_0_20px_rgba(168,85,247,0.8)]'
                  : 'bg-[#18132d] hover:bg-[#20193c] text-purple-200 border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 bg-gradient-to-br ${pad.color} text-white shadow-md`}>
                <Icon size={16} />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-center leading-tight">
                {pad.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
