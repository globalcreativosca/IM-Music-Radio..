import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { X, Music2, Heart, CheckCircle2 } from 'lucide-react';

interface SongRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SongRequestModal: React.FC<SongRequestModalProps> = ({ isOpen, onClose }) => {
  const { submitSongRequest, userProfile } = useRadio();

  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [userName, setUserName] = useState(userProfile.name);
  const [dedication, setDedication] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !artist.trim()) return;

    submitSongRequest({
      userName: userName.trim() || userProfile.name,
      songTitle: songTitle.trim(),
      artist: artist.trim(),
      dedication: dedication.trim() || undefined
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSongTitle('');
      setArtist('');
      setDedication('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#130d26] border border-purple-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(168,85,247,0.35)] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-purple-300 hover:text-white p-1 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">¡Petición Enviada con Éxito!</h3>
            <p className="text-xs text-purple-200/80 max-w-xs">
              Tu pedido de <strong className="text-purple-300">"{songTitle}"</strong> ha llegado a la cabina de DJ Iván y pronto saldrá al aire en I´M Music Radio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-purple-500/20">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300">
                <Music2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pide tu Canción</h3>
                <p className="text-xs text-purple-300/70">
                  Dedicaciones y temas favoritos para la transmisión
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-purple-200 block mb-1">
                Título de la Canción *
              </label>
              <input
                type="text"
                required
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="Ej. Titanium, The Business, Pepas..."
                className="w-full bg-[#1b1435] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-purple-200 block mb-1">
                Artista / Banda *
              </label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ej. David Guetta, Calvin Harris, Tiësto..."
                className="w-full bg-[#1b1435] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-purple-200 block mb-1">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre o apodo"
                  className="w-full bg-[#1b1435] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-purple-200 block mb-1">
                  Dedicación (Opcional)
                </label>
                <input
                  type="text"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="Para mis amigos, mi pareja..."
                  className="w-full bg-[#1b1435] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <p className="text-[11px] text-purple-300/60 italic flex items-center gap-1.5">
              <Heart size={12} className="text-pink-400" />
              <span>El DJ leerá tu dedicatoria en vivo durante el programa.</span>
            </p>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Enviar a Cabina
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
