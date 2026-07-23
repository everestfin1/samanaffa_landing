"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

/**
 * Same hero media behavior as the pre-E0 homepage:
 * autoplay muted video, poster/fallback still, pause 1 min after first play, then loop.
 */
export default function E0HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPlayedOnceRef = useRef(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const toggleAudio = () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      const nextEnabled = !isAudioEnabled;
      video.muted = !nextEnabled;
      setIsAudioEnabled(nextEnabled);
    } catch {
      // Some browsers require a fresh gesture to unmute.
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.autoplay = true;

    const handleVideoEnded = () => {
      if (hasPlayedOnceRef.current) return;

      hasPlayedOnceRef.current = true;
      setIsVideoPaused(true);

      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      pauseTimeoutRef.current = setTimeout(() => {
        video.currentTime = 0;
        video.loop = true;
        void video.play().then(() => {
          setIsVideoPaused(false);
        });
      }, 60_000);
    };

    const startVideo = () => {
      if (video.readyState >= 2) {
        void video.play().catch(() => {
          // Autoplay may be blocked until interaction.
        });
      }
    };

    video.addEventListener("ended", handleVideoEnded);
    video.addEventListener("loadeddata", startVideo);
    video.addEventListener("canplay", startVideo);
    startVideo();

    return () => {
      video.removeEventListener("ended", handleVideoEnded);
      video.removeEventListener("loadeddata", startVideo);
      video.removeEventListener("canplay", startVideo);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleUserInteraction = async () => {
      const video = videoRef.current;
      if (video && video.paused && !isVideoPaused) {
        try {
          await video.play();
        } catch {
          // Ignore play failures from blocked autoplay.
        }
      }
    };

    const events = ["click", "touchstart", "keydown", "scroll"] as const;
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isVideoPaused]);

  return (
    <>
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          preload="auto"
          className={`hero-video hero-media-position h-full w-full object-cover transition-opacity duration-1000 ${
            isVideoPaused ? "opacity-0" : "opacity-100"
          }`}
          aria-label="Vidéo d'arrière-plan Sama Naffa"
          poster="/sama-naffa_bg.jpg"
        >
          <source src="/sama-naffa-bg-vid.mp4" type="video/mp4" />
        </video>

        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isVideoPaused ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src="/sama-naffa_bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-media-position object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <button
          type="button"
          onClick={toggleAudio}
          className="group relative rounded-full border border-[var(--sama-marigold)]/30 bg-[var(--sama-marigold)] p-3 transition-all duration-300 hover:scale-110 hover:bg-[var(--sama-marigold-dark)]"
          aria-label={isAudioEnabled ? "Désactiver le son" : "Activer le son"}
        >
          {isAudioEnabled ? (
            <SpeakerWaveIcon className="size-6 text-white" />
          ) : (
            <SpeakerXMarkIcon className="size-6 text-white" />
          )}
          <span className="pointer-events-none absolute -bottom-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-black/70 px-3 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            {isAudioEnabled ? "Désactiver le son" : "Activer le son"}
          </span>
        </button>
      </div>
    </>
  );
}
