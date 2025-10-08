type CacheEntry<T> = { ts: number; data: T };

const cache = new Map<string, CacheEntry<any>>();
const TTL_MS = 30 * 60 * 1000; // 30m

function getCache<T>(key: string): T | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > TTL_MS) { cache.delete(key); return null; }
  return e.data as T;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { ts: Date.now(), data });
}

export async function getExperiences(params: { area?: 'oimachi-line'; onlyAvailable?: boolean }) {
  const key = `experiences:${params.area ?? 'all'}:${params.onlyAvailable ? '1' : '0'}`;
  const hit = getCache<any[]>(key);
  if (hit) return hit;
  // simulate latency
  await new Promise(r => setTimeout(r, 200));
  const data = [
    { id: 'exp_1', title: '1日ロボット教室 体験', providerName: '大井町ロボット教室', priceYen: 1500 },
    { id: 'exp_2', title: '親子で陶芸 60分体験', providerName: '自由が丘 陶芸スタジオ', priceYen: 2000 },
  ];
  setCache(key, data);
  return data;
}


