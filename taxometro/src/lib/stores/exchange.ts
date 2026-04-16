import { writable } from 'svelte/store';
import { fetchExchangeRates } from '$lib/services/bcb';
import { getCached, setCached, getLastCached, EXCHANGE_CACHE_KEY } from '$lib/services/cache';
import defaultRates from '$lib/data/rates.json';

interface ExchangeState {
	jpyToBrl: number;
	jpyToUsd: number;
	usdToBrl: number;
	date: string;
	source: 'bundled' | 'cached' | 'live';
	loading: boolean;
	error: string | null;
}

const initial: ExchangeState = {
	jpyToBrl: defaultRates.exchangeRates.jpyToBrl,
	jpyToUsd: defaultRates.exchangeRates.jpyToUsd,
	usdToBrl: defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd,
	date: defaultRates.exchangeRates.lastUpdated,
	source: 'bundled',
	loading: false,
	error: null
};

export const exchangeStore = writable<ExchangeState>(initial);

export async function refreshExchangeRates(): Promise<void> {
	// Check cache first
	interface CachedRates {
		jpyToBrl: number;
		jpyToUsd: number;
		usdToBrl: number;
		date: string;
	}
	const cached = getCached<CachedRates>(EXCHANGE_CACHE_KEY);
	if (cached) {
		exchangeStore.set({
			...cached,
			source: 'cached',
			loading: false,
			error: null
		});
		return;
	}

	exchangeStore.update((s) => ({ ...s, loading: true, error: null }));

	try {
		const rates = await fetchExchangeRates();
		const state: ExchangeState = {
			jpyToBrl: rates.jpyToBrl,
			jpyToUsd: rates.jpyToUsd,
			usdToBrl: rates.usdToBrl,
			date: rates.date,
			source: 'live',
			loading: false,
			error: null
		};
		exchangeStore.set(state);
		setCached(EXCHANGE_CACHE_KEY, {
			jpyToBrl: rates.jpyToBrl,
			jpyToUsd: rates.jpyToUsd,
			usdToBrl: rates.usdToBrl,
			date: rates.date
		});
	} catch (err) {
		// Try stale cache
		const stale = getLastCached<CachedRates>(EXCHANGE_CACHE_KEY);
		if (stale) {
			exchangeStore.set({
				...stale,
				source: 'cached',
				loading: false,
				error: 'Usando câmbio em cache (sem conexão)'
			});
		} else {
			exchangeStore.update((s) => ({
				...s,
				loading: false,
				error: 'Não foi possível obter o câmbio. Usando valor padrão.'
			}));
		}
	}
}
