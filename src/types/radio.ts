export interface RadioSettings {
  stationName: string;
  slogan: string;
  logoUrl: string;
  streamUrl: string;
  fallbackStreamUrl: string;
  bitrate: string;
  currentDj: string;
  currentShow: string;
  currentTrack: string;
  currentArtist: string;
  marqueeAnnouncement: string;
  chatEnabled: boolean;
  slowMode: boolean;
  adminPasswordHash: string; // default stored password
  themeAccent: 'purple' | 'magenta' | 'cyan' | 'emerald' | 'amber';
  socials: {
    whatsapp: string;
    instagram: string;
    tiktok: string;
    facebook: string;
    twitter: string;
    email: string;
  };
}

export interface ShowScheduleItem {
  id: string;
  title: string;
  djName: string;
  days: string[]; // ['Lunes', 'Miércoles', ...]
  startTime: string; // '18:00'
  endTime: string; // '20:00'
  description: string;
  genre: string;
  coverColor: string;
}

export interface ChatMessage {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isStaff?: boolean;
  isAdmin?: boolean;
  isSongRequest?: boolean;
  reactions?: Record<string, number>;
}

export interface SongRequest {
  id: string;
  userName: string;
  songTitle: string;
  artist: string;
  dedication?: string;
  timestamp: string;
  status: 'pendiente' | 'en_cola' | 'sonando' | 'completada';
}
