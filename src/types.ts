export type Rarity = 'Normal' | 'Rare' | 'SuperRare' | 'UltraRare' | 'Secret';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  bpm: number;
  parameters: {
    video: {
      beatId: number;
      chordId: number;
      repetitiveSegmentId: number;
      lyricId: number;
      lyricDiffId: number;
    }
  };
  duration: string;
  desc: string;
}

export interface GachaItem {
  id: number;
  name: string;
  rarity: Rarity;
  title: string;
  desc: string;
  themeColor: string; // Tailwind-friendly hex or color
  accentColor: string;
  emoji: string;
  iconType: 'classic' | 'retro' | 'ribbon' | 'space' | 'festival' | 'hero' | 'sakura' | 'cyber' | 'snow' | 'magic2026';
}

export interface FlickInput {
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  angle: number;
  speed: number;
  timestamp: number;
}

export type TimingRating = 'PERFECT' | 'GOOD' | 'MISS';

export interface FlickScore {
  rating: TimingRating;
  offsetSec: number;
  speed: number;
  angle: number;
  expectedDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  actualDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
}

export interface GameSession {
  beatsTotal: number;
  currentBeatIndex: number;
  scores: FlickScore[];
  bpm: number;
}

export interface CollectionState {
  ownedIds: number[];
  pullCount: number;
  lastPulledId: number | null;
}
