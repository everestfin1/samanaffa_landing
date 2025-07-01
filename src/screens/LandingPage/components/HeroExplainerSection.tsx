import React from 'react';
import ReactPlayer from 'react-player';
import { VoiceNoteButton } from "../../../components/ui/voice-note-button";

export const HeroExplainerSection: React.FC = () => {
  return (
    <section className="w-full py-12 lg:py-16 px-4 lg:px-[133px] flex flex-col md:flex-row items-center gap-10 border-b border-gray-300/60">
      {/* Texte */}
      <div className="flex-1 text-center md:text-left max-w-xl space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          Pourquoi épargner dans Sama Naffa&nbsp;?
        </h2>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          Sama Naffa simplifie ton parcours d'épargne&nbsp;: choisis ton objectif, définis un montant mensuel et une durée. 
          Ton capital est sécurisé auprès de nos partenaires financiers régulés et fructifie grâce à un taux d'intérêt compétitif. 
          Suis tes gains en temps réel et atteins tes projets plus rapidement, en toute sérénité.
        </p>
        <VoiceNoteButton src="/voicenotes/explainer.mp3" label="Écouter l'explication" />
      </div>

      {/* Vidéo */}
      <div className="w-full md:w-1/2 lg:w-[45%] max-w-md md:max-w-none">
        <div className="relative pt-[56.25%] rounded-lg shadow-lg overflow-hidden">
          <ReactPlayer
            url="https://youtu.be/dQw4w9WgXcQ"
            playing
            muted
            loop
            controls
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>
      </div>
    </section>
  );
}; 