import React, { useState, useEffect, useRef } from 'react';
import { TimingRating, FlickScore, Song } from '../types';
import { audioEngine } from '../audioEngine';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Music, Sparkles, Loader2 } from 'lucide-react';
import { Player } from 'textalive-app-api';

interface RhythmGameViewProps {
  selectedSong: Song;
  onGameComplete: (overallRating: TimingRating, scores: FlickScore[]) => void;
  onExit: () => void;
}

const BEAT_COUNT = 16;
const REQUIRED_SPEED = 0.6; // px/ms for "高速フリック"

export const RhythmGameView: React.FC<RhythmGameViewProps> = ({
  selectedSong,
  onGameComplete,
  onExit,
}) => {
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [scores, setScores] = useState<FlickScore[]>([]);
  const [arrowPrompt, setArrowPrompt] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
  
  // Real-time TextAlive State
  const [playerLoading, setPlayerLoading] = useState(true);
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  // Scoring Visual state
  const [lastTimingFeedback, setLastTimingFeedback] = useState<TimingRating | null>(null);
  const [flickFeedbackDir, setFlickFeedbackDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null>(null);
  const [pulseRingScale, setPulseRingScale] = useState(1);
  const [isFlicking, setIsFlicking] = useState(false);

  // Drag coordinates tracking
  const dragStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastBeatTime = useRef<number>(Date.now());
  const nextBeatTime = useRef<number>(Date.now());
  const hasInputForCurrentBeat = useRef<boolean>(false);
  const playerRef = useRef<Player | null>(null);
  const gameFinishedRef = useRef<boolean>(false);

  // Dynamic queue of target directions (16 Beats)
  const prompts: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = [
    'UP', 'RIGHT', 'DOWN', 'LEFT', 'UP', 'RIGHT', 'DOWN', 'RIGHT',
    'UP', 'LEFT', 'DOWN', 'RIGHT', 'UP', 'DOWN', 'LEFT', 'RIGHT'
  ];

  useEffect(() => {
    // 1. Initialise local sound engine (only for SFX)
    audioEngine.init();
    
    // Reset States
    setScores([]);
    setCurrentBeatIndex(0);
    setArrowPrompt(prompts[0]);
    gameFinishedRef.current = false;
    hasInputForCurrentBeat.current = false;

    // 2. Instantiate TextAlive Player
    const player = new Player({
      app: {
        appName: "MagicalRhythmCapsule",
        appAuthor: "Gemini",
        token: "",
      },
      mediaElement: document.getElementById("textalive-media") || undefined,
    });

    playerRef.current = player;

    player.addListener({
      onAppReady: (app) => {
        setPlayerLoading(true);
        if (!app.managed) {
          player.createFromSongUrl(selectedSong.url, selectedSong.parameters);
        }
      },
      onVideoReady: (v) => {
        // Video parsed
      },
      onTimerReady: () => {
        setPlayerLoading(false);
        // Auto play on loading ready
        player.requestPlay();
      },
      onPlay: () => {
        setIsPlaying(true);
        lastBeatTime.current = Date.now();
        nextBeatTime.current = Date.now() + 60000 / selectedSong.bpm;
      },
      onPause: () => {
        setIsPlaying(false);
      },
      onStop: () => {
        setIsPlaying(false);
      },
      onBeatPlay: (beat) => {
        if (gameFinishedRef.current) return;

        const now = Date.now();
        const bpm = selectedSong.bpm;
        const beatInterval = 60000 / bpm;
        lastBeatTime.current = now;
        nextBeatTime.current = now + beatInterval;

        // Pulse ring effect synchronised to real beat!
        setPulseRingScale(1.8);
        setTimeout(() => setPulseRingScale(1), 200);

        const beatIndex = beat.position;
        const gameBeat = beatIndex % BEAT_COUNT;
        
        setCurrentBeatIndex(gameBeat);
        setArrowPrompt(prompts[gameBeat]);

        // Auto Miss checking for the ignored beats
        if (beatIndex > 0 && !hasInputForCurrentBeat.current && beatIndex <= BEAT_COUNT) {
          setScores((prev) => {
            const missScore: FlickScore = {
              rating: 'MISS',
              offsetSec: 0.5,
              speed: 0,
              angle: 0,
              expectedDir: prompts[(beatIndex - 1) % BEAT_COUNT],
              actualDir: null
            };
            return [...prev, missScore];
          });
        }

        hasInputForCurrentBeat.current = false;

        // Game session completed at target beats count
        if (beatIndex >= BEAT_COUNT) {
          gameFinishedRef.current = true;
          player.requestPause();
          
          setTimeout(() => {
            setScores((finalScores) => {
              const perfectCount = finalScores.filter(s => s.rating === 'PERFECT').length;
              const goodCount = finalScores.filter(s => s.rating === 'GOOD').length;
              
              let finalRating: TimingRating = 'MISS';
              if (perfectCount >= 6) {
                finalRating = 'PERFECT';
              } else if (perfectCount + goodCount >= 8) {
                finalRating = 'GOOD';
              }
              onGameComplete(finalRating, finalScores);
              return finalScores;
            });
          }, 800);
        }
      },
      onTimeUpdate: (positionMs) => {
        if (player.video) {
          const phrase = player.video.findPhrase(positionMs);
          if (phrase) {
            setCurrentLyric(phrase.text);
          } else {
            setCurrentLyric("");
          }
        }
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.requestStop();
        playerRef.current.removeListener();
        playerRef.current = null;
      }
    };
  }, [selectedSong]);

  // Handle Drag Pointer events
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (playerLoading) return;
    dragStart.current = {
      x: clientX,
      y: clientY,
      time: Date.now()
    };
    setIsFlicking(true);
  };

  const handlePointerUp = (clientX: number, clientY: number) => {
    if (playerLoading || !dragStart.current || hasInputForCurrentBeat.current) return;
    setIsFlicking(false);

    const now = Date.now();
    const start = dragStart.current;
    dragStart.current = null;

    const deltaX = clientX - start.x;
    const deltaY = clientY - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = now - start.time;

    if (distance < 30 || duration === 0) return;

    const speed = distance / duration; 
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    let flickDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null;
    if (angle >= -135 && angle <= -45) flickDir = 'UP';
    else if (angle >= 45 && angle <= 135) flickDir = 'DOWN';
    else if (angle > -45 && angle < 45) flickDir = 'RIGHT';
    else flickDir = 'LEFT';

    hasInputForCurrentBeat.current = true;
    setFlickFeedbackDir(flickDir);

    const targetTime = Math.abs(now - lastBeatTime.current) < Math.abs(now - nextBeatTime.current)
      ? lastBeatTime.current
      : nextBeatTime.current;
    const offsetSec = Math.abs(now - targetTime) / 1000;

    let rating: TimingRating = 'MISS';
    const isSpeedPerfect = speed >= REQUIRED_SPEED;
    const isDirCorrect = flickDir === arrowPrompt;

    if (isDirCorrect) {
      if (offsetSec <= 0.14 && isSpeedPerfect) {
        rating = 'PERFECT';
      } else if (offsetSec <= 0.32) {
        rating = 'GOOD';
      }
    }

    audioEngine.playFlickSFX(rating);
    setLastTimingFeedback(rating);

    setTimeout(() => {
      setLastTimingFeedback(null);
      setFlickFeedbackDir(null);
    }, 400);

    const scoreItem: FlickScore = {
      rating,
      offsetSec,
      speed,
      angle,
      expectedDir: arrowPrompt,
      actualDir: flickDir
    };
    setScores((prev) => [...prev, scoreItem]);
  };

  const getArrowIcon = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT', sizeClass = 'w-16 h-16') => {
    switch (dir) {
      case 'UP': return <ArrowUp className={sizeClass} />;
      case 'DOWN': return <ArrowDown className={sizeClass} />;
      case 'LEFT': return <ArrowLeft className={sizeClass} />;
      case 'RIGHT': return <ArrowRight className={sizeClass} />;
    }
  };

  const getTimingColor = (rating: TimingRating) => {
    switch (rating) {
      case 'PERFECT': return 'text-[#00FFCC] drop-shadow-[0_0_12px_#00FFCC]';
      case 'GOOD': return 'text-[#FFEB3B] drop-shadow-[0_0_8px_#FFEB3B]';
      case 'MISS': return 'text-[#FF1744] drop-shadow-[0_0_4px_#FF1744]';
    }
  };

  const getPromptTheme = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    switch (dir) {
      case 'UP': return { border: 'border-[#39C5BB]', glow: 'shadow-[#39C5BB]/40', text: 'text-[#39C5BB]' };
      case 'RIGHT': return { border: 'border-[#FFB74D]', glow: 'shadow-[#FFB74D]/40', text: 'text-[#FFB74D]' };
      case 'DOWN': return { border: 'border-[#EC407A]', glow: 'shadow-[#EC407A]/40', text: 'text-[#EC407A]' };
      case 'LEFT': return { border: 'border-[#BA68C8]', glow: 'shadow-[#BA68C8]/40', text: 'text-[#BA68C8]' };
    }
  };

  const themeConfig = getPromptTheme(arrowPrompt);

  return (
    <div id="rhythm-game-screen" className="flex flex-col items-center justify-between h-full bg-slate-950 p-6 text-white relative overflow-hidden">
      {/* Concert ambient grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Hidden TextAlive Media Iframe Mount point */}
      <div id="textalive-media" className="hidden" />

      {/* OVERLAY FOR PLAYER CONFIGURATION & LOADING */}
      {playerLoading && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-fade-in animate-duration-300">
          <Loader2 className="w-12 h-12 text-[#39C5BB] animate-spin mb-4" />
          <h2 className="text-sm font-black tracking-widest text-[#39C5BB] uppercase">
            Connecting to Piapro
          </h2>
          <p className="text-[10px] text-slate-400 font-mono mt-1 max-w-xs leading-relaxed">
            "{selectedSong.title}" の楽曲ストリーミングと、TextAliveビートマップをロードしています...
          </p>
        </div>
      )}

      {/* Status Bar */}
      <div className="w-full max-w-md flex justify-between items-center z-10">
        <button
          onClick={() => {
            if (playerRef.current) playerRef.current.requestStop();
            onExit();
          }}
          className="text-xs bg-slate-900/80 hover:bg-slate-800 hover:text-red-400 font-mono py-1.5 px-3 rounded-full border border-slate-850 transition-all font-bold cursor-pointer"
        >
          ✕ ABORT
        </button>

        <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/40 rounded-full px-3 py-1">
          <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-tight text-cyan-300">
            {selectedSong.title}
          </span>
        </div>
      </div>

      {/* Syncing Lyrics Display Layer */}
      <div className="w-full max-w-md h-12 flex items-center justify-center text-center px-4 z-10 mt-2">
        {currentLyric ? (
          <p className="text-xs font-bold font-sans tracking-wide bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(57,197,187,0.3)] animate-pulse">
            🎵 {currentLyric}
          </p>
        ) : (
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {isPlaying ? "Instrumentals playing..." : "Get ready..."}
          </p>
        )}
      </div>

      {/* Progress metronome line */}
      <div className="w-full max-w-md flex flex-col gap-1 items-center z-10">
        <div className="flex justify-between w-full text-[10px] font-mono text-slate-400">
          <span>PROGRESS</span>
          <span className="font-extrabold text-[#39C5BB]">{currentBeatIndex + 1} / {BEAT_COUNT} BEATS</span>
        </div>
        <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden flex p-0.5 border border-slate-850">
          {Array.from({ length: BEAT_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`flex-grow h-full mx-0.5 rounded-sm transition-all duration-300 ${
                i === currentBeatIndex
                  ? 'bg-gradient-to-r from-cyan-400 to-pink-500 shadow-[0_0_10px_#39C5BB]'
                  : i < scores.length
                    ? scores[i]?.rating === 'PERFECT'
                      ? 'bg-cyan-400'
                      : scores[i]?.rating === 'GOOD'
                        ? 'bg-yellow-400'
                        : 'bg-red-500'
                    : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* RHYTHM PLAY BOARD - Drag Area */}
      <div
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseUp={(e) => handlePointerUp(e.clientX, e.clientY)}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
        className="w-full max-w-sm aspect-square bg-slate-900/60 backdrop-blur-sm border-2 rounded-3xl flex flex-col items-center justify-center p-6 relative cursor-pointer active:bg-slate-850 select-none z-10 my-2"
        style={{
          borderColor: arrowPrompt === 'UP' ? '#39C5BB' : arrowPrompt === 'RIGHT' ? '#FFB74D' : arrowPrompt === 'DOWN' ? '#EC407A' : '#BA68C8',
          boxShadow: `0 0 25px rgba(0, 245, 212, 0.05)`
        }}
      >
        {/* Helper prompt instructions */}
        <p className="absolute top-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">
          リズムに合わせてシュッとフリック！
        </p>

        {/* Dynamic score feed overlay */}
        {lastTimingFeedback && (
          <div className="absolute top-12 z-20 animate-bounce">
            <h1 className={`text-4xl font-black italic tracking-wider ${getTimingColor(lastTimingFeedback)}`}>
              {lastTimingFeedback}!
            </h1>
          </div>
        )}

        {/* Outer Rhythm Metronomic Pulsing Ring */}
        <div
          className="absolute rounded-full border-2 border-dashed pointer-events-none transition-all duration-100 ease-out"
          style={{
            borderColor: arrowPrompt === 'UP' ? '#39C5BB' : arrowPrompt === 'RIGHT' ? '#FFB74D' : arrowPrompt === 'DOWN' ? '#EC407A' : '#BA68C8',
            width: `${120 * pulseRingScale}px`,
            height: `${120 * pulseRingScale}px`,
            opacity: 1.2 - pulseRingScale,
          }}
        />

        {/* Absolute prompt indicator */}
        <div
          className={`w-28 h-28 rounded-full border-4 flex items-center justify-center bg-slate-950 transition-all shadow-lg ${themeConfig.border} ${themeConfig.glow}`}
        >
          <div className={`${themeConfig.text} animate-pulse flex flex-col items-center`}>
            {getArrowIcon(arrowPrompt)}
            <span className="text-[9px] font-mono tracking-widest font-extrabold mt-1 uppercase">{arrowPrompt}</span>
          </div>
        </div>

        {/* Drag Line feedback indicator */}
        {flickFeedbackDir && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            <div className={`scale-150 animate-ping opacity-80 ${getPromptTheme(flickFeedbackDir).text}`}>
              {getArrowIcon(flickFeedbackDir, "w-24 h-24")}
            </div>
          </div>
        )}

        {/* Bottom indicator speed info */}
        <div className="absolute bottom-4 flex flex-col items-center">
          <span className="text-[9px] font-mono text-slate-400">FLICK ACTION ZONE</span>
          <span className="text-[8px] text-slate-500 mt-0.5">高速フリック ⚡ SPEED LIMIT: {REQUIRED_SPEED} px/ms</span>
        </div>
      </div>

      {/* Timing Helper Instructions */}
      <div className="w-full max-w-sm bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs text-slate-400 z-10">
        <div className="flex flex-col items-center">
          <span className="text-cyan-400 font-bold">PERFECT!</span>
          <span className="text-[9px] text-slate-500">±0.14s + 高速</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800" />
        <div className="flex flex-col items-center">
          <span className="text-yellow-400 font-bold">GOOD</span>
          <span className="text-[9px] text-slate-500">±0.32s</span>
        </div>
        <div className="h-4 w-[1px] bg-slate-800" />
        <div className="flex flex-col items-center">
          <span className="text-red-400 font-bold">MISS</span>
          <span className="text-[9px] text-slate-500">タイミングずれ/低速</span>
        </div>
      </div>

      {/* Cyber decorations (literal labels) */}
      <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
        Magical Mirai 2026 Timing Engine
      </div>
    </div>
  );
};
