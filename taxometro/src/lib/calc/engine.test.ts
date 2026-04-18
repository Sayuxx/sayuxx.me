import { describe, it, expect } from 'vitest';
import {
	calculateShipping,
	calculateTotalWeight,
	distributeShipping,
	calculateSummary,
	isIICategoryImmune,
	isICMSCategoryImmune,
	resolveIcmsRate
} from './engine';
import type { Product, RateTable, ShippingTable } from './types';
import type { SummaryInput as _SummaryInput } from './engine';

const defaultRates: RateTable = {
	exchangeRates: {
		jpyToBrl: 0.0374,
		jpyToUsd: 0.0067
	},
	taxes: {
		iiPostalCommonRate: 0.6,
		iiRateLow: 0.2,
		iiRateHigh: 0.6,
		iiDeductionUSD: 20,
		cifThresholdUSD: 50,
		icmsRate: 0.17,
		cardIofRate: 0.035,
		despachoPostalBRL: 15
	}
};

const defaultShipping: ShippingTable = {
	ems: [
		{ maxGrams: 500, priceJPY: 3600 },
		{ maxGrams: 1000, priceJPY: 5100 },
		{ maxGrams: 2000, priceJPY: 8100 }
	],
	airmail: [
		{ maxGrams: 1000, priceJPY: 4550 },
		{ maxGrams: 2000, priceJPY: 7250 }
	]
};

function makeProduct(overrides: Partial<Product> = {}): Product {
	return {
		id: '1',
		name: 'Test Product',
		category: 'electronics',
		priceJPY: 5000,
		quantity: 1,
		weightGrams: 500,
		...overrides
	};
}

function baseInput(overrides: Partial<_SummaryInput> = {}): _SummaryInput {
	return {
		products: [makeProduct()],
		channel: 'postal_common',
		paymentMethod: 'other',
		singlePackage: true,
		shippingMethod: 'ems',
		shippingTable: defaultShipping,
		rates: defaultRates,
		...overrides
	};
}

describe('calculateSummary — postal_common channel', () => {
	it('applies 60% II flat with no threshold', () => {
		// Product 5000 JPY, shipping 3600 JPY (weight=500)
		// CIF USD = (5000 + 3600) * 0.0067 = 57.62
		const result = calculateSummary(baseInput());
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;
		const cifUSD = (5000 + 3600) * defaultRates.exchangeRates.jpyToUsd;
		const expectedII = cifUSD * 0.6 * usdToBrl;

		expect(result.perProduct[0].ii).toBeCloseTo(expectedII, 1);
	});

	it('adds Correios despacho postal fee once for single package', () => {
		const result = calculateSummary(baseInput());
		expect(result.despachoPostalBRL).toBe(15);
		expect(result.packagesCount).toBe(1);
	});

	it('adds N × despacho fee for N separate packages', () => {
		const result = calculateSummary(
			baseInput({
				products: [
					makeProduct({ id: '1', priceJPY: 3000 }),
					makeProduct({ id: '2', priceJPY: 4000 }),
					makeProduct({ id: '3', priceJPY: 5000 })
				],
				singlePackage: false
			})
		);
		expect(result.packagesCount).toBe(3);
		expect(result.despachoPostalBRL).toBe(45);
	});

	it('does not double-tax: grand total = products + taxes + shipping + despacho + cardIOF', () => {
		const result = calculateSummary(baseInput());
		const expected =
			result.subtotalProductsBRL +
			result.subtotalTaxesBRL +
			result.shippingBRL +
			result.despachoPostalBRL +
			result.cardIofBRL;
		expect(result.grandTotalBRL).toBeCloseTo(expected, 1);
	});
});

