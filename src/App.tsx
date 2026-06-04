import React, { useState, useEffect } from 'react';
import { TitleView } from './components/TitleView';
import { RhythmGameView } from './components/RhythmGameView';
import { GachaResultView } from './components/GachaResultView';
import { CollectionView } from './components/CollectionView';
import { CompleteLiveView } from './components/CompleteLiveView';
import { TimingRating, FlickScore, CollectionState, Song } from './types';
import { SONGS } from './data';
import { audioEngine } from './audioEngine';
import { Sparkles, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'magical_capsule_collection';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'TITLE' | 'GAME' | 'RESULT' | 'COLLECTION' | 'COMPLETE_STAGE'>('TITLE');
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS[0]);
  const [collection, setCollection] = useState<CollectionState>({
    ownedIds: [],
    pullCount: 0,
    lastPulledId: null,
  });

  // Timings from active play
  const [currentRating, setCurrentRating] = useState<TimingRating>('GOOD');
  const [sessionScores, setSessionScores] = useState<FlickScore[]>([]);

  // Theatrical completed modal
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.ownedIds)) {
          setCollection(parsed);
        }
      }
    } catch (e) {
      console.error("Local storage restoration failed", e);
    }
    // Pre-initialize audioEngine
    audioEngine.init();
  }, []);

  const saveCollection = (newCol: CollectionState) => {
    setCollection(newCol);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCol));
    } catch (e) {
      console.warn("Storage write blocked", e);
    }
  };

  const handleGameComplete = (overallRating: TimingRating, scores: FlickScore[]) => {
    setCurrentRating(overallRating);
    setSessionScores(scores);
    setActiveScreen('RESULT');
  };

  const handleItemAcquired = (id: number) => {
    const isNew = !collection.ownedIds.includes(id);
    const updatedOwned = isNew ? [...collection.ownedIds, id] : collection.ownedIds;
    
    const updatedState: CollectionState = {
      ownedIds: updatedOwned,
      pullCount: collection.pullCount + 1,
      lastPulledId: id,
    };

    saveCollection(updatedState);

    // Trigger complete live sequence if we just hit 10/10 items for the first time!
    if (isNew && updatedOwned.length === 10) {
      setTimeout(() => {
        setShowCelebrationBanner(true);
      }, 800);
    }
  };

  const handleResetCollection = () => {
    const fresh: CollectionState = {
      ownedIds: [],
      pullCount: 0,
      lastPulledId: null,
    };
    saveCollection(fresh);
    setShowCelebrationBanner(false);
    setActiveScreen('TITLE');
  };

  const launchCompletedLiveStage = () => {
    setShowCelebrationBanner(false);
    setActiveScreen('COMPLETE_STAGE');
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center font-sans antialiased">
      {/* Desktop Frame Bordering */}
      <div 
        id="applet-main-frame" 
        className="w-full max-w-md h-screen max-h-[850px] bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between border-y-0 sm:border-x-4 border-slate-900 sm:rounded-3xl"
      >
        {/* Core Screen Routing */}
        {activeScreen === 'TITLE' && (
          <TitleView
            collection={collection}
            onStartGame={() => setActiveScreen('GAME')}
            onViewCollection={() => {
              if (collection.ownedIds.length === 10) {
                setActiveScreen('COMPLETE_STAGE');
              } else {
                setActiveScreen('COLLECTION');
              }
            }}
            selectedSong={selectedSong}
            onSelectSong={setSelectedSong}
          />
        )}

        {activeScreen === 'GAME' && (
          <RhythmGameView
            selectedSong={selectedSong}
            onGameComplete={handleGameComplete}
            onExit={() => setActiveScreen('TITLE')}
          />
        )}

        {activeScreen === 'RESULT' && (
          <GachaResultView
            timingRating={currentRating}
            scores={sessionScores}
            onRollAgain={() => setActiveScreen('GAME')}
            onViewCollection={() => {
              if (collection.ownedIds.length === 10) {
                setActiveScreen('COMPLETE_STAGE');
              } else {
                setActiveScreen('COLLECTION');
              }
            }}
            onItemAcquired={handleItemAcquired}
          />
        )}

        {activeScreen === 'COLLECTION' && (
          <CollectionView
            collection={collection}
            onBack={() => setActiveScreen('TITLE')}
            onResetCollection={handleResetCollection}
          />
        )}

        {activeScreen === 'COMPLETE_STAGE' && (
          <CompleteLiveView
            onBack={() => setActiveScreen('COLLECTION')}
          />
        )}

        {/* 10/10 COMPLETE THEATRICAL MODAL OVERLAY */}
        {showCelebrationBanner && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-3xl animate-bounce shadow-lg">
              👑
            </div>

            <div className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mt-4 select-none">
              <h2 className="text-2xl font-black tracking-tight leading-none">
                THANK YOU COMPLETE!
              </h2>
              <p className="text-xs font-bold mt-1 tracking-widest text-[#39C5BB]">
                コプリート達成！
              </p>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-xs">
              すべてのアクリルキーホルダーが揃いました！<br />
              マジカルミライ 2026 特設バーチャルライブステージへご案内します。
            </p>

            {/* Launch live event */}
            <button
              onClick={launchCompletedLiveStage}
              className="mt-6 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-white font-extrabold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_#39C5BB] cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              特設ライブステージへ進む
            </button>

            {/* Dismiss modal temporarily */}
            <button
              onClick={() => setShowCelebrationBanner(false)}
              className="mt-4 p-2 text-slate-500 hover:text-slate-300 text-[10px] font-mono tracking-widest flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
