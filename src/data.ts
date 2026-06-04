import { GachaItem, Song } from './types';

export const GACHA_ITEMS: GachaItem[] = [
  {
    id: 1,
    name: "クラシック・ミク",
    rarity: "Normal",
    title: "電脳の始まり",
    desc: "ターコイズブルーの美しいツインテールとデジタルメーターを搭載した絶対歌姫。すべてのメロディの原点。",
    themeColor: "#39C5BB",
    accentColor: "#E04F8A",
    emoji: "🎤",
    iconType: "classic"
  },
  {
    id: 2,
    name: "マジカルミライ 2013",
    rarity: "Normal",
    title: "魔法少女のシルクハット",
    desc: "大きなシルクハットとポップなリボンが特徴。初めて魔法がかけられた記念すべきステージ衣装。",
    themeColor: "#FFCC00",
    accentColor: "#39C5BB",
    emoji: "🎩",
    iconType: "retro"
  },
  {
    id: 3,
    name: "マジカルミライ 2016",
    rarity: "Rare",
    title: "サーカス・クラウン",
    desc: "カラフルな水玉模様と、サーカス団員をイメージした華やかなフリルが楽しい賑やかなミクさん。",
    themeColor: "#F48FB1",
    accentColor: "#4DD0E1",
    emoji: "🎪",
    iconType: "ribbon"
  },
  {
    id: 4,
    name: "マジカルミライ 2018",
    rarity: "Rare",
    title: "スペース・トラベラー",
    desc: "ゴールドの意匠としなやかなバルーンスカート。宇宙をどこまでも飛んでいくコズミックダンサー。",
    themeColor: "#B39DDB",
    accentColor: "#FFD54F",
    emoji: "🚀",
    iconType: "space"
  },
  {
    id: 5,
    name: "マジカルミライ 2020",
    rarity: "SuperRare",
    title: "まつりスピリット",
    desc: "インスピレーションの和風モダンハッピを羽織る。お囃子の太鼓に乗せて心踊る夏の夜のお姫様。",
    themeColor: "#FF7043",
    accentColor: "#26A69A",
    emoji: "🏮",
    iconType: "festival"
  },
  {
    id: 6,
    name: "マジカルミライ 2023",
    rarity: "SuperRare",
    title: "ファンタジー・ヒーロー",
    desc: "真っ赤なマントにスピーカーハンマーを構える。誰かのピンチに歌声で駆けつける、心のヒーロー姿。",
    themeColor: "#EC407A",
    accentColor: "#5C6BC0",
    emoji: "🛡️",
    iconType: "hero"
  },
  {
    id: 7,
    name: "マジカルミライ 2024",
    rarity: "UltraRare",
    title: "桜うたかた輪舞曲",
    desc: "艶やかな桜のグラデーションとしなやかな裾。和洋折衷のエレガントな魅力が咲き誇る、お花見歌姫。",
    themeColor: "#FF8A80",
    accentColor: "#80D8FF",
    emoji: "🌸",
    iconType: "sakura"
  },
  {
    id: 8,
    name: "マジカルミライ 2025",
    rarity: "UltraRare",
    title: "サイバー・ビジュアル・プラグ",
    desc: "ネオンを放つバイザーとダークレザーの光沢コート。グリッチノイズから生まれた超電磁パルスメロディ。",
    themeColor: "#00E676",
    accentColor: "#D500F9",
    emoji: "⚡",
    iconType: "cyber"
  },
  {
    id: 9,
    name: "雪ミク・メモリア",
    rarity: "UltraRare",
    title: "銀世界の氷像",
    desc: "まばゆいダイヤモンドダストから生まれた氷の結晶ドレス。澄み切った北国の風を運ぶ清廉な天使。",
    themeColor: "#80DEEA",
    accentColor: "#FFFFFF",
    emoji: "❄️",
    iconType: "snow"
  },
  {
    id: 10,
    name: "マジカルミライ 2026",
    rarity: "Secret",
    title: "響けフリック！虹のディーヴァ",
    desc: "マジカルミライ2026限定衣装！極低確率でPerfect判定時のみルート開通。虹色に輝くホログラフィック・カプセルから舞い降りる奇跡の天使。",
    themeColor: "#E040FB",
    accentColor: "#1DE9B6",
    emoji: "🌟",
    iconType: "magic2026"
  }
];

