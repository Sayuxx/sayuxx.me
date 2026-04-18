import type {
	ImportChannel,
	PaymentMethod,
	Product,
	ProductCategory,
	RateTable,
	ShippingMethod,
	ShippingResult,
	ShippingTable,
	SummaryResult,
	TaxBreakdown
} from './types';

/**
 * Constitutional immunity: livros, jornais, periódicos (CF art. 150 VI d).
 * Mangás e light novels são livros para efeito fiscal (Lei 10.753/2003).
 */
const II_IMMUNE_CATEGORIES: ReadonlySet<ProductCategory> = new Set(['manga_books']);
const ICMS_IMMUNE_CATEGORIES: ReadonlySet<ProductCategory> = new Set(['manga_books']);

export function isIICategoryImmune(category: ProductCategory): boolean {
	return II_IMMUNE_CATEGORIES.has(category);
}

export function isICMSCategoryImmune(category: ProductCategory): boolean {
	return ICMS_IMMUNE_CATEGORIES.has(category);
}

/**
 * Resolve the ICMS rate for a given state, falling back to the default rate.
 */
export function resolveIcmsRate(
	state: string,
	icmsByState: Record<string, number> | undefined,
	defaultRate: number
): number {
	return icmsByState?.[state] ?? defaultRate;
}

/**
 * Calculate II on a shipment's taxable (non-immune) CIF in USD.
 *
 * postal_common (Japan Post → Correios): 60% flat, sem threshold ou dedução.
 * remessa_conforme: 20% até USD 50, ou 60% − USD 20 acima disso.
 */
