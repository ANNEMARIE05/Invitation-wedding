import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Plus, Minus, ChevronUp, ChevronDown, X, Disc3 } from "lucide-react";
import { WEDDING_SONG } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";

const { youtubeId: VIDEO_ID, startSeconds: START_SECONDS, track, artist, thumbUrl } = WEDDING_SONG;

const UI_KEY = "wedding-music-ui";

function readUiMode() {
  try {
    const v = sessionStorage.getItem(UI_KEY);
    if (v === "hidden" || v === "compact" || v === "panel") return v;
  } catch {
    /* ignore */
  }
  return "compact";
}

function Vinyl({ size = "md", playing }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return (
    <div
      className={`relative shrink-0 rounded-full p-[2px] ${dim} ${playing ? "music-vinyl-spin" : ""}`}
      style={{
        background: playing
          ? "conic-gradient(from 120deg, #D4AF37, #ED1E79, #9B1B4A, #D4AF37)"
          : "linear-gradient(135deg, rgba(212,175,55,0.55), rgba(237,30,121,0.35))",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#1a0308] ring-1 ring-white/10">
        {thumbUrl ? (
          <img src={thumbUrl} alt="" className="h-full w-full object-cover opacity-85" draggable={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#D4AF37]/80">
            <Disc3 size={size === "sm" ? 16 : 18} strokeWidth={1.4} />
          </div>
        )}
        <span className="absolute inset-[28%] rounded-full bg-[#2A050B]/90 ring-1 ring-[#D4AF37]/40" aria-hidden />
      </div>
    </div>
  );
}

function EqBars({ playing, className = "" }) {
  return (
    <span className={`flex h-3.5 w-4 items-end justify-center gap-[2px] ${className}`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-[#D4AF37] ${playing ? "eq-bar" : "scale-y-[0.3]"}`}
          style={{ height: "100%", animationDelay: `${i * 0.18}s`, transformOrigin: "bottom" }}
        />
      ))}
    </span>
  );
}

const shell =
  "border hairline-gold bg-[#2A050B]/90 shadow-[0_10px_36px_rgba(42,5,11,0.5)] backdrop-blur-md";

const iconBtn =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#FAF7F2]/75 transition-all hover:bg-white/10 hover:text-[#D4AF37] disabled:opacity-40";

const playBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B89428] text-[#2A050B] shadow-[0_3px_12px_rgba(212,175,55,0.3)] transition-all hover:scale-105 disabled:opacity-40";

export default function MusicPlayer({ opened }) {
  const { m } = useI18n();
  const playerRef = useRef(null);
  const volumeRef = useRef(30);
  const wantPlay = useRef(false);
  const userPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [ui, setUi] = useState(readUiMode);

  useEffect(() => {
    try {
      sessionStorage.setItem(UI_KEY, ui);
    } catch {
      /* ignore */
    }
  }, [ui]);

  const startPlayback = (player = playerRef.current) => {
    if (!wantPlay.current || userPaused.current || !player) return;
    if (typeof player.unMute === "function") player.unMute();
    if (typeof player.setVolume === "function") player.setVolume(volumeRef.current);
    if (typeof player.seekTo === "function") player.seekTo(START_SECONDS, true);
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
          playerVars: { autoplay: 0, controls: 0, playsinline: 1, start: START_SECONDS },
          events: {
            onReady: (e) => {
              if (!alive) return;
              setReady(true);
              e.target.setVolume(volumeRef.current);
              startPlayback(e.target);
            },
            onStateChange: (e) => {
              if (!alive) return;
              if (e.data === window.YT.PlayerState.ENDED) {
                e.target.seekTo(START_SECONDS, true);
                e.target.playVideo();
              }
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

  const applyVolume = (v) => {
    const next = Math.min(100, Math.max(0, v));
    volumeRef.current = next;
    setVolume(next);
    if (typeof playerRef.current?.setVolume === "function") playerRef.current.setVolume(next);
  };

  const changeVolume = (delta) => applyVolume(volume + delta);

  const visible = opened && ui !== "hidden";
  const inactive = !opened ? "pointer-events-none" : "";

  return (
    <>
      <div className="fixed left-0 top-0 h-[200px] w-[200px] overflow-hidden opacity-0 pointer-events-none" aria-hidden>
        <div id="yt-hidden-player" className="h-full w-full" />
      </div>

      <AnimatePresence mode="wait">
        {opened && ui === "hidden" ? (
          <motion.button
            key="hidden"
            type="button"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35 }}
            onClick={() => setUi("compact")}
            aria-label={m.music.show}
            className={`fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full ${shell}`}
            data-testid="music-player"
          >
            <Vinyl size="sm" playing={playing} />
            {playing ? (
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ED1E79] ring-2 ring-[#2A050B]">
                <EqBars playing className="scale-75" />
              </span>
            ) : null}
          </motion.button>
        ) : null}

        {visible && ui === "compact" ? (
          <motion.div
            key="compact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
            aria-hidden={!opened}
            className={`fixed bottom-5 left-5 z-50 flex items-center gap-1 rounded-full px-1.5 py-1 ${shell} ${inactive}`}
            data-testid="music-player"
          >
            <Vinyl size="sm" playing={playing} />
            <EqBars playing />
            <button
              type="button"
              data-testid="music-toggle-button"
              onClick={toggle}
              disabled={!ready}
              aria-label={playing ? m.music.togglePause : m.music.togglePlay}
              className={playBtn}
            >
              {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={() => setUi("panel")}
              aria-label={m.music.expand}
              className={iconBtn}
            >
              <ChevronUp size={15} />
            </button>
            <button type="button" onClick={() => setUi("hidden")} aria-label={m.music.hide} className={iconBtn}>
              <X size={15} />
            </button>
          </motion.div>
        ) : null}

        {visible && ui === "panel" ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
            aria-hidden={!opened}
            className={`fixed bottom-5 left-5 z-50 w-[min(100vw-2.5rem,16.5rem)] overflow-hidden rounded-xl ${shell} ${inactive}`}
            data-testid="music-player"
          >
            <div className="flex items-center gap-2 p-2.5">
              <Vinyl playing={playing} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[13px] font-semibold leading-tight text-[#FAF7F2]">{track}</p>
                <p className="truncate font-cinzel text-[9px] tracking-wide text-[#C48B92]/95">{artist}</p>
              </div>
              <button
                type="button"
                data-testid="music-toggle-button"
                onClick={toggle}
                disabled={!ready}
                aria-label={playing ? m.music.togglePause : m.music.togglePlay}
                className={playBtn}
              >
                {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>
              <button type="button" onClick={() => setUi("compact")} aria-label={m.music.collapse} className={iconBtn}>
                <ChevronDown size={15} />
              </button>
              <button type="button" onClick={() => setUi("hidden")} aria-label={m.music.hide} className={iconBtn}>
                <X size={15} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 border-t border-white/[0.06] px-2.5 py-2">
              <button
                type="button"
                data-testid="music-volume-down-button"
                onClick={() => changeVolume(-10)}
                disabled={!ready}
                aria-label={m.music.volumeDown}
                className={iconBtn}
              >
                <Minus size={14} />
              </button>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                disabled={!ready}
                aria-label={m.music.volume}
                data-testid="music-volume-slider"
                className="music-volume-slider min-w-0 flex-1"
                style={{ "--music-vol": `${volume}%` }}
                onChange={(e) => applyVolume(Number(e.target.value))}
              />
              <button
                type="button"
                data-testid="music-volume-up-button"
                onClick={() => changeVolume(10)}
                disabled={!ready}
                aria-label={m.music.volumeUp}
                className={iconBtn}
              >
                <Plus size={14} />
              </button>
              <span className="w-8 shrink-0 text-center font-display text-[11px] tabular-nums text-[#D4AF37]" data-testid="music-volume-display">
                {volume}%
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
