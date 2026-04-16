const BCB_API = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

interface BcbQuote {
	cotacaoCompra: number;
	cotacaoVenda: number;
	dataHoraCotacao: string;
}

/**
 * Fetch the latest USD→BRL exchange rate from Banco Central do Brasil.
 * Returns the sell rate (cotacaoVenda).
 */
async function fetchUsdToBrl(): Promise<{ rate: number; date: string }> {
	const today = new Date();
	// BCB API requires MM-DD-YYYY format
	const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

	const url = `${BCB_API}/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dateStr}'&$format=json`;

	const res = await fetch(url);
	if (!res.ok) throw new Error(`BCB API error: ${res.status}`);

	const data = await res.json();
	const quotes: BcbQuote[] = data.value;

	if (quotes.length === 0) {
		// No quote for today (weekend/holiday) — try last 5 business days
		return fetchLatestUsdToBrl();
	}

	const latest = quotes[quotes.length - 1];
	return {
		rate: latest.cotacaoVenda,
		date: latest.dataHoraCotacao.split(' ')[0]
	};
}

async function fetchLatestUsdToBrl(): Promise<{ rate: number; date: string }> {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(endDate.getDate() - 7);

	const fmt = (d: Date) =>
		`${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;

	const url = `${BCB_API}/CotacaoDolarPeriodo(dataInicial=@di,dataFinalCotacao=@df)?@di='${fmt(startDate)}'&@df='${fmt(endDate)}'&$orderby=dataHoraCotacao%20desc&$top=1&$format=json`;

	const res = await fetch(url);
	if (!res.ok) throw new Error(`BCB API error: ${res.status}`);

	const data = await res.json();
	const quotes: BcbQuote[] = data.value;

	if (quotes.length === 0) {
		throw new Error('No exchange rate data available from BCB');
	}

	return {
		rate: quotes[0].cotacaoVenda,
		date: quotes[0].dataHoraCotacao.split(' ')[0]
	};
}

/**
 * Fetch JPY→BRL rate.
 * BCB only provides USD→BRL directly, so we also need JPY→USD.
 * We use a fixed approximate JPY→USD rate and derive JPY→BRL from USD→BRL.
 * For more precision, a forex API could be used in v2.
 */
export async function fetchExchangeRates(): Promise<{
	jpyToBrl: number;
	jpyToUsd: number;
	usdToBrl: number;
	date: string;
}> {
	const { rate: usdToBrl, date } = await fetchUsdToBrl();

	// Approximate JPY→USD (updated less frequently, but stable enough)
	// 1 USD ≈ 149 JPY → 1 JPY ≈ 0.0067 USD
	const jpyToUsd = 1 / 149;
	const jpyToBrl = jpyToUsd * usdToBrl;

	return { jpyToBrl, jpyToUsd, usdToBrl, date };
}
