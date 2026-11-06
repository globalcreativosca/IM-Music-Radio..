import { RadioSettings, ShowScheduleItem, ChatMessage, SongRequest } from '../types/radio';

export const INITIAL_SETTINGS: RadioSettings = {
  stationName: "I´M Music Radio",
  slogan: "Tu Música en Vivo · Pura Energía y Buena Vibra 24/7",
  logoUrl: "/assets/aistudio/radio_Ivan_0339eca7.jpeg",
  // Primary stream is a crystal clear live stream
  streamUrl: "https://stream.dancewave.online/dance.mp3",
  fallbackStreamUrl: "https://ice1.somafm.com/defcon-128-mp3",
  bitrate: "320 kbps HD",
  currentDj: "DJ Iván",
  currentShow: "La Hora Electrónica & Urban Hits",
  currentTrack: "Midnight Pulse (VIP Mix)",
  currentArtist: "I´M Music Radio Live Session",
  marqueeAnnouncement: "🔥 ¡Bienvenidos a I´M Music Radio! Transmitiendo en directo las 24 horas con el mejor sonido. Deja tu saludo en el chat y pide tu canción favorita.",
  chatEnabled: true,
  slowMode: false,
  adminPasswordHash: "admin123", // Easy for admin demo, changeable anytime
  themeAccent: "purple",
  socials: {
    whatsapp: "+1 809 555 0199",
    instagram: "https://instagram.com/immusicradio",
    tiktok: "https://tiktok.com/@immusicradio",
    facebook: "https://facebook.com/immusicradio",
    twitter: "https://x.com/immusicradio",
    email: "contacto@immusicradio.com"
  }
};

export const PRESET_STREAMS = [
  {
    name: "I´M Music Radio (Dance & Electronic Hits)",
    url: "https://stream.dancewave.online/dance.mp3",
    genre: "Dance / Pop / EDM",
    quality: "320 kbps"
  },
  {
    name: "I´M Chillout & Deep Lounge",
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
    genre: "Chillout / Deep / Lo-Fi",
    quality: "128 kbps"
  },
  {
    name: "I´M Electro Underground",
    url: "https://ice1.somafm.com/defcon-128-mp3",
    genre: "Synthwave / Cyber Electro",
    quality: "192 kbps"
  },
  {
    name: "I´M Pop & Latino Live",
    url: "https://icecast.skyrock.net/s/natio_mp3_128k",
    genre: "Top 40 / Pop Internacional",
    quality: "128 kbps"
  }
];

export const INITIAL_SCHEDULE: ShowScheduleItem[] = [
  {
    id: "show-1",
    title: "El Despertador Musical",
    djName: "Sofi Martínez",
    days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    startTime: "06:00",
    endTime: "09:00",
    description: "Empieza la mañana con la mejor energía, noticias de la música y estrenos pop.",
    genre: "Pop & Morning Beats",
    coverColor: "from-amber-500/20 to-purple-600/20"
  },
  {
    id: "show-2",
    title: "Hits Sin Fronteras",
    djName: "DJ Carlos Mix",
    days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    startTime: "12:00",
    endTime: "15:00",
    description: "Los mayores éxitos radiales del momento en español e inglés sin interrupciones.",
    genre: "Top 40 & Latin Hits",
    coverColor: "from-blue-500/20 to-purple-600/20"
  },
  {
    id: "show-3",
    title: "La Hora Electrónica & Urban Hits",
    djName: "DJ Iván",
    days: ["Lunes", "Miércoles", "Viernes", "Sábado"],
    startTime: "18:00",
    endTime: "21:00",
    description: "Sesión en vivo de mezclas en vivo, mashups y los mejores drops del planeta.",
    genre: "EDM, House & Club",
    coverColor: "from-purple-600/30 to-pink-600/30"
  },
  {
    id: "show-4",
    title: "I´M Club Session: Madrugada DJ",
    djName: "DJ Iván & Invitados",
    days: ["Viernes", "Sábado", "Domingo"],
    startTime: "22:00",
    endTime: "03:00",
    description: "La fiesta oficial de fin de semana con sets exclusivos y saludos al aire.",
    genre: "Electro Club & Progressive",
    coverColor: "from-fuchsia-600/30 to-indigo-600/30"
  },
  {
    id: "show-5",
    title: "Domingo Chill & Acústico",
    djName: "Elena R.",
    days: ["Domingo"],
    startTime: "14:00",
    endTime: "18:00",
    description: "Tardes relajadas con mezclas acústicas, deep vibes y peticiones especiales.",
    genre: "Lounge & Chillout",
    coverColor: "from-cyan-500/20 to-purple-600/20"
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    userName: "DJ Iván (Cabina)",
    userAvatar: "🎧",
    text: "¡Hola a todos los que están conectados en I´M Music Radio! Bienvenidos a la transmisión en vivo 🔊💜",
    timestamp: "18:00",
    isStaff: true,
    isAdmin: true,
    reactions: { "🔥": 8, "💜": 12 }
  },
  {
    id: "msg-2",
    userName: "Lucas_Gamer",
    userAvatar: "⚡",
    text: "¡Qué buen sonido tiene la radio hoy! Saludos desde Buenos Aires 🇦🇷",
    timestamp: "18:04",
    reactions: { "🙌": 4 }
  },
  {
    id: "msg-3",
    userName: "Camila_Electro",
    userAvatar: "💃",
    text: "Suban el volumen que esta pista está increíbleee 🔥🔥🔥",
    timestamp: "18:08",
    reactions: { "🔥": 6 }
  },
  {
    id: "msg-4",
    userName: "MarcosDJ",
    userAvatar: "🎵",
    text: "Ivan, ¿puedes poner algo de Tiësto o David Guetta más adelante? Saludos para la banda de Madrid!",
    timestamp: "18:11",
    isSongRequest: true,
    reactions: { "🎧": 3 }
  },
  {
    id: "msg-5",
    userName: "DJ Iván (Cabina)",
    userAvatar: "🎧",
    text: "¡Anotado Marcos! Entrando en la tanda de las 18:30. ¡No olviden usar el botón 'Pedir Canción'!",
    timestamp: "18:13",
    isStaff: true,
    isAdmin: true,
    reactions: { "💜": 5 }
  }
];

export const INITIAL_REQUESTS: SongRequest[] = [
  {
    id: "req-1",
    userName: "MarcosDJ",
    songTitle: "The Business",
    artist: "Tiësto",
    dedication: "Para toda la gente que está estudiando y trabajando este viernes",
    timestamp: "18:11",
    status: "en_cola"
  },
  {
    id: "req-2",
    userName: "Valeria Gomez",
    songTitle: "Pepas (Robin Schulz Remix)",
    artist: "Farruko & Robin Schulz",
    dedication: "Dedicada a mis amigas de la universidad",
    timestamp: "18:02",
    status: "sonando"
  },
  {
    id: "req-3",
    userName: "Andrés_99",
    songTitle: "Titanium",
    artist: "David Guetta ft. Sia",
    dedication: "Para arrancar el fin de semana con todo",
    timestamp: "17:45",
    status: "completada"
  }
];
