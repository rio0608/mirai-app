import React, { useState, useEffect } from 'react';
import { GachaItem, TimingRating, FlickScore } from '../types';
import { GACHA_ITEMS, getGachaProbability } from '../data';
import { MikuAcrylicView } from './MikuAcrylicView';
import { audioEngine } from '../audioEngine';
import { RefreshCw, BookOpen, Sparkles, Award } from 'lucide-react';

interface GachaResultViewProps {
  timingRating: TimingRating;
  scores: FlickScore[];
  onRollAgain: () => void;
  onViewCollection: () => void;
  onItemAcquired: (id: number) => void;
}

export const GachaResultView: React.FC<GachaResultViewProps> = ({
  timingRating,
  scores,
  onRollAgain,
  onViewCollection,
  onItemAcquired,
}) => {
  const [isRolling, setIsRolling] = useState(true);
  const [pulledItem, setPulledItem] = useState<GachaItem | null>(null);

  useEffect(() => {
    // 1. Play capsule rolling FX
    audioEngine.playCapsuleRoll();

    // 2. Compute dynamic probability distribution based on skill rating
    const probabilities = getGachaProbability(timingRating);
    
    // Choose rarity using weight-based roulette choice
    const roll = Math.random() * 100;
    let selectedRarity: 'Normal' | 'Rare' | 'SuperRare' | 'UltraRare' | 'Secret' = 'Normal';

    let cumulative = 0;
    const rarities: ('Normal' | 'Rare' | 'SuperRare' | 'UltraRare' | 'Secret')[] = [
      'Normal', 'Rare', 'SuperRare', 'UltraRare', 'Secret'
    ];

    for (const rarity of rarities) {
      cumulative += probabilities[rarity];
      if (roll <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }

    // 3. Filter items by selected rarity
    const matches = GACHA_ITEMS.filter(item => item.rarity === selectedRarity);
    const chosen = matches.length > 0 
      ? matches[Math.floor(Math.random() * matches.length)] 
      : GACHA_ITEMS[0]; // fallback

    setPulledItem(chosen);

    // 4. End rolling sequence after 1.8 seconds & trigger prize fanfare
    const timer = setTimeout(() => {
      setIsRolling(false);
      audioEngine.playPullFanfare(chosen.rarity);
      onItemAcquired(chosen.id);
    }, 1800);

    return () => clearTimeout(timer);
  }, [timingRating]);

  if (isRolling || !pulledItem) {
    return (
      <div id="gacha-loading-screen" className="flex flex-col items-center justify-center h-full bg-slate-950 text-white p-6 relative overflow-hidden">
        {/* Glowing concentric background loops */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/10 animate-ping opacity-30" />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-pink-500/20 animate-spin opacity-20" style={{ animationDuration: '15s' }} />
        
        {/* Capsule Tumbling Graphics */}
        <div className="relative w-40 h-40 flex items-center justify-center animate-bounce">
          {/* Half cyan / half pink gacha capsule ball */}
          <div className="w-28 h-28 rounded-full border-4 border-slate-900 bg-gradient-to-r from-cyan-400 via-slate-950 to-pink-500 shadow-2xl flex items-center justify-center relative overflow-hidden animate-[spin_1.5s_infinite]">
            <div className="absolute w-full h-1 bg-black/80" />
            <div className="absolute w-4 h-4 rounded-full bg-white border border-black/80" />
          </div>
        </div>

        {/* Dynamic status line */}
        <div className="text-center mt-6 z-10">
          <p className="text-[#39C5BB] font-mono text-[11px] font-bold tracking-[0.2em] uppercase animate-pulse">
            CYBER_CAPSULE_ROLLING
          </p>
          <h2 className="text-sm font-extrabold text-slate-400 mt-2">
            カプセル射出中。タイミングから確率を錬成しています...
          </h2>
        </div>

        {/* Display rating helper on loading */}
        <div className="absolute bottom-10 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center max-w-sm">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF4081]">RHYTHM RESULT INFLUENCE</span>
          <p className="text-xs text-white mt-1">あなたの評価: <span className="font-extrabold text-cyan-400">{timingRating}</span> に基づくブースト完了！</p>
        </div>
      </div>
    );
  }

  // Loaded Prize Screen
  const probabilitiesTable = getGachaProbability(timingRating);

  return (
    <div id="gacha-result-screen" className="flex flex-col items-center justify-between h-full bg-slate-950 p-6 text-white overflow-y-auto relative">
      {/* Visual background lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Title result banner */}
      <div className="text-center z-10 mt-2">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Gacha Results Revealed
        </span>
        <h2 className="text-lg font-black text-white mt-2 flex items-center justify-center gap-1.5 leading-tight">
          キーホルダー獲得！ <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        </h2>
      </div>

      {/* Main prize presentation frame */}
      <div className="w-full flex flex-col items-center justify-center my-4 z-10">
        {/* Dynamic spotlights */}
        <div className="absolute w-44 h-44 rounded-full blur-[80px] opacity-40 animate-pulse"
          style={{ backgroundColor: pulledItem.themeColor }}
        />

        <MikuAcrylicView
          iconType={pulledItem.iconType}
          size={210}
          glow={true}
          isUnlocked={true}
        />

        {/* Lore & Details card */}
        <div className="w-full max-w-sm bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 text-center mt-6 shadow-xl">
          <div className="flex justify-center items-center gap-1.5">
            <span className="text-xl">{pulledItem.emoji}</span>
            <span className="text-lg font-black font-mono tracking-tight" style={{ color: pulledItem.themeColor }}>
              {pulledItem.name}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5 italic">
            「 {pulledItem.title} 」
          </p>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed text-left bg-slate-950/50 p-3 rounded-lg font-sans border border-slate-850">
            {pulledItem.desc}
          </p>
        </div>
      </div>

      {/* Interactive Probability influence summary block */}
      <div className="w-full max-w-sm bg-slate-900/50 rounded-xl border border-slate-850 p-3 flex flex-col gap-2 z-10 text-xs">
        <div className="flex justify-between items-center text-slate-400 font-mono text-[10px]">
          <span>SKILL BOOSTER STATE</span>
          <span className="font-extrabold text-cyan-400">{timingRating} PERFORMANCE</span>
        </div>

        {/* Small horizontal bars mapping probability values */}
        <div className="grid grid-cols-2 gap-2 text-[10px] mt-1 text-slate-400 font-medium">
          <div>NORMAL: <span className="text-slate-300 font-mono font-bold">{probabilitiesTable.Normal}%</span></div>
          <div>RARE: <span className="text-purple-300 font-mono font-bold">{probabilitiesTable.Rare}%</span></div>
          <div>SUPER RARE: <span className="text-amber-400 font-mono font-bold">{probabilitiesTable.SuperRare}%</span></div>
          <div>ULTRA RARE: <span className="text-cyan-400 font-mono font-bold">{probabilitiesTable.UltraRare}%</span></div>
        </div>

        {pulledItem.rarity === 'Secret' ? (
          <div className="bg-purple-950/40 border border-purple-500/30 text-[10px] rounded p-1.5 text-center font-bold text-pink-300 animate-pulse mt-1">
            🎉 奇跡！5%のPerfectシークレット枠を引き当てました！
          </div>
        ) : timingRating === 'PERFECT' ? (
          <div className="bg-cyan-950/40 border border-cyan-800/40 text-[9.5px] rounded p-1.5 text-center text-cyan-400 mt-1">
            ⭐ 5%の超低確率シークレット枠(Magical Mirai 2026)が開放されていました！
          </div>
        ) : (
          <div className="text-[9.5px] text-slate-500 text-center mt-1">
            💡 Perfect評価を獲得すると、シークレット(Magic 2026)獲得の扉が開きます！
          </div>
        )}
      </div>

      {/* Bottom control buttons */}
      <div className="w-full max-w-sm flex gap-3 z-10 mt-4">
        {/* Re-roll challenge play again */}
        <button
          onClick={onRollAgain}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-100 font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          もう一回引く！
        </button>

        {/* View compilation book album */}
        <button
          onClick={onViewCollection}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          図鑑を見る
        </button>
      </div>
    </div>
  );
};
