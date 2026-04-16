import { describe, it, expect } from 'vitest';
import { calculateTaxes, calculateShipping, calculateTotalWeight, distributeShipping } from './engine';
import type { Product, RateTable, ShippingTable } from './types';

const defaultRates: RateTable = {
	exchangeRates: {
		jpyToBrl: 0.0374,
		jpyToUsd: 0.0067
	},
	taxes: {
		iiRateLow: 0.20,
		iiRateHigh: 0.60,
		iiDeductionUSD: 20,
		cifThresholdUSD: 50,
		icmsRate: 0.17,
		iofRate: 0.035
	}
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

describe('calculateTaxes', () => {
	it('should calculate taxes for a product under USD 50 threshold', () => {
		// 5000 JPY * 0.0067 = 33.5 USD (under 50 threshold)
		const product = makeProduct({ priceJPY: 5000 });
		const result = calculateTaxes(product, defaultRates);

		expect(result.productPriceJPY).toBe(5000);
		expect(result.productPriceBRL).toBe(187); // 5000 * 0.0374
		expect(result.cifUSD).toBe(33.5); // 5000 * 0.0067
		expect(result.ii).toBeGreaterThan(0);
		expect(result.totalTaxes).toBeGreaterThan(0);
		expect(result.totalWithTaxes).toBeGreaterThan(result.productPriceBRL);
	});

	it('should use 20% II rate for CIF under USD 50', () => {
		const product = makeProduct({ priceJPY: 5000 }); // 33.5 USD
		const result = calculateTaxes(product, defaultRates);
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;

		// II should be CIF * 20% = 33.5 * 0.20 = 6.70 USD
		const expectedIIusd = 33.5 * 0.20;
		expect(result.ii).toBeCloseTo(expectedIIusd * usdToBrl, 1);
	});

	it('should use 60% II rate minus USD 20 for CIF over USD 50', () => {
		// 10000 JPY * 0.0067 = 67 USD (over 50 threshold)
		const product = makeProduct({ priceJPY: 10000 });
		const result = calculateTaxes(product, defaultRates);
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;

		// II should be CIF * 60% - 20 = 67 * 0.60 - 20 = 20.2 USD
		const expectedIIusd = 67 * 0.60 - 20;
		expect(result.ii).toBeCloseTo(expectedIIusd * usdToBrl, 1);
	});

	it('should handle the boundary at exactly USD 50', () => {
		// 7462 JPY * 0.0067 = 49.9954 USD (under)
		const productUnder = makeProduct({ priceJPY: 7462 });
		const resultUnder = calculateTaxes(productUnder, defaultRates);

		// 7500 JPY * 0.0067 = 50.25 USD (over)
		const productOver = makeProduct({ priceJPY: 7500 });
		const resultOver = calculateTaxes(productOver, defaultRates);

		// The one over threshold should have higher II rate
		expect(resultOver.ii).toBeGreaterThan(resultUnder.ii);
	});

	it('should calculate ICMS at unified 17% using por-dentro method', () => {
		const product = makeProduct({ priceJPY: 10000 }); // 67 USD
		const result = calculateTaxes(product, defaultRates);
		const usdToBrl = defaultRates.exchangeRates.jpyToBrl / defaultRates.exchangeRates.jpyToUsd;

		// ICMS base = (CIF + II) / (1 - 0.17), ICMS = base * 0.17
		const cifUSD = 67;
		const iiUSD = cifUSD * 0.60 - 20; // 20.2
		const icmsBaseUSD = (cifUSD + iiUSD) / (1 - 0.17);
		const expectedIcms = icmsBaseUSD * 0.17 * usdToBrl;

		expect(result.icms).toBeCloseTo(expectedIcms, 1);
	});

	it('should calculate IOF on CIF value only', () => {
		const product = makeProduct({ priceJPY: 10000 });
		const result = calculateTaxes(product, defaultRates);

		expect(result.iof).toBeGreaterThan(0);
		// IOF should be 3.5% of CIF in BRL (currency conversion tax, not domestic taxes)
		expect(result.iof).toBeCloseTo(result.cifBRL * 0.035, 2);
	});

	it('should handle quantity > 1', () => {
		const product1 = makeProduct({ priceJPY: 5000, quantity: 1 });
		const product2 = makeProduct({ priceJPY: 5000, quantity: 3 });
		const result1 = calculateTaxes(product1, defaultRates);
		const result2 = calculateTaxes(product2, defaultRates);

		expect(result2.productPriceBRL).toBe(result1.productPriceBRL * 3);
	});

	it('should include shipping in CIF when provided', () => {
		const product = makeProduct({ priceJPY: 5000 });
		const resultNoShipping = calculateTaxes(product, defaultRates, 0);
		const resultWithShipping = calculateTaxes(product, defaultRates, 3600);

		expect(resultWithShipping.cifUSD).toBeGreaterThan(resultNoShipping.cifUSD);
		expect(resultWithShipping.totalTaxes).toBeGreaterThan(resultNoShipping.totalTaxes);
	});

	it('should only include II, ICMS, and IOF in total taxes', () => {
		const product = makeProduct({ priceJPY: 10000 });
		const result = calculateTaxes(product, defaultRates);

		// totalTaxes should equal ii + icms + iof
		expect(result.totalTaxes).toBeCloseTo(result.ii + result.icms + result.iof, 2);
	});

	it('should not have pis, cofins, or ipi fields', () => {
		const product = makeProduct({ priceJPY: 10000 });
		const result = calculateTaxes(product, defaultRates);

		expect(result).not.toHaveProperty('pis');
		expect(result).not.toHaveProperty('cofins');
		expect(result).not.toHaveProperty('ipi');
	});
});

describe('calculateShipping', () => {
	const shippingTable: ShippingTable = {
		ems: [
			{ maxGrams: 500, priceJPY: 3600 },
			{ maxGrams: 1000, priceJPY: 4850 },
			{ maxGrams: 2000, priceJPY: 7450 }
		],
		sal: [
			{ maxGrams: 500, priceJPY: 1680 },
			{ maxGrams: 1000, priceJPY: 2380 }
		]
	};

	it('should find correct rate bracket for weight', () => {
		const result = calculateShipping(400, 'ems', shippingTable, 0.0374);
		expect(result.costJPY).toBe(3600);
		expect(result.costBRL).toBeCloseTo(134.64, 1);
	});

	it('should use next bracket when weight exceeds current', () => {
		const result = calculateShipping(600, 'ems', shippingTable, 0.0374);
		expect(result.costJPY).toBe(4850);
	});

	it('should use highest bracket when weight exceeds all', () => {
		const result = calculateShipping(5000, 'ems', shippingTable, 0.0374);
		expect(result.costJPY).toBe(7450);
	});

	it('should return 0 for unknown method', () => {
		const result = calculateShipping(500, 'airmail', shippingTable, 0.0374);
		expect(result.costJPY).toBe(0);
	});
});

describe('calculateTotalWeight', () => {
	it('should sum weights with quantities', () => {
		const products = [
			makeProduct({ weightGrams: 200, quantity: 2 }),
			makeProduct({ weightGrams: 500, quantity: 1 })
		];
		expect(calculateTotalWeight(products)).toBe(900);
	});

	it('should return 0 for empty array', () => {
		expect(calculateTotalWeight([])).toBe(0);
	});
});

describe('distributeShipping', () => {
	it('should distribute proportionally by value', () => {
		const products = [
			makeProduct({ priceJPY: 3000, quantity: 1 }),
			makeProduct({ priceJPY: 7000, quantity: 1 })
		];
		const distribution = distributeShipping(products, 5000);

		expect(distribution[0]).toBeCloseTo(1500, 0); // 3000/10000 * 5000
		expect(distribution[1]).toBeCloseTo(3500, 0); // 7000/10000 * 5000
	});

	it('should handle zero total value', () => {
		const products = [makeProduct({ priceJPY: 0 })];
		const distribution = distributeShipping(products, 5000);
		expect(distribution[0]).toBe(0);
	});
});
