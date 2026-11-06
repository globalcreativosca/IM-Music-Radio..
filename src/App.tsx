import React, { useState } from 'react';
import { RadioProvider } from './context/RadioContext';
import { Header } from './components/Header';
import { TurntablePlayer } from './components/TurntablePlayer';
import { DJSoundboard } from './components/DJSoundboard';
import { LiveChat } from './components/LiveChat';
import { ScheduleView } from './components/ScheduleView';
import { AdminModal } from './components/AdminModal';
import { SongRequestModal } from './components/SongRequestModal';
import { Footer } from './components/Footer';

function RadioAppContent() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSongRequestOpen, setIsSongRequestOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07050d] text-[#f1f0f7] selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSongRequest={() => setIsSongRequestOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Top Split: Live Player & Live Chat */}
        <section id="player" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Turntable Player + DJ Soundboard (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <TurntablePlayer />
            <DJSoundboard />
          </div>

          {/* Right: Live Listener Chat (5 cols) */}
          <div id="chat" className="lg:col-span-5">
            <LiveChat onOpenSongRequest={() => setIsSongRequestOpen(true)} />
          </div>
        </section>

        {/* Weekly Program Schedule */}
        <section id="schedule" className="pt-4">
          <ScheduleView />
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Modals */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <SongRequestModal
        isOpen={isSongRequestOpen}
        onClose={() => setIsSongRequestOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RadioProvider>
      <RadioAppContent />
    </RadioProvider>
  );
}