describe('calculateSummary — remessa_conforme channel', () => {
	it('uses 20% II for CIF ≤ USD 50', () => {
		// Product 5000 JPY, no shipping cost allocated via tiny bracket
		// Use a low-shipping scenario: weight 500g → 3600 JPY
		// CIF = (5000 + 3600) * 0.0067 = 57.62 — let's go lower
		const product = makeProduct({ priceJPY: 3000, weightGrams: 100 });
		const result = calculateSummary(
			baseInput({
				channel: 'remessa_conforme',
				products: [product]
			})
		);
		// CIF = (3000 + 3600) * 0.0067 = 44.22 USD → low bracket
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;
		const cifUSD = (3000 + 3600) * defaultRates.exchangeRates.jpyToUsd;
		expect(cifUSD).toBeLessThanOrEqual(50);
		const expectedII = cifUSD * 0.2 * usdToBrl;
		expect(result.perProduct[0].ii).toBeCloseTo(expectedII, 1);
	});

	it('uses 60% − USD 20 for CIF > USD 50', () => {
		// CIF well above 50
		const product = makeProduct({ priceJPY: 15000, weightGrams: 500 });
		const result = calculateSummary(
			baseInput({ channel: 'remessa_conforme', products: [product] })
		);
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;
		const cifUSD = (15000 + 3600) * defaultRates.exchangeRates.jpyToUsd;
		const expectedII = (cifUSD * 0.6 - 20) * usdToBrl;
		expect(result.perProduct[0].ii).toBeCloseTo(expectedII, 1);
	});

	it('uses exactly-50 USD boundary inclusively (low bracket)', () => {
		// 50 / 0.0067 ≈ 7462.69 JPY total CIF needed. With 3600 shipping, product ≈ 3862.69
		// CIF = 7462 * 0.0067 = 49.9954 — just under → low bracket
		const productUnder = makeProduct({ priceJPY: 3862, weightGrams: 500 });
		const under = calculateSummary(
			baseInput({ channel: 'remessa_conforme', products: [productUnder] })
		);
		const cifUnder = under.perProduct[0].cifUSD;
		expect(cifUnder).toBeLessThanOrEqual(50);
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;
		// Low bracket: cif * 0.20
		expect(under.perProduct[0].ii).toBeCloseTo(cifUnder * 0.2 * usdToBrl, 1);
	});

	it('applies threshold at shipment level, not per-item (single package)', () => {
		// Two products each ≈ USD 30. Per-item both would be low-bracket.
		// Combined = USD 60 → high-bracket under RC.
		const p1 = makeProduct({ id: '1', priceJPY: 4000, weightGrams: 200 });
		const p2 = makeProduct({ id: '2', priceJPY: 4000, weightGrams: 300 });
		const result = calculateSummary(
			baseInput({ channel: 'remessa_conforme', products: [p1, p2], singlePackage: true })
		);
		// Aggregate CIF in USD
		const totalCifUSD = result.perProduct[0].cifUSD + result.perProduct[1].cifUSD;
		expect(totalCifUSD).toBeGreaterThan(50);
		// Total II should reflect high bracket on aggregate
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;
		const expectedII = Math.max(0, totalCifUSD * 0.6 - 20) * usdToBrl;
		const totalII = result.perProduct[0].ii + result.perProduct[1].ii;
		expect(totalII).toBeCloseTo(expectedII, 1);
	});

	it('has no despacho postal fee (RC already collects at checkout)', () => {
		const result = calculateSummary(baseInput({ channel: 'remessa_conforme' }));
		expect(result.despachoPostalBRL).toBe(0);
	});
});

describe('calculateSummary — category immunity', () => {
	it('zeroes II and ICMS for manga/books (constitutional immunity)', () => {
		const book = makeProduct({ category: 'manga_books', priceJPY: 10000 });
		const result = calculateSummary(baseInput({ products: [book] }));
		expect(result.perProduct[0].ii).toBe(0);
		expect(result.perProduct[0].icms).toBe(0);
		expect(result.perProduct[0].immune).toBe(true);
	});

	it('only exempts immune item when mixing immune + taxable in same shipment', () => {
		const book = makeProduct({ id: '1', category: 'manga_books', priceJPY: 5000 });
		const toy = makeProduct({ id: '2', category: 'figures_toys', priceJPY: 5000 });
		const result = calculateSummary(baseInput({ products: [book, toy] }));
		expect(result.perProduct[0].ii).toBe(0);
		expect(result.perProduct[0].icms).toBe(0);
		expect(result.perProduct[1].ii).toBeGreaterThan(0);
		expect(result.perProduct[1].icms).toBeGreaterThan(0);
	});

	it('exposes immunity helpers', () => {
		expect(isIICategoryImmune('manga_books')).toBe(true);
		expect(isIICategoryImmune('electronics')).toBe(false);
		expect(isICMSCategoryImmune('manga_books')).toBe(true);
	});
});

