import { useEffect, useRef } from "react";
import ambientalAudioSrc from "../audio/Sonido ambiental.mp3";

export function useSoundSystem(volumes) {
  const audioCtxRef = useRef(null);
  const musicAudioRef = useRef(null);

  // Inicializar y gestionar el elemento de audio ambiental
  useEffect(() => {
    const audio = new Audio(ambientalAudioSrc);
    audio.loop = true;
    audio.preload = "auto";
    musicAudioRef.current = audio;

    const tryPlayAudio = () => {
      if (!musicAudioRef.current) return;
      const effectiveVolume = (volumes.master / 100) * (volumes.music / 100) * 0.10;
      
      if (effectiveVolume > 0 && volumes.music > 0 && volumes.master > 0) {
        musicAudioRef.current.volume = Math.min(Math.max(effectiveVolume, 0), 1);
        musicAudioRef.current.play().catch(() => {});
      }
    };

    // Intenta reproducir al primer clic de interacción en la pantalla de login/inicio
    window.addEventListener("click", tryPlayAudio, { once: true });

    return () => {
      audio.pause();
      musicAudioRef.current = null;
      window.removeEventListener("click", tryPlayAudio);
    };
  }, []);

  // Actualizar volumen en tiempo real si se mueve el slider
  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;

    const effectiveVolume = (volumes.master / 100) * (volumes.music / 100) * 0.10;

    if (effectiveVolume <= 0 || volumes.music <= 0 || volumes.master <= 0) {
      audio.pause();
    } else {
      audio.volume = Math.min(Math.max(effectiveVolume, 0), 1);
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    }
  }, [volumes.music, volumes.master]);

  // Efectos de sonido (SFX) para los botones
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener("click", initAudio, { once: true });

    const handleGlobalClick = (e) => {
      if (volumes.master <= 0) return;
      const target = e.target.closest("button");
      if (!target) return;

      initAudio();
      const ctx = audioCtxRef.current;
      const sfxVol = volumes.master * (volumes.sfx / 100);
      if (volumes.sfx <= 0) return;

      const className = target.className || "";

      if (className.includes("half-ban-btn") || className.includes("ban-slot") || className.includes("ban-phase")) {
        playBroadcastBan(ctx, sfxVol);
      } else if (className.includes("lock-in-btn") || (className.includes("free-action-btn") && (className.includes("red-pick") || className.includes("blue-pick")))) {
        playBroadcastLockIn(ctx, sfxVol);
      } else {
        playBroadcastClick(ctx, sfxVol);
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [volumes.sfx, volumes.master]);
}

function playBroadcastClick(ctx, gainValue) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const vol = (gainValue / 100) * 0.04;
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

function playBroadcastBan(ctx, gainValue) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const vol = (gainValue / 100) * 0.15;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

function playBroadcastLockIn(ctx, gainValue) {
  try {
    const gain = ctx.createGain();
    const vol = (gainValue / 100) * 0.15;
    [587.33, 880].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    });
    gain.connect(ctx.destination);
  } catch (e) {}
}