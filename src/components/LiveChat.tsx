import React, { useState, useRef, useEffect } from 'react';
import { useRadio } from '../context/RadioContext';
import {
  Send,
  Music,
  Smile,
  ShieldAlert,
  Trash2,
  User,
  Users,
  Radio,
  Flame,
  Heart,
  Headphones
} from 'lucide-react';

interface LiveChatProps {
  onOpenSongRequest: () => void;
}

const AVATAR_OPTIONS = ['🎧', '⚡', '💃', '🕺', '🔥', '🎵', '🚀', '💜', '😎', '🔊'];

export const LiveChat: React.FC<LiveChatProps> = ({ onOpenSongRequest }) => {
  const {
    settings,
    chatMessages,
    sendChatMessage,
    reactToMessage,
    deleteChatMessage,
    clearChat,
    userProfile,
    updateUserProfile,
    listenerCount,
    isAdminAuthenticated
  } = useRadio();

  const [inputVal, setInputVal] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateUserProfile({ name: tempName.trim(), avatar: tempAvatar });
      setShowProfileModal(false);
    }
  };

  const quickEmojis = ['🔥', '💜', '🎧', '🎵', '⚡', '🚀', '💃', '👏'];

  return (
    <div className="bg-[#0f0c1e]/95 border border-purple-500/25 rounded-3xl p-5 flex flex-col h-[580px] shadow-2xl backdrop-blur-xl relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Radio size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Chat de Oyentes en Vivo
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300/70 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{listenerCount} sintonizando</span>
            </div>
          </div>
        </div>

        {/* Change profile button */}
        <button
          onClick={() => {
            setTempName(userProfile.name);
            setTempAvatar(userProfile.avatar);
            setShowProfileModal(true);
          }}
          className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Cambiar mi nombre y avatar"
        >
          <span className="text-base">{userProfile.avatar}</span>
          <span className="max-w-[80px] truncate font-medium">{userProfile.name}</span>
        </button>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 rounded-3xl p-6 flex flex-col justify-center items-center">
          <form onSubmit={handleSaveProfile} className="w-full max-w-sm bg-[#16102c] border border-purple-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white text-center">
              Personaliza tu Perfil en el Chat
            </h3>

            <div>
              <label className="text-xs text-purple-300/80 block mb-1">Tu Nombre / Apodo:</label>
              <input
                type="text"
                maxLength={20}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-[#0d091b] border border-purple-500/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                placeholder="Ej. Alex_Beats"
                required
              />
            </div>

            <div>
              <label className="text-xs text-purple-300/80 block mb-1.5">Elige tu Avatar:</label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setTempAvatar(av)}
                    className={`h-10 rounded-xl flex items-center justify-center text-xl transition-transform cursor-pointer ${
                      tempAvatar === av
                        ? 'bg-purple-600 scale-110 shadow-lg border-2 border-white'
                        : 'bg-[#0d091b] hover:bg-purple-950/80 border border-purple-500/20'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-bold cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-purple-300/60">
            <Smile size={32} className="mb-2 text-purple-400 opacity-60" />
            <p className="text-xs">¡Sé el primero en enviar un saludo a la radio!</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`group flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                msg.isStaff
                  ? 'bg-purple-950/40 border border-purple-500/30'
                  : msg.isSongRequest
                  ? 'bg-indigo-950/30 border border-indigo-500/25'
                  : 'hover:bg-purple-950/20'
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5 select-none">{msg.userAvatar}</span>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-semibold truncate ${msg.isStaff ? 'text-purple-300 font-bold' : 'text-slate-200'}`}>
                    {msg.userName}
                  </span>
                  {msg.isStaff && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-300 border border-purple-400/50">
                      Staff DJ
                    </span>
                  )}
                  {msg.isSongRequest && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/50">
                      Pedido
                    </span>
                  )}
                  <span className="text-[10px] text-purple-400/50 font-mono ml-auto">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs text-purple-100/90 leading-relaxed break-words">
                  {msg.text}
                </p>

                {/* Message reactions & action triggers */}
                <div className="flex items-center gap-2 mt-1.5">
                  {/* Reaction chips */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-1">
                      {Object.entries(msg.reactions).map(([emo, count]) => (
                        <button
                          key={emo}
                          onClick={() => reactToMessage(msg.id, emo)}
                          className="px-1.5 py-0.5 rounded-full bg-[#1e1738] border border-purple-500/20 text-[10px] text-purple-200 flex items-center gap-1 hover:border-purple-400 cursor-pointer"
                        >
                          <span>{emo}</span>
                          <span className="font-mono">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick react icon button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {['💜', '🔥', '👏'].map((emo) => (
                      <button
                        key={emo}
                        onClick={() => reactToMessage(msg.id, emo)}
                        className="text-xs hover:scale-125 transition-transform cursor-pointer"
                      >
                        {emo}
                      </button>
                    ))}

                    {/* Admin delete button */}
                    {isAdminAuthenticated && (
                      <button
                        onClick={() => deleteChatMessage(msg.id)}
                        className="ml-2 text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                        title="Borrar mensaje (Admin)"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis & Request Shortcut */}
      <div className="pt-2 pb-2 flex items-center justify-between gap-1 border-t border-purple-500/20">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setInputVal((prev) => `${prev} ${emoji}`.trim())}
              className="text-sm px-1.5 py-0.5 hover:bg-purple-900/40 rounded-lg transition-transform hover:scale-110 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenSongRequest}
          className="shrink-0 px-2.5 py-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer transition-transform hover:scale-105"
        >
          <Music size={12} />
          <span>Pedir Canción</span>
        </button>
      </div>

      {/* Input box */}
      {settings.chatEnabled ? (
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Escribe un mensaje para la radio..."
            maxLength={220}
            className="flex-1 bg-[#16102a] border border-purple-500/30 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send size={15} />
          </button>
        </form>
      ) : (
        <div className="p-3 bg-zinc-900/80 rounded-2xl text-center text-xs text-zinc-400">
          El chat está temporalmente pausado por el moderador.
        </div>
      )}
    </div>
  );
};
