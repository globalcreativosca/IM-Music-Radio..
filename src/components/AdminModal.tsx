import React, { useState } from 'react';
import { useRadio } from '../context/RadioContext';
import { ShowScheduleItem } from '../types/radio';
import { soundEffects } from '../utils/soundEffects';
import {
  X,
  Lock,
  Unlock,
  Radio,
  Sliders,
  Calendar,
  MessageSquare,
  Music,
  Shield,
  Save,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Volume2
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSettings,
    resetToDefaults,
    schedule,
    addScheduleItem,
    deleteScheduleItem,
    songRequests,
    updateRequestStatus,
    deleteSongRequest,
    chatMessages,
    deleteChatMessage,
    clearChat,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    changeAdminPassword
  } = useRadio();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    'stream' | 'station' | 'schedule' | 'requests' | 'chat' | 'security'
  >('stream');

  // Form states for general settings
  const [formData, setFormData] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  // New program state
  const [newShow, setNewShow] = useState({
    title: '',
    djName: '',
    days: ['Lunes', 'Miércoles', 'Viernes'],
    startTime: '16:00',
    endTime: '18:00',
    description: '',
    genre: 'Música Electrónica / Pop'
  });
  const [showNewProgramForm, setShowNewProgramForm] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (success) {
      setLoginError(false);
      setPasswordInput('');
      setFormData(settings);
    } else {
      setLoginError(true);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPass !== confirmPass) {
      setPassError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPass.length < 4) {
      setPassError('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }

    const success = changeAdminPassword(oldPass, newPass);
    if (success) {
      setPassSuccess(true);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSuccess(false), 3000);
    } else {
      setPassError('La contraseña actual es incorrecta');
    }
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShow.title || !newShow.djName) return;
    addScheduleItem({
      title: newShow.title,
      djName: newShow.djName,
      days: newShow.days,
      startTime: newShow.startTime,
      endTime: newShow.endTime,
      description: newShow.description,
      genre: newShow.genre,
      coverColor: 'from-purple-600/30 to-indigo-600/30'
    });
    setNewShow({
      title: '',
      djName: '',
      days: ['Lunes', 'Miércoles', 'Viernes'],
      startTime: '16:00',
      endTime: '18:00',
      description: '',
      genre: 'Música Electrónica / Pop'
    });
    setShowNewProgramForm(false);
  };

  const daysList = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0f0c1e] border border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#140e29]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Panel de Administración</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  I´M Music Radio
                </span>
              </h2>
              <p className="text-xs text-purple-300/60">
                {isAdminAuthenticated ? 'Sesión de Administrador Activa' : 'Acceso Restringido con Contraseña'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-xs font-semibold text-red-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAdminAuthenticated ? (
          /* Password Authentication Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border-2 border-purple-400/60 flex items-center justify-center text-purple-300 mb-4 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <Lock size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Ingreso al Administrador
            </h3>
            <p className="text-xs text-purple-300/70 mb-6">
              Ingresa la contraseña de control para cambiar los enlaces de streaming, locutores, noticias, parrilla y moderación.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="Introduce la contraseña"
                  className="w-full bg-[#181133] border border-purple-500/40 rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>Contraseña incorrecta. Intenta nuevamente.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Desbloquear Dashboard
              </button>

              <div className="pt-2">
                <span className="text-[11px] text-purple-300/50">
                  Contraseña de demostración: <strong className="text-purple-300 font-mono">admin123</strong>
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Management Tabs */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Tabs Sidebar */}
            <div className="w-full md:w-56 bg-[#120e26] border-b md:border-b-0 md:border-r border-purple-500/20 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              {[
                { id: 'stream', label: 'Transmisión & Audio', icon: Radio },
                { id: 'station', label: 'Estación & En Vivo', icon: Sliders },
                { id: 'schedule', label: 'Parrilla Semanal', icon: Calendar },
                { id: 'requests', label: 'Peticiones de Canción', icon: Music, badge: songRequests.filter(r => r.status === 'pendiente').length },
                { id: 'chat', label: 'Chat & Moderación', icon: MessageSquare },
                { id: 'security', label: 'Seguridad / Password', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-purple-300/80 hover:text-white hover:bg-purple-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="mt-auto hidden md:block pt-4 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="w-full px-3 py-2 rounded-xl text-[11px] text-purple-400 hover:text-purple-200 hover:bg-purple-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Restablecer Valores</span>
                </button>
              </div>
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              {/* TAB 1: Transmisión & Audio */}
              {activeTab === 'stream' && (
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="border-b border-purple-500/20 pb-3">
                    <h3 className="text-base font-bold text-white">Configuración del Servidor de Streaming</h3>
                    <p className="text-xs text-purple-300/70">
                      Configura el enlace de transmisión en vivo (Icecast, Shoutcast, MP3, AAC o HLS).
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-200 block mb-1.5">
                      URL del Stream Principal (En Vivo) *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.streamUrl}
                      onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                      placeholder="https://servidor.radio.com:8000/live.mp3"
                      className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                    />
                    <span className="text-[11px] text-purple-400/60 mt-1 block">
                      Acepta cualquier streaming HTTPS compatible con HTML5 Audio.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-200 block mb-1.5">
                      URL del Stream de Respaldo (Backup)
                    </label>
                    <input
                      type="url"
                      value={formData.fallbackStreamUrl}
                      onChange={(e) => setFormData({ ...formData, fallbackStreamUrl: e.target.value })}
                      placeholder="https://servidor2.radio.com:8000/backup.mp3"
                      className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-1.5">
                        Bitrate de Calidad
                      </label>
                      <select
                        value={formData.bitrate}
                        onChange={(e) => setFormData({ ...formData, bitrate: e.target.value })}
                        className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="320 kbps HD">320 kbps HD (Máxima Fidelidad)</option>
                        <option value="192 kbps HQ">192 kbps HQ</option>
                        <option value="128 kbps Standard">128 kbps Estándar</option>
                        <option value="64 kbps AAC">64 kbps AAC+ Móvil</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-1.5">
                        Probar Sonido de Transmisión
                      </label>
                      <button
                        type="button"
                        onClick={() => soundEffects.playRadioID()}
                        className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/40 rounded-xl text-xs font-semibold text-purple-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Volume2 size={15} />
                        <span>Sonar Tono de Estación</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-purple-500/20">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle size={15} />
                        <span>¡Ajustes de transmisión guardados!</span>
                      </span>
                    )}
                    <button
                      type="submit"
                      className="ml-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Save size={14} />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Estación & En Vivo */}
              {activeTab === 'station' && (
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="border-b border-purple-500/20 pb-3">
                    <h3 className="text-base font-bold text-white">Identidad de la Radio y Cabina en Vivo</h3>
                    <p className="text-xs text-purple-300/70">
                      Actualiza el locutor al aire, nombre del show, eslogan y cintillo de noticias.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-1">
                        Nombre de la Radio
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.stationName}
                        onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                        className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-1">
                        Slogan de la Estación
                      </label>
                      <input
                        type="text"
                        value={formData.slogan}
                        onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                        className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-1">
                        DJ / Locutor al Aire
                      </label>
                      <input
                        type="text"
                        value={formData.currentDj}
                        onChange={(e) => setFormData({ ...formData, currentDj: e.target.value })}
                        className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-200 block mb-1">
                        Programa Actual
                      </label>
                      <input
                        type="text"
                        value={formData.currentShow}
                        onChange={(e) => setFormData({ ...formData, currentShow: e.target.value })}
                        className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-200 block mb-1">
                      Cintillo de Anuncios y Noticias (Marquee Ticker)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.marqueeAnnouncement}
                      onChange={(e) => setFormData({ ...formData, marqueeAnnouncement: e.target.value })}
                      className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-purple-200 mb-2">Redes Sociales & Contacto Directo</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-purple-300/80 block mb-1">WhatsApp de Cabina</label>
                        <input
                          type="text"
                          value={formData.socials.whatsapp}
                          onChange={(e) => setFormData({
                            ...formData,
                            socials: { ...formData.socials, whatsapp: e.target.value }
                          })}
                          className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-purple-300/80 block mb-1">Instagram</label>
                        <input
                          type="text"
                          value={formData.socials.instagram}
                          onChange={(e) => setFormData({
                            ...formData,
                            socials: { ...formData.socials, instagram: e.target.value }
                          })}
                          className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-purple-300/80 block mb-1">TikTok / Redes</label>
                        <input
                          type="text"
                          value={formData.socials.tiktok}
                          onChange={(e) => setFormData({
                            ...formData,
                            socials: { ...formData.socials, tiktok: e.target.value }
                          })}
                          className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-purple-500/20">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle size={15} />
                        <span>¡Información de estación actualizada!</span>
                      </span>
                    )}
                    <button
                      type="submit"
                      className="ml-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Save size={14} />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Parrilla Semanal */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">Programación Semanal</h3>
                      <p className="text-xs text-purple-300/70">
                        Agrega o elimina los programas y shows de la radio.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewProgramForm(!showNewProgramForm)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{showNewProgramForm ? 'Cerrar Formulario' : 'Nuevo Programa'}</span>
                    </button>
                  </div>

                  {showNewProgramForm && (
                    <form onSubmit={handleCreateProgram} className="bg-[#171133] p-4 rounded-2xl border border-purple-500/30 space-y-3">
                      <h4 className="text-xs font-bold text-purple-200 uppercase">Agregar Show a la Parrilla</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Nombre del Programa"
                          value={newShow.title}
                          onChange={(e) => setNewShow({ ...newShow, title: e.target.value })}
                          className="w-full bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Nombre del DJ / Locutor"
                          value={newShow.djName}
                          onChange={(e) => setNewShow({ ...newShow, djName: e.target.value })}
                          className="w-full bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] text-purple-300 block mb-1">Hora Inicio</label>
                          <input
                            type="time"
                            value={newShow.startTime}
                            onChange={(e) => setNewShow({ ...newShow, startTime: e.target.value })}
                            className="w-full bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-purple-300 block mb-1">Hora Fin</label>
                          <input
                            type="time"
                            value={newShow.endTime}
                            onChange={(e) => setNewShow({ ...newShow, endTime: e.target.value })}
                            className="w-full bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-purple-300 block mb-1">Género Musical</label>
                          <input
                            type="text"
                            placeholder="Ej. EDM, House, Reggaeton"
                            value={newShow.genre}
                            onChange={(e) => setNewShow({ ...newShow, genre: e.target.value })}
                            className="w-full bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-purple-300 block mb-1">Días de Transmisión</label>
                        <div className="flex flex-wrap gap-1.5">
                          {daysList.map((d) => {
                            const isSelected = newShow.days.includes(d);
                            return (
                              <button
                                type="button"
                                key={d}
                                onClick={() => {
                                  if (isSelected) {
                                    setNewShow({ ...newShow, days: newShow.days.filter((x) => x !== d) });
                                  } else {
                                    setNewShow({ ...newShow, days: [...newShow.days, d] });
                                  }
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                                  isSelected ? 'bg-purple-600 text-white' : 'bg-purple-950/60 text-purple-300'
                                }`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Breve descripción del programa..."
                        value={newShow.description}
                        onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                        className="w-full bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white"
                      />

                      <button
                        type="submit"
                        className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white cursor-pointer"
                      >
                        Guardar Programa en la Parrilla
                      </button>
                    </form>
                  )}

                  {/* List of existing shows */}
                  <div className="space-y-2">
                    {schedule.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-[#150f2b] border border-purple-500/20 rounded-2xl flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{item.title}</span>
                            <span className="text-[10px] font-mono text-purple-300">
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>
                          <div className="text-[11px] text-purple-300/70">
                            DJ: {item.djName} · {item.days.join(', ')}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteScheduleItem(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar programa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Peticiones de Canciones */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  <div className="border-b border-purple-500/20 pb-3">
                    <h3 className="text-base font-bold text-white">Solicitudes de Canciones de Oyentes</h3>
                    <p className="text-xs text-purple-300/70">
                      Gestiona los pedidos que llegan desde el reproductor y el chat.
                    </p>
                  </div>

                  {songRequests.length === 0 ? (
                    <div className="py-12 text-center text-xs text-purple-300/50">
                      No hay peticiones de canciones pendientes en este momento.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {songRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-3 bg-[#150f2b] border border-purple-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-purple-200">
                                "{req.songTitle}" - {req.artist}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                req.status === 'sonando'
                                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                                  : req.status === 'en_cola'
                                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                                  : 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                              }`}>
                                {req.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-purple-300/70 mt-0.5">
                              Por: <strong className="text-purple-200">{req.userName}</strong> a las {req.timestamp}
                              {req.dedication && ` · Dedicatoria: "${req.dedication}"`}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <select
                              value={req.status}
                              onChange={(e) => updateRequestStatus(req.id, e.target.value as any)}
                              className="bg-[#0e0a1c] border border-purple-500/30 rounded-xl px-2 py-1 text-[11px] text-purple-200 focus:outline-none"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="en_cola">En Cola</option>
                              <option value="sonando">Sonando Ahora</option>
                              <option value="completada">Completada</option>
                            </select>

                            <button
                              onClick={() => deleteSongRequest(req.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Chat & Moderación */}
              {activeTab === 'chat' && (
                <div className="space-y-4">
                  <div className="border-b border-purple-500/20 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Moderación del Chat en Vivo</h3>
                      <p className="text-xs text-purple-300/70">
                        Controla el acceso al chat, borra mensajes o limpia la sala.
                      </p>
                    </div>

                    <button
                      onClick={clearChat}
                      className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Vaciar Chat</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[#150f2b] rounded-2xl border border-purple-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Estado del Chat</span>
                      <span className="text-[11px] text-purple-300/70">
                        {settings.chatEnabled ? 'Los oyentes pueden interactuar en tiempo real' : 'El chat se encuentra deshabilitado para el público'}
                      </span>
                    </div>

                    <button
                      onClick={() => updateSettings({ chatEnabled: !settings.chatEnabled })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        settings.chatEnabled
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {settings.chatEnabled ? 'Chat Activo' : 'Chat Silenciado'}
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    <span className="text-xs font-bold text-purple-200">Mensajes Recientes ({chatMessages.length})</span>
                    {chatMessages.slice(-15).reverse().map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 bg-[#120d24] border border-purple-500/15 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-purple-300 mr-2">{m.userName}:</span>
                          <span className="text-purple-100">{m.text}</span>
                        </div>
                        <button
                          onClick={() => deleteChatMessage(m.id)}
                          className="text-red-400 hover:text-red-300 p-1 shrink-0 cursor-pointer"
                          title="Eliminar mensaje"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Seguridad & Contraseña */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="border-b border-purple-500/20 pb-3">
                    <h3 className="text-base font-bold text-white">Cambio de Contraseña de Administrador</h3>
                    <p className="text-xs text-purple-300/70">
                      Actualiza la clave para asegurar el acceso exclusivo a la cabina de control.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-200 block mb-1">
                      Contraseña Actual *
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-200 block mb-1">
                      Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-200 block mb-1">
                      Confirmar Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full bg-[#181133] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  {passError && (
                    <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                      {passError}
                    </div>
                  )}

                  {passSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle size={15} />
                      <span>¡Contraseña actualizada con éxito!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
                  >
                    Actualizar Contraseña
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
