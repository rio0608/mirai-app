import React, { useState } from 'react';
import { CollectionState } from '../types';
import { GACHA_ITEMS } from '../data';
import { MikuAcrylicView } from './MikuAcrylicView';
import { ArrowLeft, Sparkles, RefreshCcw, LayoutGrid } from 'lucide-react';
import { audioEngine } from '../audioEngine';

interface CollectionViewProps {
  collection: CollectionState;
  onBack: () => void;
  onResetCollection: () => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  collection,
  onBack,
  onResetCollection,
}) => {
  const [selectedItem, setSelectedItem] = useState<(typeof GACHA_ITEMS)[0] | null>(null);

  const currentCount = collection.ownedIds.length;
  const isComplete = currentCount === 10;
  const percentage = Math.round((currentCount / 10) * 100);

  const handleItemTap = (item: (typeof GACHA_ITEMS)[0]) => {
    setSelectedItem(item);
    audioEngine.init();
    if (collection.ownedIds.includes(item.id)) {
      audioEngine.playTick(440 + item.id * 50, 0.12);
    } else {
      audioEngine.playTick(180, 0.15); // low buzz for locked
    }
  };

  return (
    <div id="collection-screen" className="flex flex-col items-center justify-between h-full bg-slate-950 p-6 text-white overflow-y-auto relative">
      {/* Visual neon ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full max-w-sm flex justify-between items-center z-10 mt-1">
        <button
          onClick={onBack}
          className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 py-1.5 px-3.5 rounded-full flex items-center gap-1.5 font-bold transition-all cursor-pointer text-slate-300"
        >
          <ArrowLeft className="w-4 h-4 text-[#39C5BB]" />
          戻る
        </button>

        <h2 className="text-sm font-black font-mono flex items-center gap-1">
          <LayoutGrid className="w-4 h-4 text-pink-400" />
          コレクション図鑑
        </h2>
      </div>

      {/* Progress Indication Track */}
      <div className="w-full max-w-sm bg-slate-900/40 border border-slate-850 p-3.5 rounded-2xl text-center z-10 mt-4">
        <div className="flex justify-between items-center font-mono text-[11px] text-slate-400">
          <span>COMPLETION RATE</span>
          <span className={`font-black ${isComplete ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'}`}>
            {currentCount} / 10 KEYCHAINS ({percentage}%)
          </span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden mt-2 p-[2px] border border-slate-850">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#39C5BB] to-pink-500 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isComplete && (
          <p className="text-[10px] text-emerald-400 font-bold mt-2 animate-bounce flex items-center justify-center gap-1">
            ✨ THANK YOU COMPLETE! ライブ演出実施中！
          </p>
        )}
      </div>

      {/* Acrylic Display Stand Shelf (3x4 Layout) */}
      <div className="w-full max-w-sm bg-[#5c6bc0]/5 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 my-4 flex-grow z-10 overflow-y-auto"
        style={{
          boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          {GACHA_ITEMS.map((item) => {
            const isOwned = collection.ownedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleItemTap(item)}
                className="flex flex-col items-center justify-center"
              >
                <MikuAcrylicView
                  iconType={item.iconType}
                  size={120}
                  glow={false}
                  isUnlocked={isOwned}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lore Detail Panel if tapped */}
      {selectedItem && (
        <div className="w-full max-w-sm bg-slate-900/90 rounded-2xl border border-slate-800 p-4 z-10 mb-2 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: selectedItem.themeColor }}>
                NO.0{selectedItem.id} {selectedItem.rarity.toUpperCase()}
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {selectedItem.emoji} {selectedItem.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 py-0.5 px-1.5 rounded bg-slate-950 border border-slate-850"
            >
              閉じる
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
            {collection.ownedIds.includes(selectedItem.id) ? (
              selectedItem.desc
            ) : (
              <span className="text-slate-500 italic block text-center py-1">
                🔓 獲得条件: {selectedItem.rarity === 'Secret' ? 'Perfect判定時(極低確率)で射出。' : 'ガチャを複数回プレイすることで射出。'}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Reset Testing helper */}
      <div className="w-full max-w-sm z-10 text-center mt-2 flex flex-col gap-2">
        <button
          onClick={() => {
            if (window.confirm("これまでのコレクションデータをリセットしますか？")) {
              onResetCollection();
            }
          }}
          className="text-[10px] font-mono text-slate-600 hover:text-red-400 py-1 flex items-center justify-center gap-1.5 transition-all w-max mx-auto"
        >
          <RefreshCcw className="w-3 h-3" />
          RESET STORED DATA
        </button>

        <p className="text-[9px] text-slate-600 font-mono">
          アクリルキーホルダーをタップすると、ぷるん物理（jiggle）が作動します。
        </p>
      </div>
    </div>
  );
};
