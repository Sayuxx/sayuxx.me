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

export type ImportChannel = 'postal_common' | 'remessa_conforme';
export type PaymentMethod = 'br_card' | 'other';

export interface RateTable {
	exchangeRates: {
		jpyToBrl: number;
		jpyToUsd: number;
	};
	taxes: {
		iiPostalCommonRate: number; // 0.60 flat for non-RC postal (Japan Post via Correios)
		iiRateLow: number; // 0.20 for CIF <= USD 50 under Remessa Conforme
		iiRateHigh: number; // 0.60 for CIF > USD 50 under Remessa Conforme
		iiDeductionUSD: number; // 20 USD deduction for high bracket
		cifThresholdUSD: number; // 50
		icmsRate: number; // state ICMS (17% or 20%), resolved per state
		cardIofRate: number; // 0.035 — only applied when paymentMethod === 'br_card'
		despachoPostalBRL: number; // Correios flat fee per package (postal_common only)
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
	totalTaxes: number;
	totalWithTaxes: number;
	immune: boolean;
}

export interface SummaryResult {
	perProduct: TaxBreakdown[];
	packagesCount: number;
	subtotalProductsBRL: number;
	subtotalTaxesBRL: number;
	shippingBRL: number;
	shippingJPY: number;
	despachoPostalBRL: number;
	cardIofBRL: number;
	grandTotalBRL: number;
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
