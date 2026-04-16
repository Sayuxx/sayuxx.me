import type { Product, RateTable, TaxBreakdown, ShippingTable, ShippingMethod, ShippingResult } from './types';

/**
 * Calculate the CIF value in USD for a single product (price * quantity converted to USD + shipping portion).
 * shippingPerItemUSD is the shipping cost allocated to this product in USD.
 */
function calculateCifUSD(product: Product, jpyToUsd: number, shippingPerItemUSD: number): number {
	const productValueUSD = (product.priceJPY * product.quantity) * jpyToUsd;
	return productValueUSD + shippingPerItemUSD;
}

/**
 * Calculate Imposto de Importacao based on CIF value and threshold.
 * Under USD 50 (Remessa Conforme): 20%
 * USD 50-3000: 60% minus USD 20 deduction
 */
function calculateII(cifUSD: number, rates: RateTable): number {
	if (cifUSD < rates.taxes.cifThresholdUSD) {
		return cifUSD * rates.taxes.iiRateLow;
	}
	return Math.max(0, cifUSD * rates.taxes.iiRateHigh - rates.taxes.iiDeductionUSD);
}

/**
 * Calculate all taxes for a single product (Remessa Conforme - pessoa física).
 * Only II, ICMS and IOF apply. PIS/COFINS/IPI do not apply to individual imports.
 * ICMS is 17% unified across all states (Convênio ICMS 81/2023).
 * All monetary results are in BRL.
 */
export function calculateTaxes(
	product: Product,
	rates: RateTable,
	shippingPerItemJPY: number = 0
): TaxBreakdown {
	const { jpyToBrl, jpyToUsd } = rates.exchangeRates;
	const icmsRate = rates.taxes.icmsRate;

	const productPriceJPY = product.priceJPY * product.quantity;
	const productPriceBRL = productPriceJPY * jpyToBrl;

	const shippingPerItemUSD = shippingPerItemJPY * jpyToUsd;
	const cifUSD = calculateCifUSD(product, jpyToUsd, shippingPerItemUSD);
	const cifBRL = cifUSD / jpyToUsd * jpyToBrl;

	// Taxes calculated in USD then converted to BRL
	const iiUSD = calculateII(cifUSD, rates);

	// ICMS "por dentro": base = (CIF + II) / (1 - icmsRate)
	const icmsBaseUSD = (cifUSD + iiUSD) / (1 - icmsRate);
	const icmsUSD = icmsBaseUSD * icmsRate;

	// Convert taxes to BRL
	const usdToBrl = jpyToBrl / jpyToUsd;
	const ii = iiUSD * usdToBrl;
	const icms = icmsUSD * usdToBrl;

	// IOF is on the currency conversion (CIF value only, not domestic taxes)
	const iof = cifBRL * rates.taxes.iofRate;

	const totalTaxes = ii + icms + iof;
	const totalWithTaxes = productPriceBRL + totalTaxes;

	return {
		productPriceJPY,
		productPriceBRL: round2(productPriceBRL),
		cifUSD: round2(cifUSD),
		cifBRL: round2(cifBRL),
		ii: round2(ii),
		icms: round2(icms),
		iof: round2(iof),
		totalTaxes: round2(totalTaxes),
		totalWithTaxes: round2(totalWithTaxes)
	};
}

/**
 * Calculate shipping cost for a given total weight and method.
 */
export function calculateShipping(
	totalWeightGrams: number,
	method: ShippingMethod,
	shippingTable: ShippingTable,
	jpyToBrl: number
): ShippingResult {
	const rates = shippingTable[method];
	if (!rates || rates.length === 0) {
		return { method, costJPY: 0, costBRL: 0 };
	}

	// Find the rate bracket for the given weight
	const sorted = [...rates].sort((a, b) => a.maxGrams - b.maxGrams);
	const bracket = sorted.find((r) => totalWeightGrams <= r.maxGrams);

	// If weight exceeds all brackets, use the highest
	const costJPY = bracket ? bracket.priceJPY : sorted[sorted.length - 1].priceJPY;
	const costBRL = round2(costJPY * jpyToBrl);

	return { method, costJPY, costBRL };
}

/**
 * Calculate total weight of products in the cart.
 */
export function calculateTotalWeight(products: Product[]): number {
	return products.reduce((sum, p) => sum + p.weightGrams * p.quantity, 0);
}

/**
 * Distribute shipping cost proportionally across products by their value.
 * Returns shipping cost per product in JPY.
 */
export function distributeShipping(products: Product[], totalShippingJPY: number): number[] {
	const totalValue = products.reduce((sum, p) => sum + p.priceJPY * p.quantity, 0);
	if (totalValue === 0) return products.map(() => 0);
	return products.map((p) => (p.priceJPY * p.quantity / totalValue) * totalShippingJPY);
}

function round2(n: number): number {
	return Math.round(n * 100) / 100;
}
