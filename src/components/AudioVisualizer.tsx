import React from 'react';

interface AudioVisualizerProps {
  frequencyData: number[];
  isPlaying: boolean;
  accentColor?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  frequencyData,
  isPlaying,
  accentColor = '#a855f7'
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full h-14 bg-[#120f1e]/80 rounded-xl p-2.5 flex items-end justify-between gap-[3px] border border-purple-500/20 shadow-inner overflow-hidden relative">
        {/* Ambient background glow inside visualizer */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-500"
          style={{
            background: isPlaying
              ? `radial-gradient(circle at 50% 100%, ${accentColor} 0%, transparent 70%)`
              : 'transparent'
          }}
        />

        {frequencyData.slice(0, 28).map((val, idx) => {
          // Normalize height between 8% and 98%
          const heightPct = isPlaying ? Math.max(8, Math.min(98, (val / 255) * 100)) : 8;
          // Gradient based on frequency range
          const isBass = idx < 6;
          const isMid = idx >= 6 && idx < 20;

          return (
            <div
              key={idx}
              className="flex-1 rounded-t-sm transition-all duration-75 relative group"
              style={{
                height: `${heightPct}%`,
                background: isBass
                  ? 'linear-gradient(to top, #7e22ce, #c084fc)'
                  : isMid
                  ? 'linear-gradient(to top, #9333ea, #e879f9)'
                  : 'linear-gradient(to top, #a855f7, #67e8f9)',
                boxShadow: isPlaying && heightPct > 40
                  ? `0 0 8px ${isBass ? '#a855f7' : '#c084fc'}`
                  : 'none'
              }}
            >
              {/* Peak cap */}
              {isPlaying && heightPct > 20 && (
                <div 
                  className="absolute -top-1 left-0 right-0 h-[2px] bg-white/90 rounded-full"
                  style={{ boxShadow: '0 0 4px #ffffff' }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Audio spectrum labels */}
      <div className="w-full flex justify-between text-[10px] text-purple-300/50 font-mono px-1">
        <span>30 Hz (Sub)</span>
        <span>250 Hz (Bass)</span>
        <span>2 kHz (Vocals)</span>
        <span>16 kHz (Air)</span>
      </div>
    </div>
  );
};