function calculateII(taxableCifUSD: number, channel: ImportChannel, rates: RateTable): number {
	if (taxableCifUSD <= 0) return 0;
	if (channel === 'postal_common') {
		return taxableCifUSD * rates.taxes.iiPostalCommonRate;
	}
	if (taxableCifUSD <= rates.taxes.cifThresholdUSD) {
		return taxableCifUSD * rates.taxes.iiRateLow;
	}
	return Math.max(0, taxableCifUSD * rates.taxes.iiRateHigh - rates.taxes.iiDeductionUSD);
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

	const sorted = [...rates].sort((a, b) => a.maxGrams - b.maxGrams);
	const bracket = sorted.find((r) => totalWeightGrams <= r.maxGrams);

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
 */
export function distributeShipping(products: Product[], totalShippingJPY: number): number[] {
	const totalValue = products.reduce((sum, p) => sum + p.priceJPY * p.quantity, 0);
	if (totalValue === 0) return products.map(() => 0);
	return products.map((p) => ((p.priceJPY * p.quantity) / totalValue) * totalShippingJPY);
}

/**
 * Calculate shipping when each product line travels as its own package.
 */
export function calculateSeparateShipping(
	products: Product[],
	method: ShippingMethod,
	shippingTable: ShippingTable,
	jpyToBrl: number
): ShippingResult & { perProductJPY: number[] } {
	const perProductJPY = products.map(
		(p) => calculateShipping(p.weightGrams * p.quantity, method, shippingTable, jpyToBrl).costJPY
	);
	const costJPY = perProductJPY.reduce((sum, c) => sum + c, 0);
	return {
		method,
		costJPY,
		costBRL: round2(costJPY * jpyToBrl),
		perProductJPY
	};
}

interface ShipmentTaxInput {
	products: Product[];
	shippingJPY: number;
	rates: RateTable;
	channel: ImportChannel;
}

interface ShipmentTaxResult {
	perProduct: TaxBreakdown[];
	iiBRL: number;
	icmsBRL: number;
	taxableCifUSD: number;
	totalCifUSD: number;
}

/**
 * Apply RTS-correct tax calculation for a single shipment:
 *  - Aggregate CIF (products + shipping) in USD
 *  - Taxable CIF excludes categorically immune products
 *  - II computed once on taxable CIF (threshold applies to the shipment, not per item)
 *  - ICMS "por dentro" on (taxable CIF + II)
 *  - Both taxes distributed per non-immune product proportionally to their CIF
 */
function calculateShipmentTaxes(input: ShipmentTaxInput): ShipmentTaxResult {
	const { products, shippingJPY, rates, channel } = input;
	const { jpyToBrl, jpyToUsd } = rates.exchangeRates;
	const usdToBrl = jpyToUsd > 0 ? jpyToBrl / jpyToUsd : 0;
	const icmsRate = rates.taxes.icmsRate;

	const shippingAllocJPY = distributeShipping(products, shippingJPY);

	const perProductCifUSD = products.map((p, i) => {
		const productValueUSD = p.priceJPY * p.quantity * jpyToUsd;
		const shippingUSD = shippingAllocJPY[i] * jpyToUsd;
		return productValueUSD + shippingUSD;
	});

	const totalCifUSD = perProductCifUSD.reduce((s, c) => s + c, 0);
	const taxableCifUSD = products.reduce(
		(s, p, i) => (isIICategoryImmune(p.category) ? s : s + perProductCifUSD[i]),
		0
	);

	const iiUSD = calculateII(taxableCifUSD, channel, rates);

	const icmsTaxableBaseUSD = products.reduce(
		(s, p, i) => (isICMSCategoryImmune(p.category) ? s : s + perProductCifUSD[i]),
		0
	);
	const icmsBaseUSD =
		icmsRate > 0 && icmsTaxableBaseUSD > 0
			? (icmsTaxableBaseUSD + iiUSD) / (1 - icmsRate)
			: 0;
	const icmsUSD = icmsBaseUSD * icmsRate;

	const perProduct: TaxBreakdown[] = products.map((p, i) => {
		const cifUSD = perProductCifUSD[i];
		const cifBRL = cifUSD * usdToBrl;
		const productPriceJPY = p.priceJPY * p.quantity;
		const productPriceBRL = productPriceJPY * jpyToBrl;

		const iiImmune = isIICategoryImmune(p.category);
		const icmsImmune = isICMSCategoryImmune(p.category);

		const iiShare = !iiImmune && taxableCifUSD > 0 ? cifUSD / taxableCifUSD : 0;
		const icmsShare = !icmsImmune && icmsTaxableBaseUSD > 0 ? cifUSD / icmsTaxableBaseUSD : 0;

		const iiPortionBRL = iiUSD * iiShare * usdToBrl;
		const icmsPortionBRL = icmsUSD * icmsShare * usdToBrl;

		const totalTaxes = iiPortionBRL + icmsPortionBRL;
		const totalWithTaxes = productPriceBRL + totalTaxes;

		return {
			productPriceJPY,
			productPriceBRL: round2(productPriceBRL),
			cifUSD: round2(cifUSD),
			cifBRL: round2(cifBRL),
			ii: round2(iiPortionBRL),
			icms: round2(icmsPortionBRL),
			totalTaxes: round2(totalTaxes),
			totalWithTaxes: round2(totalWithTaxes),
			immune: iiImmune && icmsImmune
		};
	});

	return {
		perProduct,
		iiBRL: round2(iiUSD * usdToBrl),
		icmsBRL: round2(icmsUSD * usdToBrl),
		taxableCifUSD: round2(taxableCifUSD),
		totalCifUSD: round2(totalCifUSD)
	};
}

export interface SummaryInput {
	products: Product[];
	channel: ImportChannel;
	paymentMethod: PaymentMethod;
	singlePackage: boolean;
	shippingMethod: ShippingMethod;
	shippingTable: ShippingTable;
	rates: RateTable;
}

/**
 * Top-level summary:
 *  - Builds one shipment (singlePackage) or one shipment per product line (separate)
 *  - Sums shipping across shipments
 *  - Applies RTS-correct taxes per shipment
 *  - Adds Correios Despacho Postal (flat, per package, postal_common only)
 *  - Adds IOF-cartão 3.5% on (produtos + frete) when paymentMethod === 'br_card'
 */
export function calculateSummary(input: SummaryInput): SummaryResult {
	const { products, channel, paymentMethod, singlePackage, rates } = input;
	const { jpyToBrl } = rates.exchangeRates;

	const shipments: Product[][] = singlePackage ? [products] : products.map((p) => [p]);

	const perProduct = new Array<TaxBreakdown>(products.length);
	let shippingJPY = 0;
	let subtotalProductsBRL = 0;
	let subtotalTaxesBRL = 0;

	for (const shipment of shipments) {
		const weight = calculateTotalWeight(shipment);
		const shipping = calculateShipping(
			weight,
			input.shippingMethod,
			input.shippingTable,
			jpyToBrl
		);
		shippingJPY += shipping.costJPY;

		const taxes = calculateShipmentTaxes({
			products: shipment,
			shippingJPY: shipping.costJPY,
			rates,
			channel
		});

		for (let j = 0; j < shipment.length; j++) {
			const origIndex = products.indexOf(shipment[j]);
			perProduct[origIndex] = taxes.perProduct[j];
			subtotalProductsBRL += taxes.perProduct[j].productPriceBRL;
			subtotalTaxesBRL += taxes.perProduct[j].totalTaxes;
		}
	}

	const shippingBRL = round2(shippingJPY * jpyToBrl);

	const despachoPostalBRL =
		channel === 'postal_common' && products.length > 0
			? round2(shipments.length * rates.taxes.despachoPostalBRL)
			: 0;

	const cardIofBase = subtotalProductsBRL + shippingBRL;
	const cardIofBRL =
		paymentMethod === 'br_card' ? round2(cardIofBase * rates.taxes.cardIofRate) : 0;

	const grandTotalBRL = round2(
		subtotalProductsBRL + subtotalTaxesBRL + shippingBRL + despachoPostalBRL + cardIofBRL
	);

	return {
		perProduct,
		packagesCount: products.length === 0 ? 0 : shipments.length,
		subtotalProductsBRL: round2(subtotalProductsBRL),
		subtotalTaxesBRL: round2(subtotalTaxesBRL),
		shippingBRL,
		shippingJPY,
		despachoPostalBRL,
		cardIofBRL,
		grandTotalBRL
	};
}

function round2(n: number): number {
	return Math.round(n * 100) / 100;
}
