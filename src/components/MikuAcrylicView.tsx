import React, { useState } from 'react';

interface MikuAcrylicViewProps {
  iconType: 'classic' | 'retro' | 'ribbon' | 'space' | 'festival' | 'hero' | 'sakura' | 'cyber' | 'snow' | 'magic2026';
  size?: number;
  glow?: boolean;
  isUnlocked?: boolean;
}

export const MikuAcrylicView: React.FC<MikuAcrylicViewProps> = ({
  iconType,
  size = 200,
  glow = true,
  isUnlocked = true,
}) => {
  const [jiggle, setJiggle] = useState(false);

  const triggerJiggle = () => {
    if (!isUnlocked) return;
    setJiggle(true);
    setTimeout(() => setJiggle(false), 900);
  };

  // Dynamic style parameters based on Miku version
  const colors: Record<string, { hair: string; hairGlow: string; accent: string; outfit: string; darkOutfit: string }> = {
    classic: { hair: '#39C5BB', hairGlow: '#00F5D4', accent: '#E04F8A', outfit: '#EEEEEE', darkOutfit: '#455A64' },
    retro: { hair: '#FFCC00', hairGlow: '#FFEB3B', accent: '#39C5BB', outfit: '#4A148C', darkOutfit: '#311B92' },
    ribbon: { hair: '#F48FB1', hairGlow: '#FF4081', accent: '#4DD0E1', outfit: '#ECEFF1', darkOutfit: '#37474F' },
    space: { hair: '#B39DDB', hairGlow: '#D1C4E9', accent: '#FFD54F', outfit: '#311B92', darkOutfit: '#1A237E' },
    festival: { hair: '#FF7043', hairGlow: '#FF5722', accent: '#26A69A', outfit: '#FFCCBC', darkOutfit: '#D84315' },
    hero: { hair: '#EC407A', hairGlow: '#F50057', accent: '#5C6BC0', outfit: '#263238', darkOutfit: '#BF360C' },
    sakura: { hair: '#FF8A80', hairGlow: '#FF5252', accent: '#80D8FF', outfit: '#FCE4EC', darkOutfit: '#880E4F' },
    cyber: { hair: '#00E676', hairGlow: '#00FA9A', accent: '#D500F9', outfit: '#212121', darkOutfit: '#111111' },
    snow: { hair: '#80DEEA', hairGlow: '#E0F7FA', accent: '#FFFFFF', outfit: '#E0F2F1', darkOutfit: '#006064' },
    magic2026: { hair: 'url(#holoGrad)', hairGlow: '#E040FB', accent: '#1DE9B6', outfit: '#000000', darkOutfit: '#212121' },
  };

  const scheme = colors[iconType] || colors.classic;

  return (
    <div
      onClick={triggerJiggle}
      style={{ width: size, height: size }}
      className={`relative select-none flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
        isUnlocked ? 'hover:scale-105 active:scale-95' : 'contrast-50 brightness-50'
      } ${jiggle ? 'animate-[bounce_0.4s_ease-in-out_infinite] scale-110 rotate-3' : ''}`}
    >
      {/* Acrylic Glass Cut Glow Backplate */}
      {glow && isUnlocked && (
        <div
          className="absolute inset-4 rounded-3xl blur-xl opacity-35 transition-all duration-700 animate-pulse"
          style={{
            backgroundColor: iconType === 'magic2026' ? '#FF26F3' : scheme.hairGlow,
            transform: 'scale(1.15)',
          }}
        />
      )}

      {/* Styled Acrylic Frame */}
      <div 
        id={`acrylic-body-${iconType}`}
        className="w-full h-full relative aspect-square bg-[#0c142c]/40 backdrop-blur-md rounded-2xl border-4 p-4 flex flex-col items-center justify-between"
        style={{
          borderColor: isUnlocked ? scheme.hair : '#374151',
          boxShadow: isUnlocked 
            ? `0 0 15px ${scheme.hairGlow}aa, inset 0 0 10px rgba(255, 255, 255, 0.15)` 
            : 'none'
        }}
      >
        {/* Hanger Ring Hole */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border bg-[#111827] flex items-center justify-center"
          style={{ borderColor: isUnlocked ? scheme.accent : '#4B5563' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </div>

        {/* Floating sparkles for high rarities */}
        {isUnlocked && (iconType === 'magic2026' || iconType === 'snow' || iconType === 'cyber' || iconType === 'sakura') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span className="absolute top-6 left-6 text-xs animate-[ping_1.5s_infinite] text-yellow-300">✦</span>
            <span className="absolute bottom-8 right-6 text-sm animate-[ping_2s_infinite] text-cyan-200" style={{ animationDelay: '0.5s' }}>✦</span>
            <span className="absolute top-1/2 left-4 text-xs animate-[ping_1.8s_infinite] text-pink-400" style={{ animationDelay: '1s' }}>★</span>
          </div>
        )}

        {/* Silhouette Overlay for Locked Keychains */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-xl z-20">
            <span className="text-3xl text-gray-500">🔒</span>
            <span className="text-[10px] tracking-widest font-mono text-gray-600 uppercase mt-2">Locked</span>
          </div>
        )}

        {/* Vector SVG Design */}
        <div className="w-full flex-grow flex items-center justify-center mt-3 scale-105">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <defs>
              <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB1DF2" />
                <stop offset="35%" stopColor="#1DE9B6" />
                <stop offset="70%" stopColor="#2979FF" />
                <stop offset="100%" stopColor="#AA00FF" />
              </linearGradient>
              <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E676" />
                <stop offset="100%" stopColor="#006064" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
            </defs>

            {/* Stylized Headphones Rings Background */}
            <circle cx="60" cy="55" r="32" fill="none" stroke={isUnlocked ? scheme.accent : '#555'} strokeWidth="1" strokeDasharray="4,4" className="animate-[spin_40s_linear_infinite]" />
            <circle cx="60" cy="55" r="38" fill="none" stroke={isUnlocked ? scheme.hair : '#444'} strokeWidth="1.5" strokeDasharray="16,10" className="animate-[spin_25s_linear_infinite]" />

            {/* TWIN TAILS (Distinct vectors based on iconType) */}
            {iconType === 'classic' && (
              <>
                {/* Left Twin Tail */}
                <path d="M45 42 C10 30 5 95 30 100 C15 95 20 50 45 48 Z" fill={scheme.hair} />
                <path d="M40 45 C15 35 15 85 30 90" stroke={scheme.hairGlow} strokeWidth="1.5" fill="none" />
                {/* Right Twin Tail */}
                <path d="M75 42 C110 30 115 95 90 100 C105 95 100 50 75 48 Z" fill={scheme.hair} />
                <path d="M80 45 C105 35 105 85 90 90" stroke={scheme.hairGlow} strokeWidth="1.5" fill="none" />
              </>
            )}

            {iconType === 'retro' && (
              <>
                {/* Ribbon Tail Curves Yellow */}
                <path d="M45 45 C15 5 10 75 35 90 C20 70 25 35 45 45" fill={scheme.hair} />
                <path d="M75 45 C105 5 110 75 85 90 C100 70 95 35 75 45" fill={scheme.hair} />
                {/* Star bubbles */}
                <circle cx="20" cy="40" r="3" fill="#FFF" />
                <circle cx="100" cy="40" r="3" fill="#FFF" />
              </>
            )}

            {iconType === 'ribbon' && (
              <>
                {/* Fluffy balloon ribbons Pink */}
                <path d="M44 48 C15 38 10 95 35 105 C25 80 32 60 44 52" fill={scheme.hair} />
                <path d="M76 48 C105 38 110 95 85 105 C95 80 88 60 76 52" fill={scheme.hair} />
                <circle cx="34" cy="100" r="4" fill={scheme.accent} />
                <circle cx="86" cy="100" r="4" fill={scheme.accent} />
              </>
            )}

            {iconType === 'space' && (
              <>
                {/* Floating mechanical ring/wing tails Lavender */}
                <path d="M45 42 C10 15 5 65 30 85 C15 65 25 45 45 45" fill={scheme.hair} />
                <path d="M75 42 C110 15 115 65 90 85 C105 65 95 45 75 45" fill={scheme.hair} />
                {/* Orbital Gold Rings */}
                <ellipse cx="60" cy="55" rx="42" ry="10" fill="none" stroke="url(#goldGrad)" strokeWidth="2" transform="rotate(-15 60 55)" />
              </>
            )}

            {iconType === 'festival' && (
              <>
                {/* Fiery wave firecracker hair Orange */}
                <path d="M44 45 C20 20 15 80 15 102 C30 88 35 60 44 48" fill={scheme.hair} />
                <path d="M76 45 C100 20 105 80 105 102 C90 88 85 60 76 48" fill={scheme.hair} />
                {/* Floating Lantern silhouette */}
                <rect x="22" y="85" width="8" height="12" rx="2" fill={scheme.accent} />
                <rect x="90" y="85" width="8" height="12" rx="2" fill={scheme.accent} />
              </>
            )}

            {iconType === 'hero' && (
              <>
                {/* Spiky star wing hair HotPink */}
                <path d="M44 45 C10 30 5 70 20 105 C25 85 40 65 44 45" fill={scheme.hair} />
                <path d="M76 45 C110 30 115 70 100 105 C95 85 80 65 76 45" fill={scheme.hair} />
                {/* Red Hero Cape wings */}
                <path d="M40 60 L15 100 L30 101 Z" fill={scheme.accent} />
                <path d="M80 60 L105 100 L90 101 Z" fill={scheme.accent} />
              </>
            )}

            {iconType === 'sakura' && (
              <>
                {/* Graceful fan blossom shapes LightPink */}
                <path d="M44 43 C15 15 5 80 25 105 C15 85 30 60 44 48" fill={scheme.hair} />
                <path d="M76 43 C105 15 115 80 95 105 C105 85 90 60 76 48" fill={scheme.hair} />
                {/* Cherry blossom floating emblems */}
                <path d="M15 45 C12 40 18 35 20 40 C22 35 28 40 25 45 Z" fill={scheme.accent} />
                <path d="M105 45 C102 40 108 35 110 40 C112 35 118 40 115 45 Z" fill={scheme.accent} />
              </>
            )}

            {iconType === 'cyber' && (
              <>
                {/* Electric cyber lightning hair AcidGreen */}
                <path d="M44 44 L15 35 L28 72 L18 80 L36 102 L38 60 Z" fill="url(#cyberGrad)" />
                <path d="M76 44 L105 35 L92 72 L102 80 L84 102 L82 60 Z" fill="url(#cyberGrad)" />
                {/* Tech blocks */}
                <rect x="15" y="48" width="6" height="6" fill={scheme.accent} />
                <rect x="99" y="48" width="6" height="6" fill={scheme.accent} />
              </>
            )}

            {iconType === 'snow' && (
              <>
                {/* Crystal iced diamond blue hair */}
                <path d="M44 43 C15 25 5 80 22 108 C22 80 32 60 44 48" fill={scheme.hair} />
                <path d="M76 43 C105 25 115 80 98 108 C98 80 88 60 76 48" fill={scheme.hair} />
                {/* Snowflake diamonds */}
                <path d="M15 70 L20 62 L25 70 L20 78 Z" fill="#FFF" />
                <path d="M100 70 L105 62 L110 70 L105 78 Z" fill="#FFF" />
              </>
            )}

            {iconType === 'magic2026' && (
              <>
                {/* Over-the-top Holo rainbow cosmic wings */}
                <path d="M46 40 C-8 15 -10 98 25 112 C10 90 28 55 46 45 Z" fill={scheme.hair} />
                <path d="M74 40 C128 15 130 98 95 112 C110 90 92 55 74 45 Z" fill={scheme.hair} />
                {/* Rainbow sparkle rings */}
                <circle cx="60" cy="55" r="48" fill="none" stroke="url(#holoGrad)" strokeWidth="3" strokeDasharray="30,10" className="animate-[spin_10s_linear_infinite]" />
              </>
            )}

            {/* CHIBI HEAD & BODY COMPOSITION */}
            {/* Neck & Shoulder base */}
            <path d="M54 75 L66 75 L62 86 L58 86 Z" fill="#FCE4EC" />
            <path d="M48 84 L72 84 L78 102 L42 102 Z" fill={scheme.outfit} />
            {/* Sleeves */}
            <path d="M44 86 L40 102 L48 102 Z" fill={scheme.darkOutfit} />
            <path d="M76 86 L80 102 L72 102 Z" fill={scheme.darkOutfit} />

            {/* Neon Chest Tie */}
            <path d="M59 84 L61 84 L63 94 L57 94 Z" fill={scheme.accent} />

            {/* Chubby Chibi Face */}
            <circle cx="60" cy="55" r="22" fill="#FFE0B2" />
            <path d="M38 52 C38 35 82 35 82 52 Z" fill={scheme.darkOutfit} /> {/* Hair back cap */}

            {/* Beautiful Chibi Anime Eyes */}
            {iconType === 'cyber' ? (
              /* Cyber Glow Visor Glasses */
              <rect x="44" y="48" width="32" height="8" rx="2" fill={scheme.accent} className="animate-pulse" />
            ) : (
              <>
                {/* Left Eye */}
                <ellipse cx="50" cy="54" rx="4" ry="6" fill={scheme.darkOutfit} />
                <ellipse cx="49" cy="52" rx="1.5" ry="2.5" fill="#FFF" />
                <circle cx="51" cy="56" r="1" fill={scheme.hairGlow} />
                {/* Right Eye */}
                <ellipse cx="70" cy="54" rx="4" ry="6" fill={scheme.darkOutfit} />
                <ellipse cx="69" cy="52" rx="1.5" ry="2.5" fill="#FFF" />
                <circle cx="71" cy="56" r="1" fill={scheme.hairGlow} />
              </>
            )}

            {/* Red Blushing Cheeks */}
            <circle cx="45" cy="59" r="2" fill="#FF8A80" opacity="0.6" />
            <circle cx="75" cy="59" r="2" fill="#FF8A80" opacity="0.6" />

            {/* Smile Mouth */}
            <path d="M58 61 Q60 63 62 61" fill="none" stroke={scheme.darkOutfit} strokeWidth="1.5" strokeLinecap="round" />

            {/* Cute Front Bangs */}
            <path d="M38 48 Q50 35 60 48 Q70 35 82 48 Q70 42 60 52 Q50 42 38 48 Z" fill={scheme.hair} />

            {/* Star Eyes / Sparkly accents */}
            {iconType === 'magic2026' && (
              <path d="M60 38 L62 44 L68 44 L63 48 L65 54 L60 50 L55 54 L57 48 L52 44 L58 44 Z" fill="#FFD54F" />
            )}

            {/* Hair Accessories (Classic Cyber Ribbons / Hats) */}
            {iconType === 'retro' && (
              /* Tiny Silk Hat */
              <path d="M48 34 L72 34 L68 18 L52 18 Z" fill="#212121" />
            )}
            {iconType === 'classic' && (
              <>
                <rect x="36" y="38" width="5" height="10" rx="1" fill={scheme.accent} />
                <rect x="79" y="38" width="5" height="10" rx="1" fill={scheme.accent} />
              </>
            )}
            {iconType === 'ribbon' && (
              <>
                <circle cx="38" cy="40" r="5" fill={scheme.accent} />
                <circle cx="82" cy="40" r="5" fill={scheme.accent} />
              </>
            )}
          </svg>
        </div>

        {/* Human Literal Rarity Badge */}
        <div className="w-full text-center mt-1 z-10">
          <p
            className="text-[10px] font-mono tracking-wider font-extrabold px-2 py-0.5 rounded-full inline-block uppercase"
            style={{
              backgroundColor: isUnlocked ? `${scheme.accent}20` : '#374151',
              color: isUnlocked ? scheme.accent : '#9CA3AF',
              border: `1px solid ${isUnlocked ? scheme.accent : '#4B5563'}`
            }}
          >
            {iconType === 'magic2026' ? '✨ SECRET' : iconType === 'cyber' || iconType === 'snow' || iconType === 'sakura' ? '💎 ULTRA RARE' : iconType === 'festival' || iconType === 'hero' ? '⭐ SUPER RARE' : iconType === 'space' || iconType === 'ribbon' ? '✦ RARE' : 'NORMAL'}
          </p>
          <h4
            className="text-xs font-bold truncate mt-1 tracking-tight text-white"
          >
            {iconType === 'magic2026' ? 'マジカル 2026' : iconType === 'cyber' ? 'マジカル 2025' : iconType === 'sakura' ? 'マジカル 2024' : iconType === 'hero' ? 'マジカル 2023' : iconType === 'festival' ? 'マジカル 2020' : iconType === 'space' ? 'マジカル 2018' : iconType === 'ribbon' ? 'マジカル 2016' : iconType === 'retro' ? 'マジカル 2013' : iconType === 'snow' ? '雪ミク・メモリア' : 'クラシック・ミク'}
          </h4>
        </div>

        {/* Acrylic Support Desk Stand Bottom */}
        <div 
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2/3 h-2 rounded-t-sm z-30"
          style={{
            backgroundColor: isUnlocked ? `${scheme.hair}aa` : '#4B5563',
            border: `1px solid ${isUnlocked ? scheme.hairGlow : '#374151'}`,
            boxShadow: isUnlocked ? `0 0 10px ${scheme.hairGlow}` : 'none'
          }}
        />
      </div>
    </div>
  );
};
