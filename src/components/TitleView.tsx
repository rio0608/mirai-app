import React, { useState } from 'react';
import { CollectionState, Song } from '../types';
import { GACHA_ITEMS, SONGS } from '../data';
import { Play, BookOpen, Music, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';
import { audioEngine } from '../audioEngine';

interface TitleViewProps {
  collection: CollectionState;
  onStartGame: () => void;
  onViewCollection: () => void;
  selectedSong: Song;
  onSelectSong: (song: Song) => void;
}

export const TitleView: React.FC<TitleViewProps> = ({
  collection,
  onStartGame,
  onViewCollection,
  selectedSong,
  onSelectSong,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const songIndex = SONGS.findIndex(s => s.id === selectedSong.id);

  const handlePrevSong = () => {
    const nextIdx = (songIndex - 1 + SONGS.length) % SONGS.length;
    onSelectSong(SONGS[nextIdx]);
    audioEngine.init();
    audioEngine.playTick(500, 0.08);
  };

  const handleNextSong = () => {
    const nextIdx = (songIndex + 1) % SONGS.length;
    onSelectSong(SONGS[nextIdx]);
    audioEngine.init();
    audioEngine.playTick(550, 0.08);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audioEngine.init();
    if (nextState) {
      audioEngine.setVolume(0.5);
      audioEngine.playTick(600, 0.1);
    } else {
      audioEngine.setVolume(0);
    }
  };

  const currentCount = collection.ownedIds.length;
  const isComplete = currentCount === 10;
  const percentage = Math.round((currentCount / 10) * 100);

  return (
    <div id="title-screen" className="flex flex-col items-center justify-between h-full bg-slate-950 p-6 text-white relative overflow-hidden">
      {/* Concert Crowd Sparkle Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
      
      {/* Wave glow columns */}
      <div className="absolute top-0 left-1/4 w-32 h-[80vh] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-1/4 w-32 h-[80vh] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* Top Header Controls */}
      <div className="w-full max-w-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 rounded-full py-1.5 px-3">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-[10px] tracking-wider text-slate-300">MAGICAL PROG 2026</span>
        </div>

        <button
          onClick={toggleSound}
          aria-label="Toggle Sound"
          className="p-2 rounded-full border bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 transition-all cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
        </button>
      </div>

      {/* Title Logo Group */}
      <div className="text-center z-10 flex flex-col items-center mt-2">
        <div className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent select-none">
          <h1 className="text-2xl font-black tracking-tighter leading-tight drop-shadow-[0_4px_16px_rgba(0,245,212,0.15)] uppercase">
            マジカル・リズム<br />カプセル！
          </h1>
          <p className="text-xs font-bold tracking-[0.25em] mt-1 text-pink-300/80 uppercase">
            〜響けフリック〜
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/40 rounded-full px-4 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-cyan-300 font-mono text-[10.5px] font-bold">新感覚・プレイヤースキル介入ガチャ</span>
        </div>
      </div>

      {/* Futuristic Gacha Cabinet Artwork */}
      <div className="w-full max-w-[240px] aspect-[4/5] bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/20 rounded-3xl p-4 shadow-2xl relative flex flex-col justify-between items-center z-10 my-4"
        style={{
          boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 30px rgba(57, 197, 187, 0.1)'
        }}
      >
        {/* Inside capsule sphere storage container */}
        <div className="w-full h-[55%] rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3 relative overflow-hidden flex flex-wrap gap-2 items-center justify-center">
          {/* Glass glare overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-white/10 pointer-events-none" />
          <div className="absolute top-1 left-2 text-[8px] font-mono text-cyan-400/40">CAPSULE_BAY_A</div>
          
          {/* Stylized Floating Spheres */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-slate-800 shadow-md animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-pink-400 to-slate-800 shadow-md animate-bounce" style={{ animationDelay: '0.4s' }} />
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-400 to-slate-800 shadow-md animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-purple-500 to-slate-800 shadow-md animate-bounce" style={{ animationDelay: '0.6s' }} />
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-slate-800 shadow-md animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-rose-500 to-slate-800 shadow-md animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Rolling Lever Knob */}
        <div className="relative w-16 h-16 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1 cursor-default group shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
            <div className="w-2 h-10 bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full" />
          </div>
        </div>

        {/* Capsule delivery dispenser bottom hole */}
        <div className="w-full h-[15%] bg-slate-950 rounded-xl relative border border-slate-800 overflow-hidden flex items-center justify-center">
          <div className="w-16 h-4 bg-slate-900/80 rounded" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 opacity-20 animate-ping" />
        </div>
      </div>

      {/* Song Selector Carousel */}
      <div className="w-full max-w-sm bg-slate-900/95 border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-1.5 z-10 transition-all shadow-lg">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> SELECT CHALLENGE SONG</span>
          <span className="text-[9px] bg-slate-850 px-1.5 py-0.5 rounded text-cyan-400">{songIndex + 1} / {SONGS.length}</span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-850">
          <button
            onClick={handlePrevSong}
            className="p-1 px-3 text-slate-400 hover:text-cyan-400 font-bold transition-all cursor-pointer active:scale-95"
            aria-label="Previous Song"
          >
            ◀
          </button>
          <div className="text-center overflow-hidden flex-grow px-2">
            <h3 className="text-xs font-black truncate text-cyan-300 tracking-tight">
              {selectedSong.title}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {selectedSong.artist} • <span className="text-pink-400 font-bold">BPM {selectedSong.bpm}</span>
            </p>
          </div>
          <button
            onClick={handleNextSong}
            className="p-1 px-3 text-slate-400 hover:text-cyan-400 font-bold transition-all cursor-pointer active:scale-95"
            aria-label="Next Song"
          >
            ▶
          </button>
        </div>
        
        <p className="text-[9.5px] text-slate-400 leading-normal line-clamp-1 italic text-center">
          "{selectedSong.desc}"
        </p>
      </div>

      {/* Action Navigation Panels */}
      <div className="w-full max-w-sm flex flex-col gap-3 z-10">
        
        {/* Play Main Trigger */}
        <button
          onClick={onStartGame}
          className="w-full group relative py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-extrabold tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-[0_4px_20px_rgba(57,197,187,0.3)] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          リズムに挑んで引く！(PLAY)
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 opacity-15 blur filter group-hover:opacity-30 transition pointer-events-none" />
        </button>

        {/* Album Progress Row */}
        <button
          onClick={onViewCollection}
          className="w-full py-3 px-6 rounded-2xl bg-slate-900/95 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-200 text-xs font-bold font-mono tracking-wider flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>コレクション図鑑を見る</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#39C5BB]15 text-[#39C5BB]'}`}>
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-400">{currentCount} / 10 Owned</span>
          </div>
        </button>
      </div>

      {/* Outer subtle license / credit indicator */}
      <footer className="text-[8.5px] font-mono text-slate-500/80 tracking-normal text-center mt-3 z-10 max-w-sm leading-relaxed">
        PCLに基づき許諾されたキャラクターアセットを利用しています。<br />
        © Crypton Future Media, INC. www.piapro.net
      </footer>
    </div>
  );
};
