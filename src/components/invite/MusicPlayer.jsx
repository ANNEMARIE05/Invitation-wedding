import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Plus, Minus, Music } from "lucide-react";

const VIDEO_ID = "rtOvBOTyX00";

export default function MusicPlayer({ opened }) {
  const playerRef = useRef(null);
  const volumeRef = useRef(50);
  const wantPlay = useRef(false);
  const userPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  const startPlayback = (player = playerRef.current) => {
    if (!wantPlay.current || userPaused.current || !player) return;
    if (typeof player.unMute === "function") player.unMute();
    if (typeof player.setVolume === "function") player.setVolume(volumeRef.current);
    if (typeof player.playVideo === "function") player.playVideo();
  };

  useEffect(() => {
    let alive = true;
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    const init = () => {
      if (!alive || playerRef.current || !window.YT?.Player) return;
      if (!document.getElementById("yt-hidden-player")) return;
      try {
        playerRef.current = new window.YT.Player("yt-hidden-player", {
          videoId: VIDEO_ID,
          playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: VIDEO_ID, playsinline: 1 },
          events: {
            onReady: (e) => {
              if (!alive) return;
              setReady(true);
              e.target.setVolume(volumeRef.current);
              startPlayback(e.target);
            },
            onStateChange: (e) => {
              if (!alive) return;
              setPlaying(e.data === window.YT.PlayerState.PLAYING);
            },
          },
        });
      } catch {
        playerRef.current = null;
      }
    };
    if (window.YT?.Player) init();
    else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        if (alive) init();
      };
    }
    return () => {
      alive = false;
      const player = playerRef.current;
      playerRef.current = null;
      if (typeof player?.destroy === "function") player.destroy();
    };
  }, []);

  useEffect(() => {
    const onStart = () => {
      wantPlay.current = true;
      startPlayback();
    };
    window.addEventListener("wedding-music-start", onStart);
    return () => window.removeEventListener("wedding-music-start", onStart);
  }, []);

  useEffect(() => {
    if (!opened) return;
    wantPlay.current = true;
    startPlayback();
  }, [opened]);

  const toggle = () => {
    if (!ready || typeof playerRef.current?.playVideo !== "function") return;
    if (playing) {
      userPaused.current = true;
      playerRef.current.pauseVideo();
    } else {
      userPaused.current = false;
      startPlayback();
    }
  };

  const changeVolume = (delta) => {
    const v = Math.min(100, Math.max(0, volume + delta));
    volumeRef.current = v;
    setVolume(v);
    if (typeof playerRef.current?.setVolume === "function") playerRef.current.setVolume(v);
  };

  return (
    <>
      <div className="fixed left-0 top-0 w-[200px] h-[200px] opacity-0 pointer-events-none overflow-hidden" aria-hidden>
        <div id="yt-hidden-player" className="h-full w-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 30 }}
        transition={{ duration: 0.8, delay: opened ? 0.8 : 0 }}
        aria-hidden={!opened}
        className={`fixed bottom-5 left-5 z-50 flex items-center gap-1.5 rounded-full bg-[#2A050B]/85 backdrop-blur-md border hairline-gold px-3 py-2 shadow-[0_10px_40px_rgba(42,5,11,0.5)] ${opened ? "" : "pointer-events-none"}`}
        data-testid="music-player"
      >
        <span className="flex items-end gap-[3px] h-4 w-5 justify-center mr-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full bg-[#D4AF37] ${playing ? "eq-bar" : "scale-y-[0.3]"}`}
              style={{ height: "100%", animationDelay: `${i * 0.18}s`, transformOrigin: "bottom" }}
            />
          ))}
        </span>
        <span className="hidden sm:flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.25em] uppercase text-[#C48B92] mr-1">
          <Music size={11} /> Notre chanson
        </span>
        <button
          data-testid="music-volume-down-button"
          onClick={() => changeVolume(-10)}
          disabled={!ready}
          aria-label="Diminuer le volume"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#FAF7F2]/80 hover:text-[#D4AF37] hover:bg-white/10 transition-all disabled:opacity-40"
        >
          <Minus size={14} />
        </button>
        <span className="font-display text-xs text-[#D4AF37] w-8 text-center tabular-nums" data-testid="music-volume-display">{volume}%</span>
        <button
          data-testid="music-volume-up-button"
          onClick={() => changeVolume(10)}
          disabled={!ready}
          aria-label="Augmenter le volume"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#FAF7F2]/80 hover:text-[#D4AF37] hover:bg-white/10 transition-all disabled:opacity-40"
        >
          <Plus size={14} />
        </button>
        <button
          data-testid="music-toggle-button"
          onClick={toggle}
          disabled={!ready}
          aria-label={playing ? "Mettre la musique en pause" : "Reprendre la musique"}
          className="ml-1 w-10 h-10 rounded-full bg-[#D4AF37] text-[#2A050B] flex items-center justify-center hover:bg-[#B89428] hover:scale-105 transition-all disabled:opacity-40"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
      </motion.div>
    </>
  );
}
