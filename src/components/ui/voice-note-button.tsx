import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNoteButtonProps {
  src: string;
  label?: string;
}

export const VoiceNoteButton: React.FC<VoiceNoteButtonProps> = ({ src, label }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="flex items-center gap-2 px-3 py-2 bg-[#F2F8F4] hover:bg-[#e4f0e6] rounded-full text-[#30461f] transition-colors"
      aria-label={label || 'Écouter'}
    >
      {playing ? <Pause size={18} /> : <Play size={18} />}
      {label && <span className="text-sm font-medium">{label}</span>}
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </button>
  );
}; 