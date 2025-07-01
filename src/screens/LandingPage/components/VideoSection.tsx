import React from 'react';

/**
 * Cette section affiche une courte vidéo explicative (≤ 60 s) qui se lance automatiquement en boucle
 * dès l'ouverture de la landing page. Place la vidéo `explainer.mp4` dans le dossier `public/`.
 */
export const VideoSection: React.FC = () => {
  return (
    <section className="w-full flex justify-center bg-white py-8 lg:py-12 px-4">
      <video
        src="/explainer.mp4"
        className="w-full max-w-3xl rounded-xl shadow-lg"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
}; 