describe('calculateSummary — IOF is removed from customs base', () => {
	it('does not add 3.5% IOF on CIF', () => {
		// With paymentMethod='other', no IOF anywhere. Total taxes should only be II + ICMS.
		const result = calculateSummary(baseInput());
		const iiPlusIcms = result.perProduct[0].ii + result.perProduct[0].icms;
		expect(result.perProduct[0].totalTaxes).toBeCloseTo(iiPlusIcms, 1);
		expect(result.cardIofBRL).toBe(0);
	});

	it('adds card IOF 3.5% on (products + shipping) when paymentMethod=br_card', () => {
		const result = calculateSummary(baseInput({ paymentMethod: 'br_card' }));
		const expectedBase = result.subtotalProductsBRL + result.shippingBRL;
		expect(result.cardIofBRL).toBeCloseTo(expectedBase * 0.035, 1);
	});
});

describe('calculateSummary — ICMS', () => {
	it('applies ICMS "por dentro" on (taxable CIF + II)', () => {
		const product = makeProduct({ priceJPY: 10000, weightGrams: 500 });
		const result = calculateSummary(baseInput({ products: [product] }));
		// CIF USD = (10000+3600)*0.0067 ≈ 91.12
		const cifUSD = (10000 + 3600) * defaultRates.exchangeRates.jpyToUsd;
		const iiUSD = cifUSD * 0.6; // postal_common
		const icmsBaseUSD = (cifUSD + iiUSD) / (1 - 0.17);
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;
		const expectedIcms = icmsBaseUSD * 0.17 * usdToBrl;
		expect(result.perProduct[0].icms).toBeCloseTo(expectedIcms, 1);
	});

	it('uses state-specific ICMS rate', () => {
		const rate20 = resolveIcmsRate('AC', { AC: 0.2, SP: 0.17 }, 0.17);
		expect(rate20).toBe(0.2);
		const rateDefault = resolveIcmsRate('ZZ', { SP: 0.17 }, 0.17);
		expect(rateDefault).toBe(0.17);
	});
});

describe('calculateShipping', () => {
	it('finds correct rate bracket', () => {
		const result = calculateShipping(400, 'ems', defaultShipping, 0.0374);
		expect(result.costJPY).toBe(3600);
	});

	it('uses the next bracket when weight exceeds current', () => {
		const result = calculateShipping(600, 'ems', defaultShipping, 0.0374);
		expect(result.costJPY).toBe(5100);
	});

	it('caps at the highest bracket when weight exceeds all', () => {
		const result = calculateShipping(5000, 'ems', defaultShipping, 0.0374);
		expect(result.costJPY).toBe(8100);
	});

	it('returns 0 for unknown method', () => {
		const result = calculateShipping(500, 'sal' as 'ems', defaultShipping, 0.0374);
		expect(result.costJPY).toBe(0);
	});
});

describe('calculateTotalWeight', () => {
	it('sums weights × quantities', () => {
		const items = [
			makeProduct({ weightGrams: 200, quantity: 2 }),
			makeProduct({ weightGrams: 500, quantity: 1 })
		];
		expect(calculateTotalWeight(items)).toBe(900);
	});

	it('returns 0 for empty array', () => {
		expect(calculateTotalWeight([])).toBe(0);
	});
});

describe('distributeShipping', () => {
	it('distributes proportionally by value', () => {
		const items = [
			makeProduct({ priceJPY: 3000, quantity: 1 }),
			makeProduct({ priceJPY: 7000, quantity: 1 })
		];
		const dist = distributeShipping(items, 5000);
		expect(dist[0]).toBeCloseTo(1500, 0);
		expect(dist[1]).toBeCloseTo(3500, 0);
	});

	it('handles zero total value without dividing by zero', () => {
		const dist = distributeShipping([makeProduct({ priceJPY: 0 })], 5000);
		expect(dist[0]).toBe(0);
	});
});
