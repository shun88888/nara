import { create } from 'zustand';
import { getExperiences } from '../lib/mockApi';

export type Experience = {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  targetAge: string;
  durationMin: number;
  priceYen: number;
  photos: string[];
  isPublished: boolean;
};

type FetchParams = { area?: 'oimachi-line'; onlyAvailable?: boolean };

type ExperienceState = {
  experiences: Experience[];
  fetchExperiences: (params: FetchParams) => Promise<void>;
  getExperienceById: (id: string) => Experience | null;
};

// Seed data (Oimachi Line area)
const seed: Experience[] = [
  {
    id: 'exp_1',
    providerId: 'prov_1',
    providerName: '大井町ロボット教室',
    title: 'ロボット作り体験',
    description: 'ギアとモーターで動くロボットを組み立てて、プログラミングの基礎を学びます',
    targetAge: '6-12',
    durationMin: 90,
    priceYen: 3500,
    photos: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_2',
    providerId: 'prov_2',
    providerName: '自由が丘 陶芸工房',
    title: '親子で陶芸体験',
    description: '電動ろくろを使って本格的な器作りに挑戦',
    targetAge: '5-12',
    durationMin: 120,
    priceYen: 4000,
    photos: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_3',
    providerId: 'prov_3',
    providerName: '二子玉川アートスタジオ',
    title: '水彩画教室',
    description: 'プロの画家から学ぶ本格水彩画レッスン',
    targetAge: '8-15',
    durationMin: 60,
    priceYen: 2500,
    photos: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_4',
    providerId: 'prov_4',
    providerName: '九品仏クッキングラボ',
    title: '本格ピザ作り教室',
    description: '生地から作る本格ナポリピザ体験',
    targetAge: '6-14',
    durationMin: 90,
    priceYen: 3000,
    photos: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_5',
    providerId: 'prov_5',
    providerName: '尾山台ダンススタジオ',
    title: 'キッズダンスレッスン',
    description: 'ヒップホップダンスの基礎を楽しく学ぼう',
    targetAge: '5-12',
    durationMin: 60,
    priceYen: 2000,
    photos: ['https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_6',
    providerId: 'prov_6',
    providerName: '等々力プログラミング教室',
    title: 'Scratchでゲーム作り',
    description: '初めてのプログラミングで簡単なゲームを作成',
    targetAge: '7-13',
    durationMin: 90,
    priceYen: 3500,
    photos: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_7',
    providerId: 'prov_7',
    providerName: '上野毛音楽教室',
    title: 'ドラム体験レッスン',
    description: '本物のドラムセットで叩いてみよう',
    targetAge: '6-14',
    durationMin: 45,
    priceYen: 2500,
    photos: ['https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_8',
    providerId: 'prov_8',
    providerName: '田園調布サイエンスラボ',
    title: 'スライム作り実験教室',
    description: '科学の不思議を楽しく学ぶ実験体験',
    targetAge: '5-11',
    durationMin: 60,
    priceYen: 1800,
    photos: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_9',
    providerId: 'prov_9',
    providerName: '自由が丘フラワーショップ',
    title: 'フラワーアレンジメント',
    description: 'お花を使った可愛いアレンジメント作り',
    targetAge: '6-13',
    durationMin: 75,
    priceYen: 2800,
    photos: ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800'],
    isPublished: true,
  },
  {
    id: 'exp_10',
    providerId: 'prov_10',
    providerName: '大岡山スポーツクラブ',
    title: 'ボルダリング体験',
    description: '室内クライミングで体を動かそう',
    targetAge: '7-15',
    durationMin: 90,
    priceYen: 3200,
    photos: ['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'],
    isPublished: true,
  },
];

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: seed,
  fetchExperiences: async (params) => {
    // Use seed data directly for now
    set({ experiences: seed });
  },
  getExperienceById: (id) => get().experiences.find(e => e.id === id) ?? null,
}));


