export type ProductCategory =
	| 'electronics'
	| 'figures_toys'
	| 'manga_books'
	| 'clothing'
	| 'cosmetics'
	| 'food'
	| 'games'
	| 'music_media'
	| 'stationery'
	| 'kitchenware'
	| 'health'
	| 'sports'
	| 'accessories'
	| 'other';

export interface Product {
	id: string;
	name: string;
	category: ProductCategory;
	priceJPY: number;
	quantity: number;
	weightGrams: number;
}

export interface RateTable {
	exchangeRates: {
		jpyToBrl: number;
		jpyToUsd: number;
	};
	taxes: {
		iiRateLow: number; // 0.20 for CIF < USD 50
		iiRateHigh: number; // 0.60 for CIF >= USD 50
		iiDeductionUSD: number; // 20
		cifThresholdUSD: number; // 50
		icmsRate: number; // 0.17 (unified under Remessa Conforme)
		iofRate: number; // 0.035
	};
}

export type ShippingMethod = 'ems' | 'airmail';

export interface ShippingRateEntry {
	maxGrams: number;
	priceJPY: number;
}

export interface ShippingTable {
	[method: string]: ShippingRateEntry[];
}

export interface TaxBreakdown {
	productPriceJPY: number;
	productPriceBRL: number;
	cifUSD: number;
	cifBRL: number;
	ii: number;
	icms: number;
	iof: number;
	totalTaxes: number;
	totalWithTaxes: number;
}

export interface ShippingResult {
	method: ShippingMethod;
	costJPY: number;
	costBRL: number;
}

export interface CartSummary {
	products: { product: Product; taxes: TaxBreakdown }[];
	shipping: ShippingResult;
	subtotalProductsBRL: number;
	subtotalTaxesBRL: number;
	shippingBRL: number;
	grandTotalBRL: number;
}
