import React from 'react';
import { useRadio } from '../context/RadioContext';
import { Radio, MessageCircle, Instagram, ShieldCheck, Mail, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings } = useRadio();

  const cleanWhatsappNumber = settings.socials.whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="mt-20 border-t border-purple-500/20 bg-[#07050d] text-purple-300/70 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-500/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-500/50 shadow-md">
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide block">
                {settings.stationName}
              </span>
              <span className="text-xs text-purple-400 font-mono">
                Transmisión Digital en Vivo 24/7 · HD Audio
              </span>
            </div>
          </div>

          {/* Socials / Direct Channels */}
          <div className="flex items-center gap-3">
            {cleanWhatsappNumber && (
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Hola%20I'M%20Music%20Radio,%20les%20escribo%20desde%20la%20web!`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#141d1a] border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold flex items-center gap-2 hover:bg-[#1b2723] transition-colors"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Cabina</span>
              </a>
            )}

            {settings.socials.instagram && (
              <a
                href={settings.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
            )}

            {settings.socials.email && (
              <a
                href={`mailto:${settings.socials.email}`}
                className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
                title="Correo"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/50 gap-4">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} {settings.stationName}. Todos los derechos reservados.</span>
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck size={13} />
              <span>Acceso Administrador</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
