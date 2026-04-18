const BCB_API = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

interface BcbQuote {
	cotacaoCompra: number;
	cotacaoVenda: number;
	dataHoraCotacao: string;
}

function fmtDate(d: Date): string {
	return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
}

/**
 * Fetch the most recent PTAX quote for a currency from Banco Central do Brasil.
 * Uses a 10-day window backwards from today to absorb weekends and holidays.
 */
async function fetchPtaxLatest(moeda: 'USD' | 'JPY'): Promise<{ rate: number; date: string }> {
	const end = new Date();
	const start = new Date();
	start.setDate(end.getDate() - 10);

	const url =
		`${BCB_API}/CotacaoMoedaPeriodo(moeda=@m,dataInicial=@di,dataFinalCotacao=@df)` +
		`?@m='${moeda}'&@di='${fmtDate(start)}'&@df='${fmtDate(end)}'` +
		`&$orderby=dataHoraCotacao%20desc&$top=1&$format=json`;

	const res = await fetch(url);
	if (!res.ok) throw new Error(`BCB ${moeda}: HTTP ${res.status}`);

	const data = await res.json();
	const quotes: BcbQuote[] = data.value;
	if (!quotes?.length) throw new Error(`BCB ${moeda}: sem cotação`);

	return {
		rate: quotes[0].cotacaoVenda,
		date: quotes[0].dataHoraCotacao.split(' ')[0]
	};
}

/**
 * Fetch JPY→BRL and USD→BRL directly from BCB PTAX.
 * JPY→USD é derivado das duas (sem constante hardcoded).
 */
export async function fetchExchangeRates(): Promise<{
	jpyToBrl: number;
	jpyToUsd: number;
	usdToBrl: number;
	date: string;
}> {
	const [usd, jpy] = await Promise.all([fetchPtaxLatest('USD'), fetchPtaxLatest('JPY')]);

	const usdToBrl = usd.rate;
	const jpyToBrl = jpy.rate;
	const jpyToUsd = jpyToBrl / usdToBrl;

	return { jpyToBrl, jpyToUsd, usdToBrl, date: jpy.date };
}
