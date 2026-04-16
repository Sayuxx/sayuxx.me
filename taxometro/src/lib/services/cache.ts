const CACHE_PREFIX = 'taxometro_';
const EXCHANGE_RATE_KEY = `${CACHE_PREFIX}exchange_rates`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData<T> {
	data: T;
	timestamp: number;
}

export function getCached<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;

		const cached: CachedData<T> = JSON.parse(raw);
		const age = Date.now() - cached.timestamp;

		if (age > CACHE_TTL_MS) return null;
		return cached.data;
	} catch {
		return null;
	}
}

export function setCached<T>(key: string, data: T): void {
	try {
		const cached: CachedData<T> = { data, timestamp: Date.now() };
		localStorage.setItem(key, JSON.stringify(cached));
	} catch {
		// localStorage might be full or unavailable
	}
}

export function getLastCached<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const cached: CachedData<T> = JSON.parse(raw);
		return cached.data;
	} catch {
		return null;
	}
}

export function getCacheAge(key: string): number | null {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const cached: CachedData<unknown> = JSON.parse(raw);
		return Date.now() - cached.timestamp;
	} catch {
		return null;
	}
}

export const EXCHANGE_CACHE_KEY = EXCHANGE_RATE_KEY;
