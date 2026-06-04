import React, { useEffect, useRef, useState } from 'react';
import { GACHA_ITEMS } from '../data';
import { MikuAcrylicView } from './MikuAcrylicView';
import { Sparkles, ArrowLeft, Heart } from 'lucide-react';
import { audioEngine } from '../audioEngine';

interface CompleteLiveViewProps {
  onBack: () => void;
}

interface StickParticle {
  x: number;
  y: number;
  color: string;
  speedY: number;
  size: number;
  angle: number;
  waveSpeed: number;
}

export const CompleteLiveView: React.FC<CompleteLiveViewProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [showContents, setShowContents] = useState(false);

  useEffect(() => {
    // 1. Instantly trigger synthesized concert cheer SE & glorious synth fanfare
    audioEngine.init();
    audioEngine.playCheer();

    // Stagger visuals for theatrical impact
    const timer = setTimeout(() => {
      setShowContents(true);
    }, 400);

    // 2. Setup the Penlight (Cyalume) Canvas Particle Generator
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle initial sizing
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const particles: StickParticle[] = [];
    const colors = ['#39C5BB', '#EC407A', '#FFCC00', '#AB47BC', '#00FA9A', '#FF7043'];

    // Spawn initial sticks
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 1 + Math.random() * 2.5,
        size: 3 + Math.random() * 4,
        angle: Math.random() * Math.PI,
        waveSpeed: 0.02 + Math.random() * 0.03
      });
    }

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;
    const renderLoop = () => {
      frame++;
      ctx.fillStyle = 'rgba(6, 9, 24, 0.2)'; // fade trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render lights at stage floor
      const baseGlow = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
      baseGlow.addColorStop(0, 'rgba(57, 197, 187, 0)');
      baseGlow.addColorStop(1, 'rgba(57, 197, 187, 0.15)');
      ctx.fillStyle = baseGlow;
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

      // Draw moving particles representing waving pensticks
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.angle += p.waveSpeed;

        // Wave motion sway
        const shiftX = Math.sin(p.angle) * 12;

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;

        // Draw cyalume tube stick
        ctx.beginPath();
        ctx.ellipse(p.x + shiftX, p.y, p.size, p.size * 5, -0.1 + Math.sin(frame * 0.05) * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Wrap around bottom
        if (p.y < -40) {
          p.y = canvas.height + 40;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div id="complete-live-screen" className="relative flex flex-col items-center justify-between h-full bg-slate-950 text-white overflow-hidden p-6">
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Glassmorphic stage flare */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-blue-900/10 via-pink-500/5 to-transparent pointer-events-none z-0" />

      {/* Header Close Back button */}
      <div className="w-full max-w-sm flex justify-start items-center z-10 transition-all duration-500">
        <button
          onClick={onBack}
          className="text-xs bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 hover:text-[#39C5BB] py-1.5 px-3 rounded-full flex items-center gap-1.5 font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#39C5BB]" />
          図鑑に戻る
        </button>
      </div>

      {showContents ? (
        <div className="w-full flex flex-col items-center flex-grow justify-between z-10 mt-2">
          
          {/* Dynamic Laser Logo */}
          <div className="text-center animate-[pulse_3s_infinite] select-none">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#39C5BB] font-black uppercase block">
              ★ STAGE EVENT: SPECIAL CELEBRATION ★
            </span>
            <h1 className="text-xl font-black bg-gradient-to-r from-red-400 via-yellow-400 via-[#39C5BB] to-purple-500 bg-clip-text text-transparent tracking-tighter drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] mt-1">
              マジカルミライ 2026
            </h1>
            <p className="text-xs font-black text-slate-300 mt-1 uppercase tracking-wider">
              ✨ THANK YOU COMPLETE! ✨
            </p>
          </div>

          {/* Group Showcase Grid standing together! */}
          <div className="w-full max-w-[28rem] h-[55%] my-auto flex flex-col items-center justify-center relative bg-indigo-950/15 border border-slate-800/40 rounded-3xl p-4 overflow-hidden shadow-2xl">
            {/* Spotlight rays radiating */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#39C5BB]/10 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-5 gap-1.5 relative w-full h-full overflow-y-auto items-center justify-items-center p-2">
              {GACHA_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center animate-[bounce_3s_ease-in-out_infinite]"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <MikuAcrylicView
                    iconType={item.iconType}
                    size={64}
                    glow={false}
                    isUnlocked={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Live Stage Subtitle Text */}
          <div className="text-center max-w-sm px-4 py-3 bg-slate-900/80 backdrop-blur border border-slate-850 rounded-2xl">
            <div className="flex items-center justify-center gap-1.5 text-xs text-pink-400 font-extrabold">
              <Heart className="w-4 h-4 fill-pink-500" />
              <span>全種類コンプリート達成！</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-1 text-center font-medium">
              10種類のミクさんが特設ミニスリッドステージに大集合！<br />
              キーホルダーとしての質感を湛えながら、ステージの上であなたのリズムフリックへの感謝を奏でます。
            </p>
          </div>

          {/* Cyber signature branding */}
          <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mt-2 self-center text-center">
            Miku Magical Live Engine v.2026
          </div>
        </div>
      ) : (
        /* Dark transition frame */
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">
            LOADING LIVE ENGINE
          </p>
        </div>
      )}
    </div>
  );
};