// Determine Gacha probabilities dynamically based on play quality (TimingRating)
export function getGachaProbability(rating: 'PERFECT' | 'GOOD' | 'MISS') {
  switch (rating) {
    case 'PERFECT':
      return {
        Normal: 15,
        Rare: 25,
        SuperRare: 30,
        UltraRare: 25,
        Secret: 5 // Secret unlocks!
      };
    case 'GOOD':
      return {
        Normal: 35,
        Rare: 35,
        SuperRare: 20,
        UltraRare: 10,
        Secret: 0 // Locked!
      };
    case 'MISS':
    default:
      return {
        Normal: 70,
        Rare: 20,
        SuperRare: 9,
        UltraRare: 1,
        Secret: 0 // Locked!
      };
  }
}

export const SONGS: Song[] = [
  {
    id: "kotaete",
    title: "こたえて",
    artist: "imie",
    url: "https://piapro.jp/t/6W2N/20251215164617",
    bpm: 135,
    parameters: {
      video: {
        beatId: 4827293,
        chordId: 2963754,
        repetitiveSegmentId: 3086261,
        lyricId: 126519,
        lyricDiffId: 28645
      }
    },
    duration: "3:40",
    desc: "エモーショナルなメロディと澄んだツインボーカル。心に深く語りかける名曲。"
  },
  {
    id: "after_the_curtain",
    title: "アフター・ザ・カーテン",
    artist: "Rulmry",
    url: "https://piapro.jp/t/zoqO/20251214200738",
    bpm: 170,
    parameters: {
      video: {
        beatId: 4827294,
        chordId: 2963755,
        repetitiveSegmentId: 3086262,
        lyricId: 126591,
        lyricDiffId: 28627
      }
    },
    duration: "3:15",
    desc: "疾走感あふれるロックサウンドとエネルギッシュなドラムライン。ステージの終わりを彩るアンセム。"
  },
  {
    id: "shutter_chance",
    title: "シャッターチャンス",
    artist: "夜未アガリ",
    url: "https://piapro.jp/t/PNpQ/20251209170719",
    bpm: 156,
    parameters: {
      video: {
        beatId: 4827295,
        chordId: 2963756,
        repetitiveSegmentId: 3086263,
        lyricId: 126542,
        lyricDiffId: 28628
      }
    },
    duration: "3:02",
    desc: "お洒落で軽快なポップチューン。一瞬のきらめきを切り取る爽やかなデジタルポップ。"
  },
  {
    id: "the_last_orchestra",
    title: "世界最後の音楽隊",
    artist: "夏山よつぎ×ど～ぱみん",
    url: "https://piapro.jp/t/B3yJ/20251215061727",
    bpm: 200,
    parameters: {
      video: {
        beatId: 4827296,
        chordId: 2963757,
        repetitiveSegmentId: 3086264,
        lyricId: 126594,
        lyricDiffId: 28629
      }
    },
    duration: "2:50",
    desc: "超速BPMと変幻自在なピアノジャズコア。ゲーム性抜群の最高難易度スピードチューン。"
  },
  {
    id: "tritclogy",
    title: "トリツクロジー",
    artist: "鶴三",
    url: "https://piapro.jp/t/QBdL/20251215094303",
    bpm: 124,
    parameters: {
      video: {
        beatId: 4827297,
        chordId: 2963758,
        repetitiveSegmentId: 3086265,
        lyricId: 126593,
        lyricDiffId: 28630
      }
    },
    duration: "3:25",
    desc: "妖しくもキャッチーな和風エレクトロニカ。不思議なリズムにフリックが吸い込まれる。"
  },
  {
    id: "takeover",
    title: "TAKEOVER",
    artist: "Twinfield",
    url: "https://piapro.jp/t/E2i3/20251215092113",
    bpm: 140,
    parameters: {
      video: {
        beatId: 4827298,
        chordId: 2963759,
        repetitiveSegmentId: 3086266,
        lyricId: 126533,
        lyricDiffId: 28631
      }
    },
    duration: "3:10",
    desc: "重低音ネオンダンスミュージック。近未来的なビートがプレイヤーの体を優しく揺らす。"
  }
];
