import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { ShowScheduleItem } from '../types/radio';
import { Calendar, Clock, User, Disc, Radio, Sparkles } from 'lucide-react';

const DAYS_OF_WEEK = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ScheduleView: React.FC = () => {
  const { schedule, settings } = useRadio();
  const [selectedDay, setSelectedDay] = useState('Todos');

  const filteredSchedule = schedule.filter((item) => {
    if (selectedDay === 'Todos') return true;
    return item.days.includes(selectedDay);
  });

  return (
    <div className="space-y-6">
      {/* Header and Day Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={18} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Parrilla de Programación
            </h2>
          </div>
          <p className="text-xs text-purple-300/70">
            Conoce los programas en vivo, horarios y tus locutores y DJs favoritos
          </p>
        </div>

        {/* Day Pills / Filter bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 bg-[#120e24] p-1 rounded-2xl border border-purple-500/20">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-purple-300/80 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Shows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedule.map((item) => {
          const isCurrentlyAir = item.title.toLowerCase() === settings.currentShow.toLowerCase();

          return (
            <div
              key={item.id}
              className={`relative rounded-3xl p-5 border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isCurrentlyAir
                  ? 'bg-gradient-to-br from-purple-950/70 via-[#181132] to-[#140e29] border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
                  : 'bg-[#110d22]/90 border-purple-500/20 hover:border-purple-400/40 hover:bg-[#16112d]'
              }`}
            >
              {/* Highlight if on air */}
              {isCurrentlyAir && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>En Vivo Ahora</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-300">
                  <Clock size={13} className="text-purple-400" />
                  <span>{item.startTime} - {item.endTime}</span>
                  <span className="text-purple-500">·</span>
                  <span className="text-purple-400/70 truncate">{item.genre}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-purple-200/70 mb-4 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300 text-xs font-bold">
                    <User size={13} />
                  </div>
                  <span className="text-xs font-semibold text-purple-200">
                    {item.djName}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {item.days.map((d) => (
                    <span
                      key={d}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-500/20 text-purple-300"
                    >
                      {d.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